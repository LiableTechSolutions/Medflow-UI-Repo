import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { PageHeader } from './PageHeader';

const meta = {
  title: 'MedFlow Design System/Layout/PageHeader',
  component: PageHeader,
  args: {
    title: 'Appointments',
    description: 'Review scheduled visits, care notes, and room assignments.',
    crumbs: [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Appointments' },
    ],
    actions: <Button variant="secondary">Create visit</Button>,
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
