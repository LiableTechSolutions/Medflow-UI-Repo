import { type FormEvent, useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Alert } from '../Alert/Alert';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import { Input } from '../Input/Input';
import { Loading } from '../Loading/Loading';
import { Modal } from '../Modal/Modal';
import { PrescriptionDetailModal } from '../PrescriptionDetailModal/PrescriptionDetailModal';
import { Select } from '../Select/Select';
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

/** `keep` only appears when editing a prescription that already has a reminder date. */
export type FollowUpOption = 'none' | '15days' | '1month' | 'keep';

export interface PrescriptionFormValues {
  diagnosis: string;
  digitallySigned: boolean;
  medicines: PrescriptionMedicineRow[];
  /** When the patient should come back; a daily job reminds them the day before. */
  followUp: FollowUpOption;
}

const FOLLOW_UP_OPTIONS: { value: FollowUpOption; label: string }[] = [
  { value: 'none', label: 'No follow-up' },
  { value: '15days', label: 'In 15 days' },
  { value: '1month', label: 'In 1 month' },
];

/**
 * The reminder date to send, or `null` for "none". `existing` is the reminder already on
 * the prescription being edited — what the `keep` option resolves to.
 */
export function followUpDateFor(option: FollowUpOption, existing?: string): string | null {
  if (option === 'keep') return existing ?? null;
  const today = new Date();
  if (option === '15days') {
    today.setDate(today.getDate() + 15);
  } else if (option === '1month') {
    today.setMonth(today.getMonth() + 1);
  } else {
    return null;
  }
  return today.toISOString().slice(0, 10);
}

type FormField = 'diagnosis';

interface PrescriptionPanelProps {
  prescriptions: Prescription[];
  isLoading?: boolean;
  error?: string;
  /** Omit to hide the "Add prescription" affordance — e.g. a read-only history view. */
  onAddPrescription?: (values: PrescriptionFormValues) => Promise<void> | void;
  /**
   * Enables "Edit" on the current doctor's own prescriptions — but only while the server
   * says they're still `editable` (the day they were issued); after that the row shows
   * "Locked" instead.
   */
  onEditPrescription?: (id: number, values: PrescriptionFormValues) => Promise<void> | void;
  currentDoctorId?: number;
  /** Hospital stock names shown as suggestions; the field still accepts free text. */
  loadMedicineOptions?: () => Promise<string[]>;
  emptyMessage?: string;
  hospitalName?: string | null;
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
  followUp: 'none',
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
  onEditPrescription,
  currentDoctorId,
  loadMedicineOptions,
  emptyMessage = 'No prescriptions recorded yet.',
  hospitalName = null,
}: PrescriptionPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Prescription | null>(null);
  const [selected, setSelected] = useState<Prescription | null>(null);
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
    setEditing(null);
    setValues(emptyValues);
    setSubmitError(null);
    validation.reset();
    setIsModalOpen(true);
  }

  function openEdit(prescription: Prescription) {
    setEditing(prescription);
    setValues({
      diagnosis: prescription.diagnosis ?? '',
      digitallySigned: prescription.digitallySigned,
      medicines: prescription.medicines.map((item) => ({
        medicationName: item.medicationName,
        dosage: item.dosage,
        frequency: item.frequency,
        durationDays: item.durationDays ? String(item.durationDays) : '',
        instructions: item.instructions ?? '',
      })),
      followUp: prescription.followUpDate ? 'keep' : 'none',
    });
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
    if (!(editing ? onEditPrescription : onAddPrescription)) return;
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
      if (editing) {
        await onEditPrescription?.(editing.id, { ...values, medicines });
      } else {
        await onAddPrescription?.({ ...values, medicines });
      }
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
    ...(onEditPrescription
      ? [
          {
            key: 'edit',
            header: '',
            align: 'right' as const,
            render: (row: Prescription) =>
              row.doctorId !== currentDoctorId ? null : row.editable ? (
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Pencil size={14} />}
                  onClick={(event) => {
                    event.stopPropagation();
                    openEdit(row);
                  }}
                >
                  Edit
                </Button>
              ) : (
                <span className="mf-prescription-panel__locked" title="Prescriptions can only be edited on the day they were issued">
                  Locked
                </span>
              ),
          },
        ]
      : []),
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
        <Table
          columns={columns}
          data={prescriptions}
          rowKey={(row) => row.id}
          onRowClick={setSelected}
          emptyMessage={emptyMessage}
        />
      )}

      <PrescriptionDetailModal prescription={selected} hospitalName={hospitalName} onClose={() => setSelected(null)} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? 'Edit prescription' : 'Add prescription'}
        description={
          editing
            ? 'Editing is only possible on the day a prescription was issued.'
            : 'Diagnosis notes and the medicines to prescribe.'
        }
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="prescription-form" isLoading={submitting}>
              {editing ? 'Save changes' : 'Save prescription'}
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

          <Select
            label="Follow-up reminder"
            hint="Sends the patient a reminder by email/WhatsApp/SMS the day before."
            options={
              editing?.followUpDate
                ? [{ value: 'keep', label: `Keep ${formatDate(editing.followUpDate)}` }, ...FOLLOW_UP_OPTIONS]
                : FOLLOW_UP_OPTIONS
            }
            value={values.followUp}
            onChange={(event) =>
              setValues((current) => ({ ...current, followUp: event.target.value as FollowUpOption }))
            }
          />

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
