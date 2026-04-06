import { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { OCCASION_TYPES, STYLE_OPTIONS, SocialStyle, COLOR_PALETTES } from '../../types/social';

interface SocialGeneratorProps {
  onNavigate: (page: string) => void;
}

export default function SocialGenerator({ onNavigate }: SocialGeneratorProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    occasion_type: '',
    sender_name: '',
    recipient_name: '',
    message: '',
    style: 'modern' as SocialStyle,
    colors: [] as string[],
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    else onNavigate('editor');
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => onNavigate('social-home')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          العودة
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={num}
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                    step >= num
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">نوع المناسبة</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {OCCASION_TYPES.map((occasion) => (
                  <button
                    key={occasion.value}
                    onClick={() => updateField('occasion_type', occasion.value)}
                    className={`p-4 rounded-xl border-2 font-medium transition-all ${
                      formData.occasion_type === occasion.value
                        ? 'border-purple-600 bg-purple-50 text-purple-900'
                        : 'border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    {occasion.label}
                  </button>
                ))}
              </div>
              {formData.occasion_type === 'other' && (
                <input
                  type="text"
                  placeholder="اكتب نوع المناسبة..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  dir="rtl"
                />
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">معلومات المرسل والمستلم</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  اسم المرسل
                </label>
                <input
                  type="text"
                  value={formData.sender_name}
                  onChange={(e) => updateField('sender_name', e.target.value)}
                  placeholder="اسمك أو اسم المؤسسة"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  اسم المستلم
                </label>
                <input
                  type="text"
                  value={formData.recipient_name}
                  onChange={(e) => updateField('recipient_name', e.target.value)}
                  placeholder="اسم المهنأ"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  dir="rtl"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">رسالة التهنئة</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  الرسالة (اختياري)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  placeholder="اكتب رسالة تهنئة شخصية..."
                  rows={6}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  dir="rtl"
                />
                <p className="text-sm text-slate-500 mt-2">
                  {formData.message.length} حرف
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-800">
                  <strong>نصيحة:</strong> رسالة قصيرة ومعبرة أفضل من رسالة طويلة للمنشورات الاجتماعية
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">اختر النمط</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {STYLE_OPTIONS.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => updateField('style', style.value)}
                    className={`p-6 rounded-xl border-2 font-medium transition-all ${
                      formData.style === style.value
                        ? 'border-purple-600 bg-purple-50 text-purple-900'
                        : 'border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-lg font-bold mb-2">{style.label}</div>
                    <div className="text-sm text-slate-600">{style.labelEn}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">اختر لوحة الألوان</h2>
              <div className="space-y-4">
                {Object.entries(COLOR_PALETTES).map(([key, colors]) => (
                  <button
                    key={key}
                    onClick={() => updateField('colors', colors)}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      JSON.stringify(formData.colors) === JSON.stringify(colors)
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        {colors.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-12 h-12 rounded-lg shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="font-medium text-slate-900">
                        {key === 'desertGold' && 'ذهبي صحراوي'}
                        {key === 'islamicGreen' && 'أخضر إسلامي'}
                        {key === 'royalBlue' && 'أزرق ملكي'}
                        {key === 'elegantPurple' && 'بنفسجي أنيق'}
                        {key === 'romanticPink' && 'وردي رومانسي'}
                        {key === 'modernNeutral' && 'حيادي عصري'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-8 border-t border-slate-200">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                step === 1
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ArrowRight className="w-5 h-5" />
              السابق
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all shadow-md"
            >
              {step === 5 ? (
                <>
                  <Sparkles className="w-5 h-5" />
                  إلى المحرر
                </>
              ) : (
                <>
                  التالي
                  <ArrowLeft className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
