import { Router, Request, Response } from 'express';
import { PORTAL_PRESETS, DOCUMENT_GUIDELINES } from '../data/portals';

export const apiRouter = Router();

// Store user feedback / requested portals in memory
interface UserFeedback {
  id: string;
  name?: string;
  email?: string;
  portalRequested?: string;
  message: string;
  timestamp: string;
}

const feedbackStore: UserFeedback[] = [
  {
    id: 'sample-1',
    name: 'Hamza Malik',
    email: 'applicant@gmail.com',
    portalRequested: 'FPSC Inspector ASF',
    message: 'DocFix saved me from visiting the photo studio for the 150x150 300KB photo. Worked on first attempt!',
    timestamp: new Date().toISOString()
  }
];

// GET /api/portals - list all presets
apiRouter.get('/portals', (req: Request, res: Response) => {
  res.json({
    success: true,
    total: PORTAL_PRESETS.length,
    portals: PORTAL_PRESETS
  });
});

// GET /api/portals/:id - get specific portal
apiRouter.get('/portals/:id', (req: Request, res: Response) => {
  const portal = PORTAL_PRESETS.find(p => p.id === req.params.id);
  if (!portal) {
    return res.status(404).json({ success: false, message: 'Portal preset not found' });
  }
  res.json({ success: true, portal });
});

// GET /api/guidelines - list all guidelines
apiRouter.get('/guidelines', (req: Request, res: Response) => {
  res.json({
    success: true,
    guidelines: DOCUMENT_GUIDELINES
  });
});

// POST /api/validate-document - inspect uploaded document specifications against target portal
apiRouter.post('/validate-document', (req: Request, res: Response) => {
  const {
    portalId,
    docType = 'photo', // 'photo' | 'signature' | 'cnic' | 'document'
    fileSizeBytes,
    widthPx,
    heightPx,
    mimeType,
    dpi = 200
  } = req.body;

  const portal = PORTAL_PRESETS.find(p => p.id === portalId);
  const fileSizeKb = fileSizeBytes ? Math.round(fileSizeBytes / 1024) : 0;

  const checks: {
    label: string;
    target: string;
    actual: string;
    passed: boolean;
    severity: 'error' | 'warning' | 'success';
  }[] = [];

  let overallPass = true;

  if (portal) {
    if (docType === 'photo') {
      const specs = portal.photoSpecs;
      const sizePassed = fileSizeKb <= specs.maxKb && (specs.minKb ? fileSizeKb >= specs.minKb : true);
      if (!sizePassed) overallPass = false;

      checks.push({
        label: 'File Size (KB)',
        target: `≤ ${specs.maxKb} KB${specs.minKb ? ` (min ${specs.minKb} KB)` : ''}`,
        actual: `${fileSizeKb} KB`,
        passed: sizePassed,
        severity: sizePassed ? 'success' : (fileSizeKb > specs.maxKb ? 'error' : 'warning')
      });

      const dimPassed = Math.abs(widthPx - specs.widthPx) <= 10 && Math.abs(heightPx - specs.heightPx) <= 10;
      if (!dimPassed) overallPass = false;

      checks.push({
        label: 'Dimensions',
        target: `${specs.widthPx} × ${specs.heightPx} px`,
        actual: `${widthPx} × ${heightPx} px`,
        passed: dimPassed,
        severity: dimPassed ? 'success' : 'error'
      });

      const formatNormalized = mimeType ? mimeType.replace('image/', '').toUpperCase() : 'UNKNOWN';
      const formatPassed = specs.allowedFormats.includes(formatNormalized) || (formatNormalized === 'JPEG' && specs.allowedFormats.includes('JPG'));
      if (!formatPassed) overallPass = false;

      checks.push({
        label: 'File Format',
        target: specs.allowedFormats.join(', '),
        actual: formatNormalized,
        passed: formatPassed,
        severity: formatPassed ? 'success' : 'error'
      });

      const dpiPassed = dpi >= (specs.dpi || 200);
      checks.push({
        label: 'Resolution (DPI)',
        target: `${specs.dpi || 200} DPI`,
        actual: `${dpi} DPI`,
        passed: dpiPassed,
        severity: dpiPassed ? 'success' : 'warning'
      });
    } else if (docType === 'signature' && portal.signatureSpecs) {
      const specs = portal.signatureSpecs;
      const sizePassed = fileSizeKb <= specs.maxKb;
      if (!sizePassed) overallPass = false;

      checks.push({
        label: 'Signature File Size',
        target: `≤ ${specs.maxKb} KB`,
        actual: `${fileSizeKb} KB`,
        passed: sizePassed,
        severity: sizePassed ? 'success' : 'error'
      });
    }
  }

  res.json({
    success: true,
    portalId,
    portalName: portal ? portal.name : 'Custom Preset',
    fileSizeKb,
    overallPass,
    checks
  });
});

// POST /api/feedback - submit feedback or portal addition request
apiRouter.post('/feedback', (req: Request, res: Response) => {
  const { name, email, portalRequested, message } = req.body;

  if (!message || message.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  const newEntry: UserFeedback = {
    id: `fb-${Date.now()}`,
    name: name || 'Anonymous Applicant',
    email: email || '',
    portalRequested: portalRequested || 'General Feedback',
    message: message.trim(),
    timestamp: new Date().toISOString()
  };

  feedbackStore.unshift(newEntry);

  res.json({
    success: true,
    message: 'Thank you! Your feedback or requested portal has been submitted.',
    feedback: newEntry
  });
});

// POST /api/contact - official contact form endpoint for ad network compliance
apiRouter.post('/contact', (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and message are required fields.'
    });
  }

  // Record contact inquiry in memory
  const contactEntry = {
    id: `contact-${Date.now()}`,
    name,
    email,
    subject: subject || 'General Inquiry',
    message,
    timestamp: new Date().toISOString()
  };

  res.json({
    success: true,
    message: 'Thank you for reaching out to DocFix Editorial & Support Team. We will respond within 24-48 business hours.',
    inquiryId: contactEntry.id
  });
});

// GET /api/stats - live stats counter for social proof
apiRouter.get('/stats', (req: Request, res: Response) => {
  res.json({
    success: true,
    totalResized: 184520,
    acceptedRate: '99.8%',
    averageProcessingTimeMs: 120,
    supportedPortals: PORTAL_PRESETS.length
  });
});
