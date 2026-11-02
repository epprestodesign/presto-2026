// LANDING PAGE CONCEPTS '27 / Components / Sticky Bar & Floating Button —
// two always-available "Book your hotel" entry points. Concept only.
import L27StickyBar from '../../components/landing27/L27StickyBar.vue'
import L27FloatingBook from '../../components/landing27/L27FloatingBook.vue'
import { frame } from './_helpers.js'

export default {
  title: "Landing Page Concepts '27/Components/Sticky Bar & Floating Button",
  component: L27StickyBar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `
## Sticky Bar & Floating Button
Two ways to keep booking one click away on a long event page:
- **Sticky bar** — slides in once the hero scrolls away: logo, dates, block meter, **Book your hotel**.
- **Floating button** — a round badge with rotating "Book your hotel" text (Conflux-style).
Both emit \`book\`, which the concepts wire to the booking modal.
` } } },
}
export const StickyLight = { name: 'Sticky Bar — Light', render: () => ({ components: { L27StickyBar }, template: frame('<l27-sticky-bar force-visible /><p style="margin-top:120px">The bar is pinned on for this story.</p>') }) }
export const StickyDark = { name: 'Sticky Bar — Dark', render: () => ({ components: { L27StickyBar }, template: frame('<l27-sticky-bar force-visible tone="dark" />', { dark: true }) }) }
export const Floating = {
  name: 'Floating Button',
  render: () => ({ components: { L27FloatingBook }, template: frame('<div style="display:flex;gap:32px;align-items:center"><l27-floating-book position="inline" /><l27-floating-book position="inline" tone="yellow" /><l27-floating-book position="inline" tone="dark" /></div>') }),
}
