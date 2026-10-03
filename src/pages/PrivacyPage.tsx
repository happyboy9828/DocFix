import React from 'react';
import { Helmet } from '../utils/Helmet';
import { PrivacyPolicy } from '../components/legal/PrivacyPolicy';

export const PrivacyPage: React.FC = () => {
  return (
    <>
      <Helmet
        title="Privacy Policy | DocFix"
        description="DocFix privacy policy: 100% client-side processing, zero server storage, GDPR and CCPA compliant. Your documents never leave your browser."
        canonical="/privacy"
      />
      <PrivacyPolicy />
    </>
  );
};
