import { createClient } from '@supabase/supabase-js';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

class DatabaseService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
  }

  async createMedicine(data: any) {
    try {
      const { data: medicine, error } = await this.supabase
        .from('medicines')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return medicine;
    } catch (error: any) {
      logger.error('Database insert failed', error);
      throw new AppError(error.message, 500);
    }
  }

  async getMedicineByProductId(productId: string) {
    try {
      const { data, error } = await this.supabase
        .from('medicines')
        .select('*')
        .eq('product_id', productId)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      logger.error('Database query failed', error);
      return null;
    }
  }

  async getAllMedicines(filters?: any) {
    try {
      let query = this.supabase.from('medicines').select('*');

      if (filters?.manufacturer) {
        query = query.eq('manufacturer', filters.manufacturer);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error: any) {
      logger.error('Database query failed', error);
      throw new AppError(error.message, 500);
    }
  }

  async logVerification(data: any) {
    try {
      const { error } = await this.supabase
        .from('verification_logs')
        .insert(data);

      if (error) throw error;
    } catch (error: any) {
      logger.error('Failed to log verification', error);
    }
  }

  async getVerificationStats() {
    try {
      const { data, error } = await this.supabase
        .from('verification_logs')
        .select('*');

      if (error) throw error;

      const total = data.length;
      const successful = data.filter(log => log.is_valid).length;
      const failed = total - successful;

      return { total, successful, failed };
    } catch (error: any) {
      logger.error('Failed to get stats', error);
      throw new AppError(error.message, 500);
    }
  }

  async createUser(userData: any) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .insert(userData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      logger.error('User creation failed', error);
      throw new AppError(error.message, 500);
    }
  }

  async getUserByEmail(email: string) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      return null;
    }
  }
}

export default new DatabaseService();
