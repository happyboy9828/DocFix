import React from 'react';
import { Helmet } from '../utils/Helmet';
import { RejectionDiagnostic } from '../components/RejectionDiagnostic';
import { FaqSection } from '../components/FaqSection';
import { AdSlot } from '../components/ads/AdSlot';
import { PortalPreset } from '../types/document';

interface DiagnosticPageProps {
  portals: PortalPreset[];
  onApplyFix: (portal: PortalPreset) => void;
}

export const DiagnosticPage: React.FC<DiagnosticPageProps> = ({ portals, onApplyFix }) => {
  return (
    <>
      <Helmet
        title="Rejection Error Diagnostic & Auto-Fixer | DocFix"
        description="Diagnose why your government job application photo or document was rejected. Get instant fixes for FPSC, PPSC, NTS, and university portal errors."
        canonical="/diagnostic"
      />
      <div className="space-y-6">
        <RejectionDiagnostic
          portals={portals}
          onApplyFix={onApplyFix}
        />
        <AdSlot format="banner" />
        <FaqSection />
      </div>
    </>
  );
};
