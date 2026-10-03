import React from 'react';
import { Helmet } from '../utils/Helmet';
import { JobBundlePack } from '../components/JobBundlePack';
import { WhyDocFix } from '../components/WhyDocFix';
import { AdSlot } from '../components/ads/AdSlot';
import { PortalPreset } from '../types/document';
import { UsageState } from '../utils/limitEngine';

interface BundlePageProps {
  portals: PortalPreset[];
  selectedPortalId: string;
  usage: UsageState;
  onConversionPerformed: () => boolean;
  onOpenPremium: () => void;
}

export const BundlePage: React.FC<BundlePageProps> = ({
  portals,
  selectedPortalId,
  usage,
  onConversionPerformed,
  onOpenPremium
}) => {
  return (
    <>
      <Helmet
        title="1-Click Job Application Bundle Kit (ZIP) | DocFix"
        description="Generate a complete job application ZIP bundle with resized photos, CNIC merger, and formatted documents for FPSC, PPSC, and NTS submissions."
        canonical="/bundle"
      />
      <div className="space-y-6">
        <JobBundlePack
          portals={portals}
          selectedPortalId={selectedPortalId}
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
