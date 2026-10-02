import type { Meta, StoryObj } from '@storybook/react-vite';
import { PrescriptionDetailModal } from './PrescriptionDetailModal';
import type { Prescription } from '../../../core/api/types';

const samplePrescription: Prescription = {
  id: 1,
  patientId: 1,
  patientName: 'Arjun Patel',
  doctorId: 1,
  doctorName: 'Riya Nair',
  diagnosis: 'Mild seasonal allergy, runny nose and sneezing.',
  medicines: [
    { medicationName: 'Cetirizine', dosage: '10mg', frequency: 'Once daily', durationDays: 5, instructions: 'After breakfast' },
  ],
  digitallySigned: true,
  status: 'ACTIVE',
  createdAt: new Date().toISOString(),
};

const meta = {
  title: 'MedFlow Design System/Dashboard/Prescription Detail Modal',
  component: PrescriptionDetailModal,
  args: {
    prescription: samplePrescription,
    hospitalName: 'MedFlow Hospital',
    onClose: () => {},
  },
} satisfies Meta<typeof PrescriptionDetailModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Signed: Story = {};

export const DraftCancelled: Story = {
  args: {
    prescription: { ...samplePrescription, digitallySigned: false, status: 'CANCELLED' },
  },
};
