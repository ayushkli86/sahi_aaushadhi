import { Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/auth';
import databaseService from '../services/database.service';
import blockchainService from '../services/blockchain.service';
import qrService from '../services/qr.service';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

class MedicineController {
  async registerMedicine(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, manufacturer, batchNumber, manufactureDate, expiryDate, description } = req.body;

      const productId = `MED-${uuidv4().substring(0, 8).toUpperCase()}`;

      // Register on blockchain
      const blockchainResult = await blockchainService.registerMedicine(
        productId,
        name,
        manufacturer,
        new Date(manufactureDate).getTime(),
        new Date(expiryDate).getTime()
      );

      // Save to database
      const medicine = await databaseService.createMedicine({
        product_id: productId,
        name,
        manufacturer,
        batch_number: batchNumber,
        manufacture_date: manufactureDate,
        expiry_date: expiryDate,
        description,
        blockchain_tx: blockchainResult.transactionHash,
        registered_by: req.user!.id,
        created_at: new Date().toISOString()
      });

      // Generate QR code
      const qrCode = await qrService.generateQRCode(productId, medicine);

      logger.info(`Medicine registered: ${productId}`);

      res.status(201).json({
        message: 'Medicine registered successfully',
        medicine: {
          ...medicine,
          qrCode
        },
        blockchain: blockchainResult
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllMedicines(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { manufacturer } = req.query;

      const medicines = await databaseService.getAllMedicines({
        manufacturer: manufacturer as string
      });

      res.json({
        count: medicines.length,
        medicines
      });
    } catch (error) {
      next(error);
    }
  }

  async getMedicineById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;

      const medicine = await databaseService.getMedicineByProductId(productId);

      if (!medicine) {
        throw new AppError('Medicine not found', 404);
      }

      res.json({ medicine });
    } catch (error) {
      next(error);
    }
  }

  async generateQRCode(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;

      const medicine = await databaseService.getMedicineByProductId(productId);

      if (!medicine) {
        throw new AppError('Medicine not found', 404);
      }

      // STEP 1: Create QR payload with nonce
      const payload = await qrService.createQRPayload(productId);

      // STEP 2: Store QR hash in database (for one-time use verification)
      await databaseService.storeQRRecord(
        payload.qrHash,
        productId,
        payload.expiresAt
      );

      // STEP 3: Register QR hash on blockchain
      try {
        await blockchainService.registerQRHash(payload.qrHash, productId);
      } catch (error) {
        logger.warn('Blockchain QR registration failed', error);
        // Continue even if blockchain fails
      }

      // STEP 4: Generate QR image
      const qrImage = await qrService.generateQRImage(payload);

      logger.info(`QR generated for ${productId}, hash: ${payload.qrHash}`);

      res.json({
        qrCode: qrImage,
        qrHash: payload.qrHash,
        expiresAt: payload.expiresAt,
        productId: payload.productId
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new MedicineController();
