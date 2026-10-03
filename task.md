# Task: Change Payment Flow — Bank / Wallet Dropdown + Account Number Verification

## Goal
Rework the payment step of `PremiumModal.tsx`. When a user clicks a plan:

- **Removed** the "Pay via EasyPaisa / JazzCash / Raast" header, the hardcoded
  `0300-1234567` number, and the "Send Rs. X to Title: DocFix Official" instruction line.
- **Removed** the free-text "Bank Details" field.
- **Added** a **Bank or Mobile Wallet** dropdown listing Pakistani banks and mobile wallets,
  grouped into two `<optgroup>`s.
- Kept the **Account Number** input and the **Check Payment Details** button, which
  validates the account number against the selected source type.

## In scope
`src/components/PremiumModal.tsx` only — payment step (`step === 'payment'`):

- `PaymentSource` type (`id`, `label`, `type: 'bank' | 'wallet'`)
- `BANKS` — 29 Pakistani banks
- `MOBILE_WALLETS` — EasyPaisa, JazzCash, SadaPay, NPay, InstaPay, Raast, Zong, Jazz,
  Ufone, Warid
- `PAYMENT_SOURCES` — concatenated lookup list
- `findPaymentSource()` — resolves an id to its source
- `validatePaymentDetails()` — now validates `{ accountNumber, sourceId }`:
  - a source must be selected
  - digits only
  - **wallet** → must match `/^03\d{9}$/` (11 digits starting 03)
  - **bank** → 10–17 digits
- Label, placeholder, and helper copy all switch to "Mobile Wallet Number" when a wallet is
  selected
- Dropdown uses `appearance-none` + `ChevronDown` to match the input styling
- Modal subtitle no longer mentions paying or the cheat code

## Out of scope
- `src/utils/limitEngine.ts`, `src/components/DailyLimitBadge.tsx`, `Navbar.tsx`,
  `SingleDocResizer.tsx`, `CnicCombiner.tsx`, `JobBundlePack.tsx`, and page prop plumbing
- Plans, feature list, cheat-code activation (`UnlockForm`), cancel flow
- Ad monetization (`AdSlot`, Monetag), dark mode, backend routes
- `App.tsx` catch-all route fix from the previous turn (already applied)

## Verification
- `npm run lint` (`tsc --noEmit`) — passing
- `npm run build` — passing
