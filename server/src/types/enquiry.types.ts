export const VALID_ENQUIRY_STATUSES = [
  'Awaiting Review',
  'Quoted',
  'Booked',
  'High Priority',
] as const;

export type EnquiryStatus = (typeof VALID_ENQUIRY_STATUSES)[number];

export const VALID_ENQUIRY_URGENCIES = [
  'Standard',
  'Urgent',
  'Flexible',
] as const;

export type EnquiryUrgency = (typeof VALID_ENQUIRY_URGENCIES)[number];

export const isEnquiryStatus = (value: unknown): value is EnquiryStatus => {
  return typeof value === 'string' && (VALID_ENQUIRY_STATUSES as readonly string[]).includes(value);
};

export const isEnquiryUrgency = (value: unknown): value is EnquiryUrgency => {
  return typeof value === 'string' && (VALID_ENQUIRY_URGENCIES as readonly string[]).includes(value);
};

export interface CustomerEnquiry {
  id: string;
  customerName: string;
  serviceCategory: string;
  serviceTitle: string;
  location: string;
  receivedTime: string;
  status: EnquiryStatus;
  urgency: EnquiryUrgency;
  message: string;
  suggestedReply: string;
}

export interface CreateEnquiryDTO {
  customerName: string;
  serviceCategory: string;
  serviceTitle: string;
  location: string;
  message: string;
  status?: EnquiryStatus;
  urgency?: EnquiryUrgency;
  suggestedReply?: string;
  receivedTime?: string;
}

export interface UpdateEnquiryStatusDTO {
  status: EnquiryStatus;
}
