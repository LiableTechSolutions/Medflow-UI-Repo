import { type FormEvent, useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Alert } from '../Alert/Alert';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import { Input } from '../Input/Input';
import { Loading } from '../Loading/Loading';
import { Modal } from '../Modal/Modal';
import { Table, type TableColumn } from '../Table/Table';
import { Textarea } from '../Textarea/Textarea';
import { useInlineValidation } from '../../hooks/useInlineValidation';
import { maxLength } from '../../../core/utils/validation';
import { formatDate } from '../../../core/utils/format';
import type { Prescription } from '../../../core/api/types';
import './PrescriptionPanel.css';

export interface PrescriptionMedicineRow {
  medicationName: string;
  dosage: string;
  frequency: string;
  durationDays: string;
  instructions: string;
}

export interface PrescriptionFormValues {
  diagnosis: string;
  digitallySigned: boolean;
  medicines: PrescriptionMedicineRow[];
}

type FormField = 'diagnosis';

interface PrescriptionPanelProps {
  prescriptions: Prescription[];
  isLoading?: boolean;
  error?: string;
  /** Omit to hide the "Add prescription" affordance — e.g. a read-only history view. */
  onAddPrescription?: (values: PrescriptionFormValues) => Promise<void> | void;
  /** Hospital stock names shown as suggestions; the field still accepts free text. */
  loadMedicineOptions?: () => Promise<string[]>;
  emptyMessage?: string;
}

const emptyRow: PrescriptionMedicineRow = {
  medicationName: '',
  dosage: '',
  frequency: '',
  durationDays: '',
  instructions: '',
};

const emptyValues: PrescriptionFormValues = {
  diagnosis: '',
  digitallySigned: true,
  medicines: [{ ...emptyRow }],
};

/**
 * A patient's prescription history, with an optional "Add prescription" modal. Medicines
 * are entered as free text (suggested from the hospital's own pharmacy stock via a
 * datalist) — there is no clinical drug catalogue in the system, only hospital
 * inventory, and a doctor must still be able to prescribe something not currently
 * stocked (see the feature story's Open questions).
 */
export function PrescriptionPanel({
  prescriptions,
  isLoading = false,
  error,
  onAddPrescription,
  loadMedicineOptions,
  emptyMessage = 'No prescriptions recorded yet.',
}: PrescriptionPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [values, setValues] = useState<PrescriptionFormValues>(emptyValues);
  const [medicineNames, setMedicineNames] = useState<string[]>([]);

  const validation = useInlineValidation<FormField>({
    diagnosis: maxLength(2000, 'Keep diagnosis/notes under 2000 characters'),
  });

  useEffect(() => {
    if (isModalOpen && loadMedicineOptions && medicineNames.length === 0) {
      loadMedicineOptions().then(setMedicineNames).catch(() => setMedicineNames([]));
    }
  }, [isModalOpen, loadMedicineOptions, medicineNames.length]);

  function openModal() {
    setValues(emptyValues);
    setSubmitError(null);
    validation.reset();
    setIsModalOpen(true);
  }

  function setRow(index: number, patch: Partial<PrescriptionMedicineRow>) {
    setValues((current) => ({
      ...current,
      medicines: current.medicines.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    }));
  }

  function addRow() {
    setValues((current) => ({ ...current, medicines: [...current.medicines, { ...emptyRow }] }));
  }

  function removeRow(index: number) {
    setValues((current) => ({ ...current, medicines: current.medicines.filter((_, i) => i !== index) }));
  }

  /** At least one row needs a name, dosage and frequency to count as a real medicine line. */
  function completeRows(rows: PrescriptionMedicineRow[]) {
    return rows.filter((row) => row.medicationName.trim() && row.dosage.trim() && row.frequency.trim());
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!onAddPrescription) return;
    validation.markSubmitted();
    if (validation.hasErrors({ diagnosis: values.diagnosis })) return;

    const medicines = completeRows(values.medicines);
    if (medicines.length === 0) {
      setSubmitError('Add at least one medicine with a name, dosage and frequency.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      await onAddPrescription({ ...values, medicines });
      setIsModalOpen(false);
    } catch (cause) {
      setSubmitError(cause instanceof Error ? cause.message : 'Could not save this prescription');
    } finally {
      setSubmitting(false);
    }
  }

  const columns: TableColumn<Prescription>[] = [
    { key: 'date', header: 'Date', render: (row) => formatDate(row.createdAt) },
    { key: 'doctor', header: 'Doctor', render: (row) => row.doctorName },
    { key: 'diagnosis', header: 'Diagnosis', render: (row) => row.diagnosis || '—' },
    {
      key: 'medicines',
      header: 'Medicines',
      render: (row) => (
        <span title={row.medicines.map((m) => `${m.medicationName} — ${m.dosage}, ${m.frequency}`).join('\n')}>
          {row.medicines.length === 0
            ? '—'
            : `${row.medicines[0].medicationName}${row.medicines.length > 1 ? ` +${row.medicines.length - 1}` : ''}`}
        </span>
      ),
    },
    {
      key: 'signed',
      header: 'Signed',
      render: (row) => (
        <Badge tone={row.digitallySigned ? 'green' : 'neutral'}>{row.digitallySigned ? 'Signed' : 'Draft'}</Badge>
      ),
    },
  ];

  return (
    <div className="mf-prescription-panel">
      <div className="mf-prescription-panel__header">
        <h4 className="mf-prescription-panel__title">Past prescriptions</h4>
        {onAddPrescription && (
          <Button size="sm" leftIcon={<Plus size={14} />} onClick={openModal}>
            Add prescription
          </Button>
        )}
      </div>

      {error && (
        <Alert tone="danger" title="Could not load prescriptions">
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Loading label="Loading prescriptions…" />
      ) : (
        <Table columns={columns} data={prescriptions} rowKey={(row) => row.id} emptyMessage={emptyMessage} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add prescription"
        description="Diagnosis notes and the medicines to prescribe."
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="prescription-form" isLoading={submitting}>
              Save prescription
            </Button>
          </>
        }
      >
        {submitError && (
          <Alert tone="danger" title="Could not save this prescription">
            {submitError}
          </Alert>
        )}
        <form id="prescription-form" onSubmit={submit} className="mf-prescription-panel__form">
          <Textarea
            label="Diagnosis / examination notes"
            placeholder="What did you observe during the examination?"
            value={values.diagnosis}
            error={validation.errorFor('diagnosis', values.diagnosis)}
            onFocus={validation.handleFocus('diagnosis')}
            onBlur={validation.handleBlur('diagnosis')}
            onChange={(event) => setValues((current) => ({ ...current, diagnosis: event.target.value }))}
          />

          <datalist id="mf-prescription-medicine-options">
            {medicineNames.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>

          <div className="mf-prescription-panel__medicines">
            <div className="mf-prescription-panel__medicines-header">
              <span>Medicines</span>
              <Button type="button" variant="ghost" size="sm" leftIcon={<Plus size={14} />} onClick={addRow}>
                Add medicine
              </Button>
            </div>
            {values.medicines.map((row, index) => (
              <div className="mf-prescription-panel__row" key={index}>
                <Input
                  label="Medicine"
                  placeholder="Search hospital stock or type a name"
                  list="mf-prescription-medicine-options"
                  value={row.medicationName}
                  onChange={(event) => setRow(index, { medicationName: event.target.value })}
                />
                <Input
                  label="Dosage"
                  placeholder="500mg"
                  value={row.dosage}
                  onChange={(event) => setRow(index, { dosage: event.target.value })}
                />
                <Input
                  label="Frequency"
                  placeholder="Twice daily"
                  value={row.frequency}
                  onChange={(event) => setRow(index, { frequency: event.target.value })}
                />
                <Input
                  label="Duration (days)"
                  type="number"
                  placeholder="5"
                  value={row.durationDays}
                  onChange={(event) => setRow(index, { durationDays: event.target.value })}
                />
                <Input
                  label="Instructions"
                  placeholder="After food"
                  value={row.instructions}
                  onChange={(event) => setRow(index, { instructions: event.target.value })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label="Remove medicine"
                  disabled={values.medicines.length === 1}
                  onClick={() => removeRow(index)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </div>

          <Checkbox
            label="Digitally signed"
            hint="Leave unchecked to save as a draft"
            checked={values.digitallySigned}
            onChange={(event) => setValues((current) => ({ ...current, digitallySigned: event.target.checked }))}
          />
        </form>
      </Modal>
    </div>
  );
}
