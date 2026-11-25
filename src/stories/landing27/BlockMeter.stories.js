// LANDING PAGE CONCEPTS '27 / Components / Block Meter — concept only.
import L27BlockMeter from '../../components/landing27/L27BlockMeter.vue'
import { frame } from './_helpers.js'

export default {
  title: "Other Requests/Landing Concepts '27/Components/Block Meter",
  id: 'landing-page-concepts-27-components-block-meter',
  component: L27BlockMeter,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `## Block Meter
Honest urgency — how much of the official room block is booked and when block rates end. Nudges guests to book inside the block (protects the organizer's hotel contract).` } } },
}
export const Light = { name: 'Light', render: () => ({ components: { L27BlockMeter }, template: frame('<div style="max-width:520px"><l27-block-meter /></div>') }) }
export const Dark = { name: 'Dark', render: () => ({ components: { L27BlockMeter }, template: frame('<div style="max-width:520px"><l27-block-meter tone="dark" /></div>', { dark: true }) }) }
