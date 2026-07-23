import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../../core/utils/cn';
import './CalendarWidget.css';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MARKED = [3, 9, 14, 21, 27];

export function CalendarWidget() {
  const today = useMemo(() => new Date(), []);
  const monthLabel = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div className="mf-calendar">
      <div className="mf-calendar__header">
        <span>{monthLabel}</span>
        <div className="mf-calendar__nav">
          <button aria-label="Previous month"><ChevronLeft size={14} /></button>
          <button aria-label="Next month"><ChevronRight size={14} /></button>
        </div>
      </div>
      <div className="mf-calendar__grid mf-calendar__grid--days">
        {DAYS.map((d, i) => (
          <span key={`${d}-${i}`} className="mf-calendar__day-label">{d}</span>
        ))}
      </div>
      <div className="mf-calendar__grid">
        {cells.map((day, idx) => (
          <span
            key={idx}
            className={cn(
              'mf-calendar__cell',
              day === today.getDate() && 'mf-calendar__cell--today',
              day && MARKED.includes(day) && 'mf-calendar__cell--marked'
            )}
          >
            {day ?? ''}
          </span>
        ))}
      </div>
    </div>
  );
}
