import { DataPage } from '../../../shared/components/DataPage';
import { Badge } from '../../../shared/components/Badge/Badge';
import { Avatar } from '../../../shared/components/Avatar/Avatar';
import { doctorsApi } from '../../../core/api/services';
import { formatMoney, humanize, statusTone } from '../../../core/utils/format';
import type { Doctor } from '../../../core/api/types';

export default function DoctorsPage() {
  return (
    <DataPage<Doctor>
      title="Doctor Management"
      description="Every doctor on staff, their credentials and consulting fee."
      searchPlaceholder="Search by name, code or specialty…"
      rowKey={(row) => row.id}
      load={({ page, size, query }) => doctorsApi.list({ page, size, query })}
      emptyMessage="No doctors match this search."
      columns={[
        {
          key: 'name',
          header: 'Doctor',
          render: (row) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mf-space-3)' }}>
              <Avatar name={row.fullName} size="sm" />
              <div>
                <div>{row.fullName}</div>
                <small style={{ color: 'var(--mf-text-muted)' }}>{row.doctorCode}</small>
              </div>
            </div>
          ),
        },
        { key: 'specialty', header: 'Specialty', render: (row) => row.specialty },
        { key: 'qualification', header: 'Qualification', render: (row) => row.qualification ?? '—' },
        {
          key: 'experience',
          header: 'Experience',
          render: (row) => `${row.yearsOfExperience} yrs`,
        },
        { key: 'fee', header: 'Fee', align: 'right', render: (row) => formatMoney(row.consultationFee) },
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
