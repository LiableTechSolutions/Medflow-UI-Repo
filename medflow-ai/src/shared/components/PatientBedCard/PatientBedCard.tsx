import { useEffect, useState, type FormEvent } from 'react';
import { BedDouble } from 'lucide-react';
import { Alert } from '../Alert/Alert';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card, CardBody, CardHeader, CardTitle } from '../Card/Card';
import { Loading } from '../Loading/Loading';
import { Modal } from '../Modal/Modal';
import { Select } from '../Select/Select';
import { useToast } from '../Toast/Toast';
import { useApiResource } from '../../hooks/useApiResource';
import { ApiError } from '../../../core/api/client';
import { bedsApi } from '../../../core/api/services';
import { formatDateTime } from '../../../core/utils/format';
import './PatientBedCard.css';

interface PatientBedCardProps {
  patientId: number;
  /** Admins and nurses can assign and release; everyone else just sees the bed. */
  canManage: boolean;
  /**
   * Changes when the patient's stay changes (e.g. discharge). The server frees the bed a
   * moment after the discharge commits, so the card re-reads shortly after this changes.
   */
  stayKey?: unknown;
}

/** Which bed the patient is in, with assign / release for ward staff. */
export function PatientBedCard({ patientId, canManage, stayKey }: PatientBedCardProps) {
  const { show } = useToast();
  const [version, setVersion] = useState(0);
  const [isPicking, setIsPicking] = useState(false);
  const [releasing, setReleasing] = useState(false);

  const bed = useApiResource(() => bedsApi.ofPatient(patientId), [patientId, version]);

  useEffect(() => {
    const timer = setTimeout(() => setVersion((v) => v + 1), 1500);
    return () => clearTimeout(timer);
  }, [stayKey]);

  async function release() {
    if (!bed.data) return;
    setReleasing(true);
    try {
      await bedsApi.release(bed.data.id);
      show({ title: `${bed.data.bedNumber} released`, tone: 'success' });
      setVersion((v) => v + 1);
    } catch (cause) {
      show({
        title: 'Could not release the bed',
        description: cause instanceof ApiError ? cause.message : undefined,
        tone: 'danger',
      });
    } finally {
      setReleasing(false);
    }
  }

  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Bed</CardTitle>
        {bed.data ? <Badge tone="coral" dot>Occupied</Badge> : <Badge tone="neutral">No bed</Badge>}
      </CardHeader>
      <CardBody>
        {bed.error && (
          <Alert tone="danger" title="Could not load the bed">
            {bed.error}
          </Alert>
        )}
        {bed.isLoading && !bed.data && !bed.error ? (
          <Loading label="Loading bed…" />
        ) : bed.data ? (
          <div className="mf-patient-bed">
            <div>
              <p className="mf-patient-bed__name">
                <BedDouble size={16} aria-hidden /> {bed.data.bedNumber}
              </p>
              {bed.data.occupiedAt && (
                <p className="mf-patient-bed__since">Since {formatDateTime(bed.data.occupiedAt)}</p>
              )}
            </div>
            {canManage && (
              <Button size="sm" variant="outline" isLoading={releasing} onClick={release}>
                Release bed
              </Button>
            )}
          </div>
        ) : (
          <div className="mf-patient-bed">
            <p className="mf-patient-bed__since">This patient isn't in a bed.</p>
            {canManage && (
              <Button size="sm" leftIcon={<BedDouble size={14} />} onClick={() => setIsPicking(true)}>
                Assign bed
              </Button>
            )}
          </div>
        )}
      </CardBody>

      <AssignBedModal
        isOpen={isPicking}
        onClose={() => setIsPicking(false)}
        onAssign={async (bedId) => {
          await bedsApi.assign(bedId, patientId);
          show({ title: 'Bed assigned', tone: 'success' });
          setIsPicking(false);
          setVersion((v) => v + 1);
        }}
      />
    </Card>
  );
}

function AssignBedModal({
  isOpen,
  onClose,
  onAssign,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (bedId: number) => Promise<void>;
}) {
  const free = useApiResource(() => (isOpen ? bedsApi.available() : Promise.resolve([])), [isOpen]);
  const [bedId, setBedId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setBedId('');
      setError(null);
    }
  }, [isOpen]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!bedId) return setError('Choose a bed.');
    setBusy(true);
    setError(null);
    try {
      await onAssign(Number(bedId));
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'Could not assign the bed');
    } finally {
      setBusy(false);
    }
  }

  const options = (free.data ?? []).map((bed) => ({ value: String(bed.id), label: bed.bedNumber }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign a bed"
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="patient-bed-form" isLoading={busy} disabled={options.length === 0}>
            Assign bed
          </Button>
        </>
      }
    >
      {error && (
        <Alert tone="danger" title="Could not assign the bed">
          {error}
        </Alert>
      )}
      {free.data && options.length === 0 ? (
        <Alert tone="warning" title="No free beds">
          Every bed is occupied or under maintenance. Free one up, or ask an admin to add beds.
        </Alert>
      ) : (
        <form id="patient-bed-form" onSubmit={submit}>
          <Select
            label="Free bed *"
            placeholder={free.isLoading ? 'Loading beds…' : 'Select a bed'}
            options={options}
            value={bedId}
            onChange={(event) => setBedId(event.target.value)}
          />
        </form>
      )}
    </Modal>
  );
}
