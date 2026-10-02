import React, { useState, useEffect } from 'react';
import { Navbar, AppTab } from './components/Navbar';
import { PortalSelector } from './components/PortalSelector';
import { SingleDocResizer } from './components/SingleDocResizer';
import { CnicCombiner } from './components/CnicCombiner';
import { JobBundlePack } from './components/JobBundlePack';
import { RejectionDiagnostic } from './components/RejectionDiagnostic';
import { PortalDirectory } from './components/PortalDirectory';
import { GuidelinesSection } from './components/GuidelinesSection';
import { FaqSection } from './components/FaqSection';
import { WhyDocFix } from './components/WhyDocFix';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { AdSlot } from './components/ads/AdSlot';
import { PremiumModal } from './components/PremiumModal';

import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { TermsOfService } from './components/legal/TermsOfService';
import { Disclaimer } from './components/legal/Disclaimer';
import { AboutUs } from './components/legal/AboutUs';
import { ContactUs } from './components/legal/ContactUs';

import { PORTAL_PRESETS } from '../server/data/portals';
import { PortalPreset } from './types/document';
import {
  getUsageState,
  recordConversion,
  UsageState
} from './utils/limitEngine';
import { useTheme } from './utils/useTheme';
import {
  CheckCircle2,
  TrendingUp,
  Clock,
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('resizer');
  const [portals, setPortals] = useState<PortalPreset[]>(PORTAL_PRESETS);
  const [selectedPortalId, setSelectedPortalId] = useState<string>('fpsc');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [premiumModalOpen, setPremiumModalOpen] = useState<boolean>(false);
  const [usage, setUsage] = useState<UsageState>(getUsageState());

  // Appearance: light / dark / system, persisted to localStorage
  const theme = useTheme();

  // Stats from backend
  const [stats, setStats] = useState({
    totalResized: 184520,
    acceptedRate: '99.8%',
    supportedPortals: 10
  });

  // URL query parameter support for direct crawlability (e.g. /?tab=privacy)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as AppTab | null;
    if (tabParam && [
      'resizer', 'cnic', 'bundle', 'diagnostic', 'directory', 'guidelines',
      'faq', 'privacy', 'terms', 'disclaimer', 'about', 'contact'
    ].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  // Sync tab change to URL history without reload
  const handleTabChange = (tab: AppTab) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    if (tab === 'resizer') {
      url.searchParams.delete('tab');
    } else {
      url.searchParams.set('tab', tab);
    }
    window.history.pushState({}, '', url.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch portals and stats from backend
  useEffect(() => {
    fetch('/api/portals')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.portals) {
          setPortals(data.portals);
        }
      })
      .catch(() => {});

    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats({
            totalResized: data.totalResized || 184520,
            acceptedRate: data.acceptedRate || '99.8%',
            supportedPortals: data.supportedPortals || 10
          });
        }
      })
      .catch(() => {});
  }, []);

  const currentPortal = portals.find((p) => p.id === selectedPortalId) || portals[0];

  const handleSelectPortal = (portal: PortalPreset | null) => {
    if (portal) {
      setSelectedPortalId(portal.id);
      setIsCustom(false);
    }
  };

  const handleApplyPresetFromDirectory = (portal: PortalPreset) => {
    setSelectedPortalId(portal.id);
    setIsCustom(false);
    handleTabChange('resizer');
  };

  // Daily conversion limit tracking: returns false if limit reached
  const handleConversionPerformed = (): boolean => {
    const state = getUsageState();
    if (!state.isPremium && state.count >= state.maxDaily) {
      return false;
    }
    const newUsage = recordConversion();
    setUsage(newUsage);
    return true;
  };

  const handleOpenPremium = () => {
    setPremiumModalOpen(true);
  };

  const handlePremiumStatusChange = () => {
    setUsage(getUsageState());
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        usage={usage}
        onOpenPremium={handleOpenPremium}
        themePreference={theme.preference}
        onCycleTheme={theme.cycle}
      />

      {/* Breadcrumb Navigation Bar (Required for AdSense UX & SEO Crawlability) */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
          <button onClick={() => handleTabChange('resizer')} className="hover:text-emerald-700 dark:hover:text-emerald-300">Home</button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
          <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
            {activeTab === 'resizer' && 'Document Resizer (300KB)'}
            {activeTab === 'cnic' && 'CNIC Front + Back Single Page Combiner'}
            {activeTab === 'bundle' && '1-Click Job Application Bundle Kit'}
            {activeTab === 'diagnostic' && 'Rejection Error Diagnostic & Fixer'}
            {activeTab === 'directory' && 'Public Service Commission Specs Guide'}
            {activeTab === 'guidelines' && 'Applicant Knowledge Base & Mobile Photo Tips'}
            {activeTab === 'faq' && 'Frequently Asked Questions'}
            {activeTab === 'privacy' && 'Privacy Policy'}
            {activeTab === 'terms' && 'Terms of Service'}
            {activeTab === 'disclaimer' && 'Government Non-Affiliation Disclaimer'}
            {activeTab === 'about' && 'About Us'}
            {activeTab === 'contact' && 'Contact Us'}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top IAB Compliant Leaderboard Ad Container */}
        <AdSlot format="leaderboard" />

        {/* HERO SECTION (Rendered on main tools tabs) */}
        {['resizer', 'cnic', 'bundle', 'diagnostic'].includes(activeTab) && (
          <section className="text-center max-w-3xl mx-auto space-y-4 pt-1">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="text-emerald-700 dark:text-emerald-300 font-bold">DocFix v2.4</span>
              <span aria-hidden="true">Â·</span>
              <span>Government Job Document Resizer</span>
              <span aria-hidden="true">Â·</span>
              <span>Zero Form Rejection Guarantee</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-[1.15]">
              Resize to Exact <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy decoration-2">300KB</span> &amp; 150Ã—150px in Seconds
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Every FPSC, PPSC, NTS, and university admission form rejects photos if not strictly under 300KB or 25KB. DocFix auto-converts to JPG, hits exact dimensions, sets certified 200 DPI, and combines CNIC front+back for instant acceptance.
            </p>

            {/* Social Proof & Metrics Bar */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span><strong>{stats.totalResized.toLocaleString()}+</strong> Documents Resized</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span><strong>{stats.acceptedRate}</strong> Portal Upload Success</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span><strong>0.02s</strong> Processing Speed</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span><strong>100%</strong> In-Browser Privacy</span>
              </div>
            </div>

            {/* Quick Tab Switcher */}
            <div className="pt-2 flex justify-center">
              <div className="inline-flex p-1 bg-slate-200/70 dark:bg-slate-800/70 rounded-xl gap-1 text-xs overflow-x-auto">
                <button
                  type="button"
                  onClick={() => handleTabChange('resizer')}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    activeTab === 'resizer'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  1. Photo Resizer (300KB)
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('cnic')}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    activeTab === 'cnic'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  2. CNIC Front+Back
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('bundle')}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    activeTab === 'bundle'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  3. 1-Click Job Bundle (ZIP)
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('diagnostic')}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    activeTab === 'diagnostic'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  4. Fix Rejection
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Tab 1: Single Document & Photo Resizer */}
        {activeTab === 'resizer' && (
          <div className="space-y-6">
            <PortalSelector
              portals={portals}
              selectedPortalId={selectedPortalId}
              onSelectPortal={handleSelectPortal}
              isCustom={isCustom}
              onSetCustom={() => setIsCustom(true)}
            />

            <SingleDocResizer
              currentPortal={isCustom ? null : currentPortal}
              isCustom={isCustom}
              usage={usage}
              onConversionPerformed={handleConversionPerformed}
              onOpenPremium={handleOpenPremium}
            />

            {/* Mid-Content Ad Container */}
            <AdSlot format="banner" />

            {/* Educational Content & FAQs directly on home page for AdSense content depth */}
            <WhyDocFix />
            <FaqSection />
          </div>
        )}

        {/* Tab 2: CNIC Front + Back Combiner */}
        {activeTab === 'cnic' && (
          <div className="space-y-6">
            <CnicCombiner
              usage={usage}
              onConversionPerformed={handleConversionPerformed}
              onOpenPremium={handleOpenPremium}
            />
            <AdSlot format="banner" />
            <WhyDocFix />
          </div>
        )}

        {/* Tab 3: 1-Click Job Application Bundle */}
        {activeTab === 'bundle' && (
          <div className="space-y-6">
            <JobBundlePack
              portals={portals}
              selectedPortalId={selectedPortalId}
              usage={usage}
              onConversionPerformed={handleConversionPerformed}
              onOpenPremium={handleOpenPremium}
            />
            <AdSlot format="banner" />
            <WhyDocFix />
          </div>
        )}

        {/* Tab 4: Rejection Diagnostic Tool */}
        {activeTab === 'diagnostic' && (
          <div className="space-y-6">
            <RejectionDiagnostic
              portals={portals}
              onApplyFix={handleApplyPresetFromDirectory}
            />
            <AdSlot format="banner" />
            <FaqSection />
          </div>
        )}

        {/* Tab 5: Directory of Portal Specs */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            <PortalDirectory
              portals={portals}
              onApplyPreset={handleApplyPresetFromDirectory}
            />
            <AdSlot format="banner" />
          </div>
        )}

        {/* Tab 6: Applicant Knowledge Base & Guidelines */}
        {activeTab === 'guidelines' && (
          <div className="space-y-6">
            <GuidelinesSection />
            <AdSlot format="banner" />
            <FaqSection />
          </div>
        )}

        {/* Tab 7: Comprehensive FAQ Page */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            <FaqSection />
            <AdSlot format="banner" />
            <WhyDocFix />
          </div>
        )}

        {/* Mandatory Legal & Trust Pages for Ad Network Approvals */}
        {activeTab === 'privacy' && <PrivacyPolicy />}
        {activeTab === 'terms' && <TermsOfService />}
        {activeTab === 'disclaimer' && <Disclaimer />}
        {activeTab === 'about' && <AboutUs />}
        {activeTab === 'contact' && <ContactUs />}
      </main>

      {/* Footer */}
      <Footer onNavigateTab={handleTabChange} />

      {/* Premium Upgrade Modal */}
      <PremiumModal
        isOpen={premiumModalOpen}
        onClose={() => setPremiumModalOpen(false)}
        isPremium={usage.isPremium}
        onStatusChange={handlePremiumStatusChange}
      />

      {/* Cookie & Advertising Consent Notice (Mandatory for AdSense / Monetag) */}
      <CookieBanner onOpenPrivacy={() => handleTabChange('privacy')} />
    </div>
  );
}
