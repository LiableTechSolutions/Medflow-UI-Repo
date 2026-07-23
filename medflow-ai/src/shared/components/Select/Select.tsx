import { type SelectHTMLAttributes, forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../../core/utils/cn';
import '../Input/Input.css';
import './Select.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, options, placeholder, className, id, ...rest },
  ref
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className={cn('mf-field', error && 'mf-field--error', className)}>
      {label && (
        <label className="mf-field__label" htmlFor={selectId}>
          {label}
        </label>
      )}
      <div className="mf-field__control">
        <select ref={ref} id={selectId} className="mf-field__select mf-select" aria-invalid={!!error} {...rest}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="mf-field__icon mf-field__icon--right">
          <ChevronDown size={16} />
        </span>
      </div>
      {error ? (
        <p className="mf-field__message mf-field__message--error">{error}</p>
      ) : hint ? (
        <p className="mf-field__message">{hint}</p>
      ) : null}
    </div>
  );
});
