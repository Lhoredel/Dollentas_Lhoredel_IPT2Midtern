export function ConditionChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  return (
    <div className="condition-chart">
      {data.map((item) => (
        <div className="condition-row" key={item.label}>
          <div className="condition-label">
            <span className={`dot dot-${item.label.toLowerCase().replace(/\s+/g, "-")}`} />
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${(item.value / total) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ActivityChart() {
  const values = [42, 58, 46, 74, 65, 83, 68];
  return (
    <div className="activity-chart">
      <div className="chart-y">
        <span>100</span><span>75</span><span>50</span><span>25</span><span>0</span>
      </div>
      <div className="chart-bars">
        {values.map((value, index) => (
          <div className="chart-bar-wrap" key={index}>
            <div className="chart-bar" style={{ height: `${value}%` }} />
            <small>{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}</small>
          </div>
        ))}
      </div>
    </div>
  );
}