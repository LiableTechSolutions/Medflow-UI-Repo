import { useMemo, useState } from 'react';
import { Users, Stethoscope, CalendarClock, FileText, IndianRupee, Activity as ActivityIcon, Bell, Plus } from 'lucide-react';
import { PageHeader } from '../../../shared/components/PageHeader/PageHeader';
import { Button } from '../../../shared/components/Button/Button';
import { Card, CardHeader, CardTitle, CardSubtitle, CardBody } from '../../../shared/components/Card/Card';
import { Table, type TableColumn } from '../../../shared/components/Table/Table';
import { Badge } from '../../../shared/components/Badge/Badge';
import { Avatar } from '../../../shared/components/Avatar/Avatar';
import { Pagination } from '../../../shared/components/Pagination/Pagination';
import { useToast } from '../../../shared/components/Toast/Toast';
import { KpiCard } from '../components/KpiCard';
import { ActivityChart } from '../components/ActivityChart';
import { CalendarWidget } from '../components/CalendarWidget';
import { ActivityTimeline } from '../components/ActivityTimeline';
import './DashboardPage.css';

const KPIS = [
  { label: 'Revenue (MTD)', value: '₹18.4L', delta: '2.8%', trend: 'up' as const, icon: IndianRupee, variant: 'featured' as const, meta: 'Target ₹22L' },
  { label: 'Total Patients', value: '4,218', delta: '4.2%', trend: 'up' as const, icon: Users, tone: 'blue' as const },
  { label: 'Doctors on staff', value: '86', delta: '1.1%', trend: 'up' as const, icon: Stethoscope, tone: 'green' as const },
  { label: 'Appointments today', value: '132', delta: '3.4%', trend: 'down' as const, icon: CalendarClock, tone: 'amber' as const },
  { label: 'Reports filed', value: '957', delta: '6.7%', trend: 'up' as const, icon: FileText, tone: 'coral' as const },
  { label: 'Active cases', value: '312', delta: '0.9%', trend: 'down' as const, icon: ActivityIcon, tone: 'green' as const },
];

interface Appointment {
  id: number;
  patient: string;
  doctor: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

const APPOINTMENTS: Appointment[] = [
  { id: 1, patient: 'Meera Joshi', doctor: 'Dr. Kabir Shah', time: '09:30 AM', status: 'Confirmed' },
  { id: 2, patient: 'Rohan Verma', doctor: 'Dr. Sana Iyer', time: '10:15 AM', status: 'Pending' },
  { id: 3, patient: 'Priya Nair', doctor: 'Dr. Arjun Mehta', time: '11:00 AM', status: 'Confirmed' },
  { id: 4, patient: 'Devansh Rao', doctor: 'Dr. Kabir Shah', time: '01:45 PM', status: 'Cancelled' },
  { id: 5, patient: 'Ishita Kapoor', doctor: 'Dr. Sana Iyer', time: '03:20 PM', status: 'Confirmed' },
];

const appointmentColumns: TableColumn<Appointment>[] = [
  {
    key: 'patient',
    header: 'Patient',
    render: (row) => (
      <div className="mf-dash-table__cell">
        <Avatar name={row.patient} size="sm" />
        <span>{row.patient}</span>
      </div>
    ),
  },
  { key: 'doctor', header: 'Doctor', render: (row) => row.doctor },
  { key: 'time', header: 'Time', render: (row) => row.time },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Badge tone={row.status === 'Confirmed' ? 'green' : row.status === 'Pending' ? 'amber' : 'coral'} dot>
        {row.status}
      </Badge>
    ),
  },
];

interface Patient {
  id: number;
  name: string;
  condition: string;
  lastVisit: string;
}

const PATIENTS: Patient[] = [
  { id: 1, name: 'Ananya Gupta', condition: 'Routine checkup', lastVisit: 'Jul 16, 2026' },
  { id: 2, name: 'Farhan Ali', condition: 'Post-op follow-up', lastVisit: 'Jul 15, 2026' },
  { id: 3, name: 'Kavya Reddy', condition: 'Diabetes management', lastVisit: 'Jul 14, 2026' },
  { id: 4, name: 'Sameer Khan', condition: 'Cardiology review', lastVisit: 'Jul 12, 2026' },
];

const APPOINTMENTS_PAGE_SIZE = 2;

export default function DashboardPage() {
  const { show } = useToast();
  const [appointmentsPage, setAppointmentsPage] = useState(1);

  const pagedAppointments = useMemo(() => {
    const start = (appointmentsPage - 1) * APPOINTMENTS_PAGE_SIZE;
    return APPOINTMENTS.slice(start, start + APPOINTMENTS_PAGE_SIZE);
  }, [appointmentsPage]);

  const totalAppointmentPages = Math.ceil(APPOINTMENTS.length / APPOINTMENTS_PAGE_SIZE);

  return (
    <div className="mf-dashboard">
      <PageHeader
        title="Dashboard"
        description="Here's what's moving across your clinic today."
        actions={
          <>
            <Button variant="outline" leftIcon={<Bell size={15} />}>Notifications</Button>
            <Button
              leftIcon={<Plus size={15} />}
              onClick={() =>
                show({
                  title: 'Appointment scheduling',
                  description: 'Opening the new appointment form…',
                  tone: 'info',
                })
              }
            >
              New appointment
            </Button>
          </>
        }
      />

      <div className="mf-dashboard__kpis">
        {KPIS.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="mf-dashboard__grid">
        <div className="mf-dashboard__col mf-dashboard__col--main">
          <Card padding="lg">
            <CardHeader>
              <div>
                <CardTitle>Patient activity this week</CardTitle>
                <CardSubtitle>Visits recorded across all departments</CardSubtitle>
              </div>
              <Badge tone="teal">+12.4% vs last week</Badge>
            </CardHeader>
            <CardBody>
              <ActivityChart />
            </CardBody>
          </Card>

          <Card padding="lg">
            <CardHeader>
              <div>
                <CardTitle>Recent appointments</CardTitle>
                <CardSubtitle>Today&apos;s schedule across all doctors</CardSubtitle>
              </div>
              <Button variant="ghost" size="sm">View all</Button>
            </CardHeader>
            <CardBody>
              <Table columns={appointmentColumns} data={pagedAppointments} rowKey={(r) => r.id} />
              <div className="mf-dashboard__pagination">
                <Pagination
                  currentPage={appointmentsPage}
                  totalPages={totalAppointmentPages}
                  onPageChange={setAppointmentsPage}
                  summary={`Showing ${pagedAppointments.length} of ${APPOINTMENTS.length} appointments`}
                />
              </div>
            </CardBody>
          </Card>

          <Card padding="lg">
            <CardHeader>
              <div>
                <CardTitle>Recent patients</CardTitle>
                <CardSubtitle>Newest records added to the system</CardSubtitle>
              </div>
              <Button variant="ghost" size="sm">View all</Button>
            </CardHeader>
            <CardBody>
              <ul className="mf-patient-list">
                {PATIENTS.map((p) => (
                  <li key={p.id} className="mf-patient-list__item">
                    <Avatar name={p.name} size="sm" />
                    <div className="mf-patient-list__text">
                      <p className="mf-patient-list__name">{p.name}</p>
                      <p className="mf-patient-list__meta">{p.condition}</p>
                    </div>
                    <span className="mf-patient-list__date">{p.lastVisit}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>

        <div className="mf-dashboard__col mf-dashboard__col--side">
          <Card padding="lg">
            <CardTitle>Calendar</CardTitle>
            <div style={{ marginTop: 'var(--mf-space-4)' }}>
              <CalendarWidget />
            </div>
          </Card>

          <Card padding="lg">
            <CardTitle>Activity timeline</CardTitle>
            <div style={{ marginTop: 'var(--mf-space-5)' }}>
              <ActivityTimeline />
            </div>
          </Card>

          <Card padding="lg">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <Badge tone="coral">3 new</Badge>
            </CardHeader>
            <CardBody>
              <ul className="mf-notif-list">
                <li>
                  <strong>Lab results ready</strong>
                  <span>Priya Nair&apos;s blood panel just came in.</span>
                </li>
                <li>
                  <strong>Schedule conflict</strong>
                  <span>Dr. Shah has two bookings at 2:00 PM.</span>
                </li>
                <li>
                  <strong>Low stock alert</strong>
                  <span>Pharmacy flagged amoxicillin running low.</span>
                </li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
