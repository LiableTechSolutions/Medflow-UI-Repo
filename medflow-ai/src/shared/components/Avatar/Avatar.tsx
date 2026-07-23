import { cn } from '../../../core/utils/cn';
import './Avatar.css';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'away';
  className?: string;
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const PALETTE = ['var(--mf-blue-600)', 'var(--mf-amber-500)', 'var(--mf-coral-500)', 'var(--mf-green-500)', 'var(--mf-ink-700)', 'var(--mf-blue-700)'];

function colorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export function Avatar({ name, size = 'md', status, className }: AvatarProps) {
  return (
    <span className={cn('mf-avatar', `mf-avatar--${size}`, className)}>
      <span className="mf-avatar__circle" style={{ background: colorForName(name) }}>
        {initialsFromName(name)}
      </span>
      {status && <span className={cn('mf-avatar__status', `mf-avatar__status--${status}`)} />}
    </span>
  );
}
