import { type TextareaHTMLAttributes, forwardRef, useId } from 'react';
import { cn } from '../../../core/utils/cn';
import '../Input/Input.css';
import './Textarea.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, className, id, rows = 3, ...rest },
  ref
) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <div className={cn('mf-field', error && 'mf-field--error', className)}>
      {label && (
        <label className="mf-field__label" htmlFor={fieldId}>
          {label}
        </label>
      )}
      <div className="mf-field__control">
        <textarea
          ref={ref}
          id={fieldId}
          className="mf-field__input mf-field__input--textarea"
          rows={rows}
          aria-invalid={!!error}
          {...rest}
        />
      </div>
      {error ? (
        <p className="mf-field__message mf-field__message--error">{error}</p>
      ) : hint ? (
        <p className="mf-field__message">{hint}</p>
      ) : null}
    </div>
  );
});
