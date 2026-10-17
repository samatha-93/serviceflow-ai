import { Booking } from '../types/booking.types';
import { DEMO_TENANT_ID } from '../types/enquiry.types';

/**
 * ServiceFlow AI - Phase 5 Initial Demo Bookings
 *
 * Source of truth: Initial simulated schedule bookings aligned with DashboardPreview.tsx.
 * Assigned to DEMO_TENANT_ID to guarantee isolation from registered businesses.
 */
export const INITIAL_DEMO_BOOKINGS: Booking[] = [
  {
    id: 'BK-8901',
    businessId: DEMO_TENANT_ID,
    customerName: 'Apex Commercial Plaza',
    serviceTitle: 'HVAC Seasonal Tune-Up & Filter Service',
    location: '100 Elmwood Boulevard, Suite 4',
    bookingDate: '2026-10-16',
    bookingTime: '09:30 AM',
    duration: '2.0 hrs',
    status: 'Confirmed',
    assignee: 'Alex M.',
    notes: 'Access via service entrance. Keycard available at reception desk.',
  },
  {
    id: 'BK-8902',
    businessId: DEMO_TENANT_ID,
    customerName: 'Clara Oswald',
    serviceTitle: 'Residential Deep Clean',
    location: '72 Hilltop Rise',
    bookingDate: '2026-10-16',
    bookingTime: '01:15 PM',
    duration: '2.5 hrs',
    status: 'Confirmed',
    assignee: 'Sarah T.',
    notes: 'Key in lockbox. Focus on kitchen ovens and upstairs bathrooms.',
  },
  {
    id: 'BK-8903',
    businessId: DEMO_TENANT_ID,
    enquiryId: 'ENQ-1040',
    customerName: 'Elena Rostova',
    serviceTitle: 'Water Pressure Loss & Valve Inspection',
    location: 'Pine Hill Road, Unit 12',
    bookingDate: '2026-10-16',
    bookingTime: '04:30 PM',
    duration: '1.5 hrs',
    status: 'Confirmed',
    assignee: 'Dan K.',
    notes: 'Pressure drop inspection scheduled following urgent enquiry ENQ-1040.',
  },
];
