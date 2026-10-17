import mongoose, { Schema, Document } from 'mongoose';
import {
  BusinessProfile,
  ContactInfo,
  BusinessLocation,
} from '../types/businessProfile.types';

export interface BusinessProfileDocument
  extends Document,
    Omit<BusinessProfile, 'id'> {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const contactSchema = new Schema<ContactInfo>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false }
);

const locationSchema = new Schema<BusinessLocation>(
  {
    address: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      required: true,
      trim: true,
      default: '',
    },
    state: {
      type: String,
      trim: true,
      default: '',
    },
    postalCode: {
      type: String,
      trim: true,
      default: '',
    },
    country: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false }
);

const businessProfileSchema = new Schema<BusinessProfileDocument>(
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
      unique: true,
      index: true,
      trim: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    tagline: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    contact: {
      type: contactSchema,
      required: true,
    },
    location: {
      type: locationSchema,
      required: true,
    },
    categories: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Project a Mongoose BusinessProfileDocument into a clean BusinessProfile response.
 * Strips _id, __v, and internal Mongoose metadata.
 */
export function toBusinessProfile(doc: any): BusinessProfile {
  return {
    id: doc.id,
    businessId: doc.businessId,
    businessName: doc.businessName,
    tagline: doc.tagline || '',
    description: doc.description || '',
    contact: {
      email: doc.contact?.email || '',
      phone: doc.contact?.phone || '',
      website: doc.contact?.website || '',
    },
    location: {
      address: doc.location?.address || '',
      city: doc.location?.city || '',
      state: doc.location?.state || '',
      postalCode: doc.location?.postalCode || '',
      country: doc.location?.country || '',
    },
    categories: Array.isArray(doc.categories) ? [...doc.categories] : [],
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export const BusinessProfileModel = mongoose.model<BusinessProfileDocument>(
  'BusinessProfile',
  businessProfileSchema
);
