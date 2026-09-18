import { Badge } from '../Badge/Badge';
import { Input } from '../Input/Input';
import { Select } from '../Select/Select';
import { formatDate, humanize } from '../../../core/utils/format';
import type { HospitalisationStatus } from '../../../core/api/types';
import './HospitalisationRecordForm.css';

export interface HospitalisationRecordValues {
  ward: string;
  bed: string;
  admittingDoctorId: string;
  /** yyyy-mm-dd, matching an `<input type="date">` value. */
  admissionDate: string;
}

export interface DoctorOption {
  value: string;
  label: string;
}

interface HospitalisationRecordFormProps {
  values: HospitalisationRecordValues;
  onChange: (values: HospitalisationRecordValues) => void;
  doctorOptions: DoctorOption[];
  errors?: Partial<Record<keyof HospitalisationRecordValues, string>>;
  isLoadingDoctors?: boolean;
  /** Renders a read-only summary instead of editable fields — used on the patient summary page. */
  readOnly?: boolean;
  status?: HospitalisationStatus;
  /** Preferred display name for the admitting doctor in read-only mode (falls back to `doctorOptions`). */
  admittingDoctorName?: string;
}

/**
 * Captures the fields needed to admit a patient: ward, bed, admitting doctor and
 * admission date. Discharge date/status are handled elsewhere (a separate discharge
 * action), never at admission time.
 */
export function HospitalisationRecordForm({
  values,
  onChange,
  doctorOptions,
  errors,
  isLoadingDoctors = false,
  readOnly = false,
  status,
  admittingDoctorName,
}: HospitalisationRecordFormProps) {
  function setField<K extends keyof HospitalisationRecordValues>(key: K, value: HospitalisationRecordValues[K]) {
    onChange({ ...values, [key]: value });
  }

  if (readOnly) {
    const doctorLabel =
      admittingDoctorName ?? doctorOptions.find((option) => option.value === values.admittingDoctorId)?.label ?? '—';

    return (
      <div className="mf-hosp-form mf-hosp-form--readonly">
        {status && (
          <Badge tone={status === 'ADMITTED' ? 'amber' : 'neutral'} dot className="mf-hosp-form__status">
            {humanize(status)}
          </Badge>
        )}
        <dl className="mf-hosp-form__summary">
          <div>
            <dt>Ward</dt>
            <dd>{values.ward || '—'}</dd>
          </div>
          <div>
            <dt>Bed</dt>
            <dd>{values.bed || '—'}</dd>
          </div>
          <div>
            <dt>Admitting doctor</dt>
            <dd>{doctorLabel}</dd>
          </div>
          <div>
            <dt>Admission date</dt>
            <dd>{formatDate(values.admissionDate)}</dd>
          </div>
        </dl>
      </div>
    );
  }

  return (
    <div className="mf-hosp-form">
      <div className="mf-hosp-form__grid">
        <Input
          label="Ward *"
          placeholder="e.g. General Ward B"
          value={values.ward}
          error={errors?.ward}
          onChange={(event) => setField('ward', event.target.value)}
        />
        <Input
          label="Bed *"
          placeholder="e.g. B-14"
          value={values.bed}
          error={errors?.bed}
          onChange={(event) => setField('bed', event.target.value)}
        />
        <Select
          label="Admitting doctor *"
          value={values.admittingDoctorId}
          options={doctorOptions}
          placeholder={isLoadingDoctors ? 'Loading doctors…' : 'Select a doctor'}
          error={errors?.admittingDoctorId}
          disabled={isLoadingDoctors}
          onChange={(event) => setField('admittingDoctorId', event.target.value)}
        />
        <Input
          label="Admission date *"
          type="date"
          value={values.admissionDate}
          error={errors?.admissionDate}
          onChange={(event) => setField('admissionDate', event.target.value)}
        />
      </div>
    </div>
  );
}
