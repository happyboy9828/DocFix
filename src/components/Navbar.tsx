import React from 'react';
import {
  ShieldCheck,
  FileCheck,
  Layers,
  FolderArchive,
  BookOpen,
  Wrench,
  HelpCircle,
  MessageSquarePlus,
  Crown
} from 'lucide-react';
import { UsageState } from '../utils/limitEngine';

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
  onOpenFeedback: () => void;
  usage: UsageState;
  onOpenPremium: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenFeedback,
  usage,
  onOpenPremium
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('resizer')}>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm ring-2 ring-emerald-600/20">
              <FileCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">DocFix</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  Govt Job 300KB
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                FPSC · PPSC · NTS · NJP · 200 DPI Auto-Engine
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('resizer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'resizer'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Resizer</span>
            </button>

            <button
              onClick={() => setActiveTab('cnic')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'cnic'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>CNIC Combiner</span>
            </button>

            <button
              onClick={() => setActiveTab('bundle')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'bundle'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderArchive className="w-4 h-4 text-emerald-600" />
              <span>Job Bundle</span>
            </button>

            <button
              onClick={() => setActiveTab('diagnostic')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'diagnostic'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wrench className="w-4 h-4 text-emerald-600" />
              <span>Fix Rejection</span>
            </button>

            <button
              onClick={() => setActiveTab('directory')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'directory'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Portal Specs</span>
            </button>

            <button
              onClick={() => setActiveTab('faq')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'faq'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>FAQs</span>
            </button>
          </nav>

          {/* Right Action: Daily Limit Indicator & Buy Premium Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Daily limit badge */}
            {usage.isPremium ? (
              <button
                type="button"
                onClick={onOpenPremium}
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-1.5 rounded-lg shadow-xs"
              >
                <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>DocFix Pro</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenPremium}
                className="flex items-center gap-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2 sm:px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                title="Daily Free Limit: 3 conversions per day (No login/signup)"
              >
                <span className="hidden md:inline text-slate-500">Free Daily:</span>
                <strong className={`font-mono ${usage.count >= usage.maxDaily ? 'text-red-600' : 'text-emerald-700'}`}>
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
            {/* Request Portal Button */}
            <button
              onClick={onOpenFeedback}
              className="hidden md:flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
              title="Request a Government Portal Preset"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Request Portal</span>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet scrollable navigation */}
        <div className="lg:hidden flex items-center overflow-x-auto py-2 border-t border-slate-100 gap-1.5 text-xs scrollbar-none">
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
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
