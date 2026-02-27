import { useMemo } from "react";
import { motion } from "framer-motion";

// Seeded random helpers (plain Math.random is fine — values are memoised)
const rand = (min, max) => Math.random() * (max - min) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export default function ParticleField() {
    // ── LAYER 2: 6 large orbs ─────────────────────────────────────────────
    const orbs = useMemo(
        () =>
            Array.from({ length: 6 }, (_, i) => ({
                id: i,
                x: rand(10, 90),
                y: rand(10, 90),
                size: rand(120, 300),
                color: i % 2 === 0 ? "0,255,136" : "0,212,255",
                duration: rand(12, 20),
                delay: rand(0, 6),
            })),
        []
    );

    // ── LAYER 3: 55 particles ─────────────────────────────────────────────
    const particles = useMemo(
        () =>
            Array.from({ length: 55 }, (_, i) => {
                const opacity = rand(0.12, 0.4);
                return {
                    id: i,
                    x: rand(0, 100),
                    y: rand(0, 100),
                    size: rand(1.5, 4),
                    color: pick(["0,255,136", "0,212,255"]),
                    opacity,
                    duration: rand(3, 9),
                    delay: rand(0, 5),
                    floatY: -rand(15, 55),
                };
            }),
        []
    );

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                pointerEvents: "none",
                overflow: "hidden",
                zIndex: 0,
            }}
        >
            {/* ── LAYER 1: Deep space gradient ── */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(ellipse at 20% 50%, rgba(0,255,136,0.03) 0%, transparent 50%), " +
                        "radial-gradient(ellipse at 80% 20%, rgba(0,212,255,0.04) 0%, transparent 40%)",
                }}
            />

            {/* ── LAYER 2: Large orbs ── */}
            {orbs.map((orb) => (
                <motion.div
                    key={`orb-${orb.id}`}
                    animate={{ x: [-25, 25, -25], y: [-20, 20, -20], scale: [1, 1.15, 1] }}
                    transition={{
                        duration: orb.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: orb.delay,
                    }}
                    style={{
                        position: "absolute",
                        left: `${orb.x}%`,
                        top: `${orb.y}%`,
                        width: orb.size,
                        height: orb.size,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, rgba(${orb.color},0.15) 0%, transparent 70%)`,
                        filter: "blur(40px)",
                        transform: "translate(-50%, -50%)",
                    }}
                />
            ))}

            {/* ── LAYER 3: Particles ── */}
            {particles.map((p) => (
                <motion.div
                    key={`p-${p.id}`}
                    animate={{
                        y: [0, p.floatY, 0],
                        opacity: [p.opacity, p.opacity * 0.2, p.opacity],
                        scale: [1, 0.6, 1],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: p.delay,
                    }}
                    style={{
                        position: "absolute",
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        borderRadius: "50%",
                        background: `rgba(${p.color},${p.opacity})`,
                        boxShadow: `0 0 ${p.size * 2}px rgba(${p.color},${p.opacity * 0.6})`,
                    }}
                />
            ))}

            {/* ── LAYER 4: Grid overlay ── */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.025,
                    backgroundImage:
                        "linear-gradient(rgba(0,255,136,0.5) 1px, transparent 1px), " +
                        "linear-gradient(90deg, rgba(0,255,136,0.5) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />
        </div>
    );
}
