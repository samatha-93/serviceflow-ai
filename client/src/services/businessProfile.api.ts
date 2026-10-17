import { BusinessProfile, UpdateBusinessProfilePayload } from '../types';
import { ApiError } from './enquiry.api';

const rawBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const API_BASE = rawBase ? rawBase.replace(/\/+$/, '') : '/api';

interface ProfileResponse {
  status: 'success';
  data: BusinessProfile;
}

async function parseProfileResponse(res: Response): Promise<ProfileResponse> {
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

  return body as ProfileResponse;
}

export async function fetchBusinessProfile(): Promise<BusinessProfile> {
  const res = await fetch(`${API_BASE}/business-profile`, {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });
  const body = await parseProfileResponse(res);
  return body.data;
}

export async function updateBusinessProfile(
  payload: UpdateBusinessProfilePayload,
): Promise<BusinessProfile> {
  const res = await fetch(`${API_BASE}/business-profile`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await parseProfileResponse(res);
  return body.data;
}
