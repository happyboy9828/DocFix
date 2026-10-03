import React, { useEffect, useRef, useState } from 'react';
import {
  FileCheck,
  Layers,
  FolderArchive,
  BookOpen,
  Wrench,
  HelpCircle,
  Crown,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  Check
} from 'lucide-react';
import { UsageState } from '../utils/limitEngine';
import { ThemePreference } from '../utils/theme';

export type AppTab =
  | 'resizer'
  | 'cnic'
  | 'bundle'
  | 'diagnostic'
  | 'directory'
  | 'guidelines'
  | 'faq'
  | 'privacy'
  | 'terms'
  | 'disclaimer'
  | 'about'
  | 'contact';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  usage: UsageState;
  onOpenPremium: () => void;
  themePreference: ThemePreference;
  onThemeChange: (preference: ThemePreference) => void;
}

const THEME_OPTIONS: ThemePreference[] = ['light', 'dark', 'system'];

const THEME_META: Record<
  ThemePreference,
  { label: string; Icon: typeof Sun; hint: string }
> = {
  light: { label: 'Light', Icon: Sun, hint: 'Always use the light theme' },
  dark: { label: 'Dark', Icon: Moon, hint: 'Always use the dark theme' },
  system: { label: 'System', Icon: Monitor, hint: 'Follow your device setting' }
};

const ThemeSelect: React.FC<{
  preference: ThemePreference;
  onChange: (preference: ThemePreference) => void;
}> = ({ preference, onChange }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { label, Icon, hint } = THEME_META[preference];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const choose = (next: ThemePreference) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 text-xs font-medium px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        title={hint}
        aria-label={`Theme: ${label}`}
      >
        <Icon className="w-4 h-4 shrink-0" />
        <span className="hidden xl:inline">{label}</span>
        <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Theme"
          className="absolute right-0 top-full mt-1.5 z-50 w-40 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden"
        >
          {THEME_OPTIONS.map((option) => {
            const optionMeta = THEME_META[option];
            const selected = option === preference;
            const OptionIcon = optionMeta.Icon;
            return (
              <li key={option} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => choose(option)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-left transition-colors cursor-pointer ${
                    selected
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <OptionIcon className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{optionMeta.label}</span>
                  {selected && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  usage,
  onOpenPremium,
  themePreference,
  onThemeChange
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('resizer')}>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm ring-2 ring-emerald-600/20">
              <FileCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">DocFix</span>
                
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                 Auto-Engine
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
            <button
              onClick={() => setActiveTab('resizer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'resizer'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Resizer</span>
            </button>

            <button
              onClick={() => setActiveTab('cnic')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'cnic'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>CNIC Combiner</span>
            </button>

            <button
              onClick={() => setActiveTab('bundle')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'bundle'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <FolderArchive className="w-4 h-4 text-emerald-600" />
              <span>Job Bundle</span>
            </button>

            <button
              onClick={() => setActiveTab('diagnostic')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'diagnostic'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Wrench className="w-4 h-4 text-emerald-600" />
              <span>Fix Rejection</span>
            </button>

            <button
              onClick={() => setActiveTab('directory')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'directory'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Portal Specs</span>
            </button>

            <button
              onClick={() => setActiveTab('faq')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'faq'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>FAQs</span>
            </button>
          </nav>

          {/* Right Action: Daily Limit Indicator & Buy Premium Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Appearance dropdown: light / dark / system */}
            <ThemeSelect preference={themePreference} onChange={onThemeChange} />

            {/* Daily limit badge (free tier only) */}
            {!usage.isPremium && (
              <button
                type="button"
                onClick={onOpenPremium}
                className="flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 px-2 sm:px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                title="Daily Free Limit: 3 conversions per day (No login/signup)"
              >
                <span className="hidden md:inline text-slate-500 dark:text-slate-400">Free Daily:</span>
                <strong className={`font-mono ${usage.count >= usage.maxDaily ? 'text-red-600 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-300'}`}>
                  {usage.remaining}/{usage.maxDaily} left
                </strong>
              </button>
            )}

            {/* Buy Premium / Pro status Button */}
            <button
              type="button"
              onClick={onOpenPremium}
              title={usage.isPremium ? 'You are a DocFix Pro user' : 'Unlock unlimited conversions'}
              className={`flex items-center gap-1.5 text-xs font-extrabold px-3 py-1.5 sm:py-2 rounded-xl shadow-sm transition-all cursor-pointer ${
                usage.isPremium
                  ? 'text-amber-900 dark:text-amber-100 bg-amber-100 dark:bg-amber-900 hover:bg-amber-200 dark:hover:bg-amber-800 ring-1 ring-amber-400'
                  : 'text-slate-950 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 ring-1 ring-amber-400'
              }`}
            >
              <Crown className={`w-3.5 h-3.5 ${usage.isPremium ? 'fill-amber-500 text-amber-600' : 'fill-slate-950'}`} />
              <span>{usage.isPremium ? 'Pro' : 'Buy Premium'}</span>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet scrollable navigation */}
        <div className="lg:hidden flex items-center overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800 gap-1.5 text-xs scrollbar-none">
          {[
            { id: 'resizer', label: 'Resizer' },
            { id: 'cnic', label: 'CNIC Combiner' },
            { id: 'bundle', label: 'Job Bundle' },
            { id: 'diagnostic', label: 'Fix Rejection' },
            { id: 'directory', label: 'Portal Specs' },
            { id: 'faq', label: 'FAQs' },
            { id: 'about', label: 'About' },
            { id: 'contact', label: 'Contact' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AppTab)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
