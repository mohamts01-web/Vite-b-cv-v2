import { useState } from 'react';
import { calculatePrice } from '../../../services/creditCalculation';
import { Sparkles } from 'lucide-react';

interface DynamicSliderProps {
  onPurchase: (credits: number, priceSar: number, priceUsd: number) => void;
}

export default function DynamicSlider({ onPurchase }: DynamicSliderProps) {
  const [credits, setCredits] = useState(100);
  const pricing = calculatePrice(credits);

  return (
    <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 shadow-lg" dir="rtl">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-2xl font-bold text-slate-900">أو اختر عدد النقاط</h3>
        <Sparkles className="w-6 h-6 text-blue-600" />
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <div className="text-6xl font-bold text-blue-600 mb-2">{credits}</div>
          <div className="text-slate-600 text-sm font-medium">نقطة</div>
        </div>

        <div>
          <input
            type="range"
            min="5"
            max="5000"
            step="5"
            value={credits}
            onChange={(e) => setCredits(parseInt(e.target.value))}
            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, rgb(37, 99, 235) 0%, rgb(37, 99, 235) ${
                ((credits - 5) / (5000 - 5)) * 100
              }%, rgb(226, 232, 240) ${((credits - 5) / (5000 - 5)) * 100}%, rgb(226, 232, 240) 100%)`,
            }}
          />

          <div className="flex justify-between text-xs text-slate-500 mt-3 font-medium">
            <span>5,000</span>
            <span>2,500</span>
            <span>5</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-4">
          <div className="flex flex-col items-center justify-center">
            <span className="text-slate-600 text-sm mb-2">السعر:</span>
            <div className="text-right">
              <div className="text-3xl font-bold text-slate-900">
                {pricing.price_sar.toFixed(2)} <span className="text-lg text-slate-500">ر.س</span>
              </div>
              <div className="text-slate-500 text-sm">
                (${pricing.price_usd.toFixed(2)})
              </div>
            </div>
          </div>

          <div className="border-t border-blue-200 pt-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">السعر لكل نقطة</span>
              <span className="text-slate-900 font-semibold">
                {pricing.price_per_credit.toFixed(2)} ر.س
              </span>
            </div>

            {pricing.savings > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">التوفير</span>
                <span className="text-emerald-600 font-semibold">
                  {pricing.savings.toFixed(2)} ر.س ({pricing.discount_percentage.toFixed(0)}%)
                </span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => onPurchase(credits, pricing.price_sar, pricing.price_usd)}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          شراء {credits} نقطة
        </button>
      </div>
    </div>
  );
}
