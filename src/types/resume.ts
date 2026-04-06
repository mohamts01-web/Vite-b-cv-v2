export interface Resume {
  id: string;
  user_id: string;
  title?: string;
  template_id?: string;
  content: ResumeContent;
  font?: string;
  language?: 'ar' | 'en';
  created_at?: string;
  updated_at?: string;
}

export interface ResumeContent {
  personalInfo?: PersonalInfo;
  summary?: Summary;
  experience?: Experience[];
  education?: Education[];
  skills?: Skill[];
  languages?: Language[];
  extras?: Extra[];
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  photoUrl?: string;
}

export interface Summary {
  content: string;
  aiOptimized?: boolean;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Skill {
  id: string;
  category: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Language {
  id: string;
  language: string;
  proficiency: 'native' | 'fluent' | 'professional' | 'intermediate' | 'basic';
}

export interface Extra {
  id: string;
  type: 'certificates' | 'volunteer' | 'publications' | 'awards' | 'hobbies';
  title: string;
  organization?: string;
  date?: string;
  description?: string;
}

export type EditorStep =
  | 'personal-info'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'extras';

export interface ATSScore {
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}
