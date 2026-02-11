import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import databaseService from '../services/database.service';

class AnalyticsController {
  async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const verificationStats = await databaseService.getVerificationStats();
      const medicines = await databaseService.getAllMedicines();

      res.json({
        totalMedicines: medicines.length,
        verifications: verificationStats,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  async getVerificationTrends(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Implementation for verification trends over time
      res.json({
        message: 'Verification trends endpoint',
        data: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getManufacturerStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const medicines = await databaseService.getAllMedicines();

      const manufacturerStats = medicines.reduce((acc: any, med: any) => {
        acc[med.manufacturer] = (acc[med.manufacturer] || 0) + 1;
        return acc;
      }, {});

      res.json({ manufacturerStats });
    } catch (error) {
      next(error);
    }
  }
}

export default new AnalyticsController();
