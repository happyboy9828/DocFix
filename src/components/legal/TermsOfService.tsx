import React from 'react';
import { FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

export const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider mb-1">
          <FileText className="w-4 h-4" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Effective Date: March 2026 Â· Governing All DocFix Users
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-xs text-amber-950 dark:text-amber-100 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold mb-1">Non-Affiliation Disclaimer</strong>
          DocFix is an independent utility software. DocFix is not affiliated, endorsed, certified, or sponsored by the Federal Public Service Commission (FPSC), Punjab Public Service Commission (PPSC), National Testing Service (NTS), National Job Portal (NJP), NADRA, or any government ministry.
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">1. Acceptance of Terms</h2>
        <p>
          By accessing or using DocFix (<code className="font-mono bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded">http://0.0.0.0:3000</code>), you agree to be bound by these Terms of Service. If you do not agree to these terms, you must discontinue the use of this website immediately.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">2. Description of Service</h2>
        <p>
          DocFix provides client-side automated document manipulation services, including image aspect ratio adjustment, pixel dimension scaling, JPEG binary byte compression, JFIF resolution tag insertion, and PDF compilation for employment testing and admission application submission.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">3. User Responsibility &amp; Authenticity of Documents</h2>
        <p>
          Users are solely responsible for ensuring that all documents, photographs, and identity cards processed through DocFix are legitimate, genuine, and belong to the applicant:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs">
          <li>You agree not to use DocFix to falsify or forge government records or educational credentials.</li>
          <li>You verify that your processed document matches the latest official notification published by your recruitment commission.</li>
          <li>DocFix guarantees technical adherence to dimensional and file size ceilings (e.g. 300KB or 25KB), but the applicant bears responsibility for submitting documents within the commission's application deadline.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">4. Intellectual Property</h2>
        <p>
          All proprietary algorithms, frontend designs, user interfaces, branding, and text tutorials on DocFix are the intellectual property of DocFix. Commission names and trademarks (such as FPSC, PPSC, NTS) are used solely under the doctrine of nominative fair use to describe file formatting standards.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">5. Limitation of Liability</h2>
        <p>
          In no event shall DocFix, its developers, or contributors be held liable for any direct, indirect, incidental, or consequential damages resulting from portal server downtime, submission rejections, or changes to commission requirements.
        </p>
      </section>
    </div>
  );
};
