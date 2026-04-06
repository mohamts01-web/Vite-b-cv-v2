/*
  # Credit Management System Schema

  1. Tables Modified
    - `profiles` - Extended with phone, is_active, and role fields
    - `credits_transactions` - Extended with payment tracking fields
    
  2. New Tables
    - `credit_packages` - Predefined credit packages with pricing
      - id (uuid, primary key)
      - credits (integer) - number of credits in package
      - price_sar (numeric) - price in Saudi Riyal
      - price_usd (numeric) - price in US Dollar
      - is_featured (boolean) - highlight as "Best Value"
      - discount_percentage (numeric) - discount vs base rate
      - display_order (integer) - for sorting packages
      - is_active (boolean) - enable/disable package
      - created_at (timestamptz)

  3. Security
    - Enable RLS on all tables
    - Users can view own data and transactions
    - Users can create purchase transactions
    - Admins can manage all data
    - Public can view active credit packages

  4. Data Seeding
    - Insert 6 predefined credit packages with pricing
    - Set admin role for mohamts01@gmail.com

  5. Important Notes
    - Payment amounts stored in both SAR and USD for tracking
    - Transaction status workflow: pending → success/rejected
    - Receipt URLs stored for bank transfer verification
    - Audit trail maintained for all credit changes
*/

-- Extend profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_active boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role text DEFAULT 'user';
  END IF;
END $$;

-- Extend credits_transactions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'credits_transactions' AND column_name = 'amount_sar'
  ) THEN
    ALTER TABLE credits_transactions ADD COLUMN amount_sar numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'credits_transactions' AND column_name = 'amount_usd'
  ) THEN
    ALTER TABLE credits_transactions ADD COLUMN amount_usd numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'credits_transactions' AND column_name = 'credits_purchased'
  ) THEN
    ALTER TABLE credits_transactions ADD COLUMN credits_purchased integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'credits_transactions' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE credits_transactions ADD COLUMN payment_method text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'credits_transactions' AND column_name = 'status'
  ) THEN
    ALTER TABLE credits_transactions ADD COLUMN status text DEFAULT 'pending';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'credits_transactions' AND column_name = 'paypal_order_id'
  ) THEN
    ALTER TABLE credits_transactions ADD COLUMN paypal_order_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'credits_transactions' AND column_name = 'receipt_url'
  ) THEN
    ALTER TABLE credits_transactions ADD COLUMN receipt_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'credits_transactions' AND column_name = 'rejection_reason'
  ) THEN
    ALTER TABLE credits_transactions ADD COLUMN rejection_reason text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'credits_transactions' AND column_name = 'admin_user_id'
  ) THEN
    ALTER TABLE credits_transactions ADD COLUMN admin_user_id uuid;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'credits_transactions' AND column_name = 'processed_at'
  ) THEN
    ALTER TABLE credits_transactions ADD COLUMN processed_at timestamptz;
  END IF;
END $$;

-- Update type constraint to include new transaction types
ALTER TABLE credits_transactions DROP CONSTRAINT IF EXISTS credits_transactions_type_check;
ALTER TABLE credits_transactions ADD CONSTRAINT credits_transactions_type_check 
  CHECK (type IN ('purchase', 'bonus', 'usage', 'refund', 'manual_adjustment'));

-- Create credit_packages table
CREATE TABLE IF NOT EXISTS credit_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  credits integer NOT NULL,
  price_sar numeric NOT NULL,
  price_usd numeric NOT NULL,
  is_featured boolean DEFAULT false,
  discount_percentage numeric DEFAULT 0,
  display_order integer NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE credit_packages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for credit_packages
CREATE POLICY "Anyone can view active packages"
  ON credit_packages FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage packages"
  ON credit_packages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Update RLS policies for profiles (admin access)
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
    )
  );

-- Update RLS policies for credits_transactions (admin access)
DROP POLICY IF EXISTS "Users can view own transactions" ON credits_transactions;
CREATE POLICY "Users can view own transactions"
  ON credits_transactions FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can create transactions" ON credits_transactions;
CREATE POLICY "Users can create transactions"
  ON credits_transactions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can update transactions" ON credits_transactions;
CREATE POLICY "Admins can update transactions"
  ON credits_transactions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insert predefined credit packages
INSERT INTO credit_packages (credits, price_sar, price_usd, is_featured, discount_percentage, display_order, is_active)
VALUES
  (15, 10, 2.67, false, 33.33, 1, true),
  (80, 50, 13.33, false, 37.5, 2, true),
  (175, 100, 26.67, false, 42.86, 3, true),
  (450, 250, 66.67, false, 44.44, 4, true),
  (1000, 500, 133.33, true, 50, 5, true),
  (2450, 1000, 266.67, false, 59.18, 6, true)
ON CONFLICT DO NOTHING;

-- Set admin role for the specified email
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'mohamts01@gmail.com';

-- Create function to automatically set admin role on user creation
CREATE OR REPLACE FUNCTION set_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email = 'mohamts01@gmail.com' THEN
    NEW.role = 'admin';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for auto admin role assignment
DROP TRIGGER IF EXISTS auto_set_admin_role ON profiles;
CREATE TRIGGER auto_set_admin_role
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_admin_role();