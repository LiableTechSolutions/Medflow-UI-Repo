import { type InputHTMLAttributes, forwardRef, useId } from 'react';
import { cn } from '../../../core/utils/cn';
import './Radio.css';

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  hint?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, hint, className, id, disabled, ...rest },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={cn('mf-radio', disabled && 'mf-radio--disabled', className)}>
      <span className="mf-radio__control">
        <input ref={ref} type="radio" id={inputId} className="mf-radio__input" disabled={disabled} {...rest} />
        <span className="mf-radio__dot" />
      </span>
      {(label || hint) && (
        <span className="mf-radio__text">
          {label && (
            <label className="mf-radio__label" htmlFor={inputId}>
              {label}
            </label>
          )}
          {hint && <span className="mf-radio__hint">{hint}</span>}
        </span>
      )}
    </div>
  );
});

interface RadioGroupOption {
  value: string;
  label: string;
  hint?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioGroupOption[];
  direction?: 'vertical' | 'horizontal';
  className?: string;
}

/** Convenience wrapper for a controlled set of mutually-exclusive Radio inputs. */
export function RadioGroup({ name, label, value, onChange, options, direction = 'vertical', className }: RadioGroupProps) {
  return (
    <div className={cn('mf-radio-group', className)} role="radiogroup" aria-label={label}>
      {label && <span className="mf-radio-group__label">{label}</span>}
      <div className={cn('mf-radio-group__options', `mf-radio-group__options--${direction}`)}>
        {options.map((opt) => (
          <Radio
            key={opt.value}
            name={name}
            label={opt.label}
            hint={opt.hint}
            disabled={opt.disabled}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}

export type { RadioGroupOption };
