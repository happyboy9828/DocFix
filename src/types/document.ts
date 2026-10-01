export interface PortalPreset {
  id: string;
  name: string;
  shortName: string;
  category: 'Federal' | 'Provincial' | 'Testing Services' | 'Admissions' | 'Identity';
  country: string;
  iconName: string;
  description: string;
  photoSpecs: {
    maxKb: number;
    recommendedKb: number;
    minKb?: number;
    widthPx: number;
    heightPx: number;
    allowedFormats: string[];
    dpi: number;
    aspectRatio: string;
    bgRequirement: 'Light Blue' | 'White' | 'Plain/Light' | 'Any';
    notes: string;
  };
  signatureSpecs?: {
    maxKb: number;
    recommendedKb: number;
    widthPx: number;
    heightPx: number;
    allowedFormats: string[];
    notes: string;
  };
  cnicSpecs?: {
    maxKb: number;
    recommendedKb: number;
    allowedFormats: string[];
    layout: 'Combined Single Page' | 'Front and Back Separate' | 'Either';
    notes: string;
  };
  documentSpecs?: {
    maxKb: number;
    allowedFormats: string[];
    notes: string;
  };
  commonRejectionReason: string;
  officialPortalUrl?: string;
}

export type DocType = 'photo' | 'signature' | 'cnic' | 'document' | 'custom';

export type BackgroundAdjustment = 'none' | 'white' | 'light_blue' | 'signature_clean';

export interface ImageProcessingOptions {
  targetWidth: number;
  targetHeight: number;
  maintainAspectRatio: boolean;
  cropToFit: boolean;
  targetMaxKb: number;
  exactTargetKb?: number;
  outputFormat: 'image/jpeg' | 'image/png' | 'image/webp' | 'application/pdf';
  targetDpi: number; // e.g. 200, 300, 72
  backgroundAdjustment: BackgroundAdjustment;
  contrast: number; // -50 to 50
  brightness: number; // -50 to 50
  sharpen: boolean;
}

export interface ProcessedDocumentResult {
  blob: Blob;
  dataUrl: string;
  fileSizeBytes: number;
  fileSizeKb: number;
  width: number;
  height: number;
  format: string;
  dpi: number;
  processingTimeMs: number;
  complianceChecks: {
    label: string;
    target: string;
    actual: string;
    passed: boolean;
  }[];
  overallPass: boolean;
}

export interface CnicCombinerOptions {
  frontImage: string | null;
  backImage: string | null;
  frontFile?: File | null;
  backFile?: File | null;
  layout: 'side_by_side' | 'stacked_vertical' | 'a4_sheet';
  targetMaxKb: number;
  outputFormat: 'image/jpeg' | 'application/pdf';
  addBorder: boolean;
  addWatermarkDate: boolean;
  contrastBoost: boolean;
  dpi: number;
}
