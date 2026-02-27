"""
main.py - Nexus AI FastAPI Backend

ENDPOINTS
---------
GET  /health                → Server health, uptime, Gemini status
GET  /api/status            → Dashboard metrics (leads, compliance, mode)
GET  /api/leads             → All 4 leads with full data
GET  /api/logs              → Recent log entries (REST fallback)
GET  /api/audit             → Full agent audit trail
GET  /api/analytics         → Pipeline analytics, ICP scores, RAG hit rate
POST /api/config            → Save Gemini API key
POST /api/upload            → Upload & index PDF knowledge base (max 10MB)
POST /api/run-swarm         → Execute one agent step (Hunter→Guardian→Professor→Closer)
POST /api/reset             → Reset all state and clear DB
GET  /api/export/csv        → Download leads as CSV
GET  /api/export/audit      → Download audit trail as JSON
WS   /ws/logs               → WebSocket real-time log streaming
"""

import asyncio
<<<<<<< HEAD
<<<<<<< HEAD
import csv
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
import io
import json
import os
import random
import re
import sqlite3
import time
from datetime import datetime
from typing import Optional, Set

START_TIME = time.time()

from dotenv import load_dotenv

load_dotenv()

import PyPDF2
<<<<<<< HEAD
<<<<<<< HEAD
=======
import csv
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
import csv
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
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
<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======

>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Catch-all: log and return structured 500 so the frontend never receives an empty body."""
    try:
        add_log("SYSTEM", f"Server error on {request.url.path}: {str(exc)[:80]}", "error")
    except Exception:
<<<<<<< HEAD
<<<<<<< HEAD
        pass
=======
        pass  # don't let logging itself crash the handler
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
        pass  # don't let logging itself crash the handler
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "message": str(exc)[:100]},
    )

# ---------------------------------------------------------------------------
<<<<<<< HEAD
<<<<<<< HEAD
# SHARED STATE
=======
# SHARED STATE  (replaces st.session_state)
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
# SHARED STATE  (replaces st.session_state)
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
# ---------------------------------------------------------------------------

def _initial_leads() -> list[dict]:
    """Return the 4 rigged South-India leads in their default shape."""
    return [
        {
<<<<<<< HEAD
<<<<<<< HEAD
            "id": "L-101", "company": "Vizag Pharma", "role": "CISO",
            "location": "Visakhapatnam", "employees": 1200, "budget": "₹150L",
            "status": "New", "icp_score": 0, "safety_check": "Pending",
            "last_log": "", "score_breakdown": "",
            "email_body": "", "email_generated_at": "",
        },
        {
            "id": "L-102", "company": "Hyderabad FinTech", "role": "CTO",
            "location": "Hyderabad", "employees": 3500, "budget": "₹400L",
            "status": "New", "icp_score": 0, "safety_check": "Pending",
            "last_log": "", "score_breakdown": "",
            "email_body": "", "email_generated_at": "",
        },
        {
            "id": "L-103", "company": "Bengaluru CloudCo", "role": "VP Engineering",
            "location": "Bengaluru", "employees": 800, "budget": "₹200L",
            "status": "New", "icp_score": 0, "safety_check": "Pending",
            "last_log": "", "score_breakdown": "",
            "email_body": "", "email_generated_at": "",
        },
        {
            "id": "L-104", "company": "Chennai Logistics", "role": "IT Director",
            "location": "Chennai", "employees": 600, "budget": "₹100L",
            "status": "New", "icp_score": 0, "safety_check": "Pending",
            "last_log": "", "score_breakdown": "",
            "email_body": "", "email_generated_at": "",
=======
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
            "id": "L-101",
            "company": "Vizag Pharma",
            "role": "CISO",
            "location": "Visakhapatnam",
            "employees": 1200,
            "budget": "₹150L",
            "status": "New",
            "icp_score": 0,
            "safety_check": "Pending",
            "last_log": "",
            "score_breakdown": "",
            "email_body": "",
            "email_generated_at": "",
            "compliance_report": {},
        },
        {
            "id": "L-102",
            "company": "Hyderabad FinCorp",
            "role": "IT Director",
            "location": "Hyderabad",
            "employees": 800,
            "budget": "₹120L",
            "status": "New",
            "icp_score": 0,
            "safety_check": "Pending",
            "last_log": "",
            "score_breakdown": "",
            "email_body": "",
            "email_generated_at": "",
            "compliance_report": {},
        },
        {
            "id": "L-103",
            "company": "Vijayawada Retail",
            "role": "CISO",
            "location": "Vijayawada",
            "employees": 2000,
            "budget": "₹200L",
            "status": "New",
            "icp_score": 0,
            "safety_check": "Pending",
            "last_log": "",
            "score_breakdown": "",
            "email_body": "",
            "email_generated_at": "",
            "compliance_report": {},
        },
        {
            "id": "L-104",
            "company": "Andhra Logistics",
            "role": "IT Director",
            "location": "Andhra Pradesh",
            "employees": 600,
            "budget": "₹90L",
            "status": "New",
            "icp_score": 0,
            "safety_check": "Pending",
            "last_log": "",
            "score_breakdown": "",
            "email_body": "",
            "email_generated_at": "",
            "compliance_report": {},
<<<<<<< HEAD
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
        },
    ]


<<<<<<< HEAD
<<<<<<< HEAD
state: dict = {
    "leads":        _initial_leads(),
    "logs":         [],
    "pdf_text":     "",
    "gemini_api_key": os.getenv("GEMINI_API_KEY", ""),
    "audit_trail":  [],
    "mode":         "Simulation",
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
# WEBSOCKET — CONNECTION MANAGER
# ---------------------------------------------------------------------------


=======
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
def _initial_logs() -> list[dict]:
    return [
        {
            "time": datetime.now().strftime("%H:%M:%S"),
            "agent": "SYSTEM",
            "message": "SYSTEM ONLINE... WAITING FOR PDF INGESTION...",
            "type": "info",
        }
    ]


def _fresh_state() -> dict:
    return {
        "leads": _initial_leads(),
        "logs": _initial_logs(),
        "pdf_text": "",
        "gemini_api_key": os.getenv("GEMINI_API_KEY", ""),
        "audit_trail": [],
    }


state: dict = _fresh_state()

# ---------------------------------------------------------------------------
# HELPERS
# ---------------------------------------------------------------------------

def _now() -> str:
    return datetime.now().strftime("%H:%M:%S")


def _prepend_log(agent: str, message: str, log_type: str) -> None:
    """Insert a new log entry at the front of state['logs']."""
    state["logs"].insert(
        0,
        {
            "time": _now(),
            "agent": agent,
            "message": message,
            "type": log_type,
        },
    )


# ---------------------------------------------------------------------------
# WEBSOCKET CONNECTION MANAGER
# ---------------------------------------------------------------------------

<<<<<<< HEAD
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
class ConnectionManager:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.discard(websocket)

    async def broadcast(self, message: dict):
<<<<<<< HEAD
<<<<<<< HEAD
        dead = set()
=======
        dead: Set[WebSocket] = set()
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
        dead: Set[WebSocket] = set()
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except Exception:
                dead.add(connection)
        self.active_connections -= dead


manager = ConnectionManager()

<<<<<<< HEAD
<<<<<<< HEAD
# ---------------------------------------------------------------------------
# LOGGING HELPERS
# ---------------------------------------------------------------------------


def _now() -> str:
    return datetime.now().strftime("%H:%M:%S")


def _prepend_log(agent: str, message: str, type_: str = "info"):
    entry = {"time": _now(), "agent": agent, "message": message, "type": type_}
    state["logs"].insert(0, entry)
    # keep last 200
    state["logs"] = state["logs"][:200]


def add_log(agent: str, message: str, type_: str = "info"):
    """Thread-safe log add that also broadcasts to WebSocket clients."""
    _prepend_log(agent, message, type_)
    entry = state["logs"][0]
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
    add_log("SYSTEM", "🚀 Nexus AI Backend online — agents ready", "info")


# ---------------------------------------------------------------------------
# WEBSOCKET ENDPOINT
# ---------------------------------------------------------------------------


@app.websocket("/ws/logs")
async def websocket_logs(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        await websocket.send_text(json.dumps({"type": "init", "logs": state["logs"]}))
        # Keep connection alive with pings
        while True:
            await asyncio.sleep(15)
            await websocket.send_text(json.dumps({"type": "ping"}))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)


# ---------------------------------------------------------------------------
# AGENT LOGIC — HUNTER
# ---------------------------------------------------------------------------

def run_hunter():
    for lead in state["leads"]:
        if lead["status"] == "New":
            role_weights = {"CISO": 100, "CTO": 95, "IT Director": 80, "VP Engineering": 85, "Security Manager": 70}
            role_score = role_weights.get(lead["role"], 60)

            location_weights = {"Hyderabad": 100, "Visakhapatnam": 88, "Vijayawada": 78, "Andhra Pradesh": 72, "Chennai": 85, "Bengaluru": 95}
            loc_score = location_weights.get(lead["location"], 65)

=======
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)

# ---------------------------------------------------------------------------
# add_log — unified logging + live WebSocket broadcast
# ---------------------------------------------------------------------------

def add_log(agent: str, message: str, log_type: str = "info") -> None:
    log_entry = {
        "time": _now(),
        "agent": agent,
        "message": message,
        "type": log_type,
    }
    state["logs"].insert(0, log_entry)

    # Fire-and-forget broadcast to all WebSocket clients
    async def _broadcast():
        await manager.broadcast({"type": "new_log", "log": log_entry})

    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            asyncio.create_task(_broadcast())
    except Exception:
        pass



# ---------------------------------------------------------------------------
# SQLITE PERSISTENCE
# ---------------------------------------------------------------------------

DB_PATH = "nexus.db"


def init_db() -> None:
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS app_state (
            key        TEXT PRIMARY KEY,
            value      TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


def save_state_to_db() -> None:
    """Persist leads / logs / audit_trail to SQLite after every agent change."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    for key in ("leads", "logs", "audit_trail"):
        c.execute(
            "INSERT OR REPLACE INTO app_state (key, value, updated_at) "
            "VALUES (?, ?, CURRENT_TIMESTAMP)",
            (key, json.dumps(state[key])),
        )
    conn.commit()
    conn.close()


def load_state_from_db() -> bool:
    """Load persisted state on startup. Returns True if anything was loaded."""
    if not os.path.exists(DB_PATH):
        return False
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    loaded = False
    for key in ("leads", "logs", "audit_trail"):
        c.execute("SELECT value FROM app_state WHERE key = ?", (key,))
        row = c.fetchone()
        if row:
            state[key] = json.loads(row[0])
            loaded = True
    conn.close()
    return loaded


@app.on_event("startup")
async def startup_event():
    init_db()
    restored = load_state_from_db()
    if restored:
        add_log("SYSTEM", f"State restored from database. {len(state['leads'])} leads loaded.", "info")
    else:
        add_log("SYSTEM", "Fresh start. Database initialized.", "info")


# ---------------------------------------------------------------------------
# AGENT 1 — HUNTER  (weighted multi-factor ICP scorer)
# ---------------------------------------------------------------------------

def run_hunter() -> Optional[dict]:
    """Score the first unscored lead using role/location/size/budget weights."""
    leads = state["leads"]
    for lead in leads:
        if lead["status"] == "New":

            # ROLE WEIGHTS
            role_weights = {
                "CISO": 100, "CTO": 95, "IT Director": 80,
                "VP Engineering": 85, "Security Manager": 70,
            }
            role_score = role_weights.get(lead["role"], 60)

            # LOCATION WEIGHTS (South India cyber threat index)
            location_weights = {
                "Hyderabad": 100, "Visakhapatnam": 88,
                "Vijayawada": 78, "Andhra Pradesh": 72,
                "Chennai": 85, "Bengaluru": 95,
            }
            loc_score = location_weights.get(lead["location"], 65)

            # EMPLOYEE SIZE SCORE (larger = better ICP)
<<<<<<< HEAD
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
            emp = lead.get("employees", 500)
            if emp >= 2000:   emp_score = 100
            elif emp >= 1000: emp_score = 85
            elif emp >= 500:  emp_score = 70
            else:             emp_score = 55

<<<<<<< HEAD
<<<<<<< HEAD
            budget_str = str(lead.get("budget", "0"))
            budget_num = int(re.sub(r"[^\d]", "", budget_str) or "0")
            if budget_num >= 400:   budget_score = 100
            elif budget_num >= 200: budget_score = 85
            elif budget_num >= 100: budget_score = 70
            else:                   budget_score = 55

            icp_score = round(0.3 * role_score + 0.3 * loc_score + 0.2 * emp_score + 0.2 * budget_score)

            breakdown = (
                f"Role:{role_score} | Loc:{loc_score} | "
                f"Emp:{emp_score} | Budget:{budget_score} → ICP:{icp_score}"
            )

            lead["icp_score"] = icp_score
            lead["score_breakdown"] = breakdown
            lead["status"] = "Scored"
            lead["last_log"] = f"🎯 ICP Score: {icp_score}%"

            add_log("HUNTER", f"🎯 Scored {lead['company']} [{lead['location']}] — ICP {icp_score}% | {breakdown}", "hunter")
            save_state_to_db()
            return {"agent": "hunter", "lead": lead["company"], "score": icp_score}
=======
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
            # BUDGET SCORE (parse ₹ value)
            budget_str = lead.get("budget", "₹50L")
            digits = ''.join(filter(str.isdigit, budget_str))
            budget_num = int(digits) if digits else 50
            if budget_num >= 200:   budget_score = 100
            elif budget_num >= 150: budget_score = 90
            elif budget_num >= 100: budget_score = 75
            else:                   budget_score = 60

            # WEIGHTED FINAL SCORE
            final_score = round(
                (role_score   * 0.30) +
                (loc_score    * 0.25) +
                (emp_score    * 0.25) +
                (budget_score * 0.20)
            )

            breakdown = f"Role:{role_score} Loc:{loc_score} Size:{emp_score} Budget:{budget_score}"

            lead["icp_score"]       = final_score
            lead["status"]          = "Scored"
            lead["score_breakdown"] = breakdown

            add_log(
                "HUNTER",
                f"Target: {lead['company']} | ICP Score: {final_score}% | {breakdown}",
                "hunter",
            )
            state["audit_trail"].append({
                "time":   datetime.now().isoformat(),
                "agent":  "Hunter",
                "action": "Lead Scored",
                "target": lead["company"],
                "detail": breakdown,
                "score":  final_score,
            })
            save_state_to_db()
            return {"agent": "hunter", "lead": lead["company"], "score": final_score, "breakdown": breakdown}
<<<<<<< HEAD
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
    return None


# ---------------------------------------------------------------------------
<<<<<<< HEAD
<<<<<<< HEAD
# AGENT LOGIC — GUARDIAN
# ---------------------------------------------------------------------------

def run_guardian():
    for lead in state["leads"]:
        if lead["status"] == "Scored" and lead["safety_check"] == "Pending":
            checks = []
            passed = 0
            total = 5
=======
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
# AGENT 2 — GUARDIAN  (5-point compliance engine)
# ---------------------------------------------------------------------------

def run_guardian() -> Optional[dict]:
    """Run 5 compliance checks on the first Scored/Pending lead."""
    for lead in state["leads"]:
        if lead["status"] == "Scored" and lead["safety_check"] == "Pending":

            checks = []
            passed = 0
            total  = 5
<<<<<<< HEAD
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)

            # CHECK 1: PII Scan
            lead_str = str(lead)
            pii_patterns = [
<<<<<<< HEAD
<<<<<<< HEAD
                r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
                r'\b\d{10}\b',
                r'\b\d{12}\b',
                r'\b[0-9]{16}\b',
            ]
            pii_found = any(re.search(p, lead_str) for p in pii_patterns)
            checks.append({"check": "PII Scan", "passed": not pii_found, "detail": "No PII detected" if not pii_found else "PII FOUND - BLOCKED"})
            if not pii_found: passed += 1

            # CHECK 2: Score bias check
            all_scores = [l["icp_score"] for l in state["leads"] if l["icp_score"] > 0]
            avg_score = sum(all_scores) / len(all_scores) if all_scores else 0
            bias_ok = abs(lead["icp_score"] - avg_score) < 40
            checks.append({"check": "Bias Check", "passed": bias_ok, "detail": f"Score {lead['icp_score']} vs avg {avg_score:.0f}"})
            if bias_ok: passed += 1

            # CHECK 3: Location whitelist
            allowed_locs = ["Hyderabad", "Visakhapatnam", "Vijayawada", "Chennai", "Bengaluru", "Andhra Pradesh"]
            loc_ok = lead["location"] in allowed_locs
            checks.append({"check": "Location Whitelist", "passed": loc_ok, "detail": f"{lead['location']} {'✓ allowed' if loc_ok else '✗ restricted'}"})
            if loc_ok: passed += 1

            # CHECK 4: Budget sanity
            budget_str = str(lead.get("budget", "0"))
            budget_num = int(re.sub(r"[^\d]", "", budget_str) or "0")
            budget_ok = 50 <= budget_num <= 600
            checks.append({"check": "Budget Sanity", "passed": budget_ok, "detail": f"₹{budget_num}L {'in range' if budget_ok else 'out of range'}"})
            if budget_ok: passed += 1

            # CHECK 5: Role authority check
            senior_roles = ["CISO", "CTO", "VP Engineering", "IT Director", "Security Manager", "CEO", "COO"]
            role_ok = lead["role"] in senior_roles
            checks.append({"check": "Role Authority", "passed": role_ok, "detail": f"{lead['role']} {'✓ decision-maker' if role_ok else '✗ not senior'}"})
            if role_ok: passed += 1

            status = "Passed" if passed >= 4 else "Failed"
            lead["safety_check"] = status
            if status == "Passed":
                lead["status"] = "Nurtured"
                lead["last_log"] = f"✅ Guardian: {passed}/{total} checks passed"
            else:
                lead["last_log"] = f"❌ Guardian: only {passed}/{total} checks passed"

            bias_score = round(abs(lead["icp_score"] - avg_score), 1)
            lead["audit_report"] = {
                "checks": checks, "passed": passed, "total": total,
                "bias_score": bias_score, "timestamp": datetime.now().isoformat(),
            }

            add_log("GUARDIAN", f"🛡️ Compliance Audit: {lead['company']} | {passed}/{total} checks passed | Bias Score: {bias_score} | {status.upper()}", "guardian")
=======
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
                r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',  # email
                r'\b\d{10}\b',   # phone
                r'\b\d{12}\b',   # Aadhaar
                r'\b[0-9]{16}\b', # card number
            ]
            pii_found = any(re.search(p, lead_str) for p in pii_patterns)
            checks.append({"check": "PII Scan", "passed": not pii_found,
                           "detail": "No PII detected" if not pii_found else "PII FOUND - BLOCKED"})
            if not pii_found: passed += 1

            # CHECK 2: Score bias check
            all_scores = [l["icp_score"] for l in state["leads"] if l["status"] != "New"]
            score_variance = max(all_scores) - min(all_scores) if len(all_scores) > 1 else 0
            bias_ok = score_variance < 40
            checks.append({"check": "Bias Audit", "passed": bias_ok,
                           "detail": f"Score variance: {score_variance} points ({'OK' if bias_ok else 'HIGH VARIANCE'})"})
            if bias_ok: passed += 1

            # CHECK 3: Role discrimination check
            role_scores = {l["role"]: l["icp_score"] for l in state["leads"] if l["icp_score"] > 0}
            roles_balanced = all(s > 50 for s in role_scores.values()) if role_scores else True
            checks.append({"check": "Role Fairness", "passed": roles_balanced,
                           "detail": f"Roles checked: {list(role_scores.keys())}"})
            if roles_balanced: passed += 1

            # CHECK 4: Data completeness
            required_fields = ["company", "role", "location", "employees", "budget"]
            complete = all(lead.get(f) for f in required_fields)
            checks.append({"check": "Data Completeness", "passed": complete,
                           "detail": f"All required fields present: {complete}"})
            if complete: passed += 1

            # CHECK 5: GDPR/DPDP consent simulation
            gdpr_ok = lead.get("employees", 0) > 0  # B2B data is DPDP-exempt
            checks.append({"check": "DPDP Compliance", "passed": gdpr_ok,
                           "detail": "B2B enterprise data: DPDP exempt"})
            if gdpr_ok: passed += 1

            # VERDICT
            bias_score  = round((1 - score_variance / 100) * 100, 2) if score_variance < 100 else 0
            status      = "Passed" if passed >= 4 else "Failed"

            lead["safety_check"]     = status
            lead["compliance_report"] = {
                "checks":     checks,
                "passed":     passed,
                "total":      total,
                "bias_score": bias_score,
                "timestamp":  datetime.now().isoformat(),
            }

            add_log(
                "GUARDIAN",
                f"🛡️ Compliance Audit: {lead['company']} | {passed}/{total} checks passed | Bias Score: {bias_score} | {status.upper()}",
                "guardian",
            )
<<<<<<< HEAD
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
            state["audit_trail"].append({
                "time":   datetime.now().isoformat(),
                "agent":  "Guardian",
                "action": f"Compliance {status}",
                "target": lead["company"],
                "detail": f"{passed}/{total} checks, bias:{bias_score}",
            })
            save_state_to_db()
            return {"agent": "guardian", "lead": lead["company"], "status": status, "checks": checks, "passed": passed}
    return None

<<<<<<< HEAD
<<<<<<< HEAD

# ---------------------------------------------------------------------------
# AGENT LOGIC — one step orchestrator
# ---------------------------------------------------------------------------

=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
def _run_swarm_step() -> None:
    """Execute exactly ONE agent step, matching the original priority chain."""
    leads = state["leads"]

<<<<<<< HEAD
<<<<<<< HEAD
    if run_hunter() is not None:
        return

    if run_guardian() is not None:
        return

    # PROFESSOR
    ready = [l for l in leads if l["status"] == "Scored" and l["safety_check"] == "Passed"]
    if ready:
        if not state["pdf_text"]:
            latest = state["logs"][0]["message"] if state["logs"] else ""
            if "🛑" not in latest:
                _prepend_log("PROFESSOR", "🛑 WAITING FOR DATA. Upload PDF to proceed.", "error")
=======
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
    # ------------------------------------------------------------------
    # AGENT 1 — HUNTER (Scoring)
    # ------------------------------------------------------------------
    if run_hunter() is not None:
        return

    # ------------------------------------------------------------------
    # AGENT 2 — GUARDIAN (Compliance Audit)
    # ------------------------------------------------------------------
    if run_guardian() is not None:
        return

    # ------------------------------------------------------------------
    # AGENT 3 — PROFESSOR (Content + RAG)
    # ------------------------------------------------------------------
    ready = [
        l for l in leads if l["status"] == "Scored" and l["safety_check"] == "Passed"
    ]
    if ready:
        # Strict gate: PDF must be uploaded first
        if not state["pdf_text"]:
            # Only log once (avoid spam — check if most-recent log is already the wait msg)
            latest = state["logs"][0]["message"] if state["logs"] else ""
            if "🛑" not in latest:
                _prepend_log(
                    "PROFESSOR",
                    "🛑 WAITING FOR DATA. Upload PDF to proceed.",
                    "error",
                )
<<<<<<< HEAD
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
            return

        lead = ready[0]
        loc = lead.get("location") or ""

<<<<<<< HEAD
<<<<<<< HEAD
        if not loc:
            add_log("PROFESSOR", f"⚠️ Skipping lead with empty location: {lead.get('company', '?')}", "error")
            lead["status"] = "Scored"
            return

=======
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
        # Guard: skip malformed lead with no location
        if not loc:
            add_log("PROFESSOR", f"⚠️ Skipping lead with empty location: {lead.get('company','?')}", "error")
            lead["status"] = "Scored"  # keep status, don't loop
            return

        # Null-safe pdf_text
<<<<<<< HEAD
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
        pdf_text = state["pdf_text"] or ""

        # RAG search
        context = "General Cyber Security"
        rag_status = "⚠️ RAG MISS"
        if loc and loc in pdf_text:
            start = pdf_text.find(loc)
<<<<<<< HEAD
<<<<<<< HEAD
            context = pdf_text[start: start + 300]
            rag_status = "✅ RAG HIT"

        # Content generation
=======
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
            context = pdf_text[start : start + 300]
            rag_status = "✅ RAG HIT"

        # Content generation — Real AI or Simulation
<<<<<<< HEAD
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
        subject = ""
        if state["gemini_api_key"]:
            try:
                genai.configure(api_key=state["gemini_api_key"])
                model = genai.GenerativeModel("gemini-1.5-flash")
                prompt = (
                    f'CONTEXT FROM PDF: "{context}"\n'
                    f"TASK: Write a 4-word urgent email subject for a {lead['role']} in {loc}.\n"
                    "TONE: Professional Security Alert."
                )
                res = model.generate_content(prompt)
                subject = res.text.strip()
            except Exception as e:
<<<<<<< HEAD
<<<<<<< HEAD
                _prepend_log("PROFESSOR", f"Gemini API error: {str(e)[:60]}. Falling back to simulation.", "error")
=======
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
                _prepend_log(
                    "PROFESSOR",
                    f"Gemini API error: {str(e)[:60]}. Falling back to simulation.",
                    "error",
                )
<<<<<<< HEAD
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
                subject = f"Urgent: {loc} Cyber Security Update"
        else:
            if "✅" in rag_status:
                sim_templates = [
                    f"Critical: {loc} Infrastructure Risk",
                    f"Alert: New Threat Targeting {loc}",
                    f"Urgent: Patch Required for {loc} Nodes",
                    f"Security Notice: {loc} Sector Vulnerability",
                ]
<<<<<<< HEAD
<<<<<<< HEAD
                subject = random.choice(sim_templates)
            else:
                subject = f"Urgent: {loc} Cyber Security Update"

        # Generate email body
=======
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
            else:
                sim_templates = [
                    "Update: General Cyber Risk Assessment",
                    "Notice: Q1 Security Compliance Audit",
                    "Alert: Enterprise Firewall Update Required",
                ]
            subject = random.choice(sim_templates)

        # GENERATE FULL EMAIL BODY
<<<<<<< HEAD
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
        email_body = ""
        if state["gemini_api_key"]:
            try:
                model = genai.GenerativeModel("gemini-1.5-flash")
                body_prompt = f"""
You are a B2B cybersecurity sales expert.

CONTEXT FROM REPORT: "{context}"
RECIPIENT: {lead['role']} at {lead['company']}, located in {lead['location']}
COMPANY SIZE: {lead['employees']} employees, Budget: {lead['budget']}
EMAIL SUBJECT: {subject}

<<<<<<< HEAD
<<<<<<< HEAD
Write a 3-paragraph personalized cold email body. 
=======
Write a 3-paragraph personalized cold email body.
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
Write a 3-paragraph personalized cold email body.
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
Paragraph 1: Reference a specific cyber threat relevant to their location/industry.
Paragraph 2: Explain how NexusAI's autonomous agent platform solves it.
Paragraph 3: Clear CTA for a 15-minute demo call.

Tone: Professional, urgent but not pushy. Max 120 words total.
Return ONLY the email body, no subject line, no greeting/signature.
"""
                body_res = model.generate_content(body_prompt)
                email_body = body_res.text.strip()
<<<<<<< HEAD
<<<<<<< HEAD
            except Exception:
=======
            except Exception as e:
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
            except Exception as e:
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
                email_body = (
                    f"We've identified critical infrastructure vulnerabilities affecting {loc}-based "
                    f"enterprises in Q1 2025. Our autonomous AI swarm has already flagged your sector as high-risk.\n\n"
                    f"NexusAI's multi-agent platform provides real-time threat intelligence, compliance automation, "
                    f"and zero-PII lead intelligence — cutting your manual security workflows by 40%.\n\n"
                    f"I'd love to show you a 15-minute live demo of our ICP targeting engine. Are you available this week?"
                )
        else:
            body_templates = {
                "Hyderabad": (
                    f"Our threat intelligence shows a 340% spike in ransomware attacks targeting Hyderabad "
                    f"FinTech firms in Q1 2025. Your sector is in the crosshairs.\n\n"
                    f"NexusAI's Guardian Agent has already flagged 3 compliance gaps common to "
<<<<<<< HEAD
<<<<<<< HEAD
                    f"{lead['employees']}-employee enterprises at your budget tier — all auto-remediated.\n\n"
=======
                    f"{lead['employees']}-employee enterprises at your budget tier — all auto-remediated within our platform.\n\n"
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
                    f"{lead['employees']}-employee enterprises at your budget tier — all auto-remediated within our platform.\n\n"
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
                    f"I'd love to walk you through a 15-minute live demo. Does Thursday work for you?"
                ),
                "Visakhapatnam": (
                    f"Port-adjacent pharma companies in Visakhapatnam are facing a new wave of supply chain "
<<<<<<< HEAD
<<<<<<< HEAD
                    f"attacks in 2025. Our Hunter Agent has flagged your sector as Tier-1 risk.\n\n"
                    f"NexusAI's autonomous swarm monitors 1,200+ threat vectors in real-time, "
                    f"with zero manual intervention needed for your {lead['employees']}-person team.\n\n"
                    f"I'd love to demo how we've protected similar Vizag enterprises. Free 15 minutes?"
                ),
                "Bengaluru": (
                    f"Cloud-native companies in Bengaluru saw a 280% increase in API-layer attacks in Q4 2025. "
                    f"Your stack is in the highest-risk category.\n\n"
                    f"NexusAI's Professor Agent auto-generates compliance reports in real-time — "
                    f"saving your {lead['employees']}-person engineering team 12 hours/week.\n\n"
                    f"Quick 15-minute demo this week? I'll show you live threat data from your sector."
                ),
                "Chennai": (
                    f"Chennai's logistics sector has seen 3 major data breaches in 90 days. "
                    f"Our AI flagged your vendor network as a critical exposure point.\n\n"
                    f"NexusAI's 4-agent swarm locks down your supply chain risk automatically — "
                    f"with full audit trails your compliance team will love.\n\n"
                    f"I'd love to show you a 15-minute demo tailored specifically to logistics security."
=======
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
                    f"cyberattacks — our intelligence shows 12 incidents in the last 30 days.\n\n"
                    f"NexusAI's Professor Agent can deliver hyper-personalized threat briefings to your entire "
                    f"C-suite, automatically, every morning.\n\n"
                    f"Could we schedule 15 minutes this week to show you the live platform?"
<<<<<<< HEAD
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
                ),
            }
            email_body = body_templates.get(
                loc,
<<<<<<< HEAD
<<<<<<< HEAD
                f"We've identified infrastructure vulnerabilities in the {loc} region affecting enterprises "
                f"of your scale.\n\nNexusAI's autonomous swarm can close these gaps within 48 hours.\n\n"
                f"Would you have 15 minutes for a live demo this week?"
            )

        lead["status"] = "Nurtured"
        lead["last_log"] = subject
        lead["email_body"] = email_body
        lead["email_generated_at"] = datetime.now().isoformat()

        add_log("PROFESSOR", f"✉️ {rag_status} | Email crafted for {lead['company']}: \"{subject}\"", "professor")
        state["audit_trail"].append({
            "time":   _now(),
            "agent":  "Professor",
            "action": "Content Gen",
            "target": lead["company"],
        })
        save_state_to_db()
        return

    # CLOSER
=======
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
                f"Our autonomous threat intelligence platform has flagged {loc} as an elevated-risk zone for "
                f"enterprise cyber incidents in Q1 2025.\n\n"
                f"NexusAI's 4-agent swarm handles lead scoring, compliance auditing, content personalization, "
                f"and CRM sync — fully autonomously.\n\n"
                f"I'd love to show you a 15-minute demo. Are you free this week?"
            )

        lead["status"]             = "Nurtured"
        lead["last_log"]           = subject
        lead["email_body"]         = email_body
        lead["email_generated_at"] = datetime.now().isoformat()

        msg = f"{rag_status}. Subject: '{subject}'"
        _prepend_log("PROFESSOR", msg, "professor")
        state["audit_trail"].append(
            {
                "time":   _now(),
                "agent":  "Professor",
                "action": "Content Gen",
                "target": lead["company"],
            }
        )
        save_state_to_db()
        return

    # ------------------------------------------------------------------
    # AGENT 4 — CLOSER (CRM Sync)
    # ------------------------------------------------------------------
<<<<<<< HEAD
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
    nurtured = [l for l in leads if l["status"] == "Nurtured"]
    if nurtured:
        lead = nurtured[0]
        try:
            lead["status"] = "Opportunity"
<<<<<<< HEAD
<<<<<<< HEAD
            msg = f"💰 Opportunity! {lead.get('company', 'Unknown')} synced to Salesforce."
=======
            msg = f"💰 Opportunity! {lead.get('company','Unknown')} synced to Salesforce."
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
            msg = f"💰 Opportunity! {lead.get('company','Unknown')} synced to Salesforce."
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
            _prepend_log("CLOSER", msg, "closer")
            try:
                state["audit_trail"].append({
                    "time":   _now(),
                    "agent":  "Closer",
                    "action": "CRM Sync",
                    "target": lead.get("company", "Unknown"),
                })
            except Exception:
<<<<<<< HEAD
<<<<<<< HEAD
                pass
=======
                pass  # audit trail failure must never block the pipeline
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
                pass  # audit trail failure must never block the pipeline
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
            save_state_to_db()
        except Exception as e:
            _prepend_log("CLOSER", f"Closer error: {str(e)[:60]}", "error")
        return

<<<<<<< HEAD
<<<<<<< HEAD
=======
    # All done — no eligible leads
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
    # All done — no eligible leads
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
    _prepend_log("SYSTEM", "All leads processed. Pipeline complete.", "info")


# ---------------------------------------------------------------------------
<<<<<<< HEAD
<<<<<<< HEAD
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
            gemini_connected = False
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
    rag_hits = sum(1 for e in state["logs"] if "RAG HIT" in e.get("message", ""))
    rag_total = sum(1 for e in state["logs"] if "RAG" in e.get("message", ""))
    rag_hit_rate = round(rag_hits / rag_total * 100, 1) if rag_total > 0 else 0
    return {
        "pipeline_stages": {
            "New":         sum(1 for l in state["leads"] if l["status"] == "New"),
            "Scored":      sum(1 for l in state["leads"] if l["status"] == "Scored"),
            "Nurtured":    sum(1 for l in state["leads"] if l["status"] == "Nurtured"),
            "Opportunity": sum(1 for l in state["leads"] if l["status"] == "Opportunity"),
        },
        "avg_icp_score":   avg_icp,
        "icp_match_rate":  avg_icp if avg_icp > 0 else 87,
        "rag_hit_rate":    rag_hit_rate,
        "roi_multiplier":  round(1 + (avg_icp / 100) * 4.2, 1) if avg_icp > 0 else 4.2,
        "total_logs":      len(state["logs"]),
        "audit_entries":   len(state["audit_trail"]),
    }


@app.get("/api/status")
def get_status():
    compliance_rate = round(
        sum(1 for l in state["leads"] if l["safety_check"] == "Passed") / len(state["leads"]) * 100
    ) if state["leads"] else 0
    return {
        "total_leads":    len(state["leads"]),
        "opportunities":  sum(1 for l in state["leads"] if l["status"] == "Opportunity"),
        "compliance_rate": compliance_rate,
        "pdf_loaded":     bool(state["pdf_text"]),
        "pdf_chars":      len(state["pdf_text"]),
        "gemini_active":  bool(state["gemini_api_key"]),
        "mode":           "Live AI" if state["gemini_api_key"] else "Simulation",
        "roi":            f"{round(1 + compliance_rate / 25, 1)}x",
=======
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
# WEBSOCKET ENDPOINT
# ---------------------------------------------------------------------------

@app.websocket("/ws/logs")
async def websocket_logs(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Push existing logs immediately on connect
        await websocket.send_text(
            json.dumps({"type": "init", "logs": state["logs"][:20]})
        )
        while True:
            await asyncio.sleep(0.5)
            await websocket.send_text(json.dumps({"type": "ping"}))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)


# ---------------------------------------------------------------------------
# REQUEST / RESPONSE MODELS
# ---------------------------------------------------------------------------

class ConfigRequest(BaseModel):
    gemini_api_key: str


# ---------------------------------------------------------------------------
# ENDPOINTS
# ---------------------------------------------------------------------------

@app.get("/api/status")
def get_status():
    """High-level dashboard metrics derived from live state."""
    leads = state["leads"]
    total = len(leads)
    opportunities = sum(1 for l in leads if l["status"] == "Opportunity")
    compliance_passed = sum(1 for l in leads if l["safety_check"] == "Passed")
    compliance_rate = round((compliance_passed / total * 100) if total else 0, 1)

    return {
        "mode": "REAL AI" if state["gemini_api_key"] else "SIMULATION",
        "total_leads": total,
        "opportunities": opportunities,
        "compliance_rate": compliance_rate,
        "roi": "4.2x",
        "pdf_loaded": bool(state["pdf_text"]),
<<<<<<< HEAD
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
    }


@app.get("/api/leads")
def get_leads():
    return state["leads"]


@app.get("/api/logs")
def get_logs():
<<<<<<< HEAD
<<<<<<< HEAD
    return state["logs"][:50]
=======
    return state["logs"]
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
    return state["logs"]
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)


@app.get("/api/audit")
def get_audit():
    return state["audit_trail"]


@app.post("/api/config")
<<<<<<< HEAD
<<<<<<< HEAD
def post_config(body: ConfigModel):
    state["gemini_api_key"] = body.gemini_api_key
    if body.gemini_api_key:
        genai.configure(api_key=body.gemini_api_key)
        state["mode"] = "Live AI"
        add_log("SYSTEM", "🔑 Gemini API key configured — switching to Live AI mode", "info")
    else:
        state["mode"] = "Simulation"
        add_log("SYSTEM", "⚠️ No API key — running in Simulation mode", "info")
    return {"status": "ok", "mode": state["mode"]}


@app.post("/api/upload")
async def upload_pdf(file: UploadFile = File(...)):
    # Validate content type
    allowed_types = {"application/pdf", "application/octet-stream"}
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=415, detail=f"Invalid file type '{file.content_type}'. Only PDF allowed.")

    # Validate extension
    if not (file.filename or "").lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File must have a .pdf extension.")

    contents = await file.read()

    # Size check (10 MB max)
    max_bytes = 10 * 1024 * 1024
    if len(contents) > max_bytes:
        raise HTTPException(status_code=413, detail=f"File too large ({len(contents)//1024//1024}MB). Max 10MB.")

    if len(contents) < 100:
        raise HTTPException(status_code=400, detail="File appears to be empty or corrupted.")

    # Parse PDF
    try:
        reader = PyPDF2.PdfReader(io.BytesIO(contents))
        if len(reader.pages) == 0:
            raise HTTPException(status_code=422, detail="PDF has no readable pages.")

        text = ""
        for page in reader.pages:
            text += (page.extract_text() or "")

        if len(text.strip()) < 50:
            raise HTTPException(status_code=422, detail="PDF appears to be a scanned image with no extractable text.")

        state["pdf_text"] = text
        size_mb = round(len(contents) / 1024 / 1024, 2)
        add_log("SYSTEM", f"📄 PDF indexed: {file.filename} ({len(reader.pages)}p, {len(text):,} chars)", "info")
        save_state_to_db()

        return {
            "status": "ok",
            "filename": file.filename,
            "pages": len(reader.pages),
            "chars": len(text),
            "size_mb": size_mb,
            "preview": text[:200].strip(),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)[:100]}")


=======
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
def post_config(body: ConfigRequest):
    state["gemini_api_key"] = body.gemini_api_key
    mode = "REAL AI" if body.gemini_api_key else "SIMULATION"
    _prepend_log("SYSTEM", f"Configuration saved. Mode: {mode}", "info")
    return {"ok": True, "mode": mode}


@app.post("/api/upload")
async def post_upload(file: UploadFile = File(...)):
    # Validate file type
    if file.content_type not in ("application/pdf", "application/octet-stream"):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {file.content_type}. Only PDF files accepted.",
        )
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File must have .pdf extension")

    content = await file.read()
    file_size_mb = len(content) / (1024 * 1024)

    if file_size_mb > 10:
        raise HTTPException(
            status_code=413,
            detail=f"File too large: {file_size_mb:.1f}MB. Maximum allowed: 10MB",
        )
    if len(content) < 100:
        raise HTTPException(status_code=400, detail="File appears to be empty or corrupted")

    try:
        reader = PyPDF2.PdfReader(io.BytesIO(content))
        if len(reader.pages) == 0:
            raise HTTPException(status_code=400, detail="PDF has no readable pages")

        text = ""
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted

        if len(text) < 50:
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from PDF. File may be a scanned image.",
            )

        state["pdf_text"] = text
        add_log(
            "SYSTEM",
            f"✅ PDF Indexed: '{file.filename}' | {len(reader.pages)} pages | {len(text):,} chars | {file_size_mb:.1f}MB",
            "info",
        )
        save_state_to_db()

        return {
            "status":   "success",
            "filename": file.filename,
            "pages":    len(reader.pages),
            "chars":    len(text),
            "size_mb":  round(file_size_mb, 2),
            "preview":  text[:200] + "..." if len(text) > 200 else text,
        }

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"PDF processing failed: {exc}")


# ---------------------------------------------------------------------------
# EXPORT ENDPOINTS
# ---------------------------------------------------------------------------

<<<<<<< HEAD
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
@app.get("/api/export/csv")
def export_csv():
    if not state["leads"]:
        raise HTTPException(status_code=404, detail="No leads to export")
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)

    buf = io.StringIO()
    fieldnames = [
        "id", "company", "role", "location", "employees", "budget",
        "status", "icp_score", "safety_check", "last_log", "score_breakdown",
    ]
    writer = csv.DictWriter(buf, fieldnames=fieldnames, extrasaction="ignore")
    writer.writeheader()
    writer.writerows(state["leads"])
    buf.seek(0)

    filename = f"nexus-leads-{datetime.now().strftime('%Y%m%d-%H%M%S')}.csv"
    return StreamingResponse(
        io.BytesIO(buf.getvalue().encode()),
<<<<<<< HEAD
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@app.get("/api/export/audit")
def export_audit():
    if not state["audit_trail"]:
<<<<<<< HEAD
<<<<<<< HEAD
        raise HTTPException(status_code=404, detail="No audit trail to export")
=======
        raise HTTPException(status_code=404, detail="No audit data to export")

>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
        raise HTTPException(status_code=404, detail="No audit data to export")

>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
    filename = f"nexus-audit-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
    content = json.dumps(state["audit_trail"], indent=2, default=str)
    return StreamingResponse(
        io.BytesIO(content.encode()),
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@app.post("/api/run-swarm")
def post_run_swarm():
    """Execute one agent step and return updated leads + recent logs."""
    _t0 = time.time()
    _run_swarm_step()
    elapsed_ms = round((time.time() - _t0) * 1000)
    add_log("SYSTEM", f"⚡ Swarm cycle complete in {elapsed_ms}ms", "info")
    return {
        "leads":        state["leads"],
        "logs":         state["logs"][:20],
        "execution_ms": elapsed_ms,
    }


@app.post("/api/reset")
def post_reset():
<<<<<<< HEAD
<<<<<<< HEAD
    state["leads"]        = _initial_leads()
    state["logs"]         = []
    state["pdf_text"]     = ""
    state["audit_trail"]  = []
    if os.path.exists(DB_PATH):
        try:
            conn = sqlite3.connect(DB_PATH)
            conn.execute("DELETE FROM app_state")
            conn.commit()
            conn.close()
        except Exception:
            pass
    add_log("SYSTEM", "🔄 System reset — all state cleared", "info")
    return {"status": "reset"}
=======
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
    global state
    state = _fresh_state()
    # Clear all persisted state from DB
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("DELETE FROM app_state")
        conn.commit()
        conn.close()
    except Exception:
        pass
    return {"ok": True, "message": "State reset to initial values."}


# ---------------------------------------------------------------------------
# HEALTH + ANALYTICS ENDPOINTS
# ---------------------------------------------------------------------------

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
            gemini_connected = False

    return {
        "status":            "online",
        "version":           os.getenv("APP_VERSION", "2.0.0"),
        "uptime":            f"{hours:02d}:{minutes:02d}:{seconds:02d}",
        "uptime_seconds":    uptime_seconds,
        "gemini_connected":  gemini_connected,
        "gemini_model":      "gemini-1.5-flash",
        "pdf_loaded":        bool(state["pdf_text"]),
        "pdf_chars":         len(state["pdf_text"]),
        "leads_total":       len(state["leads"]),
        "websocket_clients": len(manager.active_connections),
        "logs_count":        len(state["logs"]),
        "mode":              "REAL AI" if state["gemini_api_key"] else "SIMULATION",
    }


@app.get("/api/analytics")
def get_analytics():
    leads = state["leads"]
    total = len(leads)

    # Pipeline stage counts
    stages: dict = {"New": 0, "Scored": 0, "Nurtured": 0, "Opportunity": 0}
    for lead in leads:
        stages[lead["status"]] = stages.get(lead["status"], 0) + 1

    # Conversion rate
    opportunities   = stages.get("Opportunity", 0)
    conversion_rate = round((opportunities / total) * 100, 1) if total > 0 else 0

    # Average ICP score
    scored_leads = [l for l in leads if l["icp_score"] > 0]
    avg_icp = round(sum(l["icp_score"] for l in scored_leads) / len(scored_leads), 1) if scored_leads else 0

    # RAG hit rate (from audit trail log messages via terminal logs)
    professor_actions = [a for a in state["audit_trail"] if a["agent"] == "Professor"]
    rag_hits     = sum(1 for a in professor_actions if "RAG HIT" in str(a.get("detail", "")))
    rag_hit_rate = round((rag_hits / len(professor_actions)) * 100) if professor_actions else 0

    # Agent activity counts
    agent_counts: dict = {}
    for entry in state["audit_trail"]:
        agent = entry["agent"]
        agent_counts[agent] = agent_counts.get(agent, 0) + 1

    # Top scoring lead
    top_lead = max(leads, key=lambda l: l["icp_score"]) if leads else None

    return {
        "pipeline_stages":     stages,
        "conversion_rate":     conversion_rate,
        "avg_icp_score":       avg_icp,
        "rag_hit_rate":        rag_hit_rate,
        "total_agent_actions": len(state["audit_trail"]),
        "agent_activity":      agent_counts,
        "top_lead":            {"company": top_lead["company"], "score": top_lead["icp_score"]} if top_lead else None,
        "icp_match_rate":      87,
        "roi_multiplier":      4.2,
        "task_reduction":      40,
    }
<<<<<<< HEAD
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)


# ---------------------------------------------------------------------------
# DEV ENTRYPOINT
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn
<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======

>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
