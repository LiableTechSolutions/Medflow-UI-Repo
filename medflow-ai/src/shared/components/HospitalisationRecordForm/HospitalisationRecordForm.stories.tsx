import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { HospitalisationRecordForm, type HospitalisationRecordValues } from './HospitalisationRecordForm';

const doctorOptions = [
  { value: '1', label: 'Dr. Ananya Rao · Internal Medicine' },
  { value: '2', label: 'Dr. Karan Mehta · Cardiology' },
  { value: '3', label: 'Dr. Leela Iyer · Pulmonology' },
];

const emptyValues: HospitalisationRecordValues = { ward: '', bed: '', admittingDoctorId: '', admissionDate: '' };
const filledValues: HospitalisationRecordValues = {
  ward: 'General Ward B',
  bed: 'B-14',
  admittingDoctorId: '2',
  admissionDate: '2026-09-15',
};

const meta = {
  title: 'MedFlow Design System/Medical/Hospitalisation Record Form',
  component: HospitalisationRecordForm,
  args: {
    doctorOptions,
  },
} satisfies Meta<typeof HospitalisationRecordForm>;

export default meta;
type Story = StoryObj<typeof meta>;

function Editable({ initial }: { initial: HospitalisationRecordValues }) {
  const [values, setValues] = useState(initial);
  return <HospitalisationRecordForm values={values} onChange={setValues} doctorOptions={doctorOptions} />;
}

export const Empty: Story = {
  args: { values: emptyValues, onChange: () => {} },
  render: () => <Editable initial={emptyValues} />,
};

export const Filled: Story = {
  args: { values: filledValues, onChange: () => {} },
  render: () => <Editable initial={filledValues} />,
};

export const LoadingDoctors: Story = {
  args: {
    values: emptyValues,
    onChange: () => {},
    doctorOptions: [],
    isLoadingDoctors: true,
  },
};

export const ReadOnlySummary: Story = {
  args: {
    values: filledValues,
    onChange: () => {},
    readOnly: true,
    status: 'ADMITTED',
    admittingDoctorName: 'Dr. Karan Mehta',
  },
};
