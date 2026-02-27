/**
 * Sidebar.jsx — collapsible glassmorphism sidebar
 * Props: isOpen, geminiKey, setGeminiKey, saveConfig,
 *        uploadPDF, pdfLabel, status, autopilot, setAutopilot,
 *        swarmSpeed, setSwarmSpeed, logs
 */
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// ── Section heading ───────────────────────────────────────────────────────
function SectionHeading({ children }) {
    return (
        <div style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: 9,
            letterSpacing: "0.2em",
            color: "rgba(0,255,136,0.5)",
            textTransform: "uppercase",
            padding: "14px 0 8px",
            borderBottom: "1px solid rgba(0,255,136,0.08)",
            marginBottom: 12,
        }}>
            {children}
        </div>
    );
}

// ── Custom toggle switch ──────────────────────────────────────────────────
function ToggleSwitch({ on, onToggle, label }) {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{
                fontFamily: "'Orbitron',monospace", fontSize: 10,
                color: on ? "#00ff88" : "rgba(255,255,255,0.4)",
                letterSpacing: "0.12em",
                transition: "color 0.3s",
            }}>
                {label}
            </span>
            <div
                onClick={onToggle}
                style={{
                    width: 44, height: 22,
                    borderRadius: 11,
                    background: on ? "rgba(0,255,136,0.15)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${on ? "rgba(0,255,136,0.5)" : "rgba(255,255,255,0.15)"}`,
                    position: "relative",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    flexShrink: 0,
                }}
            >
                <motion.div
                    animate={{ x: on ? 22 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    style={{
                        position: "absolute",
                        top: 2,
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: on ? "#00ff88" : "rgba(255,255,255,0.25)",
                        boxShadow: on ? "0 0 8px #00ff88, 0 0 16px rgba(0,255,136,0.4)" : "none",
                        transition: "background 0.3s, box-shadow 0.3s",
                    }}
                />
            </div>
        </div>
    );
}

// ── Drag-and-drop PDF zone ────────────────────────────────────────────────
function PDFDropZone({ uploadPDF, pdfLabel, status }) {
    const fileRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadInfo, setUploadInfo] = useState(null); // {ok, filename, pages, chars} | {error}

    const handleDrop = async (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer?.files[0] ?? e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setUploadInfo(null);
        const result = await uploadPDF(file);
        setUploading(false);
        if (result) setUploadInfo(result);
    };

    const indexed = status?.pdf_loaded;

    return (
        <div>
            <motion.div
                animate={dragging ? { scale: 1.02, borderColor: "rgba(0,255,136,0.8)", background: "rgba(0,255,136,0.05)" } : {}}
                style={{
                    border: `1px dashed rgba(0,255,136,${dragging ? "0.8" : "0.2"})`,
                    borderRadius: 8,
                    minHeight: 90,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    cursor: "pointer",
                    transition: "border-color 0.2s",
                }}
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
            >
                <span style={{ fontSize: 22 }}>📄</span>
                <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.5)" }}>
                    DROP PDF HERE
                </span>
                <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.25)" }}>
                    or click to browse
                </span>
            </motion.div>

            <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={handleDrop}
            />

            {/* Progress bar */}
            <AnimatePresence>
                {uploading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ marginTop: 8, height: 4, background: "rgba(0,255,136,0.1)", borderRadius: 2, overflow: "hidden" }}
                    >
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            style={{ height: "100%", background: "linear-gradient(90deg,#00ff88,#00d4ff)", borderRadius: 2 }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Upload result */}
            {!uploading && uploadInfo && (
                uploadInfo.error ? (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ marginTop: 8, fontFamily: "monospace", fontSize: 10, color: "#ff4444", lineHeight: 1.5 }}
                    >
                        ❌ {uploadInfo.error}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ marginTop: 8, fontFamily: "monospace", fontSize: 10, color: "#00ff88", lineHeight: 1.6 }}
                    >
                        ✅ {uploadInfo.filename}<br />
                        <span style={{ color: "rgba(0,212,255,0.7)" }}>
                            {uploadInfo.pages}p · {uploadInfo.chars?.toLocaleString()} chars · {uploadInfo.size_mb}MB
                        </span>
                    </motion.div>
                )
            )}

            {!indexed && !uploading && !uploadInfo && (
                <div style={{ marginTop: 6, fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.25)" }}>
                    ⚠ No PDF loaded — Professor waits
                </div>
            )}
        </div>
    );
}

// ── System vitals row ────────────────────────────────────────────────────
function VitalRow({ label, value, blink = false }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0" }}>
            <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}>
                {label}
            </span>
            <motion.span
                animate={blink ? { opacity: [1, 0.3, 1] } : {}}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{ fontFamily: "monospace", fontSize: 9, color: "#00ff88" }}
            >
                {value}
            </motion.span>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────
export default function Sidebar({
    isOpen,
    geminiKey, setGeminiKey,
    saveConfig,
    uploadPDF, pdfLabel,
    status = {},
    autopilot, setAutopilot,
    swarmSpeed, setSwarmSpeed,
    logs = [],
}) {
    const [keyFocus, setKeyFocus] = useState(false);
    const [lastCycle, setLastCycle] = useState("—");

    // Track last cycle time from logs
    useEffect(() => {
        const last = logs.find(l => l.agent === "SYSTEM");
        if (last) setLastCycle(last.time);
    }, [logs]);

    return (
        <motion.div
            animate={{ x: isOpen ? 0 : -284 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
                position: "fixed",
                left: 0,
                top: 56,   // below navbar
                bottom: 0,
                width: 280,
                zIndex: 50,
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                background: "rgba(2,5,9,0.92)",
                borderRight: "1px solid rgba(0,255,136,0.1)",
                overflowY: "auto",
                overflowX: "hidden",
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(0,255,136,0.15) transparent",
                padding: "0 18px 80px",
            }}
        >
            {/* ── SECTION 1: BRAIN CONFIG ── */}
            <SectionHeading>⚡ Brain Config</SectionHeading>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <label style={{ fontFamily: "'Orbitron',monospace", fontSize: 9, color: "rgba(0,255,136,0.5)", letterSpacing: "0.12em" }}>
                    GEMINI API KEY
                </label>
                <input
                    type="password"
                    value={geminiKey}
                    onChange={e => setGeminiKey(e.target.value)}
                    onFocus={() => setKeyFocus(true)}
                    onBlur={() => setKeyFocus(false)}
                    placeholder="Leave empty for simulation"
                    style={{
                        width: "100%",
                        background: "transparent",
                        border: "none",
                        borderBottom: `1px solid ${keyFocus ? "#00ff88" : "rgba(0,255,136,0.3)"}`,
                        boxShadow: keyFocus ? "0 2px 8px rgba(0,255,136,0.2)" : "none",
                        outline: "none",
                        color: "#00ff88",
                        caretColor: "#00ff88",
                        fontFamily: "monospace",
                        fontSize: 12,
                        padding: "6px 2px",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                />
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={saveConfig}
                    style={{
                        width: "100%",
                        padding: "9px 0",
                        background: "linear-gradient(90deg,rgba(0,255,136,0.25),rgba(0,212,255,0.2))",
                        border: "1px solid rgba(0,255,136,0.35)",
                        borderRadius: 6,
                        color: "#00ff88",
                        fontFamily: "'Orbitron',monospace",
                        fontSize: 10,
                        letterSpacing: "0.15em",
                        cursor: "pointer",
                    }}
                >
                    SAVE KEY
                </motion.button>
            </div>

            {/* ── SECTION 2: KNOWLEDGE BASE ── */}
            <SectionHeading>📚 Knowledge Base</SectionHeading>
            <PDFDropZone uploadPDF={uploadPDF} pdfLabel={pdfLabel} status={status} />

            {/* ── SECTION 3: MISSION CONTROL ── */}
            <SectionHeading>🎯 Mission Control</SectionHeading>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <ToggleSwitch on={autopilot} onToggle={() => setAutopilot(v => !v)} label="AUTOPILOT" />

                {/* Swarm speed slider */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontFamily: "'Orbitron',monospace", fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em" }}>
                        SWARM SPEED
                    </span>
                    <input
                        type="range"
                        min={1} max={5}
                        value={swarmSpeed}
                        onChange={e => setSwarmSpeed(Number(e.target.value))}
                        style={{ width: "100%", accentColor: "#00ff88", cursor: "pointer" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.25)" }}>SLOW</span>
                        <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(0,255,136,0.5)" }}>{swarmSpeed}x</span>
                        <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.25)" }}>FAST</span>
                    </div>
                </div>
            </div>

            {/* ── SECTION 4: SYSTEM VITALS ── */}
            <SectionHeading>📡 System Vitals</SectionHeading>

            <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                <VitalRow label="API LATENCY" value={status.mode ? "~120ms" : "—"} blink={!!status.mode} />
                <VitalRow label="PDF STATUS" value={status.pdf_loaded ? "INDEXED" : "NONE"} blink={status.pdf_loaded} />
                <VitalRow label="AGENTS READY" value="4 / 4" blink={true} />
                <VitalRow label="LAST CYCLE" value={lastCycle} blink={lastCycle !== "—"} />
                <VitalRow label="LEADS TRACKED" value={status.total_leads ?? "4"} blink={false} />
                <VitalRow label="OPPORTUNITIES" value={status.opportunities ?? "0"} blink={status.opportunities > 0} />
            </div>
        </motion.div>
    );
}
