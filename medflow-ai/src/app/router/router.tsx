import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../../shared/layouts/AppLayout';
import { ROUTES } from '../../core/config/app.config';

import LandingPage from '../../modules/landing/pages/LandingPage';
import LoginPage from '../../modules/auth/pages/LoginPage';
import SignupPage from '../../modules/auth/pages/SignupPage';
import ForgotPasswordPage from '../../modules/auth/pages/ForgotPasswordPage';
import DashboardPage from '../../modules/dashboard/pages/DashboardPage';
import DoctorsPage from '../../modules/doctors/pages/DoctorsPage';
import PatientsPage from '../../modules/patients/pages/PatientsPage';
import AppointmentsPage from '../../modules/appointments/pages/AppointmentsPage';
import PrescriptionsPage from '../../modules/prescriptions/pages/PrescriptionsPage';
import ReportsPage from '../../modules/reports/pages/ReportsPage';
import NotificationsPage from '../../modules/notifications/pages/NotificationsPage';
import AiAssistantPage from '../../modules/ai/pages/AiAssistantPage';
import UsersPage from '../../modules/users/pages/UsersPage';
import SettingsPage from '../../modules/settings/pages/SettingsPage';
import NotFoundPage from '../../modules/landing/pages/NotFoundPage';
import LaboratoryPage from '../../modules/laboratory/pages/LaboratoryPage';
import PharmacyPage from '../../modules/pharmacy/pages/PharmacyPage';

export const router = createBrowserRouter([
  { path: ROUTES.landing, element: <LandingPage /> },
  { path: ROUTES.login, element: <LoginPage /> },
  { path: ROUTES.signup, element: <SignupPage /> },
  { path: ROUTES.forgotPassword, element: <ForgotPasswordPage /> },
  {
    element: <AppLayout />,
    children: [
      { path: ROUTES.dashboard, element: <DashboardPage /> },
      { path: ROUTES.doctors, element: <DoctorsPage /> },
      { path: ROUTES.patients, element: <PatientsPage /> },
      { path: ROUTES.appointments, element: <AppointmentsPage /> },
      { path: ROUTES.prescriptions, element: <PrescriptionsPage /> },
      { path: ROUTES.laboratory, element: <LaboratoryPage /> },
      { path: ROUTES.pharmacy, element: <PharmacyPage /> },
      { path: ROUTES.reports, element: <ReportsPage /> },
      { path: ROUTES.notifications, element: <NotificationsPage /> },
      { path: ROUTES.ai, element: <AiAssistantPage /> },
      { path: ROUTES.users, element: <UsersPage /> },
      { path: ROUTES.settings, element: <SettingsPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
