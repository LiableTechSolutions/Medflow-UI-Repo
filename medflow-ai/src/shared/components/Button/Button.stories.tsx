import type { Meta, StoryObj } from '@storybook/react-vite';
import { Play, ArrowRight } from 'lucide-react';
import { Button } from './Button';

const meta = {
  title: 'MedFlow Design System/Components/Button',
  component: Button,
  args: {
    children: 'Save changes',
    variant: 'primary',
    size: 'md',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="outline">Outline</Button>
      <Button {...args} variant="ghost">Ghost</Button>
      <Button {...args} variant="danger">Danger</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  args: {
    variant: 'primary',
    leftIcon: <Play size={14} />,
    rightIcon: <ArrowRight size={14} />,
    children: 'Launch workflow',
  },
};
