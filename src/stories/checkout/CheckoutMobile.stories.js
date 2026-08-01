// CHECKOUT EXPERIENCE / Mobile — the mobile-optimized checkout, consolidated in
// one folder. Reuses the REAL checkout stories (no duplication) at phone width:
//   • single-column layout with 16px gutters (no horizontal scroll)
//   • the hold-timer top bar bleeds to the page edge cleanly
//   • "Protect your stay" reasons become a single-row swipeable carousel with
//     smaller type; the Policies section type is reduced to match
import { BookReservation } from './CheckoutPageExpanded.stories.js'
import { Reservation } from './StepReviewReservation.stories.js'
import { Mobile as GroupCheckoutMobile } from './CheckoutPageGroup.stories.js'

export default {
  title: 'Checkout Experience/Mobile',
  tags: ['mobile'],
  parameters: { layout: 'fullscreen' },
}

const mobile = (story, name) => ({ ...story, name, globals: { viewport: { value: 'mobile' } } })

/** The full expanded checkout at 390 — every step open, single column. */
export const Checkout = mobile(BookReservation, 'Checkout')

/** The Group Block (hold) checkout at 390 — stepped accordion, order summary below. */
export const GroupBlock = mobile(GroupCheckoutMobile, 'Group Block')

/** Review Reservation at 390 — "Protect your stay" reasons carousel + Policies. */
export const ProtectYourStay = mobile(Reservation, 'Protect Your Stay & Policies')
