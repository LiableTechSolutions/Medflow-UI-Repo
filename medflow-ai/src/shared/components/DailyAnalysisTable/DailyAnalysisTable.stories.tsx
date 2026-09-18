import type { Meta, StoryObj } from '@storybook/react-vite';
import { DailyAnalysisTable } from './DailyAnalysisTable';
import type { DailyAnalysisEntry } from '../../../core/api/types';
import type { DoctorOption } from '../HospitalisationRecordForm/HospitalisationRecordForm';

const doctorOptions: DoctorOption[] = [
  { value: '7', label: 'Dr. Karan Mehta · General Medicine' },
  { value: '9', label: 'Dr. Anjali Singh · Cardiology' },
];

const entries: DailyAnalysisEntry[] = [
  {
    id: 1,
    hospitalisationRecordId: 100,
    patientId: 42,
    bloodPressure: '128/82',
    pulse: 78,
    temperature: 99.1,
    spo2: 97,
    notes: 'Stable, mild cough persists.',
    recordedByDoctorId: 9,
    recordedAt: '2026-09-16T08:00:00Z',
  },
  {
    id: 2,
    hospitalisationRecordId: 100,
    patientId: 42,
    bloodPressure: '122/79',
    pulse: 74,
    temperature: 98.4,
    spo2: 98,
    notes: undefined,
    recordedByDoctorId: 7,
    recordedAt: '2026-09-17T08:00:00Z',
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
    doctorOptions,
    onAddEntry: async () => {},
  },
};

export const Empty: Story = {
  args: {
    entries: [],
    doctorOptions,
    onAddEntry: async () => {},
  },
};

export const Loading: Story = {
  args: {
    entries: [],
    doctorOptions,
    isLoading: true,
  },
};

export const ErrorState: Story = {
  args: {
    entries: [],
    doctorOptions,
    error: 'Could not reach the API to load daily analysis entries.',
  },
};

export const ReadOnly: Story = {
  args: {
    entries,
    doctorOptions,
  },
};
