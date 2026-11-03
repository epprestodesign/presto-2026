// LANDING PAGE CONCEPTS '27 / Components / Booking Modal — opens Presto
// booking over any page (concept pages or outside builders like Framer).
import { ref } from 'vue'
import L27BookingModal from '../../components/landing27/L27BookingModal.vue'
import { frame } from './_helpers.js'

export default {
  title: "Landing Page Concepts '27/Components/Booking Modal",
  component: L27BookingModal,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `
## Booking Modal
How a landing page — ours, or an outside template (Framer, Webflow…) — opens
Presto booking **without leaving the page**. Built on the design system's
**DsModal**. Three states, all in the modal:

1. **Form** — the stacked corporate widget.
2. **Searching** — "Finding rooms near Mandalay Bay…".
3. **Results preview** — official hotels with walk time, block rate and rooms left.

For outside templates, the hook is one button: \`<button data-presto-book>\`
plus a small script that mounts this modal (see the Overview page).
` } } },
}

// A sample search, as the widget would emit it.
const sample = { organization: 'Northwind Events Co.', attendeeType: 'exhibitor', stay: { arrive: '2027-09-27', depart: '2027-10-01' }, rooms: 2, guests: 2 }
const render = (state) => () => ({
  components: { L27BookingModal },
  setup: () => ({ open: ref(true), state, search: state === 'form' ? null : sample }),
  template: frame(`<button class="l27-btn l27-btn--primary" @click="open = true">Open booking modal</button><l27-booking-modal v-model="open" :initial-state="state" :search="search" />`),
})
export const Form = { name: '1 · Form', render: render('form') }
export const Searching = { name: '2 · Searching', render: render('searching') }
export const Results = { name: '3 · Results Preview', render: render('results') }
