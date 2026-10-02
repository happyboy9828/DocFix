import React from 'react';
import { DOCUMENT_GUIDELINES } from '../../server/data/portals';
import { BookOpen, CheckCircle2, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

export const GuidelinesSection: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Applicant Knowledge Base</span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
          How to Avoid Photo & Document Rejections in Government Jobs
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
          Recruitment portals like FPSC, PPSC, NTS, and KPPSC reject over 15% of job applications on the document stage. Here is everything you need to know to ensure 100% acceptance.
        </p>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DOCUMENT_GUIDELINES.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50">
                {item.tag}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">Rule #{idx + 1}</span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {item.title}
            </h3>

            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {item.summary}
            </p>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800">
              {item.content}
            </p>
          </div>
        ))}
      </div>

      {/* Pro-Tips Checklist */}
      <div className="bg-emerald-950 text-white rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Mobile Phone Photography Tips for Applicants</span>
        </div>
        <h3 className="text-base font-bold text-white">
          How to take a studio-quality photo from your bed or phone
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-emerald-100">
          <div className="bg-emerald-900/60 border border-emerald-800/80 rounded-xl p-3.5 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>1. Stand Facing Window</span>
            </div>
            <p className="text-emerald-200/80 leading-normal">
              Never use camera flash directly on face. Stand 3-4 feet away from a window with natural daylight shining equally on both cheeks.
            </p>
          </div>

          <div className="bg-emerald-900/60 border border-emerald-800/80 rounded-xl p-3.5 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>2. Plain Wall Behind</span>
            </div>
            <p className="text-emerald-200/80 leading-normal">
              Stand against a plain white or light wall. Use DocFixâ€™s "Light Sky Blue" filter to give it the official FPSC studio background look.
            </p>
          </div>

          <div className="bg-emerald-900/60 border border-emerald-800/80 rounded-xl p-3.5 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>3. Both Ears Visible</span>
            </div>
            <p className="text-emerald-200/80 leading-normal">
              Keep head centered, look straight at camera with neutral expression. Ensure hair does not obstruct forehead or ears.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
