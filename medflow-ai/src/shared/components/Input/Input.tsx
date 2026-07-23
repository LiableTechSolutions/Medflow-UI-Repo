import { type InputHTMLAttributes, type ReactNode, forwardRef, useId } from 'react';
import { cn } from '../../../core/utils/cn';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, leftIcon, rightIcon, className, id, ...rest },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={cn('mf-field', error && 'mf-field--error', className)}>
      {label && (
        <label className="mf-field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="mf-field__control">
        {leftIcon && <span className="mf-field__icon mf-field__icon--left">{leftIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          className={cn('mf-field__input', leftIcon && 'mf-field__input--has-left', rightIcon && 'mf-field__input--has-right')}
          aria-invalid={!!error}
          {...rest}
        />
        {rightIcon && <span className="mf-field__icon mf-field__icon--right">{rightIcon}</span>}
      </div>
      {error ? (
        <p className="mf-field__message mf-field__message--error">{error}</p>
      ) : hint ? (
        <p className="mf-field__message">{hint}</p>
      ) : null}
    </div>
  );
});
