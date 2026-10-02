import { Printer, Download } from 'lucide-react';
import { Modal } from '../Modal/Modal';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { useToast } from '../Toast/Toast';
import { formatDate, humanize, statusTone } from '../../../core/utils/format';
import { downloadPrescription, printPrescription } from './prescriptionPrint';
import type { Prescription } from '../../../core/api/types';
import './PrescriptionDetailModal.css';

interface PrescriptionDetailModalProps {
  prescription: Prescription | null;
  hospitalName: string | null;
  onClose: () => void;
}

/**
 * Read-only prescription detail with Print/Download. Print uses a hidden iframe and
 * Download a Blob + anchor click — neither opens a new window, so neither can be
 * blocked by a popup blocker the way `window.open` was (confirmed live: it was).
 */
export function PrescriptionDetailModal({ prescription, hospitalName, onClose }: PrescriptionDetailModalProps) {
  const { show } = useToast();
  if (!prescription) return null;

  function runOrReportError(action: () => void, failureTitle: string) {
    if (!prescription) return;
    try {
      action();
    } catch {
      show({ title: failureTitle, tone: 'danger' });
    }
  }

  return (
    <Modal
      isOpen={Boolean(prescription)}
      onClose={onClose}
      title="Prescription"
      description={formatDate(prescription.createdAt)}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="outline"
            leftIcon={<Download size={16} />}
            onClick={() =>
              runOrReportError(
                () => downloadPrescription(prescription, hospitalName),
                "Couldn't download this prescription",
              )
            }
          >
            Download PDF
          </Button>
          <Button
            leftIcon={<Printer size={16} />}
            onClick={() =>
              runOrReportError(() => printPrescription(prescription, hospitalName), "Couldn't open print")
            }
          >
            Print
          </Button>
        </>
      }
    >
      <div className="mf-prescription-detail">
        <div className="mf-prescription-detail__grid">
          <div>
            <p className="mf-prescription-detail__label">Patient</p>
            <p className="mf-prescription-detail__value">{prescription.patientName}</p>
          </div>
          <div>
            <p className="mf-prescription-detail__label">Doctor</p>
            <p className="mf-prescription-detail__value">{prescription.doctorName}</p>
          </div>
        </div>

        <div className="mf-prescription-detail__section">
          <p className="mf-prescription-detail__label">Diagnosis</p>
          <p className="mf-prescription-detail__text">{prescription.diagnosis || '—'}</p>
        </div>

        <div className="mf-prescription-detail__section">
          <p className="mf-prescription-detail__label">Rx</p>
          {prescription.medicines.length === 0 ? (
            <p className="mf-prescription-detail__text">No medicines recorded.</p>
          ) : (
            <table className="mf-prescription-detail__table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Duration</th>
                  <th>Instructions</th>
                </tr>
              </thead>
              <tbody>
                {prescription.medicines.map((item, index) => (
                  <tr key={index}>
                    <td>{item.medicationName}</td>
                    <td>{item.dosage}</td>
                    <td>{item.frequency}</td>
                    <td>{item.durationDays ? `${item.durationDays} days` : '—'}</td>
                    <td>{item.instructions || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mf-prescription-detail__footer">
          <Badge tone={statusTone(prescription.status)} dot>
            {humanize(prescription.status)}
          </Badge>
          <Badge tone={prescription.digitallySigned ? 'green' : 'neutral'}>
            {prescription.digitallySigned ? 'Digitally signed' : 'Draft'}
          </Badge>
        </div>
      </div>
    </Modal>
  );
}
