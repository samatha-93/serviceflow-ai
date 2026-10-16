import mongoose from 'mongoose';
import { CustomerEnquiry, CreateEnquiryDTO, EnquiryStatus, DEMO_TENANT_ID } from '../types/enquiry.types';
import { INITIAL_DEMO_ENQUIRIES } from '../data/mockEnquiries';
import { EnquiryModel } from '../models/enquiry.model';

export class DatabaseUnavailableError extends Error {
  constructor(message = 'Database is currently unavailable.') {
    super(message);
    this.name = 'DatabaseUnavailableError';
  }
}

/**
 * Customer Enquiry Repository
 *
 * Provides persistent data access backed by MongoDB via Mongoose,
 * with strict multi-tenant business-level data isolation.
 *
 * Tenant Isolation & Persistence behavior:
 * - When MongoDB is connected (readyState === 1):
 *   - Reads (findAll, findById) are strictly scoped to the requesting businessId
 *     (or DEMO_TENANT_ID for unauthenticated public demo visits).
 *   - Writes (create, updateStatus) enforce business ownership in every query.
 *   - Cross-tenant queries return 404 / undefined.
 * - When MongoDB is unavailable:
 *   - Reads return standalone demo enquiries for public demo view, or empty array for tenant views.
 *   - Writes throw DatabaseUnavailableError so controllers return HTTP 503.
 */
class EnquiryRepository {
  private fallbackEnquiries: CustomerEnquiry[];

  constructor() {
    // In-memory fallback representation for read-only standby mode
    this.fallbackEnquiries = INITIAL_DEMO_ENQUIRIES.map((item) => ({ ...item }));
  }

  /**
   * Check whether MongoDB connection is actively established and ready
   */
  public isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  /**
   * Helper to project Mongoose document into clean CustomerEnquiry response shape
   * Eliminates _id, __v, and timestamps to preserve exact API contracts.
   */
  private toCustomerEnquiry(doc: any): CustomerEnquiry {
    return {
      id: doc.id,
      businessId: doc.businessId,
      customerName: doc.customerName,
      serviceCategory: doc.serviceCategory,
      serviceTitle: doc.serviceTitle,
      location: doc.location,
      receivedTime: doc.receivedTime,
      status: doc.status,
      urgency: doc.urgency,
      message: doc.message,
      suggestedReply: doc.suggestedReply || '',
    };
  }

  /**
   * Retrieve enquiries scoped to the given businessId.
   * If businessId is not specified or is DEMO_TENANT_ID, returns public demo records.
   */
  public async findAll(businessId?: string): Promise<CustomerEnquiry[]> {
    if (this.isConnected()) {
      const filter = businessId && businessId !== DEMO_TENANT_ID
        ? { businessId }
        : {
            $or: [
              { businessId: DEMO_TENANT_ID },
              { businessId: { $exists: false } },
              { businessId: null },
            ],
          };

      const docs = await EnquiryModel.find(filter).sort({ createdAt: -1, id: -1 }).lean();
      return docs.map((doc) => this.toCustomerEnquiry(doc));
    }

    if (!businessId || businessId === DEMO_TENANT_ID) {
      return this.fallbackEnquiries.map((item) => ({ ...item }));
    }

    return [];
  }

  /**
   * Retrieve a single enquiry by ID and businessId (case-insensitive ID lookup).
   * Ensures a tenant cannot read an enquiry belonging to another business.
   */
  public async findById(id: string, businessId?: string): Promise<CustomerEnquiry | undefined> {
    const trimmedId = id.trim();
    const escaped = trimmedId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    if (this.isConnected()) {
      const filter: any = {
        id: { $regex: new RegExp(`^${escaped}$`, 'i') },
      };

      if (businessId && businessId !== DEMO_TENANT_ID) {
        filter.businessId = businessId;
      } else {
        filter.$or = [
          { businessId: DEMO_TENANT_ID },
          { businessId: { $exists: false } },
          { businessId: null },
        ];
      }

      const doc = await EnquiryModel.findOne(filter).lean();
      return doc ? this.toCustomerEnquiry(doc) : undefined;
    }

    if (!businessId || businessId === DEMO_TENANT_ID) {
      const found = this.fallbackEnquiries.find(
        (item) => item.id.toLowerCase() === trimmedId.toLowerCase()
      );
      return found ? { ...found } : undefined;
    }

    return undefined;
  }

  /**
   * Generate next unique ENQ-XXXX identifier
   * Inspects existing ENQ-XXXX IDs in MongoDB, computes highest numeric value, and increments by 1.
   */
  private async generateNextId(): Promise<string> {
    if (this.isConnected()) {
      const docs = await EnquiryModel.find({}, { id: 1 }).lean();
      let maxIdNumber = 0;
      for (const doc of docs) {
        const match = doc.id.match(/^ENQ-(\d+)$/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxIdNumber) {
            maxIdNumber = num;
          }
        }
      }

      const startNumber = maxIdNumber > 0 ? maxIdNumber + 1 : 1001;
      let candidateNumber = startNumber;
      let candidateId = `ENQ-${candidateNumber}`;

      while (await EnquiryModel.exists({ id: candidateId })) {
        candidateNumber++;
        candidateId = `ENQ-${candidateNumber}`;
      }

      return candidateId;
    }

    // Fallback ID generation if called in offline mode
    let maxIdNumber = 0;
    for (const enquiry of this.fallbackEnquiries) {
      const match = enquiry.id.match(/^ENQ-(\d+)$/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxIdNumber) {
          maxIdNumber = num;
        }
      }
    }
    const startNumber = maxIdNumber > 0 ? maxIdNumber + 1 : 1001;
    return `ENQ-${startNumber}`;
  }

  /**
   * Create a new customer enquiry for a specific business.
   *
   * - Persists record in MongoDB stamped with businessId.
   * - If database is offline, throws DatabaseUnavailableError.
   */
  public async create(dto: CreateEnquiryDTO, businessId: string): Promise<CustomerEnquiry> {
    if (!this.isConnected()) {
      throw new DatabaseUnavailableError(
        'Database is unavailable. Cannot persist new enquiry while database is disconnected.'
      );
    }

    const id = await this.generateNextId();
    const receivedTime = dto.receivedTime?.trim() || 'Just now';
    const status: EnquiryStatus = dto.status || 'Awaiting Review';
    const urgency = dto.urgency || 'Standard';
    const suggestedReply = dto.suggestedReply?.trim() || '';

    const createdDoc = await EnquiryModel.create({
      id,
      businessId,
      customerName: dto.customerName.trim(),
      serviceCategory: dto.serviceCategory.trim(),
      serviceTitle: dto.serviceTitle.trim(),
      location: dto.location.trim(),
      receivedTime,
      status,
      urgency,
      message: dto.message.trim(),
      suggestedReply,
    });

    return this.toCustomerEnquiry(createdDoc);
  }

  /**
   * Update the status of an existing enquiry by ID with business ownership enforcement.
   *
   * - Finds and updates ONLY if id AND businessId match.
   * - Prevents cross-tenant status modifications.
   * - Returns undefined if the record does not exist or belongs to another business.
   */
  public async updateStatus(
    id: string,
    status: EnquiryStatus,
    businessId: string
  ): Promise<CustomerEnquiry | undefined> {
    if (!this.isConnected()) {
      throw new DatabaseUnavailableError(
        'Database is unavailable. Cannot update enquiry status while database is disconnected.'
      );
    }

    const trimmedId = id.trim();
    const escaped = trimmedId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const updatedDoc = await EnquiryModel.findOneAndUpdate(
      {
        id: { $regex: new RegExp(`^${escaped}$`, 'i') },
        businessId,
      },
      { $set: { status } },
      { new: true }
    ).lean();

    if (!updatedDoc) {
      return undefined;
    }

    return this.toCustomerEnquiry(updatedDoc);
  }
}

export const enquiryRepository = new EnquiryRepository();
