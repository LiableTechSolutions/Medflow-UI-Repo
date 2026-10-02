import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, CardSubtitle, CardTitle } from '../../../shared/components/Card/Card';
import { Badge } from '../../../shared/components/Badge/Badge';
import { Alert } from '../../../shared/components/Alert/Alert';
import { Loading } from '../../../shared/components/Loading/Loading';
import { Table, type TableColumn } from '../../../shared/components/Table/Table';
import { useApiResource } from '../../../shared/hooks/useApiResource';
import { appointmentsApi, doctorsApi } from '../../../core/api/services';
import { formatTime, humanize, statusTone } from '../../../core/utils/format';
import { todayDateOnly } from '../../../core/utils/validation';
import type { Appointment, AppointmentStatus } from '../../../core/api/types';

const ACTIVE_STATUSES: AppointmentStatus[] = ['CHECKED_IN', 'IN_CONSULTATION'];

/**
 * Doctor-only dashboard panel: today's patients who are checked in or already with the
 * doctor. Clicking one opens their clinical summary + add-prescription workflow,
 * carrying the appointment id so the prescription can be linked to this visit.
 */
export function MyPatientsToday() {
  const navigate = useNavigate();
  const me = useApiResource(() => doctorsApi.me(), []);

  const appointments = useApiResource(
    () =>
      me.data
        ? appointmentsApi.list({ doctorId: me.data.id, date: todayDateOnly(), size: 50 })
        : Promise.resolve(null),
    [me.data?.id],
  );

  if (me.error) {
    return (
      <Card padding="lg">
        <CardHeader>
          <CardTitle>My patients today</CardTitle>
        </CardHeader>
        <CardBody>
          <Alert tone="warning" title="No doctor profile linked">
            This account isn't linked to a doctor profile, so today's patient list can't be shown.
          </Alert>
        </CardBody>
      </Card>
    );
  }

  const myPatients = (appointments.data?.content ?? []).filter((row) => ACTIVE_STATUSES.includes(row.status));

  const columns: TableColumn<Appointment>[] = [
    { key: 'patient', header: 'Patient', render: (row) => row.patientName },
    { key: 'time', header: 'Time', render: (row) => formatTime(row.scheduledAt) },
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
    <Card padding="lg">
      <CardHeader>
        <div>
          <CardTitle>My patients today</CardTitle>
          <CardSubtitle>Checked in or in consultation — click one to view and prescribe</CardSubtitle>
        </div>
      </CardHeader>
      <CardBody>
        {me.isLoading || (appointments.isLoading && !appointments.data) ? (
          <Loading label="Loading your patients…" />
        ) : (
          <Table
            columns={columns}
            data={myPatients}
            rowKey={(row) => row.id}
            onRowClick={(row) =>
              navigate(`/doctor/patients/${row.patientId}`, { state: { appointmentId: row.id } })
            }
            emptyMessage="No checked-in patients right now."
          />
        )}
      </CardBody>
    </Card>
  );
}
