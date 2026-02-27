import { useRef, useState, useEffect } from "react";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    AnimatePresence,
} from "framer-motion";

/**
 * FloatingCard
 * Glassmorphic 3D-tilt card with:
 *  - Spring mouse-tracking tilt
 *  - Anti-gravity float loop
 *  - "Power on" white flash on first viewport entry
 *  - Scanline texture overlay
 *  - Inner shimmer sweep
 *  - Corner data-id tag
 */
let _cardCounter = 0;

export default function FloatingCard({
    children,
    className = "",
    title,
    glowColor = "0,255,136",
    delay = 0,
}) {
    const cardRef = useRef(null);
    const cardId = useRef(`CARD_${(++_cardCounter).toString().padStart(3, "0")}`).current;

    // ── Power-on flash (fires once on first intersection) ──────────────────
    const [powered, setPowered] = useState(false);
    const [flash, setFlash] = useState(false);

    useEffect(() => {
        if (!cardRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !powered) {
                    setPowered(true);
                    setFlash(true);
                    setTimeout(() => setFlash(false), 600);
                }
            },
            { threshold: 0.3 }
        );
        observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, [powered]);

    // ── 3D Tilt ────────────────────────────────────────────────────────────
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rawRotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
    const rawRotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

    const rotateX = useSpring(rawRotateX, { stiffness: 300, damping: 30 });
    const rotateY = useSpring(rawRotateY, { stiffness: 300, damping: 30 });

    function handleMouseMove(e) {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    }

    function handleMouseLeave() {
        mouseX.set(0);
        mouseY.set(0);
    }

    return (
        <motion.div
            ref={cardRef}
            className={className}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: [0, -12, 0] }}
            transition={{
                opacity: { duration: 0.6, delay },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
            }}
            whileHover={{
                scale: 1.03,
                boxShadow: `0 0 40px rgba(${glowColor},0.3)`,
            }}
            style={{
                rotateX,
                rotateY,
                transformPerspective: 800,
                transformStyle: "preserve-3d",
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                padding: "20px",
                position: "relative",
                overflow: "hidden",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* TOP SHIMMER LINE */}
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(90deg, transparent, rgba(${glowColor},0.4), transparent)`,
            }} />

            {/* SCANLINE TEXTURE */}
            <div style={{
                position: "absolute", inset: 0,
                borderRadius: "inherit",
                pointerEvents: "none",
                background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
                zIndex: 0,
            }} />

            {/* SHIMMER SWEEP */}
            <motion.div
                animate={{ backgroundPosition: ["0% 0%", "200% 200%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
                style={{
                    position: "absolute", inset: 0,
                    borderRadius: "inherit", pointerEvents: "none",
                    background: "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%)",
                    backgroundSize: "200% 200%", zIndex: 0,
                }}
            />

            {/* POWER-ON FLASH */}
            <AnimatePresence>
                {flash && (
                    <motion.div
                        key="flash"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.4, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            position: "absolute", inset: 0,
                            borderRadius: "inherit",
                            background: "rgba(255,255,255,0.9)",
                            pointerEvents: "none", zIndex: 5,
                        }}
                    />
                )}
            </AnimatePresence>

            {/* DATA-ID CORNER TAG */}
            <div style={{
                position: "absolute", top: 6, right: 8,
                fontFamily: "monospace", fontSize: 8,
                color: `rgba(${glowColor},0.2)`,
                letterSpacing: "0.05em", pointerEvents: "none", zIndex: 1,
            }}>
                // {cardId}
            </div>

            {/* TITLE */}
            {title && (
                <div style={{
                    fontSize: "10px", fontFamily: "monospace",
                    letterSpacing: "0.15em", textTransform: "uppercase",
                    color: `rgba(${glowColor},0.6)`, marginBottom: "12px",
                    position: "relative", zIndex: 1,
                }}>
                    {title}
                </div>
            )}

            {/* CHILDREN */}
            <div style={{ transform: "translateZ(20px)", position: "relative", zIndex: 1 }}>
                {children}
            </div>
        </motion.div>
    );
}
