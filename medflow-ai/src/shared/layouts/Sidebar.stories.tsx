import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sidebar } from './Sidebar';

const meta = {
  title: 'MedFlow Design System/Navigation/Sidebar',
  component: Sidebar,
  args: {
    collapsed: false,
    mobileOpen: false,
    onToggle: () => undefined,
    onCloseMobile: () => undefined,
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Collapsed: Story = {
  args: {
    collapsed: true,
  },
};
