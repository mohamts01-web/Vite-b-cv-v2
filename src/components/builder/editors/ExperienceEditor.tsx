import { ResumeContent, Experience } from '../../../types/resume';
import { Briefcase, Plus, Trash2, GripVertical } from 'lucide-react';
import { useState } from 'react';

interface ExperienceEditorProps {
  content: ResumeContent;
  onUpdate: (updates: Partial<ResumeContent>) => void;
}

export default function ExperienceEditor({ content, onUpdate }: ExperienceEditorProps) {
  const experiences = content.experience || [];
  const [expandedId, setExpandedId] = useState<string | null>(experiences[0]?.id || null);

  const addExperience = () => {
    const newExperience: Experience = {
      id: crypto.randomUUID(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      achievements: [],
    };

    onUpdate({
      experience: [...experiences, newExperience],
    });
    setExpandedId(newExperience.id);
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    onUpdate({
      experience: experiences.map(exp =>
        exp.id === id ? { ...exp, ...updates } : exp
      ),
    });
  };

  const removeExperience = (id: string) => {
    onUpdate({
      experience: experiences.filter(exp => exp.id !== id),
    });
  };

  const addAchievement = (id: string) => {
    const exp = experiences.find(e => e.id === id);
    if (exp) {
      updateExperience(id, {
        achievements: [...(exp.achievements || []), ''],
      });
    }
  };

  const updateAchievement = (expId: string, index: number, value: string) => {
    const exp = experiences.find(e => e.id === expId);
    if (exp) {
      const newAchievements = [...(exp.achievements || [])];
      newAchievements[index] = value;
      updateExperience(expId, { achievements: newAchievements });
    }
  };

  const removeAchievement = (expId: string, index: number) => {
    const exp = experiences.find(e => e.id === expId);
    if (exp) {
      updateExperience(expId, {
        achievements: exp.achievements.filter((_, i) => i !== index),
      });
    }
  };

  return (
    <div className="space-y-4">
      {experiences.map((exp, index) => (
        <div
          key={exp.id}
          className="border border-slate-200 rounded-lg overflow-hidden"
        >
          <div
            className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
            onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
          >
            <div className="flex items-center gap-3">
              <GripVertical className="w-5 h-5 text-slate-400" />
              <div>
                <h3 className="font-medium text-slate-900">
                  {exp.position || 'منصب غير محدد'} {exp.company && `- ${exp.company}`}
                </h3>
                <p className="text-sm text-slate-600">
                  {exp.startDate} {exp.endDate && `- ${exp.endDate}`}
                  {exp.isCurrent && '- حتى الآن'}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeExperience(exp.id);
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {expandedId === exp.id && (
            <div className="p-4 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    المسمى الوظيفي *
                  </label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                    placeholder="مهندس برمجيات"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    اسم الشركة *
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                    placeholder="شركة التقنية المتقدمة"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir="rtl"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  الموقع
                </label>
                <input
                  type="text"
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                  placeholder="الرياض، السعودية"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  dir="rtl"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    تاريخ البداية *
                  </label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                    placeholder="يناير 2020"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    تاريخ النهاية
                  </label>
                  <input
                    type="text"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                    placeholder="ديسمبر 2022"
                    disabled={exp.isCurrent}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100"
                    dir="rtl"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={exp.isCurrent}
                    onChange={(e) => updateExperience(exp.id, { isCurrent: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  أعمل حالياً في هذا المنصب
                </label>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  الوصف
                </label>
                <textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                  placeholder="وصف موجز للمسؤوليات..."
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  dir="rtl"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">
                    الإنجازات (يُفضل 2-3 إنجازات قابلة للقياس)
                  </label>
                  <button
                    onClick={() => addAchievement(exp.id)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + إضافة إنجاز
                  </button>
                </div>
                <div className="space-y-2">
                  {exp.achievements.map((achievement, achIndex) => (
                    <div key={achIndex} className="flex items-start gap-2">
                      <input
                        type="text"
                        value={achievement}
                        onChange={(e) => updateAchievement(exp.id, achIndex, e.target.value)}
                        placeholder="مثال: زيادة الإنتاجية بنسبة 30% من خلال..."
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        dir="rtl"
                      />
                      <button
                        onClick={() => removeAchievement(exp.id, achIndex)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addExperience}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
      >
        <Plus className="w-5 h-5" />
        إضافة خبرة عملية
      </button>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>نصيحة:</strong> ركز على الإنجازات القابلة للقياس (أرقام، نسب مئوية) بدلاً من المسؤوليات فقط. مثال: "زيادة المبيعات بنسبة 25%" أفضل من "كنت مسؤولاً عن المبيعات".
        </p>
      </div>
    </div>
  );
}
