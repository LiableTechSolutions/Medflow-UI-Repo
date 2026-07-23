import type { Meta, StoryObj } from '@storybook/react-vite';
import { FolderOpen } from 'lucide-react';
import { Button } from '../Button/Button';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'MedFlow Design System/Feedback/EmptyState',
  component: EmptyState,
  args: {
    icon: <FolderOpen size={20} />,
    title: 'No follow-up notes yet',
    description: 'Create an entry to capture the patient’s next-step care instructions.',
    action: <Button variant="secondary">Add note</Button>,
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
