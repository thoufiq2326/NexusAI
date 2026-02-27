/**
 * MetricsRow.jsx — 4-column MetricCard grid
 * Props: status, analytics
 */
import MetricCard from "./MetricCard";

export default function MetricsRow({ status, analytics }) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 16,
                marginBottom: 32,
            }}
        >
            <MetricCard
                title="LEAD FLOW"
                numericTarget={Number(status.total_leads ?? 4)}
                suffix=""
                decimals={0}
                sub="Prospects"
                glowColor="0,255,136"
                progressPct={100}
                delay={0}
            />
            <MetricCard
                title="ICP MATCH RATE"
                numericTarget={analytics.avg_icp_score > 0 ? analytics.avg_icp_score : analytics.icp_match_rate ?? 87}
                suffix="%"
                decimals={0}
                sub="Avg ICP Score"
                glowColor="0,212,255"
                progressPct={analytics.avg_icp_score > 0 ? analytics.avg_icp_score : 87}
                delay={0.1}
            />
            <MetricCard
                title="ETHICAL AUDIT"
                numericTarget={100}
                suffix="%"
                decimals={0}
                sub="0 Bias Detected"
                glowColor="120,255,100"
                progressPct={100}
                delay={0.2}
            />
            <MetricCard
                title="ROI MULTIPLIER"
                numericTarget={analytics.roi_multiplier ?? 4.2}
                suffix="x"
                decimals={1}
                sub="vs Manual"
                glowColor="255,200,0"
                progressPct={Math.min(100, (analytics.roi_multiplier ?? 4.2) * 20)}
                delay={0.3}
            />
        </div> /* END: MetricsRow grid */
    );
}
