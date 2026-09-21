import { type FormEvent, useEffect, useState } from 'react';
import { Modal } from '../../../shared/components/Modal/Modal';
import { Button } from '../../../shared/components/Button/Button';
import { Input } from '../../../shared/components/Input/Input';
import { Select } from '../../../shared/components/Select/Select';
import { SearchableSelect } from '../../../shared/components/SearchableSelect/SearchableSelect';
import { Alert } from '../../../shared/components/Alert/Alert';
import { Loading } from '../../../shared/components/Loading/Loading';
import { useInlineValidation } from '../../../shared/hooks/useInlineValidation';
import { required, todayDateOnly } from '../../../core/utils/validation';
import { appointmentsApi, doctorsApi, patientsApi } from '../../../core/api/services';
import { ApiError } from '../../../core/api/client';
import type { Appointment } from '../../../core/api/types';

const modeOptions = [
  { value: 'WALK_IN', label: 'Walk-in' },
  { value: 'ONLINE', label: 'Online' },
];

interface FormValues {
  patientId: string;
  doctorId: string;
  date: string;
  appointmentMode: string;
  reason: string;
  notes: string;
}

type FormField = keyof Pick<FormValues, 'patientId' | 'doctorId' | 'date'>;

const emptyValues: FormValues = {
  patientId: '',
  doctorId: '',
  date: '',
  appointmentMode: 'WALK_IN',
  reason: '',
  notes: '',
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onBooked: (appointment: Appointment) => void;
}

/**
 * Books a new appointment — patient, doctor, a real open slot for the chosen day, mode —
 * then hands the result back. Slots come from the doctor's configured availability, so
 * staff can only book times that are actually open.
 */
export function BookAppointmentModal({ isOpen, onClose, onBooked }: Props) {
  const [values, setValues] = useState<FormValues>(emptyValues);
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
    patientId: required('Patient'),
    doctorId: required('Doctor'),
    date: required('Date'),
  });

  useEffect(() => {
    if (!isOpen) return;
    setValues(emptyValues);
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
      .then((result) => setSlots(result.slots))
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

  async function submit(event: FormEvent) {
    event.preventDefault();
    validation.markSubmitted();
    setSlotTouched(true);
    if (validation.hasErrors(values) || !selectedSlot) return;
    setSubmitting(true);
    setError(null);
    try {
      const appointment = await appointmentsApi.book({
        patientId: Number(values.patientId),
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
        <SearchableSelect
          label="Patient *"
          placeholder="Search for a patient…"
          value={values.patientId}
          options={patientOptions.length > 0 ? patientOptions : undefined}
          loadOptions={loadPatientOptions}
          error={validation.errorFor('patientId', values.patientId)}
          onFocus={validation.handleFocus('patientId')}
          onBlur={validation.handleBlur('patientId')}
          onChange={(value) => setField('patientId', value)}
        />
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
