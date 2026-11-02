<script setup>
// CONCEPT 1 — "Heartbeat". Closest to IMEX's own site: light, editorial,
// confident. Booking lives in the hero — the corporate bar widget overlaps the
// hero's bottom edge on a soft pink band — and a light sticky bar takes over
// once the hero scrolls away. Every entry point opens the one page-owned
// L27BookingModal. Concept only; not affiliated with IMEX.
import { ref } from 'vue'
import '../l27.css'
import { brand, photos, event, stats, perks, defaultStay } from '../imex.js'
import { scrollToId } from '../L27Extras.js'
import L27BookingWidget from '../L27BookingWidget.vue'
import L27BookingModal from '../L27BookingModal.vue'
import L27StatsBand from '../L27StatsBand.vue'
import L27HotelMap from '../L27HotelMap.vue'
import L27Countdown from '../L27Countdown.vue'
import L27BlockMeter from '../L27BlockMeter.vue'
import L27LogoStrip from '../L27LogoStrip.vue'
import L27Faq from '../L27Faq.vue'
import L27AddToCalendar from '../L27AddToCalendar.vue'
import L27StickyBar from '../L27StickyBar.vue'
import L27ConceptTag from '../L27ConceptTag.vue'

const props = defineProps({
  initialModal: { type: Boolean, default: false },
  initialModalState: { type: String, default: 'form' },
})

const stay = ref({ ...defaultStay })
const bookOpen = ref(props.initialModal)
const modalState = ref(props.initialModalState)
const hotelId = ref('')
const modalKey = ref(0)
const search = ref(null) // the widget's search payload, echoed in the modal

function openModal (state, id = '') {
  modalState.value = state
  hotelId.value = id
  modalKey.value++
  bookOpen.value = true
}
// Widget search → the modal opens on "Finding rooms…" and moves on to results
// for exactly what the guest picked.
function onSearch (payload) {
  if (payload?.stay) stay.value = { ...payload.stay }
  search.value = payload
  openModal('searching')
}
const bookHotel = (id) => openModal('form', id)
const book = () => openModal('form')

const nav = [
  { id: 'hb-hotels', label: 'Hotels' },
  { id: 'hb-schedule', label: 'Schedule' },
  { id: 'hb-why', label: 'Why book here' },
  { id: 'hb-faq', label: 'FAQ' },
]
const tileColors = ['coral', 'blue', 'orange', 'green']
const participants = stats[0].value.toLocaleString('en-US')
</script>

<template>
  <div class="l27 l27-heartbeat">
    <l27-concept-tag label="Heartbeat" />
    <l27-sticky-bar position="top" tone="light" :threshold="680" @book="book" />

    <header class="hb-top">
      <div class="hb-util">
        <div class="l27-wrap hb-util__inner">
          <q-icon name="verified" size="16px" aria-hidden="true" />
          <span>Official hotel booking · Block rates held until {{ event.blockDeadline }}</span>
        </div>
      </div>
      <div class="l27-wrap hb-nav">
        <img :src="brand.logo" alt="IMEX America 2027" class="hb-nav__logo" />
        <nav class="hb-nav__links" aria-label="Page sections">
          <button v-for="n in nav" :key="n.id" type="button" class="hb-nav__link" @click="scrollToId(n.id)">{{ n.label }}</button>
        </nav>
        <button type="button" class="l27-btn l27-btn--primary hb-nav__cta" @click="book">
          <q-icon name="hotel" size="20px" /> <span>Book your hotel</span>
        </button>
      </div>
    </header>

    <main>
      <!-- HERO -->
      <section class="hb-hero" aria-labelledby="hb-title">
        <div class="l27-wrap hb-hero__grid">
          <div class="hb-hero__copy">
            <p class="l27-eyebrow hb-eyebrow">Official hotel booking for IMEX America 2027</p>
            <h1 id="hb-title" class="hb-hero__title">
              The <span class="hb-coral">heartbeat</span> of the <span class="hb-blue">global</span> business <span class="hb-orange">events</span> <span class="hb-green">industry</span>.
            </h1>
            <p class="hb-hero__where">
              <q-icon name="location_on" size="22px" aria-hidden="true" />
              <span><strong>{{ event.venue }}</strong> · {{ event.datesLabel }}<br /><span class="hb-muted">{{ event.smartMonday }}</span></span>
            </p>
            <p class="l27-lead hb-hero__lead">Three days, 96,000 meetings, one show floor. Lock in a negotiated rate a short walk from Mandalay Bay — and spend your energy on the appointments, not the commute.</p>
          </div>
          <div class="hb-collage" aria-label="Scenes from IMEX America">
            <img :src="photos.education" alt="A packed education session at IMEX America" class="hb-collage__a" />
            <img :src="photos.buyers" alt="Hosted buyers meeting exhibitors on the show floor" class="hb-collage__b" />
            <img :src="photos.networking" alt="Attendees networking between sessions" class="hb-collage__c" />
            <span class="hb-collage__dot hb-collage__dot--1" aria-hidden="true" />
            <span class="hb-collage__dot hb-collage__dot--2" aria-hidden="true" />
            <div class="hb-float">
              <span class="hb-float__pulse" aria-hidden="true"><q-icon name="favorite" size="18px" /></span>
              <span><strong>{{ participants }}</strong> participants<br /><small>at the last show</small></span>
            </div>
          </div>
        </div>
      </section>

      <!-- BOOKING BAND: widget overlaps the hero edge, stats follow on pink -->
      <section class="hb-band" aria-label="Find your official hotel">
        <div class="l27-wrap">
          <div class="hb-band__widget">
            <l27-booking-widget layout="bar" :stay="stay" cta-label="Find my hotel" @search="onSearch" />
            <p class="hb-band__fine"><q-icon name="lock" size="15px" aria-hidden="true" /> Official IMEX housing, powered by Presto. No booking fees, free changes until {{ event.blockDeadline }}.</p>
          </div>
          <l27-stats-band tone="color" class="hb-band__stats" />
        </div>
      </section>

      <!-- WHY BOOK -->
      <section id="hb-why" class="hb-sec" aria-labelledby="hb-why-t">
        <div class="l27-wrap">
          <div class="hb-head">
            <p class="l27-eyebrow hb-eyebrow">Why book in the IMEX block</p>
            <h2 id="hb-why-t" class="l27-h2">Better rate. Shorter walk. <span class="hb-coral">Zero</span> guesswork.</h2>
            <p class="l27-lead">Exhibitors, hosted buyers and planners who book inside the official block get rates and protections the travel sites can’t match.</p>
          </div>
          <ul class="hb-perks">
            <li v-for="(p, i) in perks" :key="p.title" class="hb-perk">
              <span class="hb-perk__tile" :class="`hb-tile--${tileColors[i % 4]}`" aria-hidden="true"><q-icon :name="p.icon" size="28px" /></span>
              <h3 class="hb-perk__title">{{ p.title }}</h3>
              <p class="hb-perk__text">{{ p.text }}</p>
            </li>
          </ul>
        </div>
      </section>

      <!-- HOTELS -->
      <section id="hb-hotels" class="hb-sec hb-sec--tint" aria-labelledby="hb-hotels-t">
        <div class="l27-wrap">
          <div class="hb-head hb-head--row">
            <div>
              <p class="l27-eyebrow hb-eyebrow">Official hotels</p>
              <h2 id="hb-hotels-t" class="l27-h2">Six hotels. All on the <span class="hb-blue">south Strip</span>.</h2>
            </div>
            <p class="l27-lead">Stay inside the venue or a free tram ride away. Rates are per room, per night, before tax.</p>
          </div>
          <l27-hotel-map @book="bookHotel" />
        </div>
      </section>

      <!-- COUNTDOWN + BLOCK -->
      <section id="hb-schedule" class="hb-sec" aria-labelledby="hb-when-t">
        <div class="l27-wrap">
          <div class="hb-when">
            <div class="hb-when__left">
              <p class="l27-eyebrow hb-eyebrow">The clock is running</p>
              <h2 id="hb-when-t" class="l27-h2">Smart Monday is {{ event.smartMonday.replace('Smart Monday, ', '') }}. Show floor opens the next morning.</h2>
              <l27-countdown label="Doors open in" tone="light" class="hb-when__cd" />
            </div>
            <div class="hb-when__right">
              <l27-block-meter />
              <ul class="hb-days">
                <li><strong>Mon 27</strong> Smart Monday education &amp; welcome reception</li>
                <li><strong>Tue 28</strong> Show floor opens · Design Matters keynote</li>
                <li><strong>Wed 29</strong> Pre-scheduled buyer meetings · IMEXrun</li>
                <li><strong>Thu 30</strong> Final day on the floor · show closes 3 pm</li>
              </ul>
              <button type="button" class="l27-btn l27-btn--primary" @click="book"><q-icon name="hotel" size="20px" /> Book before the block closes</button>
            </div>
          </div>
        </div>
      </section>

      <!-- PARTNERS -->
      <section class="hb-partners" aria-label="Industry partners">
        <div class="l27-wrap"><l27-logo-strip /></div>
      </section>

      <!-- FAQ -->
      <section id="hb-faq" class="hb-sec" aria-labelledby="hb-faq-t">
        <div class="l27-wrap hb-faq">
          <div class="hb-faq__head">
            <p class="l27-eyebrow hb-eyebrow">Housing FAQ</p>
            <h2 id="hb-faq-t" class="l27-h2">Questions before you book?</h2>
            <p class="l27-lead">Our EventPipe housing team answers 24/7 — and we never cold-call exhibitors.</p>
          </div>
          <l27-faq />
        </div>
      </section>

      <!-- CLOSING CTA -->
      <section class="hb-close" aria-labelledby="hb-close-t">
        <div class="l27-wrap">
          <div class="hb-close__panel">
            <div>
              <h2 id="hb-close-t" class="hb-close__title">Your room is part of the show.</h2>
              <p class="hb-close__text">The best IMEX conversations happen in the lobby, at breakfast and on the walk over. Stay close — book the official block before {{ event.blockDeadline }}.</p>
            </div>
            <div class="hb-close__actions">
              <button type="button" class="l27-btn l27-btn--lg hb-close__book" @click="book"><q-icon name="hotel" size="22px" /> Book your hotel</button>
              <l27-add-to-calendar variant="ghost" class="l27-btn--lg" />
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="hb-foot">
      <div class="l27-wrap hb-foot__grid">
        <div>
          <img :src="brand.logo" alt="IMEX America 2027" class="hb-foot__logo" />
          <p class="hb-foot__addr">{{ event.venue }}<br />{{ event.address }}</p>
        </div>
        <nav aria-label="Footer">
          <button v-for="n in nav" :key="n.id" type="button" class="hb-nav__link" @click="scrollToId(n.id)">{{ n.label }}</button>
          <button type="button" class="hb-nav__link" @click="book">Book your hotel</button>
        </nav>
        <p class="hb-foot__by">Concept by EventPipe · Powered by Presto<br /><span>Not affiliated with IMEX. Rates and room counts are sample data.</span></p>
      </div>
    </footer>

    <l27-booking-modal :key="modalKey" v-model="bookOpen" :stay="stay" :hotel-id="hotelId" :initial-state="modalState" :search="search" />
  </div>
</template>

<style scoped>
.l27-heartbeat { overflow-x: clip; }
/* Workarounds for shared pieces: the compact block meter's note wraps and
   overflows the 72px sticky bar; the fixed concept tag would cover the sticky
   bar's Book button, so on desktop it moves to the bottom-left corner. */
.l27-heartbeat :deep(.l27stk__meter .l27bm2__note) { display: none; }
@media (max-width: 640px) {
  .l27-heartbeat :deep(.l27stk__info) { display: none; }
  .l27-heartbeat :deep(.l27stk__logo) { height: 26px; }
  .l27-heartbeat :deep(.l27stk .l27-btn) { height: 42px; padding: 0 14px; font-size: 0.9375rem; }
}
@media (min-width: 641px) { .l27-heartbeat :deep(.l27ct--fixed) { top: auto; right: auto; bottom: 16px; left: 16px; } }
.hb-coral { color: var(--l27-coral); }
.hb-blue { color: #3F82C0; }
.hb-orange { color: #D96C00; }
.hb-green { color: var(--l27-green); }
.hb-muted { color: var(--l27-muted); }
.hb-eyebrow { color: var(--l27-red); margin-bottom: 14px; }

/* Header */
.hb-util { background: var(--l27-navy); color: #fff; font-size: 0.8125rem; font-weight: 600; }
.hb-util__inner { display: flex; align-items: center; gap: 8px; min-height: 52px; }
.hb-util__inner .q-icon { color: var(--l27-yellow); }
.hb-nav { display: flex; align-items: center; gap: 32px; min-height: 84px; }
.hb-nav__logo { height: 40px; width: auto; }
.hb-nav__links { display: flex; gap: 4px; margin-left: auto; }
.hb-nav__link { border: 0; background: none; padding: 10px 14px; border-radius: 8px; font: 700 0.9375rem var(--l27-font); color: var(--l27-ink); cursor: pointer; }
.hb-nav__link:hover { background: var(--l27-pink); }
.hb-nav__link:focus-visible, .hb-nav__cta:focus-visible { outline: 3px solid var(--l27-blue); outline-offset: 2px; }

/* Hero */
.hb-hero { padding: 40px 0 120px; background: radial-gradient(900px 420px at 92% 10%, #FFF1F4 0%, transparent 70%), #fff; }
.hb-hero__grid { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: 56px; align-items: center; }
.hb-hero__title { font-size: clamp(2.6rem, 5.4vw, 4.6rem); font-weight: 900; line-height: 0.98; letter-spacing: -0.035em; }
.hb-hero__where { display: flex; gap: 10px; margin-top: 28px; font-size: 1.125rem; line-height: 1.45; }
.hb-hero__where .q-icon { color: var(--l27-red); margin-top: 2px; }
.hb-hero__lead { margin-top: 18px; max-width: 520px; }

.hb-collage { position: relative; height: 500px; }
.hb-collage img { position: absolute; object-fit: cover; box-shadow: var(--l27-shadow); }
.hb-collage__a { top: 0; right: 0; width: 64%; height: 62%; border-radius: 160px 24px 24px 24px; }
.hb-collage__b { bottom: 0; left: 0; width: 56%; height: 56%; border-radius: 24px 24px 24px 140px; }
.hb-collage__c { bottom: 6%; right: 6%; width: 38%; height: 36%; border-radius: 999px 999px 24px 24px; border: 6px solid #fff; }
.hb-collage__dot { position: absolute; border-radius: 50%; }
.hb-collage__dot--1 { top: 12%; left: 8%; width: 84px; height: 84px; background: var(--l27-yellow); }
.hb-collage__dot--2 { top: 58%; right: -14px; width: 36px; height: 36px; background: var(--l27-blue); }
.hb-float { position: absolute; top: 34%; left: 4%; display: flex; align-items: center; gap: 12px; padding: 12px 18px 12px 12px; background: #fff; border-radius: 16px; box-shadow: 0 16px 36px -14px rgba(25,29,78,.45); line-height: 1.2; font-size: 0.9375rem; }
.hb-float strong { font-size: 1.25rem; font-weight: 900; }
.hb-float small { color: var(--l27-muted); font-size: 0.75rem; font-weight: 600; }
.hb-float__pulse { width: 40px; height: 40px; border-radius: 12px; background: var(--l27-red); color: #fff; display: grid; place-items: center; animation: hb-beat 1.6s ease-in-out infinite; }
@keyframes hb-beat { 0%, 100% { transform: scale(1); } 12% { transform: scale(1.12); } 24% { transform: scale(1); } 36% { transform: scale(1.08); } }

/* Booking band */
.hb-band { background: linear-gradient(#fff 0 64px, var(--l27-pink) 64px); padding-bottom: 72px; margin-top: -64px; position: relative; }
.hb-band__widget { position: relative; z-index: 2; }
.hb-band__fine { display: flex; align-items: center; gap: 6px; margin-top: 14px; font-size: 0.8125rem; font-weight: 600; color: #6A4A55; }
.hb-band__stats { margin-top: 56px; }

/* Sections */
.hb-sec { padding: 104px 0; }
.hb-sec--tint { background: #F7F5F9; }
.hb-head { max-width: 720px; margin-bottom: 48px; }
.hb-head .l27-lead { margin-top: 16px; }
.hb-head--row { max-width: none; display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 40px; align-items: end; }

.hb-perks { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
.hb-perk { padding: 28px; border: 1.5px solid var(--l27-line); border-radius: 20px; background: #fff; transition: transform .2s ease, box-shadow .2s ease; }
.hb-perk:hover { transform: translateY(-3px); box-shadow: var(--l27-shadow); }
.hb-perk__tile { width: 56px; height: 56px; border-radius: 16px; display: grid; place-items: center; color: #fff; margin-bottom: 20px; }
.hb-tile--coral { background: var(--l27-coral); border-radius: 16px 16px 16px 4px; }
.hb-tile--blue { background: var(--l27-blue); border-radius: 50%; }
.hb-tile--orange { background: var(--l27-orange); border-radius: 4px 16px 16px 16px; }
.hb-tile--green { background: var(--l27-green); }
.hb-perk__title { font-size: 1.25rem; font-weight: 900; line-height: 1.2; }
.hb-perk__text { margin-top: 8px; color: var(--l27-muted); line-height: 1.55; }

.hb-when { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 48px; padding: 48px; border-radius: 28px; background: var(--l27-cream); border: 1.5px solid #F6E6D6; }
.hb-when__cd { margin-top: 28px; }
.hb-when__right { display: flex; flex-direction: column; gap: 24px; justify-content: center; }
.hb-when__right .l27-btn { align-self: flex-start; }
.hb-days { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.hb-days li { display: flex; gap: 14px; font-size: 0.9375rem; color: var(--l27-muted); }
.hb-days strong { flex: none; width: 64px; color: var(--l27-ink); font-weight: 900; }

.hb-partners { padding: 24px 0 8px; }

.hb-faq { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 64px; align-items: start; }
.hb-faq__head .l27-lead { margin-top: 16px; }

.hb-close { padding: 0 0 104px; }
.hb-close__panel { display: grid; grid-template-columns: minmax(0, 1.4fr) auto; gap: 40px; align-items: center; padding: 64px; border-radius: 36px 36px 36px 120px; background: var(--l27-red); color: #fff; position: relative; overflow: hidden; }
.hb-close__panel::after { content: ''; position: absolute; right: -60px; top: -80px; width: 260px; height: 260px; border-radius: 50%; background: rgba(255,255,255,.08); pointer-events: none; }
.hb-close__title { font-size: clamp(2rem, 4.2vw, 3.4rem); font-weight: 900; line-height: 1.02; }
.hb-close__text { margin-top: 16px; font-size: 1.125rem; line-height: 1.55; max-width: 560px; }
.hb-close__actions { display: flex; flex-direction: column; gap: 12px; position: relative; z-index: 1; }
.hb-close__book { background: #fff; color: var(--l27-red-dark); }
.hb-close__actions .l27-btn:focus-visible { outline-color: #fff; }

.hb-foot { border-top: 1px solid var(--l27-line); padding: 48px 0; }
.hb-foot__grid { display: grid; grid-template-columns: 1fr auto 1fr; gap: 32px; align-items: start; }
.hb-foot__grid nav { display: flex; flex-wrap: wrap; gap: 4px; }
.hb-foot__logo { height: 36px; width: auto; }
.hb-foot__addr { margin-top: 14px; font-size: 0.875rem; color: var(--l27-muted); line-height: 1.5; }
.hb-foot__by { text-align: right; font-size: 0.875rem; font-weight: 700; line-height: 1.6; }
.hb-foot__by span { font-weight: 500; color: var(--l27-muted); font-size: 0.8125rem; }

@media (max-width: 1024px) {
  .hb-nav__links { display: none; }
  .hb-nav__cta { margin-left: auto; }
  .hb-hero__grid, .hb-head--row, .hb-when, .hb-faq, .hb-close__panel { grid-template-columns: 1fr; }
  .hb-perks { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .hb-collage { height: 440px; max-width: 620px; }
  .hb-faq { gap: 32px; }
  .hb-close__actions { flex-direction: row; flex-wrap: wrap; }
  .hb-foot__grid { grid-template-columns: 1fr; }
  .hb-foot__by { text-align: left; }
}
@media (max-width: 640px) {
  .hb-util__inner { min-height: 40px; font-size: 0.75rem; }
  .hb-nav { min-height: 68px; gap: 12px; }
  .hb-nav__logo { height: 30px; }
  .hb-nav__cta { height: 42px; padding: 0 14px; font-size: 0.9375rem; }
  .hb-hero { padding: 24px 0 96px; }
  .hb-hero__grid { gap: 32px; }
  .hb-collage { height: 340px; }
  .hb-float { top: auto; bottom: 40%; padding: 10px 14px 10px 10px; }
  .hb-collage__dot--1 { width: 56px; height: 56px; }
  .hb-collage__dot--2 { right: 0; }
  .hb-sec { padding: 72px 0; }
  .hb-perks { grid-template-columns: 1fr; }
  .hb-perk { padding: 20px; display: grid; grid-template-columns: 48px minmax(0, 1fr); column-gap: 16px; }
  .hb-perk__tile { width: 48px; height: 48px; margin-bottom: 0; grid-row: span 2; }
  .hb-perk__title { font-size: 1.0625rem; }
  .hb-perk__text { margin-top: 4px; font-size: 0.9375rem; }
  .hb-when { padding: 28px 20px; gap: 32px; border-radius: 20px; }
  .hb-when__right .l27-btn { align-self: stretch; white-space: normal; height: auto; min-height: 48px; }
  .hb-close { padding-bottom: 80px; }
  .hb-close__panel { padding: 40px 24px; border-radius: 24px 24px 24px 64px; }
  .hb-close__actions { flex-direction: column; }
  .hb-foot { padding-bottom: 80px; }
}
</style>
