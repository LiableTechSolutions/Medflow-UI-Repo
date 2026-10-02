import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../../core/utils/cn';
import './CalendarWidget.css';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MARKED = [3, 9, 14, 21, 27];

export function CalendarWidget() {
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const goToPreviousMonth = () => {
    setViewYear((year) => (viewMonth === 0 ? year - 1 : year));
    setViewMonth((month) => (month === 0 ? 11 : month - 1));
  };
  const goToNextMonth = () => {
    setViewYear((year) => (viewMonth === 11 ? year + 1 : year));
    setViewMonth((month) => (month === 11 ? 0 : month + 1));
  };

  return (
    <div className="mf-calendar">
      <div className="mf-calendar__header">
        <span>{monthLabel}</span>
        <div className="mf-calendar__nav">
          <button type="button" aria-label="Previous month" onClick={goToPreviousMonth}>
            <ChevronLeft size={14} />
          </button>
          <button type="button" aria-label="Next month" onClick={goToNextMonth}>
            <ChevronRight size={14} />
          </button>
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
              isCurrentMonth && day === today.getDate() && 'mf-calendar__cell--today',
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
