import type { Meta, StoryObj } from '@storybook/react-vite';
import { Activity, CalendarCheck, FileText } from 'lucide-react';
import { ModulePlaceholder } from './ModulePlaceholder';

const meta = {
  title: 'MedFlow Design System/Medical/ModulePlaceholder',
  component: ModulePlaceholder,
  args: {
    title: 'Pharmacy',
    description: 'This module is reserved for the pharmacy milestone team.',
    features: [
      { icon: Activity, title: 'Medication overview', description: 'Monitor active inventory and refill queues.' },
      { icon: CalendarCheck, title: 'Prescription schedule', description: 'Coordinate daily medication delivery windows.' },
      { icon: FileText, title: 'Order review', description: 'Capture approvals and notes during dispensing.' },
    ],
  },
} satisfies Meta<typeof ModulePlaceholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
