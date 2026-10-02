import React, { useState, useEffect } from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';

interface AdSlotProps {
  format: 'leaderboard' | 'rectangle' | 'banner';
  slotId?: string;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ format, slotId = 'default', className = '' }) => {
  const [adSensePubId, setAdSensePubId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('docfix_adsense_pub_id');
    if (saved) setAdSensePubId(saved);
  }, []);

  // Sample relevant high-intent advertisers matching job seekers
  const sampleAds = {
    leaderboard: {
      sponsor: 'Rozee.pk & PakPrep',
      title: 'FPSC & PPSC 2026 Past Papers & Mock Exam Preparation',
      description: 'Over 50,000 solved MCQs, online test series, and interview prep for CSS, Tehsildar & PMS.',
      cta: 'Start Free Mock Test',
      link: 'https://rozee.pk'
    },
    rectangle: {
      sponsor: 'Ilmkidunya & Govt Jobs',
      title: 'Latest Federal & Provincial Jobs 2026',
      description: 'Subscribe to daily job alerts on WhatsApp for BPS-14 to BPS-19 vacant posts across Pakistan.',
      cta: 'View Vacancy List',
      link: 'https://ilmkidunya.com'
    },
    banner: {
      sponsor: 'NADRA Pak-ID & MRP Renewal',
      title: 'Online Smart Card & Passport Renewal Portal Guide',
      description: 'Official steps, fee schedule, and photo guidelines for Pak-ID biometric verification.',
      cta: 'Check Renewal Steps',
      link: 'https://onlinemrp.dgip.gov.pk'
    }
  };

  const ad = sampleAds[format];

  return (
    <div className={`my-4 overflow-hidden text-center ${className}`}>
      {/* Required AdSense / IAB Label: Must never mislead users */}
      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
        Advertisement Â· Sponsored
      </div>

      {format === 'leaderboard' && (
        <div className="w-full max-w-4xl mx-auto min-h-[90px] bg-gradient-to-r from-slate-50 dark:from-slate-950 via-slate-100 dark:via-slate-900 to-slate-50 dark:to-slate-950 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div className="space-y-0.5">
            <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">
              {ad.sponsor}
            </span>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {ad.title}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block">
              {ad.description}
            </p>
          </div>

          <a
            href={ad.link}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="shrink-0 px-3.5 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span>{ad.cta}</span>
            <ExternalLink className="w-3 h-3 text-slate-300 dark:text-slate-600" />
          </a>
        </div>
      )}

      {format === 'rectangle' && (
        <div className="w-[300px] h-[250px] mx-auto bg-gradient-to-b from-slate-50 dark:from-slate-950 to-slate-100/80 dark:to-slate-900/80 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 flex flex-col justify-between text-left shadow-xs">
          <div>
            <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">
              {ad.sponsor}
            </span>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-2 leading-snug">
              {ad.title}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 leading-normal">
              {ad.description}
            </p>
          </div>

          <a
            href={ad.link}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors text-center"
          >
            <span>{ad.cta}</span>
            <ExternalLink className="w-3 h-3 text-emerald-200" />
          </a>
        </div>
      )}

      {format === 'banner' && (
        <div className="w-full bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div className="space-y-0.5">
            <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">
              {ad.sponsor}
            </span>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {ad.title}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {ad.description}
            </p>
          </div>

          <a
            href={ad.link}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="shrink-0 px-3 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span>{ad.cta}</span>
            <ExternalLink className="w-3 h-3 text-slate-300 dark:text-slate-600" />
          </a>
        </div>
      )}
    </div>
  );
};
