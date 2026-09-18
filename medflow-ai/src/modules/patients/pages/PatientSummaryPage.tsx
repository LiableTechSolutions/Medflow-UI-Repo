import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import { PageHeader } from '../../../shared/components/PageHeader/PageHeader';
import { Card, CardBody, CardHeader, CardTitle } from '../../../shared/components/Card/Card';
import { Badge } from '../../../shared/components/Badge/Badge';
import { Button } from '../../../shared/components/Button/Button';
import { Loading } from '../../../shared/components/Loading/Loading';
import { Alert } from '../../../shared/components/Alert/Alert';
import { useToast } from '../../../shared/components/Toast/Toast';
import { useApiResource } from '../../../shared/hooks/useApiResource';
import { HospitalisationRecordForm, type HospitalisationRecordValues } from '../../../shared/components/HospitalisationRecordForm/HospitalisationRecordForm';
import { DailyAnalysisTable, type DailyAnalysisFormValues } from '../../../shared/components/DailyAnalysisTable/DailyAnalysisTable';
import { PatientStatusSummaryGraph, type PatientStatusPoint } from '../../../shared/components/PatientStatusSummaryGraph/PatientStatusSummaryGraph';
import { PatientDetailsEditPanel, type PatientDetailsEditPayload } from '../../../shared/components/PatientDetailsEditPanel/PatientDetailsEditPanel';
import { dailyAnalysisApi, doctorsApi, hospitalisationsApi, patientsApi } from '../../../core/api/services';
import { ApiError } from '../../../core/api/client';
import { formatDate, humanize, statusTone } from '../../../core/utils/format';
import { useAuth } from '../../../core/auth/AuthContext';

export default function PatientSummaryPage() {
  const { id } = useParams<{ id: string }>();
  const patientId = Number(id);
  const navigate = useNavigate();
  const { show } = useToast();
  const { user } = useAuth();

  const { data: summary, error, isLoading, reload } = useApiResource(() => patientsApi.summary(patientId), [patientId]);
  const { data: doctorsPage } = useApiResource(() => doctorsApi.list({ size: 100 }), []);
  const doctorOptions = useMemo(
    () => (doctorsPage?.content ?? []).map((doctor) => ({ value: String(doctor.id), label: `${doctor.fullName} · ${doctor.specialty}` })),
    [doctorsPage],
  );

  const [dischargeSubmitting, setDischargeSubmitting] = useState(false);

  async function addDailyAnalysisEntry(values: DailyAnalysisFormValues) {
    if (!summary?.hospitalisation) throw new Error('There is no active admission to record against.');
    await dailyAnalysisApi.create(patientId, summary.hospitalisation.id, {
      entryDate: values.entryDate,
      bloodPressureSystolic: Number(values.bloodPressureSystolic),
      bloodPressureDiastolic: Number(values.bloodPressureDiastolic),
      pulseRate: Number(values.pulseRate),
      temperature: Number(values.temperature),
      spo2: Number(values.spo2),
      notes: values.notes || undefined,
      recordedBy: values.recordedBy,
    });
    show({ title: 'Daily analysis entry added', tone: 'success' });
    reload();
  }

  async function discharge() {
    if (!summary?.hospitalisation) return;
    setDischargeSubmitting(true);
    try {
      await hospitalisationsApi.discharge(patientId, summary.hospitalisation.id);
      show({ title: 'Patient discharged', tone: 'success' });
      reload();
    } catch (cause) {
      show({
        title: 'Could not discharge this patient',
        description: cause instanceof ApiError ? cause.message : undefined,
        tone: 'danger',
      });
    } finally {
      setDischargeSubmitting(false);
    }
  }

  async function savePatientDetails(payload: PatientDetailsEditPayload) {
    await patientsApi.update(patientId, { ...payload.patient, isHospitalised: payload.isHospitalised });

    if (payload.isHospitalised && !payload.wasHospitalised && payload.hospitalisation) {
      await hospitalisationsApi.admit(patientId, {
        ward: payload.hospitalisation.ward,
        bed: payload.hospitalisation.bed,
        admittingDoctorId: Number(payload.hospitalisation.admittingDoctorId),
        admissionDate: payload.hospitalisation.admissionDate,
      });
    } else if (!payload.isHospitalised && payload.wasHospitalised && summary?.hospitalisation) {
      await hospitalisationsApi.discharge(patientId, summary.hospitalisation.id);
    }

    show({ title: 'Patient details updated', tone: 'success' });
    reload();
  }

  if (isLoading && !summary) return <Loading label="Loading patient summary…" fullHeight />;

  if (error || !summary) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mf-space-5)' }}>
        <PageHeader
          title="Patient summary"
          actions={
            <Button variant="outline" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate('/patients')}>
              Back to patients
            </Button>
          }
        />
        <Alert tone="danger" title="Could not load this patient">
          {error ?? 'This patient record could not be found.'}
          <div style={{ marginTop: 'var(--mf-space-3)' }}>
            <Button size="sm" variant="outline" onClick={reload}>
              Try again
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  const { patient, hospitalisation, dailyAnalyses } = summary;

  const hospitalisationValues: HospitalisationRecordValues = hospitalisation
    ? {
        ward: hospitalisation.ward,
        bed: hospitalisation.bed,
        admittingDoctorId: String(hospitalisation.admittingDoctorId),
        admissionDate: hospitalisation.admissionDate?.slice(0, 10) ?? '',
      }
    : { ward: '', bed: '', admittingDoctorId: '', admissionDate: '' };

  const trendPoints: PatientStatusPoint[] = dailyAnalyses.map((entry) => ({
    date: entry.entryDate,
    bloodPressureSystolic: entry.bloodPressureSystolic,
    bloodPressureDiastolic: entry.bloodPressureDiastolic,
    pulseRate: entry.pulseRate,
    temperature: entry.temperature,
    spo2: entry.spo2,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mf-space-5)' }}>
      <PageHeader
        title={patient.fullName}
        description={`${patient.patientCode} · ${humanize(patient.gender)} · ${patient.age ?? '—'} yrs`}
        actions={
          <div style={{ display: 'flex', gap: 'var(--mf-space-3)' }}>
            <Button variant="outline" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate('/patients')}>
              Back to patients
            </Button>
            {patient.isHospitalised && hospitalisation && (
              <Button variant="danger" leftIcon={<LogOut size={16} />} isLoading={dischargeSubmitting} onClick={discharge}>
                Discharge patient
              </Button>
            )}
          </div>
        }
      />

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
              <dt style={{ fontSize: 'var(--mf-fs-xs)', color: 'var(--mf-ink-400)', marginBottom: 'var(--mf-space-1)' }}>Registered</dt>
              <dd style={{ margin: 0 }}>{formatDate(patient.createdAt)}</dd>
            </div>
            <div>
              <dt style={{ fontSize: 'var(--mf-fs-xs)', color: 'var(--mf-ink-400)', marginBottom: 'var(--mf-space-1)' }}>Status</dt>
              <dd style={{ margin: 0 }}>
                <Badge tone={statusTone(patient.status)} dot>
                  {humanize(patient.status)}
                </Badge>
              </dd>
            </div>
          </dl>
        </CardBody>
      </Card>

      {patient.isHospitalised && hospitalisation && (
        <>
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Admission details</CardTitle>
            </CardHeader>
            <CardBody>
              <HospitalisationRecordForm
                values={hospitalisationValues}
                onChange={() => {}}
                doctorOptions={doctorOptions}
                readOnly
                status={hospitalisation.status}
                admittingDoctorName={hospitalisation.admittingDoctorName}
              />
            </CardBody>
          </Card>

          <Card padding="lg">
            <CardHeader>
              <CardTitle>Vitals trend</CardTitle>
            </CardHeader>
            <CardBody>
              <PatientStatusSummaryGraph points={trendPoints} />
            </CardBody>
          </Card>

          <Card padding="lg">
            <CardBody>
              <DailyAnalysisTable
                entries={dailyAnalyses}
                onAddEntry={addDailyAnalysisEntry}
                defaultRecordedBy={user?.fullName ?? ''}
              />
            </CardBody>
          </Card>
        </>
      )}

      <PatientDetailsEditPanel
        patient={patient}
        hospitalisation={hospitalisation}
        doctorOptions={doctorOptions}
        onSave={savePatientDetails}
      />
    </div>
  );
}
