// LINEAR TICKETS / DES-478 / Experience Now Offer — the XNow partner
// offer on its own, plus the copy options for Christine to choose from.
import ExperienceNowOffer from '../../../components/des478/ExperienceNowOffer.vue'
import { COPY } from '../../../components/des478/des478.js'

export default {
  title: 'Linear Tickets/DES-478/Experience Now Offer',
  component: ExperienceNowOffer,
  tags: ['autodocs'],
  argTypes: {
    copy: { control: 'inline-radio', options: Object.keys(COPY) },
    variant: { control: 'inline-radio', options: ['page', 'email'] },
  },
  args: { city: 'Baltimore', copy: 'ticket', variant: 'page' },
  parameters: {
    docs: {
      description: {
        component: 'DES-478 · Partner offer: the XNow logo, a small label, the message and a link. Logo only: the card keeps Presto colors. The city comes from the event, so it changes per event.',
      },
    },
  },
  decorators: [() => ({ template: '<div style="max-width:800px;padding:24px"><story /></div>' })],
}

/** Christine's copy, with XNow as the partner name. */
export const TicketCopy = { name: 'Ticket Copy' }

/** Same message, a different event city. */
export const AnotherCity = { name: 'Another City', args: { city: 'Orlando' } }

/** The ticket copy next to two shorter options. */
export const CopyOptions = {
  name: 'Copy Options',
  render: () => ({
    components: { ExperienceNowOffer },
    setup: () => ({ options: Object.entries(COPY) }),
    template: `
      <div style="display:flex;flex-direction:column;gap:8px">
        <div v-for="[key, c] in options" :key="key">
          <p style="margin:12px 0 6px;font-weight:700;color:var(--ds-color-text-subtle)">{{ c.label }}</p>
          <experience-now-offer :copy="key" :label="'Partner offer, ' + c.label" />
        </div>
      </div>`,
  }),
}
