import { useState } from 'react';
import { searchUsers, adjustUserCredits, getUserById } from '../../../services/adminService';
import { UserProfile } from '../../../types/credits';
import { ArrowLeft, Search, Plus, Minus, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ManualCreditControl() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [actionType, setActionType] = useState<'add' | 'subtract'>('add');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  async function handleSearch() {
    if (!searchQuery.trim()) return;

    try {
      setSearching(true);
      const users = await searchUsers(searchQuery);
      setSearchResults(users);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearching(false);
    }
  }

  async function selectUser(user: UserProfile) {
    try {
      const freshUser = await getUserById(user.id);
      if (freshUser) {
        setSelectedUser(freshUser);
        setSearchResults([]);
        setSearchQuery('');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  async function handleAdjustCredits() {
    if (!selectedUser || !amount || !reason.trim()) {
      alert('Please fill all fields');
      return;
    }

    const numAmount = parseInt(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (actionType === 'subtract' && numAmount > selectedUser.credits_balance) {
      alert('Cannot subtract more credits than user has');
      return;
    }

    try {
      setLoading(true);
      await adjustUserCredits(selectedUser.id, numAmount, reason, actionType === 'add');

      const updatedUser = await getUserById(selectedUser.id);
      if (updatedUser) {
        setSelectedUser(updatedUser);
      }

      setAmount('');
      setReason('');
      alert(`Successfully ${actionType === 'add' ? 'added' : 'subtracted'} ${numAmount} credits`);
    } catch (error) {
      console.error('Error adjusting credits:', error);
      alert('Failed to adjust credits');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/admin"
            className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white">Manual Credit Control</h1>
            <p className="text-slate-400">Add or subtract credits from user accounts</p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 space-y-6">
          <div>
            <label className="block text-slate-300 mb-2 font-medium">Search User</label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search by email, name, or phone..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={searching}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="mt-4 bg-slate-900 rounded-lg border border-slate-700 divide-y divide-slate-700 max-h-64 overflow-y-auto">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => selectUser(user)}
                    className="p-4 hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <div className="font-semibold text-white">{user.full_name || 'No name'}</div>
                    <div className="text-sm text-slate-400">{user.email}</div>
                    <div className="text-sm text-emerald-400 mt-1">
                      Current balance: {user.credits_balance} credits
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedUser && (
            <div className="pt-6 border-t border-slate-700 space-y-6">
              <div className="bg-slate-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-white font-semibold text-lg">
                      {selectedUser.full_name || 'No name'}
                    </div>
                    <div className="text-slate-400 text-sm">{selectedUser.email}</div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    Change User
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Coins className="w-5 h-5 text-emerald-400" />
                  <span className="text-white font-semibold">
                    Current Balance: {selectedUser.credits_balance} credits
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-2 font-medium">Action Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setActionType('add')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      actionType === 'add'
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <Plus className="w-8 h-8 text-emerald-400 mb-2 mx-auto" />
                    <div className="text-white font-semibold">Add Credits</div>
                  </button>

                  <button
                    onClick={() => setActionType('subtract')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      actionType === 'subtract'
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <Minus className="w-8 h-8 text-red-400 mb-2 mx-auto" />
                    <div className="text-white font-semibold">Subtract Credits</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-2 font-medium">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  placeholder="Enter amount of credits"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2 font-medium">Reason (Required)</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for credit adjustment..."
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={handleAdjustCredits}
                disabled={loading || !amount || !reason.trim()}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  actionType === 'add'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {loading
                  ? 'Processing...'
                  : `${actionType === 'add' ? 'Add' : 'Subtract'} ${amount || '0'} Credits`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
