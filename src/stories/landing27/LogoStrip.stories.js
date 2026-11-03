// LANDING PAGE CONCEPTS '27 / Components / Logo Strip — concept only.
import L27LogoStrip from '../../components/landing27/L27LogoStrip.vue'
import { frame } from './_helpers.js'

export default {
  title: "Landing Page Concepts '27/Components/Logo Strip",
  component: L27LogoStrip,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `## Logo Strip
Partner associations as a gentle marquee (pauses on hover).` } } },
}
export const Light = { name: 'Light', render: () => ({ components: { L27LogoStrip }, template: frame('<l27-logo-strip />') }) }
export const Dark = { name: 'Dark', render: () => ({ components: { L27LogoStrip }, template: frame('<l27-logo-strip tone="dark" />', { dark: true }) }) }
