<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { state, pricing, money, PROMO_CODES, go, cartLines, ticketById, partySize } from '../store.js'
import { asset } from '../data.js'

const props = defineProps({
  step: { type: String, required: true }, // details | addons | extras | payment
  title: { type: Array, required: true }, // wide-display title lines
  cta: { type: String, required: true },
  busy: { type: Boolean, default: false },
})
const emit = defineEmits(['submit'])

const ALL_STEPS = [
  ['details', 'Details'],
  ['addons', 'Add-ons'],
  ['extras', 'Extras'],
  ['guest', 'Your Details'],
  ['payment', 'Payment'],
]
// E/F book the hotel on its own page after checkout, so no Your Details step
const STEPS = computed(() => (state.variant === 'separate' ? ALL_STEPS.filter(([k]) => k !== 'guest') : ALL_STEPS))
const order = { details: 0, addons: 1, extras: 2, guest: 3, payment: 4 }
const canJump = (s) => order[s] < order[props.step]

// ── Itemized order summary (reads top-down like Spartan's receipt) ──
const qtyNote = (price, qty) => `(${money(price)}${qty > 1 ? ` x ${qty}` : ''})`
const ticketItems = computed(() =>
  cartLines.value
    .filter((l) => l.kind === 'ticket')
    .map((l) => {
      const t = ticketById(l.id)
      return {
        id: l.id,
        label: `${t.race.eventName} - ${t.day.dayName} - ${t.name.toUpperCase()} (${t.day.dayName} ${t.window}) ${qtyNote(t.price, l.qty)}`,
        amount: t.price * l.qty,
      }
    }),
)
const spartanAddons = computed(() =>
  pricing.value.addons.map((a) => ({ id: a.id, label: `${a.name} ${qtyNote(a.price, a.qty)}`, amount: a.price * a.qty })),
)
const hotel = computed(() => state.hotel)
const hasEventpipe = computed(() => !!(state.hotel || state.parking || state.photo))
const subtotal = computed(() => {
  const p = pricing.value
  return p.registration + p.addons.reduce((s, a) => s + a.price * a.qty, 0) + p.parking + p.photo + p.hotelToday
})
const preDiscount = computed(() => pricing.value.total + pricing.value.discount)
const stars = (n) => '★'.repeat(n || 0)

// Sticky that never hides the bottom: short summaries pin under the header;
// taller ones pin by their bottom edge so Total + CTA stay reachable.
const sumEl = ref(null)
const stickTop = ref(68)
const fit = () => {
  const h = sumEl.value?.offsetHeight || 0
  stickTop.value = Math.min(68, window.innerHeight - h - 16)
}
let ro
onMounted(() => {
  ro = new ResizeObserver(fit)
  if (sumEl.value) ro.observe(sumEl.value)
  window.addEventListener('resize', fit)
  fit()
})
onBeforeUnmount(() => { ro?.disconnect(); window.removeEventListener('resize', fit) })
const code = ref(state.promo?.code || '')
const promoMsg = ref(state.promo ? `${state.promo.code} applied` : '')
const promoErr = ref(false)
function applyPromo() {
  const c = code.value.trim().toUpperCase()
  if (!c) return
  if (PROMO_CODES[c]) {
    state.promo = { code: c, pct: PROMO_CODES[c] }
    promoMsg.value = `${c} applied — ${Math.round(PROMO_CODES[c] * 100)}% off registration`
    promoErr.value = false
  } else {
    promoMsg.value = 'This promocode is not valid'
    promoErr.value = true
  }
}
function clearPromo() {
  state.promo = null
  code.value = ''
  promoMsg.value = ''
}
</script>

<template>
  <div class="co">
    <header class="co__bar">
      <a href="#/event" class="co__logo" aria-label="Back to the event page">
        <img :src="asset('icons/spartan-logo.svg')" alt="" />
      </a>
      <nav class="crumbs" aria-label="Checkout steps">
        <template v-for="([key, label], i) in STEPS" :key="key">
          <svg v-if="i" class="crumbs__chev" viewBox="0 0 10 18" width="10" height="18" aria-hidden="true">
            <path d="M1.5 1.5 8.5 9l-7 7.5" fill="none" stroke="#808080" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <button
            class="crumbs__item"
            :class="{ 'is-active': key === step }"
            :aria-current="key === step ? 'step' : undefined"
            :disabled="!canJump(key)"
            @click="go(key)"
          >{{ label }}</button>
        </template>
      </nav>
    </header>

    <div class="co__body">
      <main class="co__main">
        <h1 class="t-wide co__title"><span v-for="l in title" :key="l">{{ l }}</span></h1>
        <slot />
      </main>

      <aside class="co__aside">
        <div ref="sumEl" class="sum" :style="{ top: stickTop + 'px' }">
          <h2 class="sum__h">Order summary</h2>

          <!-- Tickets -->
          <section class="sum__sec">
            <h3 class="sum__sech">Tickets</h3>
            <div v-for="t in ticketItems" :key="t.id" class="sum__row">
              <span>{{ t.label }}</span><span>{{ money(t.amount) }}</span>
            </div>
          </section>

          <!-- Spartan add-ons -->
          <section v-if="spartanAddons.length" class="sum__sec">
            <h3 class="sum__sech">Add-ons</h3>
            <div v-for="a in spartanAddons" :key="a.id" class="sum__row">
              <span>{{ a.label }}</span><span>{{ money(a.amount) }}</span>
            </div>
          </section>

          <!-- Eventpipe add-ons: hotel itemized in full -->
          <section v-if="hasEventpipe" class="sum__sec">
            <h3 class="sum__sech">Hotel &amp; weekend add-ons <span class="sum__by">by Eventpipe</span></h3>

            <div v-if="hotel" class="htl">
              <div class="htl__head">
                <svg class="htl__ico" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5M7 11.5a1.5 1.5 0 1 0 0-.01" fill="none" stroke="#000" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <div>
                  <p class="htl__name">{{ hotel.name }}</p>
                  <p class="htl__meta"><span class="htl__stars">{{ stars(hotel.stars) }}</span> {{ hotel.city }}<template v-if="hotel.miles"> · {{ hotel.miles }} mi from Sandy Oaks Ranch</template></p>
                </div>
              </div>
              <dl class="htl__grid">
                <div><dt>Check-in</dt><dd>{{ hotel.checkIn || hotel.stayLabel }}<small>3:00 PM</small></dd></div>
                <div><dt>Check-out</dt><dd>{{ hotel.checkOut || '—' }}<small>11:00 AM</small></dd></div>
                <div><dt>Reservation</dt><dd>{{ hotel.nights }} {{ hotel.nights === 1 ? 'night' : 'nights' }} · {{ hotel.rooms }} {{ hotel.rooms === 1 ? 'room' : 'rooms' }}</dd></div>
                <div><dt>Room</dt><dd>{{ hotel.roomLabel }}</dd></div>
              </dl>
              <div class="sum__row sum__row--sub"><span>Room rate ({{ money(hotel.nightly) }} x {{ hotel.nights }} {{ hotel.nights === 1 ? 'night' : 'nights' }}<template v-if="hotel.rooms > 1"> x {{ hotel.rooms }} rooms</template>)</span><span>{{ money(hotel.subtotal) }}</span></div>
              <div class="sum__row sum__row--sub"><span>Hotel taxes &amp; fees</span><span>{{ money(hotel.taxes) }}</span></div>
              <div class="sum__row sum__row--sub sum__row--strong"><span>Stay total</span><span>{{ money(hotel.total) }}</span></div>
              <div class="htl__split">
                <div class="sum__row"><span><strong>Charged today</strong> · {{ hotel.payOption === 'full' ? 'paid in full' : 'first night' }}</span><span><strong>{{ money(hotel.dueToday) }}</strong></span></div>
                <div class="sum__row sum__row--muted"><span>Due at check-in (not charged now)</span><span>{{ money(hotel.dueAtHotel) }}</span></div>
              </div>
              <p class="htl__note">Free cancellation until Nov 13, 2026<template v-if="hotel.shuttle"> · free race-morning shuttle</template></p>
            </div>

            <div v-if="state.parking" class="sum__row"><span>Parking pass · on-site lot, both days</span><span>{{ money(pricing.parking) }}</span></div>
            <div v-if="state.photo" class="sum__row"><span>Photo package · digital race photos {{ qtyNote(25, partySize) }}</span><span>{{ money(pricing.photo) }}</span></div>
          </section>

          <!-- Subtotal + fees -->
          <section class="sum__sec sum__sec--totals">
            <div class="sum__row sum__row--subtotal"><span>Subtotal</span><span>{{ money(subtotal) }}</span></div>
            <div class="sum__row"><span>Insurance</span><span>{{ money(pricing.insurance) }}</span></div>
            <div class="sum__row"><span>Service fee</span><span>{{ money(pricing.service) }}</span></div>
            <div class="sum__row"><span>Taxes</span><span>{{ money(pricing.tax) }}</span></div>
            <div v-if="pricing.refund" class="sum__row"><span>Refundable booking</span><span>{{ money(pricing.refund) }}</span></div>
            <div v-if="pricing.discount" class="sum__row sum__row--discount"><span>Promocode {{ state.promo.code }}</span><span>−{{ money(pricing.discount) }}</span></div>
          </section>

          <div class="sum__total">
            <span class="sum__label">Total</span>
            <span class="sum__amtwrap">
              <s v-if="pricing.discount" class="sum__was">{{ money(preDiscount) }}</s>
              <span class="sum__amt">{{ money(pricing.total) }}</span>
            </span>
          </div>
          <p v-if="pricing.hotelAtHotel" class="sum__athotel">+ {{ money(pricing.hotelAtHotel) }} due at hotel check-in</p>

          <form class="sum__promo" @submit.prevent="applyPromo">
            <label class="sr-only" for="promo">Promocode</label>
            <input id="promo" v-model="code" placeholder="Promocode" autocomplete="off" />
            <button class="pill pill--checkout sum__add" type="submit">Add</button>
          </form>
          <p v-if="promoMsg" class="sum__msg" :class="{ 'is-err': promoErr }">
            {{ promoMsg }}
            <button v-if="state.promo && !promoErr" type="button" @click="clearPromo">Remove</button>
          </p>

          <slot name="aside" />

          <button class="pill pill--checkout sum__cta" :class="{ 'sum__cta--tight': $slots.aside }" :disabled="busy" @click="emit('submit')">
            <span v-if="busy" class="spinner" aria-hidden="true" />
            {{ busy ? 'Processing' : cta }}
          </button>
          <slot name="after-cta" />
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.co { min-height: 100vh; background: #fff; }

.co__bar {
  position: sticky;
  top: 0;
  z-index: 40;
  height: 67px;
  display: flex;
  align-items: center;
  padding-left: 71px;
  background: #000;
}
.co__logo img { width: 36px; height: 36px; }
.crumbs { display: flex; align-items: center; margin-left: 49px; }
.crumbs__item { font-size: 16px; font-weight: 700; color: var(--grey-600); }
.crumbs__item.is-active { color: #fff; }
.crumbs__item:disabled { cursor: default; }
.crumbs__item:not(:disabled):hover { color: #fff; }
.crumbs__chev { margin: 0 17px 0 23px; }

.co__body { display: flex; padding: 0 0 0 71px; }
.co__main { width: 644px; flex: none; padding: 72px 0 110px; }
.co__title { display: block; font-size: 42.4px; line-height: 39px; color: #000; }
.co__title span { display: block; }
.co__title span + span { margin-top: 13.5px; }

.co__aside { margin-left: 125px; padding-top: 71px; }
.sum {
  position: sticky;
  width: 496px;
  padding: 0 40px 32px;
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 2px 18px rgba(0, 0, 0, 0.1);
}
.sum__h { padding: 30px 0 4px; font-size: 15.9px; font-weight: 700; text-transform: uppercase; color: #000; }
.sum__sec { padding: 18px 0 16px; border-bottom: 1px solid #e2e2e2; }
.sum__sech { display: flex; align-items: baseline; gap: 8px; margin-bottom: 10px; font-size: 16px; font-weight: 700; color: #000; }
.sum__by { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #8a8a8a; }
.sum__row { display: flex; justify-content: space-between; gap: 16px; padding: 5px 0; font-size: 14px; line-height: 1.45; color: #000; }
.sum__row > span:last-child { flex: none; text-align: right; }
.sum__row--sub { font-size: 13px; color: #333; padding: 3px 0; }
.sum__row--strong { font-weight: 700; color: #000; }
.sum__row--muted { color: #8a8a8a; font-size: 13px; }
.sum__row--subtotal { font-size: 16px; font-weight: 700; padding-bottom: 8px; }
.sum__row--discount { color: var(--green-refund); font-weight: 600; }
.sum__sec--totals { padding-top: 16px; }

/* hotel itemization */
.htl { margin: 2px 0 10px; padding: 14px 14px 10px; border: 1px solid #e2e2e2; border-radius: 8px; background: #fafafa; }
.htl__head { display: flex; gap: 10px; }
.htl__ico { flex: none; margin-top: 2px; }
.htl__name { font-size: 15px; font-weight: 700; color: #000; line-height: 1.3; }
.htl__meta { margin-top: 2px; font-size: 12.5px; color: #555; }
.htl__stars { color: #000; letter-spacing: 1px; }
.htl__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px; margin: 12px 0 10px; padding: 10px 0; border-top: 1px solid #e2e2e2; border-bottom: 1px solid #e2e2e2; }
.htl__grid dt { font-size: 10.5px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #8a8a8a; }
.htl__grid dd { margin: 2px 0 0; font-size: 13px; font-weight: 600; color: #000; line-height: 1.35; }
.htl__grid small { display: block; font-size: 12px; font-weight: 500; color: #555; }
.htl__split { margin-top: 6px; padding-top: 6px; border-top: 1px dashed #d6d6d6; }
.htl__note { margin-top: 6px; font-size: 12px; color: #555; }

.sum__total { display: flex; align-items: flex-end; justify-content: space-between; padding: 22px 0 4px; }
.sum__label { font-size: 26px; font-weight: 700; color: #000; line-height: 1; }
.sum__amtwrap { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.sum__was { font-size: 15px; font-weight: 600; color: var(--red-checkout); }
.sum__amt { font-size: 28px; font-weight: 700; color: #000; line-height: 1; }
.sum__athotel { margin-top: 8px; font-size: 12px; color: #8a8a8a; text-align: right; }

.sum__promo { display: flex; align-items: center; justify-content: space-between; margin-top: 22px; }
.sum__promo input {
  width: 206px;
  height: 36px;
  margin-top: 4px;
  padding: 0;
  border: 0;
  border-bottom: 1.5px solid #4f4f4f;
  font-size: 15.8px;
  font-weight: 500;
  outline: none;
}
.sum__promo input::placeholder { color: #4f4f4f; }
.sum__add { width: 83px; height: 43px; font-size: 14.5px; }
.sum__msg { margin-top: 10px; font-size: 13px; font-weight: 500; color: var(--green-refund); }
.sum__msg.is-err { color: var(--red-error); }
.sum__msg button { margin-left: 8px; font-size: 12px; text-decoration: underline; color: #555; }

.sum__cta {
  width: 100%;
  height: 43.5px;
  margin-top: 54px;
  gap: 10px;
  font-size: 14.7px;
  letter-spacing: 0.04em;
}
.sum__cta--tight { margin-top: 37px; }
.sum__cta:disabled { opacity: 0.85; cursor: progress; }
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
