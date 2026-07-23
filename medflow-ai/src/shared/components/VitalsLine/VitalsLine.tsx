import { cn } from '../../../core/utils/cn';
import './VitalsLine.css';

interface VitalsLineProps {
  className?: string;
  color?: string;
  animated?: boolean;
}

/**
 * The signature mark of the design system: a single continuous line that
 * reads as an ECG trace when tense and settles into a calm sine wave —
 * used across the landing hero, dashboard header and loading states to
 * literally represent "a system that keeps a steady pulse on the data."
 */
export function VitalsLine({ className, color = 'var(--mf-blue-500)', animated = true }: VitalsLineProps) {
  return (
    <svg
      className={cn('mf-vitals-line', animated && 'mf-vitals-line--animated', className)}
      viewBox="0 0 320 64"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 32 H60 L74 32 L82 8 L94 56 L104 20 L112 32 H160 C176 32 176 12 192 12 C208 12 208 32 224 32 H320"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
