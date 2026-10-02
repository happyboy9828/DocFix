import React, { useState, useRef, useEffect } from 'react';
import {
  Layers,
  Upload,
  Download,
  FileText,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Maximize,
  ShieldCheck
} from 'lucide-react';
import { CnicCombinerOptions, ProcessedDocumentResult } from '../types/document';
import { combineCnicImages } from '../utils/pdfEngine';
import { UsageState } from '../utils/limitEngine';
import { DailyLimitBadge } from './DailyLimitBadge';
import { Crown } from 'lucide-react';

interface CnicCombinerProps {
  usage: UsageState;
  onConversionPerformed: () => boolean;
  onOpenPremium: () => void;
}

// Sample mock CNIC cards for instant test
const createSampleCnicCard = (side: 'front' | 'back'): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 856;
  canvas.height = 540;
  const ctx = canvas.getContext('2d')!;

  // Green NADRA Smart Card background gradient
  const grad = ctx.createLinearGradient(0, 0, 856, 540);
  grad.addColorStop(0, '#e2f2e9');
  grad.addColorStop(1, '#c8e6d3');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 856, 540);

  // Card border
  ctx.strokeStyle = '#2d6a4f';
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, 836, 520);

  // Header band
  ctx.fillStyle = '#1b4332';
  ctx.fillRect(10, 10, 836, 60);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('ISLAMIC REPUBLIC OF PAKISTAN', 30, 48);

  ctx.font = '16px sans-serif';
  ctx.fillText('National Identity Card', 620, 48);

  if (side === 'front') {
    // Smart card chip
    ctx.fillStyle = '#eab308';
    ctx.fillRect(50, 100, 110, 90);
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 100, 110, 90);

    // Photo placeholder
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(660, 90, 150, 180);
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('PHOTO', 705, 185);

    // Identity text fields
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('Name: MUHAMMAD ALI KHAN', 200, 120);

    ctx.font = '16px sans-serif';
    ctx.fillText('Father Name: TARIQ MAHMOOD', 200, 155);
    ctx.fillText('Gender: M   |   Country of Stay: Pakistan', 200, 190);

    // CNIC Number
    ctx.font = 'bold 26px monospace';
    ctx.fillStyle = '#065f46';
    ctx.fillText('35201-1234567-1', 200, 245);

    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText('Date of Birth: 14.08.1998       Date of Expiry: 14.08.2032', 200, 285);
  } else {
    // Back side
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('Present Address:', 50, 110);
    ctx.font = '14px sans-serif';
    ctx.fillText('House No. 12, Street 4, Sector G-8/1, Islamabad', 50, 135);

    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('Permanent Address:', 50, 180);
    ctx.font = '14px sans-serif';
    ctx.fillText('Village & Post Office Chak 45, Tehsil & District Sahiwal', 50, 205);

    // Nadra barcodes
    ctx.fillStyle = '#1e293b';
    for (let i = 0; i < 60; i++) {
      const x = 50 + i * 12;
      const w = (i % 3 === 0) ? 6 : 3;
      ctx.fillRect(x, 260, w, 70);
    }
  }

  // Watermark
  ctx.fillStyle = 'rgba(45, 106, 79, 0.15)';
  ctx.font = 'bold 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(side === 'front' ? 'CNIC FRONT' : 'CNIC BACK', 428, 420);
  ctx.textAlign = 'left';

  return canvas.toDataURL('image/jpeg', 0.9);
};

export const CnicCombiner: React.FC<CnicCombinerProps> = ({
  usage,
  onConversionPerformed,
  onOpenPremium
}) => {
  const [frontDataUrl, setFrontDataUrl] = useState<string | null>(null);
  const [backDataUrl, setBackDataUrl] = useState<string | null>(null);

  const [layout, setLayout] = useState<'stacked_vertical' | 'side_by_side' | 'a4_sheet'>('stacked_vertical');
  const [targetMaxKb, setTargetMaxKb] = useState<number>(300);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'application/pdf'>('image/jpeg');
  const [addBorder, setAddBorder] = useState<boolean>(true);
  const [addWatermarkDate, setAddWatermarkDate] = useState<boolean>(true);
  const [contrastBoost, setContrastBoost] = useState<boolean>(true);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<ProcessedDocumentResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  // Automatically process when front or back changes
  const runCombiner = async () => {
    if (!frontDataUrl && !backDataUrl) return;

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const options: CnicCombinerOptions = {
        frontImage: frontDataUrl,
        backImage: backDataUrl,
        layout,
        targetMaxKb,
        outputFormat,
        addBorder,
        addWatermarkDate,
        contrastBoost,
        dpi: 200
      };

      const res = await combineCnicImages(options);
      setResult(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to combine CNIC';
      setErrorMsg(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (frontDataUrl || backDataUrl) {
      runCombiner();
    }
  }, [frontDataUrl, backDataUrl, layout, targetMaxKb, outputFormat, addBorder, addWatermarkDate, contrastBoost]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        if (side === 'front') setFrontDataUrl(url);
        else setBackDataUrl(url);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoadSampleCards = () => {
    setFrontDataUrl(createSampleCnicCard('front'));
    setBackDataUrl(createSampleCnicCard('back'));
  };

  const handleDownload = () => {
    if (!result) return;

    if (!usage.isPremium && usage.count >= usage.maxDaily) {
      onOpenPremium();
      return;
    }

    const allowed = onConversionPerformed();
    if (!allowed) {
      onOpenPremium();
      return;
    }

    const ext = outputFormat === 'application/pdf' ? 'pdf' : 'jpg';
    const fileName = `DocFix_CNIC_Combined_Under${targetMaxKb}KB.${ext}`;

    const a = document.createElement('a');
    a.href = result.dataUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Intro info bar */}
      <div className="bg-emerald-900 text-white rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Official Tool</span>
            <span className="text-xs text-emerald-400">Â·</span>
            <span className="text-xs text-emerald-200">Single Upload Slot Fix</span>
          </div>
          <h2 className="text-lg font-bold mt-1 text-white">
            CNIC Front + Back Single Page Combiner (Under 300KB)
          </h2>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-2xl">
            Most government portals (FPSC, NTS, CSS) only have ONE upload box for your National ID card. DocFix merges both sides onto a single crisp JPG or PDF under the strict 300KB limit with boosted text contrast.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadSampleCards}
          className="shrink-0 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          Load Sample CNIC Cards
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Sides & Layout Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Dual upload cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Front Side */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">1. CNIC Front Side</span>
                {frontDataUrl && (
                  <button
                    onClick={() => setFrontDataUrl(null)}
                    className="text-[11px] text-red-600 dark:text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              <input
                ref={frontInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'front')}
              />

              {frontDataUrl ? (
                <div className="h-40 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                  <img src={frontDataUrl} alt="Front" className="max-h-full max-w-full object-contain" />
                </div>
              ) : (
                <div
                  onClick={() => frontInputRef.current?.click()}
                  className="h-40 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-950 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/30 flex flex-col items-center justify-center cursor-pointer transition-colors p-4 text-center"
                >
                  <Upload className="w-6 h-6 text-slate-400 dark:text-slate-500 mb-1" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Upload Front Side</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Photo, Name & CNIC Number</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => frontInputRef.current?.click()}
                className="w-full py-1.5 px-3 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors"
              >
                {frontDataUrl ? 'Change Front Image' : 'Select Front File'}
              </button>
            </div>

            {/* Back Side */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">2. CNIC Back Side</span>
                {backDataUrl && (
                  <button
                    onClick={() => setBackDataUrl(null)}
                    className="text-[11px] text-red-600 dark:text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              <input
                ref={backInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'back')}
              />

              {backDataUrl ? (
                <div className="h-40 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                  <img src={backDataUrl} alt="Back" className="max-h-full max-w-full object-contain" />
                </div>
              ) : (
                <div
                  onClick={() => backInputRef.current?.click()}
                  className="h-40 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-950 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/30 flex flex-col items-center justify-center cursor-pointer transition-colors p-4 text-center"
                >
                  <Upload className="w-6 h-6 text-slate-400 dark:text-slate-500 mb-1" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Upload Back Side</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Address & Barcode Side</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => backInputRef.current?.click()}
                className="w-full py-1.5 px-3 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors"
              >
                {backDataUrl ? 'Change Back Image' : 'Select Back File'}
              </button>
            </div>
          </div>

          {/* Configuration Options */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Layout & Output Options
            </h3>

            {/* Layout selector */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'stacked_vertical', label: 'Vertical Stack', desc: 'Front Top, Back Bottom' },
                { id: 'side_by_side', label: 'Side by Side', desc: 'Horizontal alignment' },
                { id: 'a4_sheet', label: 'Official A4 Page', desc: 'Centered on A4 sheet' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLayout(opt.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    layout === opt.id
                      ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-100 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="text-xs font-bold">{opt.label}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>

            {/* Target size limit */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">Target File Size</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300 font-mono">â‰¤ {targetMaxKb} KB</span>
              </div>
              <div className="flex gap-2">
                {[
                  { label: '300 KB (FPSC Standard)', val: 300 },
                  { label: '500 KB (CSS / NJP)', val: 500 },
                  { label: '1000 KB (1 MB)', val: 1024 }
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setTargetMaxKb(item.val)}
                    className={`text-xs py-1.5 px-3 rounded-lg border font-medium ${
                      targetMaxKb === item.val
                        ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkbox enhancements */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={contrastBoost}
                  onChange={(e) => setContrastBoost(e.target.checked)}
                  className="rounded text-emerald-600 accent-emerald-600 w-4 h-4"
                />
                <span className="font-medium text-slate-800 dark:text-slate-200">Boost Text Clarity</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={addBorder}
                  onChange={(e) => setAddBorder(e.target.checked)}
                  className="rounded text-emerald-600 accent-emerald-600 w-4 h-4"
                />
                <span className="font-medium text-slate-800 dark:text-slate-200">Clean Card Border</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={addWatermarkDate}
                  onChange={(e) => setAddWatermarkDate(e.target.checked)}
                  className="rounded text-emerald-600 accent-emerald-600 w-4 h-4"
                />
                <span className="font-medium text-slate-800 dark:text-slate-200">Date & Purpose Stamp</span>
              </label>
            </div>
          </div>
        </div>

        {/* Live Merged Result Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Combined Document Preview</h3>
              </div>
              {result && (
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  {result.fileSizeKb} KB / {targetMaxKb} KB
                </span>
              )}
            </div>

            {/* Document display area */}
            <div className="min-h-[320px] max-h-[460px] bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center p-3 overflow-hidden relative">
              {result ? (
                outputFormat === 'application/pdf' ? (
                  <div className="text-center space-y-3">
                    <FileText className="w-16 h-16 text-emerald-600 mx-auto" />
                    <div>
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-200">Single Page Combined PDF</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Size: {result.fileSizeKb} KB Â· Ready to Submit</div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={result.dataUrl}
                    alt="Combined CNIC"
                    className="max-h-full max-w-full object-contain shadow-md rounded border border-slate-200 dark:border-slate-800"
                  />
                )
              ) : (
                <div className="text-center text-slate-400 dark:text-slate-500 text-xs p-6">
                  <Layers className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p>Upload Front and Back sides (or click "Load Sample CNIC Cards") to see the live combined document.</p>
                </div>
              )}

              {isProcessing && (
                <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs flex items-center justify-center text-xs font-semibold text-emerald-800 dark:text-emerald-300 gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                  Generating merged document...
                </div>
              )}
            </div>

            {/* Format choice & download buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Export File Type</span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setOutputFormat('image/jpeg')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold ${
                      outputFormat === 'image/jpeg'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    JPG (Best for FPSC/PPSC)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOutputFormat('application/pdf')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold ${
                      outputFormat === 'application/pdf'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    PDF (Best for CSS/NJP)
                  </button>
                </div>
              </div>

              {/* Daily Conversion Limit Alert Banner */}
              <DailyLimitBadge usage={usage} onOpenPremium={onOpenPremium} />

              {(!usage.isPremium && usage.count >= usage.maxDaily) ? (
                <button
                  type="button"
                  onClick={onOpenPremium}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Crown className="w-4 h-4 fill-slate-950" />
                  <span>Daily Limit Reached (3/3) Â· Buy Premium to Download</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!result}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    Download Combined CNIC {outputFormat === 'application/pdf' ? 'PDF' : 'JPG'} ({result ? `${result.fileSizeKb} KB` : 'Ready'})
                  </span>
                </button>
              )}

              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero server upload Â· 100% private in-browser generation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
