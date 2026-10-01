import React, { useState } from 'react';
import {
  Crown,
  CheckCircle2,
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  CreditCard,
  Smartphone,
  KeyRound,
  RotateCcw
} from 'lucide-react';
import { activatePremium, deactivatePremium, resetDailyCountForTesting } from '../utils/limitEngine';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPremium: boolean;
  onStatusChange: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  isPremium,
  onStatusChange
}) => {
  const [licenseCode, setLicenseCode] = useState('');
  const [activationMsg, setActivationMsg] = useState<{ text: string; error: boolean } | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'season' | 'lifetime'>('season');

  if (!isOpen) return null;

  const handleActivateCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = licenseCode.trim().toUpperCase();
    if (clean === 'DOCFIXPRO' || clean === 'PASS2026' || clean === 'PREMIUM' || clean === 'ADMIN') {
      activatePremium(clean);
      setActivationMsg({ text: '🎉 Premium successfully activated! Unlimited conversions unlocked.', error: false });
      onStatusChange();
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setActivationMsg({ text: 'Invalid license key. Try code: DOCFIXPRO for testing.', error: true });
    }
  };

  const handleQuickUnlock = () => {
    activatePremium('DEMO_PRO');
    setActivationMsg({ text: '🎉 Instant Premium Pass Activated!', error: false });
    onStatusChange();
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleDeactivate = () => {
    deactivatePremium();
    resetDailyCountForTesting();
    setActivationMsg({ text: 'Reverted to Free tier (3 daily conversions limit active).', error: false });
    onStatusChange();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
        {/* Decorative ambient background */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-emerald-500 to-amber-500" />

        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1 rounded-xl transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center shadow-xs">
            <Crown className="w-8 h-8 stroke-[2.2]" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>DocFix Pro &amp; Unlimited Access</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isPremium ? 'DocFix Premium is Active' : 'Upgrade to DocFix Premium'}
          </h2>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            {isPremium
              ? 'You have unlimited daily conversions with zero restrictions.'
              : 'Bypass the 3 conversions/day limit and process all your job documents without limits.'}
          </p>
        </div>

        {/* Pricing Options */}
        {!isPremium && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div
              onClick={() => setSelectedPlan('season')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all text-left relative ${
                selectedPlan === 'season'
                  ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20 shadow-xs'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                Job Season Pass
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-slate-900">Rs. 299</span>
                <span className="text-xs text-slate-500">/ 30 Days</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Approx $1.05 USD
              </span>
            </div>

            <div
              onClick={() => setSelectedPlan('lifetime')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all text-left relative ${
                selectedPlan === 'lifetime'
                  ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20 shadow-xs'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className="absolute -top-2 right-3 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                BEST VALUE
              </div>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                Lifetime Pass
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-slate-900">Rs. 599</span>
                <span className="text-xs text-slate-500">one-time</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Approx $2.10 USD
              </span>
            </div>
          </div>
        )}

        {/* Premium Features List */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 space-y-2.5 text-xs">
          <div className="flex items-center gap-2.5 text-slate-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span><strong>Unlimited Daily Conversions</strong> (No 3-per-day restriction)</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span><strong>1-Click Job Bundle ZIP Downloads</strong> (Photo + Sig + CNIC + Degrees)</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span><strong>High-Resolution NADRA CNIC Combiner</strong> (No watermark)</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span><strong>Ad-Free High-Speed Experience</strong> with zero distractions</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span><strong>Zero Login Required:</strong> Instant activation tied to your browser</span>
          </div>
        </div>

        {/* Instant Buy / Unlock Buttons */}
        {!isPremium ? (
          <div className="space-y-4">
            {/* Quick Demo Unlock Button for instant testing */}
            <button
              type="button"
              onClick={handleQuickUnlock}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-slate-950 font-extrabold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-slate-950" />
              <span>Unlock Unlimited Conversions (Instant Demo Pass)</span>
            </button>

            {/* Payment Details for Pakistan (EasyPaisa / JazzCash / Bank) */}
            <div className="border-t border-slate-200 pt-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>Pay via EasyPaisa / JazzCash / Raast</span>
                </span>
                <span className="font-mono text-emerald-700 font-bold">0300-1234567</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Send <strong>Rs. {selectedPlan === 'season' ? '299' : '599'}</strong> to Title: <strong>DocFix Official</strong>. Enter your Transaction ID or use the instant promo key below.
              </p>

              {/* Promo Key Activation Form */}
              <form onSubmit={handleActivateCode} className="flex gap-2 pt-1">
                <div className="relative flex-1">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Enter Promo Key (Try: DOCFIXPRO)"
                    value={licenseCode}
                    onChange={(e) => setLicenseCode(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none uppercase font-mono font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Activate
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Active status controls */
          <div className="space-y-4 text-center">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>DocFix Premium is currently ACTIVE on this device.</span>
            </div>

            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-emerald-700 transition-colors"
              >
                Continue Resizing
              </button>
              <button
                type="button"
                onClick={handleDeactivate}
                className="px-4 py-2.5 bg-slate-100 text-slate-600 hover:text-red-700 font-medium text-xs rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                title="Reset to 3 daily limit for testing"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Test Free Tier (3 Daily Limit)</span>
              </button>
            </div>
          </div>
        )}

        {activationMsg && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs text-center font-medium ${
              activationMsg.error
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            {activationMsg.text}
          </div>
        )}
      </div>
    </div>
  );
};
