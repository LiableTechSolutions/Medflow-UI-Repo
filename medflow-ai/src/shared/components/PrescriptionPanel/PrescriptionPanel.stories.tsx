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
    createdAt: new Date().toISOString(),
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

export const Empty: Story = {
  args: {
    prescriptions: [],
    onAddPrescription: async () => {},
  },
};
