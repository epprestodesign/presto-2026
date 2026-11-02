// LANDING PAGE CONCEPTS '27 / Components / Countdown — concept only.
import L27Countdown from '../../components/landing27/L27Countdown.vue'
import { frame } from './_helpers.js'

export default {
  title: "Landing Page Concepts '27/Components/Countdown",
  component: L27Countdown,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `## Countdown
Live days / hours / min / sec to the show opening (Tue Sep 28, 2027).` } } },
}
export const Light = { name: 'Light', render: () => ({ components: { L27Countdown }, template: frame('<l27-countdown />') }) }
export const Dark = { name: 'Dark', render: () => ({ components: { L27Countdown }, template: frame('<l27-countdown tone="dark" />', { dark: true }) }) }
