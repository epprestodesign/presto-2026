# spartanRace-ticketsocket-ep-demo-v1

**Widgets & Embeds R&D:** Eventpipe hotel booking embedded inside a partner's checkout.
The host is a desktop recreation of Spartan Race's San Antonio event page and TicketSocket
checkout, built from the captures in `../references/100526/SpartanRace/`. An Eventpipe widget
built from the Presto design system is embedded into that checkout.

- **Write-up:** Storybook → **Widgets & Embeds → R&D Overview** (`../src/stories/widgets/Overview.mdx`)
- **Hosted:** https://epprestodesign.github.io/presto-2026/spartanRace-ticketsocket-ep-demo-v1/
  (also Netlify `/spartan-widgets/`)

There are two pages:
- `index.html` is the Spartan host. It's plain Vue 3 with **no** Quasar or design-system code,
  so it stays pixel-matched.
- `presto.html` is the embedded Eventpipe widget. It uses the **real** presto-2026 library
  (Quasar plus `../src` components via the `@lib` alias) and renders in an iframe, the way a
  real third-party embed would.

Neither page has dependencies of its own: `vue`, `quasar` and `vite` resolve from the repo
root's `node_modules`.

```bash
cd spartanRace-ticketsocket-ep-demo-v1
npm run dev        # http://localhost:6201
npm run build      # → dist/ (relative base, runs from any sub-path)
```

## Concepts

`#/` is the prototype hub. Every screen is deep-linkable per concept as `#/<a…f>/<route>`.
The prototype banner switches concepts while keeping you on the same screen.

| | Inline: the finder expands inside the step | Modal: 900px `DsModal`, full-screen on phones | Separate page: hotel booked after the tickets |
| --- | --- | --- | --- |
| **Presto colors** (native navy) | **A** · `#/a/…` | **B** · `#/b/…` | **E** · `#/e/…` |
| **Spartan colors** (host red/black, neutral grays, black text) | **C** · `#/c/…` | **D** · `#/d/…` | **F** · `#/f/…` |

- **Modal concepts (B, D):** picking a hotel opens a **Review your stay** step. How to pay and
  Confirm sit on the left, the hotel order summary on the right, and "Powered by Eventpipe"
  sits under the modal.
- **Spartan skin:** colors only. It re-points the Presto brand tokens and the Slate 50–950
  neutral ramp at Spartan's palette (`src/presto/PrestoApp.vue`, `html.skin-spartan`).

## Flow

| Route (`#/<concept>/…`) | Screen | Reference |
| --- | --- | --- |
| `#/` | Prototype hub: four concepts with deep links | (new) |
| `event` | Event page, opening with a Sprint ticket in the cart | `screencapture-…`, 4.22.29, 4.22.36 |
| (overlay) | Ticket cart popover → **Commit now** | 4.22.46 |
| `account` | Join for free / sign in | 4.22.52 |
| `location` | Select your location (globe icon) | 4.23.18 |
| `checkout/details` | Order details, auto-filled (wave, signed waiver) so Checkout goes straight through | 4.23.32, 4.23.53, 4.24.02 |
| `checkout/addons` (`/hotels` = finder open) | **New · Eventpipe:** Make a weekend of it (parking, photo package, hotel). Hotel finder with filters, map (race venue labelled), sort, 5 pages of results, hotel details and a hotel order summary with Edit reservation / Start over | Eventpipe sketch |
| `checkout/extras` | Race for a Cause (givestar) + refundable booking | 4.24.10 |
| `checkout/your-details` | **New · Eventpipe:** library checkout steps 1–4 (contact, payment method, review your reservation, policies). No order rail and no Book Now; Continue goes to Payment | Checkout Experience Expanded |
| `checkout/payment` | Sezzle / card (Stripe Link) / Flex + terms → **Pay**, with a Hotel reservation block | 4.24.21 |
| `checkout/order-confirmed` | **E/F:** Spartan ticket receipt + "Make a weekend of it" hotel card → Find a hotel | (new) |
| `hotels` | **E/F:** separate hotel booking page under the Spartan bar: full Presto journey (browse, details, checkout, confirmation), paid on its own | Booking site |
| `checkout/confirmed` | **New · Eventpipe:** confirmation (library Single Reservation) with the hotel stay + race order; Spartan logo centered, Manage booking | Confirmation story |

**Pay** shows a processing state, then the confirmation. No real order is placed. A reload restarts the add-ons
step. Hover the faint **DEMO** tab in the bottom-left corner to jump between screens, switch
concepts or reset the demo.

## How the embed works

- `src/components/PrestoFrame.vue` (host) ↔ `src/presto/bridge.js` (widget) talk over
  postMessage: `resize`, `state`, `open-overlay`, `confirm`, `modal`, `sync`, `scroll`. The host
  owns the order: the hotel, parking and photo package flow into its total, breakdown, summary
  card and Payment.
- Inline embeds auto-size to their content, so only the host page scrolls. The library's Filters
  sheet and Map stay contained inside the widget.
- Library components used: `SearchSummaryBar`, `FilterRail`, `SortDropdown`,
  `HotelCardHorizontal`, `RoomAvailability`, `HotelMap`, `DsModal`, `HotelDetailPage`,
  `CartReview`, `StepContactInfo`, `StepPayment`, `StepReviewReservation`,
  `PoliciesAgreement`, `QPagination`.

**Hotel math** (`src/presto/hotels.js`): nightly rate × 1.13 tax, per room. "First night now"
charges one night today and the rest at the hotel; "Pay in full" charges the whole stay today.
Hill Country Lodge (2 Queen beds, Nov 20–22) works out to $122.04 or $244.08, matching the
sketch. The map needs `VITE_GOOGLE_MAPS_API_KEY` (repo-root `.env` locally, the
`GOOGLE_MAPS_API_KEY` Actions secret when hosted); without it the map shows the library's
"key needed" fallback.

## Changelog

**Oct 6, 2026**
- Concepts **E/F**: tickets-only checkout (Add-ons = parking + photo), Pay → ticket receipt with a
  hotel card → separate hotel page (`StayJourney.vue`: browse with HotelBrowser `layout="page"` +
  `HotelCardGroup`, `HotelDetailPage`, `CheckoutPageExpanded`, hotel-only `ConfirmationPage`).
  Shared helpers: `presto/cart.js`, `presto/fillDom.js`.
- Itemized order summary (Tickets → Add-ons → *Hotel & weekend add-ons by Eventpipe*, with the
  hotel fully itemized → Subtotal → fees → Total at the bottom). It pins by its bottom edge when tall.
- Confirmation step after Pay (`checkout/confirmed`): black bar with the Spartan logo centered and
  Manage booking; library `ConfirmationPage` (Single Reservation) with full hotel details and a
  race-order card.
- Prototype bar: **Auto-fill forms** toggle (persists across Reset demo) and a **Fill form** button.
- Hotels now have street addresses.

**Oct 5, 2026**
- Host page + checkout; Eventpipe Add-ons step; concepts A–D; Your Details step; prototype hub,
  banner and deep links; hosted under the Storybook site.

## Phase 2: widget slot

`src/components/TicketWidget.vue` holds everything that becomes the Eventpipe/TicketSocket widget:
the race cards, the Trifecta Pass card and the "powered by TicketSocket" mark. It's marked with
`data-widget-slot="ticketsocket"`. The rest of the event page is the Spartan host page.

## Fidelity notes

- Measured against the 1440px @2x captures. Layout, spacing and colors were sampled from the
  pixels, and body font sizes were calibrated by matching rendered text widths (Montserrat is
  Spartan's real body face).
- Display fonts are free stand-ins for Spartan's licensed faces:
  - Archivo at 125% width for the extra-wide headings (ORDER DETAILS, JOIN FOR FREE…)
  - Anton squeezed to 84% width for the condensed headings (SPRINT 5K, FROM $129.00, THE SPRINT…)

  To use the real fonts, swap `--font-wide` / `--font-cond` in `src/styles/base.css` and drop the
  `scaleX` on `.t-cond`.
- Pricing is reverse-engineered from the reference totals: $139 → $180.86; + Photo Package →
  $214.14; refundable booking = 11% → $23.56. See `src/store.js`.
- Made up because the references don't show them: inventory for the non-Sprint races, obstacle
  names after the first three, the fourth "What You Earn" card title, European countries after
  Malta plus a Middle East region, waiver copy, and promo codes (`SPARTAN10`, `AROO`).
- The Stripe Link block shows the email from the reference capture (`LINK_ACCOUNT` in
  `src/data.js`). Change it before sharing this outside the team.
