import { Users, UserPlus, FileHeart, History } from 'lucide-react';
import { ModulePlaceholder } from '../../../shared/components/ModulePlaceholder/ModulePlaceholder';

export default function PatientsPage() {
  return (
    <ModulePlaceholder
      title="Patient Management"
      features={[
        { icon: Users, title: 'Patient List', description: 'Search and filter the full patient roster across departments.' },
        { icon: UserPlus, title: 'Add Patient', description: 'Register a new patient with intake details and history.' },
        { icon: FileHeart, title: 'Patient Profile', description: 'View vitals, conditions and assigned doctors for one patient.' },
        { icon: History, title: 'Visit History', description: 'Track every visit, diagnosis and follow-up over time.' },
      ]}
    />
  );
}
