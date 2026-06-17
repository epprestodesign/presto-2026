// NAVIGATION / Global Nav — the app's dark top bar (logo + Manage Booking +
// cart icon) whose cart opens a right-side fly-out order summary, Uber Eats
// style. The fly-out has two data modes: a group/team room hold and a single
// hotel reservation. Accents use the DS primary (Zinc 900); the held timer
// counts down live and the cart badge tracks the live selection.
import GlobalNav from '../../components/GlobalNav.vue'

// "Hold Rooms for Group or Team" cart — collapsible hotels → rooms → day steppers.
const holdCart = {
  heldSeconds: 372, // 06:12
  taxRate: 0.12,
  feePerNight: 30, // property fee per room-night
  hotels: [
    {
      name: 'Embassy Suites Chicago Downtown',
      imageCategories: ['suites', 'rooms'],
      seed: 0,
      rooms: [
        { type: 'Two-Room Suite King', summary: '1 King Bed · Sleeps 4', price: 269, nights: [
          { date: 'Tue, Jun 23', qty: 4, roomsLeft: 6 },
          { date: 'Wed, Jun 24', qty: 1, roomsLeft: 5 },
        ] },
        { type: 'Two-Room Suite Double', summary: '2 Queen Beds · Sleeps 4', price: 289, nights: [
          { date: 'Tue, Jun 23', qty: 1, roomsLeft: 5 },
          { date: 'Wed, Jun 24', qty: 1, roomsLeft: 4 },
        ] },
      ],
    },
    {
      name: 'The Concord Hotel',
      imageCategories: ['lobby', 'rooms'],
      seed: 2,
      rooms: [
        { type: 'King Studio', summary: '1 King Bed · Sleeps 2', price: 165, nights: [
          { date: 'Tue, Jun 23', qty: 1, roomsLeft: 6 },
        ] },
        { type: 'Double Queen', summary: '2 Queen Beds · Sleeps 4', price: 185, nights: [
          { date: 'Tue, Jun 23', qty: 1, roomsLeft: 3 },
        ] },
      ],
    },
  ],
}

// "Hotel Reservation" cart — held countdown, rich reservation summary.
const reserveCart = {
  hotel: { name: 'The Concord Hotel', address: '750 Tremont St, Boston, MA 02118' },
  heldSeconds: 895, // 14:55
  imageCategories: ['suites', 'rooms', 'lobby', 'pool', 'dining'],
  seed: 1,
  checkIn: { date: '06/23/2026', time: '4:00pm' },
  checkOut: { date: '06/24/2026', time: '11:00am' },
  nights: 1,
  highlights: [
    { icon: 'kitchen', label: 'Kitchen' },
    { icon: 'ac_unit', label: 'Air conditioning' },
    { icon: 'microwave', label: 'Microwave' },
  ],
  roomType: 'Aparthotel',
  bedConfig: '1 King Bed and 1 Queen Sofa Bed',
  sleeps: 2,
  amenities: [{ icon: 'wifi', label: 'Free WiFi' }],
  priceDetails: {
    nights: 1,
    rooms: 1,
    rate: 164.78,
    subtotal: 164.78,
    program: 'OneKeyCash applied',
    discount: '$26.55 off',
    taxes: 47.53,
    propertyFee: 110.0,
    total: 322.31,
  },
  roomsLeft: 1,
}

export default {
  title: 'Navigation/Global Nav',
  component: GlobalNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: `
## Overview
The **Global Nav** is the app's persistent dark top bar — brand logo, a
**Manage Booking** pill, and a **cart icon** with a live count badge. Clicking
the cart opens the **Cart Fly-out** order summary (Uber Eats-style slide-over).

## Cart modes
- **\`hold\`** — "Hold Rooms for Group or Team": rooms grouped by type with live
  − / + steppers, Remove, "+ Add another hotel", and a "N Rooms Selected" /
  held-until panel + Proceed to Checkout. The badge tracks the live count.
- **\`reserve\`** — "Hotel Reservation": held countdown, photo carousel, dates,
  nightly breakdown, Total, Due Today / Balance Due, Edit / Start Over.

Built on DS tokens; primary actions use the brand Zinc 900.
` } },
  },
}

/** Just the bar — empty cart. Click the cart icon to open the fly-out. */
export const Default = {
  render: () => ({
    components: { GlobalNav },
    setup: () => ({ cart: reserveCart }),
    template: `<global-nav brand="Soccer League" cart-mode="reserve" :cart="cart" />`,
  }),
}

/** Group / team room hold — fly-out shown open over the bar. */
export const GroupHoldCart = {
  render: () => ({
    components: { GlobalNav },
    setup: () => ({ cart: holdCart }),
    template: `<global-nav brand="Soccer League" cart-mode="hold" :cart="cart" :start-open="true" />`,
  }),
}

/** Single hotel reservation — fly-out shown open over the bar. */
export const ReservationCart = {
  render: () => ({
    components: { GlobalNav },
    setup: () => ({ cart: reserveCart }),
    template: `<global-nav brand="Soccer League" cart-mode="reserve" :cart="cart" :start-open="true" />`,
  }),
}
