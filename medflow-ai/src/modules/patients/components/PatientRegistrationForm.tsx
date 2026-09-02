import { useState } from 'react';
import { Plus, Save } from 'lucide-react';
import { patientsApi } from '../../../core/api/services';
import type { RegistrationFieldState } from '../../../core/api/types';
import { useApiResource } from '../../../shared/hooks/useApiResource';
import { Alert } from '../../../shared/components/Alert/Alert';
import { Button } from '../../../shared/components/Button/Button';
import { Card, CardBody, CardHeader, CardSubtitle, CardTitle } from '../../../shared/components/Card/Card';
import { Input } from '../../../shared/components/Input/Input';
import { Loading } from '../../../shared/components/Loading/Loading';

const fields = [
  ['first_name', 'First name', 'text'], ['middle_name', 'Middle name', 'text'], ['last_name', 'Last name', 'text'],
  ['date_of_birth', 'Date of birth', 'date'], ['gender', 'Gender', 'text'], ['biological_sex', 'Biological sex', 'text'],
  ['marital_status', 'Marital status', 'text'], ['preferred_language', 'Preferred language', 'text'],
  ['contact_number', 'Contact number', 'tel'], ['alternate_number', 'Alternate number', 'tel'], ['email', 'Email', 'email'],
  ['address_line_1', 'Address line 1', 'text'], ['address_line_2', 'Address line 2', 'text'], ['city', 'City', 'text'],
  ['state', 'State / province', 'text'], ['postal_code', 'Postal code', 'text'], ['country', 'Country', 'text'],
  ['emergency_contact_name', 'Emergency contact name', 'text'], ['emergency_contact_relation', 'Emergency contact relation', 'text'],
  ['emergency_contact_phone', 'Emergency contact phone', 'tel'], ['insurance_provider', 'Insurance provider', 'text'],
  ['policy_number', 'Policy number', 'text'], ['group_number', 'Group number', 'text'],
  ['primary_cardholder_name', 'Primary cardholder name', 'text'], ['primary_physician_id', 'Primary physician ID', 'number'],
  ['referring_doctor', 'Referring doctor', 'text'], ['allergies_summary', 'Allergies summary', 'text'],
  ['current_medications', 'Current medications', 'text'], ['clinical_notes', 'Clinical notes', 'text'],
] as const;

export function PatientRegistrationForm({ onCreated }: { onCreated: () => void }) {
  const profile = useApiResource(() => patientsApi.registrationProfile(), []);
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (profile.isLoading && !profile.data) return <Loading label="Loading registration policy..." />;
  if (profile.error) return <Alert tone="danger" title="Could not load registration policy">{profile.error}</Alert>;
  if (!profile.data) return null;
  const activeProfile = profile.data;

  const visible = fields.filter(([key]) => activeProfile.fieldStates[key] !== 'HIDDEN');
  const setValue = (key: string, value: string) => setValues((current) => ({ ...current, [key]: value }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const missing = visible.find(([key]) => activeProfile.fieldStates[key] === 'REQUIRED' && !values[key]?.trim());
    if (missing) {
      setError(`${missing[1]} is required.`);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await patientsApi.create({
        firstName: values.first_name,
        lastName: values.last_name,
        dateOfBirth: values.date_of_birth || undefined,
        gender: values.gender || undefined,
        phone: values.contact_number || undefined,
        email: values.email || undefined,
        registrationData: values,
      });
      setValues({});
      onCreated();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not register patient');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card padding="lg">
      <CardHeader>
        <div><CardTitle>Register patient</CardTitle><CardSubtitle>Fields follow this hospital's active registration policy.</CardSubtitle></div>
      </CardHeader>
      <CardBody>
        {error && <Alert tone="danger" title="Registration could not be completed">{error}</Alert>}
        <form onSubmit={submit} style={{ display: 'grid', gap: 'var(--mf-space-4)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--mf-space-3)' }}>
            {visible.map(([key, label, type]) => {
              const state: RegistrationFieldState = activeProfile.fieldStates[key];
              return <Input key={key} label={`${label}${state === 'REQUIRED' ? ' *' : ''}`} type={type} value={values[key] ?? ''} required={state === 'REQUIRED'} onChange={(event) => setValue(key, event.target.value)} />;
            })}
          </div>
          <Button type="submit" leftIcon={<Save size={15} />} isLoading={saving}><Plus size={15} /> Register patient</Button>
        </form>
      </CardBody>
    </Card>
  );
}
