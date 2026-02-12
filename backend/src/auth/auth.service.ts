import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import supabaseClient from './supabase.client';
import { User, LoginCredentials, RegisterData, AuthResponse, AuthTokenPayload } from './auth.types';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

class AuthService {
  private supabase = supabaseClient.getClient();

  /**
   * Generate JWT token
   */
  private generateToken(payload: AuthTokenPayload): string {
    return (jwt.sign as any)(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
  }

  /**
   * Hash password
   */
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  /**
   * Compare password
   */
  private async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const { email, password, name, role = 'consumer' } = data;

      // Check if user exists
      const { data: existingUser } = await this.supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        throw new AppError('User already exists', 400);
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password);

      // Create user
      const { data: user, error } = await this.supabase
        .from('users')
        .insert({
          id: uuidv4(),
          email,
          password: hashedPassword,
          name,
          role,
          created_at: new Date().toISOString()
        })
        .select('id, email, name, role, created_at')
        .single();

      if (error) throw error;

      // Generate token
      const token = this.generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      logger.info(`User registered: ${email}`);

      return {
        user: user as User,
        token
      };
    } catch (error: any) {
      logger.error('Registration failed', error);
      throw new AppError(error.message || 'Registration failed', 500);
    }
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { email, password } = credentials;

      // Get user
      const { data: user, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) {
        throw new AppError('Invalid credentials', 401);
      }

      // Verify password
      const isValid = await this.comparePassword(password, user.password);
      if (!isValid) {
        throw new AppError('Invalid credentials', 401);
      }

      // Generate token
      const token = this.generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      logger.info(`User logged in: ${email}`);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword as User,
        token
      };
    } catch (error: any) {
      logger.error('Login failed', error);
      throw new AppError(error.message || 'Login failed', 401);
    }
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): AuthTokenPayload {
    try {
      return (jwt.verify as any)(token, process.env.JWT_SECRET!) as AuthTokenPayload;
    } catch (error) {
      throw new AppError('Invalid token', 401);
    }
  }

  /**
   * Refresh token
   */
  async refreshToken(oldToken: string): Promise<string> {
    try {
      const decoded = this.verifyToken(oldToken);
      
      // Generate new token
      return this.generateToken({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      });
    } catch (error) {
      throw new AppError('Token refresh failed', 401);
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('id, email, name, role, created_at')
        .eq('id', userId)
        .single();

      if (error) return null;
      return data as User;
    } catch (error) {
      return null;
    }
  }
}

export default new AuthService();
