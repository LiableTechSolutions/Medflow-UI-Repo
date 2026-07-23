import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Stethoscope,
  CalendarClock,
  ClipboardList,
  BarChart3,
  Sparkles,
  ShieldCheck,
  Users,
  Menu,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../shared/components/Button/Button';
import { VitalsLine } from '../../../shared/components/VitalsLine/VitalsLine';
import { ROUTES } from '../../../core/config/app.config';
import './LandingPage.css';

const FEATURES = [
  {
    icon: Stethoscope,
    title: 'Doctor coordination',
    text: 'Give every clinician a single place to see their schedule, patients and notes without switching tabs.',
  },
  {
    icon: CalendarClock,
    title: 'Appointment flow',
    text: 'Bookings, reschedules and no-shows stay visible to the whole care team in real time.',
  },
  {
    icon: ClipboardList,
    title: 'Prescriptions, tracked',
    text: 'Keep prescribing history attached to the patient record, not buried in a filing cabinet.',
  },
  {
    icon: BarChart3,
    title: 'Reports that make sense',
    text: 'Turn raw clinical activity into dashboards your administrators actually read.',
  },
  {
    icon: Sparkles,
    title: 'AI woven in',
    text: 'Draft summaries, flag anomalies and surface what matters — the assistant works where you already are.',
  },
  {
    icon: ShieldCheck,
    title: 'Built for many roles',
    text: 'Doctors, front-desk staff and administrators each get an experience shaped for their job.',
  },
];

const BENEFITS = [
  { stat: '01', title: 'One record, every department', text: 'Patients stop repeating themselves between reception, the doctor and the pharmacy.' },
  { stat: '02', title: 'Less admin, more care', text: 'Automate the paperwork trail so your team spends time with patients, not spreadsheets.' },
  { stat: '03', title: 'A platform that grows with you', text: 'Modules ship independently, so new capability lands without disrupting daily work.' },
];

export default function LandingPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="mf-landing">
      <header className="mf-landing__nav">
        <div className="mf-landing__nav-inner">
          <Link to="/" className="mf-landing__brand">
            <span className="mf-landing__brand-mark">
              <Activity size={18} />
            </span>
            MedFlow AI
          </Link>

          <nav className="mf-landing__nav-links">
            <a href="#features">Features</a>
            <a href="#benefits">Why teams switch</a>
            <a href="#cta">Get started</a>
          </nav>

          <div className="mf-landing__nav-actions">
            <Link to={ROUTES.login}>
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to={ROUTES.signup}>
              <Button variant="primary" size="sm">Sign up</Button>
            </Link>
          </div>

          <button className="mf-landing__nav-toggle" onClick={() => setMobileNavOpen((v) => !v)} aria-label="Toggle menu">
            <Menu size={20} />
          </button>
        </div>

        {mobileNavOpen && (
          <div className="mf-landing__nav-mobile">
            <a href="#features" onClick={() => setMobileNavOpen(false)}>Features</a>
            <a href="#benefits" onClick={() => setMobileNavOpen(false)}>Why teams switch</a>
            <Link to={ROUTES.login}><Button variant="outline" fullWidth>Log in</Button></Link>
            <Link to={ROUTES.signup}><Button variant="primary" fullWidth>Sign up</Button></Link>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="mf-hero">
        <div className="mf-hero__content">
          <span className="mf-hero__eyebrow">Now onboarding pilot clinics</span>
          <h1 className="mf-hero__title">
            The clinical operating system that keeps a <span>steady pulse</span> on every patient.
          </h1>
          <p className="mf-hero__subtitle">
            MedFlow AI brings doctors, front-desk staff and administrators onto one live record —
            so appointments, prescriptions and reports never fall out of sync again.
          </p>
          <div className="mf-hero__actions">
            <Link to={ROUTES.signup}>
              <Button size="lg" rightIcon={<ArrowRight size={16} />}>Create your workspace</Button>
            </Link>
            <Link to={ROUTES.login}>
              <Button size="lg" variant="outline">I already have an account</Button>
            </Link>
          </div>
          <VitalsLine className="mf-hero__vitals" />
        </div>

        <div className="mf-hero__panel">
          <div className="mf-hero__panel-header">
            <span className="mf-hero__panel-dot" />
            <span className="mf-hero__panel-dot" />
            <span className="mf-hero__panel-dot" />
            <span className="mf-hero__panel-label">Today&apos;s overview</span>
          </div>
          <div className="mf-hero__panel-grid">
            <div className="mf-hero__panel-stat">
              <p>Patients seen</p>
              <strong>128</strong>
            </div>
            <div className="mf-hero__panel-stat">
              <p>Appointments</p>
              <strong>46</strong>
            </div>
            <div className="mf-hero__panel-stat">
              <p>Reports filed</p>
              <strong>19</strong>
            </div>
            <div className="mf-hero__panel-stat">
              <p>Avg. wait time</p>
              <strong>11m</strong>
            </div>
          </div>
          <div className="mf-hero__panel-line">
            <VitalsLine color="var(--mf-blue-500)" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mf-section">
        <div className="mf-section__heading">
          <p className="mf-section__eyebrow">What&apos;s inside</p>
          <h2>Everything a care team touches in one place</h2>
        </div>
        <div className="mf-features-grid">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div className="mf-feature-card" key={f.title}>
                <span className="mf-feature-card__icon">
                  <Icon size={20} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" className="mf-benefits">
        <div className="mf-section__heading">
          <p className="mf-section__eyebrow">Why teams switch</p>
          <h2>Built around how clinics actually run</h2>
        </div>
        <div className="mf-benefits-list">
          {BENEFITS.map((b) => (
            <div className="mf-benefits-item" key={b.stat}>
              <span className="mf-benefits-item__stat">{b.stat}</span>
              <div>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="mf-cta">
        <Users size={28} className="mf-cta__icon" />
        <h2>Bring your care team onto one record.</h2>
        <p>Set up a workspace in minutes — no credit card, no backend to configure.</p>
        <div className="mf-cta__actions">
          <Link to={ROUTES.signup}>
            <Button size="lg" variant="primary" rightIcon={<ArrowRight size={16} />}>Sign up free</Button>
          </Link>
          <Link to={ROUTES.login}>
            <Button size="lg" variant="ghost">Log in</Button>
          </Link>
        </div>
      </section>

      <footer className="mf-footer">
        <div className="mf-footer__top">
          <div className="mf-footer__brand">
            <span className="mf-landing__brand-mark">
              <Activity size={18} />
            </span>
            <div>
              <p className="mf-footer__brand-name">MedFlow AI</p>
              <p className="mf-footer__brand-tag">A calmer operating system for care teams.</p>
            </div>
          </div>
          <div className="mf-footer__cols">
            <div>
              <p className="mf-footer__col-title">Product</p>
              <a href="#features">Features</a>
              <a href="#benefits">Why teams switch</a>
              <Link to={ROUTES.dashboard}>Dashboard preview</Link>
            </div>
            <div>
              <p className="mf-footer__col-title">Account</p>
              <Link to={ROUTES.login}>Log in</Link>
              <Link to={ROUTES.signup}>Sign up</Link>
              <Link to={ROUTES.forgotPassword}>Reset password</Link>
            </div>
          </div>
        </div>
        <div className="mf-footer__bottom">
          <p>© {new Date().getFullYear()} MedFlow AI. Frontend foundation build.</p>
        </div>
      </footer>
    </div>
  );
}
