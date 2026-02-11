import { Request, Response, NextFunction } from 'express';
import verificationService from '../services/verification.service';
import databaseService from '../services/database.service';
import logger from '../utils/logger';

/**
 * VERIFICATION CONTROLLER
 * Responsibility: HTTP layer only
 * - Receive request
 * - Extract data
 * - Call service
 * - Return response
 * NO business logic here!
 */
class VerificationController {
  /**
   * Verify medicine by product ID
   * POST /api/verify
   */
  async verifyMedicine(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.body;
      const ipAddress = req.ip;

      const result = await verificationService.verifyMedicine(productId, ipAddress);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify medicine by scanning QR code
   * POST /api/verify/qr
   */
  async verifyQRCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { qrData } = req.body;
      const ipAddress = req.ip;

      const result = await verificationService.verifyByQR(qrData, ipAddress);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get verification statistics
   * GET /api/verify/logs
   */
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
