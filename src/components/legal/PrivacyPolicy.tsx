import React from 'react';
import { Shield, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm space-y-8 text-slate-700 leading-relaxed text-sm">
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
          <Shield className="w-4 h-4" />
          <span>Official Trust &amp; Privacy Document</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Last Updated: March 2026 · Compliant with Google AdSense, GDPR, CCPA &amp; ePrivacy Regulations
        </p>
      </div>

      {/* Highlights Box */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 space-y-2">
        <div className="font-bold flex items-center gap-1.5 text-emerald-800 text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Zero Server Upload Guarantee for Documents &amp; Photos</span>
        </div>
        <p>
          At DocFix (accessible from <code className="font-mono bg-white px-1 py-0.5 rounded border border-emerald-200">http://0.0.0.0:3000</code>), the privacy of our visitors is of paramount importance. <strong>Your uploaded photographs, National Identity Cards (CNIC), signatures, and academic certificates are NEVER transferred to, processed on, or stored on our servers.</strong> All conversions, dimensions resizing, DPI injection, and PDF compiling happen entirely inside your local web browser using client-side HTML5 Canvas and WebAssembly.
        </p>
      </div>

      {/* Section 1 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span>1. Document &amp; Image Processing Privacy</span>
        </h2>
        <p>
          Unlike conventional document conversion services that require you to upload personal files to remote cloud storage, DocFix uses decentralized client-side processing. When you choose an image or drag a file into DocFix:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs">
          <li>The file remains in your device's volatile memory (RAM).</li>
          <li>Pixel transformations, cropping, and JPEG binary byte adjustments execute via your browser's JavaScript engine.</li>
          <li>Once you close or refresh the browser tab, all temporary image objects are completely purged from memory.</li>
          <li>We have zero technical capability to view, inspect, or retain your CNIC cards or photos.</li>
        </ul>
      </section>

      {/* Section 2 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">
          2. Log Files &amp; Standard Web Analytics
        </h2>
        <p>
          DocFix follows standard industry protocols for log files. When visitors access our website, our hosting infrastructure may record standard non-personally identifiable information, including:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs">
          <li>Internet Protocol (IP) addresses</li>
          <li>Browser type and operating system version</li>
          <li>Internet Service Provider (ISP)</li>
          <li>Date, timestamp, and referring/exit pages</li>
          <li>Number of clicks to analyze trends and administer the site</li>
        </ul>
        <p className="text-xs text-slate-500">
          This data is not linked to any information that is personally identifiable and is used solely for performance monitoring and DDoS mitigation.
        </p>
      </section>

      {/* Section 3 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">
          3. Cookies, Web Beacons &amp; Third-Party Advertising Partners
        </h2>
        <p>
          DocFix uses cookies to store information about visitors' preferences and optimize user experience (such as remembering your selected portal preset).
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
          <h3 className="font-bold text-slate-900">Google AdSense &amp; Advertising Networks</h3>
          <p>
            Third-party advertising vendors, including Google, use cookies to serve ads based on a user's prior visits to DocFix or other websites:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>
              <strong>Google DART Cookie:</strong> Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.
            </li>
            <li>
              Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-semibold">Google Ads Settings</a>.
            </li>
            <li>
              Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-semibold">aboutads.info</a> or <a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-semibold">Your Online Choices</a>.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 4 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">
          4. CCPA Privacy Rights (Do Not Sell My Personal Information)
        </h2>
        <p>
          Under the California Consumer Privacy Act (CCPA), California consumers have rights regarding their personal data. DocFix does not sell, trade, or rent personal data or uploaded documents to any third party under any circumstances.
        </p>
      </section>

      {/* Section 5 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">
          5. GDPR Data Protection Rights
        </h2>
        <p>
          Every user is entitled to data protection rights:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs">
          <li><strong>Right to access:</strong> You have the right to request copies of your personal data.</li>
          <li><strong>Right to rectification:</strong> You have the right to request correction of inaccurate data.</li>
          <li><strong>Right to erasure:</strong> Because we do not store your documents on our servers, there are no files to delete upon session end.</li>
        </ul>
      </section>

      {/* Section 6 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">
          6. Contacting the Privacy Officer
        </h2>
        <p>
          If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact our compliance team:
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 font-mono">
          Email: <span className="font-bold text-emerald-800">privacy@docfix.pk</span> · Response turnaround: Within 24-48 business hours.
        </div>
      </section>
    </div>
  );
};
