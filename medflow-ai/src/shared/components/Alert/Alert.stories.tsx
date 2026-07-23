import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './Alert';

const meta = {
  title: 'MedFlow Design System/Components/Alert',
  component: Alert,
  args: {
    tone: 'info',
    title: 'New lab results available',
    children: 'Clinical reviewers now have access to the updated pathology summary.',
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Success: Story = {
  args: {
    tone: 'success',
    title: 'Sync complete',
    children: 'Patient records were synchronized successfully.',
  },
};
