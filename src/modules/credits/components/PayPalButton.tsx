import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useState } from 'react';

interface PayPalButtonProps {
  amount: number;
  credits: number;
  onSuccess: (orderId: string) => void;
  onError: (error: any) => void;
}

export default function PayPalButton({ amount, credits, onSuccess, onError }: PayPalButtonProps) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  if (!clientId || clientId === 'YOUR_PAYPAL_CLIENT_ID_HERE' || clientId.includes('_HERE')) {
    return (
      <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-400">
        <p className="font-semibold mb-1">PayPal غير مكون</p>
        <p className="text-sm">يرجى التواصل مع الدعم لتفعيل طريقة الدفع</p>
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: 'USD',
        intent: 'capture',
      }}
    >
      <div className="relative">
        {processing && (
          <div className="absolute inset-0 bg-slate-900/80 rounded-lg flex items-center justify-center z-10">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="text-white">جاري معالجة الدفع...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <PayPalButtons
          style={{
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'pay',
          }}
          createOrder={(data, actions) => {
            setError(null);
            return actions.order.create({
              intent: 'CAPTURE',
              purchase_units: [
                {
                  amount: {
                    currency_code: 'USD',
                    value: amount.toFixed(2),
                  },
                  description: `${credits} Credits for CvSira`,
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            setProcessing(true);
            try {
              const order = await actions.order?.capture();
              if (order && order.status === 'COMPLETED') {
                onSuccess(data.orderID);
              } else {
                throw new Error('Order not completed');
              }
            } catch (error) {
              console.error('PayPal capture error:', error);
              setError('حدث خطأ في معالجة الدفع. يرجى المحاولة مجددا');
              onError(error);
            } finally {
              setProcessing(false);
            }
          }}
          onError={(err) => {
            console.error('PayPal error:', err);
            setError('حدث خطأ في PayPal. يرجى المحاولة مجددا أو استخدام طريقة دفع أخرى');
            onError(err);
          }}
          onCancel={() => {
            setProcessing(false);
            setError('تم إلغاء عملية الدفع');
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
}
