import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '../../../shared/components/PageHeader/PageHeader';
import { Card, CardBody } from '../../../shared/components/Card/Card';
import { Button } from '../../../shared/components/Button/Button';
import { Loading } from '../../../shared/components/Loading/Loading';
import { Alert } from '../../../shared/components/Alert/Alert';
import { QueueStatus } from '../../../shared/components/QueueStatus/QueueStatus';
import { useApiResource } from '../../../shared/hooks/useApiResource';
import { appointmentsApi } from '../../../core/api/services';

const POLL_INTERVAL_MS = 20_000;

export default function AppointmentQueuePage() {
  const { id } = useParams<{ id: string }>();
  const appointmentId = Number(id);
  const navigate = useNavigate();
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date>();

  const { data, error, isLoading, reload } = useApiResource(
    () => Promise.all([appointmentsApi.get(appointmentId), appointmentsApi.queueStatus(appointmentId)]),
    [appointmentId],
  );

  useEffect(() => {
    if (data) setLastUpdatedAt(new Date());
  }, [data]);

  useEffect(() => {
    const timer = setInterval(reload, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mf-space-5)', maxWidth: 480, margin: '0 auto' }}>
      <PageHeader
        title="Live queue"
        actions={
          <Button variant="outline" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate('/appointments')}>
            Back to appointments
          </Button>
        }
      />

      {isLoading && !data ? (
        <Loading label="Loading queue status…" fullHeight />
      ) : error || !data ? (
        <Alert tone="danger" title="Could not load this appointment's queue status">
          {error ?? 'This appointment could not be found.'}
          <div style={{ marginTop: 'var(--mf-space-3)' }}>
            <Button size="sm" variant="outline" onClick={reload}>
              Try again
            </Button>
          </div>
        </Alert>
      ) : (
        <Card padding="lg">
          <CardBody>
            <QueueStatus
              queue={data[1]}
              doctorName={`${data[0].doctorName}${data[0].doctorSpecialty ? ` · ${data[0].doctorSpecialty}` : ''}`}
              scheduledAt={data[0].scheduledAt}
              lastUpdatedAt={lastUpdatedAt}
            />
          </CardBody>
        </Card>
      )}
    </div>
  );
}
