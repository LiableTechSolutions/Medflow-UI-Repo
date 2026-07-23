import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../../core/utils/cn';
import '../Input/Input.css';
import './DatePicker.css';

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

interface DatePickerProps {
  label?: string;
  hint?: string;
  error?: string;
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

/** Text-field trigger that opens a month-grid calendar popover for single-date selection. */
export function DatePicker({ label, hint, error, value, onChange, placeholder = 'Select a date', minDate, maxDate, className }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => value ?? new Date());
  const fieldId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  const cells = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1))];
  }, [viewDate]);

  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const today = new Date();

  const isDisabled = (day: Date) => (minDate && day < minDate) || (maxDate && day > maxDate);

  return (
    <div className={cn('mf-field', error && 'mf-field--error', className)} ref={rootRef}>
      {label && (
        <label className="mf-field__label" htmlFor={fieldId}>
          {label}
        </label>
      )}
      <div className="mf-field__control mf-datepicker">
        <button
          type="button"
          id={fieldId}
          className={cn('mf-field__input', 'mf-datepicker__trigger', !value && 'mf-datepicker__trigger--placeholder')}
          onClick={() => setIsOpen((v) => !v)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        >
          {value ? formatDate(value) : placeholder}
        </button>
        <span className="mf-field__icon mf-field__icon--right">
          <Calendar size={16} />
        </span>

        {isOpen && (
          <div className="mf-datepicker__popover" role="dialog" aria-label="Choose date">
            <div className="mf-datepicker__header">
              <button
                type="button"
                aria-label="Previous month"
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
              >
                <ChevronLeft size={14} />
              </button>
              <span>{monthLabel}</span>
              <button
                type="button"
                aria-label="Next month"
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
              >
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="mf-datepicker__grid mf-datepicker__grid--labels">
              {WEEKDAY_LABELS.map((d, i) => (
                <span key={`${d}-${i}`}>{d}</span>
              ))}
            </div>

            <div className="mf-datepicker__grid">
              {cells.map((day, idx) =>
                day ? (
                  <button
                    key={idx}
                    type="button"
                    disabled={isDisabled(day)}
                    className={cn(
                      'mf-datepicker__cell',
                      isSameDay(day, today) && 'mf-datepicker__cell--today',
                      value && isSameDay(day, value) && 'mf-datepicker__cell--selected'
                    )}
                    onClick={() => {
                      onChange(day);
                      setIsOpen(false);
                    }}
                  >
                    {day.getDate()}
                  </button>
                ) : (
                  <span key={idx} />
                )
              )}
            </div>
          </div>
        )}
      </div>
      {error ? (
        <p className="mf-field__message mf-field__message--error">{error}</p>
      ) : hint ? (
        <p className="mf-field__message">{hint}</p>
      ) : null}
    </div>
  );
}
