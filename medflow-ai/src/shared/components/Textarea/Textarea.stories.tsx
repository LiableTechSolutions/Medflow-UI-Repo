import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';

const meta = {
  title: 'MedFlow Design System/Components/Textarea',
  component: Textarea,
  args: {
    label: 'Diagnosis / examination notes',
    placeholder: 'What did you observe during the examination?',
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: 'Diagnosis is required',
  },
};

export const WithHint: Story = {
  args: {
    hint: 'Up to 2000 characters.',
  },
};
