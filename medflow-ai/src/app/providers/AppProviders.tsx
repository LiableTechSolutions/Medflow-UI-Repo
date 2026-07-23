import { type ReactNode } from 'react';
import { ThemeProvider } from '../../shared/providers/ThemeProvider';
import { ToastProvider } from '../../shared/components/Toast/Toast';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Central place to compose app-wide providers (theme, auth context, query
 * client, etc.) as the team adds them. Kept intentionally minimal for the
 * frontend foundation.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
}
