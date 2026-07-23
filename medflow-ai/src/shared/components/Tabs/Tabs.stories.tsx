import type { Meta, StoryObj } from '@storybook/react-vite';
import { Activity, FileText, Shield } from 'lucide-react';
import { Tabs, TabPanel } from './Tabs';

const meta = {
  title: 'MedFlow Design System/Components/Tabs',
  component: Tabs,
  args: {
    value: 'overview',
    items: [
      { value: 'overview', label: 'Overview', icon: <Activity size={14} /> },
      { value: 'notes', label: 'Clinical notes', icon: <FileText size={14} /> },
      { value: 'access', label: 'Access', icon: <Shield size={14} /> },
    ],
    onChange: () => undefined,
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Tabs {...args} />
      <TabPanel value="overview" activeValue={args.value ?? 'overview'}>
        <div>Overview content</div>
      </TabPanel>
      <TabPanel value="notes" activeValue={args.value ?? 'overview'}>
        <div>Clinical notes content</div>
      </TabPanel>
      <TabPanel value="access" activeValue={args.value ?? 'overview'}>
        <div>Access content</div>
      </TabPanel>
    </div>
  ),
};
