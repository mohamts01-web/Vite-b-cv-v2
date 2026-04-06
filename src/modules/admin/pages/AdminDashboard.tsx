import { useEffect, useState } from 'react';
import { Users, DollarSign, Coins, Clock } from 'lucide-react';
import { getAdminStats } from '../../../services/adminService';
import { AdminStats } from '../../../types/admin';
import StatsCard from '../components/StatsCard';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
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
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Manage users, transactions, and credits</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value={stats?.total_users ?? 0}
            icon={Users}
            iconColor="text-blue-400"
            bgColor="bg-blue-500/10"
            subtitle={`${stats?.active_users ?? 0} active`}
          />

          <StatsCard
            title="Credits Distributed"
            value={(stats?.total_credits_distributed ?? 0).toLocaleString()}
            icon={Coins}
            iconColor="text-emerald-400"
            bgColor="bg-emerald-500/10"
          />

          <StatsCard
            title="Total Revenue"
            value={`${stats?.total_revenue_sar.toFixed(2) ?? 0} SAR`}
            icon={DollarSign}
            iconColor="text-purple-400"
            bgColor="bg-purple-500/10"
            subtitle={`$${stats?.total_revenue_usd.toFixed(2) ?? 0} USD`}
          />

          <StatsCard
            title="Pending Reviews"
            value={stats?.pending_transactions ?? 0}
            icon={Clock}
            iconColor="text-amber-400"
            bgColor="bg-amber-500/10"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/admin/users"
            className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-colors group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-500/10 p-3 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">User Management</h3>
            </div>
            <p className="text-slate-400 text-sm">
              View and manage user accounts, activate/deactivate users, and adjust credits
            </p>
          </Link>

          <Link
            to="/admin/transactions"
            className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-purple-500 transition-colors group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-500/10 p-3 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                <Clock className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Pending Transactions</h3>
            </div>
            <p className="text-slate-400 text-sm">
              Review and approve bank transfer requests from users
            </p>
            {stats && stats.pending_transactions > 0 && (
              <div className="mt-4 bg-amber-500/20 border border-amber-500 rounded-lg px-3 py-2 text-amber-400 text-sm font-semibold">
                {stats.pending_transactions} pending approval
              </div>
            )}
          </Link>

          <Link
            to="/admin/credits"
            className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-emerald-500 transition-colors group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-emerald-500/10 p-3 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                <Coins className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Manual Credit Control</h3>
            </div>
            <p className="text-slate-400 text-sm">
              Manually add or subtract credits from any user account
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
