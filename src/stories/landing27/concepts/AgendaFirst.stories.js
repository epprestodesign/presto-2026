// LANDING PAGE CONCEPTS '27 / Concepts / Agenda First — editorial conference
// site where booking lives inside the agenda. Concept only, not affiliated with IMEX.
import L27AgendaFirst from '../../../components/landing27/concepts/L27AgendaFirst.vue'

export default {
  title: "Landing Page Concepts '27/Concepts/Agenda First",
  component: L27AgendaFirst,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `
## Concept 5 · Agenda First
An **editorial conference site** (inspired by Adobe 99U): bold red abstract hero
art built in CSS, a yellow "What to expect" band, a speakers grid with colored
monogram tiles, a day-by-day agenda, venue & hotels, and an FAQ.

**The idea:** attendees plan around *sessions*, so booking lives inside the
agenda. Every day has a **Book for this day** button that opens the booking
modal with that day's stay pre-filled — check in the night before, out the
morning after (e.g. Smart Monday → Sep 26–28). A **Book all four days** button
covers the whole week.

**How booking is reached**
- Nav and hero **Book your hotel** → booking modal (form).
- **Book for this day** on each agenda day → modal with that stay.
- Venue section **booking widget bar** → modal results for the chosen stay.
- Hotel cards (**L27HotelMap**, no map, 3 hotels) → modal with that hotel first.
- **Sticky bottom bar** (L27StickyBar, position bottom) once the hero scrolls away.

**Engaging components:** L27AddToCalendar, block-booked meter in the hero,
L27BookingWidget, L27HotelMap, L27Faq, L27StickyBar, L27BookingModal, L27ConceptTag.
` } } },
}

export const Desktop = {
  render: (args) => ({ components: { L27AgendaFirst }, setup: () => ({ args }), template: '<l27-agenda-first v-bind="args" />' }),
}

export const BookingModalOpen = {
  name: 'Booking Modal Open',
  args: { initialModal: true, initialModalState: 'results' },
  render: Desktop.render,
}
