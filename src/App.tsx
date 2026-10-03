import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, AppTab } from './components/Navbar';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { AdSlot } from './components/ads/AdSlot';
import { PremiumModal } from './components/PremiumModal';

import { HomePage } from './pages/HomePage';
import { CnicPage } from './pages/CnicPage';
import { BundlePage } from './pages/BundlePage';
import { DiagnosticPage } from './pages/DiagnosticPage';
import { DirectoryPage } from './pages/DirectoryPage';
import { GuidelinesPage } from './pages/GuidelinesPage';
import { FaqPage } from './pages/FaqPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

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
  ChevronRight
} from 'lucide-react';

const PATH_TO_TAB: Record<string, AppTab> = {
  '/': 'resizer',
  '/cnic': 'cnic',
  '/bundle': 'bundle',
  '/diagnostic': 'diagnostic',
  '/portal-specs': 'directory',
  '/guidelines': 'guidelines',
  '/faq': 'faq',
  '/privacy': 'privacy',
  '/terms': 'terms',
  '/disclaimer': 'disclaimer',
  '/about': 'about',
  '/contact': 'contact'
};

const TAB_TO_PATH: Record<AppTab, string> = {
  resizer: '/',
  cnic: '/cnic',
  bundle: '/bundle',
  diagnostic: '/diagnostic',
  directory: '/portal-specs',
  guidelines: '/guidelines',
  faq: '/faq',
  privacy: '/privacy',
  terms: '/terms',
  disclaimer: '/disclaimer',
  about: '/about',
  contact: '/contact'
};

const TOOL_TABS: AppTab[] = ['resizer', 'cnic', 'bundle', 'diagnostic'];

function AppInner() {
  const [portals, setPortals] = useState<PortalPreset[]>(PORTAL_PRESETS);
  const [selectedPortalId, setSelectedPortalId] = useState<string>('fpsc');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [premiumModalOpen, setPremiumModalOpen] = useState<boolean>(false);
  const [usage, setUsage] = useState<UsageState>(getUsageState());
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();

  const [stats, setStats] = useState({
    totalResized: 184520,
    acceptedRate: '99.8%',
    supportedPortals: 10
  });

  const activeTab = PATH_TO_TAB[location.pathname] || 'resizer';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as AppTab | null;
    if (tabParam && TAB_TO_PATH[tabParam]) {
      navigate(TAB_TO_PATH[tabParam], { replace: true });
    }
  }, []);

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

  const handleApplyPresetFromDirectory = (portal: PortalPreset) => {
    setSelectedPortalId(portal.id);
    setIsCustom(false);
    navigate('/');
  };

  const handleApplyFix = (portal: PortalPreset) => {
    setSelectedPortalId(portal.id);
    setIsCustom(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => navigate(TAB_TO_PATH[tab])}
        usage={usage}
        onOpenPremium={handleOpenPremium}
        themePreference={theme.preference}
        onThemeChange={theme.setPreference}
      />

      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
          <button onClick={() => navigate('/')} className="hover:text-emerald-700 dark:hover:text-emerald-300">Home</button>
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Routes>
          <Route path="/" element={
            <HomePage
              portals={portals}
              selectedPortalId={selectedPortalId}
              isCustom={isCustom}
              usage={usage}
              onConversionPerformed={handleConversionPerformed}
              onOpenPremium={handleOpenPremium}
              onSelectPortal={handleSelectPortal}
              onSetCustom={() => setIsCustom(true)}
              stats={stats}
            />
          } />
          <Route path="/cnic" element={
            <CnicPage
              usage={usage}
              onConversionPerformed={handleConversionPerformed}
              onOpenPremium={handleOpenPremium}
            />
          } />
          <Route path="/bundle" element={
            <BundlePage
              portals={portals}
              selectedPortalId={selectedPortalId}
              usage={usage}
              onConversionPerformed={handleConversionPerformed}
              onOpenPremium={handleOpenPremium}
            />
          } />
          <Route path="/diagnostic" element={
            <DiagnosticPage
              portals={portals}
              onApplyFix={handleApplyFix}
            />
          } />
          <Route path="/portal-specs" element={
            <DirectoryPage
              portals={portals}
              onApplyPreset={handleApplyPresetFromDirectory}
            />
          } />
          <Route path="/guidelines" element={<GuidelinesPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer onNavigateTab={(tab) => navigate(TAB_TO_PATH[tab])} />

      <PremiumModal
        isOpen={premiumModalOpen}
        onClose={() => setPremiumModalOpen(false)}
        isPremium={usage.isPremium}
        onStatusChange={handlePremiumStatusChange}
      />

      <CookieBanner onOpenPrivacy={() => navigate('/privacy')} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
