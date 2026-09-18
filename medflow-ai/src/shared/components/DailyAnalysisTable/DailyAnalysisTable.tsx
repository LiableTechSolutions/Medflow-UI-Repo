import { type FormEvent, useState } from 'react';
import { Plus } from 'lucide-react';
import { Alert } from '../Alert/Alert';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Select } from '../Select/Select';
import { Loading } from '../Loading/Loading';
import { Modal } from '../Modal/Modal';
import { Table, type TableColumn } from '../Table/Table';
import { useInlineValidation } from '../../hooks/useInlineValidation';
import { composeValidators, numberInRange, required } from '../../../core/utils/validation';
import { formatDate } from '../../../core/utils/format';
import type { DailyAnalysisEntry } from '../../../core/api/types';
import type { DoctorOption } from '../HospitalisationRecordForm/HospitalisationRecordForm';
import './DailyAnalysisTable.css';

export interface DailyAnalysisFormValues {
  bloodPressureSystolic: string;
  bloodPressureDiastolic: string;
  pulseRate: string;
  temperature: string;
  spo2: string;
  notes: string;
  recordedByDoctorId: string;
}

type FormField = keyof DailyAnalysisFormValues;

interface DailyAnalysisTableProps {
  entries: DailyAnalysisEntry[];
  isLoading?: boolean;
  error?: string;
  /** Omit (or pass nothing) to hide the "Add entry" affordance — e.g. once discharged. */
  onAddEntry?: (values: DailyAnalysisFormValues) => Promise<void> | void;
  doctorOptions: DoctorOption[];
  emptyMessage?: string;
}

const emptyFormValues: DailyAnalysisFormValues = {
  bloodPressureSystolic: '',
  bloodPressureDiastolic: '',
  pulseRate: '',
  temperature: '',
  spo2: '',
  notes: '',
  recordedByDoctorId: '',
};

function doctorLabel(doctorOptions: DoctorOption[], id: number) {
  return doctorOptions.find((option) => option.value === String(id))?.label ?? `Doctor #${id}`;
}

/**
 * Lists the daily vitals/observations logged for an active hospitalisation, with an
 * "Add entry" modal for recording a new day's analysis. Matches the BFF's
 * `CreateDailyAnalysisRequest` shape: one combined blood-pressure reading, and the
 * recorder identified by doctor id rather than a free-text name.
 */
export function DailyAnalysisTable({
  entries,
  isLoading = false,
  error,
  onAddEntry,
  doctorOptions,
  emptyMessage = 'No daily analysis entries recorded yet.',
}: DailyAnalysisTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [values, setValues] = useState<DailyAnalysisFormValues>(emptyFormValues);

  const validation = useInlineValidation<FormField>({
    recordedByDoctorId: required('Recorded by'),
    bloodPressureSystolic: composeValidators(required('Systolic BP'), numberInRange(60, 260, 'Enter a systolic reading between 60 and 260')),
    bloodPressureDiastolic: composeValidators(required('Diastolic BP'), numberInRange(30, 200, 'Enter a diastolic reading between 30 and 200')),
    pulseRate: composeValidators(required('Pulse'), numberInRange(20, 250, 'Enter a pulse between 20 and 250 bpm')),
    spo2: composeValidators(required('SpO₂'), numberInRange(0, 100, 'Enter an SpO₂ between 0 and 100%')),
  });

  function openModal() {
    setValues(emptyFormValues);
    setSubmitError(null);
    validation.reset();
    setIsModalOpen(true);
  }

  function setField<K extends FormField>(key: K, value: DailyAnalysisFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!onAddEntry) return;
    validation.markSubmitted();
    if (validation.hasErrors(values)) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await onAddEntry(values);
      setIsModalOpen(false);
    } catch (cause) {
      setSubmitError(cause instanceof Error ? cause.message : 'Could not save this entry');
    } finally {
      setSubmitting(false);
    }
  }

  const columns: TableColumn<DailyAnalysisEntry>[] = [
    { key: 'date', header: 'Date', render: (row) => formatDate(row.recordedAt) },
    { key: 'bp', header: 'BP', render: (row) => (row.bloodPressure ? `${row.bloodPressure} mmHg` : '—') },
    { key: 'pulse', header: 'Pulse', render: (row) => (row.pulse != null ? `${row.pulse} bpm` : '—') },
    { key: 'temperature', header: 'Temp', render: (row) => (row.temperature != null ? `${row.temperature}°F` : '—') },
    { key: 'spo2', header: 'SpO₂', render: (row) => (row.spo2 != null ? `${row.spo2}%` : '—') },
    { key: 'notes', header: 'Notes', render: (row) => row.notes || '—' },
    { key: 'recordedBy', header: 'Recorded by', render: (row) => doctorLabel(doctorOptions, row.recordedByDoctorId) },
  ];

  return (
    <div className="mf-daily-analysis">
      <div className="mf-daily-analysis__header">
        <h4 className="mf-daily-analysis__title">Daily analysis</h4>
        {onAddEntry && (
          <Button size="sm" leftIcon={<Plus size={14} />} onClick={openModal}>
            Add entry
          </Button>
        )}
      </div>

      {error && (
        <Alert tone="danger" title="Could not load daily analysis">
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Loading label="Loading daily analysis…" />
      ) : (
        <Table columns={columns} data={entries} rowKey={(row) => row.id} emptyMessage={emptyMessage} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add daily analysis entry"
        description="Record today's vitals for the current admission."
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="daily-analysis-form" isLoading={submitting}>
              Save entry
            </Button>
          </>
        }
      >
        {submitError && (
          <Alert tone="danger" title="Could not save this entry">
            {submitError}
          </Alert>
        )}
        <form id="daily-analysis-form" onSubmit={submit} className="mf-daily-analysis__form">
          <Select
            label="Recorded by *"
            value={values.recordedByDoctorId}
            options={doctorOptions}
            placeholder="Select a doctor"
            error={validation.errorFor('recordedByDoctorId', values.recordedByDoctorId)}
            onFocus={validation.handleFocus('recordedByDoctorId')}
            onBlur={validation.handleBlur('recordedByDoctorId')}
            onChange={(event) => setField('recordedByDoctorId', event.target.value)}
          />
          <Input
            label="Systolic BP *"
            type="number"
            placeholder="120"
            value={values.bloodPressureSystolic}
            error={validation.errorFor('bloodPressureSystolic', values.bloodPressureSystolic)}
            onFocus={validation.handleFocus('bloodPressureSystolic')}
            onBlur={validation.handleBlur('bloodPressureSystolic')}
            onChange={(event) => setField('bloodPressureSystolic', event.target.value)}
          />
          <Input
            label="Diastolic BP *"
            type="number"
            placeholder="80"
            value={values.bloodPressureDiastolic}
            error={validation.errorFor('bloodPressureDiastolic', values.bloodPressureDiastolic)}
            onFocus={validation.handleFocus('bloodPressureDiastolic')}
            onBlur={validation.handleBlur('bloodPressureDiastolic')}
            onChange={(event) => setField('bloodPressureDiastolic', event.target.value)}
          />
          <Input
            label="Pulse (bpm) *"
            type="number"
            placeholder="76"
            value={values.pulseRate}
            error={validation.errorFor('pulseRate', values.pulseRate)}
            onFocus={validation.handleFocus('pulseRate')}
            onBlur={validation.handleBlur('pulseRate')}
            onChange={(event) => setField('pulseRate', event.target.value)}
          />
          <Input
            label="Temperature (°F)"
            type="number"
            step="0.1"
            placeholder="98.6"
            value={values.temperature}
            onChange={(event) => setField('temperature', event.target.value)}
          />
          <Input
            label="SpO₂ (%) *"
            type="number"
            placeholder="98"
            value={values.spo2}
            error={validation.errorFor('spo2', values.spo2)}
            onFocus={validation.handleFocus('spo2')}
            onBlur={validation.handleBlur('spo2')}
            onChange={(event) => setField('spo2', event.target.value)}
          />
          <Input
            label="Notes"
            placeholder="Optional observations"
            value={values.notes}
            onChange={(event) => setField('notes', event.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
}
