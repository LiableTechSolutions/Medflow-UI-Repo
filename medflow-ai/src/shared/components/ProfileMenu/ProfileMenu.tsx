import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { cn } from '../../../core/utils/cn';
import { Avatar } from '../Avatar/Avatar';
import './ProfileMenu.css';

export interface ProfileMenuItem {
  label: string;
  icon?: ReactNode;
  to?: string;
  onSelect?: () => void;
  danger?: boolean;
}

interface ProfileMenuProps {
  userName: string;
  userSubtitle?: string;
  items?: ProfileMenuItem[];
  className?: string;
}

const DEFAULT_ITEMS: ProfileMenuItem[] = [
  { label: 'My profile', icon: <User size={15} />, to: '/settings' },
  { label: 'Settings', icon: <Settings size={15} />, to: '/settings' },
  { label: 'Sign out', icon: <LogOut size={15} />, danger: true },
];

/** Avatar-triggered dropdown for account actions, anchored to the app header. */
export function ProfileMenu({ userName, userSubtitle = 'View profile', items = DEFAULT_ITEMS, className }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  return (
    <div className={cn('mf-profile-menu', className)} ref={rootRef}>
      <button
        type="button"
        className="mf-profile-menu__trigger"
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <Avatar name={userName} status="online" />
        <ChevronDown size={14} className={cn('mf-profile-menu__chevron', isOpen && 'mf-profile-menu__chevron--open')} />
      </button>

      {isOpen && (
        <div className="mf-profile-menu__panel" role="menu">
          <div className="mf-profile-menu__header">
            <Avatar name={userName} size="sm" />
            <div>
              <p className="mf-profile-menu__name">{userName}</p>
              <p className="mf-profile-menu__subtitle">{userSubtitle}</p>
            </div>
          </div>
          <div className="mf-profile-menu__divider" />
          {items.map((item) =>
            item.to ? (
              <Link
                key={item.label}
                to={item.to}
                role="menuitem"
                className={cn('mf-profile-menu__item', item.danger && 'mf-profile-menu__item--danger')}
                onClick={() => setIsOpen(false)}
              >
                {item.icon && <span className="mf-profile-menu__item-icon">{item.icon}</span>}
                {item.label}
              </Link>
            ) : (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                className={cn('mf-profile-menu__item', item.danger && 'mf-profile-menu__item--danger')}
                onClick={() => {
                  item.onSelect?.();
                  setIsOpen(false);
                }}
              >
                {item.icon && <span className="mf-profile-menu__item-icon">{item.icon}</span>}
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
