import Clarity from '@microsoft/clarity';

/**
 * Microsoft Clarity integration.
 *
 * The Clarity project ID is read from VITE_CLARITY_PROJECT_ID. Anything prefixed with
 * VITE_ is inlined into the client bundle at build time and is therefore PUBLIC - do not
 * put real secrets in it. Server-only secrets must use an unprefixed name so Vite never
 * exposes them (see .env.example).
 *
 * The tag does not initialise until the visitor accepts analytics in CookieBanner, so no
 * session recording happens before consent.
 */

const PROJECT_ID = (import.meta.env.VITE_CLARITY_PROJECT_ID || '').trim();
const CONSENT_KEY = 'docfix_cookie_consent';

let initialized = false;

function hasAnalyticsConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'accepted';
  } catch {
    return false;
  }
}

export function isClarityEnabled(): boolean {
  return Boolean(PROJECT_ID);
}

export function initClarity(): void {
  if (initialized || !PROJECT_ID) return;
  if (!hasAnalyticsConsent()) return;

  try {
    Clarity.init(PROJECT_ID);
    initialized = true;
  } catch (err) {
    console.warn('[clarity] failed to initialise', err);
  }
}

/** Call after the visitor accepts or declines in the cookie banner. */
export function syncClarityConsent(): void {
  if (!PROJECT_ID) return;

  if (!hasAnalyticsConsent()) {
    if (initialized) {
      Clarity.consentV2({ ad_Storage: 'denied', analytics_Storage: 'denied' });
    }
    return;
  }

  initClarity();
}

export function trackEvent(name: string): void {
  if (!initialized) return;
  try {
    Clarity.event(name);
  } catch {
    // Analytics must never break the app
  }
}

export function trackTag(key: string, value: string): void {
  if (!initialized) return;
  try {
    Clarity.setTag(key, value);
  } catch {
    // Analytics must never break the app
  }
}