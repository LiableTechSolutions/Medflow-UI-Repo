import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Building2, ArrowRight } from 'lucide-react';
import { AuthLayout } from '../../../shared/layouts/AuthLayout';
import { Input } from '../../../shared/components/Input/Input';
import { Button } from '../../../shared/components/Button/Button';
import { Alert } from '../../../shared/components/Alert/Alert';
import { useAuth } from '../../../core/auth/AuthContext';
import { ApiError } from '../../../core/api/client';
import { ROUTES } from '../../../core/config/app.config';
import './AuthPages.css';

/** Signing up provisions a whole workspace: a hospital plus its first administrator. */
export default function SignupPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    fullName: '',
    hospitalName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const update = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await register(form);
      navigate(ROUTES.dashboard, { replace: true });
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'Could not create the workspace');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create your workspace"
      description="Set up your clinic and its first administrator account."
      footer={
        <span>
          Already have an account? <Link to={ROUTES.login}>Sign in</Link>
        </span>
      }
    >
      <form className="mf-auth-form" onSubmit={handleSubmit}>
        {error && (
          <Alert tone="danger" onDismiss={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Input
          label="Full name"
          placeholder="Dr. Ananya Rao"
          leftIcon={<User size={16} />}
          value={form.fullName}
          onChange={update('fullName')}
          required
        />
        <Input
          label="Clinic or hospital name"
          placeholder="City Care Hospital"
          hint="Optional — we'll name the workspace after you if you leave this blank."
          leftIcon={<Building2 size={16} />}
          value={form.hospitalName}
          onChange={update('hospitalName')}
        />
        <Input
          label="Email address"
          type="email"
          placeholder="you@hospital.com"
          leftIcon={<Mail size={16} />}
          value={form.email}
          onChange={update('email')}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          leftIcon={<Lock size={16} />}
          value={form.password}
          onChange={update('password')}
          minLength={8}
          required
        />
        <Input
          label="Confirm password"
          type="password"
          placeholder="Re-enter your password"
          leftIcon={<Lock size={16} />}
          value={form.confirmPassword}
          onChange={update('confirmPassword')}
          required
        />

        <Button type="submit" size="lg" fullWidth isLoading={isLoading} rightIcon={<ArrowRight size={16} />}>
          Create workspace
        </Button>
      </form>
    </AuthLayout>
  );
}
