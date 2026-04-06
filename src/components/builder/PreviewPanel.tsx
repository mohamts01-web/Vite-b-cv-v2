import { ResumeContent } from '../../types/resume';
import { Mail, Phone, MapPin, Linkedin, Globe, Briefcase, GraduationCap, Award, AlertCircle, CheckCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface PreviewPanelProps {
  content: ResumeContent;
  language: 'ar' | 'en';
  font: string;
}

export default function PreviewPanel({ content, language, font }: PreviewPanelProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [pageStatus, setPageStatus] = useState<'fits' | 'exceeds'>('fits');
  const [scale, setScale] = useState(1);

  useEffect(() => {
    checkPageFit();
  }, [content]);

  const checkPageFit = () => {
    if (!previewRef.current) return;

    const a4HeightPx = 1122;
    const contentHeight = previewRef.current.scrollHeight;

    if (contentHeight > a4HeightPx) {
      setPageStatus('exceeds');
    } else {
      setPageStatus('fits');
    }
  };

  const personalInfo = content.personalInfo;
  const summary = content.summary;
  const experience = content.experience || [];
  const education = content.education || [];
  const skills = content.skills || [];
  const languages = content.languages || [];
  const extras = content.extras || [];

  return (
    <div className="hidden lg:flex lg:w-1/2 bg-slate-100 overflow-y-auto p-6">
      <div className="w-full max-w-3xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">معاينة مباشرة</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setScale(Math.max(0.5, scale - 0.1))}
              className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-sm hover:bg-slate-50"
            >
              -
            </button>
            <span className="text-sm font-medium">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale(Math.min(1.5, scale + 0.1))}
              className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-sm hover:bg-slate-50"
            >
              +
            </button>
            {pageStatus === 'fits' ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>ملائم لصفحة واحدة</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>يتجاوز صفحة واحدة</span>
              </div>
            )}
          </div>
        </div>

        <div
          ref={previewRef}
          className="bg-white shadow-2xl rounded-lg overflow-hidden"
          style={{
            width: '794px',
            minHeight: '1122px',
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            fontFamily: font,
          }}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          <div className="p-12">
            {personalInfo && (
              <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                  {personalInfo.fullName || 'الاسم الكامل'}
                </h1>
                <div className="flex items-center justify-center gap-4 text-sm text-slate-600 flex-wrap">
                  {personalInfo.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>{personalInfo.email}</span>
                    </div>
                  )}
                  {personalInfo.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <span>{personalInfo.phone}</span>
                    </div>
                  )}
                  {personalInfo.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{personalInfo.location}</span>
                    </div>
                  )}
                </div>
                {(personalInfo.linkedin || personalInfo.website) && (
                  <div className="flex items-center justify-center gap-4 text-sm text-blue-600 mt-2">
                    {personalInfo.linkedin && (
                      <div className="flex items-center gap-1">
                        <Linkedin className="w-4 h-4" />
                        <span>{personalInfo.linkedin}</span>
                      </div>
                    )}
                    {personalInfo.website && (
                      <div className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        <span>{personalInfo.website}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {summary?.content && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 border-b-2 border-blue-600 pb-2 mb-3">
                  الملخص المهني
                </h2>
                <p className="text-slate-700 leading-relaxed">{summary.content}</p>
              </div>
            )}

            {experience.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 border-b-2 border-blue-600 pb-2 mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  الخبرة العملية
                </h2>
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h3 className="font-bold text-slate-900">{exp.position}</h3>
                          <p className="text-slate-700">{exp.company} {exp.location && `• ${exp.location}`}</p>
                        </div>
                        <p className="text-sm text-slate-600 whitespace-nowrap">
                          {exp.startDate} - {exp.isCurrent ? 'حتى الآن' : exp.endDate}
                        </p>
                      </div>
                      {exp.description && (
                        <p className="text-slate-600 text-sm mb-2">{exp.description}</p>
                      )}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul className="list-disc mr-5 space-y-1 text-sm text-slate-700">
                          {exp.achievements.map((achievement, idx) => (
                            <li key={idx}>{achievement}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {education.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 border-b-2 border-blue-600 pb-2 mb-3 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  التعليم
                </h2>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900">{edu.degree} في {edu.field}</h3>
                        <p className="text-slate-700">{edu.institution} {edu.location && `• ${edu.location}`}</p>
                        {edu.gpa && <p className="text-sm text-slate-600">المعدل: {edu.gpa}</p>}
                      </div>
                      <p className="text-sm text-slate-600 whitespace-nowrap">
                        {edu.startDate} - {edu.endDate}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {skills.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 border-b-2 border-blue-600 pb-2 mb-3">
                  المهارات
                </h2>
                <div className="space-y-2">
                  {Object.entries(
                    skills.reduce((acc, skill) => {
                      const cat = skill.category || 'أخرى';
                      if (!acc[cat]) acc[cat] = [];
                      acc[cat].push(skill.name);
                      return acc;
                    }, {} as Record<string, string[]>)
                  ).map(([category, skillNames]) => (
                    <div key={category}>
                      <span className="font-semibold text-slate-900">{category}: </span>
                      <span className="text-slate-700">{skillNames.join(' • ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {languages.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 border-b-2 border-blue-600 pb-2 mb-3">
                  اللغات
                </h2>
                <div className="flex flex-wrap gap-3">
                  {languages.map((lang) => (
                    <div key={lang.id} className="text-slate-700">
                      <span className="font-semibold">{lang.language}</span>
                      <span className="text-slate-600"> ({lang.proficiency})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {extras.length > 0 && (
              <div className="space-y-4">
                {extras.filter(e => e.type === 'certificates').length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 border-b-2 border-blue-600 pb-2 mb-3">
                      الشهادات
                    </h2>
                    <ul className="space-y-2">
                      {extras.filter(e => e.type === 'certificates').map((cert) => (
                        <li key={cert.id} className="text-slate-700">
                          <span className="font-semibold">{cert.title}</span>
                          {cert.organization && <span> - {cert.organization}</span>}
                          {cert.date && <span className="text-slate-600"> ({cert.date})</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {extras.filter(e => e.type === 'awards').length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 border-b-2 border-blue-600 pb-2 mb-3">
                      الجوائز
                    </h2>
                    <ul className="space-y-2">
                      {extras.filter(e => e.type === 'awards').map((award) => (
                        <li key={award.id} className="text-slate-700">
                          <span className="font-semibold">{award.title}</span>
                          {award.organization && <span> - {award.organization}</span>}
                          {award.date && <span className="text-slate-600"> ({award.date})</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
