// LINEAR TICKETS / DES-478 / XNow Youth Sports Families — alts after
// Christine's 2026-11-09 feedback: the offer is given because the guest is
// "verified" as a youth sports family. Their tournament booking is the proof,
// so there's no verify step, no student/military lists, and the button is
// "See my offers". Uses her two copy options (benefit first + friendly).
// Replaces the "XNow Verified Groups" round; earlier pages are kept for history.
import PageFrame from '../../../components/PageFrame.vue'
import ConfirmationPage from '../../../components/confirmation/ConfirmationPage.vue'
import ExperienceNowOffer from '../../../components/des478/ExperienceNowOffer.vue'
import ConfirmationEmail from '../../../components/des478/ConfirmationEmail.vue'
import { COPY, FAMILY_LOOKS, LOOKS, sampleConfirmation } from '../../../components/des478/des478.js'

const gallery = (width) => () => ({
  components: { ExperienceNowOffer },
  setup: () => ({ alts: Object.entries(FAMILY_LOOKS), width }),
  template: `
    <div :style="{ maxWidth: width + 'px', margin: '0 auto', padding: '24px 16px' }">
      <section v-for="[key, l] in alts" :key="key" style="margin-bottom:28px">
        <p style="margin:0 0 2px;font-weight:800;font-size:1rem;color:var(--ds-color-text)">{{ l.label }}</p>
        <p style="margin:0 0 10px;font-size:0.875rem;color:var(--ds-color-text-subtle)">{{ l.note }}</p>
        <experience-now-offer :look="key" :label="'Partner offer, ' + l.label" />
      </section>
    </div>`,
})

const FAMILY_COPY = ['family', 'familyFriendly', 'familyShort']

export default {
  title: 'Linear Tickets/DES-478/XNow Youth Sports Families',
  component: ExperienceNowOffer,
  argTypes: {
    look: { control: 'inline-radio', options: Object.keys(FAMILY_LOOKS) },
    copy: { control: 'inline-radio', options: ['', ...FAMILY_COPY] },
  },
  args: { look: 'f-card', copy: '' },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: "DES-478 · Alts after Christine's feedback (2026-11-09): the offer is given because the guest is **verified as a youth sports family**. Their tournament booking is the proof, so there's **no verify step** and the button is **See my offers**. Uses her two copy options. Replaces **XNow Verified Groups**.",
      },
    },
  },
}

/** The four family alts at confirmation-page width. */
export const AllFamilyAlts = { name: 'All Family Alts', render: gallery(820) }

/** The four family alts at phone width (390). */
export const AllFamilyAltsMobile = {
  name: 'All Family Alts · Mobile (390)',
  tags: ['mobile'],
  globals: { viewport: { value: 'mobile', isRotated: false } },
  render: gallery(390),
}

/** Christine's two options (plus a short banner version) side by side, in the quiet look. */
export const CopyOptions = {
  name: "Christine's Copy Options",
  render: () => ({
    components: { ExperienceNowOffer },
    setup: () => ({ copies: FAMILY_COPY.map((k) => [k, COPY[k]]) }),
    template: `
      <div style="max-width:820px;margin:0 auto;padding:24px 16px">
        <section v-for="[key, c] in copies" :key="key" style="margin-bottom:24px">
          <p style="margin:0 0 10px;font-weight:800;font-size:1rem;color:var(--ds-color-text)">{{ c.label }}</p>
          <experience-now-offer look="presto" :copy="key" :label="'Partner offer, ' + c.label" />
        </section>
      </div>`,
  }),
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

/** The four family alts inside the 600px email body (Fam A switches to her friendlier #2 copy here). */
export const AllFamilyAltsInEmail = {
  name: 'All Family Alts · Email',
  render: () => ({
    components: { ExperienceNowOffer },
    setup: () => ({ alts: Object.entries(FAMILY_LOOKS) }),
    template: `
      <div style="background:var(--ds-color-surface-sunken);padding:28px 16px">
        <div v-for="[key, l] in alts" :key="key" style="max-width:600px;margin:0 auto 20px;background:var(--ds-color-surface);border:1px solid var(--ds-color-border);border-radius:6px;padding:20px 28px">
          <p style="margin:0 0 10px;font-weight:800;font-size:0.875rem;color:var(--ds-color-text-subtle)">{{ l.label }}</p>
          <experience-now-offer :look="key" variant="email" :label="'Partner offer in email, ' + l.label" />
        </div>
      </div>`,
  }),
}

/** Christine's copy dropped into the original six looks. */
export const FamilyCopyOnAllSixLooks = {
  name: 'Family Copy on All 6 Looks',
  render: () => ({
    components: { ExperienceNowOffer },
    setup: () => ({ looks: Object.entries(LOOKS) }),
    template: `
      <div style="max-width:820px;margin:0 auto;padding:24px 16px">
        <p style="margin:0 0 18px;font-size:0.875rem;color:var(--ds-color-text-subtle)">Same six looks with Christine's copy (#1). Look 2 uses the short version. No verify step, no group lists.</p>
        <section v-for="([key, l], i) in looks" :key="key" style="margin-bottom:28px">
          <p style="margin:0 0 10px;font-weight:800;font-size:1rem;color:var(--ds-color-text)">{{ i + 1 }} · {{ l.label }}</p>
          <experience-now-offer :look="key" :copy="key === 'banner' ? 'familyShort' : 'family'" :label="'Partner offer with family copy, look ' + (i + 1) + ': ' + l.label" />
        </section>
      </div>`,
  }),
}
