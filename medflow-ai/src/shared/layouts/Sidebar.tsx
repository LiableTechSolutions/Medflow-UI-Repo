import { NavLink } from 'react-router-dom';
import { ChevronsLeft, Activity } from 'lucide-react';
import { NAV_ITEMS } from '../../core/constants/navigation';
import { cn } from '../../core/utils/cn';
import { Badge } from '../components/Badge/Badge';
import './Sidebar.css';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {mobileOpen && <div className="mf-sidebar-scrim" onClick={onCloseMobile} />}
      <aside className={cn('mf-sidebar', collapsed && 'mf-sidebar--collapsed', mobileOpen && 'mf-sidebar--mobile-open')}>
        <div className="mf-sidebar__brand">
          <span className="mf-sidebar__brand-mark">
            <Activity size={18} />
          </span>
          {!collapsed && <span className="mf-sidebar__brand-name">MedFlow AI</span>}
        </div>

        <nav className="mf-sidebar__nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) => cn('mf-sidebar__link', isActive && 'mf-sidebar__link--active')}
                title={collapsed ? item.label : undefined}
              >
                <span className="mf-sidebar__link-icon">
                  <Icon size={19} />
                </span>
                {!collapsed && <span className="mf-sidebar__link-label">{item.label}</span>}
                {!collapsed && item.badge && (
                  <Badge tone="coral" className="mf-sidebar__link-badge">
                    {item.badge}
                  </Badge>
                )}
              </NavLink>
            );
          })}
        </nav>

        <button className="mf-sidebar__collapse" onClick={onToggle} aria-label="Toggle sidebar">
          <ChevronsLeft size={17} className={cn('mf-sidebar__collapse-icon', collapsed && 'mf-sidebar__collapse-icon--flipped')} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </aside>
    </>
  );
}
