import { Router } from 'express';
import healthRoutes from './health.routes';
import enquiryRoutes from './enquiry.routes';

const router = Router();

// Mount sub-routers
router.use('/', healthRoutes);
router.use('/enquiries', enquiryRoutes);

export default router;
