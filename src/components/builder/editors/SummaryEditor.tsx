import { ResumeContent } from '../../../types/resume';
import { FileText, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface SummaryEditorProps {
  content: ResumeContent;
  onUpdate: (updates: Partial<ResumeContent>) => void;
}

export default function SummaryEditor({ content, onUpdate }: SummaryEditorProps) {
  const summary = content.summary || { content: '', aiOptimized: false };
  const [charCount, setCharCount] = useState(summary.content.length);

  const updateSummary = (text: string) => {
    setCharCount(text.length);
    onUpdate({
      summary: {
        ...summary,
        content: text,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <FileText className="w-4 h-4" />
            الملخص المهني
          </label>
          <span className={`text-sm ${charCount < 100 ? 'text-amber-600' : charCount > 300 ? 'text-red-600' : 'text-green-600'}`}>
            {charCount} حرف
          </span>
        </div>
        <textarea
          value={summary.content}
          onChange={(e) => updateSummary(e.target.value)}
          placeholder="اكتب ملخصاً مهنياً موجزاً عن خبراتك ومهاراتك وأهدافك المهنية..."
          rows={6}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          dir="rtl"
        />
        <p className="text-xs text-slate-500 mt-1">
          يُفضل أن يكون الملخص بين 100-300 حرف
        </p>
      </div>

      <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all shadow-md">
        <Sparkles className="w-4 h-4" />
        تحسين بالذكاء الاصطناعي
      </button>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800 mb-2">
          <strong>نصائح لكتابة ملخص مهني قوي:</strong>
        </p>
        <ul className="text-sm text-blue-700 space-y-1 mr-4 list-disc">
          <li>ابدأ بمسماك الوظيفي الحالي أو المستهدف</li>
          <li>اذكر سنوات خبرتك في المجال</li>
          <li>سلّط الضوء على مهاراتك الأساسية</li>
          <li>اذكر إنجازاً أو اثنين قابلين للقياس</li>
          <li>اختم بما تبحث عنه في وظيفتك القادمة</li>
        </ul>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          <strong>مثال:</strong> "مهندس برمجيات بخبرة 5+ سنوات في تطوير تطبيقات الويب باستخدام React و Node.js. نجحت في قيادة فريق من 8 مطورين لإطلاق منصة تجارة إلكترونية خدمت أكثر من 100,000 مستخدم. أسعى للانضمام إلى فريق تقني متقدم للمساهمة في بناء حلول مبتكرة."
        </p>
      </div>
    </div>
  );
}
