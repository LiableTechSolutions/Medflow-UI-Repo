import { Pill, PackageCheck, FileClock, Truck } from 'lucide-react';
import { ModulePlaceholder } from '../../../shared/components/ModulePlaceholder/ModulePlaceholder';

export default function PharmacyPage() {
  return (
    <ModulePlaceholder
      title="Pharmacy"
      description="A placeholder shell for medication fulfilment, stock management and dispensing workflows."
      features={[
        { icon: Pill, title: 'Medication Orders', description: 'Track dispense requests converted from prescriptions and appointments.' },
        { icon: PackageCheck, title: 'Inventory', description: 'Maintain on-hand medication levels and low stock alerts.' },
        { icon: FileClock, title: 'Fulfilment Log', description: 'Review every medication handoff and compliance milestone.' },
        { icon: Truck, title: 'Supply Chain', description: 'Monitor deliveries, reorder points and vendor coordination.' },
      ]}
    />
  );
}
