# Presto Booking — DES-478 Experience Now Offer

A copy of the clickable booking prototype (`../prototype/`) for Linear ticket
[DES-478](https://linear.app/eventpipe/issue/DES-478): promote our partner
**Experience Now** right after a guest books.

What's different from `../prototype/`:

- **Baltimore event.** Event name, dates, venue and hotel cities come from
  `@lib/components/des478/des478.js`, so the offer reads "You're going to Baltimore!"
- **Confirmation page offer.** `ExperienceNowOffer` sits in ConfirmationPage's
  `after-summary` slot (after the booking details, before the policies) in all
  three flows: single reservation, multiple reservations, group block hold.
- **Confirmation email.** "Preview confirmation email" (bottom right on the
  confirmation screen) opens the email mockup with the same offer.

XNow logo only (the card keeps Presto colors), and the join link is a placeholder.

## Run it

```bash
cd prototype-des478
npm run dev            # → http://localhost:6478
```

Same zero-install setup as `../prototype/` (deps resolve from the repo root).

## Deep links

| Screen | URL |
| --- | --- |
| Single reservation confirmation | `/?screen=confirmation&flow=reserve&n=1` |
| Multiple reservations confirmation | `/?screen=confirmation&flow=reserve&n=2` |
| Group block confirmation | `/?screen=confirmation&flow=group&n=2` |
| Any of the above + the email open | add `&email=1` |
