import { UserProfile } from '../types';
import { ApiError } from './enquiry.api';

const rawBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const API_BASE = rawBase ? rawBase.replace(/\/+$/, '') : '/api';

// Remove tokens persisted by older browser versions now that sessions use cookies.
if (typeof window !== 'undefined') {
  try {
    window.localStorage.removeItem('serviceflow_token');
  } catch {
    // Storage may be unavailable in restricted browser contexts.
  }
}

export interface RegisterPayload {
  name: string;
  businessName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

interface AuthSuccessResponse {
  status: 'success';
  message?: string;
  data: {
    user: UserProfile;
  };
}

interface MeSuccessResponse {
  status: 'success';
  data: {
    user: UserProfile;
  };
}

/** Parses fetch Response, surfacing HTTP errors as typed ApiError */
async function parseAuthResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message =
      isJson && typeof body === 'object' && body !== null && 'message' in body
        ? String((body as { message: unknown }).message)
        : `HTTP ${res.status}: ${res.statusText}`;
    throw new ApiError(res.status, message);
  }

  return body as T;
}

/**
 * Register a new business owner account.
 * Sets HttpOnly cookie in the browser response.
 */
export async function registerUser(payload: RegisterPayload): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const body = await parseAuthResponse<AuthSuccessResponse>(res);
  return body.data.user;
}

/**
 * Authenticate user with email and password.
 * Sets HttpOnly cookie in the browser response.
 */
export async function loginUser(payload: LoginPayload): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const body = await parseAuthResponse<AuthSuccessResponse>(res);
  return body.data.user;
}

/**
 * Get current authenticated user profile using the HttpOnly session cookie.
 */
export async function fetchCurrentUser(): Promise<UserProfile | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      credentials: 'include',
    });

    if (res.status === 401) {
      return null;
    }

    const body = await parseAuthResponse<MeSuccessResponse>(res);
    return body.data.user;
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 401) {
      return null;
    }
    throw err;
  }
}

/**
 * Log out current user, invalidating session cookie.
 */
export async function logoutUser(): Promise<void> {
  await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}
