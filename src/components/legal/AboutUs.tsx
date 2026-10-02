import React from 'react';
import { Target, Users, ShieldCheck, Heart, Award, Cpu } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider mb-1">
          <Users className="w-4 h-4" />
          <span>Our Story &amp; Purpose</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          About DocFix
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Built by Engineers and Civil Service Aspirants to Solve the #1 Application Hurdle
        </p>
      </div>

      {/* The Mission */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-600" />
          <span>The Problem We Set Out to Solve</span>
        </h2>
        <p>
          Every year, over 2.5 million candidates in Pakistan apply for government positions through competitive commissions like FPSC, PPSC, SPSC, KPPSC, and NTS. Yet, an estimated <strong>15% of all submissions fail or are delayed</strong> due to a single frustrating technicality: photo and document upload rejection.
        </p>
        <p>
          Portals enforce strict, zero-tolerance server rules:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs">
          <li>FPSC rejects photos that are 301 KB instead of strictly under 300 KB.</li>
          <li>PPSC rejects images exceeding 25 KB or lacking 150Ã—150 px resolution.</li>
          <li>Embassies and Passport offices reject uploads missing embedded 200/300 DPI metadata.</li>
        </ul>
        <p>
          Desperate applicants were forced to visit local photo studios, paying Rs. 150 per crop, or spend hours on generic online tools that compromised their identity card privacy and ruined image quality. We built DocFix to fix this permanently.
        </p>
      </section>

      {/* Technical Philosophy */}
      <section className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-700 dark:text-emerald-300" />
          <span>Our Technical Philosophy: 100% Client-Side Privacy</span>
        </h2>
        <p className="text-xs">
          When dealing with National Identity Cards (CNIC), signatures, and academic degrees, privacy is non-negotiable. Rather than running images through a remote cloud server, DocFix was architected to execute entirely inside your device's browser using HTML5 Canvas, modern ECMAScript, and raw binary buffer manipulation:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
            <strong className="block text-slate-900 dark:text-slate-100 mb-1">Binary Search Compressor</strong>
            <span>Iteratively searches JPEG quality parameters to land exactly 5KB under the portal ceiling without pixelation.</span>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
            <strong className="block text-slate-900 dark:text-slate-100 mb-1">JFIF APP0 DPI Injection</strong>
            <span>Injects standard 200 or 300 DPI tags directly into the JPEG stream so automated portal scanners accept it.</span>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
            <strong className="block text-slate-900 dark:text-slate-100 mb-1">Zero Server Storage</strong>
            <span>No database holds your photos. The moment you close the tab, all memory is freed.</span>
          </div>
        </div>
      </section>

      {/* Editorial Standards */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-600" />
          <span>Editorial Integrity &amp; Verification</span>
        </h2>
        <p>
          Our team reviews official gazettes, notifications, and portal updates from FPSC, PPSC, NTS, and allied bodies on a weekly basis to guarantee that all preset dimensions, background tints, and file size limits reflect the current 2025â€“2026 recruitment cycle.
        </p>
      </section>
    </div>
  );
};
