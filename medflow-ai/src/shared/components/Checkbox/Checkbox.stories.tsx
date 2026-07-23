import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'MedFlow Design System/Components/Checkbox',
  component: Checkbox,
  args: {
    label: 'Share chart summary with the patient',
    hint: 'Allows secure delivery of the after-visit summary.',
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    label: 'Some sub-items are selected',
  },
};
