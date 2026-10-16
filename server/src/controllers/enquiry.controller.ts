import { Request, Response, NextFunction } from 'express';
import { enquiryRepository } from '../repositories/enquiry.repository';
import {
  isEnquiryStatus,
  isEnquiryUrgency,
  VALID_ENQUIRY_STATUSES,
  VALID_ENQUIRY_URGENCIES,
} from '../types/enquiry.types';

/**
 * GET /api/enquiries
 * Retrieve all customer enquiries
 */
export const getEnquiries = (_req: Request, res: Response, next: NextFunction): void => {
  try {
    const enquiries = enquiryRepository.findAll();
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
 * Retrieve a single customer enquiry by ID
 */
export const getEnquiryById = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      res.status(400).json({
        status: 'error',
        message: 'Enquiry ID is required',
      });
      return;
    }

    const enquiry = enquiryRepository.findById(id);

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
 * Create a new customer enquiry
 *
 * Runtime validations:
 * - Checks that body is a valid JSON object.
 * - Validates required string fields: customerName, serviceCategory, serviceTitle, location, message.
 * - Validates status (if provided) against allowed EnquiryStatus values.
 * - Validates urgency (if provided) against allowed EnquiryUrgency values.
 * - Validates suggestedReply (if provided) is a string.
 * - Validates receivedTime (if provided) is a non-empty string.
 *
 * Responses:
 * - HTTP 201: Created successfully with generated ID and timestamp.
 * - HTTP 400: Missing, invalid, or malformed input.
 */
export const createEnquiry = (req: Request, res: Response, next: NextFunction): void => {
  try {
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

    const newEnquiry = enquiryRepository.create({
      customerName,
      serviceCategory,
      serviceTitle,
      location,
      message,
      status,
      urgency,
      suggestedReply,
      receivedTime,
    });

    res.status(201).json({
      status: 'success',
      data: newEnquiry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/enquiries/:id/status
 * Update the status of an existing customer enquiry
 *
 * Validations:
 * - Enquiry ID must be provided.
 * - Request body must include a valid status matching allowed EnquiryStatus values.
 * - Target enquiry must exist in repository.
 *
 * Responses:
 * - HTTP 200: Successfully updated enquiry record.
 * - HTTP 400: Missing/invalid status or malformed input.
 * - HTTP 404: Enquiry not found.
 */
export const updateEnquiryStatus = (req: Request, res: Response, next: NextFunction): void => {
  try {
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

    const updated = enquiryRepository.updateStatus(id, status);

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
    next(error);
  }
};

