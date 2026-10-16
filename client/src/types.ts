export interface HealthResponse {
  status: string;
  service: string;
  tagline: string;
  version: string;
  uptime: number;
  timestamp: string;
  environment: string;
  database: {
    status: string;
  };
  supportedCategories: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  businessName: string;
  businessId: string;
  role: 'owner' | 'staff' | 'admin';
  createdAt?: string;
}

export interface CustomerEnquiry {
  id: string;
  businessId?: string;
  customerName: string;
  serviceCategory: string;
  serviceTitle: string;
  location: string;
  receivedTime: string;
  status: 'Awaiting Review' | 'Quoted' | 'Booked' | 'High Priority';
  urgency: 'Standard' | 'Urgent' | 'Flexible';
  message: string;
  suggestedReply: string;
}


export interface UpcomingBooking {
  id: string;
  time: string;
  customerName: string;
  serviceType: string;
  location: string;
  duration: string;
  status: 'Confirmed' | 'In Progress' | 'Scheduled';
  assignee: string;
}

export interface ServiceCategoryItem {
  id: string;
  name: string;
  description: string;
  badge: string;
  subServices: string[];
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  businessId: string;
  enquiryId?: string;
  customerName: string;
  serviceTitle: string;
  location: string;
  bookingDate: string;
  bookingTime: string;
  duration?: string;
  status: BookingStatus;
  assignee?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBookingPayload {
  customerName: string;
  serviceTitle: string;
  location: string;
  bookingDate: string;
  bookingTime: string;
  duration?: string;
  status?: BookingStatus;
  assignee?: string;
  notes?: string;
  enquiryId?: string;
}
