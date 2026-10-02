import React, { useState } from 'react';
import {
  FolderArchive,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  RefreshCw,
  Sparkles,
  PackageCheck
} from 'lucide-react';
import { PortalPreset } from '../types/document';
import { processJobBundle, downloadZipBundle, BundleProcessedItem } from '../utils/bundleEngine';
import { UsageState } from '../utils/limitEngine';
import { DailyLimitBadge } from './DailyLimitBadge';
import { Crown } from 'lucide-react';

interface JobBundlePackProps {
  portals: PortalPreset[];
  selectedPortalId: string;
  usage: UsageState;
  onConversionPerformed: () => boolean;
  onOpenPremium: () => void;
}

// Quick sample image helper for bundle test
const makeSampleImageBlob = (text: string, color: string, w = 300, h = 300): File => {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(text, w / 2, h / 2);

  // Convert to fake File
  const bin = atob(canvas.toDataURL('image/jpeg', 0.9).split(',')[1]);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new File([arr], `${text.toLowerCase().replace(/\s+/g, '_')}.jpg`, { type: 'image/jpeg' });
};

export const JobBundlePack: React.FC<JobBundlePackProps> = ({
  portals,
  selectedPortalId,
  usage,
  onConversionPerformed,
  onOpenPremium
}) => {
  const [activePortalId, setActivePortalId] = useState<string>(selectedPortalId || 'fpsc');

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [sigFile, setSigFile] = useState<File | null>(null);
  const [cnicFrontFile, setCnicFrontFile] = useState<File | null>(null);
  const [cnicBackFile, setCnicBackFile] = useState<File | null>(null);
  const [degreeFile, setDegreeFile] = useState<File | null>(null);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processedItems, setProcessedItems] = useState<BundleProcessedItem[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentPortal = portals.find(p => p.id === activePortalId) || portals[0];

  const handleLoadSampleKit = () => {
    setPhotoFile(makeSampleImageBlob('Candidate Photo', '#0284c7', 600, 600));
    setSigFile(makeSampleImageBlob('Candidate Signature', '#334155', 400, 160));
    setCnicFrontFile(makeSampleImageBlob('CNIC Front Side', '#059669', 850, 540));
    setCnicBackFile(makeSampleImageBlob('CNIC Back Side', '#047857', 850, 540));
    setDegreeFile(makeSampleImageBlob('Degree / Bank Challan', '#b45309', 1000, 1400));
  };

  const handleProcessAll = async () => {
    if (!photoFile && !sigFile && !cnicFrontFile && !degreeFile) {
      setErrorMsg('Please upload at least one document or click "Load Sample Kit" to test.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const results = await processJobBundle(currentPortal, {
        photo: photoFile,
        signature: sigFile,
        cnicFront: cnicFrontFile,
        cnicBack: cnicBackFile,
        degreeChallan: degreeFile
      });
      setProcessedItems(results);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Processing bundle failed';
      setErrorMsg(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadZip = async () => {
    if (processedItems.length === 0) return;

    if (!usage.isPremium && usage.count >= usage.maxDaily) {
      onOpenPremium();
      return;
    }

    const allowed = onConversionPerformed();
    if (!allowed) {
      onOpenPremium();
      return;
    }

    const zipBlob = await downloadZipBundle(currentPortal.shortName, processedItems);
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DocFix_${currentPortal.shortName}_Complete_Application_Package.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">All-in-One Generator</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Â·</span>
            <span className="text-xs text-slate-300 dark:text-slate-600">Complete Job Application Kit</span>
          </div>
          <h2 className="text-lg font-bold mt-1 text-white">
            1-Click Job Application Document Bundle
          </h2>
          <p className="text-xs text-slate-300 dark:text-slate-600 mt-1 max-w-2xl">
            Upload your photo, signature, CNIC, and degree once. DocFix formats every single file to match the commission's exact rules, embeds 200 DPI, and packages them into a clean ZIP archive ready for submission.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadSampleKit}
          className="shrink-0 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          Load Sample Kit
        </button>
      </div>

      {/* Target Portal Chooser */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Target Recruitment Portal
        </label>
        <div className="flex flex-wrap gap-2">
          {portals.slice(0, 6).map((portal) => (
            <button
              key={portal.id}
              type="button"
              onClick={() => setActivePortalId(portal.id)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                activePortalId === portal.id
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              {portal.name}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Upload Slots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Passport Photo */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">1. Passport Photo</span>
              {photoFile && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Will resize to {currentPortal.photoSpecs.widthPx}x{currentPortal.photoSpecs.heightPx}, â‰¤{currentPortal.photoSpecs.maxKb}KB
            </p>
          </div>

          <label className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50 dark:bg-slate-950 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 transition-all text-center">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && setPhotoFile(e.target.files[0])}
            />
            <Upload className="w-5 h-5 text-slate-400 dark:text-slate-500 mb-1" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
              {photoFile ? photoFile.name : 'Choose Photo'}
            </span>
          </label>
        </div>

        {/* 2. Signature */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">2. Signature</span>
              {sigFile && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Auto-cleans paper shadow, â‰¤{currentPortal.signatureSpecs?.maxKb || 30}KB
            </p>
          </div>

          <label className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50 dark:bg-slate-950 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 transition-all text-center">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && setSigFile(e.target.files[0])}
            />
            <Upload className="w-5 h-5 text-slate-400 dark:text-slate-500 mb-1" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
              {sigFile ? sigFile.name : 'Choose Signature'}
            </span>
          </label>
        </div>

        {/* 3. CNIC Front & Back */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">3. CNIC (Front + Back)</span>
              {(cnicFrontFile || cnicBackFile) && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Auto-merges onto 1 page, â‰¤{currentPortal.cnicSpecs?.maxKb || 300}KB
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="border border-dashed border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer bg-slate-50 dark:bg-slate-950 text-center">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files && setCnicFrontFile(e.target.files[0])}
              />
              <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">Front</span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 truncate max-w-[60px]">
                {cnicFrontFile ? 'Uploaded' : '+ Add'}
              </span>
            </label>

            <label className="border border-dashed border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer bg-slate-50 dark:bg-slate-950 text-center">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files && setCnicBackFile(e.target.files[0])}
              />
              <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">Back</span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 truncate max-w-[60px]">
                {cnicBackFile ? 'Uploaded' : '+ Add'}
              </span>
            </label>
          </div>
        </div>

        {/* 4. Degree or Bank Challan */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">4. Degree / Challan</span>
              {degreeFile && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Degree or e-Pay challan receipt, â‰¤{currentPortal.documentSpecs?.maxKb || 300}KB
            </p>
          </div>

          <label className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50 dark:bg-slate-950 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 transition-all text-center">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && setDegreeFile(e.target.files[0])}
            />
            <Upload className="w-5 h-5 text-slate-400 dark:text-slate-500 mb-1" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
              {degreeFile ? degreeFile.name : 'Choose Degree/Challan'}
            </span>
          </label>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-800 dark:text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Process Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleProcessAll}
          disabled={isProcessing}
          className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2.5 transition-all cursor-pointer"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Resizing & Formatting Package...</span>
            </>
          ) : (
            <>
              <PackageCheck className="w-5 h-5" />
              <span>Generate {currentPortal.shortName} Application Kit</span>
            </>
          )}
        </button>
      </div>

      {/* Processed Results List & ZIP Download */}
      {processedItems.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {currentPortal.shortName} Application Kit Ready ({processedItems.length} files)
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Every file passed the commission's size, dimension, and 200 DPI standards.
              </p>
            </div>

            {(!usage.isPremium && usage.count >= usage.maxDaily) ? (
              <button
                type="button"
                onClick={onOpenPremium}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-md transition-colors cursor-pointer"
              >
                <Crown className="w-4 h-4 fill-slate-950" />
                <span>Limit Reached (3/3) Â· Buy Premium to Download ZIP</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDownloadZip}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-colors cursor-pointer"
              >
                <FolderArchive className="w-4 h-4" />
                <span>Download Complete ZIP Package</span>
              </button>
            )}
          </div>

          {/* Individual items grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {processedItems.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate" title={item.name}>
                    {item.name}
                  </div>
                  <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300 font-semibold mt-0.5">
                    {item.result.fileSizeKb} KB Â· {item.result.width}Ã—{item.result.height} px
                  </div>
                </div>

                <div className="h-32 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden p-1">
                  <img
                    src={item.result.dataUrl}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <a
                  href={item.result.dataUrl}
                  download={item.fileName}
                  className="py-1.5 px-3 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-xs font-semibold rounded-lg text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Download File</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
