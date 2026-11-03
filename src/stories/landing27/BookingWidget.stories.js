// LANDING PAGE CONCEPTS '27 / Components / Booking Widget — corporate version
// of the Presto widget. Concept only — not affiliated with IMEX.
import { ref } from 'vue'
import L27BookingWidget from '../../components/landing27/L27BookingWidget.vue'
import { frame } from './_helpers.js'

export default {
  title: "Landing Page Concepts '27/Components/Booking Widget",
  component: L27BookingWidget,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `
## Booking Widget (corporate)
The Presto booking widget re-thought for corporate events. The sports **team**
selector becomes **Company / organization** (search or type a new one) plus
**Attending as** (Exhibitor, Hosted buyer, Buyer / planner, Speaker, Media,
Staff) — Christine's 11/2 idea for the corporate vertical.

**Your stay** is event-aware: guests see the nights around the show with Smart
Monday and show days marked, instead of a blank calendar on today's month.

- **bar** — one row with popovers (heroes, sticky bars). Light or dark.
- **stacked** — inline, top to bottom (modal, side panel, hero card).
` } } },
}

export const Bar = {
  name: 'Bar — Light',
  render: () => ({
    components: { L27BookingWidget },
    setup: () => ({ last: ref('') }),
    template: frame(`<l27-booking-widget @search="last = JSON.stringify($event)" /><p style="margin-top:16px;font-size:13px;color:#5B5B66">search → {{ last || '—' }}</p>`),
  }),
}
export const BarDark = {
  name: 'Bar — Dark',
  render: () => ({ components: { L27BookingWidget }, template: frame('<l27-booking-widget tone="dark" organization="Northwind Events Co." attendee-type="exhibitor" />', { dark: true }) }),
}
export const Stacked = {
  name: 'Stacked',
  render: () => ({ components: { L27BookingWidget }, template: frame('<div style="max-width:560px;background:#fff;padding:24px;border-radius:16px"><l27-booking-widget layout="stacked" /></div>') }),
}
export const DatesOnly = {
  name: 'Bar — Dates + Guests Only',
  render: () => ({ components: { L27BookingWidget }, template: frame('<l27-booking-widget :show-corporate="false" />') }),
}
