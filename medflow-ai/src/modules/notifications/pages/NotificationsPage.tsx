import { Bell, BellRing, Filter, Settings2 } from 'lucide-react';
import { ModulePlaceholder } from '../../../shared/components/ModulePlaceholder/ModulePlaceholder';

export default function NotificationsPage() {
  return (
    <ModulePlaceholder
      title="Notifications"
      features={[
        { icon: Bell, title: 'All Notifications', description: 'A single feed of every alert across the platform.' },
        { icon: BellRing, title: 'Real-time Alerts', description: 'Get notified instantly on critical clinical events.' },
        { icon: Filter, title: 'Filters', description: 'Filter notifications by module, urgency or recipient.' },
        { icon: Settings2, title: 'Preferences', description: 'Control which events trigger an email, SMS or push alert.' },
      ]}
    />
  );
}
