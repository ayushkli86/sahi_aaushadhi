// Wallet Service - Interacts with Supabase for wallet operations
import { supabase } from '@/integrations/supabase/client';

export interface WalletData {
  balance: number;
  totalSpent: number;
  totalRecharged: number;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  paymentMethod?: string;
  createdAt: string;
}

// Demo mode storage (for testing without Supabase)
const DEMO_MODE = true; // Set to false when Supabase is fully configured
const demoWallets = new Map<string, WalletData>();
const demoTransactions = new Map<string, Transaction[]>();

class WalletService {
  // Initialize demo wallet for user
  private initDemoWallet(userId: string): WalletData {
    if (!demoWallets.has(userId)) {
      demoWallets.set(userId, {
        balance: 0,
        totalSpent: 0,
        totalRecharged: 0
      });
    }
    return demoWallets.get(userId)!;
  }

  // Get user wallet balance
  async getWallet(userId: string): Promise<WalletData | null> {
    try {
      // Demo mode - use local storage
      if (DEMO_MODE) {
        return this.initDemoWallet(userId);
      }

      // Production mode - use Supabase
      const { data, error } = await supabase
        .from('user_wallets')
        .select('balance, total_spent, total_recharged')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching wallet:', error);
        // Fallback to demo mode
        return this.initDemoWallet(userId);
      }

      return {
        balance: data.balance,
        totalSpent: data.total_spent,
        totalRecharged: data.total_recharged
      };
    } catch (error) {
      console.error('Wallet fetch error:', error);
      return this.initDemoWallet(userId);
    }
  }

  // Add funds to wallet
  async addFunds(userId: string, amount: number, transactionId: string, paymentMethod: string): Promise<boolean> {
    try {
      // Demo mode - update local storage
      if (DEMO_MODE) {
        const wallet = this.initDemoWallet(userId);
        wallet.balance += amount;
        wallet.totalRecharged += amount;
        demoWallets.set(userId, wallet);

        // Record transaction
        const transactions = demoTransactions.get(userId) || [];
        transactions.unshift({
          id: transactionId,
          type: 'recharge',
          amount: amount,
          description: `Wallet recharge via ${paymentMethod}`,
          status: 'completed',
          paymentMethod: paymentMethod,
          createdAt: new Date().toISOString()
        });
        demoTransactions.set(userId, transactions);

        console.log('✅ Demo: Added NPR', amount, 'to wallet. New balance:', wallet.balance);
        return true;
      }

      // Production mode - use Supabase
      const { error: walletError } = await supabase
        .from('user_wallets')
        .update({
          balance: supabase.raw(`balance + ${amount}`),
          total_recharged: supabase.raw(`total_recharged + ${amount}`)
        })
        .eq('user_id', userId);

      if (walletError) {
        console.error('Error updating wallet:', walletError);
        return false;
      }

      const { error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'recharge',
          amount: amount,
          description: `Wallet recharge via ${paymentMethod}`,
          status: 'completed',
          payment_method: paymentMethod,
          payment_id: transactionId
        });

      if (txError) {
        console.error('Error recording transaction:', txError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Add funds error:', error);
      return false;
    }
  }

  // Deduct scan cost (NPR 0.10)
  async deductScanCost(userId: string, medicineId?: string): Promise<boolean> {
    try {
      const scanCost = 0.10;

      // Demo mode
      if (DEMO_MODE) {
        const wallet = this.initDemoWallet(userId);
        
        if (wallet.balance < scanCost) {
          console.log('❌ Demo: Insufficient balance. Current:', wallet.balance);
          return false;
        }

        wallet.balance -= scanCost;
        wallet.totalSpent += scanCost;
        demoWallets.set(userId, wallet);

        // Record transaction
        const transactions = demoTransactions.get(userId) || [];
        transactions.unshift({
          id: `scan-${Date.now()}`,
          type: 'scan',
          amount: scanCost,
          description: 'Medicine verification scan',
          status: 'completed',
          createdAt: new Date().toISOString()
        });
        demoTransactions.set(userId, transactions);

        console.log('✅ Demo: Deducted NPR', scanCost, 'for scan. New balance:', wallet.balance);
        return true;
      }

      // Production mode
      const wallet = await this.getWallet(userId);
      if (!wallet || wallet.balance < scanCost) {
        return false;
      }

      const { error: walletError } = await supabase
        .from('user_wallets')
        .update({
          balance: supabase.raw(`balance - ${scanCost}`),
          total_spent: supabase.raw(`total_spent + ${scanCost}`)
        })
        .eq('user_id', userId);

      if (walletError) {
        console.error('Error deducting from wallet:', walletError);
        return false;
      }

      const { error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'scan',
          amount: scanCost,
          description: 'Medicine verification scan',
          status: 'completed'
        });

      if (txError) {
        console.error('Error recording scan transaction:', txError);
      }

      const { error: scanError } = await supabase
        .from('scan_usage')
        .insert({
          user_id: userId,
          medicine_id: medicineId,
          cost: scanCost,
          payment_source: 'wallet',
          scan_result: 'verified'
        });

      if (scanError) {
        console.error('Error recording scan usage:', scanError);
      }

      return true;
    } catch (error) {
      console.error('Deduct scan cost error:', error);
      return false;
    }
  }

  // Get transaction history
  async getTransactions(userId: string, limit: number = 10): Promise<Transaction[]> {
    try {
      // Demo mode
      if (DEMO_MODE) {
        const transactions = demoTransactions.get(userId) || [];
        return transactions.slice(0, limit);
      }

      // Production mode
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching transactions:', error);
        return [];
      }

      return data.map(tx => ({
        id: tx.id,
        type: tx.type,
        amount: tx.amount,
        description: tx.description,
        status: tx.status,
        paymentMethod: tx.payment_method,
        createdAt: tx.created_at
      }));
    } catch (error) {
      console.error('Transaction fetch error:', error);
      return [];
    }
  }

  // Check if user can scan
  async canUserScan(userId: string): Promise<boolean> {
    try {
      const wallet = await this.getWallet(userId);
      return wallet !== null && wallet.balance >= 0.10;
    } catch (error) {
      console.error('Can user scan check error:', error);
      return false;
    }
  }

  // Clear demo data (for testing)
  clearDemoData(userId: string) {
    if (DEMO_MODE) {
      demoWallets.delete(userId);
      demoTransactions.delete(userId);
      console.log('🗑️ Demo: Cleared wallet data for user');
    }
  }
}

export const walletService = new WalletService();
