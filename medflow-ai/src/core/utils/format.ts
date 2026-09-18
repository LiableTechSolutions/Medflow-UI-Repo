/** Display helpers shared by the module pages. */

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export const formatMoney = (value?: number | null) => currency.format(value ?? 0);

export const formatDateTime = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleString(undefined, {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

export const formatTime = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '—';

export const formatDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

/**
 * Converts a bare `yyyy-mm-dd` (what an `<input type="date">` gives you) into a full
 * ISO-8601 instant. The BFF's `Instant` fields (admission/discharge dates) reject a
 * date-only string outright with "Malformed request body" — they need the time and
 * offset too.
 */
export const toIsoInstant = (dateOnly: string): string =>
  dateOnly.includes('T') ? dateOnly : new Date(`${dateOnly}T00:00:00Z`).toISOString();

/** BOOKED → Booked, IN_CONSULTATION → In consultation */
export const humanize = (value?: string | null) =>
  value ? value.charAt(0) + value.slice(1).toLowerCase().replace(/_/g, ' ') : '—';

type Tone = 'neutral' | 'teal' | 'green' | 'amber' | 'coral';

/** Shared colour language for the workflow states the API returns. */
export function statusTone(status?: string | null): Tone {
  switch (status) {
    case 'COMPLETED':
    case 'ACTIVE':
    case 'CONFIRMED':
      return 'green';
    case 'BOOKED':
    case 'ORDERED':
    case 'CHECKED_IN':
      return 'teal';
    case 'IN_CONSULTATION':
    case 'IN_PROGRESS':
    case 'PENDING_VERIFICATION':
      return 'amber';
    case 'CANCELLED':
    case 'NO_SHOW':
    case 'SUSPENDED':
      return 'coral';
    case 'INACTIVE':
      return 'neutral';
    default:
      return 'neutral';
  }
}
