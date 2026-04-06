import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import HomePage from './pages/HomePage';
import ResumeBuilder from './pages/ResumeBuilder';
import Navigation from './components/shared/Navigation';
import SocialHome from './modules/social/SocialHome';
import SocialGenerator from './modules/social/SocialGenerator';
import SocialDashboard from './modules/social/SocialDashboard';
import CertificatesDashboard from './modules/certificates/CertificatesDashboard';
import CreateCertificate from './modules/certificates/CreateCertificate';
import CertificateVerify from './modules/certificates/CertificateVerify';
import PricingPage from './modules/credits/pages/PricingPage';
import CheckoutPage from './modules/credits/pages/CheckoutPage';
import AdminDashboard from './modules/admin/pages/AdminDashboard';
import UserManagement from './modules/admin/pages/UserManagement';
import PendingTransactions from './modules/admin/pages/PendingTransactions';
import ManualCreditControl from './modules/admin/pages/ManualCreditControl';
import AdminRoute from './components/admin/AdminRoute';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };

  const getCurrentModule = (): 'resume' | 'social' | 'certificates' | 'credits' | 'admin' | 'home' => {
    const path = location.pathname;
    if (path.includes('builder') || path.includes('resume')) return 'resume';
    if (path.includes('social') || path.includes('generator')) return 'social';
    if (path.includes('certificate')) return 'certificates';
    if (path.includes('pricing') || path.includes('checkout')) return 'credits';
    if (path.includes('admin')) return 'admin';
    return 'home';
  };

  const showNavigation =
    location.pathname !== '/' &&
    !location.pathname.includes('admin') &&
    location.pathname !== '/pricing' &&
    location.pathname !== '/checkout';

  return (
    <>
      {showNavigation && (
        <Navigation
          currentModule={getCurrentModule()}
          onNavigate={(module) => {
            if (module === 'home') navigate('/');
            else if (module === 'resume') navigate('/builder');
            else if (module === 'social') navigate('/social-home');
            else if (module === 'certificates') navigate('/certificates-dashboard');
            else if (module === 'pricing') navigate('/pricing');
            else navigate(`/${module}`);
          }}
        />
      )}

      <Routes>
        <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
        <Route path="/builder" element={<ResumeBuilder onNavigate={handleNavigate} />} />

        <Route path="/social-home" element={<SocialHome onNavigate={handleNavigate} />} />
        <Route path="/generator" element={<SocialGenerator onNavigate={handleNavigate} />} />
        <Route path="/social-dashboard" element={<SocialDashboard onNavigate={handleNavigate} />} />

        <Route path="/certificates-dashboard" element={<CertificatesDashboard onNavigate={handleNavigate} />} />
        <Route path="/create-certificate" element={<CreateCertificate onNavigate={handleNavigate} />} />
        <Route path="/verify" element={<CertificateVerify verificationCode="DEMO123" />} />

        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
        <Route path="/admin/transactions" element={<AdminRoute><PendingTransactions /></AdminRoute>} />
        <Route path="/admin/credits" element={<AdminRoute><ManualCreditControl /></AdminRoute>} />
      </Routes>
    </>
  );
}

function App() {
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  return (
    <BrowserRouter>
      <PayPalScriptProvider
        options={{
          clientId: clientId || 'test',
          currency: 'USD',
          intent: 'capture',
        }}
      >
        <AppContent />
      </PayPalScriptProvider>
    </BrowserRouter>
  );
}

export default App;
