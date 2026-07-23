import { useMemo, useState } from 'react';
import { getAppTheme, type AppThemePalette } from '../../core/theme/theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode] = useState<'light' | 'dark'>('light');
  const theme = useMemo<AppThemePalette>(() => getAppTheme(mode), [mode]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: theme.background,
        color: theme.text,
      }}
    >
      {children}
    </div>
  );
}
