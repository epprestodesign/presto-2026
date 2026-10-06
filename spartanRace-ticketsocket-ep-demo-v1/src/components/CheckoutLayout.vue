<script setup>
import { ref } from 'vue'
import { state, pricing, money, PROMO_CODES, go } from '../store.js'
import { asset } from '../data.js'

const props = defineProps({
  step: { type: String, required: true }, // details | addons | extras | payment
  title: { type: Array, required: true }, // wide-display title lines
  cta: { type: String, required: true },
  busy: { type: Boolean, default: false },
})
const emit = defineEmits(['submit'])

const STEPS = [
  ['details', 'Details'],
  ['addons', 'Add-ons'],
  ['extras', 'Extras'],
  ['payment', 'Payment'],
]
const order = { details: 0, addons: 1, extras: 2, payment: 3 }
const canJump = (s) => order[s] < order[props.step]

// open by default so the order lines (incl. hotel + parking) are visible at a glance
const breakdown = ref(true)
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
        <div class="sum">
          <div class="sum__total">
            <span class="sum__label">Total</span>
            <button class="sum__amt" :aria-expanded="breakdown" @click="breakdown = !breakdown">
              {{ money(pricing.total) }}
              <svg viewBox="0 0 10 6" width="10" height="6" aria-hidden="true" :class="{ flip: breakdown }"><path d="M0 0h10L5 6Z" fill="#000" /></svg>
            </button>
          </div>

          <dl v-if="breakdown" class="sum__lines">
            <div><dt>Registration</dt><dd>{{ money(pricing.registration) }}</dd></div>
            <div v-for="a in pricing.addons" :key="a.id"><dt>{{ a.name }}<template v-if="a.qty > 1"> × {{ a.qty }}</template></dt><dd>{{ money(a.price * a.qty) }}</dd></div>
            <div v-if="pricing.discount"><dt>Promocode</dt><dd>−{{ money(pricing.discount) }}</dd></div>
            <div><dt>Insurance</dt><dd>{{ money(pricing.insurance) }}</dd></div>
            <div><dt>Service fee</dt><dd>{{ money(pricing.service) }}</dd></div>
            <div><dt>Taxes</dt><dd>{{ money(pricing.tax) }}</dd></div>
            <div v-if="pricing.refund"><dt>Refundable booking</dt><dd>{{ money(pricing.refund) }}</dd></div>
            <div v-if="pricing.parking"><dt>Parking pass</dt><dd>{{ money(pricing.parking) }}</dd></div>
            <div v-if="pricing.photo"><dt>Photo package</dt><dd>{{ money(pricing.photo) }}</dd></div>
            <div v-if="state.hotel"><dt>Hotel — due today</dt><dd>{{ money(pricing.hotelToday) }}</dd></div>
            <div v-if="pricing.hotelAtHotel" class="sum__later"><dt>Due at the hotel (not charged now)</dt><dd>{{ money(pricing.hotelAtHotel) }}</dd></div>
          </dl>

          <div v-if="state.hotel || state.parking || state.photo" class="sum__extras">
            <p v-if="state.hotel" class="sum__hotel">
              <svg class="sum__ico" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5M7 11.5a1.5 1.5 0 1 0 0-.01" fill="none" stroke="#555" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span><strong>{{ state.hotel.name }}</strong><br />{{ state.hotel.stayShort }} · {{ state.hotel.nights }} {{ state.hotel.nights === 1 ? 'night' : 'nights' }} · {{ state.hotel.roomLabel }}</span>
              <b>{{ money(state.hotel.dueToday) }}</b>
            </p>
            <p v-if="state.parking" class="sum__hotel">
              <svg class="sum__ico" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="3" fill="none" stroke="#555" stroke-width="1.7"/><path d="M10 16.5v-9h3a2.6 2.6 0 0 1 0 5.2h-3" fill="none" stroke="#555" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span><strong>Parking pass</strong><br />On-site lot, both days</span>
              <b>{{ money(pricing.parking) }}</b>
            </p>
            <p v-if="state.photo" class="sum__hotel">
              <svg class="sum__ico" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4Z" fill="none" stroke="#555" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.5" fill="none" stroke="#555" stroke-width="1.7"/></svg>
              <span><strong>Photo package</strong><br />Digital race photos, per racer</span>
              <b>{{ money(pricing.photo) }}</b>
            </p>
            <p v-if="pricing.hotelAtHotel" class="sum__athotel">+ {{ money(pricing.hotelAtHotel) }} due at check-in</p>
          </div>

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
  top: 68px;
  width: 496px;
  padding: 0 40px 32px;
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 2px 18px rgba(0, 0, 0, 0.1);
}
.sum__total { display: flex; align-items: center; justify-content: space-between; height: 114px; padding-top: 2px; }
.sum__label { font-size: 15.9px; font-weight: 700; text-transform: uppercase; color: #000; }
.sum__amt { display: inline-flex; align-items: center; gap: 9px; margin-right: 4px; font-size: 22px; font-weight: 700; color: #000; }
.sum__amt svg { transition: transform 0.15s; }
.sum__amt svg.flip { transform: rotate(180deg); }

.sum__lines { margin: -18px 0 16px; padding: 4px 0 14px; border-bottom: 1px solid #eee; }
.sum__lines div { display: flex; justify-content: space-between; padding: 4px 0; font-size: 14px; color: #444; }
.sum__lines dd { margin: 0; font-weight: 600; color: #000; }
.sum__lines .sum__later { color: #8a8a8a; font-style: italic; }
.sum__lines .sum__later dd { color: #8a8a8a; font-weight: 500; }

/* hotel / parking added by the embedded Eventpipe widget */
.sum__extras { margin: -22px 0 26px; padding: 12px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee; }
.sum__hotel { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; line-height: 1.4; color: #555; }
.sum__hotel + .sum__hotel { margin-top: 10px; }
.sum__hotel strong { color: #000; }
.sum__hotel b { margin-left: auto; color: #000; white-space: nowrap; }
.sum__ico { flex: none; margin-top: 1px; }
.sum__athotel { margin-top: 8px; font-size: 12px; color: #8a8a8a; text-align: right; }

.sum__promo { display: flex; align-items: center; justify-content: space-between; margin-top: -7px; }
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
