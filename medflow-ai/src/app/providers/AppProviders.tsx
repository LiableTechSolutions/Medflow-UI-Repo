import { type ReactNode } from 'react';
import { AuthProvider } from '../../core/auth/AuthContext';
import { ThemeProvider } from '../../shared/providers/ThemeProvider';
import { ToastProvider } from '../../shared/components/Toast/Toast';

interface AppProvidersProps {
  children: ReactNode;
}

/** App-wide providers: theme, toasts and the signed-in session. */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>{children}</AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
