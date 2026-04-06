export interface CreditPackage {
  id: string;
  credits: number;
  price_sar: number;
  price_usd: number;
  is_featured: boolean;
  discount_percentage: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export type PaymentMethod = 'paypal' | 'bank_transfer';

export type TransactionStatus = 'pending' | 'success' | 'failed' | 'rejected';

export type TransactionType = 'purchase' | 'bonus' | 'usage' | 'refund' | 'manual_adjustment';

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  amount_sar?: number;
  amount_usd?: number;
  credits_purchased?: number;
  type: TransactionType;
  payment_method?: PaymentMethod;
  status: TransactionStatus;
  paypal_order_id?: string;
  receipt_url?: string;
  rejection_reason?: string;
  description?: string;
  admin_user_id?: string;
  processed_at?: string;
  related_resume_id?: string;
  created_at: string;
}

export interface PricingCalculation {
  credits: number;
  price_sar: number;
  price_usd: number;
  price_per_credit: number;
  savings: number;
  discount_percentage: number;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  credits_balance: number;
  is_active: boolean;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
  subscription_tier?: string;
  subscription_expires_at?: string;
}

export interface BankDetails {
  bank_name: string;
  account_holder: string;
  account_number: string;
  iban: string;
  swift_code?: string;
}

export interface CheckoutData {
  package_id?: string;
  credits: number;
  amount_sar: number;
  amount_usd: number;
  payment_method: PaymentMethod;
}
