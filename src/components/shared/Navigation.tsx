import { FileText, Image, Award, Menu, X, Coins } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCurrentUserProfile } from '../../services/creditService';

interface NavigationProps {
  currentModule: 'resume' | 'social' | 'certificates' | 'home';
  onNavigate: (module: 'resume' | 'social' | 'certificates' | 'home' | string) => void;
}

export default function Navigation({ currentModule, onNavigate }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    loadUserCredits();
  }, []);

  async function loadUserCredits() {
    try {
      const profile = await getCurrentUserProfile();
      if (profile) {
        setCredits(profile.credits_balance);
      }
    } catch (error) {
      console.error('Error loading credits:', error);
    }
  }

  const modules = [
    { id: 'resume' as const, label: 'السيرة الذاتية', icon: FileText },
    { id: 'social' as const, label: 'منشورات التواصل', icon: Image },
    { id: 'certificates' as const, label: 'الشهادات', icon: Award },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-lg shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                CvSira
              </h1>
            </button>

            <nav className="hidden md:flex items-center gap-2">
              {modules.map((module) => {
                const Icon = module.icon;
                const isActive = currentModule === module.id;
                return (
                  <button
                    key={module.id}
                    onClick={() => onNavigate(module.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{module.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('pricing')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
            >
              <Coins className="w-4 h-4" />
              <span>{credits} Credits</span>
            </button>

            <button className="md:hidden p-2 rounded-lg hover:bg-slate-100" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-slate-200">
            <div className="space-y-2">
              {modules.map((module) => {
                const Icon = module.icon;
                const isActive = currentModule === module.id;
                return (
                  <button
                    key={module.id}
                    onClick={() => {
                      onNavigate(module.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{module.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
