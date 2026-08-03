import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';
import { AuthLayout } from '../../../shared/layouts/AuthLayout';
import { Input } from '../../../shared/components/Input/Input';
import { Button } from '../../../shared/components/Button/Button';
import { Alert } from '../../../shared/components/Alert/Alert';
import { authApi } from '../../../core/api/services';
import { ApiError } from '../../../core/api/client';
import { ROUTES } from '../../../core/config/app.config';
import './AuthPages.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'Could not send the reset link');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Reset your password"
      description="We'll send a reset link to the email on your account."
      footer={
        <span>
          Remembered it? <Link to={ROUTES.login}>Back to sign in</Link>
        </span>
      }
    >
      <form className="mf-auth-form" onSubmit={handleSubmit}>
        {/* The API answers identically whether or not the address exists, so the UI does too. */}
        {sent && (
          <Alert tone="success" title="Check your inbox">
            If an account matches that email, a reset link is on its way.
          </Alert>
        )}
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

        <Button type="submit" size="lg" fullWidth isLoading={isLoading} rightIcon={<ArrowRight size={16} />}>
          Send reset link
        </Button>
      </form>
    </AuthLayout>
  );
}
