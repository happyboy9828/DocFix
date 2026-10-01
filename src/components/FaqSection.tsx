import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    category: 'FPSC & PPSC Rules',
    question: 'Why does FPSC reject my photograph if it is 301 KB?',
    answer: 'The Federal Public Service Commission (FPSC) automated online portal runs an automated byte-validator on incoming file streams with a hard-coded limit of 300 Kilobytes (307,200 bytes). If an image file has even a single byte over 307,200, the server throws an unrecoverable upload error. Generic online compressors frequently produce 302KB or 305KB files. DocFix uses an iterative binary search compressor that deliberately targets 285KB to 295KB, ensuring your file is safe from rejection.'
  },
  {
    category: 'FPSC & PPSC Rules',
    question: 'How does DocFix compress images to PPSC’s strict 25KB without making them blurry?',
    answer: 'PPSC has one of the strictest ceilings in Pakistan: exactly 25KB for passport photos, CNIC front, and bank challan receipts. Typical compressors reduce the overall image quality to 10%, causing faces and numbers to become a blurry smear. DocFix first resizes the canvas to exactly 150x150 pixels (the official PPSC dimension requirement), applies an unsharp mask filter on text edges, and applies high-density Chroma subsampling to preserve readable facial and numeric features at 23KB.'
  },
  {
    category: 'Technical & DPI',
    question: 'What is 200 DPI and why do government portals demand it?',
    answer: 'DPI stands for Dots Per Inch, measuring print resolution. Testing service scanners and immigration authorities require 200 or 300 DPI to ensure that printed admit cards and exam attendance sheets display sharp photographs. Most standard web browsers export canvas images with default 72 DPI metadata. DocFix modifies the JPEG binary header (specifically the JFIF APP0 segment at bytes 2-18) to inject authentic 200 DPI or 300 DPI density tags that operating systems and verification bots recognize.'
  },
  {
    category: 'Privacy & Security',
    question: 'Is it safe to upload my CNIC, signature, and educational degrees to DocFix?',
    answer: 'Yes, 100% safe. DocFix was specifically architected with a decentralized, zero-server-upload model. When you drag and drop your CNIC or photograph, the file is read directly into your device’s local browser memory. No image data is transmitted across the internet to our servers. Once you close the tab, all image buffers in your device RAM are completely cleared.'
  },
  {
    category: 'CNIC Merging',
    question: 'How do I combine the front and back of my CNIC for FPSC and NTS applications?',
    answer: 'Most government job applications only provide a single file upload slot for your National Identity Card. DocFix provides a dedicated CNIC Combiner tool. Simply upload the front picture and back picture from your phone. DocFix automatically scales both cards to their standard 85.6mm x 54mm aspect ratio, arranges them in a vertical stack or side-by-side layout, sharpens NADRA smart card text, and exports a single combined JPG or PDF under 300KB.'
  },
  {
    category: 'Signatures & Background',
    question: 'How do I fix yellow paper and room shadows on my signature photo?',
    answer: 'When you take a smartphone photo of your signature on paper, room lighting creates a dull grey or yellow backdrop. Government portals reject signatures that lack pure white backgrounds. In DocFix’s Resizer, select the "Signature Clean (B&W)" filter. Our algorithm converts paper greys to pure white (RGB 255, 255, 255) while darkening blue or black ink strokes, producing a studio-grade scan under 20KB.'
  },
  {
    category: 'Formats & Compatibility',
    question: 'Which format should I use: JPG, PNG, or PDF?',
    answer: 'Over 95% of recruitment commission portals (FPSC, PPSC, SPSC, KPPSC, NTS) require standard JPG/JPEG format for photographs and signatures. PNG files are typically 3x to 5x larger than JPGs and frequently exceed size limits. PDF is usually accepted for multi-page educational degrees and combined CNIC copies. DocFix defaults to optimized JPG to ensure maximum compatibility.'
  },
  {
    category: 'Admissions & University',
    question: 'Can I use DocFix for university admissions like NUST, FAST, LUMS, or HEC?',
    answer: 'Yes. DocFix includes pre-configured presets for university entrance tests and Higher Education Commission (HEC) attestation portals. These portals generally require 200KB or 300KB passport photographs with light blue or white backgrounds and 3:4 or 1:1 aspect ratios.'
  }
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="max-w-2xl">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Frequently Asked Questions
          </span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mt-1">
          Everything You Need to Know About Government Job Document Requirements
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          Detailed answers prepared by civil service applicants and document formatting specialists.
        </p>
      </div>

      <div className="space-y-3 pt-2">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-slate-200 rounded-xl overflow-hidden transition-all bg-slate-50/50"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full py-3.5 px-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors"
              >
                <span className="leading-snug">{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                  <div className="text-[10px] font-mono font-bold text-emerald-700 mb-1.5">
                    {faq.category}
                  </div>
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
