import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '../../../../shared/components/Button/Button';
import { Badge } from '../../../../shared/components/Badge/Badge';
import { Alert } from '../../../../shared/components/Alert/Alert';
import { Loading } from '../../../../shared/components/Loading/Loading';
import { useToast } from '../../../../shared/components/Toast/Toast';
import { registrationProfileApi } from '../../../../core/api/services';
import type { RegistrationProfile, RegistrationFieldState } from '../../../../core/api/types';
import { ApiError } from '../../../../core/api/client';

interface Props {
  profile: RegistrationProfile | null;
  onSave?: () => void;
}

const FIELDS = [
  'firstName',
  'lastName',
  'gender',
  'dateOfBirth',
  'bloodGroup',
  'phone',
  'email',
  'address',
  'emergencyContactName',
  'emergencyContactPhone',
];

const FIELD_LABELS: Record<string, string> = {
  firstName: 'First Name',
  lastName: 'Last Name',
  gender: 'Gender',
  dateOfBirth: 'Date of Birth',
  bloodGroup: 'Blood Group',
  phone: 'Phone',
  email: 'Email',
  address: 'Address',
  emergencyContactName: 'Emergency Contact Name',
  emergencyContactPhone: 'Emergency Contact Phone',
};

export default function RegistrationProfileEditor({ profile, onSave }: Props) {
  const { show } = useToast();
  const [startingProfile, setStartingProfile] = useState<'BASIC' | 'COMPREHENSIVE'>(
    profile?.startingProfile ?? 'BASIC'
  );
  const [fieldStates, setFieldStates] = useState<Record<string, RegistrationFieldState>>(
    profile?.fieldStates ?? {}
  );
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (profile) {
      setStartingProfile(profile.startingProfile);
      setFieldStates(profile.fieldStates);
    }
  }, [profile]);

  const requiredCount = Object.values(fieldStates).filter(
    (state) => state === 'REQUIRED'
  ).length;

  const canToggleToRequired = (currentState: RegistrationFieldState): boolean => {
    if (currentState === 'REQUIRED') return true;
    if (startingProfile === 'BASIC' && requiredCount >= 2) return false;
    if (startingProfile === 'COMPREHENSIVE' && requiredCount >= 10) return false;
    return true;
  };

  const canToggleToHidden = (field: string): boolean => {
    if (requiredCount <= 1 && fieldStates[field] === 'REQUIRED') return false;
    if (startingProfile === 'BASIC' && (field === 'firstName' || field === 'email')) return false;
    return true;
  };

  const toggleFieldState = (field: string) => {
    const currentState = fieldStates[field] || 'OPTIONAL';
    let nextState: RegistrationFieldState;

    if (currentState === 'REQUIRED') {
      if (requiredCount <= 1) {
        show({
          title: 'Cannot hide this field',
          description: 'At least one field must remain required.',
          tone: 'warning',
        });
        return;
      }
      nextState = 'OPTIONAL';
    } else if (currentState === 'OPTIONAL') {
      if (startingProfile === 'BASIC' && (field === 'firstName' || field === 'email')) {
        show({
          title: 'Cannot hide this field',
          description: `${FIELD_LABELS[field]} cannot be hidden in BASIC profile.`,
          tone: 'warning',
        });
        return;
      }
      nextState = 'HIDDEN';
    } else {
      if (!canToggleToRequired(currentState)) {
        show({
          title: 'Maximum required fields reached',
          description:
            startingProfile === 'BASIC'
              ? 'BASIC profile can have at most 2 required fields.'
              : 'All fields are already required.',
          tone: 'warning',
        });
        return;
      }
      nextState = 'REQUIRED';
    }

    setFieldStates((current) => ({ ...current, [field]: nextState }));
    setErrors([]);
  };

  const validateBeforeSave = (): boolean => {
    const newErrors: string[] = [];
    const newRequiredCount = Object.values(fieldStates).filter(
      (state) => state === 'REQUIRED'
    ).length;

    if (newRequiredCount === 0) {
      newErrors.push('At least one field must be required.');
    }

    if (startingProfile === 'BASIC' && newRequiredCount > 2) {
      newErrors.push('BASIC profile can have at most 2 required fields.');
    }

    if (startingProfile === 'COMPREHENSIVE' && newRequiredCount < 5) {
      newErrors.push('COMPREHENSIVE profile must have at least 5 required fields.');
    }

    if (startingProfile === 'BASIC') {
      if (fieldStates.firstName !== 'REQUIRED') {
        newErrors.push('First Name must be required in BASIC profile.');
      }
      if (fieldStates.email !== 'REQUIRED') {
        newErrors.push('Email must be required in BASIC profile.');
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateBeforeSave()) {
      show({ title: 'Validation failed', description: errors.join(' '), tone: 'danger' });
      return;
    }

    setIsSaving(true);
    try {
      await registrationProfileApi.save({
        startingProfile,
        fieldStates,
      });
      show({
        title: 'Profile saved',
        description: 'Patient registration profile updated successfully.',
        tone: 'success',
      });
      onSave?.();
    } catch (cause) {
      show({
        title: 'Failed to save profile',
        description: cause instanceof ApiError ? cause.message : 'An error occurred',
        tone: 'danger',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile) {
    return <Loading label="Loading profile..." />;
  }

  const getStateTone = (state: RegistrationFieldState): 'coral' | 'neutral' | 'teal' => {
    switch (state) {
      case 'REQUIRED':
        return 'coral';
      case 'HIDDEN':
        return 'neutral';
      default:
        return 'teal';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mf-space-4)' }}>
      {/* Profile Type Selection */}
      <div style={{ display: 'flex', gap: 'var(--mf-space-3)', alignItems: 'center' }}>
        <label style={{ fontWeight: 600 }}>Profile Type:</label>
        <div style={{ display: 'flex', gap: 'var(--mf-space-2)' }}>
          {(['BASIC', 'COMPREHENSIVE'] as const).map((type) => (
            <label
              key={type}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--mf-space-2)',
                cursor: 'pointer',
              }}
            >
              <input
                type="radio"
                name="startingProfile"
                value={type}
                checked={startingProfile === type}
                onChange={(e) => setStartingProfile(e.target.value as typeof type)}
              />
              {type}
              {type === 'BASIC' && <span style={{ fontSize: '0.85em', color: 'var(--mf-text-muted)' }}>(Up to 2 required)</span>}
              {type === 'COMPREHENSIVE' && <span style={{ fontSize: '0.85em', color: 'var(--mf-text-muted)' }}>(5+ required)</span>}
            </label>
          ))}
        </div>
      </div>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <Alert tone="danger" title="Validation errors">
          <ul style={{ margin: 0, paddingLeft: 'var(--mf-space-4)' }}>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Fields Grid */}
      <div style={{ display: 'grid', gap: 'var(--mf-space-3)' }}>
        {FIELDS.map((field) => {
          const state = fieldStates[field] || 'OPTIONAL';
          const isDisabledForHidden = !canToggleToHidden(field) && state === 'REQUIRED';
          const isDisabledForRequired = !canToggleToRequired(state) && state !== 'REQUIRED';

          return (
            <div
              key={field}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 120px 200px',
                gap: 'var(--mf-space-2)',
                alignItems: 'center',
                padding: 'var(--mf-space-2)',
                borderRadius: 'var(--mf-radius-sm)',
                backgroundColor: 'var(--mf-bg-secondary)',
              }}
            >
              <div>
                <strong>{FIELD_LABELS[field]}</strong>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Badge tone={getStateTone(state)} dot>
                  {state}
                </Badge>
              </div>
              <div style={{ display: 'flex', gap: 'var(--mf-space-1)' }}>
                <Button
                  size="sm"
                  variant={state === 'REQUIRED' ? 'primary' : 'outline'}
                  disabled={state !== 'REQUIRED' && isDisabledForRequired}
                  onClick={() => {
                    if (state !== 'REQUIRED') {
                      const newCount = Object.values(fieldStates).filter(
                        (s) => s === 'REQUIRED'
                      ).length;
                      if (startingProfile === 'BASIC' && newCount >= 2) {
                        show({
                          title: 'Max 2 required fields',
                          description: 'BASIC profile can have at most 2 required fields.',
                          tone: 'warning',
                        });
                        return;
                      }
                      if (startingProfile === 'COMPREHENSIVE' && newCount >= 10) {
                        return;
                      }
                    }
                    toggleFieldState(field);
                  }}
                >
                  Required
                </Button>
                <Button
                  size="sm"
                  variant={state === 'OPTIONAL' ? 'primary' : 'outline'}
                  onClick={() => toggleFieldState(field)}
                >
                  Optional
                </Button>
                <Button
                  size="sm"
                  variant={state === 'HIDDEN' ? 'primary' : 'outline'}
                  disabled={isDisabledForHidden}
                  onClick={() => toggleFieldState(field)}
                >
                  Hidden
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Last Updated */}
      <div style={{ fontSize: '0.85em', color: 'var(--mf-text-muted)' }}>
        Last updated: {profile.updatedAt ? new Date(profile.updatedAt).toLocaleString() : 'Not yet saved'}
      </div>

      {/* Save Button */}
      <Button
        leftIcon={<Save size={16} />}
        isLoading={isSaving}
        onClick={handleSave}
      >
        Save Profile
      </Button>
    </div>
  );
}
