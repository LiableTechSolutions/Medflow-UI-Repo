import { useState } from 'react';
import { DataPage } from '../../../shared/components/DataPage';
import { Badge } from '../../../shared/components/Badge/Badge';
import { Checkbox } from '../../../shared/components/Checkbox/Checkbox';
import { Select } from '../../../shared/components/Select/Select';
import { PrescriptionDetailModal } from '../../../shared/components/PrescriptionDetailModal/PrescriptionDetailModal';
import { hospitalApi, prescriptionsApi } from '../../../core/api/services';
import { useApiResource } from '../../../shared/hooks/useApiResource';
import { formatDate, humanize, statusTone } from '../../../core/utils/format';
import { todayDateOnly } from '../../../core/utils/validation';
import type { Prescription } from '../../../core/api/types';

const STATUSES = [
  { value: '', label: 'All statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function PrescriptionsPage() {
  // Defaults to today's prescriptions — staff mostly care about what was just issued;
  // unchecking widens to the full history.
  const [todayOnly, setTodayOnly] = useState(true);
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<Prescription | null>(null);
  const hospital = useApiResource(() => hospitalApi.profile(), []);

  return (
    <>
      <DataPage<Prescription>
        title="Prescription Management"
        description="Digitally signed prescriptions and their medication lines. Click a row to view, print or download."
        searchPlaceholder="Search patient, doctor or diagnosis…"
        toolbar={
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mf-space-4)' }}>
            <Checkbox
              label="Today only"
              checked={todayOnly}
              onChange={(event) => setTodayOnly(event.target.checked)}
            />
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
        deps={[todayOnly, status]}
        rowKey={(row) => row.id}
        onRowClick={setSelected}
        load={({ page, size, query }) =>
          prescriptionsApi.list({
            page,
            size,
            query: query || undefined,
            status: status || undefined,
            issuedOn: todayOnly ? todayDateOnly() : undefined,
          })
        }
        emptyMessage={todayOnly ? 'No prescriptions issued today.' : 'No prescriptions issued yet.'}
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

      <PrescriptionDetailModal
        prescription={selected}
        hospitalName={hospital.data?.name ?? null}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
