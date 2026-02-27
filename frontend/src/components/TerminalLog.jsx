import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// ── Color maps ────────────────────────────────────────────────────────────
const AGENT_COLORS = {
    HUNTER: "#00ffff",
    GUARDIAN: "#ff3333",
    PROFESSOR: "#ff00ff",
    CLOSER: "#ffdd00",
    SYSTEM: "#00ff88",
};

const TYPE_COLORS = {
    hunter: "#00ffff",
    guardian: "#ff4444",
    professor: "#ff00ff",
    closer: "#ffdd00",
    info: "#00ff88",
    error: "#ff6666",
};

// ── Agent avatar config ───────────────────────────────────────────────────
const AGENT_AVATARS = {
    HUNTER: { icon: "🎯", bg: "rgba(0,255,255,0.1)", border: "rgba(0,255,255,0.3)" },
    GUARDIAN: { icon: "🛡️", bg: "rgba(255,51,51,0.1)", border: "rgba(255,51,51,0.3)" },
    PROFESSOR: { icon: "🧠", bg: "rgba(255,0,255,0.1)", border: "rgba(255,0,255,0.3)" },
    CLOSER: { icon: "💰", bg: "rgba(255,221,0,0.1)", border: "rgba(255,221,0,0.3)" },
    SYSTEM: { icon: "⚡", bg: "rgba(0,255,136,0.1)", border: "rgba(0,255,136,0.3)" },
};

const AGENT_ORDER = ["HUNTER", "GUARDIAN", "PROFESSOR", "CLOSER"];

// ── Matrix Rain Canvas ────────────────────────────────────────────────────
const KATAKANA =
    "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン";
const CHARS = (KATAKANA + "0123456789").split("");

function MatrixRain() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        const fontSize = 12;
        let cols = Math.floor(canvas.width / fontSize);
        let drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -50));

        let raf;
        const draw = () => {
            cols = Math.floor(canvas.width / fontSize);
            if (drops.length < cols) drops = [...drops, ...Array.from({ length: cols - drops.length }, () => 0)];

            ctx.fillStyle = "rgba(0,0,0,0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#00ff88";
            ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;

            for (let i = 0; i < cols; i++) {
                const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
                ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            raf = requestAnimationFrame(draw);
        };
        raf = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                opacity: 0.04, pointerEvents: "none",
                display: "block",
            }}
        />
    );
}

// ── Log entry with glow sweep + avatar ───────────────────────────────────
function LogEntry({ log, isNewest }) {
    const avatar = AGENT_AVATARS[log.agent] ?? AGENT_AVATARS.SYSTEM;
    const msgColor = TYPE_COLORS[log.type] ?? "#cccccc";
    const agentClr = AGENT_COLORS[log.agent] ?? "#ffffff";

    return (
        <motion.div
            initial={{ opacity: 0, x: -16, height: 0 }}
            animate={{ opacity: 1, x: 0, height: "auto" }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
        >
            <motion.div
                initial={isNewest ? { background: "rgba(0,255,136,0.12)", borderLeft: `2px solid ${agentClr}` } : {}}
                animate={{ background: "rgba(0,0,0,0)", borderLeft: "2px solid rgba(0,0,0,0)" }}
                transition={{ duration: isNewest ? 1.5 : 0, ease: "easeOut" }}
                style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "baseline",
                    padding: "2px 4px",
                    borderRadius: 4,
                }}
            >
                {/* Timestamp */}
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", flexShrink: 0, fontFamily: "monospace" }}>
                    {log.time}
                </span>

                {/* Agent avatar icon */}
                <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 18, height: 18,
                    fontSize: 10,
                    background: avatar.bg,
                    border: `1px solid ${avatar.border}`,
                    borderRadius: 4,
                    flexShrink: 0,
                    lineHeight: 1,
                }}>
                    {avatar.icon}
                </span>

                {/* Agent label */}
                <span style={{
                    fontSize: 10,
                    fontWeight: "bold",
                    color: agentClr,
                    minWidth: 70,
                    flexShrink: 0,
                    fontFamily: "monospace",
                }}>
                    [{log.agent}]
                </span>

                {/* Message */}
                <span style={{ color: msgColor, fontSize: 12, fontFamily: "monospace" }}>
                    {log.message}
                </span>
            </motion.div>
        </motion.div>
    );
}

// ── Main component ────────────────────────────────────────────────────────
export default function TerminalLog({ logs = [] }) {
    const bottomRef = useRef(null);

    // Live clock
    const [clock, setClock] = useState(() => new Date().toLocaleTimeString("en-GB"));
    useEffect(() => {
        const t = setInterval(() => setClock(new Date().toLocaleTimeString("en-GB")), 1000);
        return () => clearInterval(t);
    }, []);

    // Track newest log key for glow sweep
    const newestKey = logs.length > 0 ? `${logs[0].time}-0` : null;

    // Auto-scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    return (
        <div style={{
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(0,255,136,0.12)",
            borderRadius: 12,
            height: "100%",
            overflow: "hidden",
            boxShadow: "inset 0 0 40px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            position: "relative",
        }}>

            {/* ── HEADER BAR ── */}
            <div style={{
                height: "auto",
                minHeight: 40,
                display: "flex",
                alignItems: "center",
                padding: "6px 14px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                flexShrink: 0,
                gap: 10,
                flexWrap: "wrap",
                zIndex: 2,
                position: "relative",
            }}>
                {/* Traffic lights */}
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57", display: "inline-block", flexShrink: 0 }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e", display: "inline-block", flexShrink: 0 }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840", display: "inline-block", flexShrink: 0 }} />

                {/* Title */}
                <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", flex: 1, textAlign: "center" }}>
                    SWARM TERMINAL v2.0
                </span>

                {/* Agent status dots */}
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.25)", marginRight: 4 }}>AGENTS:</span>
                    {AGENT_ORDER.map((a) => (
                        <motion.span
                            key={a}
                            title={a}
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, delay: AGENT_ORDER.indexOf(a) * 0.3 }}
                            style={{ width: 6, height: 6, borderRadius: "50%", background: AGENT_COLORS[a], display: "inline-block" }}
                        />
                    ))}
                    <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(0,255,136,0.5)", marginLeft: 4 }}>4/4</span>
                </div>

                {/* Log count badge */}
                <span style={{
                    fontFamily: "monospace", fontSize: 9,
                    background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)",
                    borderRadius: 999, padding: "1px 7px", color: "rgba(0,255,136,0.7)", flexShrink: 0,
                }}>
                    {logs.length} EVENTS
                </span>

                {/* Live clock */}
                <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(0,255,136,0.6)", flexShrink: 0, letterSpacing: "0.05em" }}>
                    {clock}
                </span>

                {/* Pulsing status dot */}
                <motion.span
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ff88", display: "inline-block", flexShrink: 0 }}
                />
            </div>

            {/* ── LOG AREA ── */}
            <div style={{
                overflowY: "auto",
                flex: 1,
                padding: "10px 14px",
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(0,255,136,0.2) transparent",
                position: "relative",
            }}>
                {/* Matrix rain canvas (behind logs) */}
                <MatrixRain />

                {/* Log entries */}
                <div style={{ position: "relative", zIndex: 1 }}>
                    <AnimatePresence initial={false}>
                        {logs.map((log, i) => (
                            <LogEntry
                                key={`${log.time}-${i}`}
                                log={log}
                                isNewest={i === 0}
                            />
                        ))}
                    </AnimatePresence>

                    {/* Blinking cursor */}
                    <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        style={{ color: "#00ff88", marginLeft: 4, fontFamily: "monospace" }}
                    >█</motion.span>

                    {/* Scroll anchor */}
                    <div ref={bottomRef} />
                </div>
            </div>
        </div>
    );
}
