import { type FormEvent, useState } from 'react';
import { Pencil } from 'lucide-react';
import { Alert } from '../Alert/Alert';
import { Button } from '../Button/Button';
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from '../Card/Card';
import { Input } from '../Input/Input';
import { Select } from '../Select/Select';
import { HospitalisedCheckbox } from '../HospitalisedCheckbox/HospitalisedCheckbox';
import { HospitalisationRecordForm, type DoctorOption, type HospitalisationRecordValues } from '../HospitalisationRecordForm/HospitalisationRecordForm';
import type { HospitalisationRecord, Patient } from '../../../core/api/types';
import './PatientDetailsEditPanel.css';

const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((value) => ({ value, label: value }));

interface PatientCoreValues {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  bloodGroup: string;
  allergies: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  insuranceProvider: string;
  memberId: string;
  referringPhysician: string;
}

function coreValuesFromPatient(patient: Patient): PatientCoreValues {
  return {
    firstName: patient.firstName ?? '',
    lastName: patient.lastName ?? '',
    phone: patient.phone ?? '',
    email: patient.email ?? '',
    address: patient.address ?? '',
    city: patient.city ?? '',
    state: patient.state ?? '',
    postalCode: patient.postalCode ?? '',
    bloodGroup: patient.bloodGroup ?? '',
    allergies: patient.allergies ?? '',
    emergencyContactName: patient.emergencyContactName ?? '',
    emergencyContactPhone: patient.emergencyContactPhone ?? '',
    insuranceProvider: patient.insuranceProvider ?? '',
    memberId: patient.memberId ?? '',
    referringPhysician: patient.referringPhysician ?? '',
  };
}

function hospitalisationValuesFrom(record?: HospitalisationRecord): HospitalisationRecordValues {
  return record
    ? {
        ward: record.ward,
        bed: record.bed,
        admittingDoctorId: String(record.admittingDoctorId),
        admissionDate: record.admissionDate?.slice(0, 10) ?? '',
      }
    : { ward: '', bed: '', admittingDoctorId: '', admissionDate: new Date().toISOString().slice(0, 10) };
}

/** Core (non-identifying) patient fields this panel can edit. */
export interface PatientDetailsEditValues {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  bloodGroup?: string;
  allergies?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  insuranceProvider?: string;
  memberId?: string;
  referringPhysician?: string;
}

/** What the panel hands back to its caller on save — the caller owns the actual API calls. */
export interface PatientDetailsEditPayload {
  patient: PatientDetailsEditValues;
  wasHospitalised: boolean;
  isHospitalised: boolean;
  /** Present when `isHospitalised` is true (either continuing or a brand-new admission). */
  hospitalisation?: HospitalisationRecordValues;
}

interface PatientDetailsEditPanelProps {
  patient: Patient;
  hospitalisation?: HospitalisationRecord;
  doctorOptions: DoctorOption[];
  isLoadingDoctors?: boolean;
  /** Persists the change (update / admit / discharge as needed). Throw to keep the panel in edit mode with an error. */
  onSave: (payload: PatientDetailsEditPayload) => Promise<void> | void;
}

/**
 * Lets staff edit a patient's existing details — and admit/discharge them — without
 * leaving the patient summary page. Shown for both OPD and hospitalised patients.
 * Purely presentational: it never calls the API itself, it hands the new values to
 * `onSave` and lets the page decide which endpoints to call.
 */
export function PatientDetailsEditPanel({
  patient,
  hospitalisation,
  doctorOptions,
  isLoadingDoctors = false,
  onSave,
}: PatientDetailsEditPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState<PatientCoreValues>(() => coreValuesFromPatient(patient));
  const [isHospitalised, setIsHospitalised] = useState(patient.isHospitalised);
  const [hospitalisationValues, setHospitalisationValues] = useState<HospitalisationRecordValues>(() =>
    hospitalisationValuesFrom(hospitalisation),
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEditing() {
    setValues(coreValuesFromPatient(patient));
    setIsHospitalised(patient.isHospitalised);
    setHospitalisationValues(hospitalisationValuesFrom(hospitalisation));
    setError(null);
    setIsEditing(true);
  }

  function setField<K extends keyof PatientCoreValues>(key: K, value: PatientCoreValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSave({
        patient: {
          firstName: values.firstName || undefined,
          lastName: values.lastName || undefined,
          phone: values.phone || undefined,
          email: values.email || undefined,
          address: values.address || undefined,
          city: values.city || undefined,
          state: values.state || undefined,
          postalCode: values.postalCode || undefined,
          bloodGroup: values.bloodGroup || undefined,
          allergies: values.allergies || undefined,
          emergencyContactName: values.emergencyContactName || undefined,
          emergencyContactPhone: values.emergencyContactPhone || undefined,
          insuranceProvider: values.insuranceProvider || undefined,
          memberId: values.memberId || undefined,
          referringPhysician: values.referringPhysician || undefined,
        },
        wasHospitalised: patient.isHospitalised,
        isHospitalised,
        hospitalisation: isHospitalised ? hospitalisationValues : undefined,
      });
      setIsEditing(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save these changes');
    } finally {
      setSubmitting(false);
    }
  }

  if (!isEditing) {
    return (
      <Card padding="lg">
        <CardHeader>
          <CardTitle>Patient details</CardTitle>
          <Button size="sm" variant="outline" leftIcon={<Pencil size={14} />} onClick={startEditing}>
            Edit details
          </Button>
        </CardHeader>
        <CardBody>
          <dl className="mf-patient-edit__summary">
            <div>
              <dt>Phone</dt>
              <dd>{patient.phone ?? '—'}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{patient.email ?? '—'}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{[patient.address, patient.city, patient.state, patient.postalCode].filter(Boolean).join(', ') || '—'}</dd>
            </div>
            <div>
              <dt>Blood group</dt>
              <dd>{patient.bloodGroup ?? '—'}</dd>
            </div>
            <div>
              <dt>Allergies</dt>
              <dd>{patient.allergies ?? '—'}</dd>
            </div>
            <div>
              <dt>Emergency contact</dt>
              <dd>
                {patient.emergencyContactName
                  ? `${patient.emergencyContactName}${patient.emergencyContactPhone ? ` · ${patient.emergencyContactPhone}` : ''}`
                  : '—'}
              </dd>
            </div>
            <div>
              <dt>Insurance</dt>
              <dd>{patient.insuranceProvider ?? '—'}</dd>
            </div>
            <div>
              <dt>Referring physician</dt>
              <dd>{patient.referringPhysician ?? '—'}</dd>
            </div>
          </dl>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Edit patient details</CardTitle>
      </CardHeader>
      <CardBody>
        {error && (
          <Alert tone="danger" title="Could not save these changes">
            {error}
          </Alert>
        )}
        <form id="patient-edit-form" onSubmit={save} className="mf-patient-edit__form">
          <div className="mf-patient-edit__grid">
            <Input label="First name" value={values.firstName} onChange={(e) => setField('firstName', e.target.value)} />
            <Input label="Last name" value={values.lastName} onChange={(e) => setField('lastName', e.target.value)} />
            <Input label="Phone" type="tel" value={values.phone} onChange={(e) => setField('phone', e.target.value)} />
            <Input label="Email" type="email" value={values.email} onChange={(e) => setField('email', e.target.value)} />
            <Input label="Address" value={values.address} onChange={(e) => setField('address', e.target.value)} />
            <Input label="City" value={values.city} onChange={(e) => setField('city', e.target.value)} />
            <Input label="State" value={values.state} onChange={(e) => setField('state', e.target.value)} />
            <Input label="Postal code" value={values.postalCode} onChange={(e) => setField('postalCode', e.target.value)} />
            <Select
              label="Blood group"
              value={values.bloodGroup}
              options={bloodGroupOptions}
              placeholder="Select"
              onChange={(e) => setField('bloodGroup', e.target.value)}
            />
            <Input label="Allergies" value={values.allergies} onChange={(e) => setField('allergies', e.target.value)} />
            <Input
              label="Emergency contact name"
              value={values.emergencyContactName}
              onChange={(e) => setField('emergencyContactName', e.target.value)}
            />
            <Input
              label="Emergency contact phone"
              type="tel"
              value={values.emergencyContactPhone}
              onChange={(e) => setField('emergencyContactPhone', e.target.value)}
            />
            <Input
              label="Insurance provider"
              value={values.insuranceProvider}
              onChange={(e) => setField('insuranceProvider', e.target.value)}
            />
            <Input label="Member ID" value={values.memberId} onChange={(e) => setField('memberId', e.target.value)} />
            <Input
              label="Referring physician"
              value={values.referringPhysician}
              onChange={(e) => setField('referringPhysician', e.target.value)}
            />
          </div>

          <div className="mf-patient-edit__hospitalisation">
            <HospitalisedCheckbox checked={isHospitalised} onChange={setIsHospitalised} />
            {isHospitalised && (
              <HospitalisationRecordForm
                values={hospitalisationValues}
                onChange={setHospitalisationValues}
                doctorOptions={doctorOptions}
                isLoadingDoctors={isLoadingDoctors}
              />
            )}
          </div>
        </form>
      </CardBody>
      <CardFooter>
        <Button variant="ghost" onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
        <Button type="submit" form="patient-edit-form" isLoading={submitting}>
          Save changes
        </Button>
      </CardFooter>
    </Card>
  );
}
