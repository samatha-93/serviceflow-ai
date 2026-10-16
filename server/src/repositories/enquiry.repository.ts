import { CustomerEnquiry, CreateEnquiryDTO, EnquiryStatus } from '../types/enquiry.types';
import { INITIAL_DEMO_ENQUIRIES } from '../data/mockEnquiries';

/**
 * In-memory customer enquiry repository
 *
 * Provides isolated data access for customer enquiries.
 *
 * PERSISTENCE & LIFECYCLE NOTICE:
 * - Data is held entirely in-memory during the server process lifetime.
 * - Created enquiries and status modifications are immediately reflected in-process.
 * - All state RESETS to INITIAL_DEMO_ENQUIRIES when the server restarts.
 * - Database persistence (MongoDB) is intentionally disconnected for this development phase.
 */
class EnquiryRepository {
  private enquiries: CustomerEnquiry[];

  constructor() {
    // Initialize in-memory storage with independent copies of the demo dataset
    this.enquiries = INITIAL_DEMO_ENQUIRIES.map((item) => ({ ...item }));
  }

  /**
   * Retrieve all enquiries
   * Returns a copy of the in-memory array
   */
  public findAll(): CustomerEnquiry[] {
    return [...this.enquiries];
  }

  /**
   * Retrieve a single enquiry by ID (case-insensitive lookup)
   */
  public findById(id: string): CustomerEnquiry | undefined {
    return this.enquiries.find((item) => item.id.toLowerCase() === id.trim().toLowerCase());
  }

  /**
   * Generate next unique ENQ-XXXX identifier
   * Inspects existing ENQ-XXXX IDs, computes the highest numeric value, and increments by 1.
   */
  private generateNextId(): string {
    let maxIdNumber = 0;
    for (const enquiry of this.enquiries) {
      const match = enquiry.id.match(/^ENQ-(\d+)$/i);
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

    // Collision safety guarantee
    while (this.enquiries.some((e) => e.id.toLowerCase() === candidateId.toLowerCase())) {
      candidateNumber++;
      candidateId = `ENQ-${candidateNumber}`;
    }

    return candidateId;
  }

  /**
   * Create a new customer enquiry
   *
   * - Generates a unique ENQ-XXXX ID.
   * - Sets receivedTime (defaults to 'Just now' if omitted).
   * - Sets default status ('Awaiting Review') and urgency ('Standard') if not specified.
   * - Prepends the new record so newest enquiries appear first.
   */
  public create(dto: CreateEnquiryDTO): CustomerEnquiry {
    const id = this.generateNextId();
    const receivedTime = dto.receivedTime?.trim() || 'Just now';
    const status: EnquiryStatus = dto.status || 'Awaiting Review';
    const urgency = dto.urgency || 'Standard';
    const suggestedReply = dto.suggestedReply?.trim() || '';

    const newEnquiry: CustomerEnquiry = {
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
    };

    this.enquiries.unshift(newEnquiry);
    return { ...newEnquiry };
  }

  /**
   * Update the status of an existing enquiry by ID
   *
   * Updates the in-memory record and returns the updated enquiry copy.
   * Returns undefined if the enquiry does not exist.
   */
  public updateStatus(id: string, status: EnquiryStatus): CustomerEnquiry | undefined {
    const enquiry = this.findById(id);
    if (!enquiry) {
      return undefined;
    }

    enquiry.status = status;
    return { ...enquiry };
  }
}

export const enquiryRepository = new EnquiryRepository();

