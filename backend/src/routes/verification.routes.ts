import { Router } from 'express';
import verificationController from '../controllers/verification.controller';
import { validate } from '../middleware/validation';
import { verifySchema } from '../validators/verification.validator';

const router = Router();

router.post('/', validate(verifySchema), verificationController.verifyMedicine);
router.post('/qr', verificationController.verifyQRCode);
router.get('/logs', verificationController.getVerificationLogs);

export default router;
