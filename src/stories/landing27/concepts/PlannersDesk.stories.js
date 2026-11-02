// LANDING PAGE CONCEPTS '27 / Concepts / Planner's Desk — corporate, practical
// landing page with the corporate booking widget in the hero.
import L27PlannersDesk from '../../../components/landing27/concepts/L27PlannersDesk.vue'

export default {
  title: "Landing Page Concepts '27/Concepts/Planner's Desk",
  component: L27PlannersDesk,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `
## Concept 3 — Planner's Desk
Corporate, practical, trustworthy. Built around Christine's notes: **planners booking
rooms for their company, department or team**. Clean white + IMEX navy with red
accents — more SaaS / enterprise than festival.

**How booking is reached**
- The **stacked corporate widget lives in the hero card** ("Find your hotel") with a
  compact block meter — booking is the first thing you see. Search shows a short
  "Finding rooms…" beat, then opens the booking modal on the results preview.
- Nav **Book rooms** button → booking modal (form).
- **Who's attending?** tabs (Exhibitor / Hosted buyer / Buyer-planner / Speaker) swap
  practical tips and a recommended stay; **Book this stay** opens the modal with those nights.
- **Rate comparison table** (public vs IMEX rate, % saved, rooms left, sortable by price or
  walk time) — each **Book** opens the modal on that hotel.
- **Need 10+ rooms?** group-block request form (company, rooms, nights via the stay strip,
  email) with an inline success state.

**Engaging components:** L27BookingWidget (stacked), L27BlockMeter (compact),
L27StayStrip, L27Faq, L27BookingModal, L27ConceptTag.

_Concept only — not affiliated with IMEX. Rates and blocks are sample data._
` } } },
}

export const Desktop = { name: 'Desktop', render: () => ({ components: { L27PlannersDesk }, template: '<l27-planners-desk />' }) }
export const BookingModalOpen = {
  name: 'Booking Modal Open',
  render: () => ({ components: { L27PlannersDesk }, template: '<l27-planners-desk initial-modal initial-modal-state="results" />' }),
}
