// LINEAR TICKETS / DES-478 / Confirmation Email — the booking confirmation
// email with the Experience Now offer in the body: booking details → main
// button → partner offer → help/footer.
import ConfirmationEmail from '../../../components/des478/ConfirmationEmail.vue'
import { sampleConfirmation } from '../../../components/des478/des478.js'

const email = (mode, device = 'desktop') => () => ({
  components: { ConfirmationEmail },
  setup: () => ({ data: sampleConfirmation(mode), mode, device }),
  template: `
    <div :style="{ padding: device === 'mobile' ? '0' : '32px', background: 'var(--ds-color-surface-sunken)', minHeight: '100vh' }">
      <confirmation-email :mode="mode" :data="data" :device="device" :style="{ maxWidth: device === 'mobile' ? 'none' : '880px', margin: '0 auto' }" />
    </div>`,
})

export default {
  title: 'Linear Tickets/DES-478/Confirmation Email',
  component: ConfirmationEmail,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'DES-478 · The booking confirmation email with the **Experience Now** offer. It comes after the booking details and the main button, so the reservation info stays at the top.',
      },
    },
  },
}

/** Single reservation email. */
export const BookReservation = { name: 'Book Reservation', render: email('reserve') }

/** Multiple reservations: one block per hotel, one offer. */
export const MultipleReservations = { name: 'Multiple Reservations', render: email('reservations') }

/** Group block hold email (sent to the organizer). */
export const GroupBlock = { name: 'Group Block', render: email('hold') }

/** The same email in a phone mail app (390). */
export const Mobile = {
  name: 'Mobile (390)',
  tags: ['mobile'],
  globals: { viewport: { value: 'mobile', isRotated: false } },
  render: email('reserve', 'mobile'),
}
