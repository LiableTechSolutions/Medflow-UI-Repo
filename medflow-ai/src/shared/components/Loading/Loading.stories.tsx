import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loading, Skeleton } from './Loading';

const meta = {
  title: 'MedFlow Design System/Feedback/Loader',
  component: Loading,
  args: {
    label: 'Loading patient chart…',
    fullHeight: false,
  },
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SkeletonBlock: Story = {
  render: () => <Skeleton className="mf-skeleton--wide" />,
};
