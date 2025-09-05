import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth } from '../middleware/auth.js';
import { createUrl, listMyUrls, getUrlAnalytics, getUrlInfo } from '../controllers/url.controller.js';

const router = Router();
const createLimiter = rateLimit({ windowMs: 60 * 1000, max: 20 });

// Public route for getting URL info without tracking
router.get('/info/:code', getUrlInfo);

// Protected routes (auth required)
router.use(requireAuth);
router.get('/', listMyUrls);
router.post('/', createLimiter, createUrl);
router.get('/:id/analytics', getUrlAnalytics);

export default router;
