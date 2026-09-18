import type { Meta, StoryObj } from '@storybook/react-vite';
import { DailyAnalysisTable } from './DailyAnalysisTable';
import type { DailyAnalysisEntry } from '../../../core/api/types';

const entries: DailyAnalysisEntry[] = [
  {
    id: 1,
    hospitalisationId: 100,
    patientId: 42,
    entryDate: '2026-09-16',
    bloodPressureSystolic: 128,
    bloodPressureDiastolic: 82,
    pulseRate: 78,
    temperature: 99.1,
    spo2: 97,
    notes: 'Stable, mild cough persists.',
    recordedBy: 'Nurse Anjali Singh',
    createdAt: '2026-09-16T08:00:00Z',
  },
  {
    id: 2,
    hospitalisationId: 100,
    patientId: 42,
    entryDate: '2026-09-17',
    bloodPressureSystolic: 122,
    bloodPressureDiastolic: 79,
    pulseRate: 74,
    temperature: 98.4,
    spo2: 98,
    notes: undefined,
    recordedBy: 'Dr. Karan Mehta',
    createdAt: '2026-09-17T08:00:00Z',
  },
];

const meta = {
  title: 'MedFlow Design System/Medical/Daily Analysis Table',
  component: DailyAnalysisTable,
} satisfies Meta<typeof DailyAnalysisTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    entries,
    defaultRecordedBy: 'Nurse Anjali Singh',
    onAddEntry: async () => {},
  },
};

export const Empty: Story = {
  args: {
    entries: [],
    defaultRecordedBy: 'Nurse Anjali Singh',
    onAddEntry: async () => {},
  },
};

export const Loading: Story = {
  args: {
    entries: [],
    isLoading: true,
  },
};

export const ErrorState: Story = {
  args: {
    entries: [],
    error: 'Could not reach the API to load daily analysis entries.',
  },
};

export const ReadOnly: Story = {
  args: {
    entries,
  },
};
