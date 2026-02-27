/**
 * NavBar.jsx — sticky glassmorphism navbar
 * Props: autopilot, healthState, sidebarOpen, setSidebarOpen, onReset
 */
import { motion } from "framer-motion";

export default function NavBar({ autopilot, healthState, sidebarOpen, setSidebarOpen, onReset }) {
    return (
        <nav
            style={{
                position: "sticky",
                top: 0,
                zIndex: 50,
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                background: "rgba(0,0,0,0.3)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                padding: "0 24px",
                height: 56,
                display: "flex",
                alignItems: "center",
                gap: 16,
            }}
        >
            {/* Logo */}
            <span
                style={{
                    fontFamily: "'JetBrains Mono', 'Fira Mono', monospace",
                    fontSize: 18,
                    color: "#00ff88",
                    fontWeight: 700,
                    flexShrink: 0,
                }}
            >
                🧿 NexusAI
            </span>

            {/* Centre title */}
            <span
                style={{
                    flex: 1,
                    textAlign: "center",
                    fontFamily: "monospace",
                    fontSize: 10,
                    color: "rgba(255,255,255,0.2)",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                }}
            >
                Autonomous Revenue Engine
            </span>

            {/* Right controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                {/* Swarm status dot */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <motion.span
                        animate={{ opacity: [1, 0.2, 1] }}
                        transition={{ duration: 1.4, repeat: Infinity }}
                        style={{
                            width: 7, height: 7,
                            borderRadius: "50%",
                            background: autopilot ? "#00ff88" : "rgba(0,255,136,0.3)",
                            display: "inline-block",
                        }}
                    />
                    <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
                        {autopilot ? "SWARM ACTIVE" : "STANDBY"}
                    </span>
                </div>

                {/* Version + uptime badge */}
                {healthState.version && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{
                            fontFamily: "monospace", fontSize: 9,
                            color: "rgba(0,255,136,0.5)",
                            background: "rgba(0,255,136,0.06)",
                            border: "1px solid rgba(0,255,136,0.15)",
                            borderRadius: 4, padding: "2px 7px",
                            letterSpacing: "0.08em",
                        }}>
                            v{healthState.version}
                        </span>
                        <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.2)" }}>
                            ⏱ {healthState.uptime}
                        </span>
                    </div>
                )}

                {/* Sidebar toggle */}
                <button
                    onClick={() => setSidebarOpen(v => !v)}
                    style={{
                        background: sidebarOpen ? "rgba(0,255,136,0.12)" : "none",
                        border: `1px solid ${sidebarOpen ? "rgba(0,255,136,0.4)" : "rgba(255,255,255,0.1)"}`,
                        borderRadius: 6, padding: "4px 10px",
                        color: sidebarOpen ? "#00ff88" : "rgba(255,255,255,0.5)",
                        cursor: "pointer", fontFamily: "monospace", fontSize: 11,
                        transition: "all 0.2s",
                    }}
                >
                    {sidebarOpen ? "◀ CLOSE" : "▶ CONFIG"}
                </button>

                {/* Reset button */}
                <button
                    onClick={onReset}
                    style={{
                        background: "none", border: "1px solid rgba(255,60,60,0.3)",
                        borderRadius: 6, padding: "4px 10px", color: "rgba(255,60,60,0.6)",
                        cursor: "pointer", fontFamily: "monospace", fontSize: 11,
                    }}
                >
                    🔴 RESET
                </button>
            </div>
        </nav> /* END: NavBar */
    );
}
