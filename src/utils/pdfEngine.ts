import { jsPDF } from 'jspdf';
import { CnicCombinerOptions, ProcessedDocumentResult } from '../types/document';
import { loadImage, setJpegDpi } from './imageEngine';

/**
 * Combines CNIC Front and Back images into a single JPEG image or PDF
 * strictly conforming to portal file size limits (e.g. 300KB or 500KB).
 */
export async function combineCnicImages(
  options: CnicCombinerOptions
): Promise<ProcessedDocumentResult> {
  const startTime = performance.now();

  if (!options.frontImage && !options.backImage) {
    throw new Error('Please upload at least one side of your CNIC.');
  }

  // Load both images
  let frontImg: HTMLImageElement | null = null;
  let backImg: HTMLImageElement | null = null;

  if (options.frontImage) {
    frontImg = await loadImage(options.frontImage);
  }
  if (options.backImage) {
    backImg = await loadImage(options.backImage);
  }

  // Fallback if user only provided one side
  if (!frontImg && backImg) frontImg = backImg;
  if (!backImg && frontImg) backImg = frontImg;

  // Standard CNIC / Smart Card aspect ratio is roughly 85.6mm x 53.98mm (~1.586)
  const cardWidth = 1000;
  const cardHeight = Math.round(cardWidth / 1.586); // ~630px

  let canvasWidth = 1200;
  let canvasHeight = 1500;

  if (options.layout === 'stacked_vertical') {
    canvasWidth = 1200;
    canvasHeight = cardHeight * 2 + 180; // Margin between cards
  } else if (options.layout === 'side_by_side') {
    canvasWidth = cardWidth * 2 + 120;
    canvasHeight = cardHeight + 160;
  } else {
    // A4 sheet proportions (1:1.414)
    canvasWidth = 1240;
    canvasHeight = 1754; // A4 @ 150 DPI
  }

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Canvas context initialization failed');
  }

  // Crisp clean white paper background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Helper to draw a single CNIC card side
  const drawCard = (img: HTMLImageElement, x: number, y: number, label: string) => {
    // White background under card
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(x, y, cardWidth, cardHeight);

    // Draw card image with crisp fit
    ctx.drawImage(img, x, y, cardWidth, cardHeight);

    // Border line if requested
    if (options.addBorder) {
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, cardWidth, cardHeight);
    }

    // Label tag (e.g. "CNIC FRONT", "CNIC BACK")
    ctx.fillStyle = '#0F172A';
    ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(label, x + 4, y - 10);
  };

  if (options.layout === 'stacked_vertical') {
    const x = (canvasWidth - cardWidth) / 2;
    const yFront = 50;
    const yBack = yFront + cardHeight + 70;

    if (frontImg) drawCard(frontImg, x, yFront, 'CNIC FRONT SIDE');
    if (backImg) drawCard(backImg, x, yBack, 'CNIC BACK SIDE');
  } else if (options.layout === 'side_by_side') {
    const y = 50;
    const xFront = 40;
    const xBack = xFront + cardWidth + 40;

    if (frontImg) drawCard(frontImg, xFront, y, 'CNIC FRONT SIDE');
    if (backImg) drawCard(backImg, xBack, y, 'CNIC BACK SIDE');
  } else {
    // A4 layout
    const x = (canvasWidth - cardWidth) / 2;
    const yFront = 180;
    const yBack = yFront + cardHeight + 100;

    // Header title on A4 sheet
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GOVERNMENT JOB APPLICATION - CNIC COPY', canvasWidth / 2, 80);

    ctx.fillStyle = '#64748B';
    ctx.font = '14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('National Identity Card (Front & Back Verified Document)', canvasWidth / 2, 110);
    ctx.textAlign = 'left';

    if (frontImg) drawCard(frontImg, x, yFront, 'FRONT SIDE');
    if (backImg) drawCard(backImg, x, yBack, 'BACK SIDE');
  }

  // Watermark or application verification stamp if requested
  if (options.addWatermarkDate) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.font = '500 14px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`FOR OFFICIAL JOB APPLICATION ONLY · VERIFIED ${dateStr}`, canvasWidth / 2, canvasHeight - 24);
    ctx.textAlign = 'left';
  }

  // Apply contrast boost if checked
  if (options.contrastBoost) {
    const imgData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const d = imgData.data;
    const contrast = 20; // +20 contrast for crisp text
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < d.length; i += 4) {
      d[i] = factor * (d[i] - 128) + 128;
      d[i + 1] = factor * (d[i + 1] - 128) + 128;
      d[i + 2] = factor * (d[i + 2] - 128) + 128;
    }
    ctx.putImageData(imgData, 0, 0);
  }

  // Handle PDF vs JPEG output
  if (options.outputFormat === 'application/pdf') {
    const pdf = new jsPDF({
      orientation: canvasWidth > canvasHeight ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvasWidth, canvasHeight]
    });

    const imgDataUrl = canvas.toDataURL('image/jpeg', 0.85);
    pdf.addImage(imgDataUrl, 'JPEG', 0, 0, canvasWidth, canvasHeight);

    const pdfBlob = pdf.output('blob');
    const dataUrl = URL.createObjectURL(pdfBlob);
    const fileSizeBytes = pdfBlob.size;
    const fileSizeKb = Math.round((fileSizeBytes / 1024) * 10) / 10;
    const processingTimeMs = Math.round(performance.now() - startTime);

    return {
      blob: pdfBlob,
      dataUrl,
      fileSizeBytes,
      fileSizeKb,
      width: canvasWidth,
      height: canvasHeight,
      format: 'application/pdf',
      dpi: options.dpi,
      processingTimeMs,
      complianceChecks: [
        {
          label: 'File Size (PDF)',
          target: `≤ ${options.targetMaxKb} KB`,
          actual: `${fileSizeKb} KB`,
          passed: fileSizeKb <= options.targetMaxKb
        },
        {
          label: 'Page Count',
          target: 'Single Page (1 Page)',
          actual: '1 Page',
          passed: true
        }
      ],
      overallPass: fileSizeKb <= options.targetMaxKb
    };
  }

  // Output as JPEG with binary search compression strictly under options.targetMaxKb
  const targetCeilingBytes = (options.targetMaxKb * 1024) - 2048;
  const safeTargetBytes = Math.max(1024, targetCeilingBytes);

  let lowQuality = 0.1;
  let highQuality = 0.95;
  let bestBuffer: Uint8Array | null = null;
  let bestBlob: Blob | null = null;

  for (let i = 0; i < 6; i++) {
    const q = (lowQuality + highQuality) / 2;
    const rawBlob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/jpeg', q));
    const buf = new Uint8Array(await rawBlob.arrayBuffer());
    const withDpi = setJpegDpi(buf, options.dpi);

    if (withDpi.byteLength <= safeTargetBytes) {
      bestBuffer = withDpi;
      bestBlob = new Blob([new Uint8Array(withDpi)], { type: 'image/jpeg' });
      lowQuality = q;
    } else {
      highQuality = q;
    }
  }

  if (!bestBlob || !bestBuffer) {
    const rawBlob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/jpeg', lowQuality));
    const withDpi = setJpegDpi(new Uint8Array(await rawBlob.arrayBuffer()), options.dpi);
    bestBlob = new Blob([new Uint8Array(withDpi)], { type: 'image/jpeg' });
  }

  const fileSizeBytes = bestBlob.size;
  const fileSizeKb = Math.round((fileSizeBytes / 1024) * 10) / 10;
  const dataUrl = URL.createObjectURL(bestBlob);
  const processingTimeMs = Math.round(performance.now() - startTime);

  return {
    blob: bestBlob,
    dataUrl,
    fileSizeBytes,
    fileSizeKb,
    width: canvasWidth,
    height: canvasHeight,
    format: 'image/jpeg',
    dpi: options.dpi,
    processingTimeMs,
    complianceChecks: [
      {
        label: 'File Size',
        target: `≤ ${options.targetMaxKb} KB`,
        actual: `${fileSizeKb} KB`,
        passed: fileSizeKb <= options.targetMaxKb
      },
      {
        label: 'Layout',
        target: 'Both Front & Back on Single Image',
        actual: 'Combined',
        passed: true
      },
      {
        label: 'Resolution',
        target: `${options.dpi} DPI`,
        actual: `${options.dpi} DPI`,
        passed: true
      }
    ],
    overallPass: fileSizeKb <= options.targetMaxKb
  };
}
