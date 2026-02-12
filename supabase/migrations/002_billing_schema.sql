-- Billing and Subscription Schema for Sahi Aaushadi
-- Migration: 002_billing_schema
-- Created: 2026-02-13

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. SUBSCRIPTION PLANS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10, 2) NOT NULL DEFAULT 0,
  price_yearly DECIMAL(10, 2) NOT NULL DEFAULT 0,
  scan_limit INTEGER,
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default plans
INSERT INTO subscription_plans (name, display_name, description, price_monthly, price_yearly, scan_limit, features) VALUES
('free', 'Free Tier', 'Perfect for trial and personal use', 0, 0, 10, '["basic_verification", "scan_history"]'),
('basic', 'Basic Plan', 'For small pharmacies', 50, 500, 1000, '["basic_verification", "scan_history", "analytics", "priority_support"]'),
('professional', 'Professional Plan', 'For large pharmacies', 200, 2000, 5000, '["basic_verification", "scan_history", "analytics", "priority_support", "api_access", "multi_user", "custom_reports"]'),
('enterprise', 'Enterprise Plan', 'For hospital networks', 500, 5000, NULL, '["basic_verification", "scan_history", "analytics", "priority_support", "api_access", "multi_user", "custom_reports", "white_label", "dedicated_support", "sla"]')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 2. USER SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  billing_cycle VARCHAR(10) NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  scans_used INTEGER DEFAULT 0,
  scans_limit INTEGER,
  auto_renew BOOLEAN DEFAULT true,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);

-- ============================================
-- 3. WALLET/CREDITS TABLE
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

CREATE INDEX IF NOT EXISTS idx_user_wallets_user_id ON user_wallets(user_id);

-- ============================================
-- 4. TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'completed',
  payment_method VARCHAR(50),
  payment_id VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- ============================================
-- 5. SCAN USAGE TRACKING
-- ============================================
CREATE TABLE IF NOT EXISTS scan_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  medicine_id UUID,
  cost DECIMAL(10, 2) DEFAULT 0.10,
  payment_source VARCHAR(20),
  scan_result VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scan_usage_user_id ON scan_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_scan_usage_created_at ON scan_usage(created_at);

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
  status VARCHAR(20) DEFAULT 'pending',
  due_date TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  items JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- ============================================
-- 7. PAYMENT METHODS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  details JSONB DEFAULT '{}',
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);

-- ============================================
-- 8. FUNCTIONS
-- ============================================

-- Function to check if user can scan
CREATE OR REPLACE FUNCTION can_user_scan(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_subscription RECORD;
  v_wallet_balance DECIMAL;
BEGIN
  SELECT * INTO v_subscription
  FROM user_subscriptions
  WHERE user_id = p_user_id 
    AND status = 'active'
    AND current_period_end > NOW();
  
  IF FOUND THEN
    IF v_subscription.scans_limit IS NULL THEN
      RETURN true;
    ELSIF v_subscription.scans_used < v_subscription.scans_limit THEN
      RETURN true;
    END IF;
  END IF;
  
  SELECT balance INTO v_wallet_balance
  FROM user_wallets
  WHERE user_id = p_user_id;
  
  IF v_wallet_balance >= 0.10 THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
  SELECT * INTO v_subscription
  FROM user_subscriptions
  WHERE user_id = p_user_id 
    AND status = 'active'
    AND current_period_end > NOW();
  
  IF FOUND AND (v_subscription.scans_limit IS NULL OR v_subscription.scans_used < v_subscription.scans_limit) THEN
    UPDATE user_subscriptions
    SET scans_used = scans_used + 1
    WHERE id = v_subscription.id;
    
    v_payment_source := 'subscription';
  ELSE
    UPDATE user_wallets
    SET balance = balance - 0.10,
        total_spent = total_spent + 0.10
    WHERE user_id = p_user_id AND balance >= 0.10;
    
    IF NOT FOUND THEN
      RETURN false;
    END IF;
    
    v_payment_source := 'wallet';
    
    INSERT INTO transactions (user_id, type, amount, description, status)
    VALUES (p_user_id, 'scan', 0.10, 'Medicine verification scan', 'completed');
  END IF;
  
  INSERT INTO scan_usage (user_id, medicine_id, cost, payment_source, scan_result)
  VALUES (p_user_id, p_medicine_id, 0.10, v_payment_source, p_scan_result);
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 9. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Public can read subscription plans
CREATE POLICY IF NOT EXISTS "Subscription plans are viewable by everyone"
  ON subscription_plans FOR SELECT
  USING (true);

-- Users can only see their own data
CREATE POLICY IF NOT EXISTS "Users can view own subscriptions"
  ON user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can view own wallet"
  ON user_wallets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can view own scan usage"
  ON scan_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can view own invoices"
  ON invoices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can view own payment methods"
  ON payment_methods FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- 10. TRIGGER TO CREATE WALLET ON USER SIGNUP
-- ============================================

CREATE OR REPLACE FUNCTION create_user_wallet()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_wallets (user_id, balance)
  VALUES (NEW.id, 0)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_wallet();
