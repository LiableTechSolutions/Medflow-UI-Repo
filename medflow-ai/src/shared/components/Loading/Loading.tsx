import { cn } from '../../../core/utils/cn';
import './Loading.css';

interface LoadingProps {
  label?: string;
  fullHeight?: boolean;
}

export function Loading({ label = 'Loading…', fullHeight = false }: LoadingProps) {
  return (
    <div className={cn('mf-loading', fullHeight && 'mf-loading--full')}>
      <svg className="mf-loading__pulse" viewBox="0 0 120 32" fill="none" aria-hidden="true">
        <path
          d="M0 16 H30 L36 16 L40 4 L46 28 L52 10 L56 16 H120"
          stroke="var(--mf-blue-500)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="mf-loading__label">{label}</span>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('mf-skeleton', className)} />;
}
