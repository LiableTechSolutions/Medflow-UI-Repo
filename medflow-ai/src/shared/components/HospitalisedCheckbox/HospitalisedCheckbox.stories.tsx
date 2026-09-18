import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { HospitalisedCheckbox } from './HospitalisedCheckbox';

const meta = {
  title: 'MedFlow Design System/Medical/Hospitalised Checkbox',
  component: HospitalisedCheckbox,
} satisfies Meta<typeof HospitalisedCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

function Interactive({ checked: initialChecked, disabled }: { checked: boolean; disabled?: boolean }) {
  const [checked, setChecked] = useState(initialChecked);
  return <HospitalisedCheckbox checked={checked} onChange={setChecked} disabled={disabled} />;
}

export const Unchecked: Story = {
  args: { checked: false, onChange: () => {} },
  render: (args) => <Interactive checked={args.checked} />,
};

export const Checked: Story = {
  args: { checked: true, onChange: () => {} },
  render: (args) => <Interactive checked={args.checked} />,
};

export const Disabled: Story = {
  args: { checked: false, onChange: () => {}, disabled: true },
  render: (args) => <Interactive checked={args.checked} disabled={args.disabled} />,
};
