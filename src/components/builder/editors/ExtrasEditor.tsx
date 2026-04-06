import { ResumeContent, Extra } from '../../../types/resume';
import { Plus, Trash2, Award, Heart, FileText, Trophy, Smile } from 'lucide-react';
import { useState } from 'react';

interface ExtrasEditorProps {
  content: ResumeContent;
  onUpdate: (updates: Partial<ResumeContent>) => void;
}

const EXTRA_TYPES = [
  { value: 'certificates', label: 'شهادات', icon: Award },
  { value: 'volunteer', label: 'تطوع', icon: Heart },
  { value: 'publications', label: 'منشورات', icon: FileText },
  { value: 'awards', label: 'جوائز', icon: Trophy },
  { value: 'hobbies', label: 'هوايات', icon: Smile },
];

export default function ExtrasEditor({ content, onUpdate }: ExtrasEditorProps) {
  const extras = content.extras || [];
  const [expandedId, setExpandedId] = useState<string | null>(extras[0]?.id || null);

  const addExtra = (type: Extra['type']) => {
    const newExtra: Extra = {
      id: crypto.randomUUID(),
      type,
      title: '',
      organization: '',
      date: '',
      description: '',
    };

    onUpdate({
      extras: [...extras, newExtra],
    });
    setExpandedId(newExtra.id);
  };

  const updateExtra = (id: string, updates: Partial<Extra>) => {
    onUpdate({
      extras: extras.map(extra =>
        extra.id === id ? { ...extra, ...updates } : extra
      ),
    });
  };

  const removeExtra = (id: string) => {
    onUpdate({
      extras: extras.filter(extra => extra.id !== id),
    });
  };

  const getTypeLabel = (type: Extra['type']) => {
    return EXTRA_TYPES.find(t => t.value === type)?.label || type;
  };

  const getTypeIcon = (type: Extra['type']) => {
    const TypeIcon = EXTRA_TYPES.find(t => t.value === type)?.icon || Award;
    return TypeIcon;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {extras.map((extra) => {
          const Icon = getTypeIcon(extra.type);
          return (
            <div
              key={extra.id}
              className="border border-slate-200 rounded-lg overflow-hidden"
            >
              <div
                className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => setExpandedId(expandedId === extra.id ? null : extra.id)}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-slate-400" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {getTypeLabel(extra.type)}
                      </span>
                    </div>
                    <h3 className="font-medium text-slate-900 mt-1">
                      {extra.title || 'بدون عنوان'}
                    </h3>
                    {extra.organization && (
                      <p className="text-sm text-slate-600">{extra.organization}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeExtra(extra.id);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {expandedId === extra.id && (
                <div className="p-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      العنوان *
                    </label>
                    <input
                      type="text"
                      value={extra.title}
                      onChange={(e) => updateExtra(extra.id, { title: e.target.value })}
                      placeholder={
                        extra.type === 'certificates'
                          ? 'اسم الشهادة'
                          : extra.type === 'volunteer'
                          ? 'اسم المبادرة التطوعية'
                          : extra.type === 'publications'
                          ? 'عنوان المنشور'
                          : extra.type === 'awards'
                          ? 'اسم الجائزة'
                          : 'الهواية'
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      dir="rtl"
                    />
                  </div>

                  {extra.type !== 'hobbies' && (
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        {extra.type === 'certificates' ? 'الجهة المانحة' : 'المنظمة'}
                      </label>
                      <input
                        type="text"
                        value={extra.organization || ''}
                        onChange={(e) => updateExtra(extra.id, { organization: e.target.value })}
                        placeholder="اسم المنظمة"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        dir="rtl"
                      />
                    </div>
                  )}

                  {extra.type !== 'hobbies' && (
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        التاريخ
                      </label>
                      <input
                        type="text"
                        value={extra.date || ''}
                        onChange={(e) => updateExtra(extra.id, { date: e.target.value })}
                        placeholder="2023"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        dir="rtl"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      الوصف
                    </label>
                    <textarea
                      value={extra.description || ''}
                      onChange={(e) => updateExtra(extra.id, { description: e.target.value })}
                      placeholder="وصف موجز..."
                      rows={3}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      dir="rtl"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {EXTRA_TYPES.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => addExtra(value as Extra['type'])}
            className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800 mb-2">
          <strong>نصائح للأقسام الإضافية:</strong>
        </p>
        <ul className="text-sm text-blue-700 space-y-1 mr-4 list-disc">
          <li><strong>الشهادات:</strong> أضف الشهادات المهنية والتقنية ذات الصلة</li>
          <li><strong>التطوع:</strong> يُظهر التزامك الاجتماعي ومهاراتك القيادية</li>
          <li><strong>المنشورات:</strong> أبحاث، مقالات، أو محتوى منشور</li>
          <li><strong>الجوائز:</strong> تقديرات وجوائز حصلت عليها</li>
          <li><strong>الهوايات:</strong> أضفها فقط إذا كانت ذات صلة بالوظيفة</li>
        </ul>
      </div>
    </div>
  );
}
