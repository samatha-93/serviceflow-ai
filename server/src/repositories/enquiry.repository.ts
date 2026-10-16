import { CustomerEnquiry } from '../types/enquiry.types';
import { INITIAL_DEMO_ENQUIRIES } from '../data/mockEnquiries';

/**
 * In-memory enquiry repository
 *
 * Provides isolated data access for customer enquiries.
 * Note: Data is held in-memory and is non-persistent across server restarts.
 */
class EnquiryRepository {
  private enquiries: CustomerEnquiry[];

  constructor() {
    // Initialize in-memory storage with the demo dataset
    this.enquiries = [...INITIAL_DEMO_ENQUIRIES];
  }

  /**
   * Retrieve all enquiries
   */
  public findAll(): CustomerEnquiry[] {
    return [...this.enquiries];
  }

  /**
   * Retrieve a single enquiry by ID
   */
  public findById(id: string): CustomerEnquiry | undefined {
    return this.enquiries.find((item) => item.id.toLowerCase() === id.toLowerCase());
  }
}

export const enquiryRepository = new EnquiryRepository();
