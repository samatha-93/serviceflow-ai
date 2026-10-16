/**
 * ServiceFlow AI — Booking API service
 *
 * Communicates with the Express backend at /api/bookings.
 * In development, Vite proxies /api → http://localhost:5000 (vite.config.ts).
 * In production, VITE_API_URL can override the base path via .env.
 *
 * All functions are typed against backend response envelopes and throw
 * ApiError on HTTP failures.
 */

import { Booking, BookingStatus, CreateBookingPayload } from '../types';
import { ApiError } from './enquiry.api';

// -------------------------------------------------------------------
// Base URL
// -------------------------------------------------------------------
const rawBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const API_BASE = rawBase ? rawBase.replace(/\/+$/, '') : '/api';

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('serviceflow_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/** Parses a fetch Response, surfacing HTTP errors as ApiError. */
async function parseResponse<T>(res: Response): Promise<T> {
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

interface BookingListResponse {
  status: 'success';
  data: Booking[];
  count: number;
}

interface BookingSingleResponse {
  status: 'success';
  data: Booking;
}

/**
 * GET /api/bookings
 * Fetches bookings from backend (scoped to authenticated business or demo).
 */
export async function fetchBookings(): Promise<Booking[]> {
  const res = await fetch(`${API_BASE}/bookings`, {
    credentials: 'include',
    headers: getAuthHeaders(),
  });
  const body = await parseResponse<BookingListResponse>(res);
  return body.data;
}

/**
 * GET /api/bookings/:id
 * Fetches a single booking by ID.
 */
export async function fetchBookingById(id: string): Promise<Booking> {
  const res = await fetch(`${API_BASE}/bookings/${encodeURIComponent(id)}`, {
    credentials: 'include',
    headers: getAuthHeaders(),
  });
  const body = await parseResponse<BookingSingleResponse>(res);
  return body.data;
}

/**
 * POST /api/bookings
 * Creates a new booking in MongoDB for the authenticated business.
 * If enquiryId is passed, converts the enquiry and marks it 'Booked'.
 */
export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  const body = await parseResponse<BookingSingleResponse>(res);
  return body.data;
}

/**
 * PATCH /api/bookings/:id/status
 * Updates the status of an existing booking with tenant ownership verification.
 */
export async function patchBookingStatus(
  id: string,
  status: BookingStatus
): Promise<Booking> {
  const res = await fetch(`${API_BASE}/bookings/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify({ status }),
  });
  const body = await parseResponse<BookingSingleResponse>(res);
  return body.data;
}
