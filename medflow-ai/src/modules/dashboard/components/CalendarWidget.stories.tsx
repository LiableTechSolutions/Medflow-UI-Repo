import type { Meta, StoryObj } from '@storybook/react-vite';
import { CalendarWidget } from './CalendarWidget';

const meta = {
  title: 'MedFlow Design System/Dashboard/Calendar Widget',
  component: CalendarWidget,
} satisfies Meta<typeof CalendarWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
