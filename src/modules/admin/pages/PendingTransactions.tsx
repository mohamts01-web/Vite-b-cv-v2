import { useEffect, useState } from 'react';
import { getPendingTransactions, approveTransaction, rejectTransaction } from '../../../services/transactionService';
import { CreditTransaction } from '../../../types/credits';
import { supabase } from '../../../lib/supabase';
import { ArrowLeft, Eye, Check, X, Calendar, Coins, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PendingTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      const data = await getPendingTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(transactionId: string) {
    if (!confirm('Are you sure you want to approve this transaction?')) return;

    try {
      setProcessing(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      await approveTransaction(transactionId, user.id);
      setTransactions(transactions.filter(t => t.id !== transactionId));
      alert('Transaction approved successfully!');
    } catch (error) {
      console.error('Error approving transaction:', error);
      alert('Failed to approve transaction');
    } finally {
      setProcessing(false);
    }
  }

  async function handleReject(transactionId: string) {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      setProcessing(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      await rejectTransaction(transactionId, user.id, rejectionReason);
      setTransactions(transactions.filter(t => t.id !== transactionId));
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedTransaction(null);
      alert('Transaction rejected');
    } catch (error) {
      console.error('Error rejecting transaction:', error);
      alert('Failed to reject transaction');
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/admin"
            className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white">Pending Transactions</h1>
            <p className="text-slate-400">Review and approve bank transfer requests</p>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="bg-slate-800 rounded-xl p-12 border border-slate-700 text-center">
            <div className="text-slate-500 text-lg">No pending transactions</div>
          </div>
        ) : (
          <div className="grid gap-6">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-slate-400 mb-1">User Information</div>
                      <div className="text-white font-semibold">
                        {transaction.profiles?.full_name || 'No name'}
                      </div>
                      <div className="text-slate-400 text-sm">
                        {transaction.profiles?.email}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-slate-400 mb-1">Credits</div>
                        <div className="flex items-center gap-2">
                          <Coins className="w-5 h-5 text-emerald-400" />
                          <span className="text-white font-semibold text-lg">
                            {transaction.credits_purchased}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-slate-400 mb-1">Amount</div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-slate-500" />
                            <span className="text-white font-semibold">
                              {transaction.amount_sar?.toFixed(2)} SAR
                            </span>
                          </div>
                          <div className="text-slate-500 text-sm">
                            ${transaction.amount_usd?.toFixed(2)} USD
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-slate-400 mb-1">Submitted</div>
                      <div className="flex items-center gap-2 text-white">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        {new Date(transaction.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-slate-400 mb-2">Receipt</div>
                      {transaction.receipt_url ? (
                        <div className="relative group">
                          <img
                            src={transaction.receipt_url}
                            alt="Transfer receipt"
                            className="w-full h-48 object-cover rounded-lg cursor-pointer"
                            onClick={() => setSelectedTransaction(transaction)}
                          />
                          <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Eye className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-slate-700 rounded-lg flex items-center justify-center text-slate-500">
                          No receipt uploaded
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(transaction.id)}
                        disabled={processing}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Check className="w-5 h-5" />
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setShowRejectModal(true);
                        }}
                        disabled={processing}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <X className="w-5 h-5" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTransaction && !showRejectModal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTransaction(null)}
        >
          <div className="max-w-4xl max-h-[90vh] overflow-auto">
            <img
              src={selectedTransaction.receipt_url}
              alt="Receipt full view"
              className="rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-red-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">Reject Transaction</h3>
            <p className="text-slate-400 mb-4">
              Please provide a reason for rejecting this transaction. The user will receive this message.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setSelectedTransaction(null);
                }}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedTransaction.id)}
                disabled={processing || !rejectionReason.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {processing ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
