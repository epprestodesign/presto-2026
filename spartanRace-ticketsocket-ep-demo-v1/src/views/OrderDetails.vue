<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import { WAVES, CHECKOUT_ADDONS, asset } from '../data.js'
import {
  state, primaryTicket, ensureOrder, setTicketQty, checkoutAddonQty, setCheckoutAddonQty, money, go,
} from '../store.js'
import CheckoutLayout from '../components/CheckoutLayout.vue'
import SignaturePad from '../components/SignaturePad.vue'

// Demo default: the step arrives filled in (first wave, signed waiver), so
// Checkout goes straight to the next step. Clearing any of it re-enables validation.
onBeforeMount(() => {
  ensureOrder()
  // the pad mounts blank unless Auto-fill signs it (src/autofill.js fills the rest)
  if (!state.autofill) state.signature = false
})

const t = computed(() => primaryTicket.value)
const waves = computed(() => (t.value ? WAVES[t.value.day.key] || [] : []))
const addons = computed(() =>
  CHECKOUT_ADDONS.map((a) =>
    a.id === 'spectator' && t.value ? { ...a, name: `${t.value.day.dayName} Spectator Pass` } : a,
  ),
)

const waveRail = ref(null)
const scrollWaves = (d) => waveRail.value?.scrollBy({ left: d * 160, behavior: 'smooth' })

const tried = ref(false)
const errs = computed(() => ({
  wave: !state.wave,
  signature: !state.signature,
  agree: !state.waiverAgreed,
}))
const waiverOpen = ref(false)

function submit() {
  tried.value = true
  if (Object.values(errs.value).some(Boolean)) {
    const first = errs.value.wave ? '.waves' : '.waiver'
    document.querySelector(first)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }
  go('addons')
}
</script>

<template>
  <CheckoutLayout step="details" :title="['Order details']" cta="Checkout" @submit="submit">
    <template v-if="t">
      <p class="od__date">{{ t.day.date }}</p>
      <h2 class="od__event">{{ t.race.eventName }} - {{ t.day.dayName }}</h2>
      <hr class="rule" />

      <div class="tk">
        <div>
          <p class="tk__name">{{ t.name.toUpperCase() }} ({{ t.day.dayName }} {{ t.window }})</p>
          <p class="tk__price">{{ money(t.price) }}</p>
        </div>
        <label class="tk__qty">
          <span class="sr-only">Ticket quantity</span>
          <select :value="t.qty" @change="setTicketQty(t.id, +$event.target.value)">
            <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
          </select>
        </label>
      </div>

      <div v-if="waves.length" class="waves" :class="{ 'is-err': tried && errs.wave }">
        <div class="waves__head">
          <p class="waves__label">
            <svg viewBox="0 0 20 20" width="17" height="17" aria-hidden="true"><circle cx="10" cy="10" r="8.6" fill="none" stroke="#000" stroke-width="1.7" /><path d="M10 5.2V10l3 2" fill="none" stroke="#000" stroke-width="1.7" stroke-linecap="round" /></svg>
            Select preferred wave time
          </p>
          <div class="waves__nav">
            <button aria-label="Earlier waves" @click="scrollWaves(-1)">
              <svg viewBox="0 0 24 24" width="12" height="12"><path d="M15 4 7 12l8 8" fill="none" stroke="#bbb" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </button>
            <button aria-label="Later waves" @click="scrollWaves(1)">
              <svg viewBox="0 0 24 24" width="12" height="12"><path d="m9 4 8 8-8 8" fill="none" stroke="#bbb" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </button>
          </div>
        </div>
        <div ref="waveRail" class="waves__rail" role="radiogroup" aria-label="Wave time">
          <button
            v-for="w in waves"
            :key="w.id"
            role="radio"
            class="wave"
            :class="{ 'is-on': state.wave === w.id }"
            :aria-checked="state.wave === w.id"
            @click="state.wave = w.id"
          >
            <span class="wave__time">{{ w.label }}</span>
            <span class="wave__spots">{{ w.spots }} spots</span>
          </button>
        </div>
        <p v-if="tried && errs.wave" class="err">Please select a wave time</p>
      </div>
      <hr class="rule" />

      <h3 class="od__h">Add-ons</h3>
      <div class="addons">
        <article v-for="a in addons" :key="a.id" class="addon">
          <img class="addon__img" :src="asset(a.img)" alt="" />
          <div class="addon__info">
            <p class="addon__name">
              {{ a.name }}
              <svg v-if="a.help" viewBox="0 0 20 20" width="16" height="16" aria-label="More info"><circle cx="10" cy="10" r="10" fill="#b1b1b1" /><path d="M7.6 7.6a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.6" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" /><circle cx="10" cy="14.6" r="1.15" fill="#fff" /></svg>
            </p>
            <p class="addon__price">{{ money(a.price) }}</p>
            <button v-if="!checkoutAddonQty(a.id)" class="addon__add" :aria-label="`Add ${a.name}`" @click="setCheckoutAddonQty(a.id, 1)">
              <svg viewBox="0 0 20 20" width="19" height="19"><path d="M10 2v16M2 10h16" stroke="#000" stroke-width="1.8" stroke-linecap="round" /></svg>
            </button>
            <div v-else class="stepper">
              <button :aria-label="`Remove one ${a.name}`" @click="setCheckoutAddonQty(a.id, checkoutAddonQty(a.id) - 1)">
                <svg viewBox="0 0 20 20" width="18" height="18"><path d="M2 10h16" stroke="#000" stroke-width="2" stroke-linecap="round" /></svg>
              </button>
              <span>{{ checkoutAddonQty(a.id) }}</span>
              <button :aria-label="`Add one ${a.name}`" @click="setCheckoutAddonQty(a.id, checkoutAddonQty(a.id) + 1)">
                <svg viewBox="0 0 20 20" width="18" height="18"><path d="M10 2v16M2 10h16" stroke="#8a8a8a" stroke-width="1.6" stroke-linecap="round" /></svg>
              </button>
            </div>
          </div>
        </article>
      </div>
      <hr class="rule" />

      <section class="waiver">
        <div class="waiver__head">
          <h3 class="od__h">Waiver</h3>
          <button class="waiver__read" @click="waiverOpen = !waiverOpen">{{ waiverOpen ? 'Close' : 'Read' }}</button>
        </div>
        <div v-if="waiverOpen" class="waiver__text">
          <p><strong>Spartan Race, Inc. Release of Liability, Waiver of Claims, Assumption of Risks and Indemnity Agreement.</strong></p>
          <p>I acknowledge that obstacle course racing is an extreme test of a person’s physical and mental limits and carries with it the potential for death, serious injury and property loss. The risks include, but are not limited to, those caused by terrain, facilities, temperature, weather, condition of athletes, equipment, vehicular traffic, actions of other people including, but not limited to, participants, volunteers, spectators, coaches, event officials and event monitors, and/or producers of the event, and lack of hydration.</p>
          <p>I hereby assume all of the risks of participating and/or volunteering in this event, and I certify that I am physically fit, have sufficiently trained for participation in the event, and have not been advised otherwise by a qualified medical person.</p>
        </div>
        <SignaturePad class="waiver__pad" :auto-sign="state.autofill" :error="tried && errs.signature" @change="(v) => (state.signature = v)" />
        <label class="agree" :class="{ 'is-err': tried && errs.agree }">
          <input v-model="state.waiverAgreed" type="checkbox" />
          <span class="agree__box" aria-hidden="true" />
          <span>By electronically signing my name above, I (myself or on behalf of my child/ward) have read, fully understand, and agree to this Waiver</span>
        </label>
      </section>
      <hr class="rule rule--insta" />

      <section class="insta">
        <h3 class="insta__h">Your Instagram Handle</h3>
        <label class="sr-only" for="ig">Your Instagram Handle</label>
        <input id="ig" v-model="state.instagram" class="insta__input" placeholder="Your Instagram Handle" autocomplete="off" />
      </section>
      <hr class="rule rule--policy" />

      <details class="policy">
        <summary>
          Refund and Transfer Policy
          <svg viewBox="0 0 14 14" width="13" height="13" aria-hidden="true"><circle cx="7" cy="7" r="7" fill="#c4c4c4" /><path d="M7 6.2v4" stroke="#fff" stroke-width="1.6" stroke-linecap="round" /><circle cx="7" cy="4.1" r="0.95" fill="#fff" /></svg>
        </summary>
        <p>Registrations are non-refundable. You may transfer your registration to another Spartan event within the same season, or to another athlete, up to 14 days before race day for a transfer fee. Add “Refundable Booking” on the next step for a full refund if you can’t make it.</p>
      </details>
    </template>
  </CheckoutLayout>
</template>

<style scoped>
.rule { margin: 0; border: 0; border-top: 1.5px solid #e2e2e2; }

.od__date { margin-top: 58.5px; font-size: 15.8px; font-weight: 500; line-height: 19px; color: #000; }
.od__event { margin-top: 9.5px; margin-bottom: 40.5px; font-size: 24.1px; font-weight: 700; line-height: 29px; color: #000; }

.tk { display: flex; align-items: center; justify-content: space-between; margin-top: 40px; }
.tk__name { font-size: 20px; font-weight: 700; line-height: 24px; color: #000; }
.tk__price { margin-top: 4px; font-size: 20px; font-weight: 400; line-height: 24px; color: #000; }
.tk__qty { position: relative; }
.tk__qty select {
  appearance: none;
  width: 78px;
  height: 43.5px;
  padding-left: 18px;
  border: 1px solid #c9c9c9;
  border-radius: 22px;
  background: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}
.tk__qty::after {
  content: '';
  position: absolute;
  right: 15px;
  top: 19px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5.5px solid #000;
  pointer-events: none;
}

.waves { margin-top: 38.5px; padding-bottom: 40px; }
.waves__head { display: flex; align-items: center; justify-content: space-between; }
.waves__label { display: flex; align-items: center; gap: 13px; font-size: 15.8px; font-weight: 500; line-height: 20px; color: #000; padding-left: 1px; }
.waves__nav { display: flex; gap: 8px; }
.waves__nav button { width: 24px; height: 24px; border-radius: 50%; border: 1px solid #ddd; display: grid; place-items: center; }
.waves__rail { display: flex; gap: 8.7px; margin-top: 20.5px; overflow-x: auto; scrollbar-width: none; }
.waves__rail::-webkit-scrollbar { display: none; }
.wave {
  flex: none;
  height: 101.5px;
  padding: 0 9.5px;
  border: 1px solid #cfcfcf;
  border-radius: 4px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.wave.is-on { border: 1.5px solid var(--red-error); padding: 0 9px; }
.wave__time { font-size: 13.1px; font-weight: 700; color: #000; white-space: nowrap; }
.wave__spots { margin-top: 3px; font-size: 11px; font-weight: 600; letter-spacing: 0.03em; color: #9d9d9d; text-transform: uppercase; }
.err { margin-top: 10px; font-size: 13px; font-weight: 500; color: var(--red-error); }

.od__h { font-size: 19.9px; font-weight: 700; line-height: 24px; color: #000; }
.rule + .od__h { margin-top: 39px; }

.addons { display: grid; grid-template-columns: 1fr 1fr; gap: 24px 15px; margin-top: 30px; margin-bottom: 41.5px; }
.addon {
  position: relative;
  height: 119px;
  border: 1px solid #d6d6d6;
  border-radius: 6px;
  overflow: hidden;
}
.addon__img { position: absolute; left: 0; bottom: 0; width: 119px; height: 119px; object-fit: cover; object-position: left bottom; }
.addon__info { position: relative; display: flex; flex-direction: column; align-items: flex-end; padding: 14px 17px 0 0; text-align: right; }
.addon__name { white-space: nowrap; }
.addon__name { display: flex; align-items: center; gap: 5px; font-size: 15.8px; font-weight: 500; line-height: 21px; color: #000; }
.addon__price { font-size: 17.7px; font-weight: 700; line-height: 21px; color: #000; }
.addon__add {
  margin-top: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e9e9e9;
  display: grid;
  place-items: center;
}
.addon__add:hover { background: #ddd; }
.stepper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 18px;
  width: 78px;
  height: 32px;
  padding: 0 8px;
  border-radius: 16px;
  background: #eaeaea;
  font-size: 16px;
  font-weight: 700;
}
.stepper button { line-height: 0; }

.waiver { padding-top: 0; }
.waiver__head { display: flex; align-items: center; justify-content: space-between; margin-top: 41.5px; }
.waiver__read { font-size: 13.6px; font-weight: 500; color: #000; }
.waiver__read:hover { text-decoration: underline; }
.waiver__text { margin-top: 14px; max-height: 220px; overflow: auto; padding: 14px 16px; border: 1px solid #e2e2e2; border-radius: 8px; font-size: 13px; line-height: 1.55; color: #333; }
.waiver__text p + p { margin-top: 10px; }
.waiver__pad { margin-top: 20.5px; }
.agree { position: relative; display: flex; gap: 14px; margin-top: 30px; font-size: 13.8px; font-weight: 500; line-height: 18px; color: #000; cursor: pointer; }
.agree input { position: absolute; opacity: 0; width: 18px; height: 18px; margin: 0; cursor: pointer; }
.agree__box { flex: none; width: 18.5px; height: 18.5px; margin-top: 3px; border: 1.5px solid #000; border-radius: 1px; background: #fff; }
.agree input:checked + .agree__box { background: #000 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3.5 8.5l3 3 6-7' fill='none' stroke='white' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / 14px no-repeat; }
.agree input:focus-visible + .agree__box { outline: 2px solid #4191dd; outline-offset: 2px; }
.agree.is-err { color: var(--red-error); }
.agree.is-err .agree__box { border-color: var(--red-error); }

.rule--insta { margin-top: 41px; }
.insta__h { margin-top: 41px; font-size: 18px; font-weight: 700; line-height: 22px; color: #000; }
.insta__input {
  display: block;
  width: 321px;
  height: 36px;
  margin-top: 40px;
  padding: 0;
  border: 0;
  border-bottom: 1.5px solid #8d8d8d;
  font-size: 16px;
  outline: none;
}
.insta__input::placeholder { color: #8d8d8d; }
.insta__input:focus { border-bottom-color: #000; }
.rule--policy { margin-top: 62px; }
.policy { margin-top: 48px; }
.policy summary { display: flex; align-items: center; gap: 8px; list-style: none; cursor: pointer; font-size: 16px; font-weight: 700; color: #000; }
.policy summary::-webkit-details-marker { display: none; }
.policy p { margin-top: 14px; font-size: 14px; line-height: 1.55; color: #444; }
</style>
