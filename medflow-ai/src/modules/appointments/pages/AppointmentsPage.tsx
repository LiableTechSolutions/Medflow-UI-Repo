import { CalendarPlus, ListChecks, Clock, Bell } from 'lucide-react';
import { ModulePlaceholder } from '../../../shared/components/ModulePlaceholder/ModulePlaceholder';

export default function AppointmentsPage() {
  return (
    <ModulePlaceholder
      title="Appointment Management"
      features={[
        { icon: ListChecks, title: 'Appointment List', description: 'See every upcoming, past and cancelled appointment.' },
        { icon: CalendarPlus, title: 'Book Appointment', description: 'Schedule a new visit and match patients to available doctors.' },
        { icon: Clock, title: 'Rescheduling', description: 'Move or cancel appointments and notify everyone involved.' },
        { icon: Bell, title: 'Reminders', description: 'Configure automatic reminders for patients and doctors.' },
      ]}
    />
  );
}
