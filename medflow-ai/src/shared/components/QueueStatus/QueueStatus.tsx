import { Bell, Check, RefreshCw } from 'lucide-react';
import { Badge } from '../Badge/Badge';
import { formatDateTime, humanize, statusTone } from '../../../core/utils/format';
import type { QueueStatus as QueueStatusData } from '../../../core/api/types';
import './QueueStatus.css';

const MAX_AHEAD_DOTS = 4;
const MAX_BEHIND_DOTS = 2;

export interface QueueStatusProps {
  queue: QueueStatusData;
  doctorName: string;
  scheduledAt: string;
  hospitalName?: string;
  /** When this reading was fetched — shown as "Updated at …". Omit while still loading. */
  lastUpdatedAt?: Date;
  /** The threshold (in patients ahead) at which a reminder notification fires. */
  reminderThreshold?: number;
}

/**
 * Patient-facing live queue view: position, a visual line of who's ahead/behind, and
 * the reminder threshold. Purely presentational — the page polling `queueStatus` owns
 * the refresh cadence and passes the latest reading in as props.
 */
export function QueueStatus({
  queue,
  doctorName,
  scheduledAt,
  hospitalName,
  lastUpdatedAt,
  reminderThreshold = 5,
}: QueueStatusProps) {
  const isClosed = queue.position === 0;
  const behindCount = Math.max(queue.totalActive - queue.position, 0);
  const aheadDots = Math.min(queue.aheadCount, MAX_AHEAD_DOTS);
  const aheadOverflow = queue.aheadCount - aheadDots;
  const behindDots = Math.min(behindCount, MAX_BEHIND_DOTS);
  const behindOverflow = behindCount - behindDots;

  return (
    <div className="mf-queue-status">
      <div className="mf-queue-status__header">
        <div>
          <p className="mf-queue-status__doctor">{doctorName}</p>
          <p className="mf-queue-status__when">
            {formatDateTime(scheduledAt)}
            {hospitalName ? ` · ${hospitalName}` : ''}
          </p>
        </div>
        <Badge tone={statusTone(queue.status)} dot>
          {humanize(queue.status)}
        </Badge>
      </div>

      {isClosed ? (
        <div className="mf-queue-status__panel">
          <p className="mf-queue-status__panel-label">This appointment is no longer in the queue</p>
          <p className="mf-queue-status__panel-value">{humanize(queue.status)}</p>
        </div>
      ) : (
        <>
          <div className="mf-queue-status__panel">
            <p className="mf-queue-status__panel-label">Your position in queue</p>
            <p className="mf-queue-status__panel-value">
              {queue.position}
              <span className="mf-queue-status__panel-value-total"> of {queue.totalActive}</span>
            </p>
            <p className="mf-queue-status__panel-sub">
              {queue.aheadCount === 0
                ? "You're next"
                : `${queue.aheadCount} patient${queue.aheadCount === 1 ? '' : 's'} ahead of you`}
            </p>
          </div>

          <div className="mf-queue-status__track" role="img" aria-label={`Position ${queue.position} of ${queue.totalActive} — ${queue.aheadCount} patients ahead, ${behindCount} behind`}>
            {aheadOverflow > 0 && <span className="mf-queue-status__overflow">+{aheadOverflow}</span>}
            {Array.from({ length: aheadDots }).map((_, i) => (
              <span key={`ahead-${i}`} className="mf-queue-status__dot mf-queue-status__dot--done">
                <Check size={13} aria-hidden="true" />
              </span>
            ))}
            <span className="mf-queue-status__dot mf-queue-status__dot--you">You</span>
            {Array.from({ length: behindDots }).map((_, i) => (
              <span key={`behind-${i}`} className="mf-queue-status__dot mf-queue-status__dot--waiting" />
            ))}
            {behindOverflow > 0 && <span className="mf-queue-status__overflow">+{behindOverflow}</span>}
          </div>

          <div className="mf-queue-status__reminder">
            <Bell size={16} aria-hidden="true" />
            <span>We'll send a reminder when you're {reminderThreshold} patients away</span>
          </div>
        </>
      )}

      {lastUpdatedAt && (
        <div className="mf-queue-status__updated">
          <RefreshCw size={13} aria-hidden="true" />
          <span>Updated at {lastUpdatedAt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>
      )}
    </div>
  );
}
