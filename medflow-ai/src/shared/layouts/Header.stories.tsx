import type { Meta, StoryObj } from '@storybook/react-vite';
import { Header } from './Header';

const meta = {
  title: 'MedFlow Design System/Layout/Header',
  component: Header,
  args: {
    onMenuClick: () => undefined,
    userName: 'Dr. Ananya Rao',
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
