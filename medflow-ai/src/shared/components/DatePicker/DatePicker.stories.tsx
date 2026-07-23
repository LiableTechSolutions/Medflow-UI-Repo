import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker } from './DatePicker';

const meta = {
  title: 'MedFlow Design System/Forms/DatePicker',
  component: DatePicker,
  args: {
    label: 'Appointment date',
    hint: 'Choose a date for the next follow-up.',
    value: new Date('2026-07-23'),
    onChange: () => undefined,
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: 'Please select a valid appointment date.',
  },
};
