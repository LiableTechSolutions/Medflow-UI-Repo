import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './Breadcrumb.css';

export interface Crumb {
  label: string;
  path?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="mf-breadcrumb" aria-label="Breadcrumb">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span key={item.label} className="mf-breadcrumb__item">
            {item.path && !isLast ? (
              <Link to={item.path} className="mf-breadcrumb__link">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'mf-breadcrumb__current' : undefined}>{item.label}</span>
            )}
            {!isLast && <ChevronRight size={13} className="mf-breadcrumb__sep" />}
          </span>
        );
      })}
    </nav>
  );
}
