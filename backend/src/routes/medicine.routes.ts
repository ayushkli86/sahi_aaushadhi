import { Router } from 'express';
import medicineController from '../controllers/medicine.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { registerMedicineSchema } from '../validators/medicine.validator';

const router = Router();

router.post(
  '/register',
  authenticate,
  authorize('manufacturer', 'admin'),
  validate(registerMedicineSchema),
  medicineController.registerMedicine
);

router.get('/', authenticate, medicineController.getAllMedicines);
router.get('/:productId', medicineController.getMedicineById);
router.get('/:productId/qr', medicineController.generateQRCode);

export default router;
