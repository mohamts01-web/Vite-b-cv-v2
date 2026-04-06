import { Image, Sparkles, Heart, Cake, GraduationCap, Gift, Baby, TrendingUp } from 'lucide-react';

interface SocialHomeProps {
  onNavigate: (page: string) => void;
}

const CATEGORIES = [
  { id: 'eid', label: 'عيد', icon: Sparkles, color: 'from-green-500 to-emerald-600' },
  { id: 'graduation', label: 'تخرج', icon: GraduationCap, color: 'from-blue-500 to-indigo-600' },
  { id: 'wedding', label: 'زواج', icon: Heart, color: 'from-pink-500 to-rose-600' },
  { id: 'birthday', label: 'عيد ميلاد', icon: Cake, color: 'from-purple-500 to-violet-600' },
  { id: 'ramadan', label: 'رمضان', icon: Sparkles, color: 'from-amber-500 to-orange-600' },
  { id: 'newborn', label: 'مولود جديد', icon: Baby, color: 'from-cyan-500 to-teal-600' },
  { id: 'promotion', label: 'ترقية', icon: TrendingUp, color: 'from-emerald-500 to-green-600' },
  { id: 'other', label: 'أخرى', icon: Gift, color: 'from-slate-500 to-gray-600' },
];

export default function SocialHome({ onNavigate }: SocialHomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-4 rounded-2xl shadow-xl">
              <Image className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            أنشئ منشورك الاحتفالي
            <span className="block text-purple-600 mt-2">في ثوانٍ</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            صمم بطاقات تهنئة احترافية للمناسبات باستخدام قوالب جاهزة أو الذكاء الاصطناعي
          </p>
          <button
            onClick={() => onNavigate('generator')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-5 h-5" />
            ابدأ التصميم الآن
          </button>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            اختر نوع المناسبة
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => onNavigate('generator')}
                  className="group relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  <div className={`bg-gradient-to-br ${category.color} p-4 rounded-xl w-fit mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{category.label}</h3>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-12 border border-slate-100">
          <h3 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            لماذا منصتنا؟
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-4 rounded-xl w-fit mx-auto mb-4">
                <Sparkles className="w-10 h-10 text-purple-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">قوالب جاهزة</h4>
              <p className="text-slate-600">مكتبة متنوعة من القوالب الاحترافية لكل المناسبات</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-4 rounded-xl w-fit mx-auto mb-4">
                <Image className="w-10 h-10 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">تخصيص كامل</h4>
              <p className="text-slate-600">عدّل النصوص والألوان والخطوط حسب ذوقك</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-100 to-green-50 p-4 rounded-xl w-fit mx-auto mb-4">
                <Sparkles className="w-10 h-10 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">ذكاء اصطناعي</h4>
              <p className="text-slate-600">صمم خلفيات فريدة باستخدام الذكاء الاصطناعي</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-purple-600 hover:text-purple-700 font-medium underline"
          >
            عرض تصاميمي المحفوظة
          </button>
        </div>
      </main>
    </div>
  );
}
