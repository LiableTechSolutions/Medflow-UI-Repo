import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchableSelect, type SearchableSelectOption } from './SearchableSelect';

const meta = {
  title: 'MedFlow Design System/Form/Searchable Select',
  component: SearchableSelect,
} satisfies Meta<typeof SearchableSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const indianStates: SearchableSelectOption[] = [
  'Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala',
  'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal',
].map((name) => ({ value: name, label: name }));

function Interactive(props: { initialValue?: string; error?: string; loadOptions?: () => Promise<SearchableSelectOption[]> }) {
  const [value, setValue] = useState(props.initialValue ?? '');
  return (
    <div style={{ maxWidth: 320 }}>
      <SearchableSelect
        label="State"
        placeholder="Search for a state…"
        value={value}
        onChange={setValue}
        options={props.loadOptions ? undefined : indianStates}
        loadOptions={props.loadOptions}
        error={props.error}
      />
    </div>
  );
}

export const Default: Story = {
  args: { value: '', onChange: () => {}, options: indianStates },
  render: () => <Interactive />,
};

export const Prefilled: Story = {
  args: { value: 'Karnataka', onChange: () => {}, options: indianStates },
  render: () => <Interactive initialValue="Karnataka" />,
};

export const WithError: Story = {
  args: { value: '', onChange: () => {}, options: indianStates, error: 'State is required' },
  render: () => <Interactive error="State is required" />,
};

export const LoadingFromApi: Story = {
  args: { value: '', onChange: () => {} },
  render: () => (
    <Interactive
      loadOptions={() => new Promise((resolve) => setTimeout(() => resolve(indianStates), 1500))}
    />
  ),
};
