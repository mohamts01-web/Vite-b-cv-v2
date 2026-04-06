import { ResumeContent, Skill } from '../../../types/resume';
import { Plus, Trash2, Tag } from 'lucide-react';

interface SkillsEditorProps {
  content: ResumeContent;
  onUpdate: (updates: Partial<ResumeContent>) => void;
}

const SKILL_LEVELS = [
  { value: 'beginner', label: 'مبتدئ' },
  { value: 'intermediate', label: 'متوسط' },
  { value: 'advanced', label: 'متقدم' },
  { value: 'expert', label: 'خبير' },
];

export default function SkillsEditor({ content, onUpdate }: SkillsEditorProps) {
  const skills = content.skills || [];

  const addSkill = () => {
    const newSkill: Skill = {
      id: crypto.randomUUID(),
      category: '',
      name: '',
      level: 'intermediate',
    };

    onUpdate({
      skills: [...skills, newSkill],
    });
  };

  const updateSkill = (id: string, updates: Partial<Skill>) => {
    onUpdate({
      skills: skills.map(skill =>
        skill.id === id ? { ...skill, ...updates } : skill
      ),
    });
  };

  const removeSkill = (id: string) => {
    onUpdate({
      skills: skills.filter(skill => skill.id !== id),
    });
  };

  const categories = [...new Set(skills.map(s => s.category).filter(Boolean))];

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
          >
            <div className="flex-1 grid md:grid-cols-3 gap-3">
              <div>
                <input
                  type="text"
                  value={skill.category}
                  onChange={(e) => updateSkill(skill.id, { category: e.target.value })}
                  placeholder="التصنيف (مثل: برمجة)"
                  list="skill-categories"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  dir="rtl"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                  placeholder="اسم المهارة *"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  dir="rtl"
                />
              </div>
              <div>
                <select
                  value={skill.level}
                  onChange={(e) => updateSkill(skill.id, { level: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  dir="rtl"
                >
                  {SKILL_LEVELS.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={() => removeSkill(skill.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <datalist id="skill-categories">
        {categories.map(cat => (
          <option key={cat} value={cat} />
        ))}
      </datalist>

      <button
        onClick={addSkill}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
      >
        <Plus className="w-5 h-5" />
        إضافة مهارة
      </button>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800 mb-2">
          <strong>نصائح لإضافة المهارات:</strong>
        </p>
        <ul className="text-sm text-blue-700 space-y-1 mr-4 list-disc">
          <li>صنف مهاراتك إلى فئات (تقنية، لغوية، إدارية، إلخ)</li>
          <li>ركز على المهارات ذات الصلة بالوظيفة المستهدفة</li>
          <li>كن صادقاً في تقييم مستوى إتقانك</li>
          <li>أضف 5-15 مهارة رئيسية</li>
        </ul>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            <strong>مهارات تقنية:</strong> React, Python, SQL, AWS, Docker
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-800">
            <strong>مهارات ناعمة:</strong> التواصل، العمل الجماعي، القيادة
          </p>
        </div>
      </div>
    </div>
  );
}
