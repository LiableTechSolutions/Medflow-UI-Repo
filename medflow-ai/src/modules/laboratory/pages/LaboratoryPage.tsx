import { useState } from 'react';
import { DataPage } from '../../../shared/components/DataPage';
import { Badge } from '../../../shared/components/Badge/Badge';
import { Button } from '../../../shared/components/Button/Button';
import { useToast } from '../../../shared/components/Toast/Toast';
import { laboratoryApi } from '../../../core/api/services';
import { ApiError } from '../../../core/api/client';
import { formatDateTime, humanize, statusTone } from '../../../core/utils/format';
import type { LabOrder } from '../../../core/api/types';

const PRIORITY_TONE = { ROUTINE: 'neutral', URGENT: 'amber', STAT: 'coral' } as const;

export default function LaboratoryPage() {
  const { show } = useToast();
  const [version, setVersion] = useState(0);

  async function start(row: LabOrder) {
    try {
      await laboratoryApi.start(row.id);
      show({ title: `${row.testName} moved to processing`, tone: 'success' });
      setVersion((v) => v + 1);
    } catch (cause) {
      show({
        title: 'Could not update the order',
        description: cause instanceof ApiError ? cause.message : undefined,
        tone: 'danger',
      });
    }
  }

  return (
    <DataPage<LabOrder>
      title="Laboratory"
      description="Test orders, the processing queue and signed-off results."
      searchable={false}
      rowKey={(row) => row.id}
      deps={[version]}
      load={({ page, size }) => laboratoryApi.list({ page, size })}
      emptyMessage="The specimen queue is empty."
      columns={[
        { key: 'test', header: 'Test', render: (row) => row.testName },
        { key: 'patient', header: 'Patient', render: (row) => row.patientName },
        { key: 'doctor', header: 'Ordered by', render: (row) => row.doctorName },
        {
          key: 'priority',
          header: 'Priority',
          render: (row) => <Badge tone={PRIORITY_TONE[row.priority]}>{humanize(row.priority)}</Badge>,
        },
        { key: 'ordered', header: 'Ordered', render: (row) => formatDateTime(row.orderedAt) },
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
          key: 'result',
          header: 'Result',
          render: (row) => row.resultSummary ?? '—',
        },
        {
          key: 'action',
          header: '',
          align: 'right',
          render: (row) =>
            row.status === 'ORDERED' ? (
              <Button size="sm" variant="outline" onClick={() => start(row)}>
                Start
              </Button>
            ) : null,
        },
      ]}
    />
  );
}
