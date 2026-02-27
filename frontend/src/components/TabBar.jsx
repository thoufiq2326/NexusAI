/**
 * TabBar.jsx — sliding-underline tab selector
 * Props: tabs, activeTab, setActiveTab
 */
import { motion } from "framer-motion";

const SHORTCUTS = ["1", "2", "3", "4", "5"];

export default function TabBar({ tabs, activeTab, setActiveTab }) {
    return (
        <div
            style={{
                position: "relative",
                display: "flex",
                gap: 0,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                marginBottom: 24,
            }}
        >
            {tabs.map((tab, i) => {
                const active = activeTab === tab;
                return (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            background: "none",
                            border: "none",
                            borderBottom: "2px solid transparent",
                            padding: "10px 20px",
                            fontFamily: active ? "'Orbitron',monospace" : "'Share Tech Mono','JetBrains Mono',monospace",
                            fontSize: active ? 10 : 11,
                            letterSpacing: active ? "0.15em" : "0.1em",
                            textTransform: "uppercase",
                            color: active ? "#00ff88" : "rgba(255,255,255,0.3)",
                            cursor: "pointer",
                            transition: "color 0.2s, font-family 0.2s",
                            marginBottom: "-1px",
                            position: "relative",
                        }}
                        onMouseEnter={e => { if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                        onMouseLeave={e => { if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}
                    >
                        {tab}
                        {/* Keyboard shortcut hint */}
                        <span style={{ marginLeft: 6, fontSize: 8, color: "rgba(255,255,255,0.15)", fontFamily: "monospace" }}>
                            [{SHORTCUTS[i]}]
                        </span>
                        {/* Sliding underline */}
                        {active && (
                            <motion.div
                                layoutId="tab-underline"
                                style={{
                                    position: "absolute", bottom: -1, left: 0, right: 0, height: 2,
                                    background: "linear-gradient(90deg,transparent,#00ff88,transparent)",
                                    borderRadius: 999,
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                        )}
                    </button>
                );
            })}
        </div> /* END: TabBar */
    );
}
