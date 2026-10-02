import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AppLayout } from '../../shared/layouts/AppLayout';
import { Loading } from '../../shared/components/Loading/Loading';
import { useAuth } from '../../core/auth/AuthContext';
import { ROUTES } from '../../core/config/app.config';

import LandingPage from '../../modules/landing/pages/LandingPage';
import LoginPage from '../../modules/auth/pages/LoginPage';
import SignupPage from '../../modules/auth/pages/SignupPage';
import ForgotPasswordPage from '../../modules/auth/pages/ForgotPasswordPage';
import DashboardPage from '../../modules/dashboard/pages/DashboardPage';
import DoctorsPage from '../../modules/doctors/pages/DoctorsPage';
import PatientsPage from '../../modules/patients/pages/PatientsPage';
import PatientSummaryPage from '../../modules/patients/pages/PatientSummaryPage';
import DoctorPatientSummaryPage from '../../modules/doctors/pages/DoctorPatientSummaryPage';
import AppointmentsPage from '../../modules/appointments/pages/AppointmentsPage';
import AppointmentQueuePage from '../../modules/appointments/pages/AppointmentQueuePage';
import AppointmentQueueOverviewPage from '../../modules/appointments/pages/AppointmentQueueOverviewPage';
import PublicQueueBoardPage from '../../modules/appointments/pages/PublicQueueBoardPage';
import PrescriptionsPage from '../../modules/prescriptions/pages/PrescriptionsPage';
import ReportsPage from '../../modules/reports/pages/ReportsPage';
import NotificationsPage from '../../modules/notifications/pages/NotificationsPage';
import AiAssistantPage from '../../modules/ai/pages/AiAssistantPage';
import UsersPage from '../../modules/users/pages/UsersPage';
import SettingsPage from '../../modules/settings/pages/SettingsPage';
import NotFoundPage from '../../modules/landing/pages/NotFoundPage';
import LaboratoryPage from '../../modules/laboratory/pages/LaboratoryPage';
import PharmacyPage from '../../modules/pharmacy/pages/PharmacyPage';

/** Sends anonymous visitors to the sign-in page, remembering where they were going. */
function RequireAuth() {
  const { isAuthenticated, isRestoring } = useAuth();
  const location = useLocation();

  if (isRestoring) return <Loading label="Restoring your session…" fullHeight />;
  if (!isAuthenticated) return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  return <Outlet />;
}

/** Keeps signed-in users out of the auth screens. */
function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isRestoring } = useAuth();
  if (isRestoring) return <Loading label="Loading…" fullHeight />;
  return isAuthenticated ? <Navigate to={ROUTES.dashboard} replace /> : <>{children}</>;
}

/** Doctor-only routes: a non-doctor landing here (direct URL, stale link) goes to the dashboard. */
function RequireDoctor() {
  const { user } = useAuth();
  if (user?.roleCode !== 'DOCTOR') return <Navigate to={ROUTES.dashboard} replace />;
  return <Outlet />;
}

export const router = createBrowserRouter([
  { path: ROUTES.landing, element: <LandingPage /> },
  {
    path: ROUTES.login,
    element: (
      <RedirectIfAuthenticated>
        <LoginPage />
      </RedirectIfAuthenticated>
    ),
  },
  {
    path: ROUTES.signup,
    element: (
      <RedirectIfAuthenticated>
        <SignupPage />
      </RedirectIfAuthenticated>
    ),
  },
  { path: ROUTES.forgotPassword, element: <ForgotPasswordPage /> },
  { path: ROUTES.publicQueueBoard, element: <PublicQueueBoardPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: ROUTES.dashboard, element: <DashboardPage /> },
          { path: ROUTES.doctors, element: <DoctorsPage /> },
          { path: ROUTES.patients, element: <PatientsPage /> },
          { path: ROUTES.patientDetail, element: <PatientSummaryPage /> },
          {
            element: <RequireDoctor />,
            children: [
              { path: ROUTES.doctorPatientDetail, element: <DoctorPatientSummaryPage /> },
            ],
          },
          { path: ROUTES.appointments, element: <AppointmentsPage /> },
          { path: ROUTES.appointmentQueueOverview, element: <AppointmentQueueOverviewPage /> },
          { path: ROUTES.appointmentQueue, element: <AppointmentQueuePage /> },
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
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
