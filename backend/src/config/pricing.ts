// Pricing Configuration for Sahi Aaushadi
// All prices in NPR (Nepali Rupees)

export const PRICING = {
  // Pay-per-scan pricing
  PAY_PER_SCAN: {
    COST: 0.10, // NPR 0.10 per scan
    CURRENCY: 'NPR',
    DESCRIPTION: 'Pay only for what you use'
  },

  // Subscription plans
  PLANS: {
    FREE: {
      id: 'free',
      name: 'Free Tier',
      description: 'Perfect for trial and personal use',
      monthly: 0,
      yearly: 0,
      scanLimit: 10,
      features: [
        'Basic verification',
        'Scan history',
        '10 free scans per month'
      ]
    },
    BASIC: {
      id: 'basic',
      name: 'Basic Plan',
      description: 'For small pharmacies',
      monthly: 50,
      yearly: 500, // 2 months free
      scanLimit: 1000,
      costPerScan: 0.05, // 50% discount
      features: [
        'All Free features',
        '1,000 scans per month',
        'Priority support',
        'Analytics dashboard',
        'Batch verification',
        'NPR 0.05 per scan (50% off)'
      ]
    },
    PROFESSIONAL: {
      id: 'professional',
      name: 'Professional Plan',
      description: 'For large pharmacies and small hospitals',
      monthly: 200,
      yearly: 2000, // 2 months free
      scanLimit: 5000,
      costPerScan: 0.04, // 60% discount
      features: [
        'All Basic features',
        '5,000 scans per month',
        'API access',
        'Custom reports',
        'Multi-user accounts',
        'Advanced analytics',
        'NPR 0.04 per scan (60% off)'
      ]
    },
    ENTERPRISE: {
      id: 'enterprise',
      name: 'Enterprise Plan',
      description: 'For hospital networks and distributors',
      monthly: 500,
      yearly: 5000, // 2 months free
      scanLimit: null, // Unlimited
      costPerScan: 0.01, // 90% discount
      features: [
        'All Professional features',
        'Unlimited scans',
        'White-label options',
        'Dedicated support',
        'SLA guarantee',
        'Custom integrations',
        'Training & onboarding',
        '~NPR 0.01 per scan (90% off)'
      ]
    }
  },

  // Payment gateways
  PAYMENT_GATEWAYS: {
    ESEWA: {
      name: 'eSewa',
      fee: 0.02, // 2% transaction fee
      minAmount: 10,
      maxAmount: 100000,
      enabled: true
    },
    KHALTI: {
      name: 'Khalti',
      fee: 0.025, // 2.5% transaction fee
      minAmount: 10,
      maxAmount: 100000,
      enabled: true
    },
    IME_PAY: {
      name: 'IME Pay',
      fee: 0.02, // 2% transaction fee
      minAmount: 10,
      maxAmount: 100000,
      enabled: true
    },
    CONNECT_IPS: {
      name: 'Connect IPS',
      fee: 0.015, // 1.5% transaction fee
      minAmount: 100,
      maxAmount: 500000,
      enabled: true
    }
  },

  // Wallet recharge options
  RECHARGE_OPTIONS: [
    { amount: 10, bonus: 0, label: 'NPR 10' },
    { amount: 50, bonus: 5, label: 'NPR 50 + NPR 5 bonus' },
    { amount: 100, bonus: 15, label: 'NPR 100 + NPR 15 bonus' },
    { amount: 500, bonus: 100, label: 'NPR 500 + NPR 100 bonus' },
    { amount: 1000, bonus: 250, label: 'NPR 1,000 + NPR 250 bonus' }
  ]
};

// Helper functions
export const calculateYearlySavings = (monthlyPrice: number, yearlyPrice: number): number => {
  return (monthlyPrice * 12) - yearlyPrice;
};

export const getEffectiveCostPerScan = (planPrice: number, scanLimit: number | null): number => {
  if (scanLimit === null) return 0.01; // Enterprise estimate
  return planPrice / scanLimit;
};

export const formatCurrency = (amount: number): string => {
  return `NPR ${amount.toFixed(2)}`;
};
