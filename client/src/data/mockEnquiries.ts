import { CustomerEnquiry } from '../types';

/**
 * ServiceFlow AI - Phase 3 Demo Enquiries
 *
 * Note: These are simulated customer enquiries designed for UI testing,
 * filtering, and triage inspection. No backend connection or database
 * persistence is configured in this step.
 */
export const DEMO_ENQUIRIES: CustomerEnquiry[] = [
  {
    id: 'ENQ-1042',
    customerName: 'Sarah Jenkins',
    serviceCategory: 'Outdoor & Property',
    serviceTitle: 'Lawn Mowing & Boundary Hedge Trimming',
    location: 'Westfield Crescent, Oakridge',
    receivedTime: '24m ago',
    status: 'Awaiting Review',
    urgency: 'Standard',
    message:
      'Looking for regular bi-weekly garden maintenance. Front lawn plus trimming overgrown laurel hedges along boundary fence.',
    suggestedReply:
      'Hi Sarah, thanks for contacting GreenThumb! We would be happy to take on your bi-weekly lawn and hedge maintenance. Based on typical garden sizes on Westfield Crescent, our rate is £65 per visit including green waste disposal. Would Tuesday at 09:30 AM suit you for an initial visit?',
  },
  {
    id: 'ENQ-1041',
    customerName: 'Marcus Vance',
    serviceCategory: 'Cleaning Services',
    serviceTitle: 'Commercial Studio Deep Clean (3,200 sq ft)',
    location: 'Harbour Way, Suite 4B',
    receivedTime: '1h ago',
    status: 'Awaiting Review',
    urgency: 'Standard',
    message:
      'Need an end-of-quarter deep clean for our design studio before new team members join next Monday.',
    suggestedReply:
      'Hello Marcus, we can schedule our commercial crew for Sunday evening to ensure your studio is pristine before Monday morning. Our commercial deep clean checklist includes floor buffing, desk sanitization, and restroom sterilization.',
  },
  {
    id: 'ENQ-1040',
    customerName: 'Elena Rostova',
    serviceCategory: 'Home Maintenance',
    serviceTitle: 'Water Pressure Loss & Valve Inspection',
    location: 'Pine Hill Road, Unit 12',
    receivedTime: '2h ago',
    status: 'High Priority',
    urgency: 'Urgent',
    message:
      'Sudden pressure drop in upstairs shower and knocking sounds in heating supply lines.',
    suggestedReply:
      'Hi Elena, sudden pressure drop with knocking sounds suggests a faulty pressure-reducing valve or airlock. We have technician Dan available today at 4:30 PM for an immediate diagnostics visit.',
  },
  {
    id: 'ENQ-1039',
    customerName: 'David Chen',
    serviceCategory: 'Beauty & Wellness',
    serviceTitle: 'Mobile Hair & Grooming Session',
    location: 'Oakridge Business Park, Bldg 3',
    receivedTime: '3h ago',
    status: 'Quoted',
    urgency: 'Flexible',
    message:
      'Inquiring about booking private grooming appointments for 4 corporate executives ahead of our annual summit next Thursday.',
    suggestedReply:
      'Hi David, we can accommodate your team on Wednesday afternoon or Thursday morning. For 4 executive sessions, we allocate 45 minutes per person with professional styling products included.',
  },
  {
    id: 'ENQ-1038',
    customerName: 'Rachel Adams',
    serviceCategory: 'Independent Professionals',
    serviceTitle: 'Commercial Acoustic Assessment',
    location: 'Central Square, Floor 8',
    receivedTime: '5h ago',
    status: 'Booked',
    urgency: 'Standard',
    message:
      'Need sound transmission verification and decibel testing between our conference suites following partition installation.',
    suggestedReply:
      'Hello Rachel, our acoustic specialist will arrive with calibrated decibel loggers on Friday at 10:00 AM. Formal assessment certificate will be delivered within 24 hours.',
  },
  {
    id: 'ENQ-1037',
    customerName: 'Liam Fitzpatrick',
    serviceCategory: 'Home Maintenance',
    serviceTitle: 'Emergency Main Pipe Leak Repair',
    location: '42 Elmhurst Court',
    receivedTime: 'Yesterday',
    status: 'High Priority',
    urgency: 'Urgent',
    message:
      'Active leak under the utility sink leaking through to downstairs ceiling plaster. Isolation valve is jammed.',
    suggestedReply:
      'Hi Liam, this is flagged as an urgent emergency. Please switch off your main external stopcock if accessible. Our rapid response plumber is being dispatched.',
  },
  {
    id: 'ENQ-1036',
    customerName: 'Amina Patel',
    serviceCategory: 'Cleaning Services',
    serviceTitle: 'Bi-Weekly Residential Cleaning',
    location: '19 Meadowbrook Lane',
    receivedTime: '2 days ago',
    status: 'Booked',
    urgency: 'Flexible',
    message:
      'Looking for a reliable team for ongoing bi-weekly cleaning of a 3-bedroom detached home, including kitchen appliances.',
    suggestedReply:
      'Hi Amina, your bi-weekly slot has been confirmed starting next Wednesday at 10:00 AM with our certified team (Claire & Tom).',
  },
];

export const SERVICE_CATEGORIES = [
  'Outdoor & Property',
  'Cleaning Services',
  'Beauty & Wellness',
  'Home Maintenance',
  'Independent Professionals',
] as const;

export const ENQUIRY_STATUSES = [
  'Awaiting Review',
  'High Priority',
  'Quoted',
  'Booked',
] as const;

export const URGENCY_LEVELS = [
  'Urgent',
  'Standard',
  'Flexible',
] as const;
