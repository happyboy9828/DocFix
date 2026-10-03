import React from 'react';
import { Helmet } from '../utils/Helmet';
import { CnicCombiner } from '../components/CnicCombiner';
import { WhyDocFix } from '../components/WhyDocFix';
import { AdSlot } from '../components/ads/AdSlot';
import { UsageState } from '../utils/limitEngine';

interface CnicPageProps {
  usage: UsageState;
  onConversionPerformed: () => boolean;
  onOpenPremium: () => void;
}

export const CnicPage: React.FC<CnicPageProps> = ({ usage, onConversionPerformed, onOpenPremium }) => {
  return (
    <>
      <Helmet
        title="CNIC Front + Back Single Page Combiner | DocFix"
        description="Combine CNIC front and back sides into a single-page PDF instantly. Perfect for FPSC, PPSC, and NTS online applications requiring one-page identity documents."
        canonical="/cnic"
      />
      <div className="space-y-6">
        <CnicCombiner
          usage={usage}
          onConversionPerformed={onConversionPerformed}
          onOpenPremium={onOpenPremium}
        />
        <AdSlot format="banner" />
        <WhyDocFix />
      </div>
    </>
  );
};
