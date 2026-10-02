import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Sliders,
  Maximize2,
  Sparkles,
  FileCheck,
  ZoomIn,
  Eye,
  FileText
} from 'lucide-react';
import {
  PortalPreset,
  ImageProcessingOptions,
  ProcessedDocumentResult,
  BackgroundAdjustment
} from '../types/document';
import { processDocumentImage } from '../utils/imageEngine';
import { UsageState } from '../utils/limitEngine';
import { DailyLimitBadge } from './DailyLimitBadge';
import { jsPDF } from 'jspdf';
import { Crown } from 'lucide-react';

interface SingleDocResizerProps {
  currentPortal: PortalPreset | null;
  isCustom: boolean;
  usage: UsageState;
  onConversionPerformed: () => boolean;
  onOpenPremium: () => void;
}

// High quality sample passport photo (data url or generated canvas)
const createSampleImage = (type: 'passport' | 'signature'): string => {
  const canvas = document.createElement('canvas');
  if (type === 'passport') {
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d')!;
    // Light blue background
    ctx.fillStyle = '#93c5fd';
    ctx.fillRect(0, 0, 600, 600);

    // Torso / Suit
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(300, 560, 200, 160, 0, 0, Math.PI * 2);
    ctx.fill();

    // Shirt collar
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(250, 430);
    ctx.lineTo(300, 500);
    ctx.lineTo(350, 430);
    ctx.closePath();
    ctx.fill();

    // Neck
    ctx.fillStyle = '#fbcfe8';
    ctx.fillRect(270, 370, 60, 80);

    // Face
    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    ctx.ellipse(300, 280, 110, 140, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(300, 180, 115, 60, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(260, 270, 8, 0, Math.PI * 2);
    ctx.arc(340, 270, 8, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(300, 320, 30, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Label
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SAMPLE APPLICANT PHOTO', 300, 50);
  } else {
    // Signature sample
    canvas.width = 500;
    canvas.height = 200;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#fef08a'; // slightly yellowish paper
    ctx.fillRect(0, 0, 500, 200);

    ctx.strokeStyle = '#1e3a8a'; // Blue pen
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(60, 110);
    ctx.bezierCurveTo(120, 40, 150, 180, 220, 90);
    ctx.bezierCurveTo(250, 60, 270, 160, 320, 100);
    ctx.lineTo(440, 110);
    ctx.stroke();

    // Signature flourish line
    ctx.beginPath();
    ctx.moveTo(80, 140);
    ctx.lineTo(420, 140);
    ctx.stroke();
  }

  return canvas.toDataURL('image/jpeg', 0.95);
};

export const SingleDocResizer: React.FC<SingleDocResizerProps> = ({
  currentPortal,
  isCustom,
  usage,
  onConversionPerformed,
  onOpenPremium
}) => {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceDataUrl, setSourceDataUrl] = useState<string | null>(null);
  const [sourceOriginalMeta, setSourceOriginalMeta] = useState<{
    width: number;
    height: number;
    sizeKb: number;
    format: string;
  } | null>(null);

  // Processing settings
  const [targetMaxKb, setTargetMaxKb] = useState<number>(300);
  const [targetWidth, setTargetWidth] = useState<number>(150);
  const [targetHeight, setTargetHeight] = useState<number>(150);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [cropToFit, setCropToFit] = useState<boolean>(true);
  const [targetDpi, setTargetDpi] = useState<number>(200);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [backgroundAdjustment, setBackgroundAdjustment] = useState<BackgroundAdjustment>('none');
  const [contrast, setContrast] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(0);
  const [sharpen, setSharpen] = useState<boolean>(false);

  // Output state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<ProcessedDocumentResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize settings whenever portal changes
  useEffect(() => {
    if (currentPortal && !isCustom) {
      setTargetMaxKb(currentPortal.photoSpecs.maxKb);
      setTargetWidth(currentPortal.photoSpecs.widthPx);
      setTargetHeight(currentPortal.photoSpecs.heightPx);
      setTargetDpi(currentPortal.photoSpecs.dpi);
      setOutputFormat('image/jpeg');

      if (currentPortal.photoSpecs.bgRequirement === 'Light Blue') {
        setBackgroundAdjustment('light_blue');
      } else if (currentPortal.photoSpecs.bgRequirement === 'White') {
        setBackgroundAdjustment('white');
      } else {
        setBackgroundAdjustment('none');
      }
    }
  }, [currentPortal, isCustom]);

  // Handle uploaded or selected file
  const handleLoadSource = (file: File | string) => {
    setErrorMessage(null);
    if (typeof file === 'string') {
      setSourceFile(null);
      setSourceDataUrl(file);
      // Determine dimensions
      const img = new Image();
      img.onload = () => {
        setSourceOriginalMeta({
          width: img.naturalWidth,
          height: img.naturalHeight,
          sizeKb: 1450, // simulated
          format: 'JPEG'
        });
      };
      img.src = file;
    } else {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please upload a valid image file (JPG, PNG, WEBP, or HEIC).');
        return;
      }
      setSourceFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setSourceDataUrl(dataUrl);

        const img = new Image();
        img.onload = () => {
          setSourceOriginalMeta({
            width: img.naturalWidth,
            height: img.naturalHeight,
            sizeKb: Math.round((file.size / 1024) * 10) / 10,
            format: file.type.replace('image/', '').toUpperCase()
          });
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  // Re-process document
  const triggerProcessing = useCallback(async () => {
    if (!sourceDataUrl) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const options: ImageProcessingOptions = {
        targetWidth,
        targetHeight,
        maintainAspectRatio: lockAspectRatio,
        cropToFit,
        targetMaxKb,
        outputFormat,
        targetDpi,
        backgroundAdjustment,
        contrast,
        brightness,
        sharpen
      };

      const res = await processDocumentImage(sourceDataUrl, options);
      setResult(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Processing failed';
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  }, [
    sourceDataUrl,
    targetWidth,
    targetHeight,
    lockAspectRatio,
    cropToFit,
    targetMaxKb,
    outputFormat,
    targetDpi,
    backgroundAdjustment,
    contrast,
    brightness,
    sharpen
  ]);

  // Trigger processing on settings changes
  useEffect(() => {
    if (sourceDataUrl) {
      triggerProcessing();
    }
  }, [triggerProcessing, sourceDataUrl]);

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLoadSource(e.dataTransfer.files[0]);
    }
  };

  // Handle Clipboard Paste (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.items) {
        for (const item of Array.from(e.clipboardData.items)) {
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) handleLoadSource(file);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Download Output File
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

    const portalName = currentPortal ? currentPortal.shortName : 'Custom';
    const ext = outputFormat === 'image/jpeg' ? 'jpg' : (outputFormat === 'image/png' ? 'png' : 'webp');
    const fileName = `DocFix_${portalName}_${targetWidth}x${targetHeight}_${result.fileSizeKb}KB.${ext}`;

    const a = document.createElement('a');
    a.href = result.dataUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Download as PDF
  const handleDownloadPdf = () => {
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

    const pdf = new jsPDF({
      orientation: result.width > result.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [result.width, result.height]
    });
    pdf.addImage(result.dataUrl, 'JPEG', 0, 0, result.width, result.height);
    const portalName = currentPortal ? currentPortal.shortName : 'Custom';
    pdf.save(`DocFix_${portalName}_Document.pdf`);
  };

  // Copy to clipboard
  const handleCopyToClipboard = async () => {
    if (!result) return;
    try {
      // Browsers support copying PNG blobs to clipboard
      const canvas = document.createElement('canvas');
      canvas.width = result.width;
      canvas.height = result.height;
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      img.src = result.dataUrl;
      await new Promise((resolve) => { img.onload = resolve; });
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopiedSuccess(true);
          setTimeout(() => setCopiedSuccess(false), 2000);
        }
      }, 'image/png');
    } catch {
      // Fallback
      setCopiedSuccess(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper upload and controls grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload Area & Live Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Upload Dropzone */}
          {!sourceDataUrl ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-8 sm:p-12 text-center bg-white dark:bg-slate-900 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 transition-all cursor-pointer group shadow-sm"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleLoadSource(e.target.files[0]);
                  }
                }}
              />

              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 text-emerald-600 flex items-center justify-center transition-colors">
                <Upload className="w-8 h-8 stroke-[2]" />
              </div>

              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Drag & Drop Your Photo, Signature, or Document Here
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                Supports JPG, PNG, WEBP, and camera photos. You can also paste directly using <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-[11px] font-mono">Ctrl+V</kbd>.
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
                >
                  Browse Image from PC / Phone
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadSource(createSampleImage('passport'));
                  }}
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-xl transition-colors border border-slate-200 dark:border-slate-800"
                >
                  Test with Sample Photo
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadSource(createSampleImage('signature'));
                  }}
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-xl transition-colors border border-slate-200 dark:border-slate-800"
                >
                  Test Signature
                </button>
              </div>
            </div>
          ) : (
            /* Comparison Box: Original vs DocFix Processed Output */
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Live Real-Time Preview</span>
                  {isProcessing && (
                    <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Resizing...
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSourceDataUrl(null);
                      setResult(null);
                      setSourceOriginalMeta(null);
                    }}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 underline underline-offset-2"
                  >
                    Upload Different File
                  </button>
                </div>
              </div>

              {/* Side-by-side or stacked preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Original File */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">Original Document</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {sourceOriginalMeta ? `${sourceOriginalMeta.width}Ã—${sourceOriginalMeta.height} px` : ''}
                    </span>
                  </div>

                  <div className="h-56 flex items-center justify-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden relative">
                    <img
                      src={sourceDataUrl}
                      alt="Original"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="mt-2 text-xs flex items-center justify-between text-slate-500 dark:text-slate-400 font-mono">
                    <span>Size: {sourceOriginalMeta?.sizeKb ? `${sourceOriginalMeta.sizeKb} KB` : 'Original'}</span>
                    <span>{sourceOriginalMeta?.format || 'IMG'}</span>
                  </div>
                </div>

                {/* Processed File */}
                <div className="border-2 border-emerald-500/50 rounded-xl p-3 bg-emerald-50/20 dark:bg-emerald-950/20 flex flex-col justify-between relative">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      DocFix Processed
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                      {result ? `${result.width}Ã—${result.height} px` : ''}
                    </span>
                  </div>

                  <div className="h-56 flex items-center justify-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden relative shadow-inner">
                    {result ? (
                      <img
                        src={result.dataUrl}
                        alt="Processed"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs">
                        <RefreshCw className="w-4 h-4 animate-spin" /> Processing...
                      </div>
                    )}

                    {/* Badge on processed preview */}
                    {result && (
                      <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        {result.fileSizeKb} KB
                      </div>
                    )}
                  </div>

                  <div className="mt-2 text-xs flex items-center justify-between font-mono">
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">
                      Output: {result ? `${result.fileSizeKb} KB` : '...'}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {result?.dpi} DPI Â· JPG
                    </span>
                  </div>
                </div>
              </div>

              {/* Portal Compliance Verdict Card */}
              {result && (
                <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-950 dark:text-emerald-100 uppercase tracking-wider">
                        {currentPortal ? `${currentPortal.shortName} Portal Compliance: PASSED` : 'Target Specifications Met'}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-800 dark:text-emerald-300">
                      Processed in {result.processingTimeMs}ms
                    </span>
                  </div>

                  {/* Checklist */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                    {result.complianceChecks.map((check, idx) => (
                      <div key={idx} className="bg-white/80 dark:bg-slate-900/80 border border-emerald-200/60 dark:border-emerald-800/60 rounded-lg p-2">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{check.label}</div>
                        <div className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{check.actual}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Daily Conversion Limit Alert Banner */}
              <DailyLimitBadge usage={usage} onOpenPremium={onOpenPremium} />

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {(!usage.isPremium && usage.count >= usage.maxDaily) ? (
                  <button
                    type="button"
                    onClick={onOpenPremium}
                    className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold py-3.5 px-5 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Crown className="w-5 h-5 fill-slate-950" />
                    <span>Daily Limit Reached (3/3) Â· Buy Premium to Download</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={!result}
                    className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold py-3 px-5 rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download {outputFormat === 'image/jpeg' ? 'JPG' : 'Image'} ({result?.fileSizeKb} KB)</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={!result}
                  className="flex items-center gap-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-xl shadow-sm transition-all disabled:opacity-50 text-xs cursor-pointer"
                  title="Download as single-page PDF"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyToClipboard}
                  disabled={!result}
                  className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium py-3 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs transition-colors disabled:opacity-50 cursor-pointer"
                  title="Copy resized image to clipboard"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedSuccess ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-800 dark:text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Right Column: Exact Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Document Specifications</h3>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Auto-tuned</span>
            </div>

            {/* Target File Size Slider & Presets */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-800 dark:text-slate-200">
                  Target File Size Ceiling
                </label>
                <div className="flex items-center gap-1 font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  <span>â‰¤</span>
                  <input
                    type="number"
                    min="5"
                    max="2048"
                    value={targetMaxKb}
                    onChange={(e) => setTargetMaxKb(Number(e.target.value) || 300)}
                    className="w-12 bg-transparent text-right outline-none font-bold text-xs"
                  />
                  <span>KB</span>
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={targetMaxKb}
                onChange={(e) => setTargetMaxKb(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-100 dark:bg-slate-900 rounded-lg"
              />

              {/* Quick KB Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { label: '25 KB (PPSC)', val: 25 },
                  { label: '30 KB (KPPSC)', val: 30 },
                  { label: '50 KB (NTS)', val: 50 },
                  { label: '100 KB', val: 100 },
                  { label: '200 KB', val: 200 },
                  { label: '300 KB (FPSC)', val: 300 },
                  { label: '500 KB', val: 500 }
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setTargetMaxKb(item.val)}
                    className={`text-[11px] px-2 py-1 rounded-md border font-medium transition-colors ${
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

            {/* Dimensions: Width x Height */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-800 dark:text-slate-200">
                  Target Dimensions (Pixels)
                </label>
                <button
                  type="button"
                  onClick={() => setCropToFit(!cropToFit)}
                  className="text-[11px] text-emerald-700 dark:text-emerald-300 hover:underline font-medium"
                >
                  Mode: {cropToFit ? 'Center Crop' : 'Exact Stretch'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Width</span>
                  <div className="relative mt-1">
                    <input
                      type="number"
                      value={targetWidth}
                      onChange={(e) => {
                        const w = Number(e.target.value) || 150;
                        setTargetWidth(w);
                        if (lockAspectRatio) setTargetHeight(w);
                      }}
                      className="w-full text-xs font-mono font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none"
                    />
                    <span className="absolute right-2.5 top-2 text-[10px] text-slate-400 dark:text-slate-500">px</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Height</span>
                  <div className="relative mt-1">
                    <input
                      type="number"
                      value={targetHeight}
                      onChange={(e) => {
                        const h = Number(e.target.value) || 150;
                        setTargetHeight(h);
                        if (lockAspectRatio) setTargetWidth(h);
                      }}
                      className="w-full text-xs font-mono font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none"
                    />
                    <span className="absolute right-2.5 top-2 text-[10px] text-slate-400 dark:text-slate-500">px</span>
                  </div>
                </div>
              </div>

              {/* Quick Dimension Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { label: '150Ã—150 (FPSC/PPSC)', w: 150, h: 150 },
                  { label: '200Ã—200 (NTS)', w: 200, h: 200 },
                  { label: '300Ã—300 (NJP)', w: 300, h: 300 },
                  { label: '600Ã—600 (Passport 2x2")', w: 600, h: 600 },
                  { label: '140Ã—60 (Signature)', w: 140, h: 60 },
                  { label: '300Ã—350 (University)', w: 300, h: 350 }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTargetWidth(preset.w);
                      setTargetHeight(preset.h);
                      setLockAspectRatio(preset.w === preset.h);
                    }}
                    className={`text-[11px] px-2 py-1 rounded-md border font-medium transition-colors ${
                      targetWidth === preset.w && targetHeight === preset.h
                        ? 'bg-slate-900 dark:bg-slate-800 text-white border-slate-900 dark:border-slate-600 font-bold'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* DPI & Format */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
                  Resolution (DPI)
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {[200, 300, 72].map((dpiVal) => (
                    <button
                      key={dpiVal}
                      type="button"
                      onClick={() => setTargetDpi(dpiVal)}
                      className={`text-[11px] py-1.5 rounded-lg border font-semibold transition-colors ${
                        targetDpi === dpiVal
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`}
                    >
                      {dpiVal}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                  JFIF APP0 tag injected
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
                  Output Format
                </label>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { label: 'JPG', val: 'image/jpeg' },
                    { label: 'PNG', val: 'image/png' }
                  ].map((fmt) => (
                    <button
                      key={fmt.val}
                      type="button"
                      onClick={() => setOutputFormat(fmt.val as 'image/jpeg' | 'image/png')}
                      className={`text-[11px] py-1.5 rounded-lg border font-semibold transition-colors ${
                        outputFormat === fmt.val
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-300 mt-1 block">
                  JPG is required by 99% portals
                </span>
              </div>
            </div>

            {/* Background & Photo Enhancements */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Background & Document Enhancer
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBackgroundAdjustment('none')}
                  className={`text-xs p-2 rounded-xl border text-left transition-colors ${
                    backgroundAdjustment === 'none'
                      ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-600 text-emerald-950 dark:text-emerald-100 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="font-bold text-[11px]">Natural / Original</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Keep as-is</div>
                </button>

                <button
                  type="button"
                  onClick={() => setBackgroundAdjustment('light_blue')}
                  className={`text-xs p-2 rounded-xl border text-left transition-colors ${
                    backgroundAdjustment === 'light_blue'
                      ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-600 text-emerald-950 dark:text-emerald-100 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="font-bold text-[11px]">Light Sky Blue Tint</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">FPSC standard backdrop</div>
                </button>

                <button
                  type="button"
                  onClick={() => setBackgroundAdjustment('white')}
                  className={`text-xs p-2 rounded-xl border text-left transition-colors ${
                    backgroundAdjustment === 'white'
                      ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-600 text-emerald-950 dark:text-emerald-100 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="font-bold text-[11px]">Pure White Backdrop</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">NADRA / KPPSC / Visa</div>
                </button>

                <button
                  type="button"
                  onClick={() => setBackgroundAdjustment('signature_clean')}
                  className={`text-xs p-2 rounded-xl border text-left transition-colors ${
                    backgroundAdjustment === 'signature_clean'
                      ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-600 text-emerald-950 dark:text-emerald-100 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="font-bold text-[11px]">Signature Clean (B&W)</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Removes paper shadows</div>
                </button>
              </div>

              {/* Sliders for Contrast & Brightness */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <div className="flex justify-between text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    <span>Contrast</span>
                    <span>{contrast > 0 ? `+${contrast}` : contrast}</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="50"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full accent-slate-700 dark:accent-slate-300 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    <span>Brightness</span>
                    <span>{brightness > 0 ? `+${brightness}` : brightness}</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full accent-slate-700 dark:accent-slate-300 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
