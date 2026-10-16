export const VALID_BOOKING_STATUSES = [
  'Pending',
  'Confirmed',
  'Completed',
  'Cancelled',
] as const;

export type BookingStatus = (typeof VALID_BOOKING_STATUSES)[number];

export const isBookingStatus = (value: unknown): value is BookingStatus => {
  return typeof value === 'string' && (VALID_BOOKING_STATUSES as readonly string[]).includes(value);
};

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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateBookingDTO {
  businessId?: string;
  enquiryId?: string;
  customerName: string;
  serviceTitle: string;
  location: string;
  bookingDate: string;
  bookingTime: string;
  duration?: string;
  status?: BookingStatus;
  assignee?: string;
  notes?: string;
}

export interface UpdateBookingStatusDTO {
  status: BookingStatus;
}
