import React, { useState } from 'react';
import {
  Crown,
  CheckCircle2,
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  KeyRound,
  CircleSlash,
  TriangleAlert,
  ArrowLeft,
  Building2,
  BadgeCheck,
  Landmark,
  ChevronDown,
  Search
} from 'lucide-react';
import { activatePremium, deactivatePremium, resetDailyCountForTesting } from '../utils/limitEngine';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPremium: boolean;
  onStatusChange: () => void;
}

type PlanId = 'monthly' | 'yearly' | 'lifetime';
type Step = 'plans' | 'payment';

interface Plan {
  id: PlanId;
  label: string;
  price: string;
  usd: string;
  badge?: string;
}

const PLANS: Plan[] = [
  { id: 'monthly', label: 'Monthly', price: 'Rs. 149', usd: '/ month · ~$0.53' },
  { id: 'yearly', label: 'Yearly', price: 'Rs. 999', usd: '/ year · ~$3.56', badge: 'SAVE 45%' },
  { id: 'lifetime', label: 'Lifetime', price: 'Rs. 1,999', usd: 'one-time · ~$7.10', badge: 'BEST VALUE' }
];

const FEATURES = [
  <><strong>Unlimited Daily Conversions</strong> (No 3-per-day restriction)</>,
  <><strong>1-Click Job Bundle ZIP Downloads</strong> (Photo + Sig + CNIC + Degrees)</>,
  <><strong>High-Resolution NADRA CNIC Combiner</strong> (No watermark)</>,
  <><strong>Ad-Free High-Speed Experience</strong> with zero distractions</>,
  <><strong>Zero Login Required:</strong> Instant activation tied to your browser</>
];

interface PaymentSource {
  id: string;
  label: string;
  type: 'bank' | 'wallet';
}

const BANKS: PaymentSource[] = [
  { id: 'akbl', label: 'Allied Bank Limited', type: 'bank' },
  { id: 'askari', label: 'Askari Bank', type: 'bank' },
  { id: 'alfalah', label: 'Bank Alfalah', type: 'bank' },
  { id: 'bank-of-punjab', label: 'The Bank of Punjab', type: 'bank' },
  { id: 'bop', label: 'Bank of Punjab', type: 'bank' },
  { id: 'boi', label: 'Bank of Islamabad', type: 'bank' },
  { id: 'bankislami', label: 'BankIslami Pakistan', type: 'bank' },
  { id: 'centenary', label: 'Centenary Bank', type: 'bank' },
  { id: 'citi', label: 'Citi Pakistan', type: 'bank' },
  { id: 'dibp', label: 'Dubai Islamic Bank Pakistan', type: 'bank' },
  { id: 'faysal', label: 'Faysal Bank', type: 'bank' },
  { id: 'hbl', label: 'Habib Bank Limited (HBL)', type: 'bank' },
  { id: 'hbpp', label: 'Habib Bank Pakistan', type: 'bank' },
  { id: 'hsbc', label: 'HSBC Pakistan', type: 'bank' },
  { id: 'indusind', label: 'IndusInd Bank Pakistan', type: 'bank' },
  { id: 'ibp', label: 'Islamic Bank of Pakistan', type: 'bank' },
  { id: 'jsbank', label: 'JS Bank', type: 'bank' },
  { id: 'khyber', label: 'Bank Khyber', type: 'bank' },
  { id: 'mcb', label: 'MCB Bank', type: 'bank' },
  { id: 'meezan', label: 'Meezan Bank', type: 'bank' },
  { id: 'nbp', label: 'National Bank of Pakistan (NBP)', type: 'bank' },
  { id: 'nib', label: 'NIB Bank', type: 'bank' },
  { id: 'oman', label: 'Oman Bank Pakistan', type: 'bank' },
  { id: 'silkbank', label: 'Silkbank', type: 'bank' },
  { id: 'soneri', label: 'Soneri Bank', type: 'bank' },
  { id: 'standard-chartered', label: 'Standard Chartered Pakistan', type: 'bank' },
  { id: 'summit', label: 'Summit Bank', type: 'bank' },
  { id: 'ubl', label: 'United Bank Limited (UBL)', type: 'bank' },
  { id: 'tmb', label: 'Telenor Microfinance Bank', type: 'bank' }
];

const MOBILE_WALLETS: PaymentSource[] = [
  { id: 'easypaisa', label: 'EasyPaisa', type: 'wallet' },
  { id: 'jazzcash', label: 'JazzCash', type: 'wallet' },
  { id: 'sadapay', label: 'SadaPay', type: 'wallet' },
  { id: 'npay', label: 'NPay', type: 'wallet' },
  { id: 'instapay', label: 'InstaPay', type: 'wallet' },
  { id: 'raast', label: 'Raast', type: 'wallet' },
  { id: 'zong', label: 'Zong', type: 'wallet' },
  { id: 'jazz', label: 'Jazz', type: 'wallet' },
  { id: 'ufone', label: 'Ufone', type: 'wallet' },
  { id: 'warid', label: 'Warid', type: 'wallet' }
];

const PAYMENT_SOURCES = [...BANKS, ...MOBILE_WALLETS];

interface PaymentDetails {
  accountNumber: string;
  sourceId: string;
}

type PaymentErrors = Partial<Record<keyof PaymentDetails, string>>;

function findPaymentSource(id: string): PaymentSource | undefined {
  return PAYMENT_SOURCES.find((source) => source.id === id);
}

function validatePaymentDetails(details: PaymentDetails): PaymentErrors {
  const errors: PaymentErrors = {};

  const source = findPaymentSource(details.sourceId);
  if (!source) {
    errors.sourceId = 'Select the bank or mobile wallet you paid from.';
  }

  const account = details.accountNumber.replace(/[\s-]/g, '');
  if (!account) {
    errors.accountNumber = source?.type === 'wallet'
      ? 'Enter the mobile wallet number you paid from.'
      : 'Account number is required.';
  } else if (!/^\d+$/.test(account)) {
    errors.accountNumber = 'Account number must contain digits only.';
  } else if (source?.type === 'wallet') {
    if (!/^03\d{9}$/.test(account)) {
      errors.accountNumber = 'A mobile wallet number must be 11 digits and start with 03.';
    }
  } else if (account.length < 10 || account.length > 17) {
    errors.accountNumber = 'Account number must be 10 to 17 digits long.';
  }

  return errors;
}

function formatAccountNumber(value: string): string {
  return value.replace(/[^\d\s-]/g, '').slice(0, 23);
}

const UnlockForm: React.FC<{
  code: string;
  onCodeChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  heading: string;
}> = ({ code, onCodeChange, onSubmit, heading }) => (
  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-3">
    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
      {heading}
    </p>

    <form onSubmit={onSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <KeyRound className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Enter cheat code (Try: DOCFIXPRO)"
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          aria-label="Cheat code to unlock Pro"
          className="w-full text-xs pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-amber-500 outline-none uppercase font-mono font-semibold"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
      >
        Unlock
      </button>
    </form>
  </div>
);

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  isPremium,
  onStatusChange
}) => {
  const [licenseCode, setLicenseCode] = useState('');
  const [activationMsg, setActivationMsg] = useState<{ text: string; error: boolean } | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('yearly');
  const [step, setStep] = useState<Step>('plans');
const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [sourceId, setSourceId] = useState('');
  const [paymentErrors, setPaymentErrors] = useState<PaymentErrors>({});
  const [paymentChecked, setPaymentChecked] = useState(false);

  if (!isOpen) return null;

  const activePlan = PLANS.find((plan) => plan.id === selectedPlan) ?? PLANS[1];
  const selectedSource = findPaymentSource(sourceId);
  const accountPlaceholder = selectedSource?.type === 'wallet'
    ? 'e.g. 03001234567'
    : 'e.g. 01029876543';

  const close = () => {
    setStep('plans');
    setConfirmingCancel(false);
    setPaymentErrors({});
    setPaymentChecked(false);
    onClose();
  };

  const handleActivateCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = licenseCode.trim().toUpperCase();
    if (clean === 'DOCFIXPRO' || clean === 'PASS2026' || clean === 'PREMIUM' || clean === 'ADMIN') {
      activatePremium(clean);
      setActivationMsg({ text: 'Premium successfully activated! Unlimited conversions unlocked.', error: false });
      onStatusChange();
      setTimeout(() => {
        close();
      }, 1500);
    } else {
      setActivationMsg({ text: 'Invalid license key. Try code: DOCFIXPRO for testing.', error: true });
    }
  };

  const handleQuickUnlock = () => {
    activatePremium('DEMO_PRO');
    setActivationMsg({ text: 'Instant Premium Pass Activated!', error: false });
    onStatusChange();
    setTimeout(() => {
      close();
    }, 1200);
  };

  const handleCheckPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const details: PaymentDetails = { accountNumber, sourceId };
    const errors = validatePaymentDetails(details);

    setPaymentErrors(errors);
    setPaymentChecked(false);
    setActivationMsg(null);

    if (Object.keys(errors).length > 0) {
      setActivationMsg({
        text: 'Payment details are not correct yet. Please fix the highlighted field(s).',
        error: true
      });
      return;
    }

    const source = findPaymentSource(sourceId);
    const normalized: PaymentDetails = {
      accountNumber: accountNumber.replace(/[\s-]/g, ''),
      sourceId
    };

    try {
      localStorage.setItem('docfix_payment_details', JSON.stringify(normalized));
    } catch {
      /* storage blocked - payment reference is not persisted */
    }

    setAccountNumber(normalized.accountNumber);
    setPaymentChecked(true);
    setActivationMsg({
      text: `Payment details are correct. Your ${activePlan.label} payment from ${source?.label} account ${normalized.accountNumber} has been noted.`,
      error: false
    });
  };

  const handleDeactivate = () => {
    deactivatePremium();
    resetDailyCountForTesting();
    setConfirmingCancel(false);
    setActivationMsg({ text: 'Pro version cancelled. You are back on the Free tier with 3 conversions per day.', error: false });
    onStatusChange();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="DocFix Premium plans"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[90vh] shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in fade-in zoom-in-95 duration-150 overflow-hidden flex flex-col"
      >
        {/* Decorative ambient background */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-emerald-500 to-amber-500 shrink-0" />

        {/* Modal Header */}
        <div className="text-center space-y-2 px-6 pt-7 pb-4 shrink-0 relative">
          <button
            onClick={close}
            className="absolute right-4 top-4 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-xl transition-colors cursor-pointer"
            aria-label="Close premium plans"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950 border border-amber-200/80 dark:border-amber-800/80 text-amber-600 flex items-center justify-center shadow-xs">
            <Crown className="w-8 h-8 stroke-[2.2]" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300" />
            <span>DocFix Pro &amp; Unlimited Access</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {isPremium
              ? 'DocFix Premium is Active'
              : step === 'plans'
                ? 'Upgrade to DocFix Premium'
                : 'Complete Your Payment'}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
            {isPremium
              ? 'You have unlimited daily conversions with zero restrictions.'
              : step === 'plans'
                ? 'Bypass the 3 conversions/day limit and process all your job documents without limits.'
                : `Enter the bank and account number you paid ${activePlan.price} from, then check the details.`}
          </p>
        </div>

        {/* Scrollable body */}
        <div className="px-6 pb-6 overflow-y-auto scrollbar-thin">
          {/* Step 1: Plans */}
          {!isPremium && step === 'plans' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {PLANS.map((plan) => (
                  <button
                    type="button"
                    key={plan.id}
                    onClick={() => {
                      setSelectedPlan(plan.id);
                      setStep('payment');
                    }}
                    className={`p-3 rounded-2xl border transition-all text-left relative ${
                      selectedPlan === plan.id
                        ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/50 ring-2 ring-amber-500/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    {plan.badge && (
                      <span className="absolute -top-2 right-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                        {plan.badge}
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-amber-800 dark:text-amber-200 uppercase tracking-wider block">
                      {plan.label}
                    </span>
                    <span className="mt-1 block text-base font-extrabold text-slate-900 dark:text-slate-100">
                      {plan.price}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{plan.usd}</span>
                  </button>
                ))}
              </div>

              {/* Premium Features */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs">
                {FEATURES.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <UnlockForm
                code={licenseCode}
                onCodeChange={setLicenseCode}
                onSubmit={handleActivateCode}
                heading="Unlock Pro Version"
              />

              <button
                type="button"
                onClick={handleQuickUnlock}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-slate-950 font-extrabold text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Instant Demo Pass</span>
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {!isPremium && step === 'payment' && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setStep('plans')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change plan</span>
              </button>

              {/* Selected plan summary */}
              <div className="rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/50 p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-800 dark:text-amber-200 uppercase tracking-wider block">
                    {activePlan.label} Plan
                  </span>
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                    {activePlan.price}
                  </span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">{activePlan.usd}</span>
                </div>
                <Crown className="w-8 h-8 text-amber-500 shrink-0" />
              </div>

              {/* Payment Details: pick the bank or wallet, enter the account number, then verify */}
              <form onSubmit={handleCheckPayment} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
                <div className="space-y-1.5">
                  <label htmlFor="payment-source" className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Bank or Mobile Wallet
                  </label>
                  <div className="relative">
                    <Landmark className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                    <select
                      id="payment-source"
                      value={sourceId}
                      onChange={(e) => {
                        setSourceId(e.target.value);
                        setPaymentChecked(false);
                      }}
                      aria-invalid={Boolean(paymentErrors.sourceId)}
                      aria-describedby={paymentErrors.sourceId ? 'payment-source-error' : undefined}
                      className={`w-full appearance-none text-xs pl-9 pr-9 py-2 bg-slate-50 dark:bg-slate-950 border rounded-xl focus:bg-white dark:focus:bg-slate-900 outline-none cursor-pointer ${
                        paymentErrors.sourceId
                          ? 'border-red-400 dark:border-red-700 focus:border-red-500'
                          : 'border-slate-200 dark:border-slate-800 focus:border-amber-500'
                      } ${sourceId ? 'text-slate-900 dark:text-slate-100 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                      <option value="">Select a bank or mobile wallet</option>
                      <optgroup label="Banks">
                        {BANKS.map((bank) => (
                          <option key={bank.id} value={bank.id}>{bank.label}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Mobile Wallets">
                        {MOBILE_WALLETS.map((wallet) => (
                          <option key={wallet.id} value={wallet.id}>{wallet.label}</option>
                        ))}
                      </optgroup>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                  </div>
                  {paymentErrors.sourceId && (
                    <p id="payment-source-error" className="text-[10px] font-semibold text-red-600 dark:text-red-400">
                      {paymentErrors.sourceId}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="payment-account-number" className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {selectedSource?.type === 'wallet' ? 'Mobile Wallet Number' : 'Account Number'}
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
                    <input
                      id="payment-account-number"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder={accountPlaceholder}
                      value={accountNumber}
                      onChange={(e) => {
                        setAccountNumber(formatAccountNumber(e.target.value));
                        setPaymentChecked(false);
                      }}
                      aria-invalid={Boolean(paymentErrors.accountNumber)}
                      aria-describedby={paymentErrors.accountNumber ? 'payment-account-number-error' : undefined}
                      className={`w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border rounded-xl focus:bg-white dark:focus:bg-slate-900 outline-none font-mono font-semibold ${
                        paymentErrors.accountNumber
                          ? 'border-red-400 dark:border-red-700 focus:border-red-500'
                          : 'border-slate-200 dark:border-slate-800 focus:border-amber-500'
                      }`}
                    />
                  </div>
                  {paymentErrors.accountNumber ? (
                    <p id="payment-account-number-error" className="text-[10px] font-semibold text-red-600 dark:text-red-400">
                      {paymentErrors.accountNumber}
                    </p>
                  ) : (
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {selectedSource?.type === 'wallet'
                        ? 'Enter the 11-digit mobile number you paid from.'
                        : 'Enter the account number you paid from.'}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className={`w-full py-2.5 px-4 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    paymentChecked
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700'
                  }`}
                >
                  {paymentChecked ? <BadgeCheck className="w-4 h-4" /> : <Search className="w-4 h-4" />}
                  <span>{paymentChecked ? 'Details Verified - Check Again' : 'Check Payment Details'}</span>
                </button>
              </form>

              <UnlockForm
                code={licenseCode}
                onCodeChange={setLicenseCode}
                onSubmit={handleActivateCode}
                heading="Activate Your Pro Version"
              />
            </div>
          )}

          {/* Active status controls */}
          {isPremium && (
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 text-xs font-extrabold uppercase tracking-wider ring-1 ring-emerald-300 dark:ring-emerald-700">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
                <span>You are a Pro / Premium user</span>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>DocFix Premium is currently ACTIVE on this device.</span>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={close}
                  className="px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  Continue Resizing
                </button>
                {!confirmingCancel ? (
                  <button
                    type="button"
                    onClick={() => setConfirmingCancel(true)}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Cancel your DocFix Pro membership"
                  >
                    <CircleSlash className="w-3.5 h-3.5" />
                    <span>Cancel Pro Version</span>
                  </button>
                ) : (
                  <div className="w-full rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-3 space-y-2.5">
                    <p className="text-xs text-red-800 dark:text-red-200 font-semibold flex items-start gap-2 text-left">
                      <TriangleAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                      <span>
                        Cancel DocFix Pro? Unlimited conversions will end immediately and the
                        3 conversions per day free limit will apply again.
                      </span>
                    </p>
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmingCancel(false)}
                        className="px-4 py-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Keep Pro
                      </button>
                      <button
                        type="button"
                        onClick={handleDeactivate}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Yes, Cancel Pro
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activationMsg && (
            <div
              className={`mt-4 p-3 rounded-xl text-xs text-center font-medium ${
                activationMsg.error
                  ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                  : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              }`}
            >
              {activationMsg.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};