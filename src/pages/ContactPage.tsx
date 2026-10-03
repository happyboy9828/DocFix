import React from 'react';
import { Helmet } from '../utils/Helmet';
import { ContactUs } from '../components/legal/ContactUs';

export const ContactPage: React.FC = () => {
  return (
    <>
      <Helmet
        title="Contact Us & Editorial Desk | DocFix"
        description="Contact DocFix support for FPSC, PPSC, NTS document resizing issues. Email support at support@docfix.pk. Available in English and Urdu."
        canonical="/contact"
      />
      <ContactUs />
    </>
  );
};
