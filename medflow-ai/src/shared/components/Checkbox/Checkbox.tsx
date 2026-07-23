import { type InputHTMLAttributes, forwardRef, useId } from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '../../../core/utils/cn';
import './Checkbox.css';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  hint?: string;
  /** Renders the dash/indeterminate glyph regardless of the checked state. */
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, hint, indeterminate = false, className, id, disabled, ...rest },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={cn('mf-checkbox', disabled && 'mf-checkbox--disabled', className)}>
      <span className="mf-checkbox__control">
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          className="mf-checkbox__input"
          disabled={disabled}
          aria-checked={indeterminate ? 'mixed' : undefined}
          {...rest}
        />
        <span className="mf-checkbox__box">
          {indeterminate ? <Minus size={12} strokeWidth={3} /> : <Check size={12} strokeWidth={3} />}
        </span>
      </span>
      {(label || hint) && (
        <span className="mf-checkbox__text">
          {label && (
            <label className="mf-checkbox__label" htmlFor={inputId}>
              {label}
            </label>
          )}
          {hint && <span className="mf-checkbox__hint">{hint}</span>}
        </span>
      )}
    </div>
  );
});
