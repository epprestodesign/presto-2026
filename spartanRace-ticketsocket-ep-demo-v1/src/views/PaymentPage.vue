<script setup>
import { ref, onBeforeMount } from 'vue'
import { LINK_ACCOUNT, asset } from '../data.js'
import { state, ensureOrder, pricing, money } from '../store.js'
import CheckoutLayout from '../components/CheckoutLayout.vue'

onBeforeMount(ensureOrder)

// Phase 1 stops here: PAY shows a processing state, then returns. No order is placed.
const busy = ref(false)
const tried = ref(false)
const done = ref(false)
const linkConfirmed = ref(false)
const changing = ref(false)

function pay() {
  tried.value = true
  if (!state.termsAgreed) return
  busy.value = true
  done.value = false
  setTimeout(() => {
    busy.value = false
    done.value = true
  }, 1800)
}
</script>

<template>
  <CheckoutLayout step="payment" :title="['Payment', 'information']" cta="Pay" :busy="busy" @submit="pay">
    <h2 class="pm__h">Payment method</h2>

    <div class="methods" role="radiogroup" aria-label="Payment method">
      <label class="method">
        <input v-model="state.paymentMethod" type="radio" value="sezzle" name="pm" />
        <span class="dot" aria-hidden="true" />
        <svg class="sezzle" viewBox="0 0 120 30" width="94" height="24" aria-label="Sezzle">
          <defs>
            <linearGradient id="sz" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#8b5cf6" /><stop offset=".45" stop-color="#22c55e" /><stop offset="1" stop-color="#f59e0b" />
            </linearGradient>
          </defs>
          <path d="M9 3c3.2 2.6 4.6 5.6 3.6 8.4-.7 2-2.6 3.1-4.4 4.4-2.4 1.7-4 3.6-3.4 6.2C2.4 19.7 1.4 17 2 14.3c.6-2.7 2.8-4.3 4.8-5.9C8.3 7.2 9.4 5.6 9 3Z" fill="url(#sz)" />
          <path d="M14.6 10.4c2.4 2.2 3 4.8 1.8 7.2-1 2-3 3.2-5 4.4-1.6 1-2.8 2.2-2.8 4 -1.8-1.8-2-4.2-.6-6.2 1.2-1.7 3.2-2.6 4.8-3.8 1.4-1.1 2.2-3 1.8-5.6Z" fill="#f97316" opacity=".9" />
          <text x="27" y="22" font-family="Montserrat, sans-serif" font-size="21" font-weight="500" fill="#392d5f" letter-spacing=".5">sezzle</text>
        </svg>
        <span class="method__text">4 interest-free payments</span>
      </label>

      <label class="method method--card">
        <input v-model="state.paymentMethod" type="radio" value="card" name="pm" />
        <span class="dot" aria-hidden="true" />
        <span class="method__text method__text--card">+ Add new card</span>
      </label>

      <div v-if="state.paymentMethod === 'card'" class="link">
        <div class="link__head">
          <span class="link__logo" aria-label="Link">
            <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><circle cx="8" cy="8" r="8" fill="#00d66f" /><path d="M6.4 4.6 9.8 8l-3.4 3.4" fill="none" stroke="#011e0f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
            link
          </span>
          <span class="link__sep" />
          <span class="link__email">{{ LINK_ACCOUNT.email }}</span>
          <button class="link__more" aria-label="More Link options">•••</button>
        </div>
        <div class="link__card">
          <span class="link__art" aria-hidden="true"><i /><i /></span>
          <div class="link__cardtext">
            <p>{{ LINK_ACCOUNT.card }}</p>
            <p class="link__last4">•••• {{ LINK_ACCOUNT.last4 }}</p>
          </div>
          <button class="link__confirm" :class="{ 'is-done': linkConfirmed }" @click="linkConfirmed = true">
            {{ linkConfirmed ? 'Confirmed' : 'Confirm' }}
          </button>
        </div>
        <button class="link__change" @click="changing = !changing">
          Change payment method
          <svg viewBox="0 0 8 12" width="7" height="11" aria-hidden="true"><path d="m1.5 1.5 4.5 4.5-4.5 4.5" fill="none" stroke="#1d1d1d" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
        <div v-if="changing" class="link__form">
          <input placeholder="Card number" inputmode="numeric" />
          <div><input placeholder="MM / YY" /><input placeholder="CVC" /></div>
        </div>
      </div>

      <label class="method method--flex">
        <input v-model="state.paymentMethod" type="radio" value="flex" name="pm" />
        <span class="dot" aria-hidden="true" />
        <img class="flex" :src="asset('logos/flex-blue.png')" alt="Flex" />
        <span class="method__text">Pay with HSA/FSA</span>
      </label>
    </div>

    <section v-if="state.hotel" class="stay">
      <h3 class="stay__h">Hotel reservation</h3>
      <div class="stay__card">
        <div class="stay__top">
          <div>
            <p class="stay__name">{{ state.hotel.name }}</p>
            <p class="stay__meta">{{ '★'.repeat(state.hotel.stars) }} · {{ state.hotel.miles }} mi from Sandy Oaks Ranch</p>
          </div>
          <span class="stay__by">Booked by Eventpipe</span>
        </div>
        <dl class="stay__grid">
          <div><dt>Dates</dt><dd>{{ state.hotel.stayLabel }}</dd></div>
          <div><dt>Room</dt><dd>{{ state.hotel.rooms }} × {{ state.hotel.roomLabel }}</dd></div>
          <div><dt>Stay total</dt><dd>{{ money(state.hotel.total) }} <small>({{ state.hotel.nights }} {{ state.hotel.nights === 1 ? 'night' : 'nights' }} incl. taxes)</small></dd></div>
          <div><dt>Charged today</dt><dd>{{ money(state.hotel.dueToday) }}</dd></div>
          <div><dt>Due at the hotel</dt><dd>{{ state.hotel.dueAtHotel ? money(state.hotel.dueAtHotel) : 'Nothing — paid in full' }}</dd></div>
          <div><dt>Cancellation</dt><dd>Free until Nov 13</dd></div>
        </dl>
        <p v-if="state.hotel.shuttle" class="stay__note">Includes a free shuttle to Sandy Oaks Ranch on race mornings.</p>
      </div>
    </section>

    <p v-if="done" class="demo-note" role="status">
      Prototype stop — no payment was processed. Total that would be charged: {{ money(pricing.total) }}.
    </p>

    <template #aside>
      <label class="terms" :class="{ 'is-err': tried && !state.termsAgreed }">
        <input v-model="state.termsAgreed" type="checkbox" />
        <span class="terms__box" aria-hidden="true" />
        <span>By clicking Place Order, I have read and I agree to the <a href="#" @click.prevent>Terms of Purchase</a> and <a href="#" @click.prevent>Privacy Policy</a></span>
      </label>
    </template>
  </CheckoutLayout>
</template>

<style scoped>
.pm__h { margin-top: 71.5px; font-size: 23.8px; font-weight: 700; line-height: 29px; color: #000; }

.methods { margin-top: 24px; }
.method {
  position: relative;
  display: flex;
  align-items: center;
  height: 84px;
  border-bottom: 1.5px solid #e2e2e2;
  cursor: pointer;
}
.method input { position: absolute; opacity: 0; pointer-events: none; }
.dot { width: 22px; height: 22px; flex: none; border: 1.5px solid #9a9a9a; border-radius: 50%; background: #fff; }
.method input:checked + .dot { border: 1.5px solid #000; background: radial-gradient(circle, #000 0 6.5px, #fff 7px); }
.method input:focus-visible + .dot { outline: 2px solid #4191dd; outline-offset: 2px; }
.sezzle { margin-left: 21px; }
.method__text { margin-left: 7px; font-size: 13.7px; font-weight: 700; color: #000; }
.method__text--card { margin-left: 22px; }
.flex { width: 56px; margin-left: 31px; }
.method--flex .method__text { margin-left: 15px; }

/* Stripe Link block — mirrors the embedded third-party element, so it uses
   the system UI font like the real iframe does. */
.link {
  margin: 2px 0 21px;
  padding: 12px 13px 12px;
  border: 1px solid #e3e3e3;
  border-radius: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1d1d1d;
}
.link__head { display: flex; align-items: center; height: 24px; }
.link__logo { display: inline-flex; align-items: center; gap: 3px; font-size: 15px; font-weight: 700; color: #011e0f; letter-spacing: -0.02em; }
.link__sep { width: 1px; height: 14px; margin: 0 9px 0 8px; background: #d8d8d8; }
.link__email { font-size: 14px; }
.link__more { margin-left: auto; width: 24px; height: 24px; border-radius: 50%; background: #f2f2f2; font-size: 7px; letter-spacing: 1px; color: #333; }
.link__card {
  display: flex;
  align-items: center;
  height: 63px;
  margin-top: 10px;
  padding: 0 15px;
  border-radius: 9px;
  background: #f5f5f5;
}
.link__art { position: relative; width: 36px; height: 23px; border-radius: 3px; background: #1b1b1b; }
.link__art i { position: absolute; top: 5px; width: 13px; height: 13px; border-radius: 50%; }
.link__art i:first-child { left: 6px; background: #eb001b; }
.link__art i:last-child { left: 15px; background: #f79e1b; mix-blend-mode: screen; opacity: 0.95; }
.link__cardtext { margin-left: 16px; font-size: 16px; line-height: 19px; }
.link__last4 { font-size: 14px; color: #6d6d6d; letter-spacing: 0.04em; }
.link__confirm { margin-left: auto; height: 34px; padding: 0 19px; border-radius: 17px; background: #1d1d1d; color: #fff; font-size: 16px; font-weight: 500; }
.link__confirm.is-done { background: #00a85a; }
.link__change {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 43px;
  margin-top: 9px;
  padding: 0 18px 0 16px;
  border-radius: 9px;
  background: #f5f5f5;
  font-size: 16px;
  color: #1d1d1d;
}
.link__form { display: grid; gap: 8px; margin-top: 9px; }
.link__form div { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.link__form input { height: 40px; padding: 0 12px; border: 1px solid #ddd; border-radius: 8px; font: inherit; font-size: 15px; }

.stay { margin-top: 40px; }
.stay__h { font-size: 20px; font-weight: 700; color: #000; }
.stay__card { margin-top: 16px; padding: 18px 20px; border: 1px solid #e2e2e2; border-radius: 10px; }
.stay__top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.stay__name { font-size: 17px; font-weight: 700; color: #000; }
.stay__meta { margin-top: 2px; font-size: 13px; color: #6b6b6b; }
.stay__by { flex: none; padding: 4px 8px; border-radius: 4px; background: #f3f3f3; font-size: 11px; font-weight: 600; color: #555; text-transform: uppercase; letter-spacing: 0.04em; }
.stay__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; margin: 16px 0 0; }
.stay__grid dt { font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: #8a8a8a; }
.stay__grid dd { margin: 2px 0 0; font-size: 14px; font-weight: 600; color: #000; }
.stay__grid small { font-weight: 500; color: #8a8a8a; }
.stay__note { margin-top: 14px; font-size: 13px; color: #555; }
.demo-note { margin-top: 24px; padding: 12px 14px; border-radius: 8px; background: #f3f3f3; font-size: 13px; color: #444; }

.terms { position: relative; display: flex; gap: 20px; margin-top: 52px; font-size: 11.8px; font-weight: 500; line-height: 18px; color: #000; cursor: pointer; }
.terms > span:last-child { max-width: 285px; }
.terms a { color: #979797; text-decoration: none; }
.terms a:hover { text-decoration: underline; }
.terms input { position: absolute; opacity: 0; width: 20px; height: 20px; margin: 0; }
.terms__box { flex: none; width: 20px; height: 20px; margin-top: 2px; border: 1.5px solid #9a9a9a; border-radius: 1px; background: #fff; }
.terms input:checked + .terms__box { border-color: #000; background: #000 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3.5 8.5l3 3 6-7' fill='none' stroke='white' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / 14px no-repeat; }
.terms input:focus-visible + .terms__box { outline: 2px solid #4191dd; outline-offset: 2px; }
.terms.is-err { color: var(--red-error); }
.terms.is-err .terms__box { border-color: var(--red-error); }
</style>
