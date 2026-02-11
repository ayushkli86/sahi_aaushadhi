import { Request, Response, NextFunction } from 'express';
import databaseService from '../services/database.service';
import blockchainService from '../services/blockchain.service';
import qrService from '../services/qr.service';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

class VerificationController {
  async verifyMedicine(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.body;

      // Verify on blockchain
      const blockchainData = await blockchainService.verifyMedicine(productId);

      // Get from database
      const dbData = await databaseService.getMedicineByProductId(productId);

      const isValid = blockchainData.exists && dbData !== null;
      const isExpired = dbData && new Date(dbData.expiry_date) < new Date();

      // Log verification
      await databaseService.logVerification({
        product_id: productId,
        is_valid: isValid,
        verified_at: new Date().toISOString(),
        ip_address: req.ip
      });

      logger.info(`Verification attempt for ${productId}: ${isValid ? 'valid' : 'invalid'}`);

      res.json({
        isValid,
        isExpired,
        medicine: isValid ? {
          ...dbData,
          blockchain: blockchainData
        } : null,
        message: isValid 
          ? (isExpired ? 'Medicine is expired' : 'Medicine is authentic')
          : 'Medicine not found or counterfeit'
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyQRCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { qrData } = req.body;

      const parsed = qrService.parseQRCode(qrData);
      const { productId } = parsed;

      // Verify on blockchain
      const blockchainData = await blockchainService.verifyMedicine(productId);

      // Get from database
      const dbData = await databaseService.getMedicineByProductId(productId);

      const isValid = blockchainData.exists && dbData !== null;
      const isExpired = dbData && new Date(dbData.expiry_date) < new Date();

      // Log verification
      await databaseService.logVerification({
        product_id: productId,
        is_valid: isValid,
        verified_at: new Date().toISOString(),
        ip_address: req.ip,
        method: 'qr_scan'
      });

      res.json({
        isValid,
        isExpired,
        medicine: isValid ? {
          ...dbData,
          blockchain: blockchainData
        } : null,
        message: isValid 
          ? (isExpired ? 'Medicine is expired' : 'Medicine is authentic')
          : 'Invalid QR code or counterfeit medicine'
      });
    } catch (error) {
      next(error);
    }
  }

  async getVerificationLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await databaseService.getVerificationStats();

      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

export default new VerificationController();
