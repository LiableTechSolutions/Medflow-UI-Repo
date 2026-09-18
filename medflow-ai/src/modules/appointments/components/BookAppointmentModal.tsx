import { type FormEvent, useEffect, useState } from 'react';
import { Modal } from '../../../shared/components/Modal/Modal';
import { Button } from '../../../shared/components/Button/Button';
import { Input } from '../../../shared/components/Input/Input';
import { Select } from '../../../shared/components/Select/Select';
import { SearchableSelect } from '../../../shared/components/SearchableSelect/SearchableSelect';
import { Alert } from '../../../shared/components/Alert/Alert';
import { useInlineValidation } from '../../../shared/hooks/useInlineValidation';
import { required } from '../../../core/utils/validation';
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
  scheduledAt: string;
  appointmentMode: string;
  reason: string;
  notes: string;
}

type FormField = keyof Pick<FormValues, 'patientId' | 'doctorId' | 'scheduledAt'>;

const emptyValues: FormValues = {
  patientId: '',
  doctorId: '',
  scheduledAt: '',
  appointmentMode: 'WALK_IN',
  reason: '',
  notes: '',
};

/** `yyyy-MM-ddTHH:mm`, the format `<input type="datetime-local">` needs — floors to the minute. */
function nowDateTimeLocal(): string {
  const now = new Date();
  now.setSeconds(0, 0);
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onBooked: (appointment: Appointment) => void;
}

/** Books a new appointment — patient, doctor, date/time, mode — then hands the result back. */
export function BookAppointmentModal({ isOpen, onClose, onBooked }: Props) {
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [patientOptions, setPatientOptions] = useState<{ value: string; label: string }[]>([]);
  const [doctorOptions, setDoctorOptions] = useState<{ value: string; label: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validation = useInlineValidation<FormField>({
    patientId: required('Patient'),
    doctorId: required('Doctor'),
    scheduledAt: required('Date and time'),
  });

  useEffect(() => {
    if (!isOpen) return;
    setValues(emptyValues);
    setError(null);
    validation.reset();
    doctorsApi.list({ size: 100 }).then((page) =>
      setDoctorOptions(page.content.map((doctor) => ({ value: String(doctor.id), label: `${doctor.fullName} · ${doctor.specialty}` }))),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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
    if (validation.hasErrors(values)) return;
    setSubmitting(true);
    setError(null);
    try {
      const appointment = await appointmentsApi.book({
        patientId: Number(values.patientId),
        doctorId: Number(values.doctorId),
        scheduledAt: new Date(values.scheduledAt).toISOString(),
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
          label="Date and time *"
          type="datetime-local"
          min={nowDateTimeLocal()}
          value={values.scheduledAt}
          error={validation.errorFor('scheduledAt', values.scheduledAt)}
          onFocus={validation.handleFocus('scheduledAt')}
          onBlur={validation.handleBlur('scheduledAt')}
          onChange={(event) => setField('scheduledAt', event.target.value)}
        />
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
