/**
 * Common inline-validation utilities for the shared component library.
 *
 * Every validator has the shape `(value: string) => string | undefined` — no error
 * means valid. Compose several with `composeValidators`, and wire the result into any
 * `Input`/`Select`/`SearchableSelect`'s `error` prop (typically only shown once a field
 * has been touched or the form was submitted — see `useInlineValidation`).
 */

export type Validator = (value: string) => string | undefined;

export function composeValidators(...validators: (Validator | undefined | false)[]): Validator {
  return (value: string) => {
    for (const validator of validators) {
      if (!validator) continue;
      const message = validator(value);
      if (message) return message;
    }
    return undefined;
  };
}

export const required = (label: string): Validator => (value) =>
  value.trim() ? undefined : `${label} is required`;

export const pattern = (regexp: RegExp, message: string): Validator => (value) =>
  !value.trim() || regexp.test(value.trim()) ? undefined : message;

export const minLength = (length: number, message?: string): Validator => (value) =>
  !value.trim() || value.trim().length >= length ? undefined : message ?? `Must be at least ${length} characters`;

export const maxLength = (length: number, message?: string): Validator => (value) =>
  value.trim().length <= length ? undefined : message ?? `Must be at most ${length} characters`;

export const numberInRange = (min: number, max: number, message?: string): Validator => (value) => {
  if (!value.trim()) return undefined;
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return message ?? `Enter a number between ${min} and ${max}`;
  return numeric >= min && numeric <= max ? undefined : message ?? `Enter a number between ${min} and ${max}`;
};

// India-specific presets already proven out in the patient registration form — kept here
// so every shared-library field can reuse the exact same rules instead of redefining them.
const namePattern = /^[A-Za-z][A-Za-z .'-]{1,99}$/;
const indianMobilePattern = /^[6-9]\d{9}$/;
const indianPinPattern = /^[1-9]\d{5}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const bloodGroupPattern = /^(A|B|AB|O)[+-]$/;

export const validators = {
  personName: pattern(namePattern, 'Enter a valid name using letters only'),
  email: pattern(emailPattern, 'Enter a valid email address'),
  postalCode: pattern(indianPinPattern, 'Enter a valid 6-digit Indian PIN code'),
  bloodGroup: pattern(bloodGroupPattern, 'Choose a valid blood group, for example O+'),
  /**
   * Local 10-digit Indian mobile number. Deliberately has no country-code field or
   * prefix of its own — it accepts (and strips) an optional `+91`/`91` a user might
   * paste in, but never renders a country selector.
   */
  indianMobile: (value: string) => {
    if (!value.trim()) return undefined;
    const digitsOnly = value.trim().replace(/^(?:\+91|91)[ -]?/, '').replace(/[ -]/g, '');
    return indianMobilePattern.test(digitsOnly) ? undefined : 'Use a valid Indian mobile number, for example 9876543210';
  },
};

/** Strips an optional +91/91 prefix so the digits can be sent to the API on their own. */
export function normalizeIndianMobile(value: string): string {
  return value.trim().replace(/^(?:\+91|91)[ -]?/, '').replace(/[ -]/g, '');
}

/** Today's date as `yyyy-mm-dd`, for capping an `<input type="date">`'s `max` attribute. */
export const todayDateOnly = (): string => new Date().toISOString().slice(0, 10);

/** Rejects any `yyyy-mm-dd` value later than today — for DOB, admission date, etc. */
export const notFutureDate: Validator = (value) => {
  if (!value.trim()) return undefined;
  return value > todayDateOnly() ? 'This date cannot be in the future' : undefined;
};
