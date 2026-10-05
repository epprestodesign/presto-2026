# spartanRace-ticketsocket-ep-demo-v1

Desktop prototype recreating Spartan Race's San Antonio event page and its TicketSocket checkout,
built from the captures in `../references/100526/SpartanRace/`.

It's a standalone Vue 3 + Vite app. It does **not** use Quasar, the presto design system, or
anything from `../src` / Storybook. Like `../prototype/`, it has no dependencies of its own:
`vue` and `vite` resolve from the repo root's `node_modules`.

```bash
cd spartanRace-ticketsocket-ep-demo-v1
npm run dev        # http://localhost:6200
npm run build      # → dist/
```

## Flow

| Route | Screen | Reference |
| --- | --- | --- |
| `#/` | Event page: info, ticket cards, gallery, distances, obstacles, earn, race-day info, map, testimonials, nearby events, footer | `screencapture-…`, 4.22.29, 4.22.36 |
| (overlay) | Ticket cart popover → **Commit now** | 4.22.46 |
| `#/account` | Join for free / sign in | 4.22.52 |
| `#/location` | Select your location (globe icon) | 4.23.18 |
| `#/checkout/details` | Order details: wave time, add-ons, waiver signature, Instagram, refund policy | 4.23.32, 4.23.53, 4.24.02 |
| `#/checkout/extras` | Race for a Cause (givestar) + refundable booking | 4.24.10 |
| `#/checkout/payment` | Sezzle / card (Stripe Link) / Flex + terms → **Pay** | 4.24.21 |

**Pay** shows a processing state and stops. No order is placed. Hover the faint **DEMO** tab in
the bottom-left corner to jump between screens or reset the demo.

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
