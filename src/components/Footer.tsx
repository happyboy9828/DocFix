import React from 'react';
import { FileCheck, Shield, ExternalLink, Lock } from 'lucide-react';
import { AppTab } from './Navbar';

interface FooterProps {
  onOpenFeedback: () => void;
  onNavigateTab: (tab: AppTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenFeedback, onNavigateTab }) => {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 mt-16 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <FileCheck className="w-5 h-5" />
              </div>
              <span className="text-base font-bold text-slate-900">DocFix</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Govt Job Resizer
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              DocFix is an independent client-side document processing utility built to assist applicants applying to FPSC, PPSC, NTS, NJP, and universities.
            </p>

            <div className="flex items-center gap-1.5 text-xs text-emerald-700 pt-1">
              <Lock className="w-3.5 h-3.5" />
              <span className="font-semibold">Zero Server Storage Guarantee</span>
            </div>
            <p className="text-[11px] text-slate-400">
              All pixel transformations and compression occur locally in your browser. We never view or store your personal documents.
            </p>
          </div>

          {/* Col 2: Quick Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Document Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab('resizer')}
                  className="hover:text-emerald-700 transition-colors text-left"
                >
                  FPSC 300KB Passport Photo Resizer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('resizer')}
                  className="hover:text-emerald-700 transition-colors text-left"
                >
                  PPSC 25KB Image Compressor (150x150)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('cnic')}
                  className="hover:text-emerald-700 transition-colors text-left"
                >
                  CNIC Front + Back Single Page Combiner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('bundle')}
                  className="hover:text-emerald-700 transition-colors text-left"
                >
                  1-Click Job Application Bundle (ZIP)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('diagnostic')}
                  className="hover:text-emerald-700 transition-colors text-left font-medium text-emerald-800"
                >
                  Rejection Error Diagnostic &amp; Fixer
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal Guides & Help */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Guides &amp; Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab('directory')}
                  className="hover:text-emerald-700 transition-colors text-left"
                >
                  Public Service Commissions Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('guidelines')}
                  className="hover:text-emerald-700 transition-colors text-left"
                >
                  Mobile Photography &amp; Lighting Tips
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('faq')}
                  className="hover:text-emerald-700 transition-colors text-left"
                >
                  Frequently Asked Questions (FAQ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('guidelines')}
                  className="hover:text-emerald-700 transition-colors text-left"
                >
                  200 &amp; 300 DPI JFIF Metadata Explained
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenFeedback}
                  className="hover:text-emerald-700 transition-colors text-left text-emerald-800 font-semibold"
                >
                  + Request Missing Portal Preset
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Mandatory Legal & Trust Pages (Crucial for Ad Network Approvals) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Legal &amp; Transparency
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab('privacy')}
                  className="hover:text-emerald-700 transition-colors text-left font-semibold text-slate-800"
                >
                  Privacy Policy (GDPR / CCPA)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('terms')}
                  className="hover:text-emerald-700 transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('disclaimer')}
                  className="hover:text-emerald-700 transition-colors text-left"
                >
                  Government Non-Affiliation Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('about')}
                  className="hover:text-emerald-700 transition-colors text-left"
                >
                  About Us &amp; Engineering Mission
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('contact')}
                  className="hover:text-emerald-700 transition-colors text-left"
                >
                  Contact Us &amp; Editorial Desk
                </button>
              </li>
              <li>
                <a
                  href="/ads.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-700 transition-colors text-left text-[11px] text-slate-400 font-mono flex items-center gap-1"
                >
                  <span>ads.txt</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 leading-relaxed">
          <strong className="text-slate-700">Disclaimer:</strong> DocFix is an independent utility and is not affiliated, authorized, endorsed, or officially connected with FPSC, PPSC, NTS, NJP, SPSC, KPPSC, BPSC, NADRA, or any government ministry. All trademarks and commission names are property of their respective owners and used solely for identification purposes under nominative fair use.
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} DocFix. All rights reserved. Compliant with Google AdSense, GDPR, and IAB Advertising Guidelines.
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigateTab('privacy')} className="hover:underline">Privacy</button>
            <span>·</span>
            <button onClick={() => onNavigateTab('terms')} className="hover:underline">Terms</button>
            <span>·</span>
            <button onClick={() => onNavigateTab('contact')} className="hover:underline">Contact</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
