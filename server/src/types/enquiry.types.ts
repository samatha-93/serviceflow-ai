export type EnquiryStatus = 'Awaiting Review' | 'Quoted' | 'Booked' | 'High Priority';

export type EnquiryUrgency = 'Standard' | 'Urgent' | 'Flexible';

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
