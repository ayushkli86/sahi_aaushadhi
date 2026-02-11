import { Router } from 'express';
import analyticsController from '../controllers/analytics.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/stats', authenticate, authorize('admin', 'dda'), analyticsController.getStats);
router.get('/verifications', authenticate, authorize('admin', 'dda'), analyticsController.getVerificationTrends);
router.get('/manufacturers', authenticate, authorize('admin', 'dda'), analyticsController.getManufacturerStats);

export default router;
