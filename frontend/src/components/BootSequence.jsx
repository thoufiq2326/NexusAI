/**
 * BootSequence.jsx — full-screen terminal boot overlay
 * Plays once per browser session via sessionStorage.
 * Props: onComplete() — called after overlay fades out.
 */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINES = [
    "NEXUS AI v2.0 — INITIALIZING...",
    "LOADING AGENT SWARM PROTOCOLS...",
    "CONNECTING TO GEMINI INTELLIGENCE...",
    "CALIBRATING ICP TARGETING SYSTEMS...",
    "ALL SYSTEMS NOMINAL. LAUNCHING INTERFACE.",
];

const CHAR_INTERVAL = 28; // ms per character

export default function BootSequence({ onComplete }) {
    const [lines, setLines] = useState([]); // fully typed lines
    const [current, setCurrent] = useState(""); // line being typed
    const [lineIdx, setLineIdx] = useState(0);
    const [charIdx, setCharIdx] = useState(0);
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (lineIdx >= LINES.length) {
            // All lines done — brief pause then fade
            const t = setTimeout(() => setDone(true), 900);
            return () => clearTimeout(t);
        }

        const target = LINES[lineIdx];

        if (charIdx <= target.length) {
            const t = setTimeout(() => {
                setCurrent(target.slice(0, charIdx));
                setCharIdx(c => c + 1);
            }, CHAR_INTERVAL);
            return () => clearTimeout(t);
        } else {
            // Line finished — commit and advance
            const t = setTimeout(() => {
                setLines(prev => [...prev, target]);
                setCurrent("");
                setCharIdx(0);
                setLineIdx(l => l + 1);
            }, 180);
            return () => clearTimeout(t);
        }
    }, [lineIdx, charIdx]);

    // After fade completes
    const handleAnimationComplete = () => {
        if (done) onComplete?.();
    };

    const isLastLine = lineIdx === LINES.length - 1;

    return (
        <AnimatePresence>
            {!done && (
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    onAnimationComplete={handleAnimationComplete}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 10000,
                        background: "#0a0a0f",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 4,
                    }}
                >
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                            fontFamily: "'Orbitron', monospace",
                            fontSize: "clamp(28px,5vw,56px)",
                            fontWeight: 900,
                            color: "#00ff88",
                            letterSpacing: "0.12em",
                            textShadow: "0 0 40px rgba(0,255,136,0.5)",
                            marginBottom: 40,
                        }}
                    >
                        🧿 NEXUS AI
                    </motion.div>

                    {/* Terminal box */}
                    <div style={{
                        width: "min(640px, 90vw)",
                        background: "rgba(0,0,0,0.6)",
                        border: "1px solid rgba(0,255,136,0.2)",
                        borderRadius: 12,
                        padding: "28px 32px",
                        backdropFilter: "blur(20px)",
                    }}>
                        {/* Typed lines so far */}
                        {lines.map((line, i) => (
                            <div key={i} style={{
                                fontFamily: "monospace",
                                fontSize: 13,
                                lineHeight: 1.7,
                                color: i === lines.length - 1 && lineIdx >= LINES.length
                                    ? "#00ff88"
                                    : "rgba(255,255,255,0.55)",
                            }}>
                                <span style={{ color: "rgba(0,255,136,0.4)", marginRight: 8 }}>&gt;</span>
                                {line}
                                {i === lines.length - 1 && lineIdx >= LINES.length && " ✓"}
                            </div>
                        ))}

                        {/* Line currently being typed */}
                        {lineIdx < LINES.length && (
                            <div style={{ fontFamily: "monospace", fontSize: 13, lineHeight: 1.7, color: "#00ff88" }}>
                                <span style={{ color: "rgba(0,255,136,0.4)", marginRight: 8 }}>&gt;</span>
                                {current}
                                <motion.span
                                    animate={{ opacity: [1, 0, 1] }}
                                    transition={{ duration: 0.6, repeat: Infinity }}
                                    style={{ color: "#00ff88", marginLeft: 1 }}
                                >█</motion.span>
                            </div>
                        )}
                    </div>

                    {/* Progress bar */}
                    <div style={{
                        width: "min(640px,90vw)", height: 2,
                        background: "rgba(0,255,136,0.08)",
                        borderRadius: 999, marginTop: 16, overflow: "hidden",
                    }}>
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: `${(lineIdx / LINES.length) * 100}%` }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            style={{ height: "100%", background: "linear-gradient(90deg,#00ff88,#00d4ff)", borderRadius: 999 }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
