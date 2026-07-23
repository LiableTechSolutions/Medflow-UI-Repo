import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActivityTimeline } from './ActivityTimeline';

const meta = {
  title: 'MedFlow Design System/Dashboard/Timeline Widget',
  component: ActivityTimeline,
} satisfies Meta<typeof ActivityTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
