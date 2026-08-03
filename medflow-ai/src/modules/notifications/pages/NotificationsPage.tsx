import { useState } from 'react';
import { DataPage } from '../../../shared/components/DataPage';
import { Badge } from '../../../shared/components/Badge/Badge';
import { Button } from '../../../shared/components/Button/Button';
import { useToast } from '../../../shared/components/Toast/Toast';
import { notificationsApi } from '../../../core/api/services';
import { ApiError } from '../../../core/api/client';
import { formatDateTime, humanize } from '../../../core/utils/format';
import type { Notification } from '../../../core/api/types';

const SEVERITY_TONE = { INFO: 'teal', WARNING: 'amber', CRITICAL: 'coral' } as const;

export default function NotificationsPage() {
  const { show } = useToast();
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [version, setVersion] = useState(0);

  async function run(action: () => Promise<unknown>, message: string) {
    try {
      await action();
      show({ title: message, tone: 'success' });
      setVersion((v) => v + 1);
    } catch (cause) {
      show({
        title: 'Could not update notifications',
        description: cause instanceof ApiError ? cause.message : undefined,
        tone: 'danger',
      });
    }
  }

  return (
    <DataPage<Notification>
      title="Notifications"
      description="Alerts raised by bookings, schedule conflicts, lab results and stock levels."
      searchable={false}
      rowKey={(row) => row.id}
      deps={[unreadOnly, version]}
      load={({ page, size }) => notificationsApi.list({ page, size, unreadOnly })}
      emptyMessage="Nothing to report."
      actions={
        <Button variant="outline" onClick={() => run(notificationsApi.markAllRead, 'All caught up')}>
          Mark all as read
        </Button>
      }
      toolbar={
        <Button
          size="sm"
          variant={unreadOnly ? 'primary' : 'outline'}
          onClick={() => setUnreadOnly((value) => !value)}
        >
          {unreadOnly ? 'Showing unread' : 'Show unread only'}
        </Button>
      }
      columns={[
        {
          key: 'title',
          header: 'Alert',
          render: (row) => (
            <div>
              <div style={{ fontWeight: row.read ? 400 : 600 }}>{row.title}</div>
              <small style={{ color: 'var(--mf-text-muted)' }}>{row.message}</small>
            </div>
          ),
        },
        { key: 'category', header: 'Category', render: (row) => humanize(row.category) },
        {
          key: 'severity',
          header: 'Severity',
          render: (row) => <Badge tone={SEVERITY_TONE[row.severity]}>{humanize(row.severity)}</Badge>,
        },
        { key: 'when', header: 'Raised', render: (row) => formatDateTime(row.createdAt) },
        {
          key: 'action',
          header: '',
          align: 'right',
          render: (row) =>
            row.read ? (
              <Badge tone="neutral">Read</Badge>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => run(() => notificationsApi.markRead(row.id), 'Marked as read')}
              >
                Mark read
              </Button>
            ),
        },
      ]}
    />
  );
}
