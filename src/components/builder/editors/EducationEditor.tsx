import { ResumeContent, Education } from '../../../types/resume';
import { GraduationCap, Plus, Trash2, GripVertical } from 'lucide-react';
import { useState } from 'react';

interface EducationEditorProps {
  content: ResumeContent;
  onUpdate: (updates: Partial<ResumeContent>) => void;
}

export default function EducationEditor({ content, onUpdate }: EducationEditorProps) {
  const education = content.education || [];
  const [expandedId, setExpandedId] = useState<string | null>(education[0]?.id || null);

  const addEducation = () => {
    const newEducation: Education = {
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
    };

    onUpdate({
      education: [...education, newEducation],
    });
    setExpandedId(newEducation.id);
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    onUpdate({
      education: education.map(edu =>
        edu.id === id ? { ...edu, ...updates } : edu
      ),
    });
  };

  const removeEducation = (id: string) => {
    onUpdate({
      education: education.filter(edu => edu.id !== id),
    });
  };

  return (
    <div className="space-y-4">
      {education.map((edu) => (
        <div
          key={edu.id}
          className="border border-slate-200 rounded-lg overflow-hidden"
        >
          <div
            className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
            onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
          >
            <div className="flex items-center gap-3">
              <GripVertical className="w-5 h-5 text-slate-400" />
              <div>
                <h3 className="font-medium text-slate-900">
                  {edu.degree || 'درجة غير محددة'} {edu.field && `في ${edu.field}`}
                </h3>
                <p className="text-sm text-slate-600">
                  {edu.institution || 'مؤسسة غير محددة'}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeEducation(edu.id);
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {expandedId === edu.id && (
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  المؤسسة التعليمية *
                </label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                  placeholder="جامعة الملك سعود"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  dir="rtl"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    الدرجة العلمية *
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                    placeholder="بكالوريوس"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    التخصص *
                  </label>
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                    placeholder="علوم الحاسب"
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
                  value={edu.location}
                  onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                  placeholder="الرياض، السعودية"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  dir="rtl"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    تاريخ البداية
                  </label>
                  <input
                    type="text"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                    placeholder="2015"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    تاريخ التخرج
                  </label>
                  <input
                    type="text"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                    placeholder="2019"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    المعدل (اختياري)
                  </label>
                  <input
                    type="text"
                    value={edu.gpa || ''}
                    onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                    placeholder="4.5 من 5.0"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addEducation}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
      >
        <Plus className="w-5 h-5" />
        إضافة مؤهل تعليمي
      </button>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>نصيحة:</strong> رتب المؤهلات الأكاديمية من الأحدث إلى الأقدم. اذكر المعدل فقط إذا كان مرتفعاً (3.5+ من 5.0 أو ما يعادله).
        </p>
      </div>
    </div>
  );
}
