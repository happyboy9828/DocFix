import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

interface CookieBannerProps {
  onOpenPrivacy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenPrivacy }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const consent = localStorage.getItem('docfix_cookie_consent');
    if (!consent) {
      // Show banner after brief delay
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('docfix_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('docfix_cookie_consent', 'essential_only');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside aria-label="Cookie consent" className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl text-xs space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold">
          <Cookie className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Cookie &amp; Advertising Notice</span>
        </div>
        <button
          onClick={handleDecline}
          className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 p-0.5"
          aria-label="Dismiss cookie notice"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-slate-600 dark:text-slate-400 leading-normal">
        We use essential cookies to maintain your preferences and third-party advertising cookies (such as Google AdSense) to serve relevant advertisements. Your uploaded documents and photos are processed strictly in your browser and never leave your device.
      </p>

      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={onOpenPrivacy}
          className="text-emerald-700 dark:text-emerald-300 hover:underline font-semibold text-[11px]"
        >
          Privacy Policy
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDecline}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium text-[11px]"
          >
            Essential Only
          </button>
          <button
            onClick={handleAccept}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs"
          >
            Accept All
          </button>
        </div>
      </div>
    </aside>
  );
};
