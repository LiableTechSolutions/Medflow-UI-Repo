import { ClipboardList, ClipboardPlus, Pill, ScrollText } from 'lucide-react';
import { ModulePlaceholder } from '../../../shared/components/ModulePlaceholder/ModulePlaceholder';

export default function PrescriptionsPage() {
  return (
    <ModulePlaceholder
      title="Prescription Management"
      features={[
        { icon: ClipboardList, title: 'Prescription List', description: 'Review every prescription issued across the clinic.' },
        { icon: ClipboardPlus, title: 'New Prescription', description: 'Write a new prescription tied to a patient visit.' },
        { icon: Pill, title: 'Medication Catalog', description: 'Maintain the list of medicines, dosages and interactions.' },
        { icon: ScrollText, title: 'Prescription History', description: 'Trace a patient\u2019s prescribing history over time.' },
      ]}
    />
  );
}
