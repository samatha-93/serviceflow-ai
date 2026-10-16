import { Request, Response, NextFunction } from 'express';
import { enquiryRepository } from '../repositories/enquiry.repository';

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
