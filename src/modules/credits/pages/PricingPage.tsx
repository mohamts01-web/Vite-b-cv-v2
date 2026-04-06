import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { CreditPackage } from '../../../types/credits';
import PackageCard from '../components/PackageCard';
import DynamicSlider from '../components/DynamicSlider';
import { Coins, ArrowLeft } from 'lucide-react';
import { getCurrentUserProfile } from '../../../services/creditService';

export default function PricingPage() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    loadPackages();
    loadCredits();
  }, []);

  async function loadPackages() {
    try {
      const { data, error } = await supabase
        .from('credit_packages')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setPackages(data ?? []);
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadCredits() {
    try {
      const profile = await getCurrentUserProfile();
      if (profile) {
        setCredits(profile.credits_balance);
      }
    } catch (error) {
      console.error('Error loading credits:', error);
    }
  }

  function handlePackageSelect(pkg: CreditPackage) {
    navigate('/checkout', {
      state: {
        package_id: pkg.id,
        credits: pkg.credits,
        amount_sar: pkg.price_sar,
        amount_usd: pkg.price_usd,
      },
    });
  }

  function handleCustomPurchase(credits: number, priceSar: number, priceUsd: number) {
    navigate('/checkout', {
      state: {
        credits,
        amount_sar: priceSar,
        amount_usd: priceUsd,
      },
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" dir="rtl">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">رجوع</span>
              </button>
              <div className="h-6 w-px bg-slate-200"></div>
              <span className="text-sm text-slate-600">النقاط الحالية: <span className="font-bold text-blue-600">{credits}</span></span>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                اشترِ النقاط
              </h1>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-medium">
            <span className="text-xl">⭐</span>
            <span>5 نقاط ترحيبية مجانية لكل مستخدم جديد</span>
          </div>

          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            استخدم النقاط للشهادات والبطاقات
          </h2>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            كل شهادة تحتاج إلى 15 نقطة وكل بطاقة تحتاج إلى 3 نقاط
          </p>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            الباقات المتاحة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} package={pkg} onSelect={handlePackageSelect} />
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <DynamicSlider onPurchase={handleCustomPurchase} />
        </div>

        <div className="mt-16 bg-blue-50 border border-blue-200 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">
            ماذا يمكنك أن تفعل بالنقاط؟
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="text-5xl">📜</div>
              <h4 className="font-semibold text-slate-900">الشهادات</h4>
              <p className="text-slate-600 text-sm">
                أنشئ شهادات رقمية احترافية موثقة (15 نقطة لكل شهادة)
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="text-5xl">📱</div>
              <h4 className="font-semibold text-slate-900">البطاقات</h4>
              <p className="text-slate-600 text-sm">
                صمم بطاقات تهنئة واحترافية (3 نقاط لكل بطاقة)
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="text-5xl">🤖</div>
              <h4 className="font-semibold text-slate-900">الذكاء الاصطناعي</h4>
              <p className="text-slate-600 text-sm">
                نصائح ذكية لتحسين سيرتك الذاتية والمحتوى
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
