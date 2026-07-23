import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActivityChart } from './ActivityChart';

const meta = {
  title: 'MedFlow Design System/Dashboard/Activity Chart',
  component: ActivityChart,
} satisfies Meta<typeof ActivityChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
