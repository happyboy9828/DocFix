# DocFix — Project Phases

## Current State
React 19 + Vite + TypeScript SPA, served by an Express dev/prod server (`server.ts`).
All document processing (resize, CNIC combine, job bundle ZIP) runs **client-side**.
AI/diagnostic validation is served from `server/routes/api.ts`.

**Monetization: ads only.** Monetag meta tag + `AdSlot` placeholders + `CookieBanner`
ad consent. There is no working payment processor, no auth, and no database.

## Phase History

### Phase 1 — Project structure
React/Vite/Express scaffold, portal presets in `server/data/portals.ts`, tab routing
(`PATH_TO_TAB` / `TAB_TO_PATH` in both `App.tsx` and `server.ts`).

### Phase 2 — Core document tools
- `SingleDocResizer` — per-portal image resizing + PDF export
- `CnicCombiner` — NADRA CNIC front/back single-page combine
- `JobBundlePack` + `bundleEngine` — multi-document ZIP pack
- Engines: `imageEngine`, `pdfEngine`, `bundleEngine`
- Diagnostic, directory, guidelines, FAQ, legal pages

### Phase 3 — Dark mode + Monetag (commit `b5b4c32`)
`utils/theme.ts` + `useTheme.ts`, pre-paint FOUC script in `index.html`, Monetag verification
meta tag, `components/ads/AdSlot.tsx`, `CookieBanner`, ad compliance copy in `Footer` and
`PrivacyPolicy`.

### Phase 4 — Premium paywall (localStorage simulation)
`utils/limitEngine.ts` enforced a 3-conversions/day free tier with premium unlock via
`localStorage['docfix_premium_status']`. `PremiumModal` sold three PKR plans through a manual
offline flow. `DailyLimitBadge` + Navbar "Buy Premium" button were the upsell surface.
Gates lived in `SingleDocResizer`, `CnicCombiner`, and `JobBundlePack`.

### Phase 5 — Payment flow rework (current)
The payment step of `PremiumModal` was rebuilt around source selection instead of a
self-reported transaction ID.

**Removed:** the "Pay via EasyPaisa / JazzCash / Raast" header, the hardcoded `0300-1234567`
number, the "Send Rs. X to Title: DocFix Official" instruction, and the free-text
**Bank Details** field.

**Added:**
- `PaymentSource` type and two lookup lists — `BANKS` (29 Pakistani banks) and
  `MOBILE_WALLETS` (EasyPaisa, JazzCash, SadaPay, NPay, InstaPay, Raast, Zong, Jazz, Ufone,
  Warid), rendered as two `<optgroup>`s in a native `<select>`
- `findPaymentSource()` to resolve a selected id
- Type-aware validation in `validatePaymentDetails()`:
  - wallet → `/^03\d{9}$/` (11 digits starting 03)
  - bank → 10–17 digits
- Label, placeholder, and helper text switch to "Mobile Wallet Number" for wallets
- `Check Payment Details` persists `{ accountNumber, sourceId }` to
  `localStorage['docfix_payment_details']` and reports correct/incorrect

**Also fixed:** a pre-existing `tsc` error in `App.tsx` — the catch-all route now renders
`<Navigate to="/" replace />` instead of an element callback returning `null`.

**Not changed:** plans, feature list, cheat-code activation, cancel flow, `limitEngine`,
`DailyLimitBadge`, and all paywall gates in the tool components.

## Known Issues
- `PremiumModal` leaks a working unlock code in its error message and has a frictionless
  "Instant Demo Pass" button — premium is not actually protected.
- `activatePremium(licenseCode)` ignores its argument; validation lives only in the UI.
- The payment check is **client-side format validation only**. There is no bank or wallet
  API behind it, so it confirms the input is well-formed, not that a transfer occurred.
  Nothing is transmitted to the server and there is no record of any payment.
- `Terms of Service` has no pricing, subscription, renewal, cancellation, or refund section.
- `index.html` JSON-LD declares `price: "0"`, contradicting the paid plans.
- Dead code: unused `AdSlot` import in `App.tsx`, unused `docfix_adsense_pub_id` state in
  `AdSlot.tsx`, `dotenv` declared in `package.json` but never imported.

## Commands
| Command | Purpose |
| --- | --- |
| `npm run dev` | Express + Vite middleware dev server (port 3000) |
| `npm run build` | Production build to `dist/` |
| `npm run lint` | `tsc --noEmit` typecheck |
