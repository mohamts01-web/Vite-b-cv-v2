import { supabase } from '../lib/supabase';
import { CreditTransaction, TransactionType } from '../types/credits';

export async function getUserBalance(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('profiles')
    .select('credits_balance')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data?.credits_balance ?? 0;
}

export async function canAfford(userId: string, cost: number): Promise<boolean> {
  const balance = await getUserBalance(userId);
  return balance >= cost;
}

export async function addCredits(
  userId: string,
  amount: number,
  type: TransactionType,
  description?: string,
  relatedData?: {
    amount_sar?: number;
    amount_usd?: number;
    payment_method?: string;
    paypal_order_id?: string;
  }
): Promise<void> {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('credits_balance')
    .eq('id', userId)
    .maybeSingle();

  if (profileError) throw profileError;

  const newBalance = (profile?.credits_balance ?? 0) + amount;

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ credits_balance: newBalance })
    .eq('id', userId);

  if (updateError) throw updateError;

  const transactionData: any = {
    user_id: userId,
    amount,
    type,
    description,
    status: 'success',
    ...relatedData,
  };

  if (type === 'purchase') {
    transactionData.credits_purchased = amount;
  }

  const { error: transactionError } = await supabase
    .from('credits_transactions')
    .insert(transactionData);

  if (transactionError) throw transactionError;
}

export async function deductCredits(
  userId: string,
  amount: number,
  description?: string,
  relatedResumeId?: string
): Promise<void> {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('credits_balance')
    .eq('id', userId)
    .maybeSingle();

  if (profileError) throw profileError;

  const currentBalance = profile?.credits_balance ?? 0;
  if (currentBalance < amount) {
    throw new Error('Insufficient credits');
  }

  const newBalance = currentBalance - amount;

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ credits_balance: newBalance })
    .eq('id', userId);

  if (updateError) throw updateError;

  const { error: transactionError } = await supabase
    .from('credits_transactions')
    .insert({
      user_id: userId,
      amount: -amount,
      type: 'usage',
      description,
      related_resume_id: relatedResumeId,
      status: 'success',
    });

  if (transactionError) throw transactionError;
}

export async function getUserTransactions(userId: string): Promise<CreditTransaction[]> {
  const { data, error } = await supabase
    .from('credits_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getCurrentUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function isAdmin(userId?: string): Promise<boolean> {
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    userId = user.id;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', userId)
    .maybeSingle();

  if (error) return false;
  return data?.role === 'admin' || data?.email === 'mohamts01@gmail.com';
}
