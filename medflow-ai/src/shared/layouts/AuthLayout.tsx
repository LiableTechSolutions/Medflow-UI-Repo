import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { VitalsLine } from '../components/VitalsLine/VitalsLine';
import './AuthLayout.css';

interface AuthLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ eyebrow, title, description, children, footer }: AuthLayoutProps) {
  return (
    <div className="mf-auth">
      <div className="mf-auth__panel">
        <div className="mf-auth__form-wrap">
          <Link to="/" className="mf-auth__brand">
            <span className="mf-auth__brand-mark">
              <Activity size={18} />
            </span>
            MedFlow AI
          </Link>

          <div className="mf-auth__heading">
            <p className="mf-auth__eyebrow">{eyebrow}</p>
            <h1 className="mf-auth__title">{title}</h1>
            <p className="mf-auth__description">{description}</p>
          </div>

          {children}

          {footer && <div className="mf-auth__footer">{footer}</div>}
        </div>
      </div>

      <div className="mf-auth__aside">
        <div className="mf-auth__aside-content">
          <VitalsLine className="mf-auth__aside-vitals" color="rgba(255,255,255,0.85)" />
          <h2 className="mf-auth__aside-title">One steady record for every care decision.</h2>
          <p className="mf-auth__aside-copy">
            MedFlow AI keeps doctors, patients, and administrators working from the same live chart —
            so nothing gets lost between the clinic floor and the front desk.
          </p>
          <ul className="mf-auth__aside-list">
            <li>
              <ShieldCheck size={16} /> Role-based access across every module
            </li>
            <li>
              <Users size={16} /> Built for care teams, not just charts
            </li>
            <li>
              <Sparkles size={16} /> AI assistance woven into daily workflows
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
