import { Router } from 'express';
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
} from '../controllers/booking.controller';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

// GET /api/bookings (optionalAuth: scoped to businessId if authenticated, demo if guest)
router.get('/', optionalAuth, getBookings);

// GET /api/bookings/:id (optionalAuth: verifies ownership if authenticated, demo if guest)
router.get('/:id', optionalAuth, getBookingById);

// POST /api/bookings (requireAuth: creates booking stamped with caller's businessId)
router.post('/', requireAuth, createBooking);

// PATCH /api/bookings/:id/status (requireAuth: ensures only owning business can mutate status)
router.patch('/:id/status', requireAuth, updateBookingStatus);

export default router;
