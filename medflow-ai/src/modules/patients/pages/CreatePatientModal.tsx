import { useEffect, useState } from 'react';
import { Alert } from '../../../shared/components/Alert/Alert';
import { Loading } from '../../../shared/components/Loading/Loading';
import { Modal } from '../../../shared/components/Modal/Modal';
import { registrationProfileApi, patientsApi } from '../../../core/api/services';
import type { RegistrationProfile } from '../../../core/api/types';
import { ApiError } from '../../../core/api/client';
import DynamicPatientForm from '../components/DynamicPatientForm/DynamicPatientForm';

interface CreatePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

/** Loads the tenant profile afresh each time a patient registration begins. */
export function CreatePatientModal({ isOpen, onClose, onCreated }: CreatePatientModalProps) {
  const [profile, setProfile] = useState<RegistrationProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setLoadingProfile(true);
    setProfileError(null);
    registrationProfileApi.get()
      .then((result) => {
        if (!cancelled) setProfile(result);
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setProfileError(cause instanceof ApiError ? cause.message : 'Could not load the registration profile.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingProfile(false);
      });
    return () => { cancelled = true; };
  }, [isOpen]);

  async function create(values: Record<string, unknown>) {
    await patientsApi.create(values);
    onCreated();
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Patient"
      description="Fields marked with an asterisk are required by this hospital's registration profile."
      size="lg"
    >
      {loadingProfile ? (
        <Loading label="Loading registration profile…" />
      ) : profileError ? (
        <Alert tone="danger" title="Could not start patient registration">{profileError}</Alert>
      ) : (
        <DynamicPatientForm profile={profile} onSubmit={create} />
      )}
    </Modal>
  );
}
