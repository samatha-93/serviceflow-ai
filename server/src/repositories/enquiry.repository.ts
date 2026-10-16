import mongoose from 'mongoose';
import { CustomerEnquiry, CreateEnquiryDTO, EnquiryStatus } from '../types/enquiry.types';
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
 * with controlled standby fallback when MongoDB is unavailable.
 *
 * Lifecycle & Persistence behavior:
 * - When MongoDB is connected (readyState === 1):
 *   - Reads (findAll, findById) query MongoDB.
 *   - Writes (create, updateStatus) persist directly to MongoDB.
 *   - Records survive server restarts.
 * - When MongoDB is unavailable:
 *   - Reads return a standalone read-only copy of demo enquiries.
 *   - Writes throw DatabaseUnavailableError so controllers return HTTP 503
 *     rather than silently pretending ephemeral in-memory state was saved.
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
   * Retrieve all enquiries.
   * Reads from MongoDB when connected (sorted newest first), or fallback demo records.
   */
  public async findAll(): Promise<CustomerEnquiry[]> {
    if (this.isConnected()) {
      const docs = await EnquiryModel.find().sort({ createdAt: -1, id: -1 }).lean();
      return docs.map((doc) => this.toCustomerEnquiry(doc));
    }

    return this.fallbackEnquiries.map((item) => ({ ...item }));
  }

  /**
   * Retrieve a single enquiry by ID (case-insensitive lookup)
   */
  public async findById(id: string): Promise<CustomerEnquiry | undefined> {
    const trimmedId = id.trim();
    const escaped = trimmedId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    if (this.isConnected()) {
      const doc = await EnquiryModel.findOne({
        id: { $regex: new RegExp(`^${escaped}$`, 'i') },
      }).lean();

      return doc ? this.toCustomerEnquiry(doc) : undefined;
    }

    const found = this.fallbackEnquiries.find(
      (item) => item.id.toLowerCase() === trimmedId.toLowerCase()
    );
    return found ? { ...found } : undefined;
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
   * Create a new customer enquiry.
   *
   * - Persists record in MongoDB when database is connected.
   * - If database is offline, throws DatabaseUnavailableError to avoid false claims of persistence.
   */
  public async create(dto: CreateEnquiryDTO): Promise<CustomerEnquiry> {
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
   * Update the status of an existing enquiry by ID.
   *
   * - Persists status in MongoDB when database is connected.
   * - If database is offline, throws DatabaseUnavailableError.
   * - Returns undefined if the record does not exist.
   */
  public async updateStatus(id: string, status: EnquiryStatus): Promise<CustomerEnquiry | undefined> {
    if (!this.isConnected()) {
      throw new DatabaseUnavailableError(
        'Database is unavailable. Cannot update enquiry status while database is disconnected.'
      );
    }

    const trimmedId = id.trim();
    const escaped = trimmedId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const updatedDoc = await EnquiryModel.findOneAndUpdate(
      { id: { $regex: new RegExp(`^${escaped}$`, 'i') } },
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
