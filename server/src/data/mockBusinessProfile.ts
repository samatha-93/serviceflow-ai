import { BusinessProfile } from '../types/businessProfile.types';
import { DEMO_TENANT_ID } from '../types/enquiry.types';

/**
 * ServiceFlow AI - Phase 6 Initial Demo Business Profile
 *
 * Fictional demo business information aligned with Phase 5 demo bookings
 * and the 5 primary service industry verticals.
 * Scoped to DEMO_TENANT_ID to guarantee complete isolation from registered tenants.
 */
export const INITIAL_DEMO_PROFILE: BusinessProfile = {
  id: 'prof_demo_public',
  businessId: DEMO_TENANT_ID,
  businessName: 'BrightPath Home Services',
  tagline: 'Precision home maintenance and scheduled property care solutions.',
  description:
    'BrightPath Home Services delivers high-standard residential maintenance, seasonal property care, and electrical inspection solutions with zero administrative friction.',
  contact: {
    email: 'contact@brightpathservices.demo',
    phone: '+1 (555) 234-5678',
    website: 'https://brightpathservices.demo',
  },
  location: {
    address: '100 Elmwood Boulevard, Suite 4',
    city: 'Springfield',
    state: 'IL',
    postalCode: '62701',
    country: 'United States',
  },
  categories: [
    'Home maintenance',
    'Cleaning services',
    'Independent professionals',
  ],
};
