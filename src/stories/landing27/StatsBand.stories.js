// LANDING PAGE CONCEPTS '27 / Components / Stats Band — concept only.
import L27StatsBand from '../../components/landing27/L27StatsBand.vue'
import { frame } from './_helpers.js'

export default {
  title: "Landing Page Concepts '27/Components/Stats Band",
  component: L27StatsBand,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `## Stats Band
IMEX 2026 show stats as big-number social proof. Counts up on scroll.` } } },
}
export const Light = { name: 'Light', render: () => ({ components: { L27StatsBand }, template: frame('<l27-stats-band tone="color" />') }) }
export const Dark = { name: 'Dark', render: () => ({ components: { L27StatsBand }, template: frame('<l27-stats-band tone="dark" />', { dark: true }) }) }
