/**
 * TabContent.jsx — AnimatePresence tab panel switcher
 *
 * Props:
 *   activeTab, logs, leads, nurturedLeads, auditTrail,
 *   status, autopilot, setAutopilot, swarmRunning, runSwarm
 *
 * Renders all 5 panels: TERMINAL · RADAR · CONTENT ENGINE · AUDIT LOG · CRM GRID
 */
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import FloatingCard from "./FloatingCard";
import ICPRadar from "./ICPRadar";
import TargetGlobe from "./TargetGlobe";
import TerminalLog from "./TerminalLog";

const API = "http://localhost:8000";

const tabVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
};

const AGENT_COLORS = {
    Hunter: "#00ffff",
    Guardian: "#ff4444",
    Professor: "#ff00ff",
    Closer: "#ffdd00",
    System: "#00ff88",
};

const STATUS_COLORS = {
    Opportunity: "#00ff88",
    Nurtured: "#bf5fff",
    Scored: "#38bdf8",
    New: "rgba(255,255,255,0.3)",
};

function Badge({ text, color }) {
    return (
        <span
            style={{
                fontSize: 10, fontFamily: "monospace",
                padding: "2px 8px", borderRadius: 999,
                border: `1px solid ${color}`, color,
                background: `${color}18`,
            }}
        >
            {text}
        </span>
    );
}

function GlassRow({ children }) {
    return (
        <div
            style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 8, padding: "10px 14px",
                display: "flex", alignItems: "center", gap: 12,
            }}
        >
            {children}
        </div>
    );
}

function EmailCard({ lead, index }) {
    const [expanded, setExpanded] = useState(false);
    const [copied, setCopied] = useState(false);
    const body = lead.email_body || "";
    const preview = body.length > 60 ? body.slice(0, 60) + "…" : body;

    function handleCopy() {
        if (!body) return;
        navigator.clipboard.writeText(body).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    return (
        <FloatingCard title={`TO: ${lead.company}`} glowColor="120,0,255" delay={index * 0.08}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <Badge text={`Score: ${lead.icp_score}%`} color="#00ff88" />
                <Badge text={lead.status} color={STATUS_COLORS[lead.status] ?? "rgba(255,255,255,0.4)"} />
            </div>
            <p style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.85)", margin: "0 0 10px", lineHeight: 1.5 }}>
                📧 {lead.last_log || "Generating subject…"}
            </p>
            {body && (
                <div style={{ marginBottom: 12 }}>
                    <button
                        onClick={() => setExpanded(v => !v)}
                        style={{ background: "none", border: "none", padding: 0, fontFamily: "monospace", fontSize: 10, color: "rgba(120,0,255,0.7)", cursor: "pointer", letterSpacing: "0.08em", marginBottom: 6, textTransform: "uppercase" }}
                    >
                        {expanded ? "▲ COLLAPSE EMAIL" : "▼ EXPAND BODY"}
                    </button>
                    <motion.div
                        animate={{ height: expanded ? "auto" : 48, opacity: expanded ? 1 : 0.7 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                    >
                        <p style={{ fontFamily: "monospace", fontSize: 12, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                            {expanded ? body : preview}
                        </p>
                    </motion.div>
                </div>
            )}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <Badge text="Agent: Professor" color="rgba(255,0,255,0.6)" />
                    <Badge text="RAG: Active" color="rgba(0,212,255,0.6)" />
                </div>
                {body && (
                    <button
                        onClick={handleCopy}
                        style={{
                            background: copied ? "rgba(0,255,136,0.12)" : "rgba(120,0,255,0.1)",
                            border: `1px solid ${copied ? "rgba(0,255,136,0.4)" : "rgba(120,0,255,0.3)"}`,
                            borderRadius: 6, padding: "4px 10px",
                            fontFamily: "monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase",
                            color: copied ? "#00ff88" : "rgba(120,0,255,0.8)",
                            cursor: "pointer", transition: "all 0.2s",
                        }}
                    >
                        {copied ? "COPIED ✓" : "COPY EMAIL"}
                    </button>
                )}
            </div>
        </FloatingCard>
    );
}

export default function TabContent({
    activeTab, logs, leads, nurturedLeads, auditTrail,
    status, autopilot, setAutopilot, swarmRunning, runSwarm,
}) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={activeTab}
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
            >
                {/* ── TERMINAL ── */}
                {activeTab === "TERMINAL" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, height: 480 }}>
                        <TerminalLog logs={logs} />

                        {/* Side controls */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {/* Launch swarm */}
                            <motion.button
                                onClick={runSwarm}
                                animate={autopilot
                                    ? { boxShadow: ["0 0 20px rgba(0,255,136,0.3)", "0 0 40px rgba(0,255,136,0.6)", "0 0 20px rgba(0,255,136,0.3)"] }
                                    : {}}
                                transition={{ duration: 1.2, repeat: Infinity }}
                                disabled={swarmRunning}
                                style={{
                                    background: "rgba(0,255,136,0.08)",
                                    border: "1px solid rgba(0,255,136,0.35)",
                                    borderRadius: 10, padding: "18px",
                                    color: "#00ff88", fontFamily: "monospace",
                                    fontSize: 13, letterSpacing: "0.08em",
                                    cursor: swarmRunning ? "not-allowed" : "pointer",
                                    fontWeight: 700, textAlign: "center",
                                    opacity: swarmRunning ? 0.6 : 1,
                                    transition: "opacity 0.2s",
                                }}
                            >
                                {swarmRunning ? "⟳ RUNNING…" : "▶ LAUNCH SWARM CYCLE"}
                            </motion.button>

                            {/* Autopilot toggle */}
                            <button
                                onClick={() => setAutopilot(v => !v)}
                                style={{
                                    background: autopilot ? "rgba(0,255,136,0.12)" : "rgba(255,255,255,0.04)",
                                    border: `1px solid ${autopilot ? "rgba(0,255,136,0.4)" : "rgba(255,255,255,0.1)"}`,
                                    borderRadius: 10, padding: "14px",
                                    color: autopilot ? "#00ff88" : "rgba(255,255,255,0.4)",
                                    fontFamily: "monospace", fontSize: 12,
                                    cursor: "pointer", transition: "all 0.2s",
                                }}
                            >
                                {autopilot ? "⏸ DISABLE AUTOPILOT" : "⚡ ENABLE AUTOPILOT"}
                            </button>

                            {/* Status card */}
                            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                                {[
                                    { label: "Mode", val: status.mode ?? "—" },
                                    { label: "Opportunities", val: status.opportunities ?? 0 },
                                    { label: "Compliance", val: `${status.compliance_rate ?? 0}%` },
                                    { label: "ROI", val: status.roi ?? "—" },
                                ].map(r => (
                                    <div key={r.label} style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{r.label}</span>
                                        <span style={{ fontFamily: "monospace", fontSize: 10, color: "#00ff88" }}>{r.val}</span>
                                    </div>
                                ))}
                            </div> {/* END: status card */}
                        </div> {/* END: side controls */}
                    </div> /* END: TERMINAL panel grid */
                )}

                {/* ── RADAR ── */}
                {activeTab === "RADAR" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, minHeight: 520, alignItems: "start" }}>
                        <ICPRadar leads={leads} />
                        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(0,255,136,0.08)", borderRadius: 12, padding: 20 }}>
                            <TargetGlobe leads={leads} />
                        </div>
                    </div> /* END: RADAR panel grid */
                )}

                {/* ── CONTENT ENGINE ── */}
                {activeTab === "CONTENT ENGINE" && (
                    <div>
                        {nurturedLeads.length === 0 ? (
                            <motion.p
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                style={{ fontFamily: "monospace", fontSize: 13, color: "rgba(0,255,136,0.5)", textAlign: "center", marginTop: 80 }}
                            >
                                Waiting for Professor Agent to generate content…
                            </motion.p>
                        ) : (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))", gap: 20 }}>
                                {nurturedLeads.map((lead, i) => (
                                    <EmailCard key={lead.id} lead={lead} index={i} />
                                ))}
                            </div>
                        )}
                    </div> /* END: CONTENT ENGINE panel */
                )}

                {/* ── AUDIT LOG ── */}
                {activeTab === "AUDIT LOG" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {/* Export button */}
                        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                            <button
                                onClick={() => window.open(`${API}/api/export/audit`)}
                                style={{
                                    background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.3)",
                                    borderRadius: 6, padding: "6px 16px",
                                    fontFamily: "monospace", fontSize: 10, letterSpacing: "0.1em",
                                    textTransform: "uppercase", color: "rgba(0,212,255,0.8)", cursor: "pointer",
                                }}
                            >
                                ↓ EXPORT AUDIT JSON
                            </button>
                        </div>
                        {auditTrail.length === 0 ? (
                            <p style={{ fontFamily: "monospace", fontSize: 12, color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 60 }}>
                                No actions recorded yet.
                            </p>
                        ) : (
                            auditTrail.map((row, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                                    <GlassRow>
                                        <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.25)", minWidth: 60 }}>{row.time}</span>
                                        <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: AGENT_COLORS[row.agent] ?? "#fff", minWidth: 80 }}>{row.agent}</span>
                                        <span style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.5)", flex: 1 }}>{row.action}</span>
                                        <span style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(0,255,136,0.7)" }}>{row.target}</span>
                                    </GlassRow>
                                </motion.div>
                            ))
                        )}
                    </div> /* END: AUDIT LOG panel */
                )}

                {/* ── CRM GRID ── */}
                {activeTab === "CRM GRID" && (
                    <div>
                        {/* Download CSV button */}
                        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                            <button
                                onClick={() => window.open(`${API}/api/export/csv`)}
                                style={{
                                    background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.3)",
                                    borderRadius: 6, padding: "6px 16px",
                                    fontFamily: "monospace", fontSize: 10, letterSpacing: "0.1em",
                                    textTransform: "uppercase", color: "rgba(0,255,136,0.8)", cursor: "pointer",
                                }}
                            >
                                ↓ DOWNLOAD LEADS CSV
                            </button>
                        </div>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "monospace", fontSize: 12 }}>
                                <thead>
                                    <tr>
                                        {["ID", "Company", "Role", "Location", "Employees", "Budget", "Status", "ICP Score", "Safety"].map(h => (
                                            <th key={h} style={{ textAlign: "left", padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.08)", color: "rgba(0,255,136,0.6)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {leads.map((lead, i) => (
                                        <motion.tr
                                            key={lead.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                                        >
                                            <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.35)" }}>{lead.id}</td>
                                            <td style={{ padding: "10px 14px", color: "#fff", fontWeight: 600 }}>{lead.company}</td>
                                            <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.6)" }}>{lead.role}</td>
                                            <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.6)" }}>{lead.location}</td>
                                            <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.5)" }}>{lead.employees?.toLocaleString()}</td>
                                            <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.5)" }}>{lead.budget}</td>
                                            <td style={{ padding: "10px 14px" }}>
                                                <Badge text={lead.status} color={STATUS_COLORS[lead.status] ?? "rgba(255,255,255,0.3)"} />
                                            </td>
                                            <td style={{ padding: "10px 14px", color: lead.icp_score > 0 ? "#00ff88" : "rgba(255,255,255,0.25)" }}>
                                                {lead.icp_score > 0 ? `${lead.icp_score}%` : "—"}
                                            </td>
                                            <td style={{ padding: "10px 14px" }}>
                                                <Badge text={lead.safety_check} color={lead.safety_check === "Passed" ? "#00ff88" : "rgba(255,255,255,0.3)"} />
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div> {/* END: table scroll wrapper */}
                    </div> /* END: CRM GRID panel */
                )}

            </motion.div> {/* END: AnimatePresence child */}
        </AnimatePresence> /* END: TabContent AnimatePresence */
    );
}
