import { Settings, Building2, Palette, Lock } from 'lucide-react';
import { ModulePlaceholder } from '../../../shared/components/ModulePlaceholder/ModulePlaceholder';

export default function SettingsPage() {
  return (
    <ModulePlaceholder
      title="Settings"
      features={[
        { icon: Building2, title: 'Organization', description: 'Manage clinic details, departments and branding.' },
        { icon: Settings, title: 'General', description: 'Configure workspace-wide defaults and preferences.' },
        { icon: Palette, title: 'Appearance', description: 'Adjust theme, density and layout preferences.' },
        { icon: Lock, title: 'Security', description: 'Manage password policy, sessions and two-factor auth.' },
      ]}
    />
  );
}
