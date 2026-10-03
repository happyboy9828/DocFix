import React from 'react';
import { Helmet } from '../utils/Helmet';
import { Disclaimer } from '../components/legal/Disclaimer';

export const DisclaimerPage: React.FC = () => {
  return (
    <>
      <Helmet
        title="Government Non-Affiliation Disclaimer | DocFix"
        description="DocFix is an independent utility and not affiliated with FPSC, PPSC, NTS, NADRA, or any government ministry. Official disclaimer and nominative fair use statement."
        canonical="/disclaimer"
      />
      <Disclaimer />
    </>
  );
};
