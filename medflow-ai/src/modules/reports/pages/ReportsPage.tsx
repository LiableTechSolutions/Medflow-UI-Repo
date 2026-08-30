import { Activity as ActivityIcon, ArrowUpRight, Download, FileText, IndianRupee, Users } from 'lucide-react';
import { PageHeader } from '../../../shared/components/PageHeader/PageHeader';
import { Button } from '../../../shared/components/Button/Button';
import { Card, CardBody, CardHeader, CardSubtitle, CardTitle } from '../../../shared/components/Card/Card';
import { Badge } from '../../../shared/components/Badge/Badge';
import { Alert } from '../../../shared/components/Alert/Alert';
import { Loading } from '../../../shared/components/Loading/Loading';
import { KpiCard } from '../../dashboard/components/KpiCard';
import { ActivityChart } from '../../dashboard/components/ActivityChart';
import { useApiResource } from '../../../shared/hooks/useApiResource';
import { analyticsApi } from '../../../core/api/services';
import { formatMoney, humanize } from '../../../core/utils/format';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ReportsPage() {
  const summary = useApiResource(() => analyticsApi.dashboard(), []);
  const activity = useApiResource(() => analyticsApi.activity(7), []);

  const kpis = summary.data
    ? [
        {
          label: 'Revenue this month',
          value: formatMoney(summary.data.revenueMonthToDate),
          icon: IndianRupee,
          tone: 'blue' as const,
          delta: 'Live',
          trend: 'up' as const,
          meta: 'Completed consultations',
          variant: 'featured' as const,
        },
        {
          label: 'Patients registered',
          value: String(summary.data.totalPatients),
          icon: Users,
          tone: 'green' as const,
          delta: 'vs last month',
          trend: 'up' as const,
        },
        {
          label: 'Reports completed',
          value: String(summary.data.labReportsCompleted),
          icon: FileText,
          tone: 'amber' as const,
          delta: 'This cycle',
          trend: 'up' as const,
        },
        {
          label: 'Active cases',
          value: String(summary.data.activeCases),
          icon: ActivityIcon,
          tone: 'coral' as const,
          delta: 'Open',
          trend: 'up' as const,
        },
      ]
    : [];

  const chartData = (activity.data ?? []).map((point) => ({
    label: WEEKDAYS[new Date(point.date).getDay()],
    value: point.visits,
  }));

  const overview = summary.data
    ? [
        { label: 'Doctors on staff', value: summary.data.doctorsOnStaff },
        { label: 'Appointments today', value: summary.data.appointmentsToday },
        { label: 'Unread notifications', value: summary.data.unreadNotifications },
      ]
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mf-space-5)' }}>
      <PageHeader
        title="Reports & Analytics"
        description="Operational metrics, visit trends and the latest performance snapshot across the hospital."
        actions={
          <Button variant="outline" leftIcon={<Download size={15} />}>
            Export report
          </Button>
        }
      />

      {summary.error && (
        <Alert tone="danger" title="Could not load the report snapshot">
          {summary.error}
        </Alert>
      )}

      <div style={{ display: 'grid', gap: 'var(--mf-space-4)', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {summary.isLoading && !summary.data ? (
          <div style={{ gridColumn: '1 / -1' }}><Loading label="Loading reports…" /></div>
        ) : (
          kpis.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)
        )}
      </div>

      <div style={{ display: 'grid', gap: 'var(--mf-space-5)', gridTemplateColumns: 'minmax(0, 2fr) minmax(260px, 1fr)' }}>
        <Card padding="lg">
          <CardHeader>
            <div>
              <CardTitle>Patient activity this week</CardTitle>
              <CardSubtitle>Visits recorded across all departments</CardSubtitle>
            </div>
            <Badge tone="teal" dot>
              Last 7 days
            </Badge>
          </CardHeader>
          <CardBody>
            <ActivityChart data={chartData} />
          </CardBody>
        </Card>

        <Card padding="lg">
          <CardHeader>
            <div>
              <CardTitle>Operational snapshot</CardTitle>
              <CardSubtitle>Live clinic status</CardSubtitle>
            </div>
          </CardHeader>
          <CardBody>
            <div style={{ display: 'grid', gap: 'var(--mf-space-3)' }}>
              {overview.map((item) => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--mf-space-2)', borderBottom: '1px solid var(--mf-border)', paddingBottom: 'var(--mf-space-2)' }}>
                  <span style={{ color: 'var(--mf-text-muted)' }}>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--mf-space-2)' }}>
                <span style={{ color: 'var(--mf-text-muted)' }}>Reporting window</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--mf-space-1)', background: 'var(--mf-surface-2)', padding: 'var(--mf-space-1) var(--mf-space-2)', borderRadius: '999px', fontSize: 'var(--mf-fs-sm)' }}>
                  <ArrowUpRight size={12} />
                  30 days
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card padding="lg">
        <CardHeader>
          <div>
            <CardTitle>Performance highlights</CardTitle>
            <CardSubtitle>Key areas to review this cycle</CardSubtitle>
          </div>
        </CardHeader>
        <CardBody>
          <div style={{ display: 'grid', gap: 'var(--mf-space-3)', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            {summary.data ? (
              <>
                <div style={{ background: 'var(--mf-surface-2)', borderRadius: 'var(--mf-radius-md)', padding: 'var(--mf-space-4)' }}>
                  <div style={{ color: 'var(--mf-text-muted)', marginBottom: 'var(--mf-space-2)' }}>Net revenue</div>
                  <strong>{formatMoney(summary.data.revenueMonthToDate)}</strong>
                </div>
                <div style={{ background: 'var(--mf-surface-2)', borderRadius: 'var(--mf-radius-md)', padding: 'var(--mf-space-4)' }}>
                  <div style={{ color: 'var(--mf-text-muted)', marginBottom: 'var(--mf-space-2)' }}>Department focus</div>
                  <strong>{humanize('ACTIVE')}</strong>
                </div>
                <div style={{ background: 'var(--mf-surface-2)', borderRadius: 'var(--mf-space-md)', padding: 'var(--mf-space-4)' }}>
                  <div style={{ color: 'var(--mf-text-muted)', marginBottom: 'var(--mf-space-2)' }}>Monitoring</div>
                  <strong>{summary.data.unreadNotifications} alerts</strong>
                </div>
              </>
            ) : null}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
