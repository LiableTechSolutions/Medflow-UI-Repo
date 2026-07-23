import type { Meta, StoryObj } from '@storybook/react-vite';
import { User, Settings, LogOut } from 'lucide-react';
import { ProfileMenu } from './ProfileMenu';

const meta = {
  title: 'MedFlow Design System/Navigation/ProfileMenu',
  component: ProfileMenu,
  args: {
    userName: 'Dr. Ananya Rao',
    userSubtitle: 'Cardiology lead',
    items: [
      { label: 'My profile', icon: <User size={15} />, to: '/settings' },
      { label: 'Settings', icon: <Settings size={15} />, to: '/settings' },
      { label: 'Sign out', icon: <LogOut size={15} />, danger: true },
    ],
  },
} satisfies Meta<typeof ProfileMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
