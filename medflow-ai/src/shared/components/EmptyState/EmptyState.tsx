import { type ReactNode } from 'react';
import './EmptyState.css';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="mf-empty">
      {icon && <div className="mf-empty__icon">{icon}</div>}
      <h3 className="mf-empty__title">{title}</h3>
      {description && <p className="mf-empty__description">{description}</p>}
      {action && <div className="mf-empty__action">{action}</div>}
    </div>
  );
}
