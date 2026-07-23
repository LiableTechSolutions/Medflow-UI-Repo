import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table, type TableColumn } from './Table';

type PatientRow = {
  id: string;
  name: string;
  status: string;
  visit: string;
};

const columns: TableColumn<PatientRow>[] = [
  { key: 'name', header: 'Patient', render: (row) => row.name },
  { key: 'status', header: 'Status', render: (row) => row.status },
  { key: 'visit', header: 'Visit', render: (row) => row.visit },
];

const data: PatientRow[] = [
  { id: '1', name: 'Meera Joshi', status: 'Checked in', visit: '09:30 AM' },
  { id: '2', name: 'Rohan Verma', status: 'Lab pending', visit: '11:00 AM' },
  { id: '3', name: 'Priya Nair', status: 'Discharged', visit: '01:15 PM' },
];

const meta = {
  title: 'MedFlow Design System/Components/Table',
  component: Table,
  args: {
    columns,
    data,
    rowKey: (row) => row.id,
  },
} satisfies Meta<typeof Table<PatientRow>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    data: [],
    emptyMessage: 'No patients scheduled for this time block.',
  },
};
