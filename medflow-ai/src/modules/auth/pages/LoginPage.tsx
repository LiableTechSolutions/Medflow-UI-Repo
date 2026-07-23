import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { AuthLayout } from '../../../shared/layouts/AuthLayout';
import { Input } from '../../../shared/components/Input/Input';
import { Button } from '../../../shared/components/Button/Button';
import { ROUTES } from '../../../core/config/app.config';
import './AuthPages.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    // Frontend-only placeholder — no auth wired up yet.
    setTimeout(() => {
      setIsLoading(false);
      navigate(ROUTES.dashboard);
    }, 600);
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to your workspace"
      description="Enter your credentials to access the MedFlow AI dashboard."
      footer={
        <span>
          Don&apos;t have a workspace yet? <Link to={ROUTES.signup}>Create an account</Link>
        </span>
      }
    >
      <form className="mf-auth-form" onSubmit={handleSubmit}>
        <Input label="Email address" type="email" placeholder="you@hospital.com" leftIcon={<Mail size={16} />} required />
        <Input label="Password" type="password" placeholder="••••••••" leftIcon={<Lock size={16} />} required />

        <div className="mf-auth-form__row">
          <label className="mf-auth-form__checkbox">
            <input type="checkbox" />
            Remember me
          </label>
          <Link to={ROUTES.forgotPassword} className="mf-auth-form__link">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" fullWidth isLoading={isLoading} rightIcon={<ArrowRight size={16} />}>
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}
