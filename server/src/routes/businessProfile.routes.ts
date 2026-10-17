import { Router } from 'express';
import {
  getBusinessProfile,
  getPublicBusinessProfile,
  updateBusinessProfile,
} from '../controllers/businessProfile.controller';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

// GET /api/business-profile (optionalAuth: scoped to authenticated businessId, or demo if guest)
router.get('/', optionalAuth, getBusinessProfile);

// GET /api/business-profile/public/:businessId (public showcase for any service business)
router.get('/public/:businessId', optionalAuth, getPublicBusinessProfile);

// PUT /api/business-profile (requireAuth: full or partial update strictly for authenticated tenant)
router.put('/', requireAuth, updateBusinessProfile);

// PATCH /api/business-profile (requireAuth: partial update strictly for authenticated tenant)
router.patch('/', requireAuth, updateBusinessProfile);

export default router;
