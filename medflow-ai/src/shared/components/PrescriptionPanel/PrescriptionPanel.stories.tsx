import type { Meta, StoryObj } from '@storybook/react-vite';
import { PrescriptionPanel } from './PrescriptionPanel';
import type { Prescription } from '../../../core/api/types';

const samplePrescriptions: Prescription[] = [
  {
    id: 1,
    patientId: 1,
    patientName: 'Meera Joshi',
    doctorId: 1,
    doctorName: 'Kabir Shah',
    diagnosis: 'Seasonal allergic rhinitis',
    medicines: [
      { medicationName: 'Cetirizine', dosage: '10mg', frequency: 'Once daily', durationDays: 5, instructions: 'After food' },
    ],
    digitallySigned: true,
    status: 'ACTIVE',
    editable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    patientId: 1,
    patientName: 'Meera Joshi',
    doctorId: 1,
    doctorName: 'Kabir Shah',
    diagnosis: 'Essential hypertension, stable',
    medicines: [
      { medicationName: 'Telmisartan', dosage: '40mg', frequency: 'Once daily', durationDays: 30 },
    ],
    digitallySigned: true,
    status: 'ACTIVE',
    followUpDate: '2026-10-17',
    editable: false,
    createdAt: '2026-09-16T10:00:00Z',
  },
];

const meta = {
  title: 'MedFlow Design System/Dashboard/Prescription Panel',
  component: PrescriptionPanel,
  args: {
    prescriptions: samplePrescriptions,
    loadMedicineOptions: () => Promise.resolve(['Cetirizine', 'Paracetamol', 'Amoxicillin']),
  },
} satisfies Meta<typeof PrescriptionPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReadOnly: Story = {};

export const WithAddPrescription: Story = {
  args: {
    onAddPrescription: async () => {},
  },
};

/** The first row is editable (issued today); the second is locked (issued on an earlier day). */
export const WithEditing: Story = {
  args: {
    onAddPrescription: async () => {},
    onEditPrescription: async () => {},
    currentDoctorId: 1,
  },
};

export const Empty: Story = {
  args: {
    prescriptions: [],
    onAddPrescription: async () => {},
  },
};
