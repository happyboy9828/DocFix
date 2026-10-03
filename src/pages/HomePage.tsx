import React from 'react';
import { Helmet } from '../utils/Helmet';
import { PortalSelector } from '../components/PortalSelector';
import { SingleDocResizer } from '../components/SingleDocResizer';
import { WhyDocFix } from '../components/WhyDocFix';
import { FaqSection } from '../components/FaqSection';
import { AdSlot } from '../components/ads/AdSlot';
import { PortalPreset, PORTAL_PRESETS } from '../../server/data/portals';
import { UsageState } from '../utils/limitEngine';

interface HomePageProps {
  portals: PortalPreset[];
  selectedPortalId: string;
  isCustom: boolean;
  usage: UsageState;
  onConversionPerformed: () => boolean;
  onOpenPremium: () => void;
  onSelectPortal: (portal: PortalPreset | null) => void;
  onSetCustom: () => void;
  stats: { totalResized: number; acceptedRate: string; supportedPortals: number };
}

export const HomePage: React.FC<HomePageProps> = ({
  portals,
  selectedPortalId,
  isCustom,
  usage,
  onConversionPerformed,
  onOpenPremium,
  onSelectPortal,
  onSetCustom,
  stats
}) => {
  const currentPortal = portals.find((p) => p.id === selectedPortalId) || portals[0];

  return (
    <>
      <Helmet
        title="DocFix - Government Job Document & Photo Resizer (300KB)"
        description="All-in-one document and photo resizer for FPSC, PPSC, NTS, NJP, and admissions. Auto-converts to JPG, exact dimensions, target KB compression, 200 DPI, and CNIC front+back PDF merger."
        canonical="/"
      />

      <div className="space-y-6">
        <PortalSelector
          portals={portals}
          selectedPortalId={selectedPortalId}
          onSelectPortal={onSelectPortal}
          isCustom={isCustom}
          onSetCustom={onSetCustom}
        />

        <SingleDocResizer
          currentPortal={isCustom ? null : currentPortal}
          isCustom={isCustom}
          usage={usage}
          onConversionPerformed={onConversionPerformed}
          onOpenPremium={onOpenPremium}
        />

        <AdSlot format="banner" />

        <WhyDocFix />
        <FaqSection />
      </div>
    </>
  );
};
