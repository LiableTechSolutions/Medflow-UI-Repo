/** One function per backend route the UI uses, grouped by module. */
import { api, query, type Page } from './client';
import type {
  Appointment,
  AuthSession,
  AvailableSlots,
  Bed,
  BedSummary,
  ChatMessage,
  DailyActivity,
  DailyAnalysisEntry,
  DashboardSummary,
  Doctor,
  Hospital,
  HospitalisationRecord,
  LabOrder,
  Medication,
  MedicalHistoryEntry,
  ModuleEntitlement,
  Notification,
  Patient,
  PatientClinicalSummaryDto,
  PatientReport,
  PatientSummary,
  Prescription,
  PublicQueueBoard,
  QueueStatus,
  Role,
  Setting,
  UserAccount,
  Ward,
} from './types';
import type {
  PatientRegistrationProfile,
  UpdatePatientRegistrationProfile,
} from '../../modules/settings/types/patientRegistrationProfile';

export interface Paged {
  page?: number;
  size?: number;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthSession>('/auth/login', { email, password }),
  register: (payload: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    hospitalName?: string;
  }) => api.post<AuthSession>('/auth/register', payload),
  forgotPassword: (email: string) => api.post<void>('/auth/forgot-password', { email }),
  me: () => api.get<UserAccount>('/auth/me'),
};

export const hospitalApi = {
  profile: () => api.get<Hospital>('/hospital'),
  modules: () => api.get<ModuleEntitlement[]>('/hospital/modules'),
};

export const analyticsApi = {
  dashboard: () => api.get<DashboardSummary>('/analytics/dashboard'),
  activity: (days = 7) => api.get<DailyActivity[]>(`/analytics/activity${query({ days })}`),
};

export const doctorsApi = {
  list: (params: Paged & { query?: string; specialty?: string } = {}) =>
    api.get<Page<Doctor>>(`/doctors${query({ ...params })}`),
  get: (id: number) => api.get<Doctor>(`/doctors/${id}`),
  create: (payload: Record<string, unknown>) => api.post<Doctor>('/doctors', payload),
  /** The signed-in user's own doctor profile. 404s if this account isn't a doctor. */
  me: () => api.get<Doctor>('/doctors/me'),
};

export const patientsApi = {
  list: (params: Paged & { query?: string; status?: string } = {}) =>
    api.get<Page<Patient>>(`/patients${query({ ...params })}`),
  get: (id: number) => api.get<Patient>(`/patients/${id}`),
  create: (payload: Record<string, unknown>) => api.post<Patient>('/patients', payload),
  update: (id: number, payload: Record<string, unknown>) => api.put<Patient>(`/patients/${id}`, payload),
  /** Patient + active hospitalisation (if any) + its daily analysis entries, for the summary screen. */
  summary: (id: number) =>
    api.get<PatientClinicalSummaryDto>(`/patients/${id}/summary`).then(
      (dto): PatientSummary => ({
        patient: dto.patient,
        hospitalisation: dto.currentHospitalisation ?? undefined,
        dailyAnalyses: dto.dailyAnalyses,
      }),
    ),
  medicalHistory: (id: number) => api.get<MedicalHistoryEntry[]>(`/patients/${id}/medical-history`),
  reports: (id: number) => api.get<PatientReport[]>(`/patients/${id}/reports`),
};

// Route shapes below match `PatientController` on the BFF exactly: everything hangs off
// `/patients/{patientId}/hospitalisation` (singular) and always acts on that patient's
// current active admission — none of these calls take a separate hospitalisation id.
export const hospitalisationsApi = {
  admit: (patientId: number, payload: Record<string, unknown>) =>
    api.post<HospitalisationRecord>(`/patients/${patientId}/hospitalisation`, payload),
  discharge: (patientId: number, dischargeDate?: string) =>
    api.patch<HospitalisationRecord>(`/patients/${patientId}/hospitalisation/discharge`, { dischargeDate }),
};

export const dailyAnalysisApi = {
  list: (patientId: number) =>
    api.get<DailyAnalysisEntry[]>(`/patients/${patientId}/hospitalisation/daily-analyses`),
  create: (patientId: number, payload: Record<string, unknown>) =>
    api.post<DailyAnalysisEntry>(`/patients/${patientId}/hospitalisation/daily-analyses`, payload),
};

/**
 * India-only country/state lookup for `SearchableSelect` fields. Backed by the free,
 * CORS-enabled countriesnow.space API with a static fallback so the "State" field still
 * works (offline, in tests, in Storybook) if that third-party API is unreachable.
 */
const FALLBACK_INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
  'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh',
  'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

export const geoApi = {
  /** Resolves a country name to its states/provinces. Defaults to India. */
  states: async (country: string = 'India') => {
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country }),
      });
      const body = (await response.json()) as { error: boolean; data?: { states: { name: string }[] } };
      if (body.error || !body.data) throw new Error('geo lookup failed');
      return body.data.states.map((state) => ({ value: state.name, label: state.name }));
    } catch {
      return FALLBACK_INDIAN_STATES.map((name) => ({ value: name, label: name }));
    }
  },
  countries: async () => {
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/positions');
      const body = (await response.json()) as { error: boolean; data?: { name: string }[] };
      if (body.error || !body.data) throw new Error('geo lookup failed');
      return body.data.map((entry) => ({ value: entry.name, label: entry.name }));
    } catch {
      return [{ value: 'India', label: 'India' }];
    }
  },
};

export const appointmentsApi = {
  list: (
    params: Paged & {
      status?: string;
      doctorId?: number;
      patientId?: number;
      date?: string;
      /** Inclusive yyyy-mm-dd range; independent of `date`. */
      from?: string;
      to?: string;
      latestFirst?: boolean;
    } = {},
  ) => api.get<Page<Appointment>>(`/appointments${query({ ...params })}`),
  get: (id: number) => api.get<Appointment>(`/appointments/${id}`),
  book: (payload: Record<string, unknown>) => api.post<Appointment>('/appointments', payload),
  /** action is one of confirm | check-in | start-consultation | complete | cancel | no-show */
  transition: (id: number, action: string) =>
    api.patch<Appointment>(`/appointments/${id}/${action}`),
  queueStatus: (id: number) => api.get<QueueStatus>(`/appointments/${id}/queue-status`),
  availableSlots: (doctorId: number, date: string) =>
    api.get<AvailableSlots>(`/appointments/available-slots${query({ doctorId, date })}`),
  /** Mints a signed token for the public queue board — see publicQueueApi.board. Staff-only. */
  queueLink: (doctorId: number, date: string) =>
    api.get<{ token: string }>(`/appointments/queue-link${query({ doctorId, date })}`),
};

/**
 * No auth required — for a waiting-room TV or a link sent directly to a patient. Takes
 * only the signed token from `appointmentsApi.queueLink`, never raw hospital/doctor ids
 * (those would be guessable/enumerable).
 */
export const publicQueueApi = {
  board: (token: string) => api.get<PublicQueueBoard>(`/public/queue${query({ token })}`),
};

export const prescriptionsApi = {
  list: (
    params: Paged & {
      patientId?: number;
      doctorId?: number;
      status?: string;
      issuedOn?: string;
      query?: string;
    } = {},
  ) => api.get<Page<Prescription>>(`/prescriptions${query({ ...params })}`),
  get: (id: number) => api.get<Prescription>(`/prescriptions/${id}`),
  create: (payload: Record<string, unknown>) => api.post<Prescription>('/prescriptions', payload),
  /** Issuing doctor only, and only on the day it was issued. */
  update: (id: number, payload: Record<string, unknown>) =>
    api.put<Prescription>(`/prescriptions/${id}`, payload),
  complete: (id: number) => api.patch<Prescription>(`/prescriptions/${id}/complete`),
  cancel: (id: number) => api.patch<Prescription>(`/prescriptions/${id}/cancel`),
  /** Explicit action only — viewing or printing never sends anything on its own. */
  send: (id: number) => api.post<void>(`/prescriptions/${id}/send`),
};

export const laboratoryApi = {
  list: (params: Paged & { status?: string; priority?: string; patientId?: number } = {}) =>
    api.get<Page<LabOrder>>(`/lab-orders${query({ ...params })}`),
  start: (id: number) => api.patch<LabOrder>(`/lab-orders/${id}/start`),
  complete: (id: number, resultSummary: string) =>
    api.patch<LabOrder>(`/lab-orders/${id}/complete`, { resultSummary }),
};

export const pharmacyApi = {
  list: (params: Paged & { query?: string; lowStockOnly?: boolean } = {}) =>
    api.get<Page<Medication>>(`/pharmacy/medications${query({ ...params })}`),
  adjustStock: (id: number, delta: number) =>
    api.patch<Medication>(`/pharmacy/medications/${id}/stock`, { delta }),
};

export const notificationsApi = {
  list: (params: Paged & { unreadOnly?: boolean } = {}) =>
    api.get<Page<Notification>>(`/notifications${query({ ...params })}`),
  unreadCount: () => api.get<{ unread: number }>('/notifications/unread-count'),
  markRead: (id: number) => api.patch<Notification>(`/notifications/${id}/read`),
  markAllRead: () => api.patch<{ updated: number }>('/notifications/read-all'),
};

export const usersApi = {
  list: (params: Paged & { query?: string; roleCode?: string } = {}) =>
    api.get<Page<UserAccount>>(`/users${query({ ...params })}`),
  changeStatus: (id: number, status: string) =>
    api.patch<UserAccount>(`/users/${id}/status`, { status }),
  changeRole: (id: number, roleCode: string) =>
    api.patch<UserAccount>(`/users/${id}/role`, { roleCode }),
};

export const accessApi = {
  roles: () => api.get<Role[]>('/access/roles'),
};

export const settingsApi = {
  list: () => api.get<Setting[]>('/settings'),
  save: (key: string, value: string) => api.put<Setting>(`/settings/${key}`, { value }),
  patientRegistrationProfile: () =>
    api.get<PatientRegistrationProfile>('/settings/patient-registration-profile'),
  updatePatientRegistrationProfile: (payload: UpdatePatientRegistrationProfile) =>
    api.put<PatientRegistrationProfile>('/settings/patient-registration-profile', payload),
  applyPatientRegistrationTemplate: (template: 'basic' | 'comprehensive') =>
    api.post<PatientRegistrationProfile>(
      `/settings/patient-registration-profile/templates/${template}`,
    ),
};

export const assistantApi = {
  send: (content: string, conversationId?: string) =>
    api.post<ChatMessage>('/assistant/messages', { content, conversationId }),
  history: (params: Paged & { conversationId?: string } = {}) =>
    api.get<Page<ChatMessage>>(`/assistant/messages${query({ ...params })}`),
};

export const bedsApi = {
  summary: () => api.get<BedSummary>('/beds/summary'),
  wards: () => api.get<Ward[]>('/beds/wards'),
  available: () => api.get<Bed[]>('/beds/available'),
  /** The patient's current bed; resolves to undefined when they have none. */
  ofPatient: (patientId: number) => api.get<Bed | undefined>(`/beds/patients/${patientId}`),
  beds: (wardId: number) => api.get<Bed[]>(`/beds/wards/${wardId}/beds`),
  createWard: (payload: { name: string; wardType?: string; bedCount: number }) =>
    api.post<Ward>('/beds/wards', payload),
  addBeds: (wardId: number, count: number) =>
    api.post<Ward>(`/beds/wards/${wardId}/beds/add`, { count }),
  reduceBeds: (wardId: number, count: number) =>
    api.post<Ward>(`/beds/wards/${wardId}/beds/reduce`, { count }),
  assign: (bedId: number, patientId: number) =>
    api.patch<Bed>(`/beds/${bedId}/assign`, { patientId }),
  release: (bedId: number) => api.patch<Bed>(`/beds/${bedId}/release`),
  setMaintenance: (bedId: number, underMaintenance: boolean) =>
    api.patch<Bed>(`/beds/${bedId}/maintenance`, { underMaintenance }),
};
