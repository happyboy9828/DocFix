import React from 'react';
import { Helmet } from '../utils/Helmet';
import { PortalDirectory } from '../components/PortalDirectory';
import { AdSlot } from '../components/ads/AdSlot';
import { PortalPreset } from '../types/document';

interface DirectoryPageProps {
  portals: PortalPreset[];
  onApplyPreset: (portal: PortalPreset) => void;
}

export const DirectoryPage: React.FC<DirectoryPageProps> = ({ portals, onApplyPreset }) => {
  return (
    <>
      <Helmet
        title="Public Service Commission Specs Guide | DocFix"
        description="Complete directory of FPSC, PPSC, NTS, SPSC, KPPSC, BPSC photo size, file size, and dimension requirements. Updated 2026."
        canonical="/portal-specs"
      />
      <div className="space-y-6">
        <PortalDirectory
          portals={portals}
          onApplyPreset={onApplyPreset}
        />
        <AdSlot format="banner" />
      </div>
    </>
  );
};
