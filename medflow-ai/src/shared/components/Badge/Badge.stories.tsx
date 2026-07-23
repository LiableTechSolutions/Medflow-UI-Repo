import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta = {
  title: 'MedFlow Design System/Components/Badge',
  component: Badge,
  args: {
    tone: 'teal',
    children: 'Active',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DotVariants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Badge {...args} tone="teal" dot>Active</Badge>
      <Badge {...args} tone="amber" dot>Pending</Badge>
      <Badge {...args} tone="coral" dot>Urgent</Badge>
      <Badge {...args} tone="green" dot>Resolved</Badge>
    </div>
  ),
};
