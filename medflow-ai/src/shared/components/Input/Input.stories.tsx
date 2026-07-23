import type { Meta, StoryObj } from '@storybook/react-vite';
import { Search } from 'lucide-react';
import { Input } from './Input';

const meta = {
  title: 'MedFlow Design System/Components/Input',
  component: Input,
  args: {
    label: 'Patient search',
    placeholder: 'Type a patient name',
    hint: 'Use the care team directory to find records quickly.',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValidation: Story = {
  args: {
    error: 'Please enter a valid MRN.',
    value: '',
  },
};

export const WithIcons: Story = {
  args: {
    leftIcon: <Search size={15} />,
    placeholder: 'Search patients',
  },
};
