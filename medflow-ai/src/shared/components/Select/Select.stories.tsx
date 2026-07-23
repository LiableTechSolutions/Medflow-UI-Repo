import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const options = [
  { value: 'consultation', label: 'Consultation' },
  { value: 'lab-review', label: 'Lab review' },
  { value: 'follow-up', label: 'Follow-up' },
];

const meta = {
  title: 'MedFlow Design System/Forms/Select',
  component: Select,
  args: {
    label: 'Visit type',
    placeholder: 'Choose an appointment type',
    options,
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: 'Please choose a visit type.',
  },
};
