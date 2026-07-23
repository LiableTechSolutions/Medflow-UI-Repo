import { type LucideIcon } from 'lucide-react';
import { PageHeader } from '../PageHeader/PageHeader';
import { Card } from '../Card/Card';
import './ModulePlaceholder.css';

export interface FeatureCardDef {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface ModulePlaceholderProps {
  title: string;
  description?: string;
  features: FeatureCardDef[];
}

/**
 * Shared shell for every not-yet-built module. Each assigned developer
 * replaces the contents of their module's page — the layout, header and
 * navigation around it stay untouched.
 */
export function ModulePlaceholder({ title, description, features }: ModulePlaceholderProps) {
  return (
    <div className="mf-module-placeholder">
      <PageHeader
        title={title}
        crumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: title }]}
        description={description ?? 'This module will be developed by the assigned team member.'}
      />

      <div className="mf-module-placeholder__banner">
        <span className="mf-module-placeholder__banner-dot" />
        Awaiting module build-out — routing, layout and shared components are already wired up.
      </div>

      <div className="mf-module-placeholder__grid">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <Card key={f.title} className="mf-module-placeholder__card" padding="lg">
              <span className="mf-module-placeholder__card-icon">
                <Icon size={20} />
              </span>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
