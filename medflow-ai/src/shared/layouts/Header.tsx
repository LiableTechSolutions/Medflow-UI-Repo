import { Menu, Bell, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar/SearchBar';
import { Badge } from '../components/Badge/Badge';
import { ProfileMenu } from '../components/ProfileMenu/ProfileMenu';
import './Header.css';

interface HeaderProps {
  onMenuClick: () => void;
  userName?: string;
}

export function Header({ onMenuClick, userName = 'Dr. Ananya Rao' }: HeaderProps) {
  return (
    <header className="mf-header">
      <div className="mf-header__left">
        <button className="mf-header__menu" onClick={onMenuClick} aria-label="Toggle navigation">
          <Menu size={19} />
        </button>
        <div className="mf-header__welcome">
          <p className="mf-header__eyebrow">Good to see you</p>
          <h2 className="mf-header__title">{userName}</h2>
        </div>
      </div>

      <div className="mf-header__search">
        <SearchBar placeholder="Search patients, doctors, records…" />
      </div>

      <div className="mf-header__right">
        <button className="mf-header__icon-btn mf-header__icon-btn--mobile" aria-label="Search">
          <Search size={18} />
        </button>
        <Link to="/notifications" className="mf-header__icon-btn" aria-label="Notifications">
          <Bell size={18} />
          <Badge tone="coral" className="mf-header__notif-badge">3</Badge>
        </Link>
        <div className="mf-header__divider" />
        <ProfileMenu userName={userName} userSubtitle="View profile" className="mf-header__profile" />
      </div>
    </header>
  );
}
