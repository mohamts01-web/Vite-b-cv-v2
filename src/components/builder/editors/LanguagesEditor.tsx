import { ResumeContent, Language } from '../../../types/resume';
import { Plus, Trash2, Globe } from 'lucide-react';

interface LanguagesEditorProps {
  content: ResumeContent;
  onUpdate: (updates: Partial<ResumeContent>) => void;
}

const PROFICIENCY_LEVELS = [
  { value: 'basic', label: 'أساسي' },
  { value: 'intermediate', label: 'متوسط' },
  { value: 'professional', label: 'احترافي' },
  { value: 'fluent', label: 'طليق' },
  { value: 'native', label: 'لغة أم' },
];

export default function LanguagesEditor({ content, onUpdate }: LanguagesEditorProps) {
  const languages = content.languages || [];

  const addLanguage = () => {
    const newLanguage: Language = {
      id: crypto.randomUUID(),
      language: '',
      proficiency: 'intermediate',
    };

    onUpdate({
      languages: [...languages, newLanguage],
    });
  };

  const updateLanguage = (id: string, updates: Partial<Language>) => {
    onUpdate({
      languages: languages.map(lang =>
        lang.id === id ? { ...lang, ...updates } : lang
      ),
    });
  };

  const removeLanguage = (id: string) => {
    onUpdate({
      languages: languages.filter(lang => lang.id !== id),
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        {languages.map((lang) => (
          <div
            key={lang.id}
            className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
          >
            <Globe className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={lang.language}
                onChange={(e) => updateLanguage(lang.id, { language: e.target.value })}
                placeholder="اسم اللغة *"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                dir="rtl"
              />
              <select
                value={lang.proficiency}
                onChange={(e) => updateLanguage(lang.id, { proficiency: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                dir="rtl"
              >
                {PROFICIENCY_LEVELS.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => removeLanguage(lang.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addLanguage}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
      >
        <Plus className="w-5 h-5" />
        إضافة لغة
      </button>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800 mb-2">
          <strong>معايير تقييم اللغة:</strong>
        </p>
        <ul className="text-sm text-blue-700 space-y-1 mr-4 list-disc">
          <li><strong>أساسي:</strong> كلمات وجمل بسيطة</li>
          <li><strong>متوسط:</strong> محادثات يومية وكتابة بسيطة</li>
          <li><strong>احترافي:</strong> استخدام اللغة في بيئة العمل</li>
          <li><strong>طليق:</strong> تحدث وكتابة متقدمة</li>
          <li><strong>لغة أم:</strong> إتقان كامل للغة</li>
        </ul>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          <strong>مثال:</strong> العربية (لغة أم)، الإنجليزية (احترافي)، الفرنسية (متوسط)
        </p>
      </div>
    </div>
  );
}
