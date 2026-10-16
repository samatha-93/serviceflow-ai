import { Router } from 'express';
import {
  getEnquiries,
  getEnquiryById,
  createEnquiry,
  updateEnquiryStatus,
} from '../controllers/enquiry.controller';

const router = Router();

// GET /api/enquiries
router.get('/', getEnquiries);

// GET /api/enquiries/:id
router.get('/:id', getEnquiryById);

// POST /api/enquiries
router.post('/', createEnquiry);

// PATCH /api/enquiries/:id/status
router.patch('/:id/status', updateEnquiryStatus);

export default router;

