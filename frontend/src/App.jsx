/**
 * App.jsx — NexusAI Command Centre (slim orchestrator)
 *
 * ┌─────────────────────────────────────────────────────────┐
 * │  Structure                                               │
 * │  ├── <div> ROOT WRAPPER                                 │
 * │  │   ├── BootSequence (once per session)                │
 * │  │   ├── Custom cursor dots                             │
 * │  │   ├── Scanline + corner-bracket overlays             │
 * │  │   ├── ParticleField (ambient bg)                     │
 * │  │   └── <div> CONTENT LAYER z-10                       │
 * │  │       ├── <NavBar>                                   │
 * │  │       ├── <Sidebar>   (slide-in panel)               │
 * │  │       ├── Sidebar edge-tab button                    │
 * │  │       └── <motion.div> MAIN CONTENT                  │
 * │  │           ├── HERO (title + tagline + stat pills)    │
 * │  │           ├── <MetricsRow>                           │
 * │  │           ├── <AgentPipeline>                        │
 * │  │           ├── <TabBar>                               │
 * │  │           └── <TabContent>                           │
 * │  └── Floating ⚡ launch button (position: fixed)         │
 * └─────────────────────────────────────────────────────────┘
 */
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import AgentPipeline from "./components/AgentPipeline";
import BootSequence from "./components/BootSequence";
import MetricsRow from "./components/MetricsRow";
import NavBar from "./components/NavBar";
import ParticleField from "./components/ParticleField";
import Sidebar from "./components/Sidebar";
import TabBar from "./components/TabBar";
import TabContent from "./components/TabContent";

const API = "http://localhost:8000";
const TABS = ["TERMINAL", "RADAR", "CONTENT ENGINE", "AUDIT LOG", "CRM GRID"];

// ── Typewriter tagline constant ──────────────────────────────────────────────
const TAGLINE = "AUTONOMOUS REVENUE INTELLIGENCE — POWERED BY MULTI-AGENT AI";

export default function App() {
    // ── State ─────────────────────────────────────────────────────────────
    const [leads, setLeads] = useState([]);
    const [logs, setLogs] = useState([]);
    const [status, setStatus] = useState({});
    const [activeTab, setActiveTab] = useState("TERMINAL");
    const [autopilot, setAutopilot] = useState(false);
    const [swarmRunning, setSwarmRunning] = useState(false);
    const [activeAgent, setActiveAgent] = useState(null);
    const [completedAgents, setCompletedAgents] = useState([]);
    const [geminiKey, setGeminiKey] = useState("");
    const [pdfLabel, setPdfLabel] = useState("No file chosen");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [swarmSpeed, setSwarmSpeed] = useState(3);
    const [healthState, setHealthState] = useState({});
    const [analytics, setAnalytics] = useState({ icp_match_rate: 87, roi_multiplier: 4.2, avg_icp_score: 0 });
    const [auditTrail, setAuditTrail] = useState([]);

    // Boot sequence (once per session)
    const [booted, setBooted] = useState(() => sessionStorage.getItem("nexus-booted") === "1");
    const handleBootComplete = () => { sessionStorage.setItem("nexus-booted", "1"); setBooted(true); };

    // Autopilot ref (avoids stale closure in setInterval)
    const intervalRef = useRef(null);

    // ── Custom cursor ──────────────────────────────────────────────────────
    const cursorDotRef = useRef(null);
    const cursorRingRef = useRef(null);
    useEffect(() => {
        const dot = cursorDotRef.current;
        const ring = cursorRingRef.current;
        if (!dot || !ring) return;
        const onMove = e => { dot.style.left = `${e.clientX}px`; dot.style.top = `${e.clientY}px`; ring.style.left = `${e.clientX}px`; ring.style.top = `${e.clientY}px`; };
        const onEnter = e => { if (e.target.closest("button, [data-hover]")) ring.classList.add("hovered"); };
        const onLeave = () => ring.classList.remove("hovered");
        window.addEventListener("mousemove", onMove);
        document.addEventListener("mouseover", onEnter);
        document.addEventListener("mouseout", onLeave);
        return () => { window.removeEventListener("mousemove", onMove); document.removeEventListener("mouseover", onEnter); document.removeEventListener("mouseout", onLeave); };
    }, []);

    // ── Typewriter tagline ─────────────────────────────────────────────────
    const [tagline, setTagline] = useState("");
    const [taglineDone, setTaglineDone] = useState(false);
    useEffect(() => {
        const startDelay = setTimeout(() => {
            let i = 0;
            const timer = setInterval(() => {
                i++;
                setTagline(TAGLINE.slice(0, i));
                if (i >= TAGLINE.length) { clearInterval(timer); setTaglineDone(true); }
            }, 35);
            return () => clearInterval(timer);
        }, 800);
        return () => clearTimeout(startDelay);
    }, []);

    // ── Keyboard shortcuts 1-5 → tabs ──────────────────────────────────────
    useEffect(() => {
        const handler = e => {
            if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
            const idx = parseInt(e.key, 10) - 1;
            if (idx >= 0 && idx < TABS.length) setActiveTab(TABS[idx]);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    // ── Data fetchers ───────────────────────────────────────────────────────
    const fetchAll = useCallback(async () => {
        try {
            const [l, s] = await Promise.all([
                fetch(`${API}/api/leads`).then(r => r.json()),
                fetch(`${API}/api/status`).then(r => r.json()),
            ]);
            setLeads(l);
            setStatus(s);
        } catch { /* backend offline – silent */ }
        fetch(`${API}/health`).then(r => r.json()).then(setHealthState).catch(() => { });
        fetch(`${API}/api/analytics`).then(r => r.json()).then(setAnalytics).catch(() => { });
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // ── Audit trail refresh whenever logs change ────────────────────────────
    useEffect(() => {
        fetch(`${API}/api/audit`).then(r => r.json()).then(setAuditTrail).catch(() => { });
    }, [logs]);

    // ── WebSocket — live log streaming (fallback to 2s poll) ──────────────
    useEffect(() => {
        let fallbackInterval = null;
        const ws = new WebSocket("ws://localhost:8000/ws/logs");
        ws.onopen = () => { if (fallbackInterval) { clearInterval(fallbackInterval); fallbackInterval = null; } };
        ws.onmessage = event => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === "init") setLogs(data.logs);
                else if (data.type === "new_log") setLogs(prev => [data.log, ...prev].slice(0, 100));
            } catch { /* malformed frame */ }
        };
        ws.onclose = () => {
            fallbackInterval = setInterval(() => {
                fetch(`${API}/api/logs`).then(r => r.json()).then(setLogs).catch(() => { });
            }, 2000);
        };
        ws.onerror = () => ws.close();
        return () => { ws.close(); if (fallbackInterval) clearInterval(fallbackInterval); };
    }, []);

    // ── Autopilot polling ──────────────────────────────────────────────────
    useEffect(() => {
        if (autopilot) intervalRef.current = setInterval(runSwarm, 2000);
        else clearInterval(intervalRef.current);
        return () => clearInterval(intervalRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autopilot]);

    // ── Swarm action ───────────────────────────────────────────────────────
    const runSwarm = useCallback(async () => {
        if (swarmRunning) return;
        setSwarmRunning(true);
        setCompletedAgents([]);
        const SEQUENCE = ["hunter", "guardian", "professor", "closer"];
        try {
            const fetchPromise = fetch(`${API}/api/run-swarm`, { method: "POST" }).then(r => r.json());
            for (const agent of SEQUENCE) {
                setActiveAgent(agent);
                await new Promise(r => setTimeout(r, 800));
                setCompletedAgents(prev => [...prev, agent]);
            }
            setActiveAgent(null);
            const data = await fetchPromise;
            setLeads(data.leads);
            setLogs(data.logs);
            const s = await fetch(`${API}/api/status`).then(r => r.json());
            setStatus(s);
        } catch { /* silent */ }
        finally { setSwarmRunning(false); setActiveAgent(null); }
    }, [swarmRunning]);

    // ── Config save ────────────────────────────────────────────────────────
    async function saveConfig() {
        await fetch(`${API}/api/config`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ gemini_api_key: geminiKey }) });
        fetchAll();
    }

    // ── PDF upload (returns result for Sidebar to display) ─────────────────
    async function uploadPDF(file) {
        if (!file) return null;
        setPdfLabel(file.name);
        const fd = new FormData();
        fd.append("file", file);
        try {
            const res = await fetch(`${API}/api/upload`, { method: "POST", body: fd });
            const data = await res.json();
            if (!res.ok) { setPdfLabel("Upload failed"); return { error: data.detail ?? "Upload failed" }; }
            setPdfLabel(`✅ ${data.filename}`);
            fetchAll();
            return data;
        } catch (e) {
            setPdfLabel("Network error");
            return { error: String(e) };
        }
    }

    // ── Reset ──────────────────────────────────────────────────────────────
    async function resetSystem() {
        await fetch(`${API}/api/reset`, { method: "POST" });
        setPdfLabel("No file chosen");
        fetchAll();
    }

    // ── Derived ────────────────────────────────────────────────────────────
    const nurturedLeads = leads.filter(l => l.status === "Nurtured" || l.status === "Opportunity");

    // ── Render ─────────────────────────────────────────────────────────────
    return (
        <div
            style={{ background: "#0a0a0f", minHeight: "100vh", overflowX: "hidden", color: "#ffffff", fontFamily: "'Segoe UI', sans-serif" }}
        >
            {/* Boot overlay */}
            {!booted && <BootSequence onComplete={handleBootComplete} />}

            {/* Custom cursor */}
            <div ref={cursorDotRef} className="cursor" />
            <div ref={cursorRingRef} className="cursor-ring" />

            {/* Scanline overlay */}
            <div style={{ position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none", background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)", animation: "scan 10s linear infinite" }} />

            {/* Corner brackets */}
            <div style={{ position: "fixed", top: 16, left: 16, width: 50, height: 50, zIndex: 3, pointerEvents: "none", borderTop: "2px solid rgba(0,255,136,0.4)", borderLeft: "2px solid rgba(0,255,136,0.4)", borderRadius: "4px 0 0 0" }} />
            <div style={{ position: "fixed", top: 16, right: 16, width: 50, height: 50, zIndex: 3, pointerEvents: "none", borderTop: "2px solid rgba(0,229,255,0.4)", borderRight: "2px solid rgba(0,229,255,0.4)", borderRadius: "0 4px 0 0" }} />
            <div style={{ position: "fixed", bottom: 16, left: 16, width: 50, height: 50, zIndex: 3, pointerEvents: "none", borderBottom: "2px solid rgba(0,255,136,0.4)", borderLeft: "2px solid rgba(0,255,136,0.4)", borderRadius: "0 0 0 4px" }} />
            <div style={{ position: "fixed", bottom: 16, right: 16, width: 50, height: 50, zIndex: 3, pointerEvents: "none", borderBottom: "2px solid rgba(0,229,255,0.4)", borderRight: "2px solid rgba(0,229,255,0.4)", borderRadius: "0 0 4px 0" }} />

            {/* Ambient background */}
            <ParticleField />

            {/* ── CONTENT LAYER z-10 ── */}
            <div style={{ position: "relative", zIndex: 10 }}>

                <NavBar
                    autopilot={autopilot}
                    healthState={healthState}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    onReset={resetSystem}
                />

                <Sidebar
                    isOpen={sidebarOpen}
                    geminiKey={geminiKey}
                    setGeminiKey={setGeminiKey}
                    saveConfig={saveConfig}
                    uploadPDF={uploadPDF}
                    pdfLabel={pdfLabel}
                    status={status}
                    autopilot={autopilot}
                    setAutopilot={setAutopilot}
                    swarmSpeed={swarmSpeed}
                    setSwarmSpeed={setSwarmSpeed}
                    logs={logs}
                />

                {/* Sidebar edge-tab */}
                <motion.button
                    onClick={() => setSidebarOpen(v => !v)}
                    animate={{ x: sidebarOpen ? 280 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{
                        position: "fixed", left: 0, top: "50%", transform: "translateY(-50%)",
                        zIndex: 51, width: 22, height: 64,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: "rgba(2,5,9,0.85)", backdropFilter: "blur(12px)",
                        border: "1px solid rgba(0,255,136,0.2)", borderLeft: "none",
                        borderRadius: "0 6px 6px 0", color: "rgba(0,255,136,0.7)",
                        fontSize: 11, cursor: "pointer",
                    }}
                >
                    {sidebarOpen ? "◀" : "▶"}
                </motion.button>

                {/* ── MAIN CONTENT ── */}
                <motion.div
                    animate={{ marginLeft: sidebarOpen ? 280 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{ padding: "32px 24px 120px", maxWidth: 1400, margin: "0 auto" }}
                >
                    {/* HERO */}
                    <div style={{ perspective: "1000px", marginBottom: 40 }}>
                        <h1 style={{ margin: 0, lineHeight: 1, letterSpacing: "0.06em", display: "flex", flexWrap: "wrap" }}>
                            {"COMMAND CENTER".split("").map((ch, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 60, rotateX: -90, filter: "blur(8px)" }}
                                    animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
                                    transition={{ delay: i * 0.04, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                    style={{ display: "inline-block", fontFamily: "'Orbitron', monospace", fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 900, color: "#00ff88", textShadow: "0 0 30px rgba(0,255,136,0.5)", transformOrigin: "bottom" }}
                                >
                                    {ch === " " ? "\u00A0" : ch}
                                </motion.span>
                            ))}
                        </h1>

                        {/* Typewriter tagline */}
                        <div style={{ marginTop: 16, fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(10px, 1.1vw, 13px)", color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", minHeight: 20 }}>
                            {tagline}
                            {!taglineDone && (
                                <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.7, repeat: Infinity }} style={{ color: "#00ff88" }}>|</motion.span>
                            )}
                        </div>

                        {/* Stat pills */}
                        <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
                            {[
                                { label: "30% CONVERSION UPLIFT", color: "0,255,136" },
                                { label: "40% TASK REDUCTION", color: "0,212,255" },
                                { label: "4.2x ROI", color: "255,200,0" },
                            ].map((pill, i) => (
                                <motion.div
                                    key={pill.label}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.4 + i * 0.15, duration: 0.4, ease: "easeOut" }}
                                    whileHover={{ scale: 1.05, boxShadow: `0 0 24px rgba(${pill.color},0.5)` }}
                                    style={{ padding: "6px 16px", border: `1px solid rgba(${pill.color},0.4)`, borderRadius: 999, background: `rgba(${pill.color},0.07)`, backdropFilter: "blur(8px)", fontFamily: "'Exo 2', sans-serif", fontSize: 11, fontWeight: 600, color: `rgba(${pill.color},0.9)`, letterSpacing: "0.08em", cursor: "default", boxShadow: `0 0 12px rgba(${pill.color},0.15)` }}
                                >
                                    {pill.label}
                                </motion.div>
                            ))}
                        </div>
                    </div> {/* END: HERO */}

                    <MetricsRow status={status} analytics={analytics} />

                    <AgentPipeline activeAgent={activeAgent} completedAgents={completedAgents} />

                    <TabBar tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />

                    <TabContent
                        activeTab={activeTab}
                        logs={logs}
                        leads={leads}
                        nurturedLeads={nurturedLeads}
                        auditTrail={auditTrail}
                        status={status}
                        autopilot={autopilot}
                        setAutopilot={setAutopilot}
                        swarmRunning={swarmRunning}
                        runSwarm={runSwarm}
                    />

                </motion.div> {/* END: MAIN CONTENT */}

                {/* ── FLOATING LAUNCH BUTTON (fixed bottom-right) ── */}
                <motion.button
                    onClick={runSwarm}
                    animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 20px rgba(0,255,136,0.3), 0 4px 20px rgba(0,0,0,0.5)", "0 0 50px rgba(0,255,136,0.6), 0 4px 30px rgba(0,0,0,0.5)", "0 0 20px rgba(0,255,136,0.3), 0 4px 20px rgba(0,0,0,0.5)"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    disabled={swarmRunning}
                    style={{ position: "fixed", bottom: 24, right: 24, zIndex: 100, width: 64, height: 64, borderRadius: "50%", background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.4)", color: "#00ff88", fontSize: 24, cursor: swarmRunning ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                    <motion.span
                        animate={swarmRunning ? { rotate: 360 } : {}}
                        transition={swarmRunning ? { duration: 0.8, repeat: Infinity, ease: "linear" } : {}}
                    >
                        {swarmRunning ? "⟳" : "⚡"}
                    </motion.span>
                </motion.button>

            </div> {/* END: CONTENT LAYER z-10 */}
        </div> /* END: ROOT WRAPPER */
    );
}
