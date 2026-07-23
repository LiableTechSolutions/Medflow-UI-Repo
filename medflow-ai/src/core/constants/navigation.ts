import {
  LayoutDashboard,
  Stethoscope,
  Users,
  CalendarClock,
  ClipboardList,
  FlaskConical,
  Pill,
  BarChart3,
  Bell,
  Sparkles,
  UserCog,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: number;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Doctor Management', path: '/doctors', icon: Stethoscope },
  { label: 'Patient Management', path: '/patients', icon: Users },
  { label: 'Appointment Management', path: '/appointments', icon: CalendarClock },
  { label: 'Prescription Management', path: '/prescriptions', icon: ClipboardList },
  { label: 'Laboratory', path: '/laboratory', icon: FlaskConical },
  { label: 'Pharmacy', path: '/pharmacy', icon: Pill },
  { label: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
  { label: 'Notifications', path: '/notifications', icon: Bell, badge: 3 },
  { label: 'AI Assistant', path: '/ai', icon: Sparkles },
  { label: 'User Management', path: '/users', icon: UserCog },
  { label: 'Settings', path: '/settings', icon: Settings },
];
