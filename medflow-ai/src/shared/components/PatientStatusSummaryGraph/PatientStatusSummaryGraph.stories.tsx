import type { Meta, StoryObj } from '@storybook/react-vite';
import { PatientStatusSummaryGraph, type PatientStatusPoint } from './PatientStatusSummaryGraph';

const points: PatientStatusPoint[] = [
  { date: '2026-09-13', bloodPressureSystolic: 132, bloodPressureDiastolic: 86, pulseRate: 82, temperature: 100.2, spo2: 95 },
  { date: '2026-09-14', bloodPressureSystolic: 128, bloodPressureDiastolic: 84, pulseRate: 80, temperature: 99.4, spo2: 96 },
  { date: '2026-09-15', bloodPressureSystolic: 124, bloodPressureDiastolic: 81, pulseRate: 77, temperature: 98.9, spo2: 97 },
  { date: '2026-09-16', bloodPressureSystolic: 122, bloodPressureDiastolic: 79, pulseRate: 75, temperature: 98.5, spo2: 98 },
  { date: '2026-09-17', bloodPressureSystolic: 120, bloodPressureDiastolic: 78, pulseRate: 74, temperature: 98.4, spo2: 98 },
];

const meta = {
  title: 'MedFlow Design System/Medical/Patient Status Summary Graph',
  component: PatientStatusSummaryGraph,
} satisfies Meta<typeof PatientStatusSummaryGraph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { points },
};

export const SingleReading: Story = {
  args: { points: points.slice(0, 1) },
};

export const Loading: Story = {
  args: { points: [], isLoading: true },
};

export const Empty: Story = {
  args: { points: [] },
};
