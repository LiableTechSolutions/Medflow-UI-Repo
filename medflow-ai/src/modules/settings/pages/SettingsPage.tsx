import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { PageHeader } from '../../../shared/components/PageHeader/PageHeader';
import { Card, CardBody, CardHeader, CardSubtitle, CardTitle } from '../../../shared/components/Card/Card';
import { Input } from '../../../shared/components/Input/Input';
import { Select } from '../../../shared/components/Select/Select';
import { Button } from '../../../shared/components/Button/Button';
import { Alert } from '../../../shared/components/Alert/Alert';
import { Loading } from '../../../shared/components/Loading/Loading';
import { Badge } from '../../../shared/components/Badge/Badge';
import { useToast } from '../../../shared/components/Toast/Toast';
import { useApiResource } from '../../../shared/hooks/useApiResource';
import { hospitalApi, settingsApi } from '../../../core/api/services';
import { ApiError } from '../../../core/api/client';
import { useAuth } from '../../../core/auth/AuthContext';
import type { RegistrationFieldState } from '../../../core/api/types';

const registrationFields = [
  ['first_name', 'First name'], ['middle_name', 'Middle name'], ['last_name', 'Last name'],
  ['date_of_birth', 'Date of birth'], ['gender', 'Gender'], ['biological_sex', 'Biological sex'],
  ['marital_status', 'Marital status'], ['preferred_language', 'Preferred language'],
  ['contact_number', 'Contact number'], ['alternate_number', 'Alternate number'], ['email', 'Email'],
  ['address_line_1', 'Address line 1'], ['address_line_2', 'Address line 2'], ['city', 'City'],
  ['state', 'State / province'], ['postal_code', 'Postal code'], ['country', 'Country'],
  ['emergency_contact_name', 'Emergency contact name'], ['emergency_contact_relation', 'Emergency contact relation'],
  ['emergency_contact_phone', 'Emergency contact phone'], ['insurance_provider', 'Insurance provider'],
  ['policy_number', 'Policy number'], ['group_number', 'Group number'],
  ['primary_cardholder_name', 'Primary cardholder name'], ['primary_physician_id', 'Primary physician'],
  ['referring_doctor', 'Referring doctor'], ['allergies_summary', 'Allergies summary'],
  ['current_medications', 'Current medications'], ['clinical_notes', 'Clinical notes'],
] as const;

export default function SettingsPage() {
  const { show } = useToast();
  const { can } = useAuth();
  const hospital = useApiResource(() => hospitalApi.profile(), []);
  const modules = useApiResource(() => hospitalApi.modules(), []);
  const settings = useApiResource(() => settingsApi.list(), []);
  const registrationProfile = useApiResource(() => settingsApi.registrationProfile(), []);

  const [draft, setDraft] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [registrationDraft, setRegistrationDraft] = useState<Record<string, RegistrationFieldState>>({});
  const [registrationTemplate, setRegistrationTemplate] = useState<'BASIC' | 'COMPREHENSIVE'>('BASIC');
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [savingRegistration, setSavingRegistration] = useState(false);

  useEffect(() => {
    if (settings.data) {
      setDraft(Object.fromEntries(settings.data.map((setting) => [setting.key, setting.value])));
    }
  }, [settings.data]);

  useEffect(() => {
    if (registrationProfile.data) {
      setRegistrationDraft(registrationProfile.data.fieldStates);
      setRegistrationTemplate(registrationProfile.data.template);
    }
  }, [registrationProfile.data]);

  const canEdit = can('settings:write');

  async function save(key: string) {
    setSavingKey(key);
    try {
      await settingsApi.save(key, draft[key] ?? '');
      show({ title: 'Setting saved', description: key, tone: 'success' });
    } catch (cause) {
      show({
        title: 'Could not save the setting',
        description: cause instanceof ApiError ? cause.message : undefined,
        tone: 'danger',
      });
    } finally {
      setSavingKey(null);
    }
  }

  function validateRegistration() {
    if (registrationDraft.first_name === 'HIDDEN' || registrationDraft.last_name === 'HIDDEN' || registrationDraft.date_of_birth === 'HIDDEN') {
      return 'First name, last name, and date of birth are baseline safety fields and cannot be hidden.';
    }
    if (registrationDraft.contact_number === 'HIDDEN' && registrationDraft.email === 'HIDDEN') {
      return 'Keep contact number or email visible so staff can reach the patient.';
    }
    return null;
  }

  async function saveRegistration() {
    const error = validateRegistration();
    setRegistrationError(error);
    if (error) return;
    setSavingRegistration(true);
    try {
      await settingsApi.saveRegistrationProfile({
        template: registrationTemplate,
        fieldStates: registrationDraft,
        updatedAt: new Date().toISOString(),
      });
      show({ title: 'Registration policy saved', tone: 'success' });
    } catch (cause) {
      setRegistrationError(cause instanceof ApiError ? cause.message : 'Could not save registration policy');
    } finally {
      setSavingRegistration(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mf-space-5)' }}>
      <PageHeader title="Settings" description="Workspace configuration and licensed modules." />

      {settings.error && (
        <Alert tone="danger" title="Could not load settings">
          {settings.error}
        </Alert>
      )}

      <Card padding="lg">
        <CardHeader>
          <div>
            <CardTitle>Workspace</CardTitle>
            <CardSubtitle>The hospital this account belongs to</CardSubtitle>
          </div>
        </CardHeader>
        <CardBody>
          {hospital.isLoading && !hospital.data ? (
            <Loading />
          ) : hospital.data ? (
            <dl style={{ display: 'grid', gap: 'var(--mf-space-2)', margin: 0 }}>
              <div>
                <strong>{hospital.data.name}</strong> · {hospital.data.hospitalCode}
              </div>
              <div style={{ color: 'var(--mf-text-muted)' }}>
                {[hospital.data.city, hospital.data.phone, hospital.data.email].filter(Boolean).join(' · ')}
              </div>
              <div style={{ color: 'var(--mf-text-muted)' }}>Timezone: {hospital.data.timezone}</div>
            </dl>
          ) : null}
        </CardBody>
      </Card>

      <Card padding="lg">
        <CardHeader>
          <div>
            <CardTitle>Patient registration</CardTitle>
            <CardSubtitle>Choose exactly which fields staff can collect for this hospital.</CardSubtitle>
          </div>
        </CardHeader>
        <CardBody>
          {registrationProfile.error && <Alert tone="danger" title="Could not load registration policy">{registrationProfile.error}</Alert>}
          {registrationError && <Alert tone="danger" title="Registration policy needs attention">{registrationError}</Alert>}
          {registrationProfile.data && (
            <>
              <div style={{ display: 'flex', gap: 'var(--mf-space-3)', alignItems: 'end', marginBottom: 'var(--mf-space-5)' }}>
                <Select label="Starting template" value={registrationTemplate} disabled={!canEdit} options={[
                  { value: 'BASIC', label: 'Basic' }, { value: 'COMPREHENSIVE', label: 'Comprehensive' },
                ]} onChange={(event) => {
                  setRegistrationTemplate(event.target.value as 'BASIC' | 'COMPREHENSIVE');
                  const next = event.target.value === 'COMPREHENSIVE'
                    ? Object.fromEntries(registrationFields.map(([key]) => [key, 'OPTIONAL']))
                    : Object.fromEntries(registrationFields.map(([key]) => [key, 'HIDDEN']));
                  next.first_name = 'REQUIRED'; next.last_name = 'REQUIRED'; next.date_of_birth = 'REQUIRED';
                  if (event.target.value === 'COMPREHENSIVE') next.contact_number = 'REQUIRED';
                  next.email ??= 'OPTIONAL';
                  setRegistrationDraft(next as Record<string, RegistrationFieldState>);
                }} />
                {canEdit && <Button leftIcon={<Save size={15} />} isLoading={savingRegistration} onClick={saveRegistration}>Save policy</Button>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 'var(--mf-space-3)' }}>
                {registrationFields.map(([key, label]) => (
                  <Select key={key} label={label} value={registrationDraft[key] ?? 'HIDDEN'} disabled={!canEdit} options={[
                    { value: 'HIDDEN', label: 'Hidden' }, { value: 'OPTIONAL', label: 'Optional' }, { value: 'REQUIRED', label: 'Required' },
                  ]} onChange={(event) => setRegistrationDraft((current) => ({ ...current, [key]: event.target.value as RegistrationFieldState }))} />
                ))}
              </div>
            </>
          )}
        </CardBody>
      </Card>

      <Card padding="lg">
        <CardHeader>
          <div>
            <CardTitle>Configuration</CardTitle>
            <CardSubtitle>
              {canEdit ? 'Values apply to this hospital only' : 'Read-only — administrators can change these'}
            </CardSubtitle>
          </div>
        </CardHeader>
        <CardBody>
          {settings.isLoading && !settings.data ? (
            <Loading />
          ) : (
            <div style={{ display: 'grid', gap: 'var(--mf-space-4)' }}>
              {(settings.data ?? []).map((setting) => (
                <div
                  key={setting.key}
                  style={{ display: 'flex', gap: 'var(--mf-space-3)', alignItems: 'flex-end' }}
                >
                  <div style={{ flex: 1 }}>
                    <Input
                      label={setting.key}
                      value={draft[setting.key] ?? ''}
                      disabled={!canEdit}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, [setting.key]: event.target.value }))
                      }
                    />
                  </div>
                  {canEdit && (
                    <Button
                      variant="outline"
                      leftIcon={<Save size={15} />}
                      isLoading={savingKey === setting.key}
                      onClick={() => save(setting.key)}
                    >
                      Save
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Card padding="lg">
        <CardHeader>
          <div>
            <CardTitle>Modules</CardTitle>
            <CardSubtitle>What this workspace is licensed for</CardSubtitle>
          </div>
        </CardHeader>
        <CardBody>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--mf-space-2)' }}>
            {(modules.data ?? []).map((module) => (
              <Badge key={module.moduleCode} tone={module.accessible ? 'green' : 'neutral'} dot>
                {module.moduleName}
              </Badge>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
