// LINEAR TICKETS / DES-478 / XNow Explorations — six takes on the partner
// callout, from "Logo only" (quiet, Presto colors) to fully XNow-branded.
// Brand elements come from xnow.com: orange gradient logo, Poppins, pill
// buttons, #141414 surfaces, the "sunset" sign-up gradient and the red→orange
// "Verify now" banner. Gradients are darkened slightly under text for AA.
import PageFrame from '../../../components/PageFrame.vue'
import ConfirmationPage from '../../../components/confirmation/ConfirmationPage.vue'
import ExperienceNowOffer from '../../../components/des478/ExperienceNowOffer.vue'
import ConfirmationEmail from '../../../components/des478/ConfirmationEmail.vue'
import { LOOKS, sampleConfirmation } from '../../../components/des478/des478.js'


const gallery = (width) => () => ({
  components: { ExperienceNowOffer },
  setup: () => ({ looks: Object.entries(LOOKS), width }),
  template: `
    <div :style="{ maxWidth: width + 'px', margin: '0 auto', padding: '24px 16px' }">
      <section v-for="([key, l], i) in looks" :key="key" style="margin-bottom:28px">
        <p style="margin:0 0 2px;font-weight:800;font-size:1rem;color:var(--ds-color-text)">{{ i + 1 }} · {{ l.label }}</p>
        <p style="margin:0 0 10px;font-size:0.875rem;color:var(--ds-color-text-subtle)">{{ l.note }}</p>
        <experience-now-offer :look="key" :label="'Partner offer, look ' + (i + 1) + ': ' + l.label" />
      </section>
    </div>`,
})

export default {
  title: 'Linear Tickets/DES-478/XNow Explorations',
  component: ExperienceNowOffer,
  argTypes: {
    look: { control: 'inline-radio', options: ['presto', 'banner', 'ribbon', 'dark', 'sunset', 'split'] },
    copy: { control: 'inline-radio', options: ['', 'ticket', 'short', 'shortest'] },
  },
  args: { look: 'banner', copy: '' },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'DES-478 · Six ways the XNow partner callout could look, from quiet ("Logo only", Presto colors) to fully XNow-branded. Pick a look with the **look** control on the page and email stories.',
      },
    },
  },
}

/** All six looks at confirmation-page width. */
export const AllLooks = { name: 'All Looks', render: gallery(820) }

/** All six looks at phone width (390). */
export const AllLooksMobile = {
  name: 'All Looks · Mobile (390)',
  tags: ['mobile'],
  globals: { viewport: { value: 'mobile', isRotated: false } },
  render: gallery(390),
}

/** The chosen look on the real confirmation page (use the look control). */
export const OnConfirmationPage = {
  name: 'On Confirmation Page',
  render: (args) => ({
    components: { PageFrame, ConfirmationPage, ExperienceNowOffer },
    setup: () => ({ args, data: sampleConfirmation('reserve') }),
    template: `
      <page-frame cart-mode="reserve" :show-cart="false">
        <confirmation-page mode="reserve" :data="data">
          <template #after-summary><experience-now-offer v-bind="args" /></template>
        </confirmation-page>
      </page-frame>`,
  }),
}

/** The chosen look in the confirmation email (use the look control). */
export const InEmail = {
  name: 'In Email',
  render: (args) => ({
    components: { ConfirmationEmail },
    setup: () => ({ args, data: sampleConfirmation('reserve') }),
    template: `
      <div style="max-width:900px;margin:0 auto;padding:24px 16px">
        <confirmation-email mode="reserve" :data="data" :look="args.look" :copy="args.copy" />
      </div>`,
  }),
}

/** Every look inside the 600px email body, side by side for comparison. */
export const AllLooksInEmail = {
  name: 'All Looks · Email',
  render: () => ({
    components: { ExperienceNowOffer },
    setup: () => ({ looks: Object.entries(LOOKS) }),
    template: `
      <div style="background:var(--ds-color-surface-sunken);padding:28px 16px">
        <div v-for="([key, l], i) in looks" :key="key" style="max-width:600px;margin:0 auto 20px;background:var(--ds-color-surface);border:1px solid var(--ds-color-border);border-radius:6px;padding:20px 28px">
          <p style="margin:0 0 10px;font-weight:800;font-size:0.875rem;color:var(--ds-color-text-subtle)">{{ i + 1 }} · {{ l.label }}</p>
          <experience-now-offer :look="key" variant="email" :label="'Partner offer in email, look ' + (i + 1) + ': ' + l.label" />
        </div>
      </div>`,
  }),
}
