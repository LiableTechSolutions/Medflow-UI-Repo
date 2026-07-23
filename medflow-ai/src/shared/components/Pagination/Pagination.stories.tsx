import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from './Pagination';

const meta = {
  title: 'MedFlow Design System/Navigation/Pagination',
  component: Pagination,
  args: {
    currentPage: 3,
    totalPages: 8,
    summary: 'Showing 21–30 of 64 results',
    onPageChange: () => undefined,
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
