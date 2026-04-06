import { EditorStep, ResumeContent } from '../../types/resume';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import PersonalInfoEditor from './editors/PersonalInfoEditor';
import SummaryEditor from './editors/SummaryEditor';
import ExperienceEditor from './editors/ExperienceEditor';
import EducationEditor from './editors/EducationEditor';
import SkillsEditor from './editors/SkillsEditor';
import LanguagesEditor from './editors/LanguagesEditor';
import ExtrasEditor from './editors/ExtrasEditor';

interface EditorPanelProps {
  currentStep: EditorStep;
  steps: { id: EditorStep; label: string; labelEn: string }[];
  content: ResumeContent;
  onUpdateContent: (updates: Partial<ResumeContent>) => void;
  onStepChange: (step: EditorStep) => void;
}

export default function EditorPanel({
  currentStep,
  steps,
  content,
  onUpdateContent,
  onStepChange,
}: EditorPanelProps) {
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const canGoPrevious = currentStepIndex > 0;
  const canGoNext = currentStepIndex < steps.length - 1;

  const handlePrevious = () => {
    if (canGoPrevious) {
      onStepChange(steps[currentStepIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onStepChange(steps[currentStepIndex + 1].id);
    }
  };

  return (
    <div className="w-full lg:w-1/2 border-l border-slate-200 bg-white overflow-y-auto">
      <div className="p-6">
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => onStepChange(step.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentStep === step.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                    : index < currentStepIndex
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {steps[currentStepIndex].label}
          </h2>
          <p className="text-slate-600">
            الخطوة {currentStepIndex + 1} من {steps.length}
          </p>
        </div>

        <div className="mb-6">
          {currentStep === 'personal-info' && (
            <PersonalInfoEditor content={content} onUpdate={onUpdateContent} />
          )}
          {currentStep === 'summary' && (
            <SummaryEditor content={content} onUpdate={onUpdateContent} />
          )}
          {currentStep === 'experience' && (
            <ExperienceEditor content={content} onUpdate={onUpdateContent} />
          )}
          {currentStep === 'education' && (
            <EducationEditor content={content} onUpdate={onUpdateContent} />
          )}
          {currentStep === 'skills' && (
            <SkillsEditor content={content} onUpdate={onUpdateContent} />
          )}
          {currentStep === 'languages' && (
            <LanguagesEditor content={content} onUpdate={onUpdateContent} />
          )}
          {currentStep === 'extras' && (
            <ExtrasEditor content={content} onUpdate={onUpdateContent} />
          )}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <button
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              canGoPrevious
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'bg-slate-50 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
            السابق
          </button>

          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              canGoNext
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md'
                : 'bg-slate-50 text-slate-400 cursor-not-allowed'
            }`}
          >
            التالي
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
