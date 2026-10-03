import React from 'react';
import { Helmet } from '../utils/Helmet';
import { GuidelinesSection } from '../components/GuidelinesSection';
import { FaqSection } from '../components/FaqSection';
import { AdSlot } from '../components/ads/AdSlot';

export const GuidelinesPage: React.FC = () => {
  return (
    <>
      <Helmet
        title="Applicant Knowledge Base & Mobile Photo Tips | DocFix"
        description="Learn how to take perfect passport photos for government jobs. Mobile photography tips, lighting guides, DPI explanation, and document formatting best practices."
        canonical="/guidelines"
      />
      <div className="space-y-6">
        <GuidelinesSection />
        <AdSlot format="banner" />
        <FaqSection />
      </div>
    </>
  );
};
