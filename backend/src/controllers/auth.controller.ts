import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import databaseService from '../services/database.service';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name, role = 'consumer' } = req.body;

      const existingUser = await databaseService.getUserByEmail(email);
      if (existingUser) {
        throw new AppError('User already exists', 400);
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await databaseService.createUser({
        id: uuidv4(),
        email,
        password: hashedPassword,
        name,
        role,
        created_at: new Date().toISOString()
      });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      logger.info(`User registered: ${email}`);

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await databaseService.getUserByEmail(email);
      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401);
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      logger.info(`User logged in: ${email}`);

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;

      if (!token) {
        throw new AppError('Token required', 400);
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      const newToken = jwt.sign(
        { id: decoded.id, email: decoded.email, role: decoded.role },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.json({ token: newToken });
    } catch (error) {
      next(new AppError('Invalid token', 401));
    }
  }
}

export default new AuthController();
