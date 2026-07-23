import type { Meta, StoryObj } from '@storybook/react-vite';
import { AuthLayout } from './AuthLayout';

const meta = {
  title: 'MedFlow Design System/Layout/AuthLayout',
  component: AuthLayout,
  args: {
    eyebrow: 'Staff access',
    title: 'Sign in to MedFlow AI',
    description: 'Manage appointments, patient records, and care operations from one secure workspace.',
    children: <div style={{ display: 'grid', gap: 12 }}><p>Login form placeholder</p></div>,
  },
} satisfies Meta<typeof AuthLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
