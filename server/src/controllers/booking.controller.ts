import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth.types';
import {
  bookingRepository,
} from '../repositories/booking.repository';
import {
  enquiryRepository,
  DatabaseUnavailableError,
} from '../repositories/enquiry.repository';
import {
  isBookingStatus,
  VALID_BOOKING_STATUSES,
  BookingStatus,
} from '../types/booking.types';

/**
 * Validate that date string conforms to YYYY-MM-DD and is a real calendar date
 */
function isValidDateString(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return false;
  }
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  return (
    dateObj.getFullYear() === year &&
    dateObj.getMonth() === month - 1 &&
    dateObj.getDate() === day
  );
}

/**
 * GET /api/bookings
 * Retrieve customer bookings scoped to the authenticated business,
 * or the public demo bookings if unauthenticated.
 */
export const getBookings = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const isConnected = bookingRepository.isConnected();
    res.setHeader('X-Database-Status', isConnected ? 'connected' : 'disconnected');

    const businessId = req.user?.businessId;
    const bookings = await bookingRepository.findAll(businessId);
    res.status(200).json({
      status: 'success',
      data: bookings,
      count: bookings.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/bookings/:id
 * Retrieve a single customer booking by ID, verifying tenant ownership.
 */
export const getBookingById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id || id.trim().length === 0) {
      res.status(400).json({
        status: 'error',
        message: 'Booking ID is required',
      });
      return;
    }

    const businessId = req.user?.businessId;
    const booking = await bookingRepository.findById(id, businessId);

    if (!booking) {
      res.status(404).json({
        status: 'error',
        message: `Booking with ID "${id}" not found`,
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/bookings
 * Create a new customer booking in MongoDB.
 *
 * Runtime validations:
 * - Requires authentication (`req.user.businessId`).
 * - Validates required string fields: customerName, serviceTitle, location, bookingDate, bookingTime.
 * - Validates date format (YYYY-MM-DD) and logical validity.
 * - Validates status (if provided) against allowed BookingStatus values.
 * - Validates duration, assignee, notes (if provided) are strings.
 * - If enquiryId is provided:
 *   - Verifies enquiry belongs to authenticated business (or returns 404).
 *   - Verifies enquiry has not already been converted to an existing booking (returns 409 Conflict).
 *   - Updates enquiry status to 'Booked' upon successful booking creation.
 * - Guard: Returns HTTP 503 if MongoDB is disconnected.
 */
export const createBooking = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || !req.user.businessId) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required to create bookings.',
      });
      return;
    }

    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      res.status(400).json({
        status: 'error',
        message: 'Request body must be a valid JSON object',
      });
      return;
    }

    const {
      customerName,
      serviceTitle,
      location,
      bookingDate,
      bookingTime,
      duration,
      status,
      assignee,
      notes,
      enquiryId,
    } = req.body;

    // Required fields check
    const requiredFields = [
      { name: 'customerName', value: customerName },
      { name: 'serviceTitle', value: serviceTitle },
      { name: 'location', value: location },
      { name: 'bookingDate', value: bookingDate },
      { name: 'bookingTime', value: bookingTime },
    ];

    const missingOrInvalidFields: string[] = [];
    for (const field of requiredFields) {
      if (typeof field.value !== 'string' || field.value.trim().length === 0) {
        missingOrInvalidFields.push(field.name);
      }
    }

    if (missingOrInvalidFields.length > 0) {
      res.status(400).json({
        status: 'error',
        message: `Missing or invalid required field(s): ${missingOrInvalidFields.join(
          ', '
        )}. Each must be a non-empty string.`,
      });
      return;
    }

    // Date validation
    if (!isValidDateString(bookingDate.trim())) {
      res.status(400).json({
        status: 'error',
        message: `Invalid bookingDate "${bookingDate}". Must be a valid date in YYYY-MM-DD format.`,
      });
      return;
    }

    // Status validation
    if (status !== undefined && !isBookingStatus(status)) {
      res.status(400).json({
        status: 'error',
        message: `Invalid status "${status}". Allowed values: ${VALID_BOOKING_STATUSES.join(
          ', '
        )}`,
      });
      return;
    }

    // Optional string fields validation
    if (duration !== undefined && typeof duration !== 'string') {
      res.status(400).json({
        status: 'error',
        message: 'duration must be a string when provided',
      });
      return;
    }

    if (assignee !== undefined && typeof assignee !== 'string') {
      res.status(400).json({
        status: 'error',
        message: 'assignee must be a string when provided',
      });
      return;
    }

    if (notes !== undefined && typeof notes !== 'string') {
      res.status(400).json({
        status: 'error',
        message: 'notes must be a string when provided',
      });
      return;
    }

    // Check database readiness before attempting any operations
    if (!bookingRepository.isConnected()) {
      res.status(503).json({
        status: 'error',
        message:
          'Database is unavailable. Cannot persist new booking while database is disconnected.',
      });
      return;
    }

    // If enquiryId provided, check ownership and prevent duplicate conversion
    let verifiedEnquiryId: string | undefined = undefined;
    if (enquiryId !== undefined) {
      if (typeof enquiryId !== 'string' || enquiryId.trim().length === 0) {
        res.status(400).json({
          status: 'error',
          message: 'enquiryId must be a non-empty string when provided',
        });
        return;
      }

      const trimmedEnquiryId = enquiryId.trim();
      const existingEnquiry = await enquiryRepository.findById(
        trimmedEnquiryId,
        req.user.businessId
      );

      if (!existingEnquiry) {
        res.status(404).json({
          status: 'error',
          message: `Enquiry with ID "${trimmedEnquiryId}" not found for your business`,
        });
        return;
      }

      // Check whether this enquiry was already converted to a booking
      const alreadyConverted = await bookingRepository.findByEnquiryId(
        trimmedEnquiryId,
        req.user.businessId
      );

      if (alreadyConverted) {
        res.status(409).json({
          status: 'error',
          message: `Enquiry "${trimmedEnquiryId}" has already been converted to booking "${alreadyConverted.id}".`,
          bookingId: alreadyConverted.id,
        });
        return;
      }

      verifiedEnquiryId = trimmedEnquiryId;
    }

    // Create booking in database
    let newBooking;
    try {
      newBooking = await bookingRepository.create(
        {
          customerName,
          serviceTitle,
          location,
          bookingDate: bookingDate.trim(),
          bookingTime: bookingTime.trim(),
          duration,
          status: status || 'Pending',
          assignee,
          notes,
          enquiryId: verifiedEnquiryId,
        },
        req.user.businessId
      );
    } catch (createErr: any) {
      if (createErr?.code === 11000 && createErr?.keyPattern?.enquiryId) {
        res.status(409).json({
          status: 'error',
          message: `Enquiry "${verifiedEnquiryId}" has already been converted to a booking.`,
        });
        return;
      }
      throw createErr;
    }

    // If an enquiry was attached, update its status to 'Booked'
    if (verifiedEnquiryId) {
      try {
        await enquiryRepository.updateStatus(
          verifiedEnquiryId,
          'Booked',
          req.user.businessId
        );
      } catch (updateErr) {
        console.error(
          `[Bookings] Error: Booking ${newBooking.id} created, but failed to update enquiry ${verifiedEnquiryId} status. Executing compensating rollback:`,
          updateErr
        );
        // Execute compensating rollback to prevent inconsistent state
        try {
          await bookingRepository.deleteById(newBooking.id, req.user.businessId);
        } catch (rollbackErr) {
          console.error(
            `[Bookings] Critical: Compensating rollback failed for booking ${newBooking.id}:`,
            rollbackErr
          );
        }
        throw updateErr;
      }
    }

    res.status(201).json({
      status: 'success',
      data: newBooking,
    });
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) {
      res.status(503).json({
        status: 'error',
        message: error.message,
      });
      return;
    }
    next(error);
  }
};

/**
 * PATCH /api/bookings/:id/status
 * Update the status of an existing customer booking with business ownership enforcement.
 */
export const updateBookingStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || !req.user.businessId) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required to update bookings.',
      });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id || id.trim().length === 0) {
      res.status(400).json({
        status: 'error',
        message: 'Booking ID is required',
      });
      return;
    }

    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      res.status(400).json({
        status: 'error',
        message: 'Request body must be a valid JSON object containing status',
      });
      return;
    }

    const { status } = req.body;

    if (!status || !isBookingStatus(status)) {
      res.status(400).json({
        status: 'error',
        message: `Invalid or missing status "${status}". Allowed statuses: ${VALID_BOOKING_STATUSES.join(
          ', '
        )}`,
      });
      return;
    }

    if (!bookingRepository.isConnected()) {
      res.status(503).json({
        status: 'error',
        message:
          'Database is unavailable. Cannot update booking status while database is disconnected.',
      });
      return;
    }

    const updated = await bookingRepository.updateStatus(
      id,
      status as BookingStatus,
      req.user.businessId
    );

    if (!updated) {
      res.status(404).json({
        status: 'error',
        message: `Booking with ID "${id}" not found`,
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: updated,
    });
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) {
      res.status(503).json({
        status: 'error',
        message: error.message,
      });
      return;
    }
    next(error);
  }
};
