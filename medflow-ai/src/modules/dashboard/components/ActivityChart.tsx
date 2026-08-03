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

export interface ActivityPoint {
  label: string;
  value: number;
}

/** Renders the supplied series; falls back to sample data when none is passed. */
export function ActivityChart({ data = DATA }: { data?: ActivityPoint[] }) {
  const series = data.length > 0 ? data : DATA;
  const max = Math.max(...series.map((d) => d.value), 1);
  return (
    <div className="mf-chart">
      {series.map((d) => (
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
