// LANDING PAGE CONCEPTS '27 / Concepts / Design Matters — concept 4 of the
// corporate events brand templates (IMEX America 2027 as the starting brand).
// Concept only; not affiliated with IMEX.
import L27DesignMatters from '../../../components/landing27/concepts/L27DesignMatters.vue'

export default {
  title: "Landing Page Concepts '27/Concepts/Design Matters",
  component: L27DesignMatters,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Design Matters — the geometric brand play
A bold Bauhaus-style take on IMEX's 2026–27 talking point *"Design Matters"*. Every pattern tile — circles,
half-circles, plus signs, stripes, quarter-arcs, rings, checkers — is drawn in CSS in the IMEX colors on ink
and cream, so the art scales, recolors and costs nothing to load. Headline: *"Design your stay like you
design your events."*

**How booking is reached — "Schedule → your stay", in a side panel**
- **Stay planner (the hero interaction)** — tick the days you'll be at IMEX; it works out check-in and
  check-out. **Book N nights** opens booking in a **right side panel** (\`DsSidePanel\`) holding the stacked
  corporate widget pre-filled with that stay. This concept demonstrates the side-panel booking variant.
- **Three ways in** cards (Smart Monday / Trade show / Evenings) open the same panel with a preset stay.
- **Plan your stay** buttons (nav, hero, Design Matters band, closing CTA) open the panel with the current stay.
- Searching in the panel closes it and opens the page-owned **booking modal** on *searching → results*.
- **Book** on a hotel card opens the booking modal on the form with that hotel pre-selected.

**Engaging components**: animated CSS pattern-tile band (tiles rotate on hover), dark stats band (count-up),
stay planner, pattern-capped hotel cards with walk time + rooms left, Design Matters talking-point band,
partner logo strip.
`,
      },
    },
  },
}

export const Desktop = { render: () => ({ components: { L27DesignMatters }, template: '<l27-design-matters />' }) }

export const BookingModalOpen = {
  name: 'Booking Modal Open',
  args: { initialModal: true, initialModalState: 'results' },
  render: (args) => ({ components: { L27DesignMatters }, setup: () => ({ args }), template: '<l27-design-matters v-bind="args" />' }),
}

export const SidePanelOpen = {
  name: 'Side Panel Open',
  args: { initialPanel: true },
  render: (args) => ({ components: { L27DesignMatters }, setup: () => ({ args }), template: '<l27-design-matters v-bind="args" />' }),
}
