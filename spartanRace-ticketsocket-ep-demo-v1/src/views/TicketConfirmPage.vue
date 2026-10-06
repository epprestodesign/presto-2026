<script setup>
// E/F — the ticket purchase is done (tickets + race-day add-ons only). Spartan
// order receipt, plus a featured "Make a weekend of it" card that links to the
// separate hotel booking page. Accent follows the concept skin (E navy / F red).
import { computed, onBeforeMount } from 'vue'
import { state, ensureOrder, receipt, pricing, money, go } from '../store.js'
import { HOTELS, FROM_NIGHTLY, money as fmt } from '../presto/hotels.js'
import SpartanConfirmBar from '../components/SpartanConfirmBar.vue'
import imgA from '@lib/assets/hotel/exterior.jpg'
import imgB from '@lib/assets/hotel/lobby.jpg'
import imgC from '@lib/assets/hotel/pool.jpg'

onBeforeMount(ensureOrder)

const accent = computed(() => (state.skin === 'spartan' ? '#be2d27' : '#01113e'))
const orderNo = 'SR-' + String(2026112100 + (Date.now() % 9973)).slice(-8)
const r = computed(() => receipt.value)
const p = computed(() => pricing.value)
const subtotal = computed(() => r.value.tickets.reduce((s, t) => s + t.amount, 0) + r.value.addons.reduce((s, a) => s + a.amount, 0))
const picks = computed(() =>
  [...HOTELS].sort((a, b) => a.miles - b.miles).slice(0, 3).map((h, i) => ({ ...h, img: [imgA, imgB, imgC][i], from: Math.min(...Object.values(h.rates)) })),
)
const booked = computed(() => state.stayHotel)
const stars = (n) => '★'.repeat(n || 0)
</script>

<template>
  <div class="tc" :style="{ '--acc': accent }">
    <SpartanConfirmBar />
    <main class="tc__main">
      <section class="tc__left">
        <p class="tc__eyebrow">Order confirmed</p>
        <h1 class="t-wide tc__title"><span>You're in.</span><span>See you at the start line.</span></h1>
        <p class="tc__meta">Order <strong>#{{ orderNo }}</strong> · A confirmation and your race-day info are on their way to <strong>youraccount@eventpipe.com</strong>.</p>

        <div class="rc">
          <h2 class="rc__h">Tickets</h2>
          <div v-for="(t, i) in r.tickets" :key="'t' + i" class="rc__row"><span>{{ t.label }}<template v-if="t.qty > 1"> (x {{ t.qty }})</template></span><span>{{ money(t.amount) }}</span></div>
          <template v-if="r.addons.length">
            <h2 class="rc__h">Add-ons</h2>
            <div v-for="(a, i) in r.addons" :key="'a' + i" class="rc__row"><span>{{ a.label }}<template v-if="a.qty > 1"> (x {{ a.qty }})</template></span><span>{{ money(a.amount) }}</span></div>
          </template>
          <div class="rc__row rc__row--sub"><span>Subtotal</span><span>{{ money(subtotal) }}</span></div>
          <div class="rc__row"><span>Insurance</span><span>{{ money(p.insurance) }}</span></div>
          <div class="rc__row"><span>Service fee</span><span>{{ money(p.service) }}</span></div>
          <div class="rc__row"><span>Taxes</span><span>{{ money(p.tax) }}</span></div>
          <div v-if="p.refund" class="rc__row"><span>Refundable booking</span><span>{{ money(p.refund) }}</span></div>
          <div v-if="p.discount" class="rc__row rc__row--disc"><span>Promocode</span><span>−{{ money(p.discount) }}</span></div>
          <div class="rc__total"><span>Total paid</span><span>{{ money(r.total) }}</span></div>
        </div>
      </section>

      <aside class="tc__right">
        <!-- the hand-off to the separate hotel booking page -->
        <div v-if="!booked" class="hcard">
          <p class="hcard__eyebrow">Make a weekend of it</p>
          <h2 class="hcard__h">Book your hotel for race weekend</h2>
          <p class="hcard__sub">Rooms held near Sandy Oaks Ranch for Nov 20 – 22, from {{ fmt(FROM_NIGHTLY) }}/night. Free cancellation until Nov 13.</p>
          <ul class="hcard__list">
            <li v-for="h in picks" :key="h.id" class="hcard__hotel">
              <img :src="h.img" alt="" />
              <div>
                <p class="hcard__name">{{ h.name }}</p>
                <p class="hcard__meta"><span class="hcard__stars">{{ stars(h.stars) }}</span> {{ h.miles }} mi from the venue</p>
              </div>
              <span class="hcard__from">from<strong>{{ fmt(h.from).replace('.00', '') }}</strong></span>
            </li>
          </ul>
          <button type="button" class="pill hcard__cta" @click="go('stay')">Find a hotel</button>
          <p class="hcard__by">Hotel booking powered by <strong>Eventpipe</strong></p>
        </div>

        <div v-else class="hcard hcard--booked">
          <p class="hcard__eyebrow">Hotel booked</p>
          <h2 class="hcard__h">{{ booked.name }}</h2>
          <p class="hcard__sub">{{ booked.stayLabel }} · {{ booked.nights }} {{ booked.nights === 1 ? 'night' : 'nights' }} · {{ booked.roomLabel }}</p>
          <div class="rc__row"><span>Paid today</span><span>{{ fmt(booked.dueToday) }}</span></div>
          <div v-if="booked.dueAtHotel" class="rc__row"><span>Due at check-in</span><span>{{ fmt(booked.dueAtHotel) }}</span></div>
          <button type="button" class="pill hcard__cta hcard__cta--ghost" @click="go('stay')">Book another hotel</button>
          <p class="hcard__by">Hotel booking powered by <strong>Eventpipe</strong></p>
        </div>
      </aside>
    </main>
  </div>
</template>

<style scoped>
.tc { min-height: 100vh; background: #f5f5f5; }
.tc__main { display: grid; grid-template-columns: minmax(0, 1fr) 420px; gap: 40px; max-width: 1180px; margin: 0 auto; padding: 48px 40px 80px; align-items: start; }
.tc__eyebrow { font-size: 13px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #be2d27; }
.tc__title { display: block; margin-top: 10px; font-size: 40px; line-height: 1; color: #000; }
.tc__title span { display: block; }
.tc__title span + span { margin-top: 8px; font-size: 26px; }
.tc__meta { margin-top: 18px; font-size: 15px; line-height: 1.5; color: #333; }
.rc { margin-top: 28px; padding: 26px 30px; border-radius: 14px; background: #fff; box-shadow: 0 2px 18px rgba(0, 0, 0, 0.08); }
.rc__h { margin: 18px 0 8px; font-size: 18px; font-weight: 700; color: #000; }
.rc__h:first-child { margin-top: 0; }
.rc__row { display: flex; justify-content: space-between; gap: 16px; padding: 5px 0; font-size: 15px; line-height: 1.45; color: #000; }
.rc__row > span:last-child { flex: none; }
.rc__row--sub { margin-top: 14px; padding-top: 14px; border-top: 1px solid #e2e2e2; font-size: 17px; font-weight: 700; }
.rc__row--disc { color: #4c8a45; font-weight: 600; }
.rc__total { display: flex; justify-content: space-between; margin-top: 14px; padding-top: 16px; border-top: 1px solid #e2e2e2; font-size: 26px; font-weight: 700; color: #000; }

.hcard { position: sticky; top: 90px; padding: 26px 26px 20px; border-radius: 14px; background: #fff; border-top: 6px solid var(--acc); box-shadow: 0 2px 18px rgba(0, 0, 0, 0.1); }
.hcard__eyebrow { font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--acc); }
.hcard__h { margin-top: 6px; font-size: 22px; font-weight: 700; line-height: 1.25; color: #000; }
.hcard__sub { margin-top: 8px; font-size: 14px; line-height: 1.5; color: #444; }
.hcard__list { margin: 16px 0 0; padding: 0; list-style: none; display: grid; gap: 10px; }
.hcard__hotel { display: flex; align-items: center; gap: 12px; padding: 8px; border: 1px solid #e2e2e2; border-radius: 10px; }
.hcard__hotel img { width: 64px; height: 52px; flex: none; border-radius: 6px; object-fit: cover; }
.hcard__hotel > div { flex: 1; min-width: 0; }
.hcard__name { font-size: 14px; font-weight: 700; color: #000; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.hcard__meta { margin-top: 2px; font-size: 12px; color: #555; }
.hcard__stars { color: #000; letter-spacing: 1px; }
.hcard__from { display: grid; text-align: right; font-size: 11px; color: #777; }
.hcard__from strong { font-size: 16px; color: #000; }
.hcard__cta { width: 100%; height: 48px; margin-top: 18px; background: var(--acc); color: #fff; font-size: 15px; letter-spacing: 0.04em; }
.hcard__cta--ghost { background: #fff; color: var(--acc); border: 1.5px solid var(--acc); }
.hcard__by { margin-top: 12px; text-align: center; font-size: 12px; color: #8a8a8a; }
.hcard__by strong { color: #555; }
.hcard--booked .rc__row { font-size: 14px; }
</style>
