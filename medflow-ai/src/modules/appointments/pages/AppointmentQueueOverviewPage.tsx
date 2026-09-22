import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Tv } from 'lucide-react';
import { PageHeader } from '../../../shared/components/PageHeader/PageHeader';
import { Card, CardBody } from '../../../shared/components/Card/Card';
import { Badge } from '../../../shared/components/Badge/Badge';
import { Button } from '../../../shared/components/Button/Button';
import { Select } from '../../../shared/components/Select/Select';
import { Input } from '../../../shared/components/Input/Input';
import { Loading } from '../../../shared/components/Loading/Loading';
import { Alert } from '../../../shared/components/Alert/Alert';
import { Table, type TableColumn } from '../../../shared/components/Table/Table';
import { useApiResource } from '../../../shared/hooks/useApiResource';
import { useToast } from '../../../shared/components/Toast/Toast';
import { appointmentsApi, doctorsApi } from '../../../core/api/services';
import { ApiError } from '../../../core/api/client';
import { formatDate, formatTime, humanize, statusTone } from '../../../core/utils/format';
import { todayDateOnly } from '../../../core/utils/validation';
import type { Appointment, AppointmentStatus } from '../../../core/api/types';
import '../../../shared/components/QueueStatus/QueueStatus.css';
import './AppointmentQueueOverviewPage.css';

const POLL_INTERVAL_MS = 20_000;
const ACTIVE_STATUSES: AppointmentStatus[] = ['BOOKED', 'CONFIRMED', 'CHECKED_IN', 'IN_CONSULTATION'];

/**
 * The waiting-room board: every appointment for one doctor on one day, in queue order,
 * plus a "total active / now serving" summary — refreshing live. This is the "who's in
 * the queue" view; /queue/:id (one appointment's own position) is a different, more
 * focused page for a single patient.
 */
export default function AppointmentQueueOverviewPage() {
  const { hospitalCode } = useParams<{ hospitalCode: string }>();
  const navigate = useNavigate();
  const { show } = useToast();
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState(todayDateOnly());
  const [doctorOptions, setDoctorOptions] = useState<{ value: string; label: string }[]>([]);
  const [version, setVersion] = useState(0);
  const [isOpeningTv, setIsOpeningTv] = useState(false);

  async function openTvDisplay() {
    setIsOpeningTv(true);
    try {
      const { token } = await appointmentsApi.queueLink(Number(doctorId), date);
      window.open(`/public/queue?token=${encodeURIComponent(token)}`, '_blank', 'noopener');
    } catch (cause) {
      show({
        title: 'Could not open the TV display',
        description: cause instanceof ApiError ? cause.message : undefined,
        tone: 'danger',
      });
    } finally {
      setIsOpeningTv(false);
    }
  }

  useEffect(() => {
    doctorsApi.list({ size: 100 }).then((page) => {
      const options = page.content.map((doctor) => ({ value: String(doctor.id), label: `${doctor.fullName} · ${doctor.specialty}` }));
      setDoctorOptions(options);
      setDoctorId((current) => current || options[0]?.value || '');
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setVersion((v) => v + 1), POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const { data, error, isLoading, reload } = useApiResource(
    () => (doctorId ? appointmentsApi.list({ doctorId: Number(doctorId), date, size: 100 }) : Promise.resolve(null)),
    [doctorId, date, version],
  );

  const appointments = data?.content ?? [];
  const activeAppointments = appointments.filter((row) => ACTIVE_STATUSES.includes(row.status));
  const nowServing = appointments.find((row) => row.status === 'IN_CONSULTATION');
  const upNext = activeAppointments.filter((row) => row.status !== 'IN_CONSULTATION').slice(0, 5);
  const selectedDoctorLabel = doctorOptions.find((option) => option.value === doctorId)?.label ?? '';

  const columns: TableColumn<Appointment>[] = [
    { key: 'queue', header: '#', width: '60px', render: (row) => row.queueNumber ?? '—' },
    { key: 'patient', header: 'Patient', render: (row) => row.patientName },
    { key: 'when', header: 'Time', render: (row) => formatTime(row.scheduledAt) },
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
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mf-space-5)' }}>
      <PageHeader
        title="Queue board"
        description="Every appointment for the selected doctor and day, in queue order — refreshes automatically."
        actions={
          <div style={{ display: 'flex', gap: 'var(--mf-space-3)' }}>
            <Button variant="outline" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate('/appointments')}>
              Back to appointments
            </Button>
            <Button
              variant="outline"
              leftIcon={<Tv size={16} />}
              disabled={!doctorId}
              isLoading={isOpeningTv}
              onClick={openTvDisplay}
            >
              Open TV display
            </Button>
          </div>
        }
      />

      <div style={{ display: 'flex', gap: 'var(--mf-space-3)', flexWrap: 'wrap' }}>
        <div style={{ minWidth: 240 }}>
          <Select
            options={doctorOptions}
            value={doctorId}
            placeholder={doctorOptions.length === 0 ? 'Loading doctors…' : 'Select a doctor'}
            onChange={(event) => setDoctorId(event.target.value)}
            aria-label="Doctor"
          />
        </div>
        <div style={{ minWidth: 160 }}>
          <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} aria-label="Date" />
        </div>
      </div>

      <Card padding="lg">
        <CardBody>
          <div className="mf-queue-status__header">
            <div>
              <p className="mf-queue-status__doctor">{selectedDoctorLabel}</p>
              <p className="mf-queue-status__when">{formatDate(date)}</p>
            </div>
            {nowServing && (
              <Badge tone={statusTone('IN_CONSULTATION')} dot>
                In consultation
              </Badge>
            )}
          </div>

          <div className="mf-queue-status__panel">
            <p className="mf-queue-status__panel-label">Now serving</p>
            <p className="mf-queue-status__panel-value">
              {nowServing ? nowServing.queueNumber ?? '—' : '—'}
              <span className="mf-queue-status__panel-value-total"> of {activeAppointments.length}</span>
            </p>
            {nowServing && <p className="mf-queue-status__panel-sub">{nowServing.patientName}</p>}
          </div>

          {upNext.length > 0 && (
            <div className="mf-queue-overview__next">
              <p className="mf-queue-overview__next-label">Next up</p>
              <div className="mf-queue-overview__next-list">
                {upNext.map((row) => (
                  <span key={row.id} className="mf-queue-overview__next-pill">
                    #{row.queueNumber ?? '—'} {row.patientName}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {error && (
        <Alert tone="danger" title="Could not load the queue">
          {error}
          <div style={{ marginTop: 'var(--mf-space-3)' }}>
            <Button size="sm" variant="outline" onClick={reload}>
              Try again
            </Button>
          </div>
        </Alert>
      )}

      <Card padding="lg">
        <CardBody>
          {isLoading && !data ? (
            <Loading label="Loading queue…" />
          ) : (
            <Table
              columns={columns}
              data={appointments}
              rowKey={(row) => row.id}
              onRowClick={(row) => navigate(`/appointments/${hospitalCode}/queue/${row.id}`)}
              emptyMessage={doctorId ? 'No appointments for this doctor on this day.' : 'Select a doctor to see their queue.'}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}
