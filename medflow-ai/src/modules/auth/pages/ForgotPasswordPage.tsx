import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCheck } from 'lucide-react';
import { AuthLayout } from '../../../shared/layouts/AuthLayout';
import { Input } from '../../../shared/components/Input/Input';
import { Button } from '../../../shared/components/Button/Button';
import { ROUTES } from '../../../core/config/app.config';
import './AuthPages.css';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    // Frontend-only placeholder — no backend call yet.
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 600);
  }

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Reset your password"
      description="Enter the email tied to your workspace and we'll send you a reset link."
      footer={
        <span>
          Remembered it after all? <Link to={ROUTES.login}>Back to sign in</Link>
        </span>
      }
    >
      {isSent ? (
        <div className="mf-auth-form__success">
          <span className="mf-auth-form__success-icon">
            <CheckCheck size={24} />
          </span>
          <h3>Check your inbox</h3>
          <p style={{ color: 'var(--mf-ink-500)', fontSize: 'var(--mf-fs-sm)' }}>
            If an account matches that email, a reset link is on its way.
          </p>
        </div>
      ) : (
        <form className="mf-auth-form" onSubmit={handleSubmit}>
          <Input label="Email address" type="email" placeholder="you@hospital.com" leftIcon={<Mail size={16} />} required />
          <Button type="submit" size="lg" fullWidth isLoading={isLoading} rightIcon={<ArrowRight size={16} />}>
            Send reset link
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
