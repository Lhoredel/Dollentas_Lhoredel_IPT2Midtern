import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function StatCard({ title, value, subtitle, icon: Icon, trend, trendUp = true }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-icon"><Icon size={20} /></div>
        {trend && (
          <span className={`trend ${trendUp ? "trend-up" : "trend-down"}`}>
            {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trend}
          </span>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-title">{title}</div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}
    </div>
  );
}