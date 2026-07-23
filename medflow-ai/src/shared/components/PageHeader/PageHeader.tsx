import { type ReactNode } from 'react';
import { Breadcrumb, type Crumb } from '../Breadcrumb/Breadcrumb';
import './PageHeader.css';

interface PageHeaderProps {
  title: string;
  description?: string;
  crumbs?: Crumb[];
  actions?: ReactNode;
}

export function PageHeader({ title, description, crumbs, actions }: PageHeaderProps) {
  return (
    <div className="mf-page-header">
      <div className="mf-page-header__text">
        {crumbs && <Breadcrumb items={crumbs} />}
        <h1 className="mf-page-header__title">{title}</h1>
        {description && <p className="mf-page-header__description">{description}</p>}
      </div>
      {actions && <div className="mf-page-header__actions">{actions}</div>}
    </div>
  );
}
