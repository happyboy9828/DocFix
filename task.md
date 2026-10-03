# Task: Microsoft Clarity + Confidential Secrets Handling

## Goal
Add `@microsoft/clarity` to the project and establish a proper `.env` setup for
confidential secrets.

## Changes

### Dependency
- `npm install @microsoft/clarity` → `^1.0.2` in `dependencies`

### New file — `src/utils/clarity.ts`
Thin wrapper around the Clarity SDK:
- `PROJECT_ID` read from `import.meta.env.VITE_CLARITY_PROJECT_ID`
- **Consent-gated**: does not initialise until `localStorage['docfix_cookie_consent']` is
  `'accepted'`, so no session recording happens before the visitor opts in
- `initClarity()` — guarded init, no-ops when the project ID is blank
- `syncClarityConsent()` — called by `CookieBanner` after accept/decline; downgrades to
  `Clarity.consentV2({ denied, denied })` if the visitor has already initialised and then
  declines
- `trackEvent(name)` / `trackTag(key, value)` — safe helpers, wrapped in try/catch so
  analytics can never throw into the app
- `isClarityEnabled()` — whether a project ID is configured

### `src/main.tsx`
Calls `initClarity()` before `createRoot(...).render(...)`.

### `src/components/CookieBanner.tsx`
Calls `syncClarityConsent()` in both `handleAccept` and `handleDecline`.

### Env files
- `.env` (gitignored) — local dev secrets, Clarity ID left blank for the user to fill
- `.env.example` (committed) — fully documented template that explains the
  `VITE_`-prefix rule

## The VITE_ prefix rule
Vite inlines **only** `VITE_`-prefixed variables into the client bundle at build time, and
it does so by substituting the literal value. So:
- `VITE_*` = **public**. Fine for a Clarity project ID or a publishable key. Rotating the
  var does not revoke an already-deployed value.
- No prefix = **server-only**, read via `process.env` in `server.ts`. Use for real secrets.

This is stated explicitly in both env files and in the header comment of
`src/utils/clarity.ts`, because a Clarity project ID being called a "secret" is the exact
trap that leads to real API keys being pasted into `VITE_`-prefixed variables.

## Verification
- `npm run lint` — passing
- `npm run build` — passing
- Confirmed `www.clarity.ms/tag/` + project ID injector appears in `dist/assets/*.js` when
  a project ID is set, and is **tree-shaken out entirely** when the ID is blank (zero
  Clarity bytes shipped). `.env` was restored to blank afterwards.
- Confirmed `git check-ignore` reports `.env` is ignored by `.gitignore:7` (`.env*`) and
  `.env.example` is not ignored
