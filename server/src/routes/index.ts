import { Router } from 'express';
import healthRoutes from './health.routes';
import enquiryRoutes from './enquiry.routes';
import authRoutes from './auth.routes';

const router = Router();

// Mount sub-routers
router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/enquiries', enquiryRoutes);

export default router;
