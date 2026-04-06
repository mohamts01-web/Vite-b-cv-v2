import { CreditPackage } from '../../../types/credits';
import { Crown } from 'lucide-react';

interface PackageCardProps {
  package: CreditPackage;
  onSelect: (pkg: CreditPackage) => void;
}

export default function PackageCard({ package: pkg, onSelect }: PackageCardProps) {
  const discountPercentage = Math.round((1 - (pkg.price_sar / pkg.credits)) * 100);

  return (
    <div
      onClick={() => onSelect(pkg)}
      className={`relative bg-white rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer hover:shadow-xl ${
        pkg.is_featured
          ? 'border-amber-500 shadow-lg'
          : 'border-slate-200 hover:border-blue-400'
      }`}
      dir="rtl"
    >
      {pkg.is_featured && (
        <div className="absolute -top-3 right-1/2 translate-x-1/2 bg-gradient-to-r from-amber-600 to-amber-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
          <Crown className="w-4 h-4" />
          <span>الأفضل قيمة</span>
        </div>
      )}

      {discountPercentage > 0 && (
        <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold">
          توفير {discountPercentage}%
        </div>
      )}

      <div className="text-center space-y-4">
        <div>
          <div className="text-5xl font-bold text-blue-600 mb-2">{pkg.credits}</div>
          <div className="text-slate-600 text-sm font-medium">نقطة</div>
        </div>

        <div className="space-y-1">
          <div className="text-3xl font-bold text-slate-900">
            <span className="text-lg text-slate-500">ر.س</span> {pkg.price_sar.toFixed(2)}
          </div>
          <div className="text-slate-500 text-sm">
            ${pkg.price_usd.toFixed(2)}
          </div>
        </div>

        <div className="text-sm text-slate-600">
          {(pkg.price_sar / pkg.credits).toFixed(2)} ر.س لكل نقطة
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(pkg);
          }}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
            pkg.is_featured
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg'
              : 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
          }`}
        >
          اشترِ الآن
        </button>
      </div>
    </div>
  );
}
