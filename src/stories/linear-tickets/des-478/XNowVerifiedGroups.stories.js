// LINEAR TICKETS / DES-478 / XNow Verified Groups — alt versions after the
// 2026-11-07 feedback: XNow verifies you belong to a group (military, student,
// etc.) and gives discounts on experiences like sports events and museums.
// Each alt says WHO qualifies and WHAT they get. The six looks in
// "XNow Explorations" are unchanged; these sit beside them for comparison.
import PageFrame from '../../../components/PageFrame.vue'
import ConfirmationPage from '../../../components/confirmation/ConfirmationPage.vue'
import ExperienceNowOffer from '../../../components/des478/ExperienceNowOffer.vue'
import ConfirmationEmail from '../../../components/des478/ConfirmationEmail.vue'
import { ALT_LOOKS, LOOKS, sampleConfirmation } from '../../../components/des478/des478.js'

const gallery = (width) => () => ({
  components: { ExperienceNowOffer },
  setup: () => ({ alts: Object.entries(ALT_LOOKS), width }),
  template: `
    <div :style="{ maxWidth: width + 'px', margin: '0 auto', padding: '24px 16px' }">
      <section v-for="[key, l] in alts" :key="key" style="margin-bottom:28px">
        <p style="margin:0 0 2px;font-weight:800;font-size:1rem;color:var(--ds-color-text)">{{ l.label }}</p>
        <p style="margin:0 0 10px;font-size:0.875rem;color:var(--ds-color-text-subtle)">{{ l.note }}</p>
        <experience-now-offer :look="key" :label="'Partner offer, ' + l.label" />
      </section>
    </div>`,
})

export default {
  title: 'Linear Tickets/DES-478/XNow Verified Groups',
  component: ExperienceNowOffer,
  argTypes: {
    look: { control: 'inline-radio', options: Object.keys(ALT_LOOKS) },
    copy: { control: 'inline-radio', options: ['', 'verified', 'verifiedShort'] },
  },
  args: { look: 'v-card', copy: '' },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '**Replaced by XNow Youth Sports Families (2026-11-09).** DES-478 · Alt versions after the feedback that XNow **verifies you belong to a group** (military, student, teacher, healthcare, first responder) and gives **discounts on experiences** like sports games and museums. Each alt says who qualifies and what they get. The six looks in **XNow Explorations** are unchanged.',
      },
    },
  },
}

/** The three alts at confirmation-page width. */
export const AllAlts = { name: 'All Alts', render: gallery(820) }

/** The three alts at phone width (390). */
export const AllAltsMobile = {
  name: 'All Alts · Mobile (390)',
  tags: ['mobile'],
  globals: { viewport: { value: 'mobile', isRotated: false } },
  render: gallery(390),
}

/** The chosen alt on the real confirmation page (use the look control). */
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

/** The chosen alt in the confirmation email (use the look control). */
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

/** The three alts inside the 600px email body. */
export const AllAltsInEmail = {
  name: 'All Alts · Email',
  render: () => ({
    components: { ExperienceNowOffer },
    setup: () => ({ alts: Object.entries(ALT_LOOKS) }),
    template: `
      <div style="background:var(--ds-color-surface-sunken);padding:28px 16px">
        <div v-for="[key, l] in alts" :key="key" style="max-width:600px;margin:0 auto 20px;background:var(--ds-color-surface);border:1px solid var(--ds-color-border);border-radius:6px;padding:20px 28px">
          <p style="margin:0 0 10px;font-weight:800;font-size:0.875rem;color:var(--ds-color-text-subtle)">{{ l.label }}</p>
          <experience-now-offer :look="key" variant="email" :label="'Partner offer in email, ' + l.label" />
        </div>
      </div>`,
  }),
}

/** The new verified-groups copy dropped into the original six looks. */
export const NewCopyOnAllSixLooks = {
  name: 'New Copy on All 6 Looks',
  render: () => ({
    components: { ExperienceNowOffer },
    setup: () => ({ looks: Object.entries(LOOKS) }),
    template: `
      <div style="max-width:820px;margin:0 auto;padding:24px 16px">
        <p style="margin:0 0 18px;font-size:0.875rem;color:var(--ds-color-text-subtle)">Same six looks, with the verified-groups copy. Look 2 uses the short version.</p>
        <section v-for="([key, l], i) in looks" :key="key" style="margin-bottom:28px">
          <p style="margin:0 0 10px;font-weight:800;font-size:1rem;color:var(--ds-color-text)">{{ i + 1 }} · {{ l.label }}</p>
          <experience-now-offer :look="key" :copy="key === 'banner' ? 'verifiedShort' : 'verified'" :label="'Partner offer with new copy, look ' + (i + 1) + ': ' + l.label" />
        </section>
      </div>`,
  }),
}
