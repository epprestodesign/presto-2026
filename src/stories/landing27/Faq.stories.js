// LANDING PAGE CONCEPTS '27 / Components / FAQ — concept only.
import L27Faq from '../../components/landing27/L27Faq.vue'
import { frame } from './_helpers.js'

export default {
  title: "Landing Page Concepts '27/Components/FAQ",
  component: L27Faq,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `## FAQ
Housing questions — including the anti-scam note planners care about.` } } },
}
export const Light = { name: 'Light', render: () => ({ components: { L27Faq }, template: frame('<div style="max-width:760px"><l27-faq /></div>') }) }
export const Dark = { name: 'Dark', render: () => ({ components: { L27Faq }, template: frame('<div style="max-width:760px"><l27-faq tone="dark" /></div>', { dark: true }) }) }
