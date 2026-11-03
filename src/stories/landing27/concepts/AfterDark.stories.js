// LANDING PAGE CONCEPTS '27 / Concepts / After Dark — immersive, cinematic
// IMEX America 2027 hotel-booking page. Concept only; not affiliated with IMEX.
import L27AfterDark from '../../../components/landing27/concepts/L27AfterDark.vue'

export default {
  title: "Landing Page Concepts '27/Concepts/After Dark",
  component: L27AfterDark,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Concept 2 — After Dark
An immersive, after-hours take on the IMEX America 2027 housing page, inspired by cinematic event templates (Confarex, Conflux): near-black and navy canvas, huge type, red and yellow gradient glows, real IMEX show photography.

**How booking is reached:** there is no inline widget. The **booking modal is the booking surface**, opened from:
- the yellow **Book your hotel** pill in the transparent nav and the hero CTA
- every hotel card **Book** button and map pin (opens with that hotel first)
- the **Rooms are going fast** block-meter panel and its "lowest availability" rows
- the giant closing CTA
- a fixed, rotating round **Book your hotel** badge (yellow) that follows the reader down the page

**Engaging elements:** live dark countdown in the hero, "6,292 buyers already planning" avatar chip, a tilted yellow stats ticker (pauses under reduced motion), split typography with inline photo pills ("Three days. One block. Zero hassle."), a dark hotels + Strip map, block meter in a red→navy panel, a photo mosaic, and a dark FAQ.

Sections: nav · hero · ticker · why the block · hotels & map · block meter · gallery · FAQ · closing CTA · footer.
`,
      },
    },
  },
}

export const Desktop = {
  render: (args) => ({ components: { L27AfterDark }, setup: () => ({ args }), template: '<l27-after-dark v-bind="args" />' }),
}

export const BookingModalOpen = {
  name: 'Booking Modal Open',
  args: { initialModal: true, initialModalState: 'results' },
  render: (args) => ({ components: { L27AfterDark }, setup: () => ({ args }), template: '<l27-after-dark v-bind="args" />' }),
}
