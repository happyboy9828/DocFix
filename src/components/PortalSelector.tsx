import React from 'react';
import { PortalPreset } from '../types/document';
import { CheckCircle2, AlertCircle, Sparkles, SlidersHorizontal } from 'lucide-react';

interface PortalSelectorProps {
  portals: PortalPreset[];
  selectedPortalId: string;
  onSelectPortal: (portal: PortalPreset | null) => void;
  isCustom: boolean;
  onSetCustom: () => void;
}

export const PortalSelector: React.FC<PortalSelectorProps> = ({
  portals,
  selectedPortalId,
  onSelectPortal,
  isCustom,
  onSetCustom
}) => {
  const currentPortal = portals.find(p => p.id === selectedPortalId);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header and instruction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Step 1: Select Target Government Portal Preset
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            DocFix automatically preconfigures the exact dimensions, target KB, 200 DPI, and background color.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/50">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FPSC 300KB & PPSC 25KB Ready</span>
        </div>
      </div>

      {/* Preset Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {portals.slice(0, 7).map((portal) => {
          const isSelected = !isCustom && selectedPortalId === portal.id;
          return (
            <button
              key={portal.id}
              onClick={() => onSelectPortal(portal)}
              className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20 shadow-xs'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-xs font-bold ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                  {portal.shortName}
                </span>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xs font-semibold text-slate-900">
                  {portal.photoSpecs.maxKb} KB
                </span>
                <span className="text-[10px] text-slate-500">
                  ({portal.photoSpecs.widthPx}x{portal.photoSpecs.heightPx})
                </span>
              </div>
            </button>
          );
        })}

        {/* Custom Mode Button */}
        <button
          onClick={onSetCustom}
          className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
            isCustom
              ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20 shadow-xs'
              : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className={`text-xs font-bold ${isCustom ? 'text-emerald-900' : 'text-slate-800'}`}>
              Custom
            </span>
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <span className="text-[10px] text-slate-500 mt-1">
            Manual KB & Px
          </span>
        </button>
      </div>

      {/* Active Preset Summary Banner */}
      {!isCustom && currentPortal && (
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">{currentPortal.name}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600">{currentPortal.category}</span>
            </div>
            <p className="text-slate-600">
              {currentPortal.photoSpecs.notes}
            </p>
          </div>

          {/* Quick specs grid */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-700">
              <span className="text-slate-400 mr-1">Max:</span>
              <strong className="text-emerald-700 font-semibold">{currentPortal.photoSpecs.maxKb} KB</strong>
            </div>
            <div className="bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-700">
              <span className="text-slate-400 mr-1">Dims:</span>
              <strong className="font-semibold">{currentPortal.photoSpecs.widthPx} × {currentPortal.photoSpecs.heightPx} px</strong>
            </div>
            <div className="bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-700">
              <span className="text-slate-400 mr-1">DPI:</span>
              <strong className="font-semibold">{currentPortal.photoSpecs.dpi}</strong>
            </div>
            <div className="bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-700">
              <span className="text-slate-400 mr-1">BG:</span>
              <strong className="font-semibold">{currentPortal.photoSpecs.bgRequirement}</strong>
            </div>
          </div>
        </div>
      )}

      {isCustom && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Custom Mode:</strong> You can specify any target file size (e.g. 100KB, 298KB), any pixel dimensions, and custom DPI below.
          </span>
        </div>
      )}
    </div>
  );
};
