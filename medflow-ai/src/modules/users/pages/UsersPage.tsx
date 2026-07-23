import { UserCog, ShieldCheck, KeyRound, Users2 } from 'lucide-react';
import { ModulePlaceholder } from '../../../shared/components/ModulePlaceholder/ModulePlaceholder';

export default function UsersPage() {
  return (
    <ModulePlaceholder
      title="User Management"
      features={[
        { icon: Users2, title: 'User Directory', description: 'View every account with access to this workspace.' },
        { icon: UserCog, title: 'Roles & Permissions', description: 'Define what each role can see and do in the platform.' },
        { icon: KeyRound, title: 'Access Control', description: 'Grant or revoke access to specific modules per user.' },
        { icon: ShieldCheck, title: 'Audit Log', description: 'Review a history of account and permission changes.' },
      ]}
    />
  );
}
