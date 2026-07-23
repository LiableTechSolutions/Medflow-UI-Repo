import { type LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '../../../shared/components/Card/Card';
import { cn } from '../../../core/utils/cn';
import './KpiCard.css';

interface KpiCardProps {
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  tone?: 'blue' | 'amber' | 'coral' | 'green';
  /** 'featured' renders a solid-fill hero card — use for at most one stat per view. */
  variant?: 'default' | 'featured';
  meta?: string;
}

export function KpiCard({ label, value, delta, trend, icon: Icon, tone = 'blue', variant = 'default', meta }: KpiCardProps) {
  if (variant === 'featured') {
    return (
      <Card className="mf-kpi mf-kpi--featured" padding="md">
        <div className="mf-kpi__top">
          <span className="mf-kpi__featured-label">{label}</span>
          <Icon size={17} className="mf-kpi__featured-icon" />
        </div>
        <p className="mf-kpi__value mf-kpi__value--featured">{value}</p>
        <div className="mf-kpi__featured-foot">
          <span className={cn('mf-kpi__delta', 'mf-kpi__delta--featured', trend === 'up' ? 'mf-kpi__delta--up' : 'mf-kpi__delta--down')}>
            {trend === 'up' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {delta}
          </span>
          {meta && <span className="mf-kpi__meta">{meta}</span>}
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('mf-kpi', `mf-kpi--${tone}`)} padding="md">
      <div className="mf-kpi__top">
        <Icon size={16} className="mf-kpi__glyph" />
        <span className={cn('mf-kpi__delta', trend === 'up' ? 'mf-kpi__delta--up' : 'mf-kpi__delta--down')}>
          {trend === 'up' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {delta}
        </span>
      </div>
      <p className="mf-kpi__value">{value}</p>
      <p className="mf-kpi__label">{label}</p>
    </Card>
  );
}
