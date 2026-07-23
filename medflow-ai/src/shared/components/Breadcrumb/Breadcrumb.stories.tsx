import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumb } from './Breadcrumb';

const meta = {
  title: 'MedFlow Design System/Navigation/Breadcrumb',
  component: Breadcrumb,
  args: {
    items: [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Patients', path: '/patients' },
      { label: 'Meera Joshi' },
    ],
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
