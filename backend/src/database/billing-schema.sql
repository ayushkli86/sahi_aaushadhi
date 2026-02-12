-- Billing and Subscription Schema for Sahi Aaushadi
-- Revenue Model: Pay-per-scan (NPR 0.10) + Subscription Plans

-- ============================================
-- 1. SUBSCRIPTION PLANS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL UNIQUE, -- 'free', 'basic', 'professional', 'enterprise'
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10, 2) NOT NULL DEFAULT 0,
  price_yearly DECIMAL(10, 2) NOT NULL DEFAULT 0,
  scan_limit INTEGER, -- NULL means unlimited
  features JSONB DEFAULT '[]', -- Array of feature flags
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default plans
INSERT INTO subscription_plans (name, display_name, description, price_monthly, price_yearly, scan_limit, features) VALUES
('free', 'Free Tier', 'Perfect for trial and personal use', 0, 0, 10, '["basic_verification", "scan_history"]'),
('basic', 'Basic Plan', 'For small pharmacies', 50, 500, 1000, '["basic_verification", "scan_history", "analytics", "priority_support"]'),
('professional', 'Professional Plan', 'For large pharmacies', 200, 2000, 5000, '["basic_verification", "scan_history", "analytics", "priority_support", "api_access", "multi_user", "custom_reports"]'),
('enterprise', 'Enterprise Plan', 'For hospital networks', 500, 5000, NULL, '["basic_verification", "scan_history", "analytics", "priority_support", "api_access", "multi_user", "custom_reports", "white_label", "dedicated_support", "sla"]');

-- ============================================
-- 2. USER SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'expired', 'suspended'
  billing_cycle VARCHAR(10) NOT NULL, -- 'monthly', 'yearly'
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  scans_used INTEGER DEFAULT 0,
  scans_limit INTEGER, -- Copied from plan for historical tracking
  auto_renew BOOLEAN DEFAULT true,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id) -- One active subscription per user
);

-- Index for faster lookups
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);

-- ============================================
-- 3. WALLET/CREDITS TABLE (Pay-per-scan)
-- ============================================
CREATE TABLE IF NOT EXISTS user_wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(10, 2) DEFAULT 0 CHECK (balance >= 0),
  total_spent DECIMAL(10, 2) DEFAULT 0,
  total_recharged DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_wallets_user_id ON user_wallets(user_id);

-- ============================================
-- 4. TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL, -- 'scan', 'recharge', 'subscription', 'refund'
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'completed', -- 'pending', 'completed', 'failed', 'refunded'
  payment_method VARCHAR(50), -- 'esewa', 'khalti', 'ime_pay', 'bank_transfer'
  payment_id VARCHAR(255), -- External payment gateway transaction ID
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- ============================================
-- 5. SCAN USAGE TRACKING
-- ============================================
CREATE TABLE IF NOT EXISTS scan_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  medicine_id UUID REFERENCES medicines(id),
  cost DECIMAL(10, 2) DEFAULT 0.10, -- NPR 0.10 per scan
  payment_source VARCHAR(20), -- 'subscription', 'wallet', 'free'
  scan_result VARCHAR(20), -- 'verified', 'counterfeit', 'not_found'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_scan_usage_user_id ON scan_usage(user_id);
CREATE INDEX idx_scan_usage_created_at ON scan_usage(created_at);

-- ============================================
-- 6. INVOICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'overdue', 'cancelled'
  due_date TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  items JSONB DEFAULT '[]', -- Line items
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_status ON invoices(status);

-- ============================================
-- 7. PAYMENT METHODS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'esewa', 'khalti', 'ime_pay', 'bank'
  details JSONB DEFAULT '{}', -- Encrypted payment details
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);

-- ============================================
-- 8. FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to reset monthly scan usage
CREATE OR REPLACE FUNCTION reset_monthly_scans()
RETURNS void AS $$
BEGIN
  UPDATE user_subscriptions
  SET scans_used = 0,
      current_period_start = current_period_end,
      current_period_end = CASE 
        WHEN billing_cycle = 'monthly' THEN current_period_end + INTERVAL '1 month'
        WHEN billing_cycle = 'yearly' THEN current_period_end + INTERVAL '1 year'
      END
  WHERE status = 'active' 
    AND current_period_end <= NOW()
    AND auto_renew = true;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user can scan
CREATE OR REPLACE FUNCTION can_user_scan(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_subscription RECORD;
  v_wallet_balance DECIMAL;
BEGIN
  -- Check active subscription
  SELECT * INTO v_subscription
  FROM user_subscriptions
  WHERE user_id = p_user_id 
    AND status = 'active'
    AND current_period_end > NOW();
  
  IF FOUND THEN
    -- Check if within scan limit
    IF v_subscription.scans_limit IS NULL THEN
      RETURN true; -- Unlimited
    ELSIF v_subscription.scans_used < v_subscription.scans_limit THEN
      RETURN true;
    END IF;
  END IF;
  
  -- Check wallet balance
  SELECT balance INTO v_wallet_balance
  FROM user_wallets
  WHERE user_id = p_user_id;
  
  IF v_wallet_balance >= 0.10 THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql;

-- Function to record scan and deduct payment
CREATE OR REPLACE FUNCTION record_scan_payment(
  p_user_id UUID,
  p_medicine_id UUID,
  p_scan_result VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
  v_subscription RECORD;
  v_payment_source VARCHAR;
BEGIN
  -- Try subscription first
  SELECT * INTO v_subscription
  FROM user_subscriptions
  WHERE user_id = p_user_id 
    AND status = 'active'
    AND current_period_end > NOW();
  
  IF FOUND AND (v_subscription.scans_limit IS NULL OR v_subscription.scans_used < v_subscription.scans_limit) THEN
    -- Use subscription
    UPDATE user_subscriptions
    SET scans_used = scans_used + 1
    WHERE id = v_subscription.id;
    
    v_payment_source := 'subscription';
  ELSE
    -- Use wallet
    UPDATE user_wallets
    SET balance = balance - 0.10,
        total_spent = total_spent + 0.10
    WHERE user_id = p_user_id AND balance >= 0.10;
    
    IF NOT FOUND THEN
      RETURN false; -- Insufficient balance
    END IF;
    
    v_payment_source := 'wallet';
    
    -- Record transaction
    INSERT INTO transactions (user_id, type, amount, description, status)
    VALUES (p_user_id, 'scan', 0.10, 'Medicine verification scan', 'completed');
  END IF;
  
  -- Record scan usage
  INSERT INTO scan_usage (user_id, medicine_id, cost, payment_source, scan_result)
  VALUES (p_user_id, p_medicine_id, 0.10, v_payment_source, p_scan_result);
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 9. ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY user_subscriptions_policy ON user_subscriptions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY user_wallets_policy ON user_wallets
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY transactions_policy ON transactions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY scan_usage_policy ON scan_usage
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY invoices_policy ON invoices
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY payment_methods_policy ON payment_methods
  FOR ALL USING (auth.uid() = user_id);
