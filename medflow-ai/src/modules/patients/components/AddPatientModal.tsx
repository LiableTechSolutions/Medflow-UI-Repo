import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../../../shared/components/Modal/Modal';
import { Button } from '../../../shared/components/Button/Button';
import { Input } from '../../../shared/components/Input/Input';
import { Select } from '../../../shared/components/Select/Select';
import { Loading } from '../../../shared/components/Loading/Loading';
import { Alert } from '../../../shared/components/Alert/Alert';
import { useToast } from '../../../shared/components/Toast/Toast';
import { SearchableSelect } from '../../../shared/components/SearchableSelect/SearchableSelect';
import { HospitalisedCheckbox } from '../../../shared/components/HospitalisedCheckbox/HospitalisedCheckbox';
import {
  HospitalisationRecordForm,
  type DoctorOption,
  type HospitalisationRecordValues,
} from '../../../shared/components/HospitalisationRecordForm/HospitalisationRecordForm';
import { ApiError } from '../../../core/api/client';
import { doctorsApi, geoApi, patientsApi, settingsApi } from '../../../core/api/services';
import type { Patient } from '../../../core/api/types';
import type { PatientRegistrationField } from '../../settings/types/patientRegistrationProfile';
import { validators } from '../../../core/utils/validation';
import { toIsoInstant } from '../../../core/utils/format';

const emptyHospitalisationValues = (): HospitalisationRecordValues => ({
  ward: '',
  bed: '',
  admittingDoctorId: '',
  admissionDate: new Date().toISOString().slice(0, 10),
});

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (patient: Patient) => void;
}

type FormValues = Record<string, string>;

const genderOptions = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];
const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((value) => ({ value, label: value }));
const governmentIdOptions = ['Aadhaar', 'PAN', 'Passport', 'Voter ID', 'Driving Licence'].map((value) => ({ value, label: value }));
const consentOptions = ['PENDING', 'GRANTED', 'DECLINED'].map((value) => ({ value, label: value }));
const relationshipOptions = ['Parent', 'Guardian', 'Spouse', 'Child', 'Caretaker', 'Other'].map((value) => ({ value, label: value }));

const keyToInput: Record<string, string> = {
  FULL_NAME: 'fullName',
  DATE_OF_BIRTH: 'dateOfBirth',
  GENDER: 'gender',
  MOBILE: 'phone',
  EMAIL: 'email',
  ADDRESS: 'address',
  CITY: 'city',
  STATE: 'state',
  POSTAL_CODE: 'postalCode',
  PREFERRED_LANGUAGE: 'preferredLanguage',
  EMERGENCY_CONTACT_RELATIONSHIP: 'emergencyContactRelationship',
  BLOOD_GROUP: 'bloodGroup',
  INSURANCE_PROVIDER: 'insuranceProvider',
  MEMBER_ID: 'memberId',
  GOVERNMENT_ID_TYPE: 'governmentIdType',
  GOVERNMENT_ID_NUMBER: 'governmentIdNumber',
  ALLERGIES: 'allergies',
  CONSENT_STATUS: 'consentStatus',
  REFERRING_PHYSICIAN: 'referringPhysician',
  EMERGENCY_CONTACT_NAME: 'emergencyContactName',
  EMERGENCY_CONTACT_MOBILE: 'emergencyContactPhone',
  GUARDIAN_NAME: 'guardianName',
  GUARDIAN_RELATIONSHIP: 'guardianRelationship',
  GUARDIAN_MOBILE: 'guardianMobile',
};

const bloodGroups = new Set(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);

function isFieldRequired(field: PatientRegistrationField) {
  return field.currentState === 'REQUIRED';
}

export function AddPatientModal({ isOpen, onClose, onCreated }: Props) {
  const { show } = useToast();
  const [fields, setFields] = useState<PatientRegistrationField[]>([]);
  const [values, setValues] = useState<FormValues>({});
  const [submitted, setSubmitted] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHospitalised, setIsHospitalised] = useState(false);
  const [hospitalisationValues, setHospitalisationValues] = useState<HospitalisationRecordValues>(
    emptyHospitalisationValues,
  );
  const [doctorOptions, setDoctorOptions] = useState<DoctorOption[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    setSubmitted(false);
    setActiveField(null);
    setValues({});
    setIsHospitalised(false);
    setHospitalisationValues(emptyHospitalisationValues());
    settingsApi.patientRegistrationProfile()
      .then((profile) => setFields(profile.fields.filter((field) => field.currentState !== 'HIDDEN')))
      .catch((cause) => setError(cause instanceof ApiError ? cause.message : 'Could not load registration fields'))
      .finally(() => setLoading(false));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !isHospitalised || doctorOptions.length > 0) return;
    setIsLoadingDoctors(true);
    doctorsApi.list({ size: 100 })
      .then((page) => setDoctorOptions(page.content.map((doctor) => ({ value: String(doctor.id), label: `${doctor.fullName} · ${doctor.specialty}` }))))
      .catch(() => setDoctorOptions([]))
      .finally(() => setIsLoadingDoctors(false));
  }, [isOpen, isHospitalised, doctorOptions.length]);

  const groupedFields = useMemo(() => fields.reduce<Record<string, PatientRegistrationField[]>>((groups, field) => {
    (groups[field.fieldGroup] ??= []).push(field);
    return groups;
  }, {}), [fields]);

  function setValue(key: string, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function fieldError(field: PatientRegistrationField) {
    const input = keyToInput[field.fieldKey];
    const value = values[input]?.trim() ?? '';
    if (isFieldRequired(field) && !value) return `${field.fieldLabel} is required`;
    if (!value) return undefined;
    switch (field.fieldKey) {
      case 'FULL_NAME':
      case 'EMERGENCY_CONTACT_NAME':
        return validators.personName(value);
      case 'DATE_OF_BIRTH': {
        const date = new Date(`${value}T00:00:00`);
        const today = new Date();
        if (Number.isNaN(date.getTime()) || date > today) return 'Date of birth cannot be in the future';
        if (today.getFullYear() - date.getFullYear() > 120) return 'Enter a realistic date of birth';
        return undefined;
      }
      // No country-code selector for mobile fields — just the 10-digit local number,
      // validated (and an optional pasted +91/91 stripped) by the shared validator.
      case 'MOBILE':
      case 'EMERGENCY_CONTACT_MOBILE':
      case 'GUARDIAN_MOBILE':
        return validators.indianMobile(value);
      case 'EMAIL':
        return validators.email(value);
      case 'ADDRESS':
        return value.length >= 5 ? undefined : 'Enter a complete address';
      case 'BLOOD_GROUP':
        return bloodGroups.has(value.toUpperCase()) ? undefined : 'Choose a valid blood group, for example O+';
      case 'POSTAL_CODE':
        return validators.postalCode(value);
      default:
        return undefined;
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    const invalid = fields.find((field) => fieldError(field));
    if (invalid) {
      show({ title: 'Correct the highlighted fields', tone: 'danger' });
      return;
    }
    setSubmitting(true);
    try {
      const patient = await patientsApi.create({
        firstName: values.fullName?.trim().split(/\s+/)[0] ?? '',
        lastName: values.fullName?.trim().split(/\s+/).slice(1).join(' ') || undefined,
        dateOfBirth: values.dateOfBirth || undefined,
        gender: values.gender || undefined,
        phone: values.phone || undefined,
        email: values.email || undefined,
        address: values.address || undefined,
        city: values.city || undefined,
        state: values.state || undefined,
        postalCode: values.postalCode || undefined,
        preferredLanguage: values.preferredLanguage || undefined,
        bloodGroup: values.bloodGroup || undefined,
        emergencyContactName: values.emergencyContactName || undefined,
        emergencyContactPhone: values.emergencyContactPhone || undefined,
        emergencyContactRelationship: values.emergencyContactRelationship || undefined,
        insuranceProvider: values.insuranceProvider || undefined,
        memberId: values.memberId || undefined,
        governmentIdType: values.governmentIdType || undefined,
        governmentIdNumber: values.governmentIdNumber || undefined,
        allergies: values.allergies || undefined,
        consentStatus: values.consentStatus || undefined,
        referringPhysician: values.referringPhysician || undefined,
        guardianName: values.guardianName || undefined,
        guardianRelationship: values.guardianRelationship || undefined,
        guardianMobile: values.guardianMobile || undefined,
        isHospitalised,
        hospitalisation: isHospitalised
          ? {
              ward: hospitalisationValues.ward,
              bed: hospitalisationValues.bed,
              admittingDoctorId: Number(hospitalisationValues.admittingDoctorId),
              admissionDate: toIsoInstant(hospitalisationValues.admissionDate),
            }
          : undefined,
      });
      onCreated(patient);
      setValues({});
      setSubmitted(false);
      setIsHospitalised(false);
      setHospitalisationValues(emptyHospitalisationValues());
      show({ title: 'Patient registered', tone: 'success' });
      onClose();
    } catch (cause) {
      show({ title: 'Could not register patient', description: cause instanceof ApiError ? cause.message : undefined, tone: 'danger' });
    } finally {
      setSubmitting(false);
    }
  }

  function renderField(field: PatientRegistrationField) {
    const input = keyToInput[field.fieldKey];
    if (!input) return null;
    const label = `${field.fieldLabel}${isFieldRequired(field) ? ' *' : ''}`;
    const validationError = fieldError(field);
    const errorMessage = submitted && Boolean(validationError) && activeField !== field.fieldKey
      ? validationError
      : undefined;
    const onChange = (value: string) => setValue(input, value);
    const onFocus = () => setActiveField(field.fieldKey);
    const onBlur = () => setActiveField((current) => current === field.fieldKey ? null : current);
    const options = field.fieldKey === 'GENDER' ? genderOptions
      : field.fieldKey === 'BLOOD_GROUP' ? bloodGroupOptions
        : field.fieldKey === 'GOVERNMENT_ID_TYPE' ? governmentIdOptions
          : field.fieldKey === 'CONSENT_STATUS' ? consentOptions
            : field.fieldKey.includes('RELATIONSHIP') ? relationshipOptions : null;
    if (options) {
      return <Select key={field.fieldKey} label={label} value={values[input] ?? ''} options={options} placeholder="Select an option" error={errorMessage} onFocus={onFocus} onBlur={onBlur} onChange={(event) => onChange(event.target.value)} />;
    }
    if (field.fieldKey === 'STATE') {
      return (
        <SearchableSelect
          key={field.fieldKey}
          label={label}
          placeholder="Search for a state…"
          value={values[input] ?? ''}
          error={errorMessage}
          onFocus={onFocus}
          onBlur={onBlur}
          loadOptions={() => geoApi.states('India')}
          onChange={onChange}
        />
      );
    }
    return <Input key={field.fieldKey} label={label} hint={field.fieldKey.includes('MOBILE') ? 'India: 10 digits starting with 6-9, with optional +91' : field.fieldKey === 'POSTAL_CODE' ? '6-digit Indian PIN code' : undefined} type={field.fieldKey === 'DATE_OF_BIRTH' ? 'date' : field.fieldKey.includes('MOBILE') || field.fieldKey === 'MOBILE' ? 'tel' : 'text'} value={values[input] ?? ''} error={errorMessage} onFocus={onFocus} onBlur={onBlur} onChange={(event) => onChange(event.target.value)} />;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register patient" description="Only fields enabled by your hospital profile are shown." size="lg" footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" form="add-patient-form" isLoading={submitting}>Register patient</Button></>}>
      {loading ? <Loading label="Loading registration fields…" /> : error ? <Alert tone="danger" title="Could not load profile">{error}</Alert> : (
        <form id="add-patient-form" onSubmit={submit} style={{ display: 'grid', gap: 'var(--mf-space-5)' }}>
          {Object.entries(groupedFields).map(([group, groupFields]) => (
            <section key={group}>
              <h4 style={{ margin: '0 0 var(--mf-space-3)' }}>{group}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--mf-space-3)' }}>
                {groupFields.map(renderField)}
              </div>
            </section>
          ))}
          <section>
            <h4 style={{ margin: '0 0 var(--mf-space-3)' }}>Hospitalisation</h4>
            <div style={{ display: 'grid', gap: 'var(--mf-space-4)' }}>
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
          </section>
        </form>
      )}
    </Modal>
  );
}
