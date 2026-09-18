import { type FormEvent, useState } from 'react';
import { Plus } from 'lucide-react';
import { Alert } from '../Alert/Alert';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Loading } from '../Loading/Loading';
import { Modal } from '../Modal/Modal';
import { Table, type TableColumn } from '../Table/Table';
import { formatDate } from '../../../core/utils/format';
import type { DailyAnalysisEntry } from '../../../core/api/types';
import './DailyAnalysisTable.css';

export interface DailyAnalysisFormValues {
  entryDate: string;
  bloodPressureSystolic: string;
  bloodPressureDiastolic: string;
  pulseRate: string;
  temperature: string;
  spo2: string;
  notes: string;
  recordedBy: string;
}

interface DailyAnalysisTableProps {
  entries: DailyAnalysisEntry[];
  isLoading?: boolean;
  error?: string;
  /** Omit (or pass nothing) to hide the "Add entry" affordance — e.g. once discharged. */
  onAddEntry?: (values: DailyAnalysisFormValues) => Promise<void> | void;
  defaultRecordedBy?: string;
  emptyMessage?: string;
}

function emptyFormValues(recordedBy: string): DailyAnalysisFormValues {
  return {
    entryDate: new Date().toISOString().slice(0, 10),
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    pulseRate: '',
    temperature: '',
    spo2: '',
    notes: '',
    recordedBy,
  };
}

/**
 * Lists the daily vitals/observations logged for an active hospitalisation, with an
 * "Add entry" modal for recording a new day's analysis.
 */
export function DailyAnalysisTable({
  entries,
  isLoading = false,
  error,
  onAddEntry,
  defaultRecordedBy = '',
  emptyMessage = 'No daily analysis entries recorded yet.',
}: DailyAnalysisTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [values, setValues] = useState<DailyAnalysisFormValues>(() => emptyFormValues(defaultRecordedBy));

  function openModal() {
    setValues(emptyFormValues(defaultRecordedBy));
    setSubmitError(null);
    setIsModalOpen(true);
  }

  function setField<K extends keyof DailyAnalysisFormValues>(key: K, value: DailyAnalysisFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!onAddEntry) return;
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
    { key: 'date', header: 'Date', render: (row) => formatDate(row.entryDate) },
    {
      key: 'bp',
      header: 'BP',
      render: (row) => `${row.bloodPressureSystolic}/${row.bloodPressureDiastolic} mmHg`,
    },
    { key: 'pulse', header: 'Pulse', render: (row) => `${row.pulseRate} bpm` },
    { key: 'temperature', header: 'Temp', render: (row) => `${row.temperature}°F` },
    { key: 'spo2', header: 'SpO₂', render: (row) => `${row.spo2}%` },
    { key: 'notes', header: 'Notes', render: (row) => row.notes || '—' },
    { key: 'recordedBy', header: 'Recorded by', render: (row) => row.recordedBy },
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
          <Input
            label="Date *"
            type="date"
            required
            value={values.entryDate}
            onChange={(event) => setField('entryDate', event.target.value)}
          />
          <Input
            label="Recorded by *"
            required
            placeholder="Nurse / doctor name"
            value={values.recordedBy}
            onChange={(event) => setField('recordedBy', event.target.value)}
          />
          <Input
            label="Systolic BP *"
            type="number"
            required
            placeholder="120"
            value={values.bloodPressureSystolic}
            onChange={(event) => setField('bloodPressureSystolic', event.target.value)}
          />
          <Input
            label="Diastolic BP *"
            type="number"
            required
            placeholder="80"
            value={values.bloodPressureDiastolic}
            onChange={(event) => setField('bloodPressureDiastolic', event.target.value)}
          />
          <Input
            label="Pulse (bpm) *"
            type="number"
            required
            placeholder="76"
            value={values.pulseRate}
            onChange={(event) => setField('pulseRate', event.target.value)}
          />
          <Input
            label="Temperature (°F) *"
            type="number"
            step="0.1"
            required
            placeholder="98.6"
            value={values.temperature}
            onChange={(event) => setField('temperature', event.target.value)}
          />
          <Input
            label="SpO₂ (%) *"
            type="number"
            required
            placeholder="98"
            value={values.spo2}
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
