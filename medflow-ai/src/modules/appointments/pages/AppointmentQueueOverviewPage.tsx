import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { DataPage } from '../../../shared/components/DataPage';
import { Badge } from '../../../shared/components/Badge/Badge';
import { Button } from '../../../shared/components/Button/Button';
import { Select } from '../../../shared/components/Select/Select';
import { Input } from '../../../shared/components/Input/Input';
import { appointmentsApi, doctorsApi } from '../../../core/api/services';
import { formatTime, humanize, statusTone } from '../../../core/utils/format';
import { todayDateOnly } from '../../../core/utils/validation';
import type { Appointment } from '../../../core/api/types';

const POLL_INTERVAL_MS = 20_000;

/**
 * The waiting-room board: every appointment for one doctor on one day, in queue order,
 * refreshing live. This is the "who's in the queue" view; /queue/:id (one appointment's
 * own position) is a different, more focused page for a single patient.
 */
export default function AppointmentQueueOverviewPage() {
  const { hospitalCode } = useParams<{ hospitalCode: string }>();
  const navigate = useNavigate();
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState(todayDateOnly());
  const [doctorOptions, setDoctorOptions] = useState<{ value: string; label: string }[]>([]);
  const [version, setVersion] = useState(0);

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

  return (
    <DataPage<Appointment>
      title="Queue board"
      description="Every appointment for the selected doctor and day, in queue order — refreshes automatically."
      searchable={false}
      rowKey={(row) => row.id}
      deps={[doctorId, date, version]}
      load={({ page, size }) =>
        doctorId
          ? appointmentsApi.list({ page, size, doctorId: Number(doctorId), date })
          : Promise.resolve({ content: [], page: 0, size, totalElements: 0, totalPages: 0 })
      }
      emptyMessage={doctorId ? 'No appointments for this doctor on this day.' : 'Select a doctor to see their queue.'}
      onRowClick={(row) => navigate(`/appointments/${hospitalCode}/queue/${row.id}`)}
      actions={
        <Button variant="outline" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate('/appointments')}>
          Back to appointments
        </Button>
      }
      toolbar={
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
      }
      columns={[
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
      ]}
    />
  );
}
