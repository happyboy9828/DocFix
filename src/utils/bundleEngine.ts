import JSZip from 'jszip';
import { PortalPreset, ProcessedDocumentResult } from '../types/document';
import { processDocumentImage } from './imageEngine';
import { combineCnicImages } from './pdfEngine';

export interface BundleItemInput {
  type: 'photo' | 'signature' | 'cnic_front' | 'cnic_back' | 'degree_challan';
  label: string;
  file: File | null;
  previewUrl: string | null;
}

export interface BundleProcessedItem {
  id: string;
  name: string;
  fileName: string;
  result: ProcessedDocumentResult;
}

export async function processJobBundle(
  portal: PortalPreset,
  inputs: {
    photo: File | null;
    signature: File | null;
    cnicFront: File | null;
    cnicBack: File | null;
    degreeChallan: File | null;
  }
): Promise<BundleProcessedItem[]> {
  const processedItems: BundleProcessedItem[] = [];

  // 1. Photo
  if (inputs.photo) {
    const photoResult = await processDocumentImage(inputs.photo, {
      targetWidth: portal.photoSpecs.widthPx,
      targetHeight: portal.photoSpecs.heightPx,
      maintainAspectRatio: false,
      cropToFit: true,
      targetMaxKb: portal.photoSpecs.maxKb,
      outputFormat: 'image/jpeg',
      targetDpi: portal.photoSpecs.dpi,
      backgroundAdjustment: portal.photoSpecs.bgRequirement === 'Light Blue' ? 'light_blue' : (portal.photoSpecs.bgRequirement === 'White' ? 'white' : 'none'),
      contrast: 5,
      brightness: 2,
      sharpen: true
    });

    processedItems.push({
      id: 'photo',
      name: `${portal.shortName} Passport Photo`,
      fileName: `${portal.shortName}_Photo_${portal.photoSpecs.widthPx}x${portal.photoSpecs.heightPx}.jpg`,
      result: photoResult
    });
  }

  // 2. Signature
  if (inputs.signature && portal.signatureSpecs) {
    const sigResult = await processDocumentImage(inputs.signature, {
      targetWidth: portal.signatureSpecs.widthPx,
      targetHeight: portal.signatureSpecs.heightPx,
      maintainAspectRatio: true,
      cropToFit: false,
      targetMaxKb: portal.signatureSpecs.maxKb,
      outputFormat: 'image/jpeg',
      targetDpi: 200,
      backgroundAdjustment: 'signature_clean',
      contrast: 25,
      brightness: 10,
      sharpen: true
    });

    processedItems.push({
      id: 'signature',
      name: `${portal.shortName} Signature`,
      fileName: `${portal.shortName}_Signature_${portal.signatureSpecs.widthPx}x${portal.signatureSpecs.heightPx}.jpg`,
      result: sigResult
    });
  }

  // 3. CNIC Front & Back
  if (inputs.cnicFront || inputs.cnicBack) {
    const frontUrl = inputs.cnicFront ? URL.createObjectURL(inputs.cnicFront) : null;
    const backUrl = inputs.cnicBack ? URL.createObjectURL(inputs.cnicBack) : null;

    const cnicResult = await combineCnicImages({
      frontImage: frontUrl,
      backImage: backUrl,
      layout: 'stacked_vertical',
      targetMaxKb: portal.cnicSpecs?.maxKb || 300,
      outputFormat: 'image/jpeg',
      addBorder: true,
      addWatermarkDate: true,
      contrastBoost: true,
      dpi: 200
    });

    processedItems.push({
      id: 'cnic',
      name: `${portal.shortName} CNIC Front+Back Combined`,
      fileName: `${portal.shortName}_CNIC_Combined_SinglePage.jpg`,
      result: cnicResult
    });
  }

  // 4. Degree / Challan
  if (inputs.degreeChallan) {
    const targetKb = portal.documentSpecs?.maxKb || 300;
    const docResult = await processDocumentImage(inputs.degreeChallan, {
      targetWidth: 1240,
      targetHeight: 1754,
      maintainAspectRatio: true,
      cropToFit: false,
      targetMaxKb: targetKb,
      outputFormat: 'image/jpeg',
      targetDpi: 200,
      backgroundAdjustment: 'none',
      contrast: 15,
      brightness: 5,
      sharpen: true
    });

    processedItems.push({
      id: 'degree',
      name: `${portal.shortName} Degree / Challan Document`,
      fileName: `${portal.shortName}_Document_${targetKb}KB.jpg`,
      result: docResult
    });
  }

  return processedItems;
}

/**
 * Packs all processed items into a single ZIP file for 1-click download
 */
export async function downloadZipBundle(
  portalName: string,
  items: BundleProcessedItem[]
): Promise<Blob> {
  const zip = new JSZip();
  const folder = zip.folder(`DocFix_${portalName}_Application_Kit`);

  for (const item of items) {
    const arrayBuf = await item.result.blob.arrayBuffer();
    folder?.file(item.fileName, arrayBuf);
  }

  // Add a helpful readme text
  const readme = `DocFix Application Kit for ${portalName}
===========================================
All files processed according to official ${portalName} portal guidelines.
- Guaranteed under file size ceilings (KB)
- Injected 200/300 DPI metadata
- Proper dimensions and standard JPEG format

Generated on ${new Date().toLocaleString()} with DocFix (Government Job Document Resizer).
Official compliance guaranteed. Good luck with your job test & interview!
`;
  folder?.file('INSTRUCTIONS_READ_ME.txt', readme);

  return zip.generateAsync({ type: 'blob' });
}
