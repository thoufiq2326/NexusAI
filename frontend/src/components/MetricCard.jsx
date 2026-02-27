/**
 * MetricCard.jsx
 * Premium metric card with:
 *  - Holographic shimmer overlay
 *  - Live counter animation (0 → target)
 *  - Circular SVG progress ring
 *  - Pulsing bottom accent line
 *  - Sparkline micro-chart
 */
import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

// ── Seeded sparkline data (memoised per card) ─────────────────────────────
function useSparkline() {
    return useMemo(() => Array.from({ length: 8 }, () => Math.random()), []);
}

// ── Sparkline SVG ─────────────────────────────────────────────────────────
function Sparkline({ color, points }) {
    const W = 60, H = 20;
    const xs = points.map((_, i) => (i / (points.length - 1)) * W);
    const ys = points.map((v) => H - v * (H - 2) - 1);
    const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");

    // Animate stroke-dashoffset to draw the line in
    const pathRef = useRef(null);
    const [len, setLen] = useState(120);
    useEffect(() => {
        if (pathRef.current) setLen(pathRef.current.getTotalLength());
    }, []);

    return (
        <svg width={W} height={H} style={{ overflow: "visible" }}>
            <motion.path
                ref={pathRef}
                d={d}
                fill="none"
                stroke={`rgba(${color},0.5)`}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ strokeDasharray: len, strokeDashoffset: len }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut", delay: 0.4 }}
            />
        </svg>
    );
}

// ── Circular progress ring ────────────────────────────────────────────────
const CIRC = 2 * Math.PI * 36; // r = 36

function ProgressRing({ color, pct }) {
    const raw = useSpring(0, { stiffness: 60, damping: 20 });
    const offset = useTransform(raw, (v) => CIRC - CIRC * (v / 100));

    useEffect(() => { raw.set(pct); }, [pct, raw]);

    return (
        <svg
            width={80} height={80}
            style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-60%) rotate(-90deg)", opacity: 0.7 }}
        >
            {/* Track */}
            <circle cx={40} cy={40} r={36} fill="none"
                stroke="rgba(255,255,255,0.05)" strokeWidth={3} />
            {/* Progress */}
            <motion.circle
                cx={40} cy={40} r={36} fill="none"
                stroke={`rgba(${color},0.7)`} strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray={CIRC}
                style={{ strokeDashoffset: offset }}
            />
        </svg>
    );
}

// ── Main component ────────────────────────────────────────────────────────
export default function MetricCard({
    title,
    numericTarget,   // number — animated from 0
    suffix = "",     // e.g. "%", "x"
    decimals = 0,
    sub,
    glowColor = "0,255,136",
    progressPct = 0, // 0-100 for the ring
    delay = 0,
}) {
    const sparkline = useSparkline();

    // Live counter
    const [count, setCount] = useState(0);
    useEffect(() => {
        const startAt = delay * 1000;
        let raf;
        const t = setTimeout(() => {
            const duration = 1200; // ms
            const start = performance.now();
            const tick = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // ease-out quad
                const eased = 1 - (1 - progress) ** 2;
                setCount(eased * numericTarget);
                if (progress < 1) raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
        }, startAt);
        return () => { clearTimeout(t); cancelAnimationFrame(raf); };
    }, [numericTarget, delay]);

    const displayValue = `${count.toFixed(decimals)}${suffix}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{
                scale: 1.03,
                boxShadow: `0 0 40px rgba(${glowColor},0.3)`,
            }}
            style={{
                position: "relative",
                overflow: "hidden",
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                padding: "20px 20px 28px",
                minHeight: 140,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            {/* ── Top shimmer line ── */}
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(90deg, transparent, rgba(${glowColor},0.4), transparent)`,
            }} />

            {/* ── Holographic shimmer overlay ── */}
            <motion.div
                animate={{ backgroundPosition: ["0% 0%", "200% 200%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
                style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "inherit",
                    pointerEvents: "none",
                    background: "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%)",
                    backgroundSize: "200% 200%",
                }}
            />

            {/* ── SVG Progress Ring (behind text) ── */}
            <ProgressRing color={glowColor} pct={progressPct} />

            {/* ── Title ── */}
            <div style={{
                fontSize: 10,
                fontFamily: "monospace",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: `rgba(${glowColor},0.6)`,
                position: "relative",
                zIndex: 1,
            }}>
                {title}
            </div>

            {/* ── Counter value ── */}
            <div style={{
                fontSize: 32,
                fontFamily: "'Orbitron', monospace",
                fontWeight: 700,
                color: `rgb(${glowColor})`,
                lineHeight: 1,
                position: "relative",
                zIndex: 1,
                textShadow: `0 0 20px rgba(${glowColor},0.4)`,
                margin: "8px 0 4px",
            }}>
                {displayValue}
            </div>

            {/* ── Sub-label ── */}
            <div style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
                fontFamily: "monospace",
                position: "relative",
                zIndex: 1,
            }}>
                {sub}
            </div>

            {/* ── Sparkline ── */}
            <div style={{ position: "absolute", bottom: 24, right: 16, opacity: 0.8 }}>
                <Sparkline color={glowColor} points={sparkline} />
            </div>

            {/* ── Bottom accent pulse line ── */}
            <motion.div
                animate={{ scaleX: [0.3, 1, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay }}
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 1,
                    background: `linear-gradient(90deg, transparent, rgb(${glowColor}), transparent)`,
                    transformOrigin: "center",
                }}
            />
        </motion.div>
    );
}
