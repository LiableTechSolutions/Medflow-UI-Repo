import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarPlus, ListOrdered, LogIn, LogOut } from 'lucide-react';
import { DataPage } from '../../../shared/components/DataPage';
import { Badge } from '../../../shared/components/Badge/Badge';
import { Button } from '../../../shared/components/Button/Button';
import { Input } from '../../../shared/components/Input/Input';
import { Select } from '../../../shared/components/Select/Select';
import { useToast } from '../../../shared/components/Toast/Toast';
import { BookAppointmentModal } from '../components/BookAppointmentModal';
import { appointmentsApi, doctorsApi, hospitalApi } from '../../../core/api/services';
import { useApiResource } from '../../../shared/hooks/useApiResource';
import { useAuth } from '../../../core/auth/AuthContext';
import { ApiError } from '../../../core/api/client';
import { formatDateTime, humanize, statusTone } from '../../../core/utils/format';
import { todayDateOnly } from '../../../core/utils/validation';
import type { Appointment } from '../../../core/api/types';

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

type DatePreset = 'today' | '7d' | '1m' | '2m' | 'custom';

const DATE_PRESETS: { value: DatePreset; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 days' },
  { value: '1m', label: 'Last 1 month' },
  { value: '2m', label: 'Last 2 months' },
  { value: 'custom', label: 'Custom range' },
];

/** Inclusive from/to (yyyy-mm-dd) for a preset, ending today. */
function rangeFor(preset: Exclude<DatePreset, 'custom'>): { from: string; to: string } {
  const to = todayDateOnly();
  const start = new Date();
  if (preset === '7d') start.setDate(start.getDate() - 7);
  else if (preset === '1m') start.setMonth(start.getMonth() - 1);
  else if (preset === '2m') start.setMonth(start.getMonth() - 2);
  return { from: start.toISOString().slice(0, 10), to };
}

/**
 * The front-desk workflow is just two steps here: check the patient in, then check them
 * out. The server's state machine still has CONFIRMED / IN_CONSULTATION in between, so
 * check-out from "checked in" walks through start-consultation to complete.
 */
const CHECK_IN_FROM = ['BOOKED', 'CONFIRMED'];
const CHECK_OUT_FROM = ['CHECKED_IN', 'IN_CONSULTATION'];

export default function AppointmentsPage() {
  const { show } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isDoctor = user?.roleCode === 'DOCTOR';

  const [status, setStatus] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [preset, setPreset] = useState<DatePreset>('today');
  const [customFrom, setCustomFrom] = useState(todayDateOnly());
  const [customTo, setCustomTo] = useState(todayDateOnly());
  const [version, setVersion] = useState(0);
  const [isBookOpen, setIsBookOpen] = useState(false);

  // Used to build the hospital-branded live-queue link; a single lightweight fetch.
  const { data: hospital } = useApiResource(() => hospitalApi.profile(), []);
  const { data: doctorsPage } = useApiResource(() => doctorsApi.list({ size: 100 }), []);
  const doctorOptions = useMemo(
    () => [
      { value: '', label: 'All doctors' },
      ...(doctorsPage?.content ?? []).map((doctor) => ({ value: String(doctor.id), label: doctor.fullName })),
    ],
    [doctorsPage],
  );

  const range = preset === 'custom' ? { from: customFrom, to: customTo } : rangeFor(preset);

  function openPatient(row: Appointment) {
    if (isDoctor) {
      navigate(`/doctor/patients/${row.patientId}`, { state: { appointmentId: row.id } });
    } else {
      navigate(`/patients/${row.patientId}`);
    }
  }

  function onBooked(appointment: Appointment) {
    setIsBookOpen(false);
    setVersion((v) => v + 1);
    show({
      title: 'Appointment booked',
      description: `${appointment.patientName} is #${appointment.queueNumber ?? '—'} in the queue. They've been notified.`,
      tone: 'success',
    });
  }

  async function checkIn(row: Appointment) {
    try {
      await appointmentsApi.transition(row.id, 'check-in');
      show({ title: `${row.patientName} checked in`, tone: 'success' });
      setVersion((v) => v + 1);
    } catch (cause) {
      show({
        title: 'Could not check in',
        description: cause instanceof ApiError ? cause.message : undefined,
        tone: 'danger',
      });
    }
  }

  async function checkOut(row: Appointment) {
    try {
      if (row.status === 'CHECKED_IN') {
        await appointmentsApi.transition(row.id, 'start-consultation');
      }
      await appointmentsApi.transition(row.id, 'complete');
      show({ title: `${row.patientName} checked out`, tone: 'success' });
      setVersion((v) => v + 1);
    } catch (cause) {
      show({
        title: 'Could not check out',
        description: cause instanceof ApiError ? cause.message : undefined,
        tone: 'danger',
      });
    }
  }

  return (
    <>
      <DataPage<Appointment>
        title="Appointment Management"
        description="Newest first. Check patients in and out; click a row to open the patient's profile."
        searchable={false}
        rowKey={(row) => row.id}
        deps={[status, doctorId, preset, customFrom, customTo, version]}
        load={({ page, size }) =>
          appointmentsApi.list({
            page,
            size,
            status: status || undefined,
            doctorId: doctorId ? Number(doctorId) : undefined,
            from: range.from,
            to: range.to,
            latestFirst: true,
          })
        }
        emptyMessage="No appointments for these filters."
        onRowClick={openPatient}
        actions={
          <div style={{ display: 'flex', gap: 'var(--mf-space-3)' }}>
            <Button
              variant="outline"
              leftIcon={<ListOrdered size={16} />}
              disabled={!hospital}
              onClick={() => hospital && navigate(`/appointments/${hospital.hospitalCode}/queue`)}
            >
              Queue board
            </Button>
            <Button leftIcon={<CalendarPlus size={16} />} onClick={() => setIsBookOpen(true)}>
              New Appointment
            </Button>
          </div>
        }
        toolbar={
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 'var(--mf-space-3)' }}>
            <div style={{ minWidth: 170 }}>
              <Select
                options={DATE_PRESETS}
                value={preset}
                onChange={(event) => setPreset(event.target.value as DatePreset)}
                aria-label="Date range"
              />
            </div>
            {preset === 'custom' && (
              <>
                <div style={{ minWidth: 150 }}>
                  <Input
                    type="date"
                    value={customFrom}
                    max={customTo}
                    onChange={(event) => setCustomFrom(event.target.value)}
                    aria-label="From date"
                  />
                </div>
                <div style={{ minWidth: 150 }}>
                  <Input
                    type="date"
                    value={customTo}
                    min={customFrom}
                    onChange={(event) => setCustomTo(event.target.value)}
                    aria-label="To date"
                  />
                </div>
              </>
            )}
            <div style={{ minWidth: 180 }}>
              <Select
                options={doctorOptions}
                value={doctorId}
                onChange={(event) => setDoctorId(event.target.value)}
                aria-label="Filter by doctor"
              />
            </div>
            <div style={{ minWidth: 180 }}>
              <Select
                options={STATUSES}
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                aria-label="Filter by status"
              />
            </div>
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
            render: (row) => {
              if (CHECK_IN_FROM.includes(row.status)) {
                return (
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<LogIn size={14} />}
                    onClick={(event) => {
                      event.stopPropagation();
                      checkIn(row);
                    }}
                  >
                    Check in
                  </Button>
                );
              }
              if (CHECK_OUT_FROM.includes(row.status)) {
                return (
                  <Button
                    size="sm"
                    leftIcon={<LogOut size={14} />}
                    onClick={(event) => {
                      event.stopPropagation();
                      checkOut(row);
                    }}
                  >
                    Check out
                  </Button>
                );
              }
              return null;
            },
          },
        ]}
      />
      <BookAppointmentModal isOpen={isBookOpen} onClose={() => setIsBookOpen(false)} onBooked={onBooked} />
    </>
  );
}
