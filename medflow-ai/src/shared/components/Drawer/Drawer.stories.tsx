import type { Meta, StoryObj } from '@storybook/react-vite';
import { Drawer } from './Drawer';

const meta = {
  title: 'MedFlow Design System/Components/Drawer',
  component: Drawer,
  args: {
    isOpen: true,
    title: 'Patient details',
    children: <div style={{ display: 'grid', gap: 10 }}><p>MRN: 2024-4182</p><p>Last visit: 12 Jun 2026</p></div>,
  },
  render: (args) => <Drawer {...args} onClose={() => undefined} />,
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => undefined,
    children: <div>Patient details</div>,
  },
};
