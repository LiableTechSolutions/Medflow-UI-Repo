import { type HTMLAttributes } from 'react';
import { cn } from '../../../core/utils/cn';
import './Badge.css';

type Tone = 'teal' | 'amber' | 'coral' | 'green' | 'neutral';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  dot?: boolean;
}

export function Badge({ tone = 'neutral', dot = false, className, children, ...rest }: BadgeProps) {
  return (
    <span className={cn('mf-badge', `mf-badge--${tone}`, className)} {...rest}>
      {dot && <span className="mf-badge__dot" />}
      {children}
    </span>
  );
}
