import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { AuthLayout } from '../../../shared/layouts/AuthLayout';
import { Input } from '../../../shared/components/Input/Input';
import { Button } from '../../../shared/components/Button/Button';
import { Alert } from '../../../shared/components/Alert/Alert';
import { useAuth } from '../../../core/auth/AuthContext';
import { ApiError } from '../../../core/api/client';
import { ROUTES } from '../../../core/config/app.config';
import './AuthPages.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('admin@medflow.local');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(email, password);
      const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname;
      navigate(from ?? ROUTES.dashboard, { replace: true });
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'Could not sign in');
    } finally {
      setIsLoading(false);
    }
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
        {error && (
          <Alert tone="danger" onDismiss={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Input
          label="Email address"
          type="email"
          placeholder="you@hospital.com"
          leftIcon={<Mail size={16} />}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock size={16} />}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <div className="mf-auth-form__row">
          <label className="mf-auth-form__checkbox">
            <input type="checkbox" defaultChecked />
            Remember me
          </label>
          <Link to={ROUTES.forgotPassword} className="mf-auth-form__link">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" fullWidth isLoading={isLoading} rightIcon={<ArrowRight size={16} />}>
          Sign in
        </Button>

        <p className="mf-auth-form__hint">
          Demo workspace: <strong>admin@medflow.local</strong> / <strong>Admin@12345</strong>
        </p>
      </form>
    </AuthLayout>
  );
}
