/**
 * ServiceFlow AI — Enquiry API service
 *
 * Communicates with the Express backend at /api/enquiries.
 * In development, Vite proxies /api → http://localhost:5000 (vite.config.ts).
 * In production, VITE_API_URL can override the base path via .env.
 *
 * All functions are typed against the backend response envelopes and throw a
 * typed ApiError so callers can distinguish network failures from HTTP errors.
 */

import { CustomerEnquiry } from '../types';

// -------------------------------------------------------------------
// Base URL
// -------------------------------------------------------------------
// Reads VITE_API_URL from the environment (set in .env / .env.example).
// Falls back to '/api' so the Vite dev proxy works out of the box.
const rawBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const API_BASE = rawBase ? rawBase.replace(/\/+$/, '') : '/api';

// -------------------------------------------------------------------
// Shared error type
// -------------------------------------------------------------------
export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly serverMessage: string,
  ) {
    super(serverMessage);
    this.name = 'ApiError';
  }
}

// -------------------------------------------------------------------
// Internal helpers
// -------------------------------------------------------------------

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

// -------------------------------------------------------------------
// Response envelope types (mirrors the Express controller shapes)
// -------------------------------------------------------------------

interface EnquiryListResponse {
  status: 'success';
  data: CustomerEnquiry[];
  count: number;
}

interface EnquirySingleResponse {
  status: 'success';
  data: CustomerEnquiry;
}

export interface CreateEnquiryPayload {
  customerName: string;
  serviceCategory: string;
  serviceTitle: string;
  location: string;
  message: string;
  status?: CustomerEnquiry['status'];
  urgency?: CustomerEnquiry['urgency'];
  suggestedReply?: string;
  receivedTime?: string;
}

function getAuthHeaders(): Record<string, string> {
  return { 'Content-Type': 'application/json' };
}

// -------------------------------------------------------------------
// Public API functions
// -------------------------------------------------------------------

/**
 * GET /api/enquiries
 * Fetches enquiries from the backend (scoped to authenticated business or demo).
 */
export async function fetchEnquiries(): Promise<CustomerEnquiry[]> {
  const res = await fetch(`${API_BASE}/enquiries`, {
    credentials: 'include',
    headers: getAuthHeaders(),
  });
  const body = await parseResponse<EnquiryListResponse>(res);
  return body.data;
}

/**
 * GET /api/enquiries/:id
 * Fetches a single enquiry by ID.
 */
export async function fetchEnquiryById(id: string): Promise<CustomerEnquiry> {
  const res = await fetch(`${API_BASE}/enquiries/${encodeURIComponent(id)}`, {
    credentials: 'include',
    headers: getAuthHeaders(),
  });
  const body = await parseResponse<EnquirySingleResponse>(res);
  return body.data;
}

/**
 * POST /api/enquiries
 * Creates a new customer enquiry on the backend for the authenticated business.
 */
export async function createEnquiry(
  payload: CreateEnquiryPayload,
): Promise<CustomerEnquiry> {
  const res = await fetch(`${API_BASE}/enquiries`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  const body = await parseResponse<EnquirySingleResponse>(res);
  return body.data;
}

/**
 * PATCH /api/enquiries/:id/status
 * Updates the status of an enquiry with tenant ownership verification.
 */
export async function patchEnquiryStatus(
  id: string,
  status: CustomerEnquiry['status'],
): Promise<CustomerEnquiry> {
  const res = await fetch(`${API_BASE}/enquiries/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify({ status }),
  });
  const body = await parseResponse<EnquirySingleResponse>(res);
  return body.data;
}
