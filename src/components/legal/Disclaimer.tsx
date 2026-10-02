import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const Disclaimer: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider mb-1">
          <AlertTriangle className="w-4 h-4" />
          <span>Notice of Non-Affiliation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          Official Disclaimer
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Essential Notice for All Job Applicants &amp; Portal Visitors
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          No Affiliation with Government Agencies or Testing Bodies
        </h2>
        <p>
          DocFix (<code className="font-mono bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-800">http://0.0.0.0:3000</code>) is an independently operated web-based image compression and formatting utility.
        </p>
        <p>
          DocFix is <strong>NOT</strong> associated, affiliated, endorsed, authorized, or in any way officially connected with:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 list-disc pl-5 font-medium text-slate-800 dark:text-slate-200">
          <li>Federal Public Service Commission (FPSC)</li>
          <li>Punjab Public Service Commission (PPSC)</li>
          <li>Sindh Public Service Commission (SPSC)</li>
          <li>Khyber Pakhtunkhwa Public Service Commission (KPPSC)</li>
          <li>Balochistan Public Service Commission (BPSC)</li>
          <li>National Testing Service (NTS)</li>
          <li>National Job Portal (NJP - GoP)</li>
          <li>NADRA (National Database &amp; Registration Authority)</li>
        </ul>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Purpose of Presets &amp; Fair Use</h2>
        <p>
          The names of commissions, examinations (e.g. CSS, PMS, NAT, GAT), and public testing organizations are used exclusively to describe compatibility and technical file constraints (e.g. 150Ã—150 px, 300KB, 25KB, 200 DPI).
        </p>
        <p>
          For authoritative recruitment advertisements, syllabus information, challan forms, and official application portals, applicants should always visit the respective commission's official <code className="font-mono">.gov.pk</code> or <code className="font-mono">.org.pk</code> websites.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Information Accuracy</h2>
        <p>
          While we diligently maintain our portal specifications database to reflect current commission rules, guidelines can be amended by commissions at any time. DocFix provides this service on an "as is" and "as available" basis without warranties of any kind.
        </p>
      </section>
    </div>
  );
};
