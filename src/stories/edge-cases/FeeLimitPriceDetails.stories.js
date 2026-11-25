// EDGE CASES/03 · HOTEL DETAILS/FEE LIMIT/PRICE DETAILS
// Price details with the most fees an event can add (three).
// The story itself lives in its component's story file (hidden there with
// excludeStories) and is shown here, so every edge case has one home.
import * as Src from '../details/PriceDetails.stories.js'

export default {
  ...Src.default,
  title: 'Edge Cases/03 · Hotel Details/Fee Limit/Price Details',
  id: 'edge-cases-hotel-details-fee-limit-price-details',
  excludeStories: [],
  tags: ['edge-limits', 'step-03', 'book-reservation'],
}

export const ThreeFees = { ...Src.ThreeFees, name: 'Three Fees (Max)' }
