import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueueStatus } from './QueueStatus';
import type { QueueStatus as QueueStatusData } from '../../../core/api/types';

const meta = {
  title: 'MedFlow Design System/Medical/Queue Status',
  component: QueueStatus,
} satisfies Meta<typeof QueueStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = {
  doctorName: 'Dr. Karan Mehta · General medicine',
  scheduledAt: '2026-09-18T16:30:00Z',
  hospitalName: 'City Care Hospital',
  lastUpdatedAt: new Date('2026-09-18T15:58:12Z'),
};

export const NextInLine: Story = {
  args: {
    ...base,
    queue: { appointmentId: 1, queueNumber: 1, status: 'CONFIRMED', position: 1, aheadCount: 0, totalActive: 3 } satisfies QueueStatusData,
  },
};

export const FewPatientsAhead: Story = {
  args: {
    ...base,
    queue: { appointmentId: 2, queueNumber: 4, status: 'BOOKED', position: 4, aheadCount: 3, totalActive: 9 } satisfies QueueStatusData,
  },
};

export const ManyPatientsAhead: Story = {
  args: {
    ...base,
    queue: { appointmentId: 3, queueNumber: 14, status: 'BOOKED', position: 14, aheadCount: 13, totalActive: 20 } satisfies QueueStatusData,
  },
};

export const Closed: Story = {
  args: {
    ...base,
    queue: { appointmentId: 4, queueNumber: 2, status: 'COMPLETED', position: 0, aheadCount: 0, totalActive: 0 } satisfies QueueStatusData,
    lastUpdatedAt: undefined,
  },
};
