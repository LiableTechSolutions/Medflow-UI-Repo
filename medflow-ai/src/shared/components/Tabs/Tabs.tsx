import { type ReactNode, useId } from 'react';
import { cn } from '../../../core/utils/cn';
import './Tabs.css';

export interface TabItem {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  /** 'line' is the default underlined style; 'pill' renders a segmented control. */
  variant?: 'line' | 'pill';
  className?: string;
}

/** Controlled tab strip — pair with conditionally-rendered panels in the parent. */
export function Tabs({ items, value, onChange, variant = 'line', className }: TabsProps) {
  const groupId = useId();

  return (
    <div className={cn('mf-tabs', `mf-tabs--${variant}`, className)} role="tablist" aria-orientation="horizontal">
      {items.map((item) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            id={`${groupId}-${item.value}`}
            aria-selected={selected}
            disabled={item.disabled}
            className={cn('mf-tabs__tab', selected && 'mf-tabs__tab--active')}
            onClick={() => !item.disabled && onChange(item.value)}
          >
            {item.icon && <span className="mf-tabs__icon">{item.icon}</span>}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

interface TabPanelProps {
  value: string;
  activeValue: string;
  children: ReactNode;
  className?: string;
}

/** Renders its children only when its value matches the active tab. */
export function TabPanel({ value, activeValue, children, className }: TabPanelProps) {
  if (value !== activeValue) return null;
  return (
    <div role="tabpanel" className={cn('mf-tabs__panel', className)}>
      {children}
    </div>
  );
}
