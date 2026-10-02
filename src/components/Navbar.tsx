import React from 'react';
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
  Monitor
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
  onCycleTheme: () => void;
}

const THEME_META: Record<
  ThemePreference,
  { label: string; Icon: typeof Sun; hint: string }
> = {
  light: { label: 'Light', Icon: Sun, hint: 'Switch to dark theme' },
  dark: { label: 'Dark', Icon: Moon, hint: 'Follow system theme' },
  system: { label: 'System', Icon: Monitor, hint: 'Switch to light theme' }
};

const ThemeToggle: React.FC<{
  preference: ThemePreference;
  onCycle: () => void;
}> = ({ preference, onCycle }) => {
  const { label, Icon, hint } = THEME_META[preference];
  return (
    <button
      type="button"
      onClick={onCycle}
      className="flex items-center gap-1.5 text-xs font-medium px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
      title={hint}
      aria-label={`Theme: ${label}. ${hint}`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="hidden xl:inline">{label}</span>
    </button>
  );
};

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  usage,
  onOpenPremium,
  themePreference,
  onCycleTheme
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
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                  Govt Job 300KB
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                FPSC Â· PPSC Â· NTS Â· NJP Â· 200 DPI Auto-Engine
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
            {/* Appearance toggle: light -> dark -> system */}
            <ThemeToggle preference={themePreference} onCycle={onCycleTheme} />

            {/* Daily limit badge */}
            {usage.isPremium ? (
              <button
                type="button"
                onClick={onOpenPremium}
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-900 border border-amber-300 dark:border-amber-700 px-2.5 py-1.5 rounded-lg shadow-xs"
              >
                <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>DocFix Pro</span>
              </button>
            ) : (
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

            {/* Buy Premium Button */}
            <button
              type="button"
              onClick={onOpenPremium}
              className="flex items-center gap-1.5 text-xs font-extrabold px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 shadow-sm transition-all cursor-pointer ring-1 ring-amber-400"
            >
              <Crown className="w-3.5 h-3.5 fill-slate-950" />
              <span>{usage.isPremium ? 'Premium Active' : 'Buy Premium'}</span>
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
