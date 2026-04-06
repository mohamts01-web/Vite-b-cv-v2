import { supabase } from '../lib/supabase';
import { UserProfile } from '../types/credits';
import { AdminStats } from '../types/admin';
import { addCredits, deductCredits } from './creditService';

export async function getAllUsers(): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function searchUsers(query: string): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`email.ilike.%${query}%,full_name.ilike.%${query}%,phone.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function updateUserStatus(userId: string, isActive: boolean): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ is_active: isActive })
    .eq('id', userId);

  if (error) throw error;
}

export async function adjustUserCredits(
  userId: string,
  amount: number,
  reason: string,
  isAddition: boolean
): Promise<void> {
  if (isAddition) {
    await addCredits(userId, amount, 'manual_adjustment', reason);
  } else {
    await deductCredits(userId, amount, reason);
  }
}

export async function getAdminStats(): Promise<AdminStats> {
  const [usersResult, transactionsResult, pendingResult] = await Promise.all([
    supabase.from('profiles').select('credits_balance, is_active', { count: 'exact' }),
    supabase
      .from('credits_transactions')
      .select('amount_sar, amount_usd')
      .eq('status', 'success')
      .eq('type', 'purchase'),
    supabase
      .from('credits_transactions')
      .select('id', { count: 'exact' })
      .eq('status', 'pending')
      .eq('payment_method', 'bank_transfer'),
  ]);

  const totalUsers = usersResult.count ?? 0;
  const activeUsers = usersResult.data?.filter((u) => u.is_active).length ?? 0;
  const totalCreditsDistributed =
    usersResult.data?.reduce((sum, u) => sum + (u.credits_balance ?? 0), 0) ?? 0;

  const totalRevenueSar =
    transactionsResult.data?.reduce((sum, t) => sum + (t.amount_sar ?? 0), 0) ?? 0;
  const totalRevenueUsd =
    transactionsResult.data?.reduce((sum, t) => sum + (t.amount_usd ?? 0), 0) ?? 0;

  const pendingTransactions = pendingResult.count ?? 0;

  return {
    total_users: totalUsers,
    active_users: activeUsers,
    total_credits_distributed: totalCreditsDistributed,
    pending_transactions: pendingTransactions,
    total_revenue_sar: Math.round(totalRevenueSar * 100) / 100,
    total_revenue_usd: Math.round(totalRevenueUsd * 100) / 100,
  };
}

export async function getUserById(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}
