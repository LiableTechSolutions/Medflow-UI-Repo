import { DataPage } from '../../../shared/components/DataPage';
import { Badge } from '../../../shared/components/Badge/Badge';
import { prescriptionsApi } from '../../../core/api/services';
import { formatDate, humanize, statusTone } from '../../../core/utils/format';
import type { Prescription } from '../../../core/api/types';

export default function PrescriptionsPage() {
  return (
    <DataPage<Prescription>
      title="Prescription Management"
      description="Digitally signed prescriptions and their medication lines."
      searchable={false}
      rowKey={(row) => row.id}
      load={({ page, size }) => prescriptionsApi.list({ page, size })}
      emptyMessage="No prescriptions issued yet."
      columns={[
        { key: 'patient', header: 'Patient', render: (row) => row.patientName },
        { key: 'doctor', header: 'Doctor', render: (row) => row.doctorName },
        { key: 'diagnosis', header: 'Diagnosis', render: (row) => row.diagnosis ?? '—' },
        {
          key: 'medicines',
          header: 'Medicines',
          render: (row) => (
            <span title={row.medicines.map((m) => `${m.medicationName} — ${m.dosage}, ${m.frequency}`).join('\n')}>
              {row.medicines.length === 0
                ? '—'
                : `${row.medicines[0].medicationName}${row.medicines.length > 1 ? ` +${row.medicines.length - 1}` : ''}`}
            </span>
          ),
        },
        { key: 'issued', header: 'Issued', render: (row) => formatDate(row.createdAt) },
        {
          key: 'signed',
          header: 'Signed',
          render: (row) => (
            <Badge tone={row.digitallySigned ? 'green' : 'neutral'}>
              {row.digitallySigned ? 'Signed' : 'Draft'}
            </Badge>
          ),
        },
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
