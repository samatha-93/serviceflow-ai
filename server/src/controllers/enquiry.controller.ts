import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth.types';
import {
  enquiryRepository,
  DatabaseUnavailableError,
} from '../repositories/enquiry.repository';
import {
  isEnquiryStatus,
  isEnquiryUrgency,
  VALID_ENQUIRY_STATUSES,
  VALID_ENQUIRY_URGENCIES,
} from '../types/enquiry.types';

/**
 * GET /api/enquiries
 * Retrieve customer enquiries scoped to the authenticated business,
 * or the public demo enquiries if unauthenticated.
 */
export const getEnquiries = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const isConnected = enquiryRepository.isConnected();
    res.setHeader('X-Database-Status', isConnected ? 'connected' : 'disconnected');

    const businessId = req.user?.businessId;
    const enquiries = await enquiryRepository.findAll(businessId);
    res.status(200).json({
      status: 'success',
      data: enquiries,
      count: enquiries.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/enquiries/:id
 * Retrieve a single customer enquiry by ID, verifying tenant ownership.
 */
export const getEnquiryById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id || id.trim().length === 0) {
      res.status(400).json({
        status: 'error',
        message: 'Enquiry ID is required',
      });
      return;
    }

    const businessId = req.user?.businessId;
    const enquiry = await enquiryRepository.findById(id, businessId);


    if (!enquiry) {
      res.status(404).json({
        status: 'error',
        message: `Enquiry with ID "${id}" not found`,
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/enquiries
 * Create a new customer enquiry in MongoDB
 *
 * Runtime validations:
 * - Checks that body is a valid JSON object.
 * - Validates required string fields: customerName, serviceCategory, serviceTitle, location, message.
 * - Validates status (if provided) against allowed EnquiryStatus values.
 * - Validates urgency (if provided) against allowed EnquiryUrgency values.
 * - Validates suggestedReply (if provided) is a string.
 * - Validates receivedTime (if provided) is a non-empty string.
 * - Ensures persistent database is available; returns HTTP 503 rather than false success.
 *
 * Responses:
 * - HTTP 201: Created successfully in MongoDB with generated ID and timestamp.
 * - HTTP 400: Missing, invalid, or malformed input.
 * - HTTP 503: Database unavailable for persistent storage.
 */
export const createEnquiry = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || !req.user.businessId) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required to create enquiries.',
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
      serviceCategory,
      serviceTitle,
      location,
      message,
      status,
      urgency,
      suggestedReply,
      receivedTime,
    } = req.body;

    const requiredFields = [
      { name: 'customerName', value: customerName },
      { name: 'serviceCategory', value: serviceCategory },
      { name: 'serviceTitle', value: serviceTitle },
      { name: 'location', value: location },
      { name: 'message', value: message },
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
        message: `Missing or invalid required field(s): ${missingOrInvalidFields.join(', ')}. Each must be a non-empty string.`,
      });
      return;
    }

    if (status !== undefined && !isEnquiryStatus(status)) {
      res.status(400).json({
        status: 'error',
        message: `Invalid status "${status}". Allowed values: ${VALID_ENQUIRY_STATUSES.join(', ')}`,
      });
      return;
    }

    if (urgency !== undefined && !isEnquiryUrgency(urgency)) {
      res.status(400).json({
        status: 'error',
        message: `Invalid urgency "${urgency}". Allowed values: ${VALID_ENQUIRY_URGENCIES.join(', ')}`,
      });
      return;
    }

    if (suggestedReply !== undefined && typeof suggestedReply !== 'string') {
      res.status(400).json({
        status: 'error',
        message: 'suggestedReply must be a string',
      });
      return;
    }

    if (
      receivedTime !== undefined &&
      (typeof receivedTime !== 'string' || receivedTime.trim().length === 0)
    ) {
      res.status(400).json({
        status: 'error',
        message: 'receivedTime must be a non-empty string when provided',
      });
      return;
    }

    // Guard against silently claiming data was persisted when database is unavailable
    if (!enquiryRepository.isConnected()) {
      res.status(503).json({
        status: 'error',
        message:
          'Database is unavailable. Cannot persist new enquiry while database is disconnected.',
      });
      return;
    }

    const newEnquiry = await enquiryRepository.create(
      {
        customerName,
        serviceCategory,
        serviceTitle,
        location,
        message,
        status,
        urgency,
        suggestedReply,
        receivedTime,
      },
      req.user.businessId
    );

    res.status(201).json({
      status: 'success',
      data: newEnquiry,
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
 * PATCH /api/enquiries/:id/status
 * Update the status of an existing customer enquiry in MongoDB with business ownership check
 */
export const updateEnquiryStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || !req.user.businessId) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required to update enquiries.',
      });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id || id.trim().length === 0) {
      res.status(400).json({
        status: 'error',
        message: 'Enquiry ID is required',
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

    if (!status || !isEnquiryStatus(status)) {
      res.status(400).json({
        status: 'error',
        message: `Invalid or missing status "${status}". Allowed statuses: ${VALID_ENQUIRY_STATUSES.join(', ')}`,
      });
      return;
    }

    // Guard against silently claiming status was updated when database is unavailable
    if (!enquiryRepository.isConnected()) {
      res.status(503).json({
        status: 'error',
        message:
          'Database is unavailable. Cannot update enquiry status while database is disconnected.',
      });
      return;
    }

    const updated = await enquiryRepository.updateStatus(id, status, req.user.businessId);

    if (!updated) {
      res.status(404).json({
        status: 'error',
        message: `Enquiry with ID "${id}" not found`,
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
