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
import { PatientBedCard } from '../../../shared/components/PatientBedCard/PatientBedCard';
import { useAuth } from '../../../core/auth/AuthContext';
import { useApiResource } from '../../../shared/hooks/useApiResource';
import { HospitalisationRecordForm, type HospitalisationRecordValues } from '../../../shared/components/HospitalisationRecordForm/HospitalisationRecordForm';
import { DailyAnalysisTable, type DailyAnalysisFormValues } from '../../../shared/components/DailyAnalysisTable/DailyAnalysisTable';
import { PatientStatusSummaryGraph, type PatientStatusPoint } from '../../../shared/components/PatientStatusSummaryGraph/PatientStatusSummaryGraph';
import {
  PatientDetailsEditPanel,
  type PatientDetailsEditPayload,
  type PatientDetailsEditValues,
} from '../../../shared/components/PatientDetailsEditPanel/PatientDetailsEditPanel';
import { dailyAnalysisApi, doctorsApi, hospitalisationsApi, patientsApi } from '../../../core/api/services';
import { ApiError } from '../../../core/api/client';
import { formatDate, humanize, statusTone, toIsoInstant } from '../../../core/utils/format';
import type { Patient } from '../../../core/api/types';

/**
 * `PUT /patients/:id` replaces the whole profile in one shot, but the edit panel only
 * collects a subset of fields (and never `isHospitalised`, which isn't part of that
 * request at all — it's derived from admit/discharge). Build the request from the
 * patient's current values first, so anything the panel doesn't show (date of birth,
 * gender, ...) survives instead of being wiped to null and tripping the hospital's
 * "required field" checks on the way back in.
 */
function buildPatientUpdatePayload(patient: Patient, edits: PatientDetailsEditValues) {
  return {
    firstName: edits.firstName ?? patient.firstName,
    lastName: edits.lastName ?? patient.lastName,
    gender: patient.gender,
    dateOfBirth: patient.dateOfBirth,
    bloodGroup: edits.bloodGroup ?? patient.bloodGroup,
    phone: edits.phone ?? patient.phone,
    email: edits.email ?? patient.email,
    address: edits.address ?? patient.address,
    emergencyContactName: edits.emergencyContactName ?? patient.emergencyContactName,
    emergencyContactPhone: edits.emergencyContactPhone ?? patient.emergencyContactPhone,
    status: patient.status,
    city: edits.city ?? patient.city,
    state: edits.state ?? patient.state,
    postalCode: edits.postalCode ?? patient.postalCode,
    preferredLanguage: patient.preferredLanguage,
    emergencyContactRelationship: patient.emergencyContactRelationship,
    insuranceProvider: edits.insuranceProvider ?? patient.insuranceProvider,
    memberId: edits.memberId ?? patient.memberId,
    governmentIdType: patient.governmentIdType,
    governmentIdNumber: patient.governmentIdNumber,
    allergies: edits.allergies ?? patient.allergies,
    consentStatus: patient.consentStatus,
    referringPhysician: edits.referringPhysician ?? patient.referringPhysician,
    guardianName: patient.guardianName,
    guardianRelationship: patient.guardianRelationship,
    guardianMobile: patient.guardianMobile,
  };
}

export default function PatientSummaryPage() {
  const { id } = useParams<{ id: string }>();
  const patientId = Number(id);
  const navigate = useNavigate();
  const { show } = useToast();
  const { user } = useAuth();
  const canManageBed = user?.roleCode === 'ADMIN' || user?.roleCode === 'NURSE';

  const { data: summary, error, isLoading, reload } = useApiResource(() => patientsApi.summary(patientId), [patientId]);
  const { data: doctorsPage } = useApiResource(() => doctorsApi.list({ size: 100 }), []);
  const doctorOptions = useMemo(
    () => (doctorsPage?.content ?? []).map((doctor) => ({ value: String(doctor.id), label: `${doctor.fullName} · ${doctor.specialty}` })),
    [doctorsPage],
  );

  const [dischargeSubmitting, setDischargeSubmitting] = useState(false);

  async function addDailyAnalysisEntry(values: DailyAnalysisFormValues) {
    if (!summary?.hospitalisation) throw new Error('There is no active admission to record against.');
    await dailyAnalysisApi.create(patientId, {
      recordedByDoctorId: Number(values.recordedByDoctorId),
      bloodPressure: `${values.bloodPressureSystolic}/${values.bloodPressureDiastolic}`,
      pulse: Number(values.pulseRate),
      temperature: Number(values.temperature),
      spo2: Number(values.spo2),
      notes: values.notes || undefined,
    });
    show({ title: 'Daily analysis entry added', tone: 'success' });
    reload();
  }

  async function discharge() {
    if (!summary?.hospitalisation) return;
    setDischargeSubmitting(true);
    try {
      await hospitalisationsApi.discharge(patientId);
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
    if (!summary) return;
    // Note: `isHospitalised` is never part of this call — `UpdatePatientRequest` has no
    // such field (it's derived from admit/discharge), and sending it was rejected
    // outright as an unrecognised property ("Malformed request body").
    await patientsApi.update(patientId, buildPatientUpdatePayload(summary.patient, payload.patient));

    if (payload.isHospitalised && !payload.wasHospitalised && payload.hospitalisation) {
      await hospitalisationsApi.admit(patientId, {
        ward: payload.hospitalisation.ward,
        bed: payload.hospitalisation.bed,
        admittingDoctorId: Number(payload.hospitalisation.admittingDoctorId),
        admissionDate: toIsoInstant(payload.hospitalisation.admissionDate),
      });
    } else if (!payload.isHospitalised && payload.wasHospitalised && summary.hospitalisation) {
      await hospitalisationsApi.discharge(patientId);
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
        bed: hospitalisation.bed ?? '',
        admittingDoctorId: String(hospitalisation.admittingDoctorId),
        admissionDate: hospitalisation.admissionDate?.slice(0, 10) ?? '',
      }
    : { ward: '', bed: '', admittingDoctorId: '', admissionDate: '' };

  const trendPoints: PatientStatusPoint[] = dailyAnalyses.map((entry) => {
    const [systolic, diastolic] = (entry.bloodPressure ?? '').split('/').map((part) => Number(part.trim()));
    return {
      date: entry.recordedAt,
      bloodPressureSystolic: systolic || 0,
      bloodPressureDiastolic: diastolic || 0,
      pulseRate: entry.pulse ?? 0,
      temperature: entry.temperature ?? 0,
      spo2: entry.spo2 ?? 0,
    };
  });

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

      <PatientBedCard patientId={patientId} canManage={canManageBed} stayKey={patient.isHospitalised} />

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
                doctorOptions={doctorOptions}
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
