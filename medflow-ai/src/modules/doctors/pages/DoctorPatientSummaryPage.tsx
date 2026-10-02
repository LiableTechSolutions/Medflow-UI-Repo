import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '../../../shared/components/PageHeader/PageHeader';
import { Card, CardBody, CardHeader, CardTitle } from '../../../shared/components/Card/Card';
import { Badge } from '../../../shared/components/Badge/Badge';
import { Button } from '../../../shared/components/Button/Button';
import { Loading } from '../../../shared/components/Loading/Loading';
import { Alert } from '../../../shared/components/Alert/Alert';
import { Table, type TableColumn } from '../../../shared/components/Table/Table';
import {
  followUpDateFor,
  PrescriptionPanel,
  type PrescriptionFormValues,
} from '../../../shared/components/PrescriptionPanel/PrescriptionPanel';
import { useToast } from '../../../shared/components/Toast/Toast';
import { useApiResource } from '../../../shared/hooks/useApiResource';
import { doctorsApi, hospitalApi, laboratoryApi, patientsApi, pharmacyApi, prescriptionsApi } from '../../../core/api/services';
import { formatDate, humanize, statusTone } from '../../../core/utils/format';
import { ROUTES } from '../../../core/config/app.config';
import type { LabOrder, MedicalHistoryEntry, PatientReport } from '../../../core/api/types';

/** Doctor-only: a patient's full clinical picture plus the "add prescription" workflow. */
export default function DoctorPatientSummaryPage() {
  const { patientId: patientIdParam } = useParams<{ patientId: string }>();
  const patientId = Number(patientIdParam);
  const navigate = useNavigate();
  const location = useLocation();
  const { show } = useToast();

  // Set by MyPatientsToday when the doctor arrives from their own queue — links the
  // prescription to the visit that brought them here. Absent for a direct/manual lookup.
  const appointmentId = (location.state as { appointmentId?: number } | null)?.appointmentId;

  const me = useApiResource(() => doctorsApi.me(), []);
  const hospital = useApiResource(() => hospitalApi.profile(), []);
  const summary = useApiResource(() => patientsApi.summary(patientId), [patientId]);
  const history = useApiResource(() => patientsApi.medicalHistory(patientId), [patientId]);
  const reports = useApiResource(() => patientsApi.reports(patientId), [patientId]);
  const labOrders = useApiResource(() => laboratoryApi.list({ patientId, size: 50 }), [patientId]);
  const prescriptions = useApiResource(() => prescriptionsApi.list({ patientId, size: 50 }), [patientId]);

  async function loadMedicineOptions() {
    const page = await pharmacyApi.list({ size: 200 });
    return page.content.map((medication) => medication.name);
  }

  async function addPrescription(values: PrescriptionFormValues) {
    if (!me.data) throw new Error('Could not resolve your doctor profile');
    await prescriptionsApi.create({
      patientId,
      doctorId: me.data.id,
      appointmentId,
      diagnosis: values.diagnosis || undefined,
      digitallySigned: values.digitallySigned,
      followUpDate: followUpDateFor(values.followUp) ?? undefined,
      medicines: values.medicines.map((row) => ({
        medicationName: row.medicationName,
        dosage: row.dosage,
        frequency: row.frequency,
        durationDays: row.durationDays ? Number(row.durationDays) : undefined,
        instructions: row.instructions || undefined,
      })),
    });
    show({ title: 'Prescription saved', tone: 'success' });
    prescriptions.reload();
  }

  const historyColumns: TableColumn<MedicalHistoryEntry>[] = [
    { key: 'date', header: 'Recorded', render: (row) => formatDate(row.recordedAt) },
    { key: 'condition', header: 'Condition', render: (row) => row.conditionName },
    { key: 'notes', header: 'Notes', render: (row) => row.notes || '—' },
  ];

  const reportColumns: TableColumn<PatientReport>[] = [
    { key: 'date', header: 'Uploaded', render: (row) => formatDate(row.uploadedAt) },
    { key: 'type', header: 'Type', render: (row) => humanize(row.reportType) },
    {
      key: 'file',
      header: 'File',
      render: (row) => (
        <a href={row.fileUrl} target="_blank" rel="noreferrer">
          View
        </a>
      ),
    },
  ];

  const labColumns: TableColumn<LabOrder>[] = [
    { key: 'date', header: 'Ordered', render: (row) => formatDate(row.orderedAt) },
    { key: 'test', header: 'Test', render: (row) => row.testName },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge tone={statusTone(row.status)} dot>
          {humanize(row.status)}
        </Badge>
      ),
    },
    { key: 'result', header: 'Result', render: (row) => row.resultSummary || '—' },
  ];

  if (summary.isLoading && !summary.data) return <Loading label="Loading patient…" fullHeight />;

  if (summary.error || !summary.data) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mf-space-5)' }}>
        <PageHeader
          title="Patient summary"
          actions={
            <Button variant="outline" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate(ROUTES.dashboard)}>
              Back to dashboard
            </Button>
          }
        />
        <Alert tone="danger" title="Could not load this patient">
          {summary.error ?? 'This patient record could not be found.'}
          <div style={{ marginTop: 'var(--mf-space-3)' }}>
            <Button size="sm" variant="outline" onClick={summary.reload}>
              Try again
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  const { patient } = summary.data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mf-space-5)' }}>
      <PageHeader
        title={patient.fullName}
        description={`${patient.patientCode} · ${humanize(patient.gender)} · ${patient.age ?? '—'} yrs`}
        actions={
          <Button variant="outline" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate(ROUTES.dashboard)}>
            Back to dashboard
          </Button>
        }
      />

      {me.error && (
        <Alert tone="danger" title="Could not resolve your doctor profile">
          This account doesn't have a linked doctor profile, so prescriptions can't be written from here.
        </Alert>
      )}

      <Card padding="lg">
        <CardHeader>
          <CardTitle>{patient.isHospitalised ? 'Inpatient (hospitalised)' : 'Outpatient (OPD)'}</CardTitle>
          <Badge tone={patient.isHospitalised ? 'amber' : 'green'} dot>
            {patient.isHospitalised ? 'Hospitalised' : 'OPD'}
          </Badge>
        </CardHeader>
        <CardBody>
          <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--mf-space-4)', margin: 0 }}>
            <div>
              <dt style={{ fontSize: 'var(--mf-fs-xs)', color: 'var(--mf-ink-400)', marginBottom: 'var(--mf-space-1)' }}>Phone</dt>
              <dd style={{ margin: 0 }}>{patient.phone ?? '—'}</dd>
            </div>
            <div>
              <dt style={{ fontSize: 'var(--mf-fs-xs)', color: 'var(--mf-ink-400)', marginBottom: 'var(--mf-space-1)' }}>Blood group</dt>
              <dd style={{ margin: 0 }}>{patient.bloodGroup ?? '—'}</dd>
            </div>
            <div>
              <dt style={{ fontSize: 'var(--mf-fs-xs)', color: 'var(--mf-ink-400)', marginBottom: 'var(--mf-space-1)' }}>Allergies</dt>
              <dd style={{ margin: 0 }}>{patient.allergies || '—'}</dd>
            </div>
            <div>
              <dt style={{ fontSize: 'var(--mf-fs-xs)', color: 'var(--mf-ink-400)', marginBottom: 'var(--mf-space-1)' }}>Registered</dt>
              <dd style={{ margin: 0 }}>{formatDate(patient.createdAt)}</dd>
            </div>
          </dl>
        </CardBody>
      </Card>

      <Card padding="lg">
        <CardHeader>
          <CardTitle>Medical history</CardTitle>
        </CardHeader>
        <CardBody>
          {history.error && (
            <Alert tone="danger" title="Could not load medical history">
              {history.error}
            </Alert>
          )}
          {history.isLoading && !history.data ? (
            <Loading label="Loading medical history…" />
          ) : (
            <Table columns={historyColumns} data={history.data ?? []} rowKey={(row) => row.id} emptyMessage="No conditions recorded yet." />
          )}
        </CardBody>
      </Card>

      <Card padding="lg">
        <CardHeader>
          <CardTitle>Reports</CardTitle>
        </CardHeader>
        <CardBody>
          {reports.error && (
            <Alert tone="danger" title="Could not load reports">
              {reports.error}
            </Alert>
          )}
          {reports.isLoading && !reports.data ? (
            <Loading label="Loading reports…" />
          ) : (
            <Table columns={reportColumns} data={reports.data ?? []} rowKey={(row) => row.id} emptyMessage="No reports uploaded yet." />
          )}
        </CardBody>
      </Card>

      <Card padding="lg">
        <CardHeader>
          <CardTitle>Lab orders</CardTitle>
        </CardHeader>
        <CardBody>
          {labOrders.error && (
            <Alert tone="danger" title="Could not load lab orders">
              {labOrders.error}
            </Alert>
          )}
          {labOrders.isLoading && !labOrders.data ? (
            <Loading label="Loading lab orders…" />
          ) : (
            <Table
              columns={labColumns}
              data={labOrders.data?.content ?? []}
              rowKey={(row) => row.id}
              emptyMessage="No lab orders for this patient yet."
            />
          )}
        </CardBody>
      </Card>

      <Card padding="lg">
        <CardBody>
          <PrescriptionPanel
            prescriptions={prescriptions.data?.content ?? []}
            isLoading={prescriptions.isLoading && !prescriptions.data}
            error={prescriptions.error ?? undefined}
            onAddPrescription={me.data ? addPrescription : undefined}
            loadMedicineOptions={loadMedicineOptions}
            hospitalName={hospital.data?.name ?? null}
          />
        </CardBody>
      </Card>
    </div>
  );
}
