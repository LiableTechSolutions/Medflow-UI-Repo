import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchBar } from './SearchBar';

const meta = {
  title: 'MedFlow Design System/Forms/SearchInput',
  component: SearchBar,
  args: {
    placeholder: 'Search patients, doctors, records…',
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
