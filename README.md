<<<<<<< HEAD
<<<<<<< HEAD
# 🧿 NexusAI | Autonomous Revenue Engine

<div align="center">

![NexusAI Banner](https://img.shields.io/badge/NexusAI-Autonomous%20Revenue%20Engine-00ff88?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzAwZmY4OCIgZD0iTTEyIDJMMiA3bDEwIDUgMTAtNS0xMC01ek0yIDE3bDEwIDUgMTAtNS0xMC01LTEwIDV6TTIgMTJsMTAgNSAxMC01LTEwLTUtMTAgNXoiLz48L3N2Zz4=)

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python)](https://python.org)
[![Gemini](https://img.shields.io/badge/Gemini-1.5%20Flash-4285F4?style=flat-square&logo=google)](https://deepmind.google/technologies/gemini/)
[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-00ff88?style=flat-square)](LICENSE)

**An enterprise-grade multi-agent AI platform that autonomously handles the entire B2B revenue pipeline — from lead scoring to CRM sync — without human intervention.**

[Demo Video](https://drive.google.com/file/d/1xKVY25qRkr2quzjEXji07cBUhNzDrkrl/view?usp=sharing) • [Architecture](#-architecture) • [API Docs](#-api-reference) • [Dataset](#-dataset)

</div>

---

## 🚨 The Problem

Mid-sized B2B enterprises in South India are hemorrhaging revenue due to three compounding failures:

### 1. Fragmented Marketing Workflows
Sales and marketing teams juggle 6-8 disconnected tools — CRM, email platform, compliance checker, content generator, lead scorer — each requiring manual data transfer. A single lead takes **4.2 hours of manual work** to move from raw data to a personalized outreach email.

### 2. Generic, Non-Personalized Outreach
94% of B2B cold emails are ignored because they're generic. Sales teams lack the bandwidth to research each prospect's specific pain points, regional threat landscape, and compliance obligations. The result: **23% ICP match rate** industry average vs the 87%+ achievable with AI-driven personalization.

### 3. Compliance Blind Spots
The Indian Digital Personal Data Protection (DPDP) Act 2023 and RBI Cybersecurity Framework create massive liability for enterprises running unaudited marketing campaigns. Manual compliance review adds **2-3 days** to every campaign cycle — or worse, gets skipped entirely.

### The Numbers
| Problem | Impact |
|---------|--------|
| Manual lead processing time | 4.2 hrs/lead |
| Average ICP match rate (industry) | 23% |
| Compliance review lag | 2-3 days/campaign |
| Revenue lost to slow pipeline | ₹2.4 CR avg/quarter |
| DPDP violation penalty exposure | Up to ₹250 CR/incident |

---

## 💡 The Solution — NexusAI

NexusAI deploys a **4-agent autonomous swarm** that runs the entire B2B revenue pipeline in under 2 seconds per lead:

```
RAW LEAD → [HUNTER] → [GUARDIAN] → [PROFESSOR] → [CLOSER] → CRM OPPORTUNITY
              Score      Comply       Personalize     Sync
              45ms       120ms        1800ms          300ms
                    Total: < 2.3 seconds
```

### The Four Agents

| Agent | Role | What It Does |
|-------|------|-------------|
| 🎯 **Hunter** | ICP Scoring | Scores leads using weighted formula across role, location, company size, and budget. No more gut-feel qualification. |
| 🛡️ **Guardian** | Ethics & Compliance | Runs 5 automated checks — PII scan, bias audit, role fairness, data completeness, DPDP compliance — before any outreach. |
| 🧠 **Professor** | RAG Content Generation | Uses your uploaded PDF (threat reports, product docs, case studies) to generate hyper-personalized email subjects and bodies via Gemini 1.5 Flash. |
| 💰 **Closer** | CRM Sync | Automatically creates Salesforce opportunities for qualified leads with full context, deal value, and next actions. |

---

## 🎯 Target Outcomes

| Metric | Before NexusAI | After NexusAI | Improvement |
|--------|---------------|---------------|-------------|
| Lead processing time | 4.2 hrs | < 2.3 seconds | **99.9% faster** |
| ICP match rate | 23% | 87% | **+64 points** |
| Lead-to-opportunity conversion | Baseline | +30% uplift | **30% increase** |
| Manual marketing tasks | 100% | 60% | **40% reduction** |
| Compliance review time | 2-3 days | Instant | **100% automated** |
| ROI vs manual workflow | 1x | 4.2x | **320% ROI** |
| DPDP violations | Risk exposure | Zero | **Zero violations** |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        NEXUSAI PLATFORM                         │
├─────────────────────────┬───────────────────────────────────────┤
│      FRONTEND           │            BACKEND                    │
│   React + Vite          │         FastAPI (Python)              │
│   Tailwind CSS          │                                       │
│   Framer Motion         │  ┌─────────────────────────────────┐  │
│   Recharts              │  │         AGENT SWARM             │  │
│                         │  │  Hunter → Guardian → Professor  │  │
│  ┌──────────────────┐   │  │              → Closer           │  │
│  │  Anti-Gravity UI │   │  └─────────────────────────────────┘  │
│  │  Glassmorphism   │   │                                       │
│  │  3D Tilt Cards   │◄──┼──►  WebSocket (Real-time logs)       │
│  │  Particle Field  │   │                                       │
│  │  Matrix Terminal │   │  ┌─────────────────────────────────┐  │
│  └──────────────────┘   │  │          RAG ENGINE             │  │
│                         │  │  PyPDF2 → Text Chunking →       │  │
│  Port: 5173             │  │  Location Match → Gemini 1.5    │  │
│                         │  └─────────────────────────────────┘  │
│                         │                                       │
│                         │  ┌─────────────────────────────────┐  │
│                         │  │       PERSISTENCE               │  │
│                         │  │  SQLite DB + In-Memory State    │  │
│                         │  └─────────────────────────────────┘  │
│                         │                                       │
│                         │  Port: 8000                          │
└─────────────────────────┴───────────────────────────────────────┘
```

### Data Flow
```
1. User uploads PDF (South India Cyber Report)
   └─► PyPDF2 extracts text → stored in RAG context

2. User clicks "Launch Swarm" 
   └─► POST /api/run-swarm

3. Hunter Agent fires
   └─► Weighted ICP score = (Role×0.30) + (Location×0.25) + (Size×0.25) + (Budget×0.20)
   └─► Lead status: New → Scored

4. Guardian Agent fires
   └─► 5 compliance checks (PII, Bias, Fairness, Completeness, DPDP)
   └─► Lead status: Scored → Compliance Passed

5. Professor Agent fires
   └─► RAG: searches PDF for lead's city name
   └─► If RAG HIT: uses local threat context for Gemini prompt
   └─► Gemini 1.5 Flash generates subject line + 3-paragraph email body
   └─► Lead status: Passed → Nurtured

6. Closer Agent fires
   └─► Simulates Salesforce API sync
   └─► Lead status: Nurtured → Opportunity

7. WebSocket broadcasts each log entry to frontend in real-time
8. SQLite persists state so server restarts don't lose data
```

---

## 📁 File Structure

```
nexus-ai/
│
├── 📁 backend/                          # FastAPI Python backend
│   ├── 🐍 main.py                       # Main FastAPI app, all endpoints, agent orchestration
│   ├── 📄 requirements.txt              # Python dependencies
│   ├── 🔐 .env                          # Environment variables (git-ignored)
│   ├── 🔐 .env.example                  # Environment template (safe to commit)
│   ├── 🗄️  nexus.db                     # SQLite database (auto-created, git-ignored)
│   │
│   ├── 📁 agents/                       # Individual agent modules
│   │   ├── 🐍 __init__.py
│   │   ├── 🎯 hunter.py                 # ICP scoring logic
│   │   ├── 🛡️  guardian.py              # Compliance & ethics checks
│   │   ├── 🧠 professor.py             # RAG + Gemini content generation
│   │   └── 💰 closer.py                # CRM sync simulation
│   │
│   └── 📁 data/                         # Static data files
│       ├── 📊 leads.json                # 8 pre-loaded South India enterprise leads
│       ├── 📧 email_templates.json      # Location-specific email templates (simulation mode)
│       ├── 📋 audit_trail_seed.json     # Pre-seeded audit history for demo
│       ├── 📄 south_india_cyber_report.txt  # RAG source document (plain text)
│       └── 📄 south_india_cyber_report.pdf  # RAG source document (upload this in app)
│
├── 📁 frontend/                         # React + Vite frontend
│   ├── 📁 src/
│   │   ├── ⚛️  App.jsx                  # Main dashboard — all tabs, state, API calls
│   │   ├── 🎨 main.jsx                  # React DOM entry point
│   │   ├── 🎨 index.css                 # Global styles, CSS variables, scrollbar, keyframes
│   │   │
│   │   └── 📁 components/
│   │       ├── 🃏 FloatingCard.jsx      # Glassmorphism card with 3D tilt + anti-gravity float
│   │       ├── 💻 TerminalLog.jsx       # Animated cyber terminal with Matrix rain background
│   │       ├── 📡 ICPRadar.jsx          # Recharts radar chart with 3D entrance animation
│   │       ├── ✨ ParticleField.jsx     # Animated particle background with orb glows
│   │       └── 🔄 AgentPipeline.jsx     # Visual agent flow pipeline with status indicators
│   │
│   ├── 📄 index.html                    # HTML entry point, Google Fonts (Orbitron + JetBrains Mono)
│   ├── ⚙️  vite.config.js               # Vite build configuration
│   ├── 🎨 tailwind.config.js            # Tailwind with cyber theme colors and custom keyframes
│   ├── 📦 package.json                  # NPM dependencies
│   └── ⚙️  postcss.config.js            # PostCSS for Tailwind
│
├── 🐍 create_pdf.py                     # Utility: converts .txt report to PDF via reportlab
├── 📄 README.md                         # This file
└── 🔐 .gitignore                        # Ignores node_modules, .env, venv, nexus.db
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.10+ | Core language |
| **FastAPI** | 0.110+ | Async REST API framework |
| **Uvicorn** | Latest | ASGI server with hot reload |
| **WebSockets** | Built-in | Real-time log streaming to frontend |
| **SQLite3** | Built-in | Persistent state storage |
| **Pydantic v2** | Latest | Request/response validation |

### AI & Data
| Technology | Version | Purpose |
|------------|---------|---------|
| **Google Gemini 1.5 Flash** | Latest | LLM for email content generation |
| **google-generativeai** | Latest | Gemini Python SDK |
| **PyPDF2** | 3.0+ | PDF text extraction for RAG engine |
| **python-multipart** | Latest | File upload handling |
| **python-dotenv** | Latest | Environment variable management |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2 | UI component framework |
| **Vite** | 5.2 | Build tool and dev server |
| **Framer Motion** | 11.0 | Anti-gravity animations, 3D tilt, stagger effects |
| **Recharts** | 2.12 | ICP Radar Chart visualization |
| **Tailwind CSS** | 3.4 | Utility-first styling with cyber theme |
| **PostCSS** | 8.4 | CSS processing pipeline |

### Fonts & Design
| Resource | Purpose |
|----------|---------|
| **Orbitron** (Google Fonts) | Futuristic display headings |
| **JetBrains Mono** (Google Fonts) | Terminal/code monospace text |
| **Exo 2** (Google Fonts) | UI body text |

### DevOps & Utilities
| Technology | Purpose |
|------------|---------|
| **reportlab** | PDF generation for RAG knowledge base |
| **Git + GitHub** | Version control |
| **CORS Middleware** | Cross-origin requests between ports 8000 and 5173 |

---

## 📦 Libraries Deep Dive

### Backend Libraries (`requirements.txt`)

```
fastapi              # Web framework — async endpoints, dependency injection, auto docs
uvicorn[standard]    # ASGI server — handles HTTP + WebSocket simultaneously
google-generativeai  # Gemini SDK — model config, content generation, safety settings
PyPDF2               # PDF parsing — page iteration, text extraction for RAG
python-multipart     # Enables FastAPI to accept multipart/form-data (file uploads)
pydantic             # Data validation — request models, response schemas
python-dotenv        # Loads .env file into os.environ on startup
sqlite3              # Built-in Python — persistent lead/log/audit storage
csv                  # Built-in Python — CSV export endpoint
io                   # Built-in Python — in-memory file streaming for downloads
asyncio              # Built-in Python — WebSocket broadcasting, async tasks
re                   # Built-in Python — PII regex detection in Guardian agent
random               # Built-in Python — simulation mode template selection
json                 # Built-in Python — data file loading, WebSocket messages
```

### Frontend Libraries (`package.json`)

```
react                # Core UI library — hooks, state, component lifecycle
react-dom            # DOM rendering — ReactDOM.createRoot
framer-motion        # Animation engine:
                     #   motion.div — animated elements
                     #   AnimatePresence — mount/unmount animations
                     #   useMotionValue — 3D tilt tracking
                     #   useTransform — map mouse position to rotation
                     #   useSpring — physics-based smooth animations
recharts             # Chart library:
                     #   RadarChart — ICP analysis visualization
                     #   PolarGrid, PolarAngleAxis — radar structure
                     #   Radar — data fill with neon green styling
                     #   ResponsiveContainer — fluid sizing
                     #   Tooltip — custom glassmorphism tooltip
tailwindcss          # Utility CSS — all layout, spacing, colors
@vitejs/plugin-react # Vite plugin — JSX transform, Fast Refresh HMR
autoprefixer         # PostCSS plugin — vendor prefix injection
postcss              # CSS transform pipeline
vite                 # Build tool — dev server, HMR, production bundling
```

---

## 📊 Dataset

The project includes pre-built datasets for immediate demo use:

### `leads.json` — 8 South India Enterprise Leads
| ID | Company | Role | Location | Employees | Budget |
|----|---------|------|----------|-----------|--------|
| L-101 | Vizag Pharma Industries | CISO | Visakhapatnam | 1,200 | ₹150L |
| L-102 | Hyderabad FinCorp | IT Director | Hyderabad | 800 | ₹120L |
| L-103 | Vijayawada Retail Group | CISO | Vijayawada | 2,000 | ₹200L |
| L-104 | Andhra Logistics Hub | IT Director | Andhra Pradesh | 600 | ₹90L |
| L-105 | Bengaluru TechScale | CTO | Bengaluru | 450 | ₹180L |
| L-106 | Chennai Steel Works | Security Manager | Chennai | 3,500 | ₹250L |
| L-107 | Kochi Port Authority IT | CISO | Kochi | 950 | ₹300L |
| L-108 | Tirupati EdTech | IT Director | Tirupati | 320 | ₹60L |

### `south_india_cyber_report.pdf` — RAG Knowledge Base
9-section threat intelligence report containing:
- City-specific threat data for all 8 lead locations
- Active threat actor profiles (LockBit 3.0, APT41, RansomHub, Lazarus Group)
- Real CVE numbers (CVE-2024-22125, CVE-2024-35783)
- DPDP Act / RBI / PCI-DSS compliance deadlines
- Financial impact figures in INR

### `email_templates.json` — Simulation Mode Content
Location-specific email subjects (4 per city × 8 cities) and full 3-paragraph email bodies for when Gemini API key is not provided.

### `audit_trail_seed.json` — Pre-seeded Audit Log
7 demo audit entries showing a complete Hunter → Guardian → Professor → Closer cycle for immediate demo presentation.

---

## 🔌 API Reference

Base URL: `http://localhost:8000`

Interactive docs: `http://localhost:8000/docs` (Swagger UI auto-generated)

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | System health, uptime, Gemini status, PDF status |
| `GET` | `/api/leads` | All 8 leads with current pipeline status |
| `GET` | `/api/logs` | Full swarm activity log (newest first) |
| `GET` | `/api/audit` | Immutable audit trail with agent actions |
| `GET` | `/api/analytics` | Conversion rates, ICP scores, RAG hit rate |
| `GET` | `/api/export/csv` | Download leads as CSV file |
| `GET` | `/api/export/audit` | Download audit trail as JSON |
| `POST` | `/api/config` | Set Gemini API key → switches to Real AI mode |
| `POST` | `/api/upload` | Upload PDF for RAG engine (max 10MB) |
| `POST` | `/api/run-swarm` | Execute one agent step in the pipeline |
| `POST` | `/api/reset` | Reset all leads to initial state |
| `WS` | `/ws/logs` | WebSocket — real-time log streaming |

### Example Responses

**`GET /health`**
```json
{
  "status": "online",
  "version": "2.0.0",
  "uptime": "00:45:12",
  "gemini_connected": false,
  "gemini_model": "gemini-1.5-flash",
  "pdf_loaded": true,
  "pdf_chars": 14231,
  "leads_total": 8,
  "mode": "SIMULATION"
}
```

**`GET /api/analytics`**
```json
{
  "pipeline_stages": {"New": 2, "Scored": 1, "Nurtured": 2, "Opportunity": 3},
  "conversion_rate": 37.5,
  "avg_icp_score": 84.2,
  "rag_hit_rate": 75,
  "total_agent_actions": 18,
  "top_lead": {"company": "Kochi Port Authority IT", "score": 92}
}
```

---

## 🧠 ICP Scoring Formula

The Hunter Agent uses a weighted multi-factor formula:

```python
final_score = (
    role_score    * 0.30 +   # Seniority of decision maker
    location_score * 0.25 +  # Cyber threat exposure by city
    employee_score * 0.25 +  # Company size (larger = better ICP)
    budget_score  * 0.20     # Available budget for solution
)
```

### Weight Tables
```
ROLE WEIGHTS          LOCATION WEIGHTS      EMPLOYEE TIERS
CISO        → 100    Hyderabad    → 100    5000+   → 100
CTO         → 95     Bengaluru    → 95     2000+   → 92
VP Eng      → 88     Chennai      → 88     1000+   → 85
IT Director → 80     Kochi        → 85     500+    → 75
Sec Manager → 72     Visakhapatnam→ 85     200+    → 62
IT Manager  → 65     Vijayawada   → 78     0+      → 48
                     Andhra Pradesh→ 72
```

---

## 🛡️ Guardian Agent — 5 Compliance Checks

```
CHECK 1: PII Scan
└─► Regex search for email, phone, Aadhaar, card numbers in lead data
└─► Result: Clean / PII FOUND (blocks processing)

CHECK 2: Bias Audit  
└─► Score variance across all leads must be < 40 points
└─► Detects if algorithm systematically disadvantages any location

CHECK 3: Role Fairness
└─► All roles must score above 50 points
└─► Prevents discriminatory scoring based on job title

CHECK 4: Data Completeness
└─► company, role, location, employees, budget must all be present
└─► Prevents outreach to incomplete/phantom leads

CHECK 5: DPDP Compliance
└─► B2B enterprise data is exempt from DPDP Act (verified)
└─► Ensures legal basis for processing before any outreach
```

---

## ⚙️ Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm 9+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/thoufiq2326/NexusAI.git
cd NexusAI
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
copy .env.example .env
# Edit .env and add your Gemini API key (optional — simulation mode works without it)
```

### 3. Start the Backend
```bash
uvicorn main:app --reload --port 8000
```

Expected output:
```
INFO:     Started server process
INFO:     Waiting for application startup
INFO:     ✅ Loaded 8 leads from leads.json
INFO:     ✅ Loaded 7 audit entries from seed file
INFO:     Application startup complete
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 4. Frontend Setup
```bash
# New terminal
cd frontend
=======
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
# 🧿 NexusAI — Autonomous Revenue Engine

A multi-agent AI sales pipeline with a FastAPI backend and a React/Vite frontend.

---

## Quick Start

### Terminal 1 — Backend

```bash
cd nexus-ai/backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API runs at **http://localhost:8000**

### Terminal 2 — Frontend

```bash
cd nexus-ai/frontend
<<<<<<< HEAD
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
npm install
npm run dev
```

<<<<<<< HEAD
<<<<<<< HEAD
Expected output:
```
VITE v5.x ready in 1134ms
➜ Local: http://localhost:5173/
```

### 5. Open the App
Navigate to **`http://localhost:5173`**

### 6. Upload the RAG Knowledge Base
1. Open the sidebar (click left edge of screen)
2. Find **KNOWLEDGE BASE** section
3. Drag and drop `backend/data/south_india_cyber_report.pdf`
4. Wait for: **✅ 14,231 CHARS INDEXED**

### 7. Launch the Swarm
Click **⚡ LAUNCH SWARM CYCLE** and watch the agents fire in real-time.

---

## 🔐 Environment Variables

Create `backend/.env`:

```env
# AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here   # Optional — simulation mode works without this

# Server Configuration  
ALLOWED_ORIGINS=http://localhost:5173     # Comma-separated for multiple origins
APP_VERSION=2.0.0
SECRET_KEY=nexus-ai-secret-2024

# Leave GEMINI_API_KEY empty to use simulation mode with pre-built templates
```

Get a free Gemini API key at: https://aistudio.google.com/app/apikey

---

## 🎮 Usage Guide

### Simulation Mode (No API Key Required)
Works out of the box. The Professor Agent uses pre-built location-specific email templates from `email_templates.json`. Perfect for demos.

### Real AI Mode (With Gemini API Key)
1. Open sidebar → Brain Configuration
2. Paste your Gemini API key
3. Click Save
4. Professor Agent now generates unique emails via Gemini 1.5 Flash

### Autopilot Mode
Toggle **AUTONOMOUS MODE** in the sidebar. The swarm runs continuously, processing one lead per cycle automatically.

### Export Results
- **CRM GRID tab** → Click **DOWNLOAD CSV** to export all leads
- **AUDIT LOG tab** → Click **EXPORT AUDIT** to download compliance trail

---

## 🔍 Verification & Testing

### Quick Health Check
```bash
curl http://localhost:8000/health
```

### Full System Verify
```bash
curl http://localhost:8000/api/verify
```

### Run Complete Pipeline Test
```bash
# Windows PowerShell
1..32 | ForEach-Object { Invoke-RestMethod -Method Post -Uri "http://localhost:8000/api/run-swarm" }

# Mac/Linux
for i in {1..32}; do curl -s -X POST http://localhost:8000/api/run-swarm; done

# Then verify all leads reached Opportunity status
curl http://localhost:8000/api/analytics
```

Expected final state: `"conversion_rate": 100.0` and all 8 leads at `"Opportunity"` status.

---

## 🗺️ Roadmap

- [ ] Real Salesforce API integration (replacing simulation)
- [ ] Vector embeddings for semantic RAG (replacing string matching)
- [ ] Multi-tenant JWT authentication
- [ ] LinkedIn Sales Navigator data ingestion
- [ ] Slack/Teams notification webhooks for new opportunities
- [ ] A/B testing for email subject lines
- [ ] Full Celery + Redis task queue for enterprise scale
- [ ] Mobile responsive UI

---

## 👥 Team ORBIT

Built for **INNOVETEX** — 2026

| Name | Role |
|------|------|
| Devesh | Backend Architecture + Agent Logic |
| Thoufiq | Frontend Development + UI/UX |

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ⚡ by the NexusAI team**

*Turning raw leads into revenue — autonomously.*

`🧿 NexusAI v2.0.0`

</div>
=======
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
UI runs at **http://localhost:5173**

---

## Usage

1. Open **http://localhost:5173** in your browser
2. Click **⚙ CONFIG** in the navbar to:
   - (Optional) Paste a **Gemini API key** for real AI content generation
   - Upload a **PDF report** to unlock the Professor agent's RAG pipeline
3. Click **▶ LAUNCH SWARM CYCLE** (or enable **Autopilot**) to step through the agent pipeline:
   - **Hunter** → scores the first `New` lead (ICP: 95%)
   - **Guardian** → runs compliance audit on the scored lead
   - **Professor** → RAG-searches the PDF and generates a personalised email subject
   - **Closer** → promotes the lead to `Opportunity` and syncs to CRM
4. Monitor progress in the **TERMINAL** tab; explore **RADAR**, **CONTENT ENGINE**, **AUDIT LOG**, and **CRM GRID** tabs

---

## Agent Pipeline

```
New Lead → [HUNTER: ICP Score] → [GUARDIAN: Compliance] → [PROFESSOR: RAG + Content] → [CLOSER: Opportunity]
```

| Agent    | Trigger                          | Output                          |
|----------|----------------------------------|---------------------------------|
| Hunter   | Lead `status = New`              | `icp_score = 95`, `status = Scored` |
| Guardian | Lead `Scored` + `safety = Pending` | `safety_check = Passed`       |
| Professor | Lead `Scored` + `safety = Passed` + PDF uploaded | Email subject, `status = Nurtured` |
| Closer   | Lead `status = Nurtured`         | `status = Opportunity`          |

---

## Stack

| Layer    | Tech                                      |
|----------|-------------------------------------------|
| Backend  | Python, FastAPI, Uvicorn, PyPDF2, google-generativeai |
| Frontend | React 18, Vite, Framer Motion, Recharts, Tailwind CSS |

---

## Project Structure

```
nexus-ai/
├── backend/
│   ├── main.py              # FastAPI app + agent logic
│   ├── requirements.txt
│   ├── agents/              # Agent module stubs
│   └── data/leads.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── FloatingCard.jsx   # 3D tilt glassmorphism card
    │   │   ├── TerminalLog.jsx    # Animated agent log viewer
    │   │   ├── ICPRadar.jsx       # Recharts radar chart
    │   │   └── ParticleField.jsx  # Ambient particle background
    │   ├── App.jsx                # Main dashboard
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```
<<<<<<< HEAD
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
=======
>>>>>>> 763ace4 (feat: NexusAI full stack — FastAPI backend + React frontend with glassmorphism UI, 4-agent swarm, RAG engine, WebSocket logs, SQLite persistence)
