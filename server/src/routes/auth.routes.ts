import { Router } from 'express';
import { register, login, getMe, logout } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { authRateLimiter } from '../middleware/security.middleware';

const router = Router();

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.get('/me', requireAuth, getMe);
router.post('/logout', logout);

export default router;
