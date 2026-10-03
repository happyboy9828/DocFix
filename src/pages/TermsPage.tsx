import React from 'react';
import { Helmet } from '../utils/Helmet';
import { TermsOfService } from '../components/legal/TermsOfService';

export const TermsPage: React.FC = () => {
  return (
    <>
      <Helmet
        title="Terms of Service | DocFix"
        description="DocFix terms of service: free government job document processing utility. Usage terms, limitations, and service agreement for FPSC, PPSC, NTS tools."
        canonical="/terms"
      />
      <TermsOfService />
    </>
  );
};
