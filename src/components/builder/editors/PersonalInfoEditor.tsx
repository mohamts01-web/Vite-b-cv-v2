import { ResumeContent, PersonalInfo } from '../../../types/resume';
import { User, Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface PersonalInfoEditorProps {
  content: ResumeContent;
  onUpdate: (updates: Partial<ResumeContent>) => void;
}

export default function PersonalInfoEditor({ content, onUpdate }: PersonalInfoEditorProps) {
  const personalInfo = content.personalInfo || {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
  };

  const updateField = (field: keyof PersonalInfo, value: string) => {
    onUpdate({
      personalInfo: {
        ...personalInfo,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
          <User className="w-4 h-4" />
          الاسم الكامل *
        </label>
        <input
          type="text"
          value={personalInfo.fullName}
          onChange={(e) => updateField('fullName', e.target.value)}
          placeholder="أحمد محمد علي"
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          dir="rtl"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Mail className="w-4 h-4" />
            البريد الإلكتروني *
          </label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="ahmed@example.com"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            dir="ltr"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Phone className="w-4 h-4" />
            رقم الهاتف *
          </label>
          <input
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="+966 50 123 4567"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            dir="ltr"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
          <MapPin className="w-4 h-4" />
          الموقع
        </label>
        <input
          type="text"
          value={personalInfo.location}
          onChange={(e) => updateField('location', e.target.value)}
          placeholder="الرياض، المملكة العربية السعودية"
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          dir="rtl"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </label>
          <input
            type="url"
            value={personalInfo.linkedin || ''}
            onChange={(e) => updateField('linkedin', e.target.value)}
            placeholder="linkedin.com/in/yourprofile"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            dir="ltr"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Globe className="w-4 h-4" />
            الموقع الشخصي
          </label>
          <input
            type="url"
            value={personalInfo.website || ''}
            onChange={(e) => updateField('website', e.target.value)}
            placeholder="www.yourwebsite.com"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            dir="ltr"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <p className="text-sm text-blue-800">
          <strong>نصيحة:</strong> تأكد من أن معلومات الاتصال الخاصة بك دقيقة وحديثة. استخدم بريداً إلكترونياً احترافياً.
        </p>
      </div>
    </div>
  );
}
