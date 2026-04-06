import { PayPalButtons } from '@paypal/react-paypal-js';
import { useState, useEffect } from 'react';

interface PayPalButtonProps {
  amount: number;
  credits: number;
  onSuccess: (orderId: string) => void;
  onError: (error: any) => void;
}

function supportsApplePay(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window as any).ApplePaySession;
}

export default function PayPalButton({ amount, credits, onSuccess, onError }: PayPalButtonProps) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasApplePay, setHasApplePay] = useState(false);

  useEffect(() => {
    setHasApplePay(supportsApplePay());
  }, []);

  return (
    <div className="space-y-4">
      <div className="relative">
        {processing && (
          <div className="absolute inset-0 bg-slate-900/80 rounded-lg flex items-center justify-center z-50">
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
            fundingSource: hasApplePay ? 'applepay' : 'paypal',
          }}
          createOrder={(data, actions) => {
            setError(null);
            console.log('Creating PayPal order:', { amount, credits, fundingSource: hasApplePay ? 'applepay' : 'paypal' });
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
              console.log('Order approved:', data);
              const order = await actions.order?.capture();
              console.log('Order captured:', order);
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
            const errorMsg = err instanceof Error ? err.message : JSON.stringify(err);
            alert(`PayPal Error: ${errorMsg}`);
            setError('حدث خطأ في PayPal. يرجى المحاولة مجددا أو استخدام طريقة دفع أخرى');
            onError(err);
          }}
          onCancel={() => {
            setProcessing(false);
            setError('تم إلغاء عملية الدفع');
          }}
        />
      </div>

      {hasApplePay && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          Apple Pay متاح على هذا الجهاز
        </div>
      )}
    </div>
  );
}
