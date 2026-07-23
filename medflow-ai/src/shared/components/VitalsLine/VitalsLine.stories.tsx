import type { Meta, StoryObj } from '@storybook/react-vite';
import { VitalsLine } from './VitalsLine';

const meta = {
  title: 'MedFlow Design System/Medical/VitalsLine',
  component: VitalsLine,
  args: {
    animated: true,
    color: 'var(--mf-blue-500)',
  },
} satisfies Meta<typeof VitalsLine>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
