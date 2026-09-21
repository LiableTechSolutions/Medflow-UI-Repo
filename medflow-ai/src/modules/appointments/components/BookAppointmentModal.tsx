import { type FormEvent, useEffect, useState } from 'react';
import { Modal } from '../../../shared/components/Modal/Modal';
import { Button } from '../../../shared/components/Button/Button';
import { Input } from '../../../shared/components/Input/Input';
import { Select } from '../../../shared/components/Select/Select';
import { SearchableSelect } from '../../../shared/components/SearchableSelect/SearchableSelect';
import { Alert } from '../../../shared/components/Alert/Alert';
import { Loading } from '../../../shared/components/Loading/Loading';
import { useInlineValidation } from '../../../shared/hooks/useInlineValidation';
import { composeValidators, notFutureDate, required, todayDateOnly, validators } from '../../../core/utils/validation';
import { appointmentsApi, doctorsApi, patientsApi } from '../../../core/api/services';
import { ApiError } from '../../../core/api/client';
import type { Appointment } from '../../../core/api/types';

const modeOptions = [
  { value: 'WALK_IN', label: 'Walk-in' },
  { value: 'ONLINE', label: 'Online' },
];

const genderOptions = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

type PatientMode = 'existing' | 'new';

interface FormValues {
  patientId: string;
  doctorId: string;
  date: string;
  appointmentMode: string;
  reason: string;
  notes: string;
  newFirstName: string;
  newLastName: string;
  newPhone: string;
  newEmail: string;
  newGender: string;
  newDob: string;
}

type FormField = keyof Omit<FormValues, 'appointmentMode' | 'reason' | 'notes' | 'newLastName' | 'newGender'>;

const emptyValues: FormValues = {
  patientId: '',
  doctorId: '',
  date: '',
  appointmentMode: 'WALK_IN',
  reason: '',
  notes: '',
  newFirstName: '',
  newLastName: '',
  newPhone: '',
  newEmail: '',
  newGender: '',
  newDob: '',
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onBooked: (appointment: Appointment) => void;
}

/**
 * Books a new appointment in one flow: pick an existing patient, or register a new one
 * inline without leaving the modal; pick a doctor; pick a real open slot for the chosen
 * day (pre-selected to the earliest one, changeable); pick a mode. One submit does both
 * the patient registration (if needed) and the booking - staff experience it as one action.
 */
export function BookAppointmentModal({ isOpen, onClose, onBooked }: Props) {
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [patientMode, setPatientMode] = useState<PatientMode>('existing');
  const [patientOptions, setPatientOptions] = useState<{ value: string; label: string }[]>([]);
  const [doctorOptions, setDoctorOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [slotTouched, setSlotTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validation = useInlineValidation<FormField>({
    patientId: patientMode === 'existing' ? required('Patient') : undefined,
    doctorId: required('Doctor'),
    date: required('Date'),
    newFirstName: patientMode === 'new' ? composeValidators(required('First name'), validators.personName) : undefined,
    newPhone: patientMode === 'new' ? composeValidators(required('Phone'), validators.indianMobile) : undefined,
    newEmail: patientMode === 'new' ? validators.email : undefined,
    newDob: patientMode === 'new' ? composeValidators(required('Date of birth'), notFutureDate) : undefined,
  });

  useEffect(() => {
    if (!isOpen) return;
    setValues(emptyValues);
    setPatientMode('existing');
    setSelectedSlot('');
    setSlots([]);
    setSlotTouched(false);
    setError(null);
    validation.reset();
    doctorsApi.list({ size: 100 }).then((page) =>
      setDoctorOptions(page.content.map((doctor) => ({ value: String(doctor.id), label: `${doctor.fullName} · ${doctor.specialty}` }))),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    setSelectedSlot('');
    setSlotTouched(false);
    if (!values.doctorId || !values.date) {
      setSlots([]);
      return;
    }
    setSlotsLoading(true);
    setSlotsError(null);
    appointmentsApi.availableSlots(Number(values.doctorId), values.date)
      .then((result) => {
        setSlots(result.slots);
        // Pre-select the earliest open slot so the common case ("just book the next
        // available time") needs no extra click; staff can still pick a different one.
        if (result.slots.length > 0) setSelectedSlot(result.slots[0]);
      })
      .catch((cause) => setSlotsError(cause instanceof ApiError ? cause.message : 'Could not load available times'))
      .finally(() => setSlotsLoading(false));
  }, [values.doctorId, values.date]);

  async function loadPatientOptions() {
    if (patientOptions.length > 0) return patientOptions;
    const page = await patientsApi.list({ size: 100 });
    const options = page.content.map((patient) => ({ value: String(patient.id), label: `${patient.fullName} · ${patient.patientCode}` }));
    setPatientOptions(options);
    return options;
  }

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function switchToNewPatient() {
    setPatientMode('new');
    setField('patientId', '');
  }

  function switchToExistingPatient() {
    setPatientMode('existing');
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    validation.markSubmitted();
    setSlotTouched(true);
    if (validation.hasErrors(values) || !selectedSlot) return;
    setSubmitting(true);
    setError(null);
    try {
      let patientId = Number(values.patientId);
      if (patientMode === 'new') {
        const patient = await patientsApi.create({
          firstName: values.newFirstName,
          lastName: values.newLastName || undefined,
          phone: values.newPhone,
          email: values.newEmail || undefined,
          gender: values.newGender || undefined,
          dateOfBirth: values.newDob,
        });
        patientId = patient.id;
        // The patient now exists even if booking below fails - drop back to "existing
        // patient" mode with them pre-selected, so retrying never re-registers them.
        setPatientOptions((current) => [{ value: String(patient.id), label: `${patient.fullName} · ${patient.patientCode}` }, ...current]);
        setPatientMode('existing');
        setField('patientId', String(patient.id));
      }

      const appointment = await appointmentsApi.book({
        patientId,
        doctorId: Number(values.doctorId),
        scheduledAt: selectedSlot,
        appointmentMode: values.appointmentMode,
        reason: values.reason || undefined,
        notes: values.notes || undefined,
      });
      onBooked(appointment);
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'Could not book this appointment');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book appointment"
      description="The patient is notified once this is booked, with a link to their live queue position."
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="book-appointment-form" isLoading={submitting}>
            Book appointment
          </Button>
        </>
      }
    >
      {error && (
        <Alert tone="danger" title="Could not book this appointment">
          {error}
        </Alert>
      )}
      <form id="book-appointment-form" onSubmit={submit} style={{ display: 'grid', gap: 'var(--mf-space-4)' }}>
        <div className="mf-field">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label className="mf-field__label">Patient *</label>
            {patientMode === 'existing' ? (
              <Button type="button" variant="ghost" size="sm" onClick={switchToNewPatient}>
                + New patient
              </Button>
            ) : (
              <Button type="button" variant="ghost" size="sm" onClick={switchToExistingPatient}>
                ← Use existing patient
              </Button>
            )}
          </div>

          {patientMode === 'existing' ? (
            <SearchableSelect
              placeholder="Search for a patient…"
              value={values.patientId}
              options={patientOptions.length > 0 ? patientOptions : undefined}
              loadOptions={loadPatientOptions}
              error={validation.errorFor('patientId', values.patientId)}
              onFocus={validation.handleFocus('patientId')}
              onBlur={validation.handleBlur('patientId')}
              onChange={(value) => setField('patientId', value)}
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--mf-space-3)', marginTop: 'var(--mf-space-2)' }}>
              <Input
                label="First name *"
                value={values.newFirstName}
                error={validation.errorFor('newFirstName', values.newFirstName)}
                onFocus={validation.handleFocus('newFirstName')}
                onBlur={validation.handleBlur('newFirstName')}
                onChange={(event) => setField('newFirstName', event.target.value)}
              />
              <Input label="Last name" value={values.newLastName} onChange={(event) => setField('newLastName', event.target.value)} />
              <Input
                label="Phone *"
                type="tel"
                hint="India: 10 digits starting with 6-9"
                value={values.newPhone}
                error={validation.errorFor('newPhone', values.newPhone)}
                onFocus={validation.handleFocus('newPhone')}
                onBlur={validation.handleBlur('newPhone')}
                onChange={(event) => setField('newPhone', event.target.value)}
              />
              <Input
                label="Email"
                type="email"
                value={values.newEmail}
                error={validation.errorFor('newEmail', values.newEmail)}
                onFocus={validation.handleFocus('newEmail')}
                onBlur={validation.handleBlur('newEmail')}
                onChange={(event) => setField('newEmail', event.target.value)}
              />
              <Select
                label="Gender"
                value={values.newGender}
                options={genderOptions}
                placeholder="Select"
                onChange={(event) => setField('newGender', event.target.value)}
              />
              <Input
                label="Date of birth *"
                type="date"
                max={todayDateOnly()}
                value={values.newDob}
                error={validation.errorFor('newDob', values.newDob)}
                onFocus={validation.handleFocus('newDob')}
                onBlur={validation.handleBlur('newDob')}
                onChange={(event) => setField('newDob', event.target.value)}
              />
            </div>
          )}
        </div>

        <Select
          label="Doctor *"
          value={values.doctorId}
          options={doctorOptions}
          placeholder={doctorOptions.length === 0 ? 'Loading doctors…' : 'Select a doctor'}
          disabled={doctorOptions.length === 0}
          error={validation.errorFor('doctorId', values.doctorId)}
          onFocus={validation.handleFocus('doctorId')}
          onBlur={validation.handleBlur('doctorId')}
          onChange={(event) => setField('doctorId', event.target.value)}
        />
        <Input
          label="Date *"
          type="date"
          min={todayDateOnly()}
          value={values.date}
          error={validation.errorFor('date', values.date)}
          onFocus={validation.handleFocus('date')}
          onBlur={validation.handleBlur('date')}
          onChange={(event) => setField('date', event.target.value)}
        />

        <div className="mf-field">
          <label className="mf-field__label">Available time *</label>
          {!values.doctorId || !values.date ? (
            <p className="mf-field__message">Choose a doctor and date to see open times.</p>
          ) : slotsLoading ? (
            <Loading label="Loading available times…" />
          ) : slotsError ? (
            <p className="mf-field__message mf-field__message--error">{slotsError}</p>
          ) : slots.length === 0 ? (
            <p className="mf-field__message">No open slots for this day — try another date.</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--mf-space-2)' }}>
              {slots.map((slot) => (
                <Button
                  key={slot}
                  type="button"
                  size="sm"
                  variant={slot === selectedSlot ? 'primary' : 'outline'}
                  onClick={() => {
                    setSelectedSlot(slot);
                    setSlotTouched(true);
                  }}
                >
                  {new Date(slot).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                </Button>
              ))}
            </div>
          )}
          {slotTouched && !selectedSlot && slots.length > 0 && (
            <p className="mf-field__message mf-field__message--error">Pick a time</p>
          )}
        </div>

        <Select
          label="Mode"
          value={values.appointmentMode}
          options={modeOptions}
          onChange={(event) => setField('appointmentMode', event.target.value)}
        />
        <Input label="Reason" placeholder="e.g. Follow-up consultation" value={values.reason} onChange={(event) => setField('reason', event.target.value)} />
        <Input label="Notes" placeholder="Optional" value={values.notes} onChange={(event) => setField('notes', event.target.value)} />
      </form>
    </Modal>
  );
}
