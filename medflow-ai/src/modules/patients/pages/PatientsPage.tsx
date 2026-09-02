import { useState } from 'react';
import { DataPage } from '../../../shared/components/DataPage';
import { Badge } from '../../../shared/components/Badge/Badge';
import { Avatar } from '../../../shared/components/Avatar/Avatar';
import { patientsApi } from '../../../core/api/services';
import { formatDate, humanize, statusTone } from '../../../core/utils/format';
import type { Patient } from '../../../core/api/types';
import { PatientRegistrationForm } from '../components/PatientRegistrationForm';

export default function PatientsPage() {
  const [refreshToken, setRefreshToken] = useState(0);
  return (
    <div style={{ display: 'grid', gap: 'var(--mf-space-5)' }}>
      <PatientRegistrationForm onCreated={() => setRefreshToken((value) => value + 1)} />
      <DataPage<Patient>
        title="Patient Management"
        description="Registered patients, their contact details and record status."
        searchPlaceholder="Search by name, code, phone or email…"
        rowKey={(row) => row.id}
        load={({ page, size, query }) => patientsApi.list({ page, size, query })}
        deps={[refreshToken]}
        emptyMessage="No patients match this search."
        columns={[
        {
          key: 'name',
          header: 'Patient',
          render: (row) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mf-space-3)' }}>
              <Avatar name={row.fullName} size="sm" />
              <div>
                <div>{row.fullName}</div>
                <small style={{ color: 'var(--mf-text-muted)' }}>{row.patientCode}</small>
              </div>
            </div>
          ),
        },
        {
          key: 'age',
          header: 'Age / Gender',
          render: (row) => `${row.age ?? '—'} · ${humanize(row.gender)}`,
        },
        { key: 'blood', header: 'Blood group', render: (row) => row.bloodGroup ?? '—' },
        { key: 'phone', header: 'Phone', render: (row) => row.phone ?? '—' },
        { key: 'registered', header: 'Registered', render: (row) => formatDate(row.createdAt) },
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
    </div>
  );
}
