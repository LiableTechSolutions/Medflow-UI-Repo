import { useCallback, useState } from 'react';
import type { Validator } from '../../core/utils/validation';

/**
 * Drives inline field validation the same way across every shared-library form: an
 * error only shows once the field has been left (blur) or the form was submitted, and
 * never while the field the user is currently typing in still has focus.
 *
 * ```tsx
 * const { errorFor, handleFocus, handleBlur, markSubmitted, hasErrors } =
 *   useInlineValidation({ phone: validators.indianMobile, email: validators.email });
 *
 * <Input value={phone} onFocus={handleFocus('phone')} onBlur={handleBlur('phone')}
 *        error={errorFor('phone', phone)} onChange={...} />
 * ```
 */
export function useInlineValidation<F extends string>(schema: Partial<Record<F, Validator>>) {
  const [submitted, setSubmitted] = useState(false);
  const [activeField, setActiveField] = useState<F | null>(null);

  const handleFocus = useCallback((field: F) => () => setActiveField(field), []);
  const handleBlur = useCallback(
    (field: F) => () => setActiveField((current) => (current === field ? null : current)),
    [],
  );

  const rawError = useCallback((field: F, value: string) => schema[field]?.(value), [schema]);

  const errorFor = useCallback(
    (field: F, value: string) => {
      const message = rawError(field, value);
      if (!message) return undefined;
      return submitted && activeField !== field ? message : undefined;
    },
    [rawError, submitted, activeField],
  );

  const hasErrors = useCallback(
    (values: Record<F, string>) => (Object.keys(schema) as F[]).some((field) => Boolean(rawError(field, values[field] ?? ''))),
    [schema, rawError],
  );

  return { submitted, markSubmitted: () => setSubmitted(true), reset: () => { setSubmitted(false); setActiveField(null); }, handleFocus, handleBlur, errorFor, hasErrors };
}
