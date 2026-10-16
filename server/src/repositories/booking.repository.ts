import mongoose from 'mongoose';
import { Booking, CreateBookingDTO, BookingStatus } from '../types/booking.types';
import { DEMO_TENANT_ID } from '../types/enquiry.types';
import { INITIAL_DEMO_BOOKINGS } from '../data/mockBookings';
import { BookingModel, BookingDocument } from '../models/booking.model';
import { DatabaseUnavailableError } from './enquiry.repository';

/**
 * Customer Booking Repository
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
 *   - Reads return standalone demo bookings for public demo view, or empty array for tenant views.
 *   - Writes throw DatabaseUnavailableError so callers know data was not saved.
 */
class BookingRepository {
  private fallbackBookings: Booking[];

  constructor() {
    this.fallbackBookings = INITIAL_DEMO_BOOKINGS.map((item) => ({ ...item }));
  }

  /**
   * Check whether MongoDB connection is actively established and ready
   */
  public isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  /**
   * Helper to project Mongoose document into clean Booking response shape
   * Eliminates _id, __v, and timestamps to preserve exact API contracts.
   */
  private toBooking(doc: any): Booking {
    return {
      id: doc.id,
      businessId: doc.businessId,
      enquiryId: doc.enquiryId || undefined,
      customerName: doc.customerName,
      serviceTitle: doc.serviceTitle,
      location: doc.location,
      bookingDate: doc.bookingDate,
      bookingTime: doc.bookingTime,
      duration: doc.duration || '1.0 hr',
      status: doc.status,
      assignee: doc.assignee || '',
      notes: doc.notes || '',
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  /**
   * Retrieve bookings scoped to the given businessId.
   * If businessId is not specified or is DEMO_TENANT_ID, returns public demo records.
   */
  public async findAll(businessId?: string): Promise<Booking[]> {
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

      const docs = await BookingModel.find(filter)
        .sort({ bookingDate: 1, bookingTime: 1, id: 1 })
        .lean();
      return docs.map((doc) => this.toBooking(doc));
    }

    if (!businessId || businessId === DEMO_TENANT_ID) {
      return this.fallbackBookings.map((item) => ({ ...item }));
    }

    return [];
  }

  /**
   * Retrieve a single booking by ID and businessId (case-insensitive ID lookup).
   * Ensures a tenant cannot read a booking belonging to another business.
   */
  public async findById(id: string, businessId?: string): Promise<Booking | undefined> {
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

      const doc = await BookingModel.findOne(filter).lean();
      return doc ? this.toBooking(doc) : undefined;
    }

    if (!businessId || businessId === DEMO_TENANT_ID) {
      const found = this.fallbackBookings.find(
        (item) => item.id.toLowerCase() === trimmedId.toLowerCase()
      );
      return found ? { ...found } : undefined;
    }

    return undefined;
  }

  /**
   * Retrieve a single booking by associated enquiryId and businessId.
   * Used to check whether an enquiry has already been converted to a booking.
   */
  public async findByEnquiryId(enquiryId: string, businessId?: string): Promise<Booking | undefined> {
    const trimmedEnquiryId = enquiryId.trim();
    const escaped = trimmedEnquiryId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    if (this.isConnected()) {
      const filter: any = {
        enquiryId: { $regex: new RegExp(`^${escaped}$`, 'i') },
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

      const doc = await BookingModel.findOne(filter).lean();
      return doc ? this.toBooking(doc) : undefined;
    }

    if (!businessId || businessId === DEMO_TENANT_ID) {
      const found = this.fallbackBookings.find(
        (item) => item.enquiryId && item.enquiryId.toLowerCase() === trimmedEnquiryId.toLowerCase()
      );
      return found ? { ...found } : undefined;
    }

    return undefined;
  }

  /**
   * Generate next unique BK-XXXX identifier safely
   */
  private async generateNextId(): Promise<string> {
    if (this.isConnected()) {
      const docs = await BookingModel.find({}, { id: 1 }).lean();
      let maxIdNumber = 0;
      for (const doc of docs) {
        const match = doc.id.match(/^BK-(\d+)$/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxIdNumber) {
            maxIdNumber = num;
          }
        }
      }

      const startNumber = maxIdNumber > 0 ? maxIdNumber + 1 : 8901;
      let candidateNumber = startNumber;
      let candidateId = `BK-${candidateNumber}`;

      while (await BookingModel.exists({ id: candidateId })) {
        candidateNumber++;
        candidateId = `BK-${candidateNumber}`;
      }

      return candidateId;
    }

    // Fallback ID generation if called in offline mode
    let maxIdNumber = 0;
    for (const b of this.fallbackBookings) {
      const match = b.id.match(/^BK-(\d+)$/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxIdNumber) {
          maxIdNumber = num;
        }
      }
    }
    const startNumber = maxIdNumber > 0 ? maxIdNumber + 1 : 8901;
    return `BK-${startNumber}`;
  }

  /**
   * Create a new booking for a specific business.
   *
   * - Persists record in MongoDB stamped with businessId.
   * - If database is offline, throws DatabaseUnavailableError.
   */
  public async create(dto: CreateBookingDTO, businessId: string): Promise<Booking> {
    if (!this.isConnected()) {
      throw new DatabaseUnavailableError(
        'Database is unavailable. Cannot persist new booking while database is disconnected.'
      );
    }

    const duration = dto.duration?.trim() || '1.0 hr';
    const status: BookingStatus = dto.status || 'Pending';
    const assignee = dto.assignee?.trim() || '';
    const notes = dto.notes?.trim() || '';
    const enquiryId = dto.enquiryId?.trim() || undefined;

    // Retry loop in case of concurrent candidate ID collisions
    const MAX_RETRIES = 3;
    let lastError: unknown;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const id = await this.generateNextId();
        const createdDoc = await BookingModel.create({
          id,
          businessId,
          enquiryId,
          customerName: dto.customerName.trim(),
          serviceTitle: dto.serviceTitle.trim(),
          location: dto.location.trim(),
          bookingDate: dto.bookingDate.trim(),
          bookingTime: dto.bookingTime.trim(),
          duration,
          status,
          assignee,
          notes,
        });

        return this.toBooking(createdDoc);
      } catch (err: any) {
        lastError = err;
        // If collision occurred specifically on the unique 'id' field, retry with newly computed ID
        if (err?.code === 11000 && err?.keyPattern?.id) {
          continue;
        }
        // If error is duplicate enquiryId or another validation error, do not retry
        throw err;
      }
    }

    throw lastError;
  }

  /**
   * Delete a booking by ID and businessId.
   * Used for compensating rollbacks in case of partial conversion failures.
   */
  public async deleteById(id: string, businessId: string): Promise<boolean> {
    if (!this.isConnected()) {
      return false;
    }
    const trimmedId = id.trim();
    const escaped = trimmedId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const result = await BookingModel.deleteOne({
      id: { $regex: new RegExp(`^${escaped}$`, 'i') },
      businessId,
    });
    return (result.deletedCount ?? 0) > 0;
  }

  /**
   * Update the status of an existing booking by ID with business ownership enforcement.
   *
   * - Finds and updates ONLY if id AND businessId match.
   * - Prevents cross-tenant status modifications.
   * - Returns undefined if the record does not exist or belongs to another business.
   */
  public async updateStatus(
    id: string,
    status: BookingStatus,
    businessId: string
  ): Promise<Booking | undefined> {
    if (!this.isConnected()) {
      throw new DatabaseUnavailableError(
        'Database is unavailable. Cannot update booking status while database is disconnected.'
      );
    }

    const trimmedId = id.trim();
    const escaped = trimmedId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const updatedDoc = await BookingModel.findOneAndUpdate(
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

    return this.toBooking(updatedDoc);
  }
}

export const bookingRepository = new BookingRepository();
