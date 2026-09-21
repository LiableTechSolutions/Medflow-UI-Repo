import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarPlus } from 'lucide-react';
import { DataPage } from '../../../shared/components/DataPage';
import { Badge } from '../../../shared/components/Badge/Badge';
import { Button } from '../../../shared/components/Button/Button';
import { Select } from '../../../shared/components/Select/Select';
import { useToast } from '../../../shared/components/Toast/Toast';
import { BookAppointmentModal } from '../components/BookAppointmentModal';
import { appointmentsApi, hospitalApi } from '../../../core/api/services';
import { useApiResource } from '../../../shared/hooks/useApiResource';
import { ApiError } from '../../../core/api/client';
import { formatDateTime, humanize, statusTone } from '../../../core/utils/format';
import type { Appointment, AppointmentStatus } from '../../../core/api/types';

const STATUSES = [
  { value: '', label: 'All statuses' },
  { value: 'BOOKED', label: 'Booked' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'CHECKED_IN', label: 'Checked in' },
  { value: 'IN_CONSULTATION', label: 'In consultation' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'NO_SHOW', label: 'No show' },
];

/** The next step in the front-desk workflow for a given state. */
const NEXT_ACTION: Partial<Record<AppointmentStatus, { action: string; label: string }>> = {
  BOOKED: { action: 'confirm', label: 'Confirm' },
  CONFIRMED: { action: 'check-in', label: 'Check in' },
  CHECKED_IN: { action: 'start-consultation', label: 'Start' },
  IN_CONSULTATION: { action: 'complete', label: 'Complete' },
};

export default function AppointmentsPage() {
  const { show } = useToast();
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const [version, setVersion] = useState(0);
  const [isBookOpen, setIsBookOpen] = useState(false);

  // Used to build the hospital-branded live-queue link; a single lightweight fetch, not
  // per navigation.
  const { data: hospital } = useApiResource(() => hospitalApi.profile(), []);

  function queueUrl(appointmentId: number) {
    return hospital ? `/appointments/${hospital.hospitalCode}/queue/${appointmentId}` : null;
  }

  function goToQueue(appointmentId: number) {
    const url = queueUrl(appointmentId);
    if (url) navigate(url);
  }

  function onBooked(appointment: Appointment) {
    setIsBookOpen(false);
    setVersion((v) => v + 1);
    show({
      title: 'Appointment booked',
      description: `${appointment.patientName} is #${appointment.queueNumber ?? '—'} in the queue. They've been notified.`,
      tone: 'success',
    });
    goToQueue(appointment.id);
  }

  async function advance(row: Appointment) {
    const next = NEXT_ACTION[row.status];
    if (!next) return;
    try {
      await appointmentsApi.transition(row.id, next.action);
      show({ title: `${row.patientName}: ${next.label.toLowerCase()}d`, tone: 'success' });
      setVersion((v) => v + 1);
    } catch (cause) {
      show({
        title: 'Could not update the appointment',
        description: cause instanceof ApiError ? cause.message : undefined,
        tone: 'danger',
      });
    }
  }

  return (
    <>
    <DataPage<Appointment>
      title="Appointment Management"
      description="Booking, the day's queue and the consultation workflow."
      searchable={false}
      rowKey={(row) => row.id}
      deps={[status, version]}
      load={({ page, size }) => appointmentsApi.list({ page, size, status: status || undefined })}
      emptyMessage="No appointments for this filter."
      onRowClick={(row) => goToQueue(row.id)}
      actions={
        <Button leftIcon={<CalendarPlus size={16} />} onClick={() => setIsBookOpen(true)}>
          New Appointment
        </Button>
      }
      toolbar={
        <div style={{ minWidth: 220 }}>
          <Select
            options={STATUSES}
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            aria-label="Filter by status"
          />
        </div>
      }
      columns={[
        { key: 'queue', header: '#', width: '60px', render: (row) => row.queueNumber ?? '—' },
        { key: 'patient', header: 'Patient', render: (row) => row.patientName },
        {
          key: 'doctor',
          header: 'Doctor',
          render: (row) => (
            <div>
              <div>{row.doctorName}</div>
              <small style={{ color: 'var(--mf-text-muted)' }}>{row.doctorSpecialty}</small>
            </div>
          ),
        },
        { key: 'when', header: 'Scheduled', render: (row) => formatDateTime(row.scheduledAt) },
        { key: 'mode', header: 'Mode', render: (row) => humanize(row.appointmentMode) },
        {
          key: 'status',
          header: 'Status',
          render: (row) => (
            <Badge tone={statusTone(row.status)} dot>
              {humanize(row.status)}
            </Badge>
          ),
        },
        {
          key: 'action',
          header: '',
          align: 'right',
          render: (row) =>
            NEXT_ACTION[row.status] ? (
              <Button
                size="sm"
                variant="outline"
                onClick={(event) => {
                  event.stopPropagation();
                  advance(row);
                }}
              >
                {NEXT_ACTION[row.status]!.label}
              </Button>
            ) : null,
        },
      ]}
    />
    <BookAppointmentModal
      isOpen={isBookOpen}
      onClose={() => setIsBookOpen(false)}
      onBooked={onBooked}
    />
    </>
  );
}
