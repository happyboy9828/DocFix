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

export const PORTAL_PRESETS: PortalPreset[] = [
  {
    id: 'fpsc',
    name: 'Federal Public Service Commission (FPSC)',
    shortName: 'FPSC',
    category: 'Federal',
    country: 'Pakistan',
    iconName: 'Building2',
    description: 'Federal civil services, CSS, General Recruitment (Lecturers, Inspectors, Directors).',
    photoSpecs: {
      maxKb: 300,
      recommendedKb: 280,
      minKb: 10,
      widthPx: 150,
      heightPx: 150,
      allowedFormats: ['JPG', 'JPEG'],
      dpi: 200,
      aspectRatio: '1:1',
      bgRequirement: 'Light Blue',
      notes: 'Must be recent passport size photo with light blue or white background, size strictly under 300KB.'
    },
    signatureSpecs: {
      maxKb: 20,
      recommendedKb: 18,
      widthPx: 140,
      heightPx: 60,
      allowedFormats: ['JPG', 'JPEG'],
      notes: 'Clear black or blue ink signature on clean white paper.'
    },
    cnicSpecs: {
      maxKb: 300,
      recommendedKb: 270,
      allowedFormats: ['JPG', 'PDF'],
      layout: 'Combined Single Page',
      notes: 'Front and Back must be combined on a single file under 300KB.'
    },
    documentSpecs: {
      maxKb: 300,
      allowedFormats: ['JPG', 'PDF'],
      notes: 'Degrees and transcripts strictly under 300KB.'
    },
    commonRejectionReason: 'File size exceeding 300KB by even 1KB, or blurriness after heavy third-party compression.',
    officialPortalUrl: 'https://online.fpsc.gov.pk/'
  },
  {
    id: 'ppsc',
    name: 'Punjab Public Service Commission (PPSC)',
    shortName: 'PPSC',
    category: 'Provincial',
    country: 'Pakistan',
    iconName: 'Award',
    description: 'Punjab provincial jobs: Educators, Tehsildar, Sub-Inspectors, Medical Officers.',
    photoSpecs: {
      maxKb: 25,
      recommendedKb: 23,
      minKb: 5,
      widthPx: 150,
      heightPx: 150,
      allowedFormats: ['JPG', 'JPEG'],
      dpi: 200,
      aspectRatio: '1:1',
      bgRequirement: 'Light Blue',
      notes: 'Strict 25KB ceiling. Portal automatically aborts upload if file size exceeds 25,000 bytes.'
    },
    cnicSpecs: {
      maxKb: 25,
      recommendedKb: 24,
      allowedFormats: ['JPG', 'JPEG'],
      layout: 'Front and Back Separate',
      notes: 'CNIC front side strictly under 25KB, crisp readable text.'
    },
    documentSpecs: {
      maxKb: 25,
      allowedFormats: ['JPG', 'JPEG'],
      notes: 'Bank Challan / e-Pay receipt picture strictly under 25KB.'
    },
    commonRejectionReason: 'Image size > 25KB or unreadable text when compressed with low-tech tools.',
    officialPortalUrl: 'https://www.ppsc.gop.pk/'
  },
  {
    id: 'nts',
    name: 'National Testing Service (NTS)',
    shortName: 'NTS',
    category: 'Testing Services',
    country: 'Pakistan',
    iconName: 'ClipboardCheck',
    description: 'NAT, GAT, WAPDA, Police Department, FBR, and various Government tests.',
    photoSpecs: {
      maxKb: 50,
      recommendedKb: 45,
      minKb: 10,
      widthPx: 200,
      heightPx: 200,
      allowedFormats: ['JPG', 'JPEG'],
      dpi: 200,
      aspectRatio: '1:1',
      bgRequirement: 'Plain/Light',
      notes: 'Passport size photo not older than 6 months, under 50KB.'
    },
    cnicSpecs: {
      maxKb: 100,
      recommendedKb: 90,
      allowedFormats: ['JPG', 'JPEG'],
      layout: 'Combined Single Page',
      notes: 'CNIC copy front/back under 100KB.'
    },
    commonRejectionReason: 'File size > 50KB or uploading selfies instead of passport proportion.',
    officialPortalUrl: 'https://www.nts.org.pk/'
  },
  {
    id: 'njp',
    name: 'National Job Portal (NJP - GoP)',
    shortName: 'NJP',
    category: 'Federal',
    country: 'Pakistan',
    iconName: 'Briefcase',
    description: 'Official unified portal for Federal Ministries, Divisions, and Attached Departments.',
    photoSpecs: {
      maxKb: 300,
      recommendedKb: 285,
      minKb: 20,
      widthPx: 300,
      heightPx: 300,
      allowedFormats: ['JPG', 'JPEG', 'PNG'],
      dpi: 200,
      aspectRatio: '1:1',
      bgRequirement: 'Plain/Light',
      notes: 'Clear headshot up to 300KB with standard 1:1 aspect ratio.'
    },
    cnicSpecs: {
      maxKb: 500,
      recommendedKb: 450,
      allowedFormats: ['JPG', 'PDF'],
      layout: 'Combined Single Page',
      notes: 'Combined front + back CNIC document up to 500KB.'
    },
    documentSpecs: {
      maxKb: 1024,
      allowedFormats: ['PDF', 'JPG'],
      notes: 'Detailed CV or Educational transcripts up to 1MB.'
    },
    commonRejectionReason: 'Incorrect file extension (e.g. WEBP instead of JPG) or size above 300KB.',
    officialPortalUrl: 'https://njp.gov.pk/'
  },
  {
    id: 'spsc',
    name: 'Sindh Public Service Commission (SPSC)',
    shortName: 'SPSC',
    category: 'Provincial',
    country: 'Pakistan',
    iconName: 'GraduationCap',
    description: 'Sindh provincial civil services, CCE, Town Officers, Secondary Teachers.',
    photoSpecs: {
      maxKb: 50,
      recommendedKb: 45,
      minKb: 10,
      widthPx: 200,
      heightPx: 200,
      allowedFormats: ['JPG', 'JPEG'],
      dpi: 200,
      aspectRatio: '1:1',
      bgRequirement: 'Light Blue',
      notes: 'Formal photograph with blue background, maximum 50KB.'
    },
    signatureSpecs: {
      maxKb: 30,
      recommendedKb: 25,
      widthPx: 160,
      heightPx: 70,
      allowedFormats: ['JPG', 'JPEG'],
      notes: 'Signature on white paper, max 30KB.'
    },
    cnicSpecs: {
      maxKb: 100,
      recommendedKb: 90,
      allowedFormats: ['JPG'],
      layout: 'Either',
      notes: 'Front side or combined, under 100KB.'
    },
    commonRejectionReason: 'Wrong background color or size exceeding 50KB limit.',
    officialPortalUrl: 'https://spsc.gos.pk/'
  },
  {
    id: 'kppsc',
    name: 'Khyber Pakhtunkhwa Public Service Commission (KPPSC)',
    shortName: 'KPPSC',
    category: 'Provincial',
    country: 'Pakistan',
    iconName: 'Shield',
    description: 'KP Government posts, PMS, Tehsildars, School Leaders, Forest Officers.',
    photoSpecs: {
      maxKb: 30,
      recommendedKb: 27,
      minKb: 5,
      widthPx: 150,
      heightPx: 150,
      allowedFormats: ['JPG', 'JPEG'],
      dpi: 200,
      aspectRatio: '1:1',
      bgRequirement: 'White',
      notes: 'White background photo strictly below 30KB.'
    },
    cnicSpecs: {
      maxKb: 50,
      recommendedKb: 45,
      allowedFormats: ['JPG'],
      layout: 'Front and Back Separate',
      notes: 'Under 50KB per side.'
    },
    commonRejectionReason: 'Background not plain white or image size exceeding 30KB.',
    officialPortalUrl: 'https://kppsc.gov.pk/'
  },
  {
    id: 'bpsc',
    name: 'Balochistan Public Service Commission (BPSC)',
    shortName: 'BPSC',
    category: 'Provincial',
    country: 'Pakistan',
    iconName: 'Landmark',
    description: 'Balochistan administrative services, Assistant Commissioners, Section Officers.',
    photoSpecs: {
      maxKb: 50,
      recommendedKb: 45,
      minKb: 10,
      widthPx: 150,
      heightPx: 150,
      allowedFormats: ['JPG', 'JPEG'],
      dpi: 200,
      aspectRatio: '1:1',
      bgRequirement: 'Light Blue',
      notes: 'Passport photo with blue background, max 50KB.'
    },
    commonRejectionReason: 'Exceeding 50KB or distorted aspect ratio.',
    officialPortalUrl: 'https://bpsc.gob.pk/'
  },
  {
    id: 'css',
    name: 'CSS Examination (FPSC Central Superior Services)',
    shortName: 'CSS / CE',
    category: 'Federal',
    country: 'Pakistan',
    iconName: 'Scroll',
    description: 'Pakistan Administrative Service, Police Service, Foreign Affairs, Customs.',
    photoSpecs: {
      maxKb: 300,
      recommendedKb: 280,
      minKb: 30,
      widthPx: 300,
      heightPx: 300,
      allowedFormats: ['JPG', 'JPEG'],
      dpi: 200,
      aspectRatio: '1:1',
      bgRequirement: 'Light Blue',
      notes: 'High-contrast studio passport photo with light blue background, strictly under 300KB.'
    },
    cnicSpecs: {
      maxKb: 500,
      recommendedKb: 450,
      allowedFormats: ['PDF', 'JPG'],
      layout: 'Combined Single Page',
      notes: 'Front + Back combined NADRA Smart CNIC copy with high legibility.'
    },
    commonRejectionReason: 'Blurry text on CNIC or photo above 300KB limit.',
    officialPortalUrl: 'https://online.fpsc.gov.pk/'
  },
  {
    id: 'passport_nadra',
    name: 'Passport Office / NADRA Online / Visa',
    shortName: 'Passport / NADRA',
    category: 'Identity',
    country: 'Pakistan / Global',
    iconName: 'Globe',
    description: 'Online Machine Readable Passport (MRP) renewal, NADRA Pak-ID, foreign embassies.',
    photoSpecs: {
      maxKb: 300,
      recommendedKb: 250,
      minKb: 50,
      widthPx: 600,
      heightPx: 600,
      allowedFormats: ['JPG', 'JPEG'],
      dpi: 300,
      aspectRatio: '1:1',
      bgRequirement: 'White',
      notes: '2x2 inches (600x600 pixels) at 300 DPI, pure white background, ears visible, neutral facial expression.'
    },
    signatureSpecs: {
      maxKb: 100,
      recommendedKb: 80,
      widthPx: 300,
      heightPx: 100,
      allowedFormats: ['JPG', 'PNG'],
      notes: 'Thick black pen on pure white paper.'
    },
    commonRejectionReason: 'Shadows behind ears, non-white background, or DPI below 300.',
    officialPortalUrl: 'https://onlinemrp.dgip.gov.pk/'
  },
  {
    id: 'university_admissions',
    name: 'University Admissions (NUST, FAST, LUMS, HEC)',
    shortName: 'HEC / Universities',
    category: 'Admissions',
    country: 'Pakistan / Global',
    iconName: 'GraduationCap',
    description: 'Admissions portals, Higher Education Commission degree verification, scholarships.',
    photoSpecs: {
      maxKb: 200,
      recommendedKb: 180,
      minKb: 15,
      widthPx: 300,
      heightPx: 350,
      allowedFormats: ['JPG', 'JPEG', 'PNG'],
      dpi: 200,
      aspectRatio: '3:4',
      bgRequirement: 'Light Blue',
      notes: 'Formal blue or white background photo under 200KB.'
    },
    documentSpecs: {
      maxKb: 500,
      allowedFormats: ['PDF', 'JPG'],
      notes: 'Matric / FSc / A-Level marksheets scanned under 500KB.'
    },
    commonRejectionReason: 'Illegible transcript grades or unaccepted file format.'
  }
];

export const DOCUMENT_GUIDELINES = [
  {
    title: 'The "300KB FPSC Rule" Explained',
    tag: 'FPSC Rule',
    summary: 'Why portals reject 301KB files and how DocFix guarantees sub-300KB output.',
    content: 'Federal government recruitment portals use automated server-side file validators with strict 307,200 bytes ceilings (300KB). When applicants compress images on random websites, the output is often 305KB or degraded to 10KB pixelated soup. DocFix performs iterative binary compression to pin the exact file size at ~285KB to 295KB with maximum possible clarity.'
  },
  {
    title: 'The PPSC 25KB Hurdle',
    tag: 'PPSC 25KB',
    summary: 'Navigating Punjab Public Service Commission’s infamous 25KB restriction without losing face details.',
    content: 'PPSC has one of the strictest file size restrictions in the world: exactly 25KB for passport photo, CNIC front, and payment challan receipt. Standard JPEG compressors make text on CNIC completely unreadable at 25KB. DocFix applies an intelligent contrast boost and selective noise suppression to maintain razor-sharp text even at 23KB.'
  },
  {
    title: 'DPI (Dots Per Inch) 200 vs 300 Requirement',
    tag: 'DPI Standard',
    summary: 'What DPI means for online forms and how DocFix injects JFIF metadata.',
    content: 'Many forms specify "Minimum 200 DPI" or "300 DPI". Standard browser canvas exports omit DPI tags or default to 72 DPI. DocFix injects authentic JFIF APP0 segments directly into the JPEG binary stream, guaranteeing that Windows properties, Photoshop, and government verification bots register the exact requested 200 or 300 DPI.'
  },
  {
    title: 'CNIC Front + Back Single Page Combining',
    tag: 'CNIC Combining',
    summary: 'How to merge both sides onto one document without Photoshop or paying Rs. 150.',
    content: 'Most portals offer only ONE single file upload slot for your National Identity Card (CNIC), requiring both Front and Back to appear on a single page. DocFix automatically arranges both sides with equal aspect ratios, applies text enhancement for NADRA smart cards, and outputs a ready-to-upload single JPG or PDF under the 300KB limit.'
  },
  {
    title: 'Clear Signatures for Online Forms',
    tag: 'Signatures',
    summary: 'Removing background shadows and paper yellowing from smartphone photos of signatures.',
    content: 'Taking a phone picture of your signature often results in grey/yellow paper with harsh shadows. DocFix provides a specialized signature threshold filter that removes paper tint, enhances black/blue pen strokes, and crops to 140x60px under 20KB.'
  }
];
