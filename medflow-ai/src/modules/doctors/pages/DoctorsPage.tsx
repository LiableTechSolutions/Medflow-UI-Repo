import { Users, UserPlus, IdCard, CalendarRange } from 'lucide-react';
import { ModulePlaceholder } from '../../../shared/components/ModulePlaceholder/ModulePlaceholder';

export default function DoctorsPage() {
  return (
    <ModulePlaceholder
      title="Doctor Management"
      features={[
        { icon: Users, title: 'Doctor List', description: 'Browse and filter every doctor on staff by department and availability.' },
        { icon: UserPlus, title: 'Add Doctor', description: 'Onboard a new doctor with credentials, specialty and schedule.' },
        { icon: IdCard, title: 'Doctor Profile', description: 'View qualifications, patient load and performance for one doctor.' },
        { icon: CalendarRange, title: 'Schedule', description: 'Manage shift timings, leave and appointment availability.' },
      ]}
    />
  );
}
