import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isAdmin } from '../../services/creditService';
import { ShieldX } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  async function checkAdminAccess() {
    try {
      const admin = await isAdmin();
      setAuthorized(admin);
    } catch (error) {
      console.error('Error checking admin access:', error);
      setAuthorized(false);
    } finally {
      setChecking(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full text-center space-y-6 border border-red-500/30">
          <div className="flex justify-center">
            <div className="bg-red-500/20 p-4 rounded-full">
              <ShieldX className="w-16 h-16 text-red-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white">Access Forbidden</h2>
          <p className="text-slate-400">
            You do not have permission to access the admin dashboard. This area is restricted to administrators only.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
