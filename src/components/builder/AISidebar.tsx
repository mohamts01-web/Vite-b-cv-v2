import { EditorStep, ResumeContent } from '../../types/resume';
import { X, Sparkles, MessageCircle, Send, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface AISidebarProps {
  currentStep: EditorStep;
  content: ResumeContent;
  onClose: () => void;
}

const STEP_TIPS: Record<EditorStep, { title: string; tips: string[] }> = {
  'personal-info': {
    title: 'نصائح للمعلومات الشخصية',
    tips: [
      'استخدم بريداً إلكترونياً احترافياً (تجنب أسماء البريد غير المهنية)',
      'تأكد من أن رقم هاتفك صحيح ومتاح',
      'أضف رابط LinkedIn إذا كان لديك ملف محدث',
      'الموقع الشخصي أو Portfolio يضيف قيمة كبيرة',
    ],
  },
  'summary': {
    title: 'نصائح للملخص المهني',
    tips: [
      'اجعله بين 2-4 جمل (100-300 حرف)',
      'ابدأ بمسماك الوظيفي وسنوات الخبرة',
      'اذكر مهاراتك الأساسية والتقنيات التي تتقنها',
      'أضف إنجازاً أو اثنين قابلين للقياس',
      'اختم بما تبحث عنه في وظيفتك القادمة',
    ],
  },
  'experience': {
    title: 'نصائح للخبرة العملية',
    tips: [
      'رتب الخبرات من الأحدث إلى الأقدم',
      'أضف 2-3 إنجازات قابلة للقياس لكل وظيفة',
      'استخدم أرقاماً ونسباً مئوية (زيادة 30%، خدمة 10,000 مستخدم)',
      'ابدأ كل إنجاز بفعل قوي (قدت، طورت، نفذت، حسنت)',
      'ركز على التأثير والنتائج وليس المسؤوليات فقط',
    ],
  },
  'education': {
    title: 'نصائح للتعليم',
    tips: [
      'رتب المؤهلات من الأحدث إلى الأقدم',
      'اذكر المعدل فقط إذا كان مرتفعاً (3.5+ من 5.0)',
      'أضف أي مشاريع تخرج مميزة أو أبحاث',
      'يمكنك حذف التعليم الثانوي إذا كان لديك درجة جامعية',
    ],
  },
  'skills': {
    title: 'نصائح للمهارات',
    tips: [
      'صنف المهارات إلى فئات (تقنية، لغوية، إدارية)',
      'ركز على المهارات المطلوبة في الوظيفة المستهدفة',
      'أضف 5-15 مهارة رئيسية',
      'كن صادقاً في تقييم مستوى إتقانك',
      'أولوية للمهارات الأكثر طلباً في السوق',
    ],
  },
  'languages': {
    title: 'نصائح للغات',
    tips: [
      'كن دقيقاً في تقييم مستوى اللغة',
      'اللغة الإنجليزية ميزة تنافسية في معظم الوظائف',
      'أضف شهادات اللغة إن وجدت (IELTS، TOEFL)',
    ],
  },
  'extras': {
    title: 'نصائح للأقسام الإضافية',
    tips: [
      'أضف فقط ما يضيف قيمة لطلبك الوظيفي',
      'الشهادات المهنية تعزز فرصك بشكل كبير',
      'العمل التطوعي يُظهر التزامك الاجتماعي',
      'الجوائز والتقديرات دليل على تميزك',
      'الهوايات: أضفها فقط إذا كانت ذات صلة',
    ],
  },
};

export default function AISidebar({ currentStep, content, onClose }: AISidebarProps) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([]);

  const stepTips = STEP_TIPS[currentStep];

  const calculateATSScore = () => {
    let score = 0;
    let strengths: string[] = [];
    let weaknesses: string[] = [];
    let recommendations: string[] = [];

    if (content.personalInfo?.email?.includes('@')) {
      score += 10;
      strengths.push('معلومات الاتصال متوفرة');
    } else {
      weaknesses.push('البريد الإلكتروني مفقود');
      recommendations.push('أضف بريداً إلكترونياً احترافياً');
    }

    if (content.summary?.content && content.summary.content.length >= 100) {
      score += 15;
      strengths.push('ملخص مهني قوي');
    } else {
      weaknesses.push('الملخص المهني قصير جداً أو مفقود');
      recommendations.push('اكتب ملخصاً مهنياً من 2-4 جمل');
    }

    if (content.experience && content.experience.length > 0) {
      score += 20;
      const hasAchievements = content.experience.some(exp => exp.achievements?.length > 0);
      if (hasAchievements) {
        score += 10;
        strengths.push('إنجازات قابلة للقياس في الخبرات');
      } else {
        weaknesses.push('لا توجد إنجازات في الخبرات العملية');
        recommendations.push('أضف 2-3 إنجازات قابلة للقياس لكل وظيفة');
      }
    } else {
      weaknesses.push('لا توجد خبرات عملية');
      recommendations.push('أضف خبراتك العملية');
    }

    if (content.education && content.education.length > 0) {
      score += 15;
      strengths.push('معلومات التعليم متوفرة');
    } else {
      weaknesses.push('معلومات التعليم مفقودة');
      recommendations.push('أضف مؤهلاتك التعليمية');
    }

    if (content.skills && content.skills.length >= 5) {
      score += 15;
      strengths.push('مجموعة جيدة من المهارات');
      if (content.skills.length >= 10) score += 5;
    } else {
      weaknesses.push('عدد المهارات قليل');
      recommendations.push('أضف 5-15 مهارة رئيسية');
    }

    if (content.languages && content.languages.length >= 2) {
      score += 10;
      strengths.push('تعدد لغوي');
    }

    return { score: Math.min(100, score), strengths, weaknesses, recommendations };
  };

  const atsResult = calculateATSScore();

  const sendMessage = () => {
    if (!message.trim()) return;

    setChatHistory([
      ...chatHistory,
      { role: 'user', text: message },
      {
        role: 'ai',
        text: 'شكراً على سؤالك! هذه ميزة تجريبية وسيتم تفعيل الذكاء الاصطناعي الكامل قريباً. في الوقت الحالي، يمكنك الاستفادة من النصائح والتوصيات المتوفرة في الشريط الجانبي.',
      },
    ]);
    setMessage('');
  };

  return (
    <div className="fixed left-0 top-0 h-full w-96 bg-white border-r border-slate-200 shadow-2xl z-40 flex flex-col">
      <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-purple-600 to-purple-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="w-5 h-5" />
            <h2 className="font-bold text-lg">مساعد AI</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-800 rounded-lg transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            {stepTips.title}
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            {stepTips.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h3 className="font-bold text-slate-900 mb-3">تقييم ATS</h3>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">الدرجة الكلية</span>
              <span className="text-2xl font-bold text-blue-600">{atsResult.score}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  atsResult.score >= 70
                    ? 'bg-green-500'
                    : atsResult.score >= 50
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${atsResult.score}%` }}
              />
            </div>
          </div>

          {atsResult.strengths.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                نقاط القوة
              </h4>
              <ul className="text-sm space-y-1">
                {atsResult.strengths.map((strength, idx) => (
                  <li key={idx} className="text-green-600">✓ {strength}</li>
                ))}
              </ul>
            </div>
          )}

          {atsResult.weaknesses.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                نقاط الضعف
              </h4>
              <ul className="text-sm space-y-1">
                {atsResult.weaknesses.map((weakness, idx) => (
                  <li key={idx} className="text-red-600">✗ {weakness}</li>
                ))}
              </ul>
            </div>
          )}

          {atsResult.recommendations.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                التوصيات
              </h4>
              <ul className="text-sm space-y-1">
                {atsResult.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-blue-600">→ {rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
          <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            محادثة AI
          </h3>
          <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg text-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-100 text-blue-900 text-right'
                    : 'bg-purple-100 text-purple-900'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="اسأل مساعد AI..."
              className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
              dir="rtl"
            />
            <button
              onClick={sendMessage}
              className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
