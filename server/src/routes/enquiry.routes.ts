import { Router } from 'express';
import { getEnquiries, getEnquiryById } from '../controllers/enquiry.controller';

const router = Router();

// GET /api/enquiries
router.get('/', getEnquiries);

// GET /api/enquiries/:id
router.get('/:id', getEnquiryById);

export default router;
