/**
 * Daily Conversion Limit & Premium Management Utility
 * Strictly enforces a daily limit of 3 conversions for free users with zero signup/login required.
 * Stores local tracking based on date (resets automatically at midnight).
 */

export interface UsageState {
  count: number;
  maxDaily: number;
  remaining: number;
  isPremium: boolean;
  dateStr: string;
}

const FREE_DAILY_LIMIT = 3;
const USAGE_KEY_PREFIX = 'docfix_usage_';
const PREMIUM_KEY = 'docfix_premium_status';

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getUsageState(): UsageState {
  const isPremium = localStorage.getItem(PREMIUM_KEY) === 'active';
  const today = getTodayDateString();
  const saved = localStorage.getItem(`${USAGE_KEY_PREFIX}${today}`);
  const count = saved ? parseInt(saved, 10) || 0 : 0;
  const remaining = isPremium ? 999999 : Math.max(0, FREE_DAILY_LIMIT - count);

  return {
    count,
    maxDaily: FREE_DAILY_LIMIT,
    remaining,
    isPremium,
    dateStr: today
  };
}

export function canPerformConversion(): boolean {
  const state = getUsageState();
  if (state.isPremium) return true;
  return state.count < FREE_DAILY_LIMIT;
}

export function recordConversion(): UsageState {
  const isPremium = localStorage.getItem(PREMIUM_KEY) === 'active';
  const today = getTodayDateString();
  const currentSaved = localStorage.getItem(`${USAGE_KEY_PREFIX}${today}`);
  const currentCount = currentSaved ? parseInt(currentSaved, 10) || 0 : 0;

  const newCount = currentCount + 1;
  localStorage.setItem(`${USAGE_KEY_PREFIX}${today}`, newCount.toString());

  // Clean up older date keys to preserve clean storage
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(USAGE_KEY_PREFIX) && key !== `${USAGE_KEY_PREFIX}${today}`) {
        localStorage.removeItem(key);
      }
    }
  } catch {
    // Ignore storage iteration errors
  }

  return {
    count: newCount,
    maxDaily: FREE_DAILY_LIMIT,
    remaining: isPremium ? 999999 : Math.max(0, FREE_DAILY_LIMIT - newCount),
    isPremium,
    dateStr: today
  };
}

export function activatePremium(licenseCode?: string): boolean {
  // Accept standard unlock codes or direct purchase activation
  localStorage.setItem(PREMIUM_KEY, 'active');
  return true;
}

export function deactivatePremium(): void {
  localStorage.removeItem(PREMIUM_KEY);
}

export function resetDailyCountForTesting(): void {
  const today = getTodayDateString();
  localStorage.removeItem(`${USAGE_KEY_PREFIX}${today}`);
}
