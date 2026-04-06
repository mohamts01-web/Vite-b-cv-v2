import { FileText, Sparkles, LayoutGrid as Layout, Download, Image, Award, Coins, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCurrentUserProfile, isAdmin } from '../services/creditService';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [userAdmin, setUserAdmin] = useState(false);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    checkAdmin();
    loadCredits();
  }, []);

  async function checkAdmin() {
    const admin = await isAdmin();
    setUserAdmin(admin);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-lg shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                CvSira
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('pricing')}
                className="px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
              >
                <Coins className="w-4 h-4" />
                <span>{credits} Credits</span>
              </button>
              {userAdmin && (
                <button
                  onClick={() => onNavigate('admin')}
                  className="px-4 py-2 bg-purple-50 text-purple-700 font-medium rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </button>
              )}
              <button
                onClick={() => onNavigate('builder')}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
              >
                ابدأ الآن
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">
            منصة إنشاء المحتوى المتكاملة
            <span className="block text-blue-600 mt-2">بالذكاء الاصطناعي</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            أنشئ سيرتك الذاتية، منشورات التواصل الاجتماعي، والشهادات الرقمية في منصة واحدة
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <button
            onClick={() => onNavigate('builder')}
            className="group bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl transition-all transform hover:-translate-y-1 text-right"
          >
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-4 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              السيرة الذاتية
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              أنشئ سيرة ذاتية احترافية مع نصائح ذكية ومعاينة مباشرة
            </p>
            <div className="text-blue-600 font-medium group-hover:gap-3 flex items-center gap-2 transition-all">
              ابدأ الآن
              <Sparkles className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('social-home')}
            className="group bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl transition-all transform hover:-translate-y-1 text-right"
          >
            <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-4 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <Image className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              منشورات التواصل
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              صمم بطاقات تهنئة احترافية للمناسبات في ثوانٍ
            </p>
            <div className="text-purple-600 font-medium group-hover:gap-3 flex items-center gap-2 transition-all">
              ابدأ التصميم
              <Sparkles className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('certificates-dashboard')}
            className="group bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl transition-all transform hover:-translate-y-1 text-right"
          >
            <div className="bg-gradient-to-br from-amber-100 to-amber-50 p-4 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <Award className="w-10 h-10 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              الشهادات الرقمية
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              أنشئ شهادات رقمية موثقة مع نظام تحقق متقدم
            </p>
            <div className="text-amber-600 font-medium group-hover:gap-3 flex items-center gap-2 transition-all">
              إنشاء شهادة
              <Sparkles className="w-4 h-4" />
            </div>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-3 rounded-xl w-fit mb-4">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              مدعوم بالذكاء الاصطناعي
            </h3>
            <p className="text-slate-600 leading-relaxed">
              احصل على نصائح ذكية وتحسينات فورية لجعل سيرتك الذاتية متوافقة مع أنظمة ATS
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-br from-amber-100 to-amber-50 p-3 rounded-xl w-fit mb-4">
              <Layout className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              معاينة مباشرة
            </h3>
            <p className="text-slate-600 leading-relaxed">
              شاهد التغييرات فوراً أثناء الكتابة مع ضمان ملاءمة السيرة لصفحة A4 واحدة
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-br from-green-100 to-green-50 p-3 rounded-xl w-fit mb-4">
              <Download className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              تصدير احترافي
            </h3>
            <p className="text-slate-600 leading-relaxed">
              قم بتنزيل سيرتك الذاتية بصيغة PDF عالية الجودة جاهزة للإرسال مباشرة
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-12 border border-slate-100">
          <h3 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            كيف يعمل؟
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: '1', title: 'المعلومات الشخصية', desc: 'أدخل بياناتك الأساسية' },
              { num: '2', title: 'الخبرات والتعليم', desc: 'أضف سجلك المهني والأكاديمي' },
              { num: '3', title: 'التحسين بالذكاء الاصطناعي', desc: 'احصل على اقتراحات ذكية' },
              { num: '4', title: 'التنزيل', desc: 'احفظ سيرتك بصيغة PDF' }
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg">
                  {step.num}
                </div>
                <h4 className="font-bold text-slate-900 mb-2">{step.title}</h4>
                <p className="text-sm text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-300 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 CvSira. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
