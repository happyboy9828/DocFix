import React, { useState } from 'react';
import { PortalPreset } from '../types/document';
import { Search, ExternalLink, Check, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface PortalDirectoryProps {
  portals: PortalPreset[];
  onApplyPreset: (portal: PortalPreset) => void;
}

export const PortalDirectory: React.FC<PortalDirectoryProps> = ({ portals, onApplyPreset }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Federal', 'Provincial', 'Testing Services', 'Identity', 'Admissions'];

  const filteredPortals = portals.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.photoSpecs.maxKb.toString().includes(searchQuery);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Directory Title */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Official Database</span>
              <span className="text-slate-400 dark:text-slate-500">Â·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Updated for 2025 - 2026 Recruitment Cycles</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
              Government Job & University Portal Specifications Guide
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Complete requirement matrix for Pakistani public service commissions and entrance exams. Check dimensions, file sizes, and common rejection pitfalls.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search portal, e.g. FPSC, 25KB, CSS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPortals.map((portal) => (
          <div
            key={portal.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-400 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    {portal.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5 leading-snug">
                    {portal.name}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 shrink-0">
                  {portal.shortName}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                {portal.description}
              </p>

              {/* Requirement Matrix */}
              <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-3 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Photo Limit:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 font-mono">
                    â‰¤ {portal.photoSpecs.maxKb} KB ({portal.photoSpecs.widthPx}Ã—{portal.photoSpecs.heightPx} px)
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Background:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{portal.photoSpecs.bgRequirement}</span>
                </div>

                {portal.signatureSpecs && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">Signature:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      â‰¤ {portal.signatureSpecs.maxKb} KB ({portal.signatureSpecs.widthPx}Ã—{portal.signatureSpecs.heightPx} px)
                    </span>
                  </div>
                )}

                {portal.cnicSpecs && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">CNIC Rule:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      â‰¤ {portal.cnicSpecs.maxKb} KB ({portal.cnicSpecs.layout})
                    </span>
                  </div>
                )}
              </div>

              {/* Rejection trap alert */}
              <div className="bg-amber-50/60 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60 rounded-xl p-2.5 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5" />
                <span>
                  <strong>Common Rejection:</strong> {portal.commonRejectionReason}
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => onApplyPreset(portal)}
                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Use This Preset</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {portal.officialPortalUrl && (
                <a
                  href={portal.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                  title="Visit Official Commission Website"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
