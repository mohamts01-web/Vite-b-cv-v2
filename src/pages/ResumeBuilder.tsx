import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, Download, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { EditorStep, Resume, ResumeContent } from '../types/resume';
import { supabase } from '../lib/supabase';
import EditorPanel from '../components/builder/EditorPanel';
import PreviewPanel from '../components/builder/PreviewPanel';
import AISidebar from '../components/builder/AISidebar';
import ProgressBar from '../components/builder/ProgressBar';

interface ResumeBuilderProps {
  onNavigate: (page: string) => void;
}

const STEPS: { id: EditorStep; label: string; labelEn: string }[] = [
  { id: 'personal-info', label: 'المعلومات الشخصية', labelEn: 'Personal Info' },
  { id: 'summary', label: 'الملخص المهني', labelEn: 'Professional Summary' },
  { id: 'experience', label: 'الخبرة العملية', labelEn: 'Experience' },
  { id: 'education', label: 'التعليم', labelEn: 'Education' },
  { id: 'skills', label: 'المهارات', labelEn: 'Skills' },
  { id: 'languages', label: 'اللغات', labelEn: 'Languages' },
  { id: 'extras', label: 'أقسام إضافية', labelEn: 'Additional Sections' },
];

export default function ResumeBuilder({ onNavigate }: ResumeBuilderProps) {
  const [currentStep, setCurrentStep] = useState<EditorStep>('personal-info');
  const [resume, setResume] = useState<Resume | null>(null);
  const [content, setContent] = useState<ResumeContent>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showAI, setShowAI] = useState(false);
  const [completionScore, setCompletionScore] = useState(0);
  const [atsScore, setATSScore] = useState(0);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    loadOrCreateResume();
  }, []);

  useEffect(() => {
    if (resume) {
      calculateCompletionScore();
      calculateATSScore();
    }
  }, [content]);

  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    if (resume && Object.keys(content).length > 0) {
      saveTimeoutRef.current = setTimeout(() => {
        autoSave();
      }, 3000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content]);

  const loadOrCreateResume = async () => {
    try {
      const { data: resumes, error } = await supabase
        .from('resumes')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (resumes) {
        setResume(resumes);
        setContent(resumes.content || {});
      } else {
        const newResume = {
          title: 'سيرة ذاتية جديدة',
          template_id: 'modern',
          content: {},
          font: 'IBM Plex Arabic',
          language: 'ar' as const,
        };

        const { data, error: createError } = await supabase
          .from('resumes')
          .insert([newResume])
          .select()
          .single();

        if (createError) throw createError;
        setResume(data);
        setContent({});
      }
    } catch (error) {
      console.error('Error loading resume:', error);
    }
  };

  const autoSave = async () => {
    if (!resume) return;

    setSaveStatus('saving');
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('resumes')
        .update({
          content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', resume.id);

      if (error) throw error;

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving resume:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const calculateCompletionScore = () => {
    let score = 0;
    const weights = {
      personalInfo: 20,
      summary: 15,
      experience: 25,
      education: 20,
      skills: 10,
      languages: 5,
      extras: 5,
    };

    if (content.personalInfo?.fullName && content.personalInfo?.email) {
      score += weights.personalInfo;
    }
    if (content.summary?.content && content.summary.content.length > 50) {
      score += weights.summary;
    }
    if (content.experience && content.experience.length > 0) {
      score += weights.experience;
    }
    if (content.education && content.education.length > 0) {
      score += weights.education;
    }
    if (content.skills && content.skills.length >= 3) {
      score += weights.skills;
    }
    if (content.languages && content.languages.length > 0) {
      score += weights.languages;
    }
    if (content.extras && content.extras.length > 0) {
      score += weights.extras;
    }

    setCompletionScore(Math.min(100, score));
  };

  const calculateATSScore = () => {
    let score = 0;

    if (content.personalInfo?.email?.includes('@')) score += 10;
    if (content.personalInfo?.phone) score += 10;
    if (content.summary?.content && content.summary.content.length >= 100) score += 15;
    if (content.experience && content.experience.length > 0) {
      score += 20;
      const hasAchievements = content.experience.some(exp => exp.achievements?.length > 0);
      if (hasAchievements) score += 10;
    }
    if (content.education && content.education.length > 0) score += 15;
    if (content.skills && content.skills.length >= 5) score += 10;
    if (content.skills && content.skills.length >= 10) score += 5;
    if (content.languages && content.languages.length >= 2) score += 5;

    setATSScore(Math.min(100, score));
  };

  const updateContent = (updates: Partial<ResumeContent>) => {
    setContent(prev => ({ ...prev, ...updates }));
  };

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col" dir="rtl">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('home')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-slate-900">منشئ السيرة الذاتية</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3">
                <div className="text-sm">
                  <span className="text-slate-500">الاكتمال:</span>
                  <span className="font-bold text-blue-600 mr-2">{completionScore}%</span>
                </div>
                <div className="text-sm">
                  <span className="text-slate-500">ATS:</span>
                  <span className="font-bold text-green-600 mr-2">{atsScore}%</span>
                </div>
              </div>

              {saveStatus === 'saving' && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  <span>جاري الحفظ...</span>
                </div>
              )}
              {saveStatus === 'saved' && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>تم الحفظ</span>
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>خطأ في الحفظ</span>
                </div>
              )}

              <button
                onClick={() => setShowAI(!showAI)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  showAI
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">مساعد AI</span>
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">تنزيل PDF</span>
              </button>
            </div>
          </div>
        </div>
        <ProgressBar progress={progress} />
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className={`flex-1 flex ${showAI ? 'lg:mr-96' : ''}`}>
          <EditorPanel
            currentStep={currentStep}
            steps={STEPS}
            content={content}
            onUpdateContent={updateContent}
            onStepChange={setCurrentStep}
          />

          <PreviewPanel
            content={content}
            language={resume?.language || 'ar'}
            font={resume?.font || 'IBM Plex Arabic'}
          />
        </div>

        {showAI && (
          <AISidebar
            currentStep={currentStep}
            content={content}
            onClose={() => setShowAI(false)}
          />
        )}
      </div>
    </div>
  );
}
