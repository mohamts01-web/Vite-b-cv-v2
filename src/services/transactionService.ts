import { supabase } from '../lib/supabase';
import { CreditTransaction, PaymentMethod, CheckoutData } from '../types/credits';
import { addCredits } from './creditService';

export async function createTransaction(data: CheckoutData): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const transactionData: any = {
    user_id: user.id,
    amount: data.credits,
    credits_purchased: data.credits,
    amount_sar: data.amount_sar,
    amount_usd: data.amount_usd,
    type: 'purchase',
    payment_method: data.payment_method,
    status: 'pending',
  };

  const { data: transaction, error } = await supabase
    .from('credits_transactions')
    .insert(transactionData)
    .select()
    .single();

  if (error) throw error;
  return transaction.id;
}

export async function updateTransactionStatus(
  transactionId: string,
  status: 'success' | 'failed' | 'rejected',
  additionalData?: {
    paypal_order_id?: string;
    receipt_url?: string;
    rejection_reason?: string;
    admin_user_id?: string;
  }
): Promise<void> {
  const updateData: any = {
    status,
    processed_at: new Date().toISOString(),
    ...additionalData,
  };

  const { error } = await supabase
    .from('credits_transactions')
    .update(updateData)
    .eq('id', transactionId);

  if (error) throw error;

  if (status === 'success') {
    const { data: transaction } = await supabase
      .from('credits_transactions')
      .select('user_id, credits_purchased, amount_sar, amount_usd, payment_method, paypal_order_id')
      .eq('id', transactionId)
      .maybeSingle();

    if (transaction && transaction.credits_purchased) {
      await addCredits(
        transaction.user_id,
        transaction.credits_purchased,
        'purchase',
        `Credits purchased via ${transaction.payment_method}`,
        {
          amount_sar: transaction.amount_sar,
          amount_usd: transaction.amount_usd,
          payment_method: transaction.payment_method,
          paypal_order_id: transaction.paypal_order_id,
        }
      );
    }
  }
}

export async function getPendingTransactions(): Promise<CreditTransaction[]> {
  const { data, error } = await supabase
    .from('credits_transactions')
    .select(`
      *,
      profiles:user_id (
        email,
        full_name
      )
    `)
    .eq('status', 'pending')
    .eq('payment_method', 'bank_transfer')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function uploadReceipt(
  file: File,
  userId: string,
  transactionId: string
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${transactionId}.${fileExt}`;
  const filePath = `receipts/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('receipts')
    .upload(filePath, file, {
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('receipts')
    .getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from('credits_transactions')
    .update({ receipt_url: data.publicUrl })
    .eq('id', transactionId);

  if (updateError) throw updateError;

  return data.publicUrl;
}

export async function approveTransaction(
  transactionId: string,
  adminUserId: string
): Promise<void> {
  await updateTransactionStatus(transactionId, 'success', {
    admin_user_id: adminUserId,
  });
}

export async function rejectTransaction(
  transactionId: string,
  adminUserId: string,
  reason: string
): Promise<void> {
  await updateTransactionStatus(transactionId, 'rejected', {
    admin_user_id: adminUserId,
    rejection_reason: reason,
  });
}
