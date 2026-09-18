import { Checkbox } from '../Checkbox/Checkbox';

interface HospitalisedCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

/**
 * Toggles whether a patient record carries an active hospitalisation.
 * A thin, semantic wrapper over the base {@link Checkbox} — checking it is what
 * reveals the {@link HospitalisationRecordForm} inline on the create/edit forms.
 */
export function HospitalisedCheckbox({ checked, onChange, disabled = false }: HospitalisedCheckboxProps) {
  return (
    <Checkbox
      label="Patient is hospitalised"
      hint="Reveals admission details — ward, bed, admitting doctor and admission date."
      checked={checked}
      disabled={disabled}
      onChange={(event) => onChange(event.target.checked)}
    />
  );
}
