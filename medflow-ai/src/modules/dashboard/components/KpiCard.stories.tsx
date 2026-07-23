import type { Meta, StoryObj } from '@storybook/react-vite';
import { Activity, TrendingDown, HeartPulse } from 'lucide-react';
import { KpiCard } from './KpiCard';

const meta = {
  title: 'MedFlow Design System/Dashboard/KPI Card',
  component: KpiCard,
  args: {
    label: 'Active patients',
    value: '168',
    delta: '+12%',
    trend: 'up',
    icon: Activity,
    tone: 'blue',
    variant: 'default',
  },
} satisfies Meta<typeof KpiCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Featured: Story = {
  args: {
    label: 'Critical alerts',
    value: '14',
    delta: '-4%',
    trend: 'down',
    icon: HeartPulse,
    tone: 'coral',
    variant: 'featured',
    meta: 'Last 24 hours',
  },
};

export const TrendDown: Story = {
  args: {
    label: 'Avg wait time',
    value: '18 min',
    delta: '-2 min',
    trend: 'down',
    icon: TrendingDown,
    tone: 'green',
  },
};
