import './ActivityChart.css';

const DATA = [
  { label: 'Mon', value: 62 },
  { label: 'Tue', value: 78 },
  { label: 'Wed', value: 54 },
  { label: 'Thu', value: 91 },
  { label: 'Fri', value: 85 },
  { label: 'Sat', value: 40 },
  { label: 'Sun', value: 22 },
];

export function ActivityChart() {
  const max = Math.max(...DATA.map((d) => d.value));
  return (
    <div className="mf-chart">
      {DATA.map((d) => (
        <div className="mf-chart__col" key={d.label}>
          <div className="mf-chart__bar-track">
            <div className="mf-chart__bar" style={{ height: `${(d.value / max) * 100}%` }} />
          </div>
          <span className="mf-chart__label">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
