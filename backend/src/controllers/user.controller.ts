import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import databaseService from '../services/database.service';
import { AppError } from '../utils/AppError';

class UserController {
  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await databaseService.getUserByEmail(req.user!.email);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const { password, ...userWithoutPassword } = user;

      res.json({ user: userWithoutPassword });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;

      // Implementation for updating user profile
      res.json({
        message: 'Profile updated successfully',
        user: { name }
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Implementation for getting all users (admin only)
      res.json({
        message: 'All users endpoint',
        users: []
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
