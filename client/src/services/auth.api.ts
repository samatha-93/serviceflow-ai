import { UserProfile } from '../types';
import { ApiError } from './enquiry.api';

const rawBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const API_BASE = rawBase ? rawBase.replace(/\/+$/, '') : '/api';

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
    token?: string;
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
  if (body.data.token) {
    localStorage.setItem('serviceflow_token', body.data.token);
  }
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
  if (body.data.token) {
    localStorage.setItem('serviceflow_token', body.data.token);
  }
  return body.data.user;
}

/**
 * Get current authenticated user profile using active session cookie or Bearer token.
 */
export async function fetchCurrentUser(): Promise<UserProfile | null> {
  const token = localStorage.getItem('serviceflow_token');
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    if (res.status === 401) {
      localStorage.removeItem('serviceflow_token');
      return null;
    }

    const body = await parseAuthResponse<MeSuccessResponse>(res);
    return body.data.user;
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 401) {
      localStorage.removeItem('serviceflow_token');
      return null;
    }
    throw err;
  }
}

/**
 * Log out current user, invalidating session cookie.
 */
export async function logoutUser(): Promise<void> {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } finally {
    localStorage.removeItem('serviceflow_token');
  }
}
