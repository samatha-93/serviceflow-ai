import mongoose, { Schema, Document } from 'mongoose';
import { UserProfile, UserRole } from '../types/auth.types';

export interface UserDocument extends Document {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  businessName: string;
  businessId: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    businessId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['owner', 'staff', 'admin'],
      default: 'owner',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Project a user document into a safe UserProfile object.
 * Strips passwordHash, _id, __v, and internal Mongoose fields.
 */
export function toUserProfile(doc: UserDocument | any): UserProfile {
  return {
    id: doc.id,
    email: doc.email,
    name: doc.name,
    businessName: doc.businessName,
    businessId: doc.businessId,
    role: doc.role,
    createdAt: doc.createdAt,
  };
}

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
