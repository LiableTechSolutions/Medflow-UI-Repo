import { EmptyState } from '../EmptyState/EmptyState';
import { Loading } from '../Loading/Loading';
import { formatDate } from '../../../core/utils/format';
import './PatientStatusSummaryGraph.css';

export interface PatientStatusPoint {
  /** ISO date (yyyy-mm-dd) for this reading. */
  date: string;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  pulseRate: number;
  temperature: number;
  spo2: number;
}

interface Series {
  key: keyof Omit<PatientStatusPoint, 'date'>;
  label: string;
  color: string;
  domain: [number, number];
}

const SERIES: Series[] = [
  { key: 'bloodPressureSystolic', label: 'Systolic BP', color: 'var(--mf-amber-500)', domain: [70, 200] },
  { key: 'bloodPressureDiastolic', label: 'Diastolic BP', color: 'var(--mf-blue-700)', domain: [40, 130] },
  { key: 'pulseRate', label: 'Pulse (bpm)', color: 'var(--mf-blue-500)', domain: [40, 160] },
  { key: 'temperature', label: 'Temperature (°F)', color: 'var(--mf-coral-500)', domain: [95, 105] },
  { key: 'spo2', label: 'SpO₂ (%)', color: 'var(--mf-green-500)', domain: [80, 100] },
];

const WIDTH = 640;
const HEIGHT = 200;

interface PatientStatusSummaryGraphProps {
  points: PatientStatusPoint[];
  isLoading?: boolean;
  emptyMessage?: string;
}

/**
 * Trend chart plotting the vitals recorded in {@link DailyAnalysisTable} over the
 * course of the current admission. Hand-rolled SVG in the same spirit as
 * `VitalsLine`/`ActivityChart` — the repo has no charting dependency and this keeps
 * things dependency-free for a handful of simple line series.
 */
export function PatientStatusSummaryGraph({
  points,
  isLoading = false,
  emptyMessage = 'No vitals recorded yet for this admission.',
}: PatientStatusSummaryGraphProps) {
  if (isLoading) return <Loading label="Loading vitals trend…" />;
  if (points.length === 0) return <EmptyState title="Nothing to chart yet" description={emptyMessage} />;

  const sorted = [...points].sort((a, b) => a.date.localeCompare(b.date));

  function pathFor(series: Series): string {
    const [min, max] = series.domain;
    const span = max - min || 1;
    return sorted
      .map((point, index) => {
        const x = sorted.length === 1 ? WIDTH / 2 : (index / (sorted.length - 1)) * WIDTH;
        const ratio = Math.min(1, Math.max(0, (point[series.key] - min) / span));
        const y = HEIGHT - ratio * HEIGHT;
        return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  }

  return (
    <div className="mf-status-graph">
      <svg
        className="mf-status-graph__svg"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Vitals trend over the current admission"
      >
        {[0.25, 0.5, 0.75].map((fraction) => (
          <line
            key={fraction}
            x1={0}
            x2={WIDTH}
            y1={HEIGHT * fraction}
            y2={HEIGHT * fraction}
            className="mf-status-graph__gridline"
          />
        ))}
        {SERIES.map((series) => (
          <path key={series.key} d={pathFor(series)} stroke={series.color} className="mf-status-graph__line" fill="none" />
        ))}
      </svg>

      <div className="mf-status-graph__legend">
        {SERIES.map((series) => (
          <span key={series.key} className="mf-status-graph__legend-item">
            <span className="mf-status-graph__swatch" style={{ background: series.color }} aria-hidden="true" />
            {series.label}
          </span>
        ))}
      </div>

      <div className="mf-status-graph__axis">
        <span>{formatDate(sorted[0].date)}</span>
        {sorted.length > 1 && <span>{formatDate(sorted[sorted.length - 1].date)}</span>}
      </div>
    </div>
  );
}
