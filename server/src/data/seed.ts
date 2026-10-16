import { EnquiryModel } from '../models/enquiry.model';
import { INITIAL_DEMO_ENQUIRIES } from './mockEnquiries';

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
