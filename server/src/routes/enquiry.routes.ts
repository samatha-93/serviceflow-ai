import { Router } from 'express';
import {
  getEnquiries,
  getEnquiryById,
  createEnquiry,
  updateEnquiryStatus,
} from '../controllers/enquiry.controller';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

// GET /api/enquiries (optionalAuth: scoped to businessId if authenticated, demo if guest)
router.get('/', optionalAuth, getEnquiries);

// GET /api/enquiries/:id (optionalAuth: verifies ownership if authenticated, demo if guest)
router.get('/:id', optionalAuth, getEnquiryById);

// POST /api/enquiries (requireAuth: creates enquiry stamped with caller's businessId)
router.post('/', requireAuth, createEnquiry);

// PATCH /api/enquiries/:id/status (requireAuth: ensures only owning business can mutate status)
router.patch('/:id/status', requireAuth, updateEnquiryStatus);

export default router;

