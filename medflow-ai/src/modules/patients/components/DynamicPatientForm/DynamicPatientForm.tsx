import { useState } from 'react';
import { Button } from '../../../../shared/components/Button/Button';
import { Input } from '../../../../shared/components/Input/Input';
import { Alert } from '../../../../shared/components/Alert/Alert';
import { useToast } from '../../../../shared/components/Toast/Toast';
import type { RegistrationFieldState, RegistrationProfile } from '../../../../core/api/types';

interface Props {
  profile: RegistrationProfile | null;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  isLoading?: boolean;
}

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

const GENDERS = ['MALE', 'FEMALE', 'OTHER'];
const BLOOD_GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const FIELD_ORDER = [
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

const DEFAULT_FIELD_STATES: Record<string, RegistrationFieldState> = {
  firstName: 'REQUIRED' as const,
  lastName: 'OPTIONAL' as const,
  gender: 'OPTIONAL' as const,
  dateOfBirth: 'OPTIONAL' as const,
  bloodGroup: 'OPTIONAL' as const,
  phone: 'OPTIONAL' as const,
  email: 'REQUIRED' as const,
  address: 'OPTIONAL' as const,
  emergencyContactName: 'OPTIONAL' as const,
  emergencyContactPhone: 'OPTIONAL' as const,
};

export default function DynamicPatientForm({ profile, onSubmit, isLoading }: Props) {
  const { show } = useToast();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use profile fieldStates if available, otherwise use defaults
  const fieldStates = profile?.fieldStates || DEFAULT_FIELD_STATES;

  // Get visible fields (not HIDDEN)
  const visibleFields = FIELD_ORDER.filter((field) => fieldStates[field] !== 'HIDDEN');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\d{10,}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  const validateDate = (dateStr: string): boolean => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date <= today && !isNaN(date.getTime());
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    visibleFields.forEach((field) => {
      const state = fieldStates[field];
      const value = formData[field]?.trim() || '';

      // Check REQUIRED fields
      if (state === 'REQUIRED' && !value) {
        newErrors[field] = `${FIELD_LABELS[field]} is required`;
      }

      // Validate email format
      if (field === 'email' && value && !validateEmail(value)) {
        newErrors[field] = 'Please enter a valid email address';
      }

      // Validate phone format
      if ((field === 'phone' || field === 'emergencyContactPhone') && value && !validatePhone(value)) {
        newErrors[field] = 'Please enter a valid phone number (at least 10 digits)';
      }

      // Validate date
      if (field === 'dateOfBirth' && value && !validateDate(value)) {
        newErrors[field] = 'Please enter a valid date (not in the future)';
      }
    });

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      show({
        title: 'Validation errors',
        description: 'Please fix the errors below',
        tone: 'danger',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Only include visible fields in submission
      const submissionData: Record<string, unknown> = {};
      visibleFields.forEach((field) => {
        const value = formData[field]?.trim();
        if (value) {
          submissionData[field] = value;
        }
      });

      await onSubmit(submissionData);
      show({
        title: 'Patient created',
        description: 'Patient record has been saved successfully',
        tone: 'success',
      });
      setFormData({});
      setFieldErrors({});
    } catch (cause) {
      show({
        title: 'Failed to create patient',
        description: cause instanceof Error ? cause.message : 'An error occurred',
        tone: 'danger',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: string) => {
    const state = fieldStates[field];
    const value = formData[field] || '';
    const error = fieldErrors[field];
    const isRequired = state === 'REQUIRED';
    const label = `${FIELD_LABELS[field]}${isRequired ? ' *' : ''}`;

    const commonProps = {
      label,
      value,
      error,
      disabled: isLoading || isSubmitting,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData((current) => ({ ...current, [field]: e.target.value }));
        setFieldErrors((current) => ({ ...current, [field]: '' }));
      },
    };

    switch (field) {
      case 'firstName':
      case 'lastName':
      case 'emergencyContactName':
        return (
          <Input key={field} type="text" placeholder={FIELD_LABELS[field]} {...commonProps} />
        );

      case 'email':
        return (
          <Input
            key={field}
            type="email"
            placeholder="name@example.com"
            {...commonProps}
          />
        );

      case 'phone':
      case 'emergencyContactPhone':
        return (
          <Input key={field} type="tel" placeholder="(555) 123-4567" {...commonProps} />
        );

      case 'gender':
        return (
          <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mf-space-1)' }}>
            <label style={{ fontWeight: 500 }}>{label}</label>
            <select
              value={value}
              onChange={(e) => {
                setFormData((current) => ({ ...current, [field]: e.target.value }));
                setFieldErrors((current) => ({ ...current, [field]: '' }));
              }}
              disabled={isLoading || isSubmitting}
              style={{
                padding: 'var(--mf-space-2)',
                borderRadius: 'var(--mf-radius-sm)',
                border: error ? '1px solid var(--mf-tone-danger)' : '1px solid var(--mf-border)',
                backgroundColor: 'var(--mf-bg)',
                fontFamily: 'inherit',
              }}
            >
              <option value="">Select gender</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            {error && <span style={{ color: 'var(--mf-tone-danger)', fontSize: '0.85em' }}>{error}</span>}
          </div>
        );

      case 'dateOfBirth':
        return (
          <Input key={field} type="date" {...commonProps} />
        );

      case 'bloodGroup':
        return (
          <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mf-space-1)' }}>
            <label style={{ fontWeight: 500 }}>{label}</label>
            <select
              value={value}
              onChange={(e) => {
                setFormData((current) => ({ ...current, [field]: e.target.value }));
                setFieldErrors((current) => ({ ...current, [field]: '' }));
              }}
              disabled={isLoading || isSubmitting}
              style={{
                padding: 'var(--mf-space-2)',
                borderRadius: 'var(--mf-radius-sm)',
                border: error ? '1px solid var(--mf-tone-danger)' : '1px solid var(--mf-border)',
                backgroundColor: 'var(--mf-bg)',
                fontFamily: 'inherit',
              }}
            >
              <option value="">Select blood group</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
            {error && <span style={{ color: 'var(--mf-tone-danger)', fontSize: '0.85em' }}>{error}</span>}
          </div>
        );

      case 'address':
        return (
          <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mf-space-1)' }}>
            <label style={{ fontWeight: 500 }}>{label}</label>
            <textarea
              value={value}
              onChange={(e) => {
                setFormData((current) => ({ ...current, [field]: e.target.value }));
                setFieldErrors((current) => ({ ...current, [field]: '' }));
              }}
              disabled={isLoading || isSubmitting}
              placeholder={FIELD_LABELS[field]}
              style={{
                padding: 'var(--mf-space-2)',
                borderRadius: 'var(--mf-radius-sm)',
                border: error ? '1px solid var(--mf-tone-danger)' : '1px solid var(--mf-border)',
                backgroundColor: 'var(--mf-bg)',
                fontFamily: 'inherit',
                minHeight: '100px',
                resize: 'vertical',
              }}
            />
            {error && <span style={{ color: 'var(--mf-tone-danger)', fontSize: '0.85em' }}>{error}</span>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mf-space-4)' }}>
      {visibleFields.length === 0 && (
        <Alert tone="warning" title="No fields configured">
          No patient fields are visible in this profile configuration.
        </Alert>
      )}

      <div style={{ display: 'grid', gap: 'var(--mf-space-3)' }}>
        {visibleFields.map((field) => renderField(field))}
      </div>

      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading || isSubmitting}
        disabled={visibleFields.length === 0}
      >
        Create Patient
      </Button>
    </form>
  );
}
