// LINEAR TICKETS / DES-478 / Confirmation Page — the real ConfirmationPage with
// the Experience Now partner offer in its `after-summary` slot. The offer comes
// after the booking details (so it doesn't compete with them) and before the
// policies (so it isn't buried). Same placement in all three flows.
import PageFrame from '../../../components/PageFrame.vue'
import ConfirmationPage from '../../../components/confirmation/ConfirmationPage.vue'
import ExperienceNowOffer from '../../../components/des478/ExperienceNowOffer.vue'
import { sampleConfirmation } from '../../../components/des478/des478.js'

const page = (mode, cartMode) => () => ({
  components: { PageFrame, ConfirmationPage, ExperienceNowOffer },
  setup: () => ({ data: sampleConfirmation(mode), mode, cartMode }),
  template: `
    <page-frame :cart-mode="cartMode" :show-cart="false">
      <confirmation-page :mode="mode" :data="data">
        <template #after-summary><experience-now-offer /></template>
      </confirmation-page>
    </page-frame>`,
})

export default {
  title: 'Linear Tickets/DES-478/Confirmation Page',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'DES-478 · The booking confirmation page with the **Experience Now** partner offer. It sits after the reservation summary and before the policies, in every flow. Logo only (XNow); the link is a placeholder.',
      },
    },
  },
}

/** Single reservation — the main case in the ticket. */
export const BookReservation = { name: 'Book Reservation', render: page('reserve', 'reserve') }

/** Multiple reservations — one offer for the whole trip, not one per hotel. */
export const MultipleReservations = { name: 'Multiple Reservations', render: page('reservations', 'reservations') }

/** Group block hold — the organizer sees the same offer. */
export const GroupBlock = { name: 'Group Block', render: page('hold', 'hold') }

/** Phone width (390): the offer stacks under the summary, full width. */
export const Mobile = {
  name: 'Mobile (390)',
  tags: ['mobile'],
  globals: { viewport: { value: 'mobile', isRotated: false } },
  render: page('reserve', 'reserve'),
}
