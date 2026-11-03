// LANDING PAGE CONCEPTS '27 / Concepts / Heartbeat — concept 1 of the corporate
// events brand templates (IMEX America 2027 as the starting brand). Concept
// only; not affiliated with IMEX.
import L27Heartbeat from '../../../components/landing27/concepts/L27Heartbeat.vue'

export default {
  title: "Landing Page Concepts '27/Concepts/Heartbeat",
  component: L27Heartbeat,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Heartbeat — the editorial classic
The closest of the concepts to IMEX's own site: light, editorial and confident, led by the multicolor
headline *"The heartbeat of the global business events industry."* and a playful rounded photo collage.

**How booking is reached**
- **Pinned to the hero** — the corporate bar widget (company · attendee type · stay · rooms) overlaps the
  hero's bottom edge as a white card on a soft pink band. Searching opens the booking modal on results.
- **Sticky top bar** — slides in once the hero scrolls away (logo, dates, block meter, *Book your hotel*).
- **Header button**, every **hotel card** (opens the modal pre-selecting that hotel), the **block-meter band**
  and the **closing red CTA panel** all open the same page-owned booking modal.

**Engaging components**: stats band (count-up), perks grid with icon tiles cycling the four IMEX colors,
hotels + Strip map, live countdown + room-block meter with day-by-day plan, partner logo strip,
two-column FAQ, add-to-calendar.
`,
      },
    },
  },
}

export const Desktop = { render: () => ({ components: { L27Heartbeat }, template: '<l27-heartbeat />' }) }

export const BookingModalOpen = {
  name: 'Booking Modal Open',
  args: { initialModal: true, initialModalState: 'results' },
  render: (args) => ({ components: { L27Heartbeat }, setup: () => ({ args }), template: '<l27-heartbeat v-bind="args" />' }),
}
