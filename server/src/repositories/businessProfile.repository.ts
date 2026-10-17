import mongoose from 'mongoose';
import crypto from 'crypto';
import {
  BusinessProfile,
  UpdateBusinessProfileDTO,
} from '../types/businessProfile.types';
import { DEMO_TENANT_ID } from '../types/enquiry.types';
import { INITIAL_DEMO_PROFILE } from '../data/mockBusinessProfile';
import {
  BusinessProfileModel,
  toBusinessProfile,
} from '../models/businessProfile.model';
import { UserModel } from '../models/user.model';
import { DatabaseUnavailableError } from './enquiry.repository';

/**
 * Business Profile Repository
 *
 * Provides persistent data access for Business Profiles backed by MongoDB via Mongoose,
 * enforcing business-level data isolation, ownership, and fallback resilience.
 */
export class BusinessProfileRepository {
  private fallbackProfile: BusinessProfile;

  constructor() {
    this.fallbackProfile = {
      ...INITIAL_DEMO_PROFILE,
      contact: { ...INITIAL_DEMO_PROFILE.contact },
      location: { ...INITIAL_DEMO_PROFILE.location },
      categories: [...INITIAL_DEMO_PROFILE.categories],
    };
  }

  /**
   * Check whether MongoDB connection is actively established and ready
   */
  public isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  /**
   * Retrieve a business profile by its unique businessId.
   * If the businessId is DEMO_TENANT_ID or unauthenticated, returns the public demo profile.
   * If a registered business exists in UserModel but hasn't created a custom profile yet,
   * an initial profile is automatically created and returned.
   */
  public async findByBusinessId(businessId?: string): Promise<BusinessProfile | null> {
    const targetBusinessId = businessId && businessId.trim().length > 0
      ? businessId.trim()
      : DEMO_TENANT_ID;

    if (this.isConnected()) {
      const doc = await BusinessProfileModel.findOne({ businessId: targetBusinessId }).lean();
      if (doc) {
        return toBusinessProfile(doc);
      }

      // If demo profile was requested and not yet seeded, return the demo mock
      if (targetBusinessId === DEMO_TENANT_ID) {
        return {
          ...this.fallbackProfile,
          contact: { ...this.fallbackProfile.contact },
          location: { ...this.fallbackProfile.location },
          categories: [...this.fallbackProfile.categories],
        };
      }

      // If a registered user has this businessId, initialize their default profile in MongoDB
      const user = await UserModel.findOne({ businessId: targetBusinessId }).lean();
      if (user) {
        return this.createInitialProfile(user.businessId, user.businessName, user.email);
      }

      return null;
    }

    // Standby fallback when MongoDB is offline
    if (targetBusinessId === DEMO_TENANT_ID) {
      return {
        ...this.fallbackProfile,
        contact: { ...this.fallbackProfile.contact },
        location: { ...this.fallbackProfile.location },
        categories: [...this.fallbackProfile.categories],
      };
    }

    return null;
  }

  /**
   * Create an initial business profile for a new or existing business account.
   */
  public async createInitialProfile(
    businessId: string,
    businessName: string,
    email: string
  ): Promise<BusinessProfile> {
    if (!this.isConnected()) {
      throw new DatabaseUnavailableError(
        'Database is currently unavailable. Cannot create profile while offline.'
      );
    }

    const randomSuffix = crypto.randomBytes(4).toString('hex');
    const profileId = `prof_${Date.now().toString(36)}_${randomSuffix}`;

    const newDoc = await BusinessProfileModel.create({
      id: profileId,
      businessId,
      businessName: businessName.trim(),
      tagline: '',
      description: `Welcome to ${businessName.trim()}. Dedicated to delivering quality service.`,
      contact: {
        email: email.trim().toLowerCase(),
        phone: '',
        website: '',
      },
      location: {
        address: '',
        city: 'Local Area',
        state: '',
        postalCode: '',
        country: '',
      },
      categories: ['Outdoor and property services'],
    });

    return toBusinessProfile(newDoc);
  }

  /**
   * Update an existing business profile or upsert if not found.
   * Enforces businessId matching to guarantee strict ownership.
   */
  public async updateProfile(
    businessId: string,
    dto: UpdateBusinessProfileDTO
  ): Promise<BusinessProfile> {
    if (!this.isConnected()) {
      throw new DatabaseUnavailableError(
        'Database is currently unavailable. Cannot update profile while offline.'
      );
    }

    if (businessId === DEMO_TENANT_ID) {
      const error: any = new Error('Cannot modify the public demo business profile.');
      error.code = 'DEMO_READ_ONLY';
      throw error;
    }

    let existingDoc = await BusinessProfileModel.findOne({ businessId });

    if (!existingDoc) {
      // If profile doesn't exist yet, check user for baseline info
      const user = await UserModel.findOne({ businessId }).lean();
      const randomSuffix = crypto.randomBytes(4).toString('hex');
      const profileId = `prof_${Date.now().toString(36)}_${randomSuffix}`;

      existingDoc = new BusinessProfileModel({
        id: profileId,
        businessId,
        businessName: dto.businessName?.trim() || user?.businessName || 'My Business',
        tagline: dto.tagline?.trim() || '',
        description: dto.description?.trim() || '',
        contact: {
          email: dto.contact?.email?.trim().toLowerCase() || user?.email || '',
          phone: dto.contact?.phone?.trim() || '',
          website: dto.contact?.website?.trim() || '',
        },
        location: {
          address: dto.location?.address?.trim() || '',
          city: dto.location?.city?.trim() || 'Local Area',
          state: dto.location?.state?.trim() || '',
          postalCode: dto.location?.postalCode?.trim() || '',
          country: dto.location?.country?.trim() || '',
        },
        categories: Array.isArray(dto.categories) && dto.categories.length > 0
          ? dto.categories.map((c) => c.trim())
          : ['Outdoor and property services'],
      });
    } else {
      // Update individual fields if provided
      if (dto.businessName !== undefined) {
        existingDoc.businessName = dto.businessName.trim();
      }
      if (dto.tagline !== undefined) {
        existingDoc.tagline = dto.tagline.trim();
      }
      if (dto.description !== undefined) {
        existingDoc.description = dto.description.trim();
      }

      if (dto.contact) {
        if (dto.contact.email !== undefined) {
          existingDoc.contact.email = dto.contact.email.trim().toLowerCase();
        }
        if (dto.contact.phone !== undefined) {
          existingDoc.contact.phone = dto.contact.phone.trim();
        }
        if (dto.contact.website !== undefined) {
          existingDoc.contact.website = dto.contact.website.trim();
        }
      }

      if (dto.location) {
        if (dto.location.address !== undefined) {
          existingDoc.location.address = dto.location.address.trim();
        }
        if (dto.location.city !== undefined) {
          existingDoc.location.city = dto.location.city.trim();
        }
        if (dto.location.state !== undefined) {
          existingDoc.location.state = dto.location.state.trim();
        }
        if (dto.location.postalCode !== undefined) {
          existingDoc.location.postalCode = dto.location.postalCode.trim();
        }
        if (dto.location.country !== undefined) {
          existingDoc.location.country = dto.location.country.trim();
        }
      }

      if (Array.isArray(dto.categories)) {
        existingDoc.categories = dto.categories.map((c) => c.trim()).filter((c) => c.length > 0);
      }
    }

    const saved = await existingDoc.save();
    return toBusinessProfile(saved);
  }
}

export const businessProfileRepository = new BusinessProfileRepository();
