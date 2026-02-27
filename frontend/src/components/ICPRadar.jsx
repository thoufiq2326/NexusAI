import { motion } from "framer-motion";
import {
    PolarAngleAxis,
    PolarGrid,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

// ── Custom angle-axis tick ──────────────────────────────────────────────────
function MonoTick({ payload, x, y, textAnchor, index, outerRadius }) {
    return (
        <text
            x={x}
            y={y}
            textAnchor={textAnchor}
            fill="rgba(255,255,255,0.5)"
            fontSize={10}
            fontFamily="monospace"
        >
            {payload.value}
        </text>
    );
}

// ── Custom tooltip ─────────────────────────────────────────────────────────
function GlassTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    const { subject, value } = payload[0].payload;
    return (
        <div
            style={{
                background: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(0,255,136,0.2)",
                borderRadius: "8px",
                padding: "8px 14px",
                fontFamily: "monospace",
                fontSize: "12px",
                color: "#00ff88",
            }}
        >
            <div style={{ color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>{subject}</div>
            <div style={{ fontWeight: "bold" }}>{value}%</div>
        </div>
    );
}

// ── Status badge colors ────────────────────────────────────────────────────
const STATUS_COLORS = {
    Opportunity: "#00ff88",
    Nurtured: "#bf5fff",
    Scored: "#38bdf8",
};

// ── Main component ─────────────────────────────────────────────────────────
export default function ICPRadar({ leads = [] }) {
    const hasScored = leads.some((l) => l.icp_score > 0);

    const radarData = [
        { subject: "ICP Fit", value: hasScored ? 95 : 0 },
        { subject: "Intent Score", value: hasScored ? 88 : 0 },
        { subject: "Compliance", value: hasScored ? 100 : 0 },
        { subject: "Engagement", value: hasScored ? 76 : 0 },
        { subject: "Budget Signal", value: hasScored ? 82 : 0 },
    ];

    const scoredLeads = leads.filter((l) => l.icp_score > 0);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.75, rotateX: 25 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{
                transformPerspective: 1200,
                transformStyle: "preserve-3d",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
            }}
        >
            {/* ── Outer pulse ring ── */}
            <motion.div
                animate={{ scale: [1, 1.04, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: "absolute",
                    inset: "16px",
                    borderRadius: "50%",
                    border: "1px solid rgba(0,255,136,0.15)",
                    pointerEvents: "none",
                }}
            />

            {/* ── Radar chart ── */}
            <div style={{ flex: "0 0 260px", width: "100%" }}>
                {hasScored ? (
                    <ResponsiveContainer width="100%" height={260}>
                        <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                            <PolarGrid stroke="rgba(255,255,255,0.06)" />
                            <PolarAngleAxis dataKey="subject" tick={<MonoTick />} />
                            <Radar
                                dataKey="value"
                                stroke="#00ff88"
                                fill="rgba(0,255,136,0.12)"
                                strokeWidth={2}
                                dot={{ fill: "#00ff88", r: 3 }}
                            />
                            <Tooltip content={<GlassTooltip />} />
                        </RadarChart>
                    </ResponsiveContainer>
                ) : (
                    /* ── Empty state ── */
                    <div
                        style={{
                            height: 260,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <motion.p
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            style={{
                                fontFamily: "monospace",
                                fontSize: "13px",
                                color: "rgba(0,255,136,0.6)",
                            }}
                        >
                            Waiting for Hunter Agent…
                        </motion.p>
                    </div>
                )}
            </div>

            {/* ── Scored lead list ── */}
            {scoredLeads.length > 0 && (
                <div style={{ padding: "0 4px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {scoredLeads.map((lead, i) => (
                        <motion.div
                            key={lead.id}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.35 }}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "8px 12px",
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                borderRadius: "8px",
                            }}
                        >
                            {/* Company */}
                            <span style={{ fontFamily: "monospace", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
                                {lead.company}
                            </span>

                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                {/* ICP score */}
                                <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#00ff88", fontWeight: "bold" }}>
                                    {lead.icp_score}%
                                </span>

                                {/* Status badge */}
                                <span
                                    style={{
                                        fontSize: "10px",
                                        fontFamily: "monospace",
                                        padding: "2px 8px",
                                        borderRadius: "999px",
                                        border: `1px solid ${STATUS_COLORS[lead.status] ?? "rgba(255,255,255,0.2)"}`,
                                        color: STATUS_COLORS[lead.status] ?? "rgba(255,255,255,0.4)",
                                        background: `${STATUS_COLORS[lead.status] ?? "#ffffff"}18`,
                                    }}
                                >
                                    {lead.status}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
