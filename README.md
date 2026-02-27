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
npm install
npm run dev
```

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
