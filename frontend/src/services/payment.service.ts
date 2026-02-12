// Payment Service for Khalti and eSewa Integration
// Demo Mode - For testing purposes

export interface PaymentGateway {
  id: string;
  name: string;
  logo: string;
  enabled: boolean;
  minAmount: number;
  maxAmount: number;
  fee: number;
}

export interface Bank {
  id: string;
  name: string;
  logo: string;
  type: 'mobile' | 'internet' | 'direct';
}

export interface PaymentRequest {
  amount: number;
  gateway: 'khalti' | 'esewa';
  bank?: string;
  returnUrl: string;
  userId: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  amount: number;
  gateway: string;
  status: 'pending' | 'completed' | 'failed';
  message?: string;
}

// Payment Gateways Configuration
export const PAYMENT_GATEWAYS: PaymentGateway[] = [
  {
    id: 'khalti',
    name: 'Khalti',
    logo: '🟣',
    enabled: true,
    minAmount: 10,
    maxAmount: 100000,
    fee: 0.025 // 2.5%
  },
  {
    id: 'esewa',
    name: 'eSewa',
    logo: '🟢',
    enabled: true,
    minAmount: 10,
    maxAmount: 100000,
    fee: 0.02 // 2%
  }
];

// Banks supported by Khalti
export const KHALTI_BANKS: Bank[] = [
  // Mobile Banking
  { id: 'khalti_wallet', name: 'Khalti Wallet', logo: '🟣', type: 'mobile' },
  { id: 'nabil_mobile', name: 'Nabil Bank Mobile', logo: '🏦', type: 'mobile' },
  { id: 'nic_asia_mobile', name: 'NIC Asia Mobile', logo: '🏦', type: 'mobile' },
  { id: 'global_ime_mobile', name: 'Global IME Mobile', logo: '🏦', type: 'mobile' },
  { id: 'ncc_mobile', name: 'NCC Bank Mobile', logo: '🏦', type: 'mobile' },
  
  // Internet Banking
  { id: 'nabil_internet', name: 'Nabil Bank Internet Banking', logo: '💻', type: 'internet' },
  { id: 'nic_asia_internet', name: 'NIC Asia Internet Banking', logo: '💻', type: 'internet' },
  { id: 'global_ime_internet', name: 'Global IME Internet Banking', logo: '💻', type: 'internet' },
  { id: 'himalayan_internet', name: 'Himalayan Bank Internet Banking', logo: '💻', type: 'internet' },
  { id: 'standard_chartered_internet', name: 'Standard Chartered Internet Banking', logo: '💻', type: 'internet' },
  
  // Direct Bank Payment
  { id: 'connect_ips', name: 'Connect IPS', logo: '🔗', type: 'direct' },
  { id: 'nabil_direct', name: 'Nabil Bank Direct', logo: '🏦', type: 'direct' },
  { id: 'nic_asia_direct', name: 'NIC Asia Direct', logo: '🏦', type: 'direct' }
];

// Banks supported by eSewa
export const ESEWA_BANKS: Bank[] = [
  // Mobile Banking
  { id: 'esewa_wallet', name: 'eSewa Wallet', logo: '🟢', type: 'mobile' },
  { id: 'ime_pay', name: 'IME Pay', logo: '📱', type: 'mobile' },
  { id: 'prabhu_pay', name: 'Prabhu Pay', logo: '📱', type: 'mobile' },
  
  // Internet Banking
  { id: 'nabil_esewa', name: 'Nabil Bank', logo: '💻', type: 'internet' },
  { id: 'nic_asia_esewa', name: 'NIC Asia Bank', logo: '💻', type: 'internet' },
  { id: 'global_ime_esewa', name: 'Global IME Bank', logo: '💻', type: 'internet' },
  { id: 'himalayan_esewa', name: 'Himalayan Bank', logo: '💻', type: 'internet' },
  { id: 'kumari_esewa', name: 'Kumari Bank', logo: '💻', type: 'internet' },
  { id: 'siddhartha_esewa', name: 'Siddhartha Bank', logo: '💻', type: 'internet' },
  { id: 'everest_esewa', name: 'Everest Bank', logo: '💻', type: 'internet' },
  
  // Direct Bank Payment
  { id: 'connect_ips_esewa', name: 'Connect IPS', logo: '🔗', type: 'direct' }
];

// Demo Payment Service Class
class PaymentService {
  private baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Initialize Khalti Payment (Demo Mode)
  async initiateKhaltiPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // In demo mode, simulate payment initiation
      console.log('Initiating Khalti payment:', request);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate demo transaction ID
      const transactionId = `KHL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // In production, this would call Khalti API
      // const response = await fetch(`${this.baseUrl}/api/payment/khalti/initiate`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(request)
      // });
      
      return {
        success: true,
        transactionId,
        amount: request.amount,
        gateway: 'khalti',
        status: 'pending',
        message: 'Payment initiated successfully'
      };
    } catch (error) {
      console.error('Khalti payment error:', error);
      throw new Error('Failed to initiate Khalti payment');
    }
  }

  // Initialize eSewa Payment (Demo Mode)
  async initiateEsewaPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      console.log('Initiating eSewa payment:', request);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const transactionId = `ESW-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        success: true,
        transactionId,
        amount: request.amount,
        gateway: 'esewa',
        status: 'pending',
        message: 'Payment initiated successfully'
      };
    } catch (error) {
      console.error('eSewa payment error:', error);
      throw new Error('Failed to initiate eSewa payment');
    }
  }

  // Verify Payment (Demo Mode)
  async verifyPayment(transactionId: string, gateway: string): Promise<PaymentResponse> {
    try {
      console.log('Verifying payment:', transactionId, gateway);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In demo mode, randomly succeed or fail (90% success rate)
      const success = Math.random() > 0.1;
      
      return {
        success,
        transactionId,
        amount: 0, // Would be fetched from backend
        gateway,
        status: success ? 'completed' : 'failed',
        message: success ? 'Payment verified successfully' : 'Payment verification failed'
      };
    } catch (error) {
      console.error('Payment verification error:', error);
      throw new Error('Failed to verify payment');
    }
  }

  // Get User Wallet Balance
  async getWalletBalance(userId: string): Promise<number> {
    try {
      // In production, fetch from Supabase
      const response = await fetch(`${this.baseUrl}/api/wallet/${userId}`);
      const data = await response.json();
      return data.balance || 0;
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      return 0;
    }
  }

  // Add Funds to Wallet
  async addFunds(userId: string, amount: number, transactionId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/wallet/add-funds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount, transactionId })
      });
      
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error adding funds:', error);
      return false;
    }
  }

  // Deduct Scan Cost (NPR 0.10)
  async deductScanCost(userId: string, medicineId?: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/wallet/deduct-scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, medicineId, cost: 0.10 })
      });
      
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error deducting scan cost:', error);
      return false;
    }
  }

  // Calculate Fee
  calculateFee(amount: number, gateway: 'khalti' | 'esewa'): number {
    const feeRate = gateway === 'khalti' ? 0.025 : 0.02;
    return amount * feeRate;
  }

  // Get Total Amount (including fee)
  getTotalAmount(amount: number, gateway: 'khalti' | 'esewa'): number {
    return amount + this.calculateFee(amount, gateway);
  }
}

export const paymentService = new PaymentService();
