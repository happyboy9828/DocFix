import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ArrowRight, Wrench, Sparkles, HelpCircle } from 'lucide-react';
import { PortalPreset } from '../types/document';

interface RejectionDiagnosticProps {
  portals: PortalPreset[];
  onApplyFix: (portal: PortalPreset) => void;
}

interface CommonRejectionError {
  id: string;
  portalId: string;
  portalName: string;
  errorMessage: string;
  cause: string;
  solution: string;
  fixActionLabel: string;
}

const COMMON_ERRORS: CommonRejectionError[] = [
  {
    id: 'fpsc_300kb',
    portalId: 'fpsc',
    portalName: 'FPSC (Federal Public Service Commission)',
    errorMessage: 'File size exceeds allowable maximum limit of 300 KB.',
    cause: 'Federal recruitment servers employ a hard ceiling of 307,200 bytes. Many online converters output 302KB or 305KB, which triggers an instant server rejection.',
    solution: 'DocFix uses an iterative binary compressor that pins file size safely between 285KB and 295KB with zero quality degradation.',
    fixActionLabel: 'Auto-Fix with FPSC 300KB Preset'
  },
  {
    id: 'ppsc_25kb',
    portalId: 'ppsc',
    portalName: 'PPSC (Punjab Public Service Commission)',
    errorMessage: 'Image size should not be greater than 25KB and dimensions 150x150.',
    cause: 'PPSC has a strict 25,000 bytes ceiling. Typical tools reduce quality to 10%, making applicant faces and CNIC numbers illegible.',
    solution: 'DocFix pairs exact 150x150 px scaling with edge-contrast boost, keeping facial features and text razor-sharp at 23KB.',
    fixActionLabel: 'Auto-Fix with PPSC 25KB Preset'
  },
  {
    id: 'dpi_resolution',
    portalId: 'fpsc',
    portalName: 'FPSC & Testing Services',
    errorMessage: 'Uploaded photograph resolution is below the required 200 DPI.',
    cause: 'Standard browser canvas exports default to 72 DPI (screen resolution) or omit JFIF metadata entirely, causing portal automated bots to flag the image.',
    solution: 'DocFix directly modifies the binary stream by injecting standard JFIF APP0 headers configured for authentic 200 DPI.',
    fixActionLabel: 'Auto-Fix with 200 DPI Injection'
  },
  {
    id: 'cnic_single_slot',
    portalId: 'fpsc',
    portalName: 'FPSC, NTS, CSS',
    errorMessage: 'Only one file upload allowed for CNIC. Please provide combined front & back.',
    cause: 'The application portal provides only a single upload button, but requires both front and back sides to verify applicant identity.',
    solution: 'Use DocFixâ€™s CNIC Combiner tool to merge front and back sides into a single vertical card layout under 300KB.',
    fixActionLabel: 'Open CNIC Combiner Tool'
  },
  {
    id: 'signature_yellow_shadow',
    portalId: 'fpsc',
    portalName: 'FPSC, SPSC, KPPSC',
    errorMessage: 'Signature is illegible or has unreadable dark background.',
    cause: 'Taking a smartphone photo of a signature in room light creates paper shadows and yellow tint, triggering automated OCR failure.',
    solution: 'DocFixâ€™s Signature B&W threshold filter removes paper yellowing and harsh shadows, creating a pure white background with bold pen strokes.',
    fixActionLabel: 'Auto-Fix with Signature Filter'
  },
  {
    id: 'kppsc_white_bg',
    portalId: 'kppsc',
    portalName: 'KPPSC (Khyber Pakhtunkhwa PSC)',
    errorMessage: 'Photograph must have a plain white background and be under 30KB.',
    cause: 'KPPSC explicitly disqualifies photographs with outdoor backgrounds, shadows, or file size over 30KB.',
    solution: 'DocFix scales to 150x150, cleans the backdrop to clean white, and compresses strictly to 27KB.',
    fixActionLabel: 'Auto-Fix with KPPSC 30KB Preset'
  }
];

export const RejectionDiagnostic: React.FC<RejectionDiagnosticProps> = ({ portals, onApplyFix }) => {
  const [selectedErrorId, setSelectedErrorId] = useState<string>(COMMON_ERRORS[0].id);

  const activeError = COMMON_ERRORS.find(e => e.id === selectedErrorId) || COMMON_ERRORS[0];
  const targetPortal = portals.find(p => p.id === activeError.portalId) || portals[0];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-emerald-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Automated Troubleshooting Engine
          </span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
          Government Portal Rejection Diagnostic &amp; Instant Fixer
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
          Did your photo or document get rejected by FPSC, PPSC, NTS, or an admission portal? Select the error message below to understand why it failed and apply the exact 1-click correction.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Error Selection List (5 cols) */}
        <div className="lg:col-span-5 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
            Select The Error You Received:
          </label>

          {COMMON_ERRORS.map((err) => {
            const isSelected = selectedErrorId === err.id;
            return (
              <button
                key={err.id}
                type="button"
                onClick={() => setSelectedErrorId(err.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-100 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <div className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase">
                  {err.portalName}
                </div>
                <div className="mt-1 font-semibold leading-snug line-clamp-1">
                  "{err.errorMessage}"
                </div>
              </button>
            );
          })}
        </div>

        {/* Diagnosis & 1-Click Fix Solution (7 cols) */}
        <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-3.5 text-xs text-red-900 dark:text-red-200">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5">Rejected Error Message:</strong>
                <span className="font-mono text-[11px]">"{activeError.errorMessage}"</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[10px]">
                Why The Commission Server Rejected It:
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeError.cause}
              </p>
            </div>

            <div className="space-y-1.5 text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 text-[10px]">
                The DocFix Guaranteed Fix:
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeError.solution}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Target: <strong className="text-slate-800 dark:text-slate-200">{targetPortal.name}</strong>
            </div>

            <button
              type="button"
              onClick={() => onApplyFix(targetPortal)}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>{activeError.fixActionLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
