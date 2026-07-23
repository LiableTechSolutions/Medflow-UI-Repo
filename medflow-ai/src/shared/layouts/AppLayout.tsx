import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import './AppLayout.css';

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="mf-app-layout">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className={`mf-app-layout__main ${collapsed ? 'mf-app-layout__main--collapsed' : ''}`}>
        <Header onMenuClick={() => setMobileOpen((v) => !v)} />
        <main className="mf-app-layout__content">
          <Outlet />
          <Footer />
        </main>
      </div>
    </div>
  );
}
