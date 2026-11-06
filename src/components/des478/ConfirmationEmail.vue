<script setup>
// ConfirmationEmail (DES-478) — mockup of the booking confirmation email with
// the Experience Now partner offer in the body. Shown inside a simple mail
// "window" (subject / from / to) so it reads as an email, not a web page.
//
// Same `mode` + `data` shape as ConfirmationPage:
//   reserve      → single reservation
//   reservations → multiple reservations (one block per hotel)
//   hold         → group block hold
// Order in the body: what you booked → manage button → partner offer → help.
// The offer comes after the booking details and the main button, so it never
// pushes the reservation info down.
import { computed } from 'vue'
import epLogo from '../../assets/eventpipe logos/eventpipe-logo.svg'
import ExperienceNowOffer from './ExperienceNowOffer.vue'
import { EVENT } from './des478.js'

const props = defineProps({
  mode: { type: String, default: 'reserve' }, // reserve | reservations | hold
  data: { type: Object, default: () => ({}) },
  event: { type: Object, default: () => EVENT },
  copy: { type: String, default: 'ticket' }, // offer copy key (see des478.js)
  device: { type: String, default: 'desktop' }, // desktop | mobile
  showOffer: { type: Boolean, default: true },
})
const emit = defineEmits(['offer'])

const isHold = computed(() => props.mode === 'hold')
const d = computed(() => props.data || {})
const firstName = computed(() => (d.value.contactName || 'there').split(' ')[0])

const subject = computed(() =>
  isHold.value
    ? `Your group block is being held · ${props.event.name}`
    : props.mode === 'reservations'
      ? `Your reservations are confirmed · ${props.event.name}`
      : `Your reservation is confirmed · ${props.event.name}`
)
const title = computed(() =>
  isHold.value ? 'Your group block is being held.' : props.mode === 'reservations' ? 'Your reservations are confirmed.' : 'Your reservation is confirmed.'
)
const intro = computed(() =>
  isHold.value
    ? `Thanks for holding rooms for ${props.event.name}. Share the booking link with your group so they can book inside the block.`
    : `Thanks for booking your stay for ${props.event.name}. Here are your details.`
)
const idLabel = computed(() => (isHold.value ? 'Group ID' : 'Confirmation #'))
const bookingId = computed(() => d.value.groupId || d.value.confirmationId || '')
const cta = computed(() => (isHold.value ? 'Manage your group block' : props.mode === 'reservations' ? 'View your reservations' : 'View your reservation'))

const hotels = computed(() => d.value.hotels || [])
const roomLine = (h) => {
  const r = (h.rooms || [])[0]
  if (!r) return ''
  const nights = (r.nights || []).length
  const qty = r.nights?.[0]?.qty || 1
  return `${r.type} · ${qty} ${qty === 1 ? 'room' : 'rooms'}${isHold.value ? ' held' : ''} · ${nights} ${nights === 1 ? 'night' : 'nights'}`
}
const money = (n) => '$' + Number(n ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const cancelNote = (i) => d.value.policies?.[i]?.items?.[0]?.body || ''
</script>

<template>
  <div class="xe" :class="`xe--${device}`">
    <!-- Mail window chrome -->
    <div class="xe__chrome">
      <div class="xe__subject">{{ subject }}</div>
      <div class="xe__meta">
        <span class="xe__avatar" aria-hidden="true">EP</span>
        <div class="xe__from">
          <div><strong>EventPipe Housing</strong> <span class="xe__addr">&lt;bookings@eventpipe.com&gt;</span></div>
          <div class="xe__to">to {{ d.email || 'you' }}</div>
        </div>
      </div>
    </div>

    <!-- Email body (600px max, like a real HTML email) -->
    <div class="xe__canvas">
      <div class="xe__body">
        <header class="xe__brand">
          <img :src="epLogo" alt="EventPipe" class="xe__logo" />
          <span class="xe__event">{{ event.name }}</span>
        </header>

        <section class="xe__section">
          <p class="xe__check"><span aria-hidden="true">✓</span> {{ isHold ? 'Held' : 'Confirmed' }}</p>
          <h1 class="xe__title">{{ title }}</h1>
          <p class="xe__p">Hi {{ firstName }},</p>
          <p class="xe__p">{{ intro }}</p>

          <table class="xe__ids" role="presentation">
            <tr><td>{{ idLabel }}</td><td><strong>{{ bookingId }}</strong></td></tr>
            <tr v-if="d.reservedOn"><td>Reserved on</td><td>{{ d.reservedOn }}</td></tr>
            <tr v-if="isHold && d.releaseDate"><td>Block release date</td><td>{{ d.releaseDate }}</td></tr>
            <tr><td>Event</td><td>{{ event.dates }} · {{ event.venue }}</td></tr>
          </table>
        </section>

        <section v-for="(h, i) in hotels" :key="i" class="xe__section xe__hotel">
          <h2 class="xe__hotelname">{{ h.name }}</h2>
          <p class="xe__muted">{{ h.address }}</p>
          <table class="xe__rows" role="presentation">
            <tr><td>Check in</td><td>{{ h.checkIn }}</td></tr>
            <tr><td>Check out</td><td>{{ h.checkOut }}</td></tr>
            <tr><td>Room</td><td>{{ roomLine(h) }}</td></tr>
            <template v-if="!isHold && h.totals">
              <tr class="xe__rule"><td>Paid today</td><td><strong>{{ money(h.totals.amountPaid) }}</strong></td></tr>
              <tr><td>Due at hotel</td><td><strong>{{ money(h.totals.balanceDue) }}</strong></td></tr>
            </template>
          </table>
          <p v-if="cancelNote(i)" class="xe__fine">{{ cancelNote(i) }}</p>
        </section>

        <section class="xe__section xe__ctawrap">
          <a href="#" class="xe__cta" @click.prevent>{{ cta }}</a>
        </section>

        <!-- DES-478: partner offer — after the booking details + main button. -->
        <section v-if="showOffer" class="xe__section xe__offer">
          <experience-now-offer variant="email" :city="event.city" :copy="copy" @open="emit('offer', $event)" />
        </section>

        <footer class="xe__footer">
          <p>Questions about your stay? Reply to this email or call (800) 555-0142.</p>
          <p>EventPipe · Sent to {{ d.email || 'you' }} because you booked through the official event hotel site.</p>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped>
.xe { background: var(--ds-color-surface); border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-lg); overflow: hidden; color: var(--ds-color-text); font-family: inherit; }
.xe--mobile { max-width: 390px; }

/* mail chrome */
.xe__chrome { padding: 18px 24px 14px; border-bottom: 1px solid var(--ds-color-border); background: var(--ds-color-surface); }
.xe__subject { font-size: 1.125rem; font-weight: 700; line-height: 1.35; }
.xe__meta { display: flex; align-items: center; gap: 12px; margin-top: 12px; }
.xe__avatar { width: 36px; height: 36px; border-radius: 50%; flex: none; display: flex; align-items: center; justify-content: center; background: var(--ds-color-background-brand-bold); color: #fff; font-size: 0.75rem; font-weight: 800; }
.xe__from { font-size: 0.875rem; line-height: 1.35; min-width: 0; }
.xe__addr, .xe__to { color: var(--ds-color-text-subtle); }

/* canvas + 600px body */
.xe__canvas { background: var(--ds-color-surface-sunken); padding: 28px 16px 36px; }
.xe__body { max-width: 600px; margin: 0 auto; background: var(--ds-color-surface); border: 1px solid var(--ds-color-border); border-radius: 6px; overflow: hidden; }
.xe__brand { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 18px 28px; border-bottom: 1px solid var(--ds-color-border); }
.xe__logo { height: 22px; width: auto; display: block; }
.xe__event { font-size: 0.8125rem; color: var(--ds-color-text-subtle); text-align: right; }
.xe__section { padding: 22px 28px 0; }
.xe__check { margin: 0 0 6px; font-size: 0.8125rem; font-weight: 700; color: var(--ds-color-text-success); }
.xe__title { margin: 0 0 14px; font-size: 1.5rem; line-height: 1.25; font-weight: 800; color: var(--ds-color-text); }
.xe__p { margin: 0 0 10px; font-size: 0.9375rem; line-height: 1.55; }
.xe__ids, .xe__rows { width: 100%; border-collapse: collapse; font-size: 0.875rem; margin-top: 6px; }
.xe__ids { background: var(--ds-color-surface-sunken); border-radius: 6px; }
.xe__ids td, .xe__rows td { padding: 7px 12px; vertical-align: top; }
.xe__rows td { padding-left: 0; }
.xe__ids td:first-child, .xe__rows td:first-child { color: var(--ds-color-text-subtle); width: 38%; }
.xe__rule td { border-top: 1px solid var(--ds-color-border); padding-top: 10px; }
.xe__hotel { border-top: 1px solid var(--ds-color-border); margin-top: 22px; }
.xe__hotelname { margin: 0; font-size: 1.0625rem; line-height: 1.35; font-weight: 800; color: var(--ds-color-link); }
.xe__muted { margin: 2px 0 6px; font-size: 0.8125rem; color: var(--ds-color-text-subtle); }
.xe__fine { margin: 8px 0 0; font-size: 0.75rem; line-height: 1.5; color: var(--ds-color-text-subtle); }
.xe__ctawrap { padding-top: 24px; }
.xe__cta { display: inline-block; padding: 12px 22px; border-radius: var(--ds-radius-button); background: var(--ds-color-background-brand-bold); color: #fff; font-weight: 700; font-size: 0.9375rem; text-decoration: none; }
.xe__offer { padding-top: 24px; }
.xe__footer { margin-top: 28px; padding: 18px 28px 22px; border-top: 1px solid var(--ds-color-border); background: var(--ds-color-surface-sunken); }
.xe__footer p { margin: 0 0 6px; font-size: 0.75rem; line-height: 1.5; color: var(--ds-color-text-subtle); }

/* phone mail app */
.xe--mobile .xe__chrome { padding: 14px 16px 12px; }
.xe--mobile .xe__subject { font-size: 1rem; }
.xe--mobile .xe__canvas { padding: 0; }
.xe--mobile .xe__body { border: 0; border-radius: 0; }
.xe--mobile .xe__brand { padding: 14px 18px; flex-direction: column; align-items: flex-start; gap: 6px; }
.xe--mobile .xe__event { text-align: left; }
.xe--mobile .xe__section { padding: 18px 18px 0; }
.xe--mobile .xe__title { font-size: 1.3125rem; }
.xe--mobile .xe__ids td:first-child, .xe--mobile .xe__rows td:first-child { width: 42%; }
.xe--mobile .xe__cta { display: block; text-align: center; }
.xe--mobile .xe__footer { padding: 16px 18px 20px; }
</style>
