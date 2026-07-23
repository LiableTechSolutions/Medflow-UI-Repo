import { type ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { cn } from '../../../core/utils/cn';
import './Alert.css';

type AlertTone = 'info' | 'success' | 'warning' | 'danger';

interface AlertProps {
  tone?: AlertTone;
  title?: string;
  children: ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const TONE_ICON: Record<AlertTone, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
};

/** Static, inline banner for page-level or form-level messaging (not a toast). */
export function Alert({ tone = 'info', title, children, onDismiss, className }: AlertProps) {
  const Icon = TONE_ICON[tone];

  return (
    <div className={cn('mf-alert', `mf-alert--${tone}`, className)} role={tone === 'danger' ? 'alert' : 'status'}>
      <span className="mf-alert__icon">
        <Icon size={18} />
      </span>
      <div className="mf-alert__body">
        {title && <p className="mf-alert__title">{title}</p>}
        <div className="mf-alert__message">{children}</div>
      </div>
      {onDismiss && (
        <button type="button" className="mf-alert__dismiss" onClick={onDismiss} aria-label="Dismiss">
          <X size={15} />
        </button>
      )}
    </div>
  );
}
