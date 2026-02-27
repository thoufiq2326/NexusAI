/**
 * TargetGlobe.jsx
 * CSS-only 3D spinning globe showing South India lead targets.
 */
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// ── Target city definitions ───────────────────────────────────────────────
// top/left are % positions on the 200×200 globe face (before spin)
const TARGETS = [
    { id: "L-101", company: "Vizag Pharma", location: "Visakhapatnam", top: "28%", left: "62%", color: "#00ffff" },
    { id: "L-102", company: "Hyderabad FinCorp", location: "Hyderabad", top: "44%", left: "52%", color: "#ff00ff" },
    { id: "L-103", company: "Vijayawada Retail", location: "Vijayawada", top: "52%", left: "55%", color: "#ffdd00" },
    { id: "L-104", company: "Andhra Logistics", location: "Andhra Pradesh", top: "40%", left: "60%", color: "#00ff88" },
];

// ── Status pill color ─────────────────────────────────────────────────────
const STATUS_COLORS = {
    Opportunity: "#00ff88",
    Nurtured: "#bf5fff",
    Scored: "#38bdf8",
    New: "rgba(255,255,255,0.3)",
};

// ── Latitude rings (horizontal ellipses) ─────────────────────────────────
const LAT_RINGS = [
    { top: "10%", height: "8px", width: "90%", left: "5%" },
    { top: "25%", height: "12px", width: "100%", left: "0%" },
    { top: "45%", height: "12px", width: "100%", left: "0%" },
    { top: "65%", height: "12px", width: "100%", left: "0%" },
    { top: "80%", height: "8px", width: "90%", left: "5%" },
    { top: "90%", height: "5px", width: "70%", left: "15%" },
];

// ── Longitude arcs (vertical ellipses) ───────────────────────────────────
const LON_ARCS = [
    { left: "50%", width: "4px", height: "100%", top: "0%" },
    { left: "25%", width: "80px", height: "100%", top: "0%" },
    { left: "62%", width: "80px", height: "100%", top: "0%" },
    { left: "12%", width: "140px", height: "100%", top: "0%" },
    { left: "38%", width: "110px", height: "100%", top: "0%" },
    { left: "55%", width: "110px", height: "100%", top: "0%" },
    { left: "5%", width: "170px", height: "100%", top: "0%" },
    { left: "68%", width: "170px", height: "100%", top: "0%" },
];

// ── Ping dot with tooltip ─────────────────────────────────────────────────
function PingDot({ target, lead }) {
    const [hover, setHover] = useState(false);
    const score = lead?.icp_score ?? 0;
    const status = lead?.status ?? "New";

    return (
        <div
            style={{ position: "absolute", top: target.top, left: target.left, zIndex: 10 }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {/* Ripple ring */}
            <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                width: 20, height: 20,
                borderRadius: "50%",
                border: `1px solid ${target.color}`,
                animation: "pingRipple 2s ease-out infinite",
                pointerEvents: "none",
            }} />

            {/* Dot */}
            <div style={{
                width: 8, height: 8,
                borderRadius: "50%",
                background: target.color,
                boxShadow: `0 0 8px ${target.color}`,
                position: "relative",
                cursor: "pointer",
            }} />

            {/* Tooltip */}
            <AnimatePresence>
                {hover && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 4 }}
                        transition={{ duration: 0.15 }}
                        style={{
                            position: "absolute",
                            top: "-56px", left: "50%",
                            transform: "translateX(-50%)",
                            background: "rgba(0,0,0,0.85)",
                            backdropFilter: "blur(12px)",
                            border: `1px solid ${target.color}40`,
                            borderRadius: 8,
                            padding: "6px 10px",
                            whiteSpace: "nowrap",
                            pointerEvents: "none",
                            zIndex: 20,
                        }}
                    >
                        <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 9, color: target.color, marginBottom: 2 }}>
                            {target.company}
                        </div>
                        <div style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.5)" }}>
                            {target.location}
                        </div>
                        {score > 0 && (
                            <div style={{ fontFamily: "monospace", fontSize: 9, color: "#00ff88", marginTop: 2 }}>
                                ICP: {score}%  ·  {status}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────
export default function TargetGlobe({ leads = [] }) {
    // Match leads to TARGETS by id
    const leadsById = Object.fromEntries(leads.map((l) => [l.id, l]));

    // SVG connection line anchor points (pill → globe edge)
    // Globe is centered at roughly x=100 in the pill column
    const GLOBE_CX = 100; // local x centre within the globe column
    const PILL_X = 20;  // left side of pill, where line starts

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, height: "100%" }}>

            {/* Title */}
            <div style={{
                fontFamily: "'Orbitron',monospace", fontSize: 11,
                color: "rgba(0,255,136,0.7)", letterSpacing: "0.18em",
                textTransform: "uppercase",
            }}>
                🌐 Threat Surface Map
            </div>

            {/* Globe + connection SVG */}
            <div style={{ position: "relative", width: 200 }}>

                {/* Perspective container */}
                <div style={{ perspective: "600px", width: 200, height: 200, margin: "0 auto" }}>
                    {/* Spinning sphere */}
                    <div style={{
                        width: 200, height: 200,
                        borderRadius: "50%",
                        transformStyle: "preserve-3d",
                        animation: "globeSpin 20s linear infinite",
                        position: "relative",
                        background: "radial-gradient(circle at 35% 35%, rgba(0,255,136,0.15), rgba(0,229,255,0.05), transparent 70%)",
                        border: "1px solid rgba(0,255,136,0.2)",
                        boxShadow: "inset 0 0 40px rgba(0,255,136,0.05), 0 0 60px rgba(0,255,136,0.1), 0 0 120px rgba(0,229,255,0.05)",
                        overflow: "hidden",
                    }}>

                        {/* Latitude rings */}
                        {LAT_RINGS.map((r, i) => (
                            <div key={`lat-${i}`} style={{
                                position: "absolute",
                                top: r.top, left: r.left,
                                width: r.width, height: r.height,
                                borderRadius: "50%",
                                border: "1px solid rgba(0,255,136,0.08)",
                                pointerEvents: "none",
                            }} />
                        ))}

                        {/* Longitude arcs */}
                        {LON_ARCS.map((a, i) => (
                            <div key={`lon-${i}`} style={{
                                position: "absolute",
                                top: a.top, left: a.left,
                                width: a.width, height: a.height,
                                borderRadius: "50%",
                                border: "1px solid rgba(0,255,136,0.06)",
                                pointerEvents: "none",
                            }} />
                        ))}

                        {/* Target ping dots */}
                        {TARGETS.map((t) => (
                            <PingDot key={t.id} target={t} lead={leadsById[t.id]} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Target pills */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", maxWidth: 280 }}>
                {TARGETS.map((t, i) => {
                    const lead = leadsById[t.id];
                    const status = lead?.status ?? "New";
                    const pillClr = STATUS_COLORS[status] ?? "rgba(255,255,255,0.3)";

                    return (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.4 }}
                            style={{
                                display: "flex", alignItems: "center", gap: 8,
                                padding: "7px 12px",
                                background: "rgba(255,255,255,0.02)",
                                border: `1px solid ${pillClr}30`,
                                borderRadius: 8,
                                backdropFilter: "blur(8px)",
                                position: "relative",
                            }}
                        >
                            {/* Pulsing status dot */}
                            <motion.span
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4 }}
                                style={{ width: 6, height: 6, borderRadius: "50%", background: pillClr, flexShrink: 0 }}
                            />

                            {/* Company + location */}
                            <div style={{ flex: 1 }}>
                                <div style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
                                    {t.company}
                                </div>
                                <div style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>
                                    {t.location}
                                </div>
                            </div>

                            {/* Status badge */}
                            <span style={{
                                fontFamily: "monospace", fontSize: 9,
                                padding: "1px 6px", borderRadius: 999,
                                border: `1px solid ${pillClr}`,
                                color: pillClr,
                                background: `${pillClr}18`,
                                flexShrink: 0,
                            }}>
                                {status}
                            </span>

                            {/* Left color strip */}
                            <div style={{
                                position: "absolute", left: 0, top: 4, bottom: 4, width: 2,
                                borderRadius: 2, background: t.color,
                                opacity: 0.6,
                            }} />
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
