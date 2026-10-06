# spartanRace-ticketsocket-ep-demo-v1

Desktop prototype recreating Spartan Race's San Antonio event page and its TicketSocket checkout,
built from the captures in `../references/100526/SpartanRace/`.

It's a standalone Vue 3 + Vite app. It does **not** use Quasar, the presto design system, or
anything from `../src` / Storybook. Like `../prototype/`, it has no dependencies of its own:
`vue` and `vite` resolve from the repo root's `node_modules`.

```bash
cd spartanRace-ticketsocket-ep-demo-v1
npm run dev        # http://localhost:6201
npm run build      # → dist/
```

## Flow

| Route | Screen | Reference |
| --- | --- | --- |
| `#/` | Prototype hub: choose version A or B, with deep links | (new) |
| `#/a/event` · `#/b/event` | Event page: info, ticket cards, gallery, distances, obstacles, earn, race-day info, map, testimonials, nearby events, footer | `screencapture-…`, 4.22.29, 4.22.36 |
| (overlay) | Ticket cart popover → **Commit now** | 4.22.46 |
| `#/account` | Join for free / sign in | 4.22.52 |
| `#/location` | Select your location (globe icon) | 4.23.18 |
| `#/checkout/details` | Order details: wave time, add-ons, waiver signature, Instagram, refund policy | 4.23.32, 4.23.53, 4.24.02 |
| `#/<a|b>/checkout/addons` (`/hotels` = finder open) | **New:** Eventpipe add-ons (parking + hotel) | Eventpipe sketch |
| `#/checkout/extras` | Race for a Cause (givestar) + refundable booking | 4.24.10 |
| `#/checkout/payment` | Sezzle / card (Stripe Link) / Flex + terms → **Pay** | 4.24.21 |

**Pay** shows a processing state and stops. No order is placed. Hover the faint **DEMO** tab in
the bottom-left corner to jump between screens or reset the demo.

## Hotel add-ons (Eventpipe × Presto)

`#/` is a prototype hub with two versions of a new **Add-ons** step
(Details › **Add-ons** › Extras › Payment), built from the sketch "Make a weekend of it":

| Version | What happens when you turn on "Hotel room" |
| --- | --- |
| **A · Inline** | The Presto hotel finder expands inside the step. Picking a hotel and a payment option updates the Spartan total as you go. |
| **B · Modal** | A 900px `DsModal` opens over the checkout. Filter rail and results sit side by side; it stacks below 700px and becomes the library's full-screen phone pattern at 600px and below. **Add to order** brings the stay back. |

Every screen is deep-linkable per version. The `#/a/…` URLs are Version A and the `#/b/…` URLs
are Version B. `#/<a|b>/checkout/addons/hotels` opens straight to the hotel finder. The home
page lists every link with a copy button. Links without a version prefix pick up the current
version and rewrite themselves.

The add-ons UI lives in `presto.html` → `src/presto/` and is rendered in an iframe. It uses the
real presto-2026 library (Quasar plus `../src` components, via the `@lib` alias, in native Presto
colors): `SearchSummaryBar`, `FilterRail` (Filters sheet), `SortDropdown`, `HotelCardHorizontal`
in Group Block mode ("Starting price · Select Rooms" plus the availability panel), and
`DsModal` + `HotelMap` for the map. The iframe keeps Quasar's global CSS off the Spartan page.
`src/presto/bridge.js` documents the postMessage protocol. The host owns the order, so the hotel
shows up in the total breakdown, the summary card and a "Hotel reservation" block on Payment.

Hotel math (`src/presto/hotels.js`): nightly rate × 1.13 tax, per room. "First night now" charges
one night today and the rest at the hotel; "Pay in full" charges the whole stay today.
Hill Country Lodge (2 Queen beds, Nov 20–22) works out to $122.04 or $244.08, matching the sketch.
The map needs `VITE_GOOGLE_MAPS_API_KEY` in the repo-root `.env`; without it the map shows the
library's "key needed" fallback.

Planned next: a Spartan-skinned version of A and B (4 variations total). That's a token
swap in the Presto app only.

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
