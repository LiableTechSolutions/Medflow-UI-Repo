import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio, RadioGroup } from './Radio';

const meta = {
  title: 'MedFlow Design System/Components/Radio',
  component: Radio,
  args: {
    label: 'Weekend coverage',
    hint: 'Assign an on-call clinician for the weekend shift.',
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Group: Story = {
  render: () => (
    <RadioGroup
      name="coverage"
      label="Coverage priority"
      value="high"
      onChange={() => undefined}
      options={[
        { value: 'high', label: 'High priority', hint: 'Best for urgent blockers' },
        { value: 'normal', label: 'Normal', hint: 'Standard triage route' },
        { value: 'low', label: 'Low priority', hint: 'Backlogged requests only' },
      ]}
    />
  ),
};
