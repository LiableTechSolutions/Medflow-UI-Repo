import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';

const meta = {
  title: 'MedFlow Design System/Components/Avatar',
  component: Avatar,
  args: {
    name: 'Ananya Rao',
    size: 'md',
    status: 'online',
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Avatar {...args} size="sm" name="Dr. Sam" />
      <Avatar {...args} size="md" name="Dr. Sam" />
      <Avatar {...args} size="lg" name="Dr. Sam" />
    </div>
  ),
};
