/**
 * Thin fetch wrapper around the MedFlow AI backend.
 *
 * The API answers with one envelope for every route —
 * `{ success, message, data, errors, timestamp, traceId }` — so unwrapping and error
 * translation belong here rather than in each page.
 */

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1';

const TOKEN_KEY = 'medflow.accessToken';
const USER_KEY = 'medflow.user';

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  errors: { field?: string; code?: string; message: string }[];
  timestamp: string;
  traceId: string;
}

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: { field?: string; message: string }[];

  constructor(status: number, message: string, fieldErrors: { field?: string; message: string }[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

/** Raised so the auth provider can drop a session the server no longer accepts. */
export const UNAUTHORIZED_EVENT = 'medflow:unauthorized';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  getUser: <T>(): T | null => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  },
  setUser: (user: unknown) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = tokenStore.get();
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  } catch {
    // Network-level failure: the backend is down, or CORS refused the call.
    throw new ApiError(0, `Cannot reach the API at ${API_BASE_URL}. Is the backend running?`);
  }

  if (response.status === 204) return undefined as T;

  const envelope = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok) {
    if (response.status === 401) window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    throw new ApiError(
      response.status,
      envelope?.message ?? `Request failed with status ${response.status}`,
      envelope?.errors?.map((e) => ({ field: e.field, message: e.message })) ?? [],
    );
  }

  return envelope?.data as T;
}

const body = (payload: unknown) => (payload === undefined ? undefined : JSON.stringify(payload));

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, payload?: unknown) =>
    request<T>(path, { method: 'POST', body: body(payload) }),
  put: <T>(path: string, payload?: unknown) =>
    request<T>(path, { method: 'PUT', body: body(payload) }),
  patch: <T>(path: string, payload?: unknown) =>
    request<T>(path, { method: 'PATCH', body: body(payload) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

/** Builds `?a=1&b=2`, dropping empty values so optional filters stay optional. */
export function query(params: Record<string, string | number | boolean | undefined | null>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}
