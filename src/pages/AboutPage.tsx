import React from 'react';
import { Helmet } from '../utils/Helmet';
import { AboutUs } from '../components/legal/AboutUs';

export const AboutPage: React.FC = () => {
  return (
    <>
      <Helmet
        title="About Us & Engineering Mission | DocFix"
        description="Meet the DocFix team. Our mission is to eliminate government job application rejections through precision document processing tools for FPSC, PPSC, NTS, and universities."
        canonical="/about"
      />
      <AboutUs />
    </>
  );
};
