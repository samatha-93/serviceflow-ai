import { Router } from 'express';
import healthRoutes from './health.routes';
import enquiryRoutes from './enquiry.routes';
import authRoutes from './auth.routes';
import bookingRoutes from './booking.routes';
import businessProfileRoutes from './businessProfile.routes';

const router = Router();

// Mount sub-routers
router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/bookings', bookingRoutes);
router.use('/business-profile', businessProfileRoutes);

export default router;
