// EDGE CASES/04 · CHECKOUT/FEE LIMIT/RESERVATION SUMMARY
// The reservation summary with the most fees an event can add (three).
// The story itself lives in its component's story file (hidden there with
// excludeStories) and is shown here, so every edge case has one home.
import * as Src from '../checkout/ReservationSummary.stories.js'

export default {
  ...Src.default,
  title: 'Edge Cases/04 · Checkout/Fee Limit/Reservation Summary',
  id: 'edge-cases-checkout-fee-limit-reservation-summary',
  excludeStories: [],
  tags: ['edge-limits', 'step-04'],
}

export const ThreeFees = { ...Src.ThreeFees, name: 'Three Fees (Max)' }
