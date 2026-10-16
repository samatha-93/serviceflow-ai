import mongoose, { Schema, Document } from 'mongoose';
import { Booking, VALID_BOOKING_STATUSES } from '../types/booking.types';

export interface BookingDocument extends Document, Omit<Booking, 'id'> {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const bookingSchema = new Schema<BookingDocument>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    businessId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    enquiryId: {
      type: String,
      index: true,
      trim: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    serviceTitle: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    bookingDate: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    bookingTime: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
      default: '1.0 hr',
    },
    status: {
      type: String,
      required: true,
      enum: VALID_BOOKING_STATUSES,
      default: 'Pending',
      index: true,
    },
    assignee: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient tenant-scoped queries by date
bookingSchema.index({ businessId: 1, bookingDate: 1 });

// Compound unique partial index to guarantee duplicate conversion prevention under concurrency
bookingSchema.index(
  { businessId: 1, enquiryId: 1 },
  {
    unique: true,
    partialFilterExpression: { enquiryId: { $type: 'string' } },
  }
);

export const BookingModel = mongoose.model<BookingDocument>('Booking', bookingSchema);
