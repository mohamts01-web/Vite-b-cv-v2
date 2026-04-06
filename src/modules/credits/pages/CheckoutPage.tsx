import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckoutData, PaymentMethod } from '../../../types/credits';
import PayPalButton from '../components/PayPalButton';
import BankTransferForm from '../components/BankTransferForm';
import { CreditCard, Building2, CheckCircle } from 'lucide-react';
import { createTransaction, uploadReceipt, updateTransactionStatus } from '../../../services/transactionService';
import { supabase } from '../../../lib/supabase';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const checkoutData = location.state as CheckoutData;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paypal');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!checkoutData) {
    navigate('/pricing');
    return null;
  }

  async function handlePayPalSuccess(orderId: string) {
    try {
      setLoading(true);

      const transactionId = await createTransaction({
        ...checkoutData,
        payment_method: 'paypal',
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const token = (await supabase.auth.getSession()).data?.session?.access_token;
      if (!token) throw new Error('No session token');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-paypal-payment`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId,
            transactionId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to verify payment');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error processing PayPal payment:', error);
      alert('Payment successful but there was an error recording it. Please contact support with order ID: ' + orderId);
    } finally {
      setLoading(false);
    }
  }

  function handlePayPalError(error: any) {
    console.error('PayPal error:', error);
    alert('Payment failed. Please try again or use bank transfer.');
  }

  async function handleBankTransferSubmit(file: File, referenceNumber: string) {
    try {
      setLoading(true);

      const transactionId = await createTransaction({
        ...checkoutData,
        payment_method: 'bank_transfer',
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      await uploadReceipt(file, user.id, transactionId);

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error submitting bank transfer:', error);
      alert('Failed to submit transfer. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-emerald-500/20 p-4 rounded-full">
              <CheckCircle className="w-16 h-16 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white">
            {paymentMethod === 'paypal' ? 'Payment Successful!' : 'Transfer Submitted!'}
          </h2>
          <p className="text-slate-400">
            {paymentMethod === 'paypal'
              ? `${checkoutData.credits} credits have been added to your account.`
              : 'Your transfer is being reviewed. You will receive an email once approved (usually within 24-48 hours).'}
          </p>
          <p className="text-sm text-slate-500">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-16 px-4" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/pricing')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8"
        >
          ← العودة للباقات
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">إتمام الشراء</h1>
              <p className="text-slate-600">أكمل عملية الشراء بأمان تام</p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-lg">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">اختر طريقة الدفع</h3>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-6 rounded-lg border-2 transition-all text-right ${
                    paymentMethod === 'paypal'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className="w-8 h-8 text-blue-600 mb-2" />
                  <div className="text-slate-900 font-semibold">PayPal</div>
                  <div className="text-xs text-slate-600 mt-1">فوري</div>
                </button>

                <button
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-6 rounded-lg border-2 transition-all text-right ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Building2 className="w-8 h-8 text-blue-600 mb-2" />
                  <div className="text-slate-900 font-semibold">تحويل بنكي</div>
                  <div className="text-xs text-slate-600 mt-1">24-48 ساعة</div>
                </button>
              </div>

              {paymentMethod === 'paypal' ? (
                <div>
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                    سيتم توجيهك إلى PayPal لإتمام عملية الدفع بشكل آمن.
                  </div>
                  <PayPalButton
                    amount={checkoutData.amount_usd}
                    credits={checkoutData.credits}
                    onSuccess={handlePayPalSuccess}
                    onError={handlePayPalError}
                  />
                </div>
              ) : (
                <BankTransferForm onSubmit={handleBankTransferSubmit} loading={loading} />
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-slate-200 sticky top-4 shadow-lg">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">ملخص الطلب</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">عدد النقاط</span>
                  <span className="text-3xl font-bold text-blue-600">
                    {checkoutData.credits}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">السعر للنقطة الواحدة</span>
                    <span className="text-slate-900 font-semibold">
                      {(checkoutData.amount_sar / checkoutData.credits).toFixed(2)} ر.س
                    </span>
                  </div>

                  {checkoutData.amount_sar < checkoutData.credits && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>التوفير</span>
                      <span>
                        {(checkoutData.credits - checkoutData.amount_sar).toFixed(2)} ر.س
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-slate-600 font-medium">الإجمالي</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900">
                        {checkoutData.amount_sar.toFixed(2)} <span className="text-sm text-slate-600">ر.س</span>
                      </div>
                      <div className="text-sm text-slate-600">
                        (${checkoutData.amount_usd.toFixed(2)})
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">النقاط لا تنتهي أبداً</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">معالجة آمنة للدفع</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">دعم عملاء على مدار الساعة</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
