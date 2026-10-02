import React from 'react';
import { Crown, Sparkles, AlertCircle, Zap } from 'lucide-react';
import { UsageState } from '../utils/limitEngine';

interface DailyLimitBadgeProps {
  usage: UsageState;
  onOpenPremium: () => void;
  compact?: boolean;
}

export const DailyLimitBadge: React.FC<DailyLimitBadgeProps> = ({
  usage,
  onOpenPremium,
  compact = false
}) => {
  if (usage.isPremium) {
    return (
      <button
        type="button"
        onClick={onOpenPremium}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/20 to-amber-500/15 border border-amber-400/40 text-amber-950 dark:text-amber-100 font-bold text-xs shadow-xs hover:border-amber-400 transition-all cursor-pointer"
        title="DocFix Premium is Active - Unlimited Conversions"
      >
        <Crown className="w-4 h-4 text-amber-600 fill-amber-500" />
        <span>DocFix Pro Â· Unlimited</span>
      </button>
    );
  }

  const isLimitReached = usage.count >= usage.maxDaily;

  if (compact) {
    return (
      <button
        type="button"
        onClick={onOpenPremium}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
          isLimitReached
            ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900'
            : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800'
        }`}
        title="Free Plan: 3 conversions per day (No signup). Upgrade for unlimited."
      >
        <span>
          Free: <strong>{usage.remaining} / {usage.maxDaily}</strong> left
        </span>
        <span className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900 px-1 py-0.2 rounded font-bold">
          Upgrade
        </span>
      </button>
    );
  }

  return (
    <div
      onClick={onOpenPremium}
      className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isLimitReached
          ? 'bg-red-50/80 dark:bg-red-950/80 border-red-200 dark:border-red-800 text-red-950 dark:text-red-200 shadow-xs'
          : 'bg-emerald-50/60 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-100 shadow-xs'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
            isLimitReached ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' : 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
          }`}
        >
          {isLimitReached ? (
            <AlertCircle className="w-4 h-4 stroke-[2.5]" />
          ) : (
            <Zap className="w-4 h-4 stroke-[2.5]" />
          )}
        </div>
        <div>
          <div className="text-xs font-bold flex items-center gap-1.5">
            <span>Daily Free Conversions:</span>
            <span
              className={`font-mono px-1.5 py-0.5 rounded text-[11px] font-extrabold ${
                isLimitReached
                  ? 'bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-200'
                  : 'bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-200'
              }`}
            >
              {usage.count} of {usage.maxDaily} Used
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
              (No signup required)
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
            {isLimitReached
              ? 'You have reached todayâ€™s 3 free conversions. Resets at midnight or upgrade for unlimited.'
              : `${usage.remaining} free conversion${usage.remaining === 1 ? '' : 's'} remaining today. Resets automatically at midnight.`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
        >
          <Crown className="w-3.5 h-3.5 fill-slate-950" />
          <span>Buy Premium (Unlimited)</span>
        </button>
      </div>
    </div>
  );
};
