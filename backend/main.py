"""
main.py - Nexus AI FastAPI Backend

ENDPOINTS
---------
GET  /health                -> Server health, uptime, Gemini status
GET  /api/status            -> Dashboard metrics
GET  /api/leads             -> All leads with full data
GET  /api/logs              -> Recent log entries (REST fallback)
GET  /api/audit             -> Full agent audit trail
GET  /api/analytics         -> Pipeline analytics, ICP scores, RAG hit rate
POST /api/config            -> Save Gemini API key
POST /api/upload            -> Upload and index PDF knowledge base (max 10MB)
POST /api/run-swarm         -> Execute one agent step (Hunter->Guardian->Professor->Closer)
POST /api/reset             -> Reset all state and clear DB
GET  /api/export/csv        -> Download leads as CSV
GET  /api/export/audit      -> Download audit trail as JSON
WS   /ws/logs               -> WebSocket real-time log streaming
"""

import asyncio
import csv
import io
import json
import os
import random
import re
import sqlite3
import time
from datetime import datetime
from typing import Set

START_TIME = time.time()

from dotenv import load_dotenv
load_dotenv()

import PyPDF2
import google.generativeai as genai
from fastapi import FastAPI, File, HTTPException, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel

# ---------------------------------------------------------------------------
# APP SETUP
# ---------------------------------------------------------------------------

app = FastAPI(title="Nexus AI Backend", version=os.getenv("APP_VERSION", "2.0.0"))

origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Catch-all: log and return structured 500 so the frontend never gets an empty body."""
    try:
        add_log("SYSTEM", f"Server error on {request.url.path}: {str(exc)[:80]}", "error")
    except Exception:
        pass
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "message": str(exc)[:100]},
    )

# ---------------------------------------------------------------------------
# SHARED STATE
# ---------------------------------------------------------------------------

def _initial_leads():
    return [
        {
            "id": "L-101", "company": "Vizag Pharma", "role": "CISO",
            "location": "Visakhapatnam", "employees": 1200, "budget": "150",
            "status": "New", "icp_score": 0, "safety_check": "Pending",
            "last_log": "", "score_breakdown": "",
            "email_body": "", "email_generated_at": "",
        },
        {
            "id": "L-102", "company": "Hyderabad FinTech", "role": "CTO",
            "location": "Hyderabad", "employees": 3500, "budget": "400",
            "status": "New", "icp_score": 0, "safety_check": "Pending",
            "last_log": "", "score_breakdown": "",
            "email_body": "", "email_generated_at": "",
        },
        {
            "id": "L-103", "company": "Bengaluru CloudCo", "role": "VP Engineering",
            "location": "Bengaluru", "employees": 800, "budget": "200",
            "status": "New", "icp_score": 0, "safety_check": "Pending",
            "last_log": "", "score_breakdown": "",
            "email_body": "", "email_generated_at": "",
        },
        {
            "id": "L-104", "company": "Chennai Logistics", "role": "IT Director",
            "location": "Chennai", "employees": 600, "budget": "100",
            "status": "New", "icp_score": 0, "safety_check": "Pending",
            "last_log": "", "score_breakdown": "",
            "email_body": "", "email_generated_at": "",
        },
    ]


state = {
    "leads":          _initial_leads(),
    "logs":           [],
    "pdf_text":       "",
    "gemini_api_key": os.getenv("GEMINI_API_KEY", ""),
    "audit_trail":    [],
    "mode":           "Simulation",
}

# ---------------------------------------------------------------------------
# SQLITE PERSISTENCE
# ---------------------------------------------------------------------------

DB_PATH = "nexus.db"


def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""CREATE TABLE IF NOT EXISTS app_state (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )""")
    conn.commit()
    conn.close()


def save_state_to_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    for key in ["leads", "logs", "audit_trail"]:
        c.execute(
            "INSERT OR REPLACE INTO app_state (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)",
            (key, json.dumps(state[key])),
        )
    conn.commit()
    conn.close()


def load_state_from_db():
    if not os.path.exists(DB_PATH):
        return False
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    for key in ["leads", "logs", "audit_trail"]:
        row = c.execute("SELECT value FROM app_state WHERE key=?", (key,)).fetchone()
        if row:
            state[key] = json.loads(row[0])
    conn.close()
    return True

# ---------------------------------------------------------------------------
# WEBSOCKET MANAGER
# ---------------------------------------------------------------------------


class ConnectionManager:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.discard(websocket)

    async def broadcast(self, message: dict):
        dead = set()
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except Exception:
                dead.add(connection)
        self.active_connections -= dead


manager = ConnectionManager()

# ---------------------------------------------------------------------------
# LOGGING HELPERS
# ---------------------------------------------------------------------------


def _now():
    return datetime.now().strftime("%H:%M:%S")


def add_log(agent: str, message: str, type_: str = "info"):
    entry = {"time": _now(), "agent": agent, "message": message, "type": type_}
    state["logs"].insert(0, entry)
    state["logs"] = state["logs"][:200]
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            asyncio.ensure_future(manager.broadcast({"type": "new_log", "log": entry}))
    except Exception:
        pass

# ---------------------------------------------------------------------------
# STARTUP
# ---------------------------------------------------------------------------


@app.on_event("startup")
async def startup():
    init_db()
    load_state_from_db()
    add_log("SYSTEM", "Nexus AI Backend online - agents ready", "info")

# ---------------------------------------------------------------------------
# WEBSOCKET ENDPOINT
# ---------------------------------------------------------------------------


@app.websocket("/ws/logs")
async def websocket_logs(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        await websocket.send_text(json.dumps({"type": "init", "logs": state["logs"]}))
        while True:
            await asyncio.sleep(15)
            await websocket.send_text(json.dumps({"type": "ping"}))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)

# ---------------------------------------------------------------------------
# AGENT: HUNTER
# ---------------------------------------------------------------------------


def run_hunter():
    for lead in state["leads"]:
        if lead["status"] == "New":
            role_weights = {
                "CISO": 100, "CTO": 95, "IT Director": 80,
                "VP Engineering": 85, "Security Manager": 70,
            }
            role_score = role_weights.get(lead["role"], 60)

            location_weights = {
                "Hyderabad": 100, "Visakhapatnam": 88, "Vijayawada": 78,
                "Andhra Pradesh": 72, "Chennai": 85, "Bengaluru": 95,
            }
            loc_score = location_weights.get(lead["location"], 65)

            emp = lead.get("employees", 500)
            if emp >= 2000:   emp_score = 100
            elif emp >= 1000: emp_score = 85
            elif emp >= 500:  emp_score = 70
            else:             emp_score = 55

            budget_num = int(re.sub(r"[^\d]", "", str(lead.get("budget", "0"))) or "0")
            if budget_num >= 400:   budget_score = 100
            elif budget_num >= 200: budget_score = 85
            elif budget_num >= 100: budget_score = 70
            else:                   budget_score = 55

            icp_score = round(
                0.3 * role_score + 0.3 * loc_score +
                0.2 * emp_score + 0.2 * budget_score
            )
            breakdown = (
                f"Role:{role_score} | Loc:{loc_score} | "
                f"Emp:{emp_score} | Budget:{budget_score} -> ICP:{icp_score}"
            )

            lead["icp_score"] = icp_score
            lead["score_breakdown"] = breakdown
            lead["status"] = "Scored"
            lead["last_log"] = f"ICP Score: {icp_score}%"

            add_log("HUNTER", f"Scored {lead['company']} [{lead['location']}] - ICP {icp_score}% | {breakdown}", "hunter")
            save_state_to_db()
            return {"agent": "hunter", "lead": lead["company"], "score": icp_score}
    return None

# ---------------------------------------------------------------------------
# AGENT: GUARDIAN
# ---------------------------------------------------------------------------


def run_guardian():
    for lead in state["leads"]:
        if lead["status"] == "Scored" and lead["safety_check"] == "Pending":
            checks = []
            passed = 0

            # CHECK 1: PII Scan
            lead_str = str(lead)
            pii_patterns = [
                r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
                r'\b\d{10}\b',
                r'\b\d{12}\b',
                r'\b[0-9]{16}\b',
            ]
            pii_found = any(re.search(p, lead_str) for p in pii_patterns)
            ok = not pii_found
            checks.append({"check": "PII Scan", "passed": ok, "detail": "No PII" if ok else "PII FOUND"})
            if ok: passed += 1

            # CHECK 2: Score bias
            all_scores = [l["icp_score"] for l in state["leads"] if l["icp_score"] > 0]
            avg = sum(all_scores) / len(all_scores) if all_scores else 0
            ok = abs(lead["icp_score"] - avg) < 40
            checks.append({"check": "Bias Check", "passed": ok, "detail": f"Score {lead['icp_score']} vs avg {avg:.0f}"})
            if ok: passed += 1

            # CHECK 3: Location whitelist
            allowed = ["Hyderabad", "Visakhapatnam", "Vijayawada", "Chennai", "Bengaluru", "Andhra Pradesh"]
            ok = lead["location"] in allowed
            checks.append({"check": "Location Whitelist", "passed": ok, "detail": lead["location"]})
            if ok: passed += 1

            # CHECK 4: Budget sanity
            budget_num = int(re.sub(r"[^\d]", "", str(lead.get("budget", "0"))) or "0")
            ok = 50 <= budget_num <= 600
            checks.append({"check": "Budget Sanity", "passed": ok, "detail": f"{budget_num}L"})
            if ok: passed += 1

            # CHECK 5: Role authority
            senior = ["CISO", "CTO", "VP Engineering", "IT Director", "Security Manager", "CEO", "COO"]
            ok = lead["role"] in senior
            checks.append({"check": "Role Authority", "passed": ok, "detail": lead["role"]})
            if ok: passed += 1

            result = "Passed" if passed >= 4 else "Failed"
            lead["safety_check"] = result
            if result == "Passed":
                lead["status"] = "Nurtured"
                lead["last_log"] = f"Guardian: {passed}/5 checks passed"
            else:
                lead["last_log"] = f"Guardian: only {passed}/5 checks passed"

            bias_score = round(abs(lead["icp_score"] - avg), 1)
            lead["audit_report"] = {
                "checks": checks, "passed": passed, "total": 5,
                "bias_score": bias_score, "timestamp": datetime.now().isoformat(),
            }

            add_log("GUARDIAN", f"Compliance Audit: {lead['company']} | {passed}/5 checks | Bias:{bias_score} | {result.upper()}", "guardian")
            state["audit_trail"].append({
                "time": datetime.now().isoformat(),
                "agent": "Guardian",
                "action": f"Compliance {result}",
                "target": lead["company"],
                "detail": f"{passed}/5, bias:{bias_score}",
            })
            save_state_to_db()
            return {"agent": "guardian", "lead": lead["company"], "status": result}
    return None

# ---------------------------------------------------------------------------
# AGENT: PROFESSOR
# ---------------------------------------------------------------------------


def run_professor():
    ready = [l for l in state["leads"] if l["status"] == "Scored" and l["safety_check"] == "Passed"]
    if not ready:
        return None

    lead = ready[0]
    loc = (lead.get("location") or "").strip()
    if not loc:
        add_log("PROFESSOR", f"Skipping lead with empty location: {lead.get('company', '?')}", "error")
        return None

    pdf_text = state["pdf_text"] or ""

    # RAG context lookup
    context = "General Cyber Security"
    rag_status = "RAG MISS"
    if loc and loc in pdf_text:
        start = pdf_text.find(loc)
        context = pdf_text[start: start + 300]
        rag_status = "RAG HIT"

    # Subject generation
    subject = ""
    if state["gemini_api_key"]:
        try:
            genai.configure(api_key=state["gemini_api_key"])
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = (
                f'CONTEXT: "{context}"\n'
                f"Write a 4-word urgent email subject for a {lead['role']} in {loc}. "
                "Tone: Professional Security Alert."
            )
            subject = model.generate_content(prompt).text.strip()
        except Exception as e:
            add_log("PROFESSOR", f"Gemini error: {str(e)[:60]}. Using simulation.", "error")
            subject = f"Urgent: {loc} Cyber Security Update"
    else:
        templates = [
            f"Critical: {loc} Infrastructure Risk",
            f"Alert: New Threat Targeting {loc}",
            f"Urgent: Patch Required for {loc} Nodes",
            f"Security Notice: {loc} Sector Vulnerability",
        ]
        subject = random.choice(templates) if rag_status == "RAG HIT" else f"Urgent: {loc} Cyber Security Update"

    # Email body generation
    email_body = ""
    if state["gemini_api_key"]:
        try:
            body_prompt = (
                f'CONTEXT: "{context}"\n'
                f"RECIPIENT: {lead['role']} at {lead['company']}, {lead['location']}\n"
                f"COMPANY SIZE: {lead['employees']} employees, Budget: {lead['budget']}L\n"
                f"SUBJECT: {subject}\n\n"
                "Write a 3-paragraph cold email (max 120 words). "
                "P1: location-specific cyber threat. P2: NexusAI solution. P3: 15-min demo CTA. "
                "Return ONLY the body, no subject/greeting/signature."
            )
            email_body = genai.GenerativeModel("gemini-1.5-flash").generate_content(body_prompt).text.strip()
        except Exception:
            email_body = _fallback_body(lead, loc)
    else:
        email_body = _fallback_body(lead, loc)

    lead["status"] = "Nurtured"
    lead["last_log"] = subject
    lead["email_body"] = email_body
    lead["email_generated_at"] = datetime.now().isoformat()

    add_log("PROFESSOR", f"{rag_status} | Email for {lead['company']}: \"{subject}\"", "professor")
    state["audit_trail"].append({
        "time": _now(), "agent": "Professor",
        "action": "Content Gen", "target": lead["company"],
    })
    save_state_to_db()
    return {"agent": "professor", "lead": lead["company"], "subject": subject}


def _fallback_body(lead, loc):
    templates = {
        "Hyderabad": (
            "Our threat intelligence shows a 340% spike in ransomware attacks targeting "
            "Hyderabad FinTech firms in Q1 2025. Your sector is in the crosshairs.\n\n"
            "NexusAI's Guardian Agent auto-remediates compliance gaps common to "
            f"{lead['employees']}-employee enterprises at your budget tier.\n\n"
            "I'd love to walk you through a 15-minute live demo. Does Thursday work?"
        ),
        "Visakhapatnam": (
            "Port-adjacent pharma companies in Visakhapatnam are facing a new wave of "
            "supply chain attacks in 2025. Your sector is Tier-1 risk.\n\n"
            f"NexusAI monitors 1,200+ threat vectors in real-time for your "
            f"{lead['employees']}-person team — zero manual intervention needed.\n\n"
            "I'd love to demo how we've protected similar Vizag enterprises. Free 15 minutes?"
        ),
        "Bengaluru": (
            "Cloud-native companies in Bengaluru saw a 280% increase in API-layer attacks "
            "in Q4 2025. Your stack is in the highest-risk category.\n\n"
            f"NexusAI's Professor Agent auto-generates compliance reports — saving your "
            f"{lead['employees']}-person team 12 hours/week.\n\n"
            "Quick 15-minute demo this week? I'll show you live threat data from your sector."
        ),
        "Chennai": (
            "Chennai's logistics sector has seen 3 major data breaches in 90 days. "
            "Our AI flagged your vendor network as a critical exposure point.\n\n"
            "NexusAI's 4-agent swarm locks down supply chain risk automatically with "
            "full audit trails your compliance team will love.\n\n"
            "I'd love to show you a 15-minute demo tailored to logistics security."
        ),
    }
    return templates.get(
        loc,
        f"We've identified infrastructure vulnerabilities in the {loc} region.\n\n"
        "NexusAI's autonomous swarm can close these gaps within 48 hours.\n\n"
        "Would you have 15 minutes for a live demo this week?"
    )

# ---------------------------------------------------------------------------
# AGENT: CLOSER
# ---------------------------------------------------------------------------


def run_closer():
    nurtured = [l for l in state["leads"] if l["status"] == "Nurtured"]
    if not nurtured:
        return None
    lead = nurtured[0]
    try:
        lead["status"] = "Opportunity"
        company = lead.get("company", "Unknown")
        add_log("CLOSER", f"Opportunity! {company} synced to Salesforce.", "closer")
        try:
            state["audit_trail"].append({
                "time": _now(), "agent": "Closer",
                "action": "CRM Sync", "target": company,
            })
        except Exception:
            pass
        save_state_to_db()
        return {"agent": "closer", "lead": company}
    except Exception as e:
        add_log("CLOSER", f"Closer error: {str(e)[:60]}", "error")
        return None

# ---------------------------------------------------------------------------
# SWARM ORCHESTRATOR
# ---------------------------------------------------------------------------


def _run_swarm_step():
    """Execute exactly one agent step in priority order."""
    if run_hunter() is not None:
        return
    if run_guardian() is not None:
        return
    if run_professor() is not None:
        return
    if run_closer() is not None:
        return
    add_log("SYSTEM", "All leads processed. Pipeline complete.", "info")

# ---------------------------------------------------------------------------
# REST ENDPOINTS
# ---------------------------------------------------------------------------


class ConfigModel(BaseModel):
    gemini_api_key: str


@app.get("/health")
def health_check():
    uptime_seconds = int(time.time() - START_TIME)
    hours   = uptime_seconds // 3600
    minutes = (uptime_seconds % 3600) // 60
    seconds = uptime_seconds % 60
    gemini_connected = False
    if state["gemini_api_key"]:
        try:
            genai.configure(api_key=state["gemini_api_key"])
            gemini_connected = True
        except Exception:
            pass
    return {
        "status": "online",
        "version": os.getenv("APP_VERSION", "2.0.0"),
        "uptime": f"{hours:02d}:{minutes:02d}:{seconds:02d}",
        "uptime_seconds": uptime_seconds,
        "gemini_connected": gemini_connected,
        "gemini_model": "gemini-1.5-flash",
        "pdf_loaded": bool(state["pdf_text"]),
        "pdf_chars": len(state["pdf_text"]),
        "leads_total": len(state["leads"]),
        "websocket_clients": len(manager.active_connections),
    }


@app.get("/api/analytics")
def get_analytics():
    scored = [l for l in state["leads"] if l["icp_score"] > 0]
    avg_icp = round(sum(l["icp_score"] for l in scored) / len(scored), 1) if scored else 0
    rag_hits  = sum(1 for e in state["logs"] if "RAG HIT"  in e.get("message", ""))
    rag_total = sum(1 for e in state["logs"] if "RAG"      in e.get("message", ""))
    rag_hit_rate = round(rag_hits / rag_total * 100, 1) if rag_total > 0 else 0
    return {
        "pipeline_stages": {
            "New":         sum(1 for l in state["leads"] if l["status"] == "New"),
            "Scored":      sum(1 for l in state["leads"] if l["status"] == "Scored"),
            "Nurtured":    sum(1 for l in state["leads"] if l["status"] == "Nurtured"),
            "Opportunity": sum(1 for l in state["leads"] if l["status"] == "Opportunity"),
        },
        "avg_icp_score":  avg_icp,
        "icp_match_rate": avg_icp if avg_icp > 0 else 87,
        "rag_hit_rate":   rag_hit_rate,
        "roi_multiplier": round(1 + (avg_icp / 100) * 4.2, 1) if avg_icp > 0 else 4.2,
        "total_logs":     len(state["logs"]),
        "audit_entries":  len(state["audit_trail"]),
    }


@app.get("/api/status")
def get_status():
    compliance_rate = round(
        sum(1 for l in state["leads"] if l["safety_check"] == "Passed") /
        len(state["leads"]) * 100
    ) if state["leads"] else 0
    return {
        "total_leads":     len(state["leads"]),
        "opportunities":   sum(1 for l in state["leads"] if l["status"] == "Opportunity"),
        "compliance_rate": compliance_rate,
        "pdf_loaded":      bool(state["pdf_text"]),
        "pdf_chars":       len(state["pdf_text"]),
        "gemini_active":   bool(state["gemini_api_key"]),
        "mode":            "Live AI" if state["gemini_api_key"] else "Simulation",
        "roi":             f"{round(1 + compliance_rate / 25, 1)}x",
    }


@app.get("/api/leads")
def get_leads():
    return state["leads"]


@app.get("/api/logs")
def get_logs():
    return state["logs"][:50]


@app.get("/api/audit")
def get_audit():
    return state["audit_trail"]


@app.post("/api/config")
def post_config(body: ConfigModel):
    state["gemini_api_key"] = body.gemini_api_key
    if body.gemini_api_key:
        genai.configure(api_key=body.gemini_api_key)
        state["mode"] = "Live AI"
        add_log("SYSTEM", "Gemini API key configured - Live AI mode", "info")
    else:
        state["mode"] = "Simulation"
        add_log("SYSTEM", "No API key - running in Simulation mode", "info")
    return {"status": "ok", "mode": state["mode"]}


@app.post("/api/upload")
async def upload_pdf(file: UploadFile = File(...)):
    allowed_types = {"application/pdf", "application/octet-stream"}
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=415, detail=f"Invalid file type. Only PDF allowed.")
    if not (file.filename or "").lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File must have a .pdf extension.")

    contents = await file.read()

    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail=f"File too large. Max 10MB.")
    if len(contents) < 100:
        raise HTTPException(status_code=400, detail="File appears to be empty or corrupted.")

    try:
        reader = PyPDF2.PdfReader(io.BytesIO(contents))
        if len(reader.pages) == 0:
            raise HTTPException(status_code=422, detail="PDF has no readable pages.")
        text = "".join(page.extract_text() or "" for page in reader.pages)
        if len(text.strip()) < 50:
            raise HTTPException(status_code=422, detail="PDF has no extractable text (scanned image?).")

        state["pdf_text"] = text
        add_log("SYSTEM", f"PDF indexed: {file.filename} ({len(reader.pages)}p, {len(text):,} chars)", "info")
        save_state_to_db()
        return {
            "status": "ok",
            "filename": file.filename,
            "pages": len(reader.pages),
            "chars": len(text),
            "size_mb": round(len(contents) / 1024 / 1024, 2),
            "preview": text[:200].strip(),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)[:100]}")


@app.get("/api/export/csv")
def export_csv():
    if not state["leads"]:
        raise HTTPException(status_code=404, detail="No leads to export")
    output = io.StringIO()
    fieldnames = ["id", "company", "role", "location", "employees", "budget",
                  "status", "icp_score", "safety_check", "last_log", "score_breakdown"]
    writer = csv.DictWriter(output, fieldnames=fieldnames, extrasaction="ignore")
    writer.writeheader()
    writer.writerows(state["leads"])
    output.seek(0)
    filename = f"nexus-leads-{datetime.now().strftime('%Y%m%d-%H%M%S')}.csv"
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@app.get("/api/export/audit")
def export_audit():
    if not state["audit_trail"]:
        raise HTTPException(status_code=404, detail="No audit trail to export")
    filename = f"nexus-audit-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
    content = json.dumps(state["audit_trail"], indent=2, default=str)
    return StreamingResponse(
        io.BytesIO(content.encode()),
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@app.post("/api/run-swarm")
def post_run_swarm():
    t0 = time.time()
    _run_swarm_step()
    elapsed_ms = round((time.time() - t0) * 1000)
    add_log("SYSTEM", f"Swarm cycle complete in {elapsed_ms}ms", "info")
    return {
        "leads":        state["leads"],
        "logs":         state["logs"][:20],
        "execution_ms": elapsed_ms,
    }


@app.post("/api/reset")
def post_reset():
    state["leads"]       = _initial_leads()
    state["logs"]        = []
    state["pdf_text"]    = ""
    state["audit_trail"] = []
    if os.path.exists(DB_PATH):
        try:
            conn = sqlite3.connect(DB_PATH)
            conn.execute("DELETE FROM app_state")
            conn.commit()
            conn.close()
        except Exception:
            pass
    add_log("SYSTEM", "System reset - all state cleared", "info")
    return {"status": "reset"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
