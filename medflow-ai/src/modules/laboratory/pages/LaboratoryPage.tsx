import { FlaskConical, Microscope, ClipboardCheck, TestTube2 } from 'lucide-react';
import { ModulePlaceholder } from '../../../shared/components/ModulePlaceholder/ModulePlaceholder';

export default function LaboratoryPage() {
  return (
    <ModulePlaceholder
      title="Laboratory"
      description="A dedicated space for future lab workflows, specimen tracking and result review."
      features={[
        { icon: FlaskConical, title: 'Specimen Queue', description: 'Coordinate incoming samples and priority handling across departments.' },
        { icon: Microscope, title: 'Lab Orders', description: 'Review pending orders and route them to the right lab team.' },
        { icon: ClipboardCheck, title: 'Results Review', description: 'Compare incoming results with expectations before sign-off.' },
        { icon: TestTube2, title: 'Inventory', description: 'Track reagents, kits and consumables without leaving the workspace.' },
      ]}
    />
  );
}
