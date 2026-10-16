import { EnquiryModel } from '../models/enquiry.model';
import { INITIAL_DEMO_ENQUIRIES } from './mockEnquiries';
import { BookingModel } from '../models/booking.model';
import { INITIAL_DEMO_BOOKINGS } from './mockBookings';

/**
 * Seed initial demo enquiries into MongoDB.
 *
 * Controlled & Idempotent:
 * - Uses bulkWrite with $setOnInsert based on enquiry.id.
 * - If documents with matching IDs already exist, they are preserved untouched
 *   (any user-updated statuses or fields remain intact).
 * - Avoids duplicating demo records across server restarts.
 */
export async function seedDemoEnquiries(): Promise<void> {
  try {
    const operations = INITIAL_DEMO_ENQUIRIES.map((enquiry) => ({
      updateOne: {
        filter: { id: enquiry.id },
        update: { $setOnInsert: enquiry },
        upsert: true,
      },
    }));

    const result = await EnquiryModel.bulkWrite(operations, { ordered: false });
    if (result.upsertedCount > 0) {
      console.log(`[Database] Seeded ${result.upsertedCount} demo enquiries into MongoDB.`);
    } else {
      console.log('[Database] Demo enquiries already present in MongoDB. No duplicate seeding needed.');
    }

    // Explicit, safe migration: ensure existing demo records are associated with DEMO_TENANT_ID without modifying any user-updated fields
    await EnquiryModel.updateMany(
      {
        id: { $in: INITIAL_DEMO_ENQUIRIES.map((e) => e.id) },
        $or: [{ businessId: { $exists: false } }, { businessId: null }, { businessId: '' }],
      },
      { $set: { businessId: INITIAL_DEMO_ENQUIRIES[0].businessId } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Database] Error during demo enquiries seeding: ${message}`);
  }
}

/**
 * Seed initial demo bookings into MongoDB.
 *
 * Controlled & Idempotent:
 * - Uses bulkWrite with $setOnInsert based on booking.id.
 * - If documents with matching IDs already exist, they are preserved untouched.
 * - Avoids duplicating demo records across server restarts.
 */
export async function seedDemoBookings(): Promise<void> {
  try {
    await BookingModel.init();

    const operations = INITIAL_DEMO_BOOKINGS.map((booking) => ({
      updateOne: {
        filter: { id: booking.id },
        update: { $setOnInsert: booking },
        upsert: true,
      },
    }));

    const result = await BookingModel.bulkWrite(operations, { ordered: false });
    if (result.upsertedCount > 0) {
      console.log(`[Database] Seeded ${result.upsertedCount} demo bookings into MongoDB.`);
    } else {
      console.log('[Database] Demo bookings already present in MongoDB. No duplicate seeding needed.');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Database] Error during demo bookings seeding: ${message}`);
  }
}
