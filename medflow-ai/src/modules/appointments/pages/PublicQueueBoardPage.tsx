import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { Loading } from '../../../shared/components/Loading/Loading';
import { Alert } from '../../../shared/components/Alert/Alert';
import { Badge } from '../../../shared/components/Badge/Badge';
import { publicQueueApi } from '../../../core/api/services';
import { ApiError } from '../../../core/api/client';
import { formatDate, humanize, statusTone } from '../../../core/utils/format';
import { todayDateOnly } from '../../../core/utils/validation';
import type { PublicQueueBoard } from '../../../core/api/types';
import './PublicQueueBoardPage.css';

const POLL_INTERVAL_MS = 20_000;

/**
 * No login, no app shell — this is the link a patient gets in their booking
 * notification, and what a waiting-room TV points at. Read-only: it can only ever GET
 * the public queue board endpoint, never mutate anything.
 */
export default function PublicQueueBoardPage() {
  const { hospitalCode } = useParams<{ hospitalCode: string }>();
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctorId');
  const date = searchParams.get('date') ?? todayDateOnly();

  const [board, setBoard] = useState<PublicQueueBoard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date>();

  useEffect(() => {
    if (!hospitalCode || !doctorId) {
      setError('This link is missing a doctor to show — check the URL has a doctorId.');
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    function load() {
      publicQueueApi.board(hospitalCode!, Number(doctorId), date)
        .then((result) => {
          if (cancelled) return;
          setBoard(result);
          setError(null);
          setLastUpdatedAt(new Date());
        })
        .catch((cause) => {
          if (cancelled) return;
          setError(cause instanceof ApiError ? cause.message : 'Could not load the queue');
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    }
    load();
    const timer = setInterval(load, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [hospitalCode, doctorId, date]);

  return (
    <div className="mf-public-queue">
      {isLoading && !board ? (
        <Loading label="Loading queue…" fullHeight />
      ) : error && !board ? (
        <div className="mf-public-queue__card">
          <Alert tone="danger" title="Could not load this queue">
            {error}
          </Alert>
        </div>
      ) : board ? (
        <div className="mf-public-queue__card">
          <p className="mf-public-queue__hospital">{board.hospitalName}</p>
          <h1 className="mf-public-queue__doctor">
            {board.doctorName}
            {board.specialty ? ` · ${board.specialty}` : ''}
          </h1>
          <p className="mf-public-queue__date">{formatDate(board.date)}</p>

          <div className="mf-public-queue__panel">
            <p className="mf-public-queue__panel-label">Now serving</p>
            <p className="mf-public-queue__panel-value">
              {board.nowServingQueueNumber ?? '—'}
              <span className="mf-public-queue__panel-value-total"> of {board.totalActive}</span>
            </p>
            {board.nowServingPatientName && <p className="mf-public-queue__panel-sub">{board.nowServingPatientName}</p>}
          </div>

          {board.upcoming.length > 0 && (
            <div className="mf-public-queue__next">
              <p className="mf-public-queue__next-label">Next up</p>
              <div className="mf-public-queue__next-list">
                {board.upcoming.map((entry, index) => (
                  <span key={`${entry.queueNumber}-${index}`} className="mf-public-queue__next-pill">
                    <span className="mf-public-queue__next-number">#{entry.queueNumber ?? '—'}</span>
                    <span className="mf-public-queue__next-name">{entry.patientName}</span>
                    <Badge tone={statusTone(entry.status)} dot className="mf-public-queue__next-badge">
                      {humanize(entry.status)}
                    </Badge>
                  </span>
                ))}
              </div>
            </div>
          )}

          {lastUpdatedAt && (
            <div className="mf-public-queue__updated">
              <RefreshCw size={13} aria-hidden="true" />
              <span>Updated at {lastUpdatedAt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
