import React from 'react';
import { Helmet } from '../utils/Helmet';
import { FaqSection } from '../components/FaqSection';
import { WhyDocFix } from '../components/WhyDocFix';
import { AdSlot } from '../components/ads/AdSlot';

export const FaqPage: React.FC = () => {
  return (
    <>
      <Helmet
        title="Frequently Asked Questions | DocFix"
        description="Get answers to common questions about FPSC 300KB photo resizing, PPSC 25KB compression, CNIC PDF merging, DPI settings, and browser privacy."
        canonical="/faq"
      />
      <div className="space-y-6">
        <FaqSection />
        <AdSlot format="banner" />
        <WhyDocFix />
      </div>
    </>
  );
};
