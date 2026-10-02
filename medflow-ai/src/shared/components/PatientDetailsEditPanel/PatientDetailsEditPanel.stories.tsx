import type { Meta, StoryObj } from '@storybook/react-vite';
import { PatientDetailsEditPanel } from './PatientDetailsEditPanel';
import type { HospitalisationRecord, Patient } from '../../../core/api/types';

const doctorOptions = [
  { value: '1', label: 'Dr. Ananya Rao · Internal Medicine' },
  { value: '2', label: 'Dr. Karan Mehta · Cardiology' },
];

const opdPatient: Patient = {
  id: 1,
  patientCode: 'PT-0001',
  fullName: 'Meera Joshi',
  firstName: 'Meera',
  lastName: 'Joshi',
  gender: 'FEMALE',
  dateOfBirth: '1990-04-12',
  age: 36,
  bloodGroup: 'B+',
  phone: '9876543210',
  email: 'meera.joshi@example.com',
  address: '221 MG Road',
  city: 'Pune',
  state: 'Maharashtra',
  postalCode: '411001',
  status: 'ACTIVE',
  isHospitalised: false,
  createdAt: '2026-08-01T09:00:00Z',
};

const hospitalisedPatient: Patient = { ...opdPatient, id: 2, patientCode: 'PT-0002', fullName: 'Rohan Verma', firstName: 'Rohan', lastName: 'Verma', isHospitalised: true };

const activeHospitalisation: HospitalisationRecord = {
  id: 100,
  patientId: 2,
  ward: 'General Ward B',
  bed: 'B-14',
  admittingDoctorId: 2,
  admissionDate: '2026-09-15',
  status: 'ADMITTED',
  createdAt: '2026-09-15T10:00:00Z',
};

const meta = {
  title: 'MedFlow Design System/Medical/Patient Details Edit Panel',
  component: PatientDetailsEditPanel,
  args: {
    doctorOptions,
    onSave: async () => {},
  },
} satisfies Meta<typeof PatientDetailsEditPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OpdView: Story = {
  args: {
    patient: opdPatient,
  },
};

export const HospitalisedView: Story = {
  args: {
    patient: hospitalisedPatient,
    hospitalisation: activeHospitalisation,
  },
};

export const LoadingDoctorOptions: Story = {
  args: {
    patient: opdPatient,
    doctorOptions: [],
    isLoadingDoctors: true,
  },
};
