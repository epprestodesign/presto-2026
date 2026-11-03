// LANDING PAGE CONCEPTS '27 / Components — engaging sections shared by the
// concepts. Concept only — not affiliated with IMEX.
import L27StayPlanner from '../../components/landing27/L27StayPlanner.vue'
import { frame } from './_helpers.js'

export default {
  title: "Landing Page Concepts '27/Components/Stay Planner",
  component: L27StayPlanner,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `
## Stay Planner — "Schedule → your stay"
Guests tick the days they'll be at IMEX (Smart Monday + three show days). The
planner works out check-in (the night before) and check-out (the morning
after) and offers **Book N nights** — which opens the booking modal with the
stay filled in.
` } } },
}
export const Light = { name: 'Light', render: () => ({ components: { L27StayPlanner }, template: frame('<l27-stay-planner />') }) }
export const Dark = { name: 'Dark', render: () => ({ components: { L27StayPlanner }, template: frame('<l27-stay-planner tone="dark" />', { dark: true }) }) }
