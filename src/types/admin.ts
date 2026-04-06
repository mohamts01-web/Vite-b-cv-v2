import { CreditTransaction, UserProfile } from './credits';

export interface AdminStats {
  total_users: number;
  active_users: number;
  total_credits_distributed: number;
  pending_transactions: number;
  total_revenue_sar: number;
  total_revenue_usd: number;
}

export interface AdminAction {
  id: string;
  admin_id: string;
  action_type: 'approve_transaction' | 'reject_transaction' | 'adjust_credits' | 'activate_user' | 'deactivate_user';
  target_user_id: string;
  target_transaction_id?: string;
  details: string;
  created_at: string;
}

export interface TransactionWithUser extends CreditTransaction {
  user_email?: string;
  user_name?: string;
}

export interface CreditAdjustment {
  user_id: string;
  amount: number;
  type: 'add' | 'subtract';
  reason: string;
  transaction_type: 'bonus' | 'refund' | 'manual_adjustment';
}
