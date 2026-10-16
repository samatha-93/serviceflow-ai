import mongoose, { Schema, Document } from 'mongoose';
import {
  CustomerEnquiry,
  VALID_ENQUIRY_STATUSES,
  VALID_ENQUIRY_URGENCIES,
} from '../types/enquiry.types';

export interface EnquiryDocument extends Document, Omit<CustomerEnquiry, 'id'> {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const enquirySchema = new Schema<EnquiryDocument>(
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
      index: true,
      trim: true,
    },
    customerName: {

      type: String,
      required: true,
      trim: true,
    },
    serviceCategory: {
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
    receivedTime: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: VALID_ENQUIRY_STATUSES,
      default: 'Awaiting Review',
    },
    urgency: {
      type: String,
      required: true,
      enum: VALID_ENQUIRY_URGENCIES,
      default: 'Standard',
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    suggestedReply: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const EnquiryModel = mongoose.model<EnquiryDocument>('Enquiry', enquirySchema);
