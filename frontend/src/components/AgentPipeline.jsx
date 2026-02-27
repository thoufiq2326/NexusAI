/**
 * AgentPipeline.jsx
 * Horizontal animated pipeline showing 4 agents with flow lines.
 * Props:
 *   activeAgent  – "hunter"|"guardian"|"professor"|"closer"|null
 *   completedAgents – Set or array of completed agent keys
 */
import { motion, AnimatePresence } from "framer-motion";

// ── Agent definitions ─────────────────────────────────────────────────────
const AGENTS = [
    { key: "hunter", label: "HUNTER", icon: "🎯", color: "#00ffff" },
    { key: "guardian", label: "GUARDIAN", icon: "🛡️", color: "#ff3333" },
    { key: "professor", label: "PROFESSOR", icon: "🧠", color: "#ff00ff" },
    { key: "closer", label: "CLOSER", icon: "💰", color: "#ffdd00" },
];

// ── Single connector between two nodes ───────────────────────────────────
function Connector({ fromActive, toActive, lineColor, isActive }) {
    return (
        <div style={{ flex: 1, display: "flex", alignItems: "center", position: "relative", height: 4 }}>
            <svg
                width="100%" height="24"
                style={{ overflow: "visible", position: "absolute", top: "50%", transform: "translateY(-50%)" }}
            >
                {/* Track line */}
                <line
                    x1="0" y1="12" x2="100%" y2="12"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth={2}
                />
                {/* Animated dash flow */}
                <line
                    x1="0" y1="12" x2="100%" y2="12"
                    stroke={lineColor}
                    strokeWidth={2}
                    strokeOpacity={isActive ? 0.7 : 0.2}
                    strokeDasharray="4 8"
                    style={{ animation: isActive ? "dashFlow 1s linear infinite" : "none" }}
                />
                {/* Travelling glow dot when active */}
                {isActive && (
                    <motion.circle
                        r={5}
                        cy={12}
                        fill={lineColor}
                        filter={`drop-shadow(0 0 4px ${lineColor})`}
                        initial={{ cx: "0%" }}
                        animate={{ cx: "100%" }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                )}
            </svg>
        </div>
    );
}

// ── Single agent node ──────────────────────────────────────────────────────
function AgentNode({ agent, state }) {
    // state: "idle" | "active" | "done"
    const isActive = state === "active";
    const isDone = state === "done";
    const c = agent.color;

    const statusText = isActive ? "ACTIVE" : isDone ? "DONE" : "IDLE";
    const statusColor = isActive ? "#00ff88" : isDone ? c : "rgba(255,255,255,0.25)";

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, position: "relative" }}>

            {/* Node wrapper with scale animation */}
            <motion.div
                animate={isActive ? { scale: 1.15 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ position: "relative", width: 80, height: 80 }}
            >
                {/* Outer static ring */}
                <div style={{
                    position: "absolute", inset: 0,
                    borderRadius: "50%",
                    border: `2px solid ${c}${isDone ? "66" : isActive ? "99" : "33"}`,
                }} />

                {/* Spinning ring (only when active) */}
                {isActive && (
                    <div style={{
                        position: "absolute", inset: -2,
                        borderRadius: "50%",
                        border: "2px solid transparent",
                        borderTopColor: c,
                        animation: "agentSpin 1.2s linear infinite",
                    }} />
                )}

                {/* Active glow box-shadow */}
                {isActive && (
                    <motion.div
                        animate={{
                            boxShadow: [
                                `0 0 20px ${c}44, 0 0 60px ${c}22`,
                                `0 0 40px ${c}99, 0 0 80px ${c}44`,
                                `0 0 20px ${c}44, 0 0 60px ${c}22`,
                            ]
                        }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        style={{ position: "absolute", inset: 0, borderRadius: "50%" }}
                    />
                )}

                {/* Inner glass circle */}
                <motion.div
                    animate={isActive
                        ? {
                            background: [
                                `rgba(${hexToRgb(c)},0.05)`,
                                `rgba(${hexToRgb(c)},0.18)`,
                                `rgba(${hexToRgb(c)},0.05)`,
                            ]
                        }
                        : { background: `rgba(${hexToRgb(c)},${isDone ? "0.08" : "0.03"})` }
                    }
                    transition={isActive ? { duration: 0.6, repeat: Infinity } : {}}
                    style={{
                        position: "absolute",
                        inset: 12,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                        backdropFilter: "blur(8px)",
                        border: `1px solid ${c}${isDone ? "44" : isActive ? "66" : "22"}`,
                    }}
                >
                    {agent.icon}
                </motion.div>

                {/* Done checkmark overlay */}
                <AnimatePresence>
                    {isDone && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: "absolute",
                                top: -4, right: -4,
                                width: 20, height: 20,
                                borderRadius: "50%",
                                background: "#00ff88",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 11,
                                zIndex: 5,
                                boxShadow: "0 0 8px #00ff88",
                            }}
                        >✓</motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Agent label */}
            <span style={{
                fontFamily: "monospace",
                fontSize: 9,
                letterSpacing: "0.12em",
                color: isActive ? c : isDone ? `${c}aa` : "rgba(255,255,255,0.3)",
                textTransform: "uppercase",
                transition: "color 0.3s",
            }}>
                {agent.label}
            </span>

            {/* Status badge */}
            <span style={{
                fontFamily: "monospace",
                fontSize: 8,
                padding: "1px 6px",
                borderRadius: 999,
                border: `1px solid ${statusColor}`,
                color: statusColor,
                background: `${statusColor}18`,
                letterSpacing: "0.08em",
                transition: "all 0.3s",
            }}>
                {statusText}
            </span>
        </div>
    );
}

// ── Hex → "r,g,b" helper ─────────────────────────────────────────────────
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
}

// ── Main export ───────────────────────────────────────────────────────────
export default function AgentPipeline({ activeAgent = null, completedAgents = [] }) {
    const completed = new Set(completedAgents);

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            padding: "20px 16px",
            background: "rgba(255,255,255,0.015)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12,
            marginBottom: 24,
            position: "relative",
            overflow: "hidden",
        }}>

            {/* Subtle bg glow behind active node */}
            {activeAgent && (() => {
                const idx = AGENTS.findIndex(a => a.key === activeAgent);
                const agent = AGENTS[idx];
                return (
                    <motion.div
                        key={activeAgent}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: "absolute",
                            left: `${(idx / 3) * 100}%`,
                            top: "50%",
                            width: 160,
                            height: 160,
                            transform: "translate(-50%,-50%)",
                            borderRadius: "50%",
                            background: `radial-gradient(circle, ${agent.color}22 0%, transparent 70%)`,
                            pointerEvents: "none",
                        }}
                    />
                );
            })()}

            {AGENTS.map((agent, i) => {
                const state = activeAgent === agent.key
                    ? "active"
                    : completed.has(agent.key)
                        ? "done"
                        : "idle";

                const prevDone = i === 0 || completed.has(AGENTS[i - 1].key) || activeAgent === AGENTS[i - 1].key;
                const lineActive = i > 0 && (completed.has(AGENTS[i - 1].key) || activeAgent === AGENTS[i - 1].key);

                return (
                    <div key={agent.key} style={{ display: "flex", alignItems: "center", flex: i === 0 ? "0 0 auto" : 1 }}>
                        {/* Connector before this node (skip first) */}
                        {i > 0 && (
                            <Connector
                                fromActive={completed.has(AGENTS[i - 1].key) || activeAgent === AGENTS[i - 1].key}
                                toActive={state !== "idle"}
                                lineColor={AGENTS[i - 1].color}
                                isActive={lineActive}
                            />
                        )}
                        <AgentNode agent={agent} state={state} />
                    </div>
                );
            })}
        </div>
    );
}
