import { useEffect, useState, type FormEvent } from 'react';
import { Minus, Plus, Wrench } from 'lucide-react';
import { PageHeader } from '../../../shared/components/PageHeader/PageHeader';
import { Card, CardBody, CardHeader, CardTitle } from '../../../shared/components/Card/Card';
import { Badge } from '../../../shared/components/Badge/Badge';
import { Button } from '../../../shared/components/Button/Button';
import { Alert } from '../../../shared/components/Alert/Alert';
import { Input } from '../../../shared/components/Input/Input';
import { Loading } from '../../../shared/components/Loading/Loading';
import { Modal } from '../../../shared/components/Modal/Modal';
import { SearchableSelect } from '../../../shared/components/SearchableSelect/SearchableSelect';
import { useToast } from '../../../shared/components/Toast/Toast';
import { useApiResource } from '../../../shared/hooks/useApiResource';
import { useAuth } from '../../../core/auth/AuthContext';
import { ApiError } from '../../../core/api/client';
import { bedsApi, patientsApi } from '../../../core/api/services';
import type { Bed, BedStatus, Ward } from '../../../core/api/types';
import './BedManagementPage.css';

const STATUS_LABEL: Record<BedStatus, string> = {
  AVAILABLE: 'Available',
  OCCUPIED: 'Occupied',
  MAINTENANCE: 'Maintenance',
};
const STATUS_TONE: Record<BedStatus, 'green' | 'coral' | 'amber'> = {
  AVAILABLE: 'green',
  OCCUPIED: 'coral',
  MAINTENANCE: 'amber',
};

type CountAction = { ward: Ward; mode: 'add' | 'reduce' };

export default function BedManagementPage() {
  const { user } = useAuth();
  const { show } = useToast();
  const isAdmin = user?.roleCode === 'ADMIN';
  const isWardStaff = isAdmin || user?.roleCode === 'NURSE';

  const [version, setVersion] = useState(0);
  const [selectedWardId, setSelectedWardId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [countAction, setCountAction] = useState<CountAction | null>(null);
  const [assigning, setAssigning] = useState<Bed | null>(null);

  const summary = useApiResource(() => bedsApi.summary(), [version]);
  const wards = useApiResource(() => bedsApi.wards(), [version]);
  const beds = useApiResource(
    () => (selectedWardId ? bedsApi.beds(selectedWardId) : Promise.resolve<Bed[]>([])),
    [selectedWardId, version],
  );

  // Open the first ward by default, and recover if the selected one no longer exists.
  useEffect(() => {
    const list = wards.data ?? [];
    if (list.length === 0) return;
    if (!list.some((ward) => ward.id === selectedWardId)) setSelectedWardId(list[0].id);
  }, [wards.data, selectedWardId]);

  const refresh = () => setVersion((v) => v + 1);
  const selectedWard = wards.data?.find((ward) => ward.id === selectedWardId);

  async function run(action: () => Promise<unknown>, success: string, failure: string) {
    try {
      await action();
      show({ title: success, tone: 'success' });
      refresh();
    } catch (cause) {
      show({ title: failure, description: cause instanceof ApiError ? cause.message : undefined, tone: 'danger' });
    }
  }

  return (
    <div className="mf-beds">
      <PageHeader
        title="Bed Management"
        description="Wards, bed capacity and who is in which bed."
        actions={
          isAdmin && (
            <Button leftIcon={<Plus size={16} />} onClick={() => setIsCreating(true)}>
              New ward
            </Button>
          )
        }
      />

      {summary.data && (
        <div className="mf-beds__summary">
          <Metric label="Total beds" value={summary.data.totalBeds} />
          <Metric label="Available" value={summary.data.availableBeds} tone="green" />
          <Metric label="Occupied" value={summary.data.occupiedBeds} tone="coral" />
          <Metric label="Maintenance" value={summary.data.maintenanceBeds} tone="amber" />
          <Metric label="Occupancy" value={`${summary.data.occupancyPercent}%`} />
        </div>
      )}

      {wards.error && (
        <Alert tone="danger" title="Could not load wards">
          {wards.error}
        </Alert>
      )}

      {wards.isLoading && !wards.data ? (
        <Loading label="Loading wards…" />
      ) : (wards.data ?? []).length === 0 ? (
        <Card padding="lg">
          <CardBody>
            <p className="mf-beds__empty">
              No wards yet.{isAdmin ? ' Create one to start tracking beds.' : ' An admin needs to create one.'}
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="mf-beds__layout">
          <div className="mf-beds__wards">
            {(wards.data ?? []).map((ward) => (
              <button
                key={ward.id}
                type="button"
                className={`mf-beds__ward${ward.id === selectedWardId ? ' mf-beds__ward--active' : ''}`}
                onClick={() => setSelectedWardId(ward.id)}
              >
                <span className="mf-beds__ward-name">{ward.name}</span>
                <span className="mf-beds__ward-meta">
                  {ward.occupiedBeds}/{ward.totalBeds} occupied
                  {ward.maintenanceBeds > 0 ? ` · ${ward.maintenanceBeds} maintenance` : ''}
                </span>
              </button>
            ))}
          </div>

          <Card padding="lg">
            <CardHeader>
              <CardTitle>{selectedWard ? `${selectedWard.name} · ${selectedWard.totalBeds} beds` : 'Beds'}</CardTitle>
              {isAdmin && selectedWard && (
                <div className="mf-beds__capacity">
                  <Button size="sm" variant="outline" leftIcon={<Plus size={14} />} onClick={() => setCountAction({ ward: selectedWard, mode: 'add' })}>
                    Add beds
                  </Button>
                  <Button size="sm" variant="outline" leftIcon={<Minus size={14} />} onClick={() => setCountAction({ ward: selectedWard, mode: 'reduce' })}>
                    Reduce beds
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardBody>
              {beds.error && (
                <Alert tone="danger" title="Could not load beds">
                  {beds.error}
                </Alert>
              )}
              {beds.isLoading && !beds.data ? (
                <Loading label="Loading beds…" />
              ) : (beds.data ?? []).length === 0 ? (
                <p className="mf-beds__empty">This ward has no beds.{isAdmin ? ' Use "Add beds".' : ''}</p>
              ) : (
                <div className="mf-beds__grid">
                  {(beds.data ?? []).map((bed) => (
                    <div key={bed.id} className={`mf-bed mf-bed--${bed.status.toLowerCase()}`}>
                      <div className="mf-bed__top">
                        <strong>{bed.bedNumber}</strong>
                        <Badge tone={STATUS_TONE[bed.status]} dot>
                          {STATUS_LABEL[bed.status]}
                        </Badge>
                      </div>
                      <p className="mf-bed__patient">{bed.patientName ?? (bed.status === 'MAINTENANCE' ? 'Out of service' : 'Free')}</p>
                      {isWardStaff && (
                        <div className="mf-bed__actions">
                          {bed.status === 'AVAILABLE' && (
                            <>
                              <Button size="sm" onClick={() => setAssigning(bed)}>
                                Assign
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                aria-label={`Put ${bed.bedNumber} into maintenance`}
                                leftIcon={<Wrench size={14} />}
                                onClick={() => run(() => bedsApi.setMaintenance(bed.id, true), `${bed.bedNumber} in maintenance`, 'Could not update the bed')}
                              />
                            </>
                          )}
                          {bed.status === 'OCCUPIED' && (
                            <Button size="sm" variant="outline" onClick={() => run(() => bedsApi.release(bed.id), `${bed.bedNumber} released`, 'Could not release the bed')}>
                              Release
                            </Button>
                          )}
                          {bed.status === 'MAINTENANCE' && (
                            <Button size="sm" variant="outline" onClick={() => run(() => bedsApi.setMaintenance(bed.id, false), `${bed.bedNumber} back in service`, 'Could not update the bed')}>
                              Back in service
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}

      <NewWardModal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onCreate={async (payload) => {
          await bedsApi.createWard(payload);
          show({ title: `${payload.name} created`, tone: 'success' });
          setIsCreating(false);
          refresh();
        }}
      />
      <CountModal
        action={countAction}
        onClose={() => setCountAction(null)}
        onConfirm={async (action, count) => {
          if (action.mode === 'add') await bedsApi.addBeds(action.ward.id, count);
          else await bedsApi.reduceBeds(action.ward.id, count);
          show({ title: `${count} bed(s) ${action.mode === 'add' ? 'added to' : 'removed from'} ${action.ward.name}`, tone: 'success' });
          setCountAction(null);
          refresh();
        }}
      />
      <AssignModal
        bed={assigning}
        onClose={() => setAssigning(null)}
        onAssign={async (bed, patientId) => {
          await bedsApi.assign(bed.id, patientId);
          show({ title: `${bed.bedNumber} assigned`, tone: 'success' });
          setAssigning(null);
          refresh();
        }}
      />
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: number | string; tone?: 'green' | 'coral' | 'amber' }) {
  return (
    <div className={`mf-beds__metric${tone ? ` mf-beds__metric--${tone}` : ''}`}>
      <span className="mf-beds__metric-value">{value}</span>
      <span className="mf-beds__metric-label">{label}</span>
    </div>
  );
}

function errorText(cause: unknown, fallback: string) {
  return cause instanceof ApiError ? cause.message : fallback;
}

function NewWardModal({
  isOpen,
  onClose,
  onCreate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: { name: string; wardType?: string; bedCount: number }) => Promise<void>;
}) {
  const [name, setName] = useState('');
  const [wardType, setWardType] = useState('');
  const [bedCount, setBedCount] = useState('4');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setWardType('');
      setBedCount('4');
      setError(null);
    }
  }, [isOpen]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const count = Number(bedCount);
    if (!name.trim()) return setError('Give the ward a name.');
    if (!Number.isInteger(count) || count < 0 || count > 200) return setError('Bed count must be a whole number from 0 to 200.');
    setBusy(true);
    setError(null);
    try {
      await onCreate({ name: name.trim(), wardType: wardType.trim() || undefined, bedCount: count });
    } catch (cause) {
      setError(errorText(cause, 'Could not create the ward'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New ward"
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="new-ward-form" isLoading={busy}>
            Create ward
          </Button>
        </>
      }
    >
      {error && (
        <Alert tone="danger" title="Could not create the ward">
          {error}
        </Alert>
      )}
      <form id="new-ward-form" onSubmit={submit} className="mf-beds__form">
        <Input label="Ward name *" placeholder="ICU" value={name} onChange={(event) => setName(event.target.value)} />
        <Input label="Type" placeholder="General, ICU, Private…" value={wardType} onChange={(event) => setWardType(event.target.value)} />
        <Input label="Number of beds" type="number" min={0} max={200} value={bedCount} onChange={(event) => setBedCount(event.target.value)} />
      </form>
    </Modal>
  );
}

function CountModal({
  action,
  onClose,
  onConfirm,
}: {
  action: CountAction | null;
  onClose: () => void;
  onConfirm: (action: CountAction, count: number) => Promise<void>;
}) {
  const [count, setCount] = useState('1');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setCount('1');
    setError(null);
  }, [action]);

  if (!action) return null;
  const reducing = action.mode === 'reduce';

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!action) return;
    const value = Number(count);
    if (!Number.isInteger(value) || value < 1 || value > 200) return setError('Enter a whole number from 1 to 200.');
    setBusy(true);
    setError(null);
    try {
      await onConfirm(action, value);
    } catch (cause) {
      setError(errorText(cause, 'Could not change the bed count'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`${reducing ? 'Reduce' : 'Add'} beds · ${action.ward.name}`}
      description={
        reducing
          ? `${action.ward.availableBeds} free bed(s) can be removed. Occupied and maintenance beds always stay.`
          : 'New beds are numbered on from the highest existing bed.'
      }
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="bed-count-form" variant={reducing ? 'danger' : 'primary'} isLoading={busy}>
            {reducing ? 'Remove beds' : 'Add beds'}
          </Button>
        </>
      }
    >
      {error && (
        <Alert tone="danger" title="Could not change the bed count">
          {error}
        </Alert>
      )}
      <form id="bed-count-form" onSubmit={submit} className="mf-beds__form">
        <Input label="Number of beds" type="number" min={1} max={200} value={count} onChange={(event) => setCount(event.target.value)} />
      </form>
    </Modal>
  );
}

function AssignModal({
  bed,
  onClose,
  onAssign,
}: {
  bed: Bed | null;
  onClose: () => void;
  onAssign: (bed: Bed, patientId: number) => Promise<void>;
}) {
  const [patientId, setPatientId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setPatientId('');
    setError(null);
  }, [bed]);

  if (!bed) return null;

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!bed) return;
    if (!patientId) return setError('Choose a patient.');
    setBusy(true);
    setError(null);
    try {
      await onAssign(bed, Number(patientId));
    } catch (cause) {
      setError(errorText(cause, 'Could not assign the bed'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Assign ${bed.bedNumber}`}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="assign-bed-form" isLoading={busy}>
            Assign patient
          </Button>
        </>
      }
    >
      {error && (
        <Alert tone="danger" title="Could not assign the bed">
          {error}
        </Alert>
      )}
      <form id="assign-bed-form" onSubmit={submit} className="mf-beds__form">
        <SearchableSelect
          label="Patient *"
          placeholder="Search patients…"
          value={patientId}
          onChange={setPatientId}
          loadOptions={async () =>
            (await patientsApi.list({ size: 100 })).content.map((patient) => ({
              value: String(patient.id),
              label: `${patient.fullName} · ${patient.patientCode}`,
            }))
          }
        />
      </form>
    </Modal>
  );
}
