import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { AuthLayout } from '../../../shared/layouts/AuthLayout';
import { Input } from '../../../shared/components/Input/Input';
import { Button } from '../../../shared/components/Button/Button';
import { ROUTES } from '../../../core/config/app.config';
import './AuthPages.css';

export default function SignupPage() {
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
      eyebrow="Get started"
      title="Create your workspace"
      description="Set up a MedFlow AI account to start organizing your care team."
      footer={
        <span>
          Already have an account? <Link to={ROUTES.login}>Sign in</Link>
        </span>
      }
    >
      <form className="mf-auth-form" onSubmit={handleSubmit}>
        <Input label="Full name" type="text" placeholder="Dr. Ananya Rao" leftIcon={<User size={16} />} required />
        <Input label="Email address" type="email" placeholder="you@hospital.com" leftIcon={<Mail size={16} />} required />
        <Input label="Password" type="password" placeholder="Create a password" leftIcon={<Lock size={16} />} required />
        <Input label="Confirm password" type="password" placeholder="Re-enter your password" leftIcon={<Lock size={16} />} required />

        <p className="mf-auth-form__terms">
          By creating an account you agree to MedFlow AI&apos;s Terms of Service and Privacy Policy.
        </p>

        <Button type="submit" size="lg" fullWidth isLoading={isLoading} rightIcon={<ArrowRight size={16} />}>
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
