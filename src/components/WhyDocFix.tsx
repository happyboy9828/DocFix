import React from 'react';
import { ShieldCheck, Zap, Scissors, Ban, CheckCircle2, Lock } from 'lucide-react';

export const WhyDocFix: React.FC = () => {
  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
          Engineered for Job Seekers
        </span>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Why Random Online Compressors Ruin Your Job Application
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Most generic photo tools are built for web blogs, not government recruitment security scanners.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* The Pain: Random tools */}
        <div className="bg-red-50/50 dark:bg-red-950/50 border border-red-200/80 dark:border-red-800/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <Ban className="w-5 h-5 shrink-0" />
            <h3 className="text-sm font-bold">Standard Compressors & Photo Studios</h3>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">âœ—</span>
              <span><strong>Exceeds Limit by 2-5 KB:</strong> Gives 304 KB when you need under 300 KB, getting rejected by FPSC portal.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">âœ—</span>
              <span><strong>Destroys Text Legibility:</strong> Compressing CNIC to 25KB makes the ID number and name an unreadable blur.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">âœ—</span>
              <span><strong>Lacks 200 DPI JFIF Tag:</strong> Drops metadata or defaults to 72 DPI, failing the portal upload verification checks.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">âœ—</span>
              <span><strong>Costs Rs. 150 & 2 Hours:</strong> Walking to a local photo studio in the heat just to crop a 150x150 photo.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">âœ—</span>
              <span><strong>Privacy Risk:</strong> Uploads your confidential CNIC and certificates to unknown overseas cloud servers.</span>
            </li>
          </ul>
        </div>

        {/* The Solution: DocFix */}
        <div className="bg-emerald-50/50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600" />
            <h3 className="text-sm font-bold">The DocFix Precision Advantage</h3>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Mathematical Ceiling Guarantee:</strong> Binary compression pins files right at 285â€“295KB (for 300KB) and 23KB (for 25KB). Zero rejection.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Smart Edge Enhancement:</strong> Contrast-boosted filter keeps NADRA CNIC numbers and Urdu text razor-sharp even at 23KB.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Real JFIF 200 & 300 DPI Injection:</strong> Modifies binary headers so OS properties and portal algorithms detect certified 200 DPI.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Instant & 100% Free:</strong> Runs in milliseconds in your browser. Save money and apply in seconds.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Zero Server Retention:</strong> 100% client-side WebAssembly & Canvas processing. Your CNIC and signature never leave your device.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
