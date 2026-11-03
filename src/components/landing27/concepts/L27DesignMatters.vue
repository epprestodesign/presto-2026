<script setup>
// CONCEPT 4 — "Design Matters". A bold geometric / Bauhaus brand play on IMEX's
// 2026–27 talking point: CSS-drawn pattern tiles (circles, half-circles, plus
// signs, stripes, quarter-arcs) in the IMEX colors on ink and cream. Booking
// pattern: "SCHEDULE → YOUR STAY" — the stay planner is the hero interaction,
// and "Book N nights" opens booking in a RIGHT SIDE PANEL (DsSidePanel + the
// stacked corporate widget). Searching there hands off to the page-owned
// L27BookingModal. Concept only; not affiliated with IMEX.
import { ref } from 'vue'
import '../l27.css'
import { brand, photos, event, hotels, stayLabel, defaultStay, nightsBetween } from '../imex.js'
import { scrollToId } from '../L27Extras.js'
import DsSidePanel from '../../DsSidePanel.vue'
import L27BookingWidget from '../L27BookingWidget.vue'
import L27BookingModal from '../L27BookingModal.vue'
import L27StayPlanner from '../L27StayPlanner.vue'
import L27StatsBand from '../L27StatsBand.vue'
import L27LogoStrip from '../L27LogoStrip.vue'
import L27ConceptTag from '../L27ConceptTag.vue'

const props = defineProps({
  initialModal: { type: Boolean, default: false },
  initialModalState: { type: String, default: 'form' },
  initialPanel: { type: Boolean, default: false },
})

const stay = ref({ ...defaultStay })
const bookOpen = ref(props.initialModal)
const modalState = ref(props.initialModalState)
const hotelId = ref('')
const modalKey = ref(0)
const lastSearch = ref(null)
const panelOpen = ref(props.initialPanel)

function openModal (state, id = '') {
  modalState.value = state
  hotelId.value = id
  modalKey.value++
  bookOpen.value = true
}
// Planner / "Plan your stay" → side panel with the chosen stay.
function openPanel (s) {
  if (s) stay.value = { ...s }
  panelOpen.value = true
}
// Side-panel search → close the panel, modal runs the search → results.
function onPanelSearch (payload) {
  if (payload?.stay) stay.value = { ...payload.stay }
  lastSearch.value = payload
  panelOpen.value = false
  openModal('searching')
}
const bookHotel = (id) => { lastSearch.value = null; openModal('form', id) }

const nav = [
  { id: 'dm-days', label: 'Your stay' },
  { id: 'dm-ways', label: 'Ways in' },
  { id: 'dm-hotels', label: 'Hotels' },
  { id: 'dm-design', label: 'Design Matters' },
]
const heroTiles = ['sun', 'half', 'plus', 'quarter', 'stripes', 'rings', 'split', 'arch', 'dots', 'leaf', 'halves', 'checker']
const ways = [
  { tiles: ['half', 'dots', 'quarter'], when: 'Mon 27', title: 'Smart Monday', text: 'A full day of MPI-powered education and the welcome reception. Arrive Sunday so you walk in fresh.', stay: { arrive: '2027-09-26', depart: '2027-10-01' } },
  { tiles: ['plus', 'sun', 'stripes'], when: 'Tue 28 – Thu 30', title: 'The trade show', text: '3,800 exhibitors, 96,000 pre-scheduled meetings and the Design Matters keynote on opening morning.', stay: { arrive: '2027-09-27', depart: '2027-09-30' } },
  { tiles: ['rings', 'arch', 'split'], when: 'After 6 pm', title: 'The evenings', text: 'Receptions, IMEXrun and the dinners where deals close. Stay through Thursday night and fly home rested.', stay: { arrive: '2027-09-27', depart: '2027-10-01' } },
]
const capTiles = ['sun', 'half', 'plus', 'quarter', 'stripes', 'rings', 'split', 'arch', 'dots', 'leaf', 'halves', 'checker']
const capFor = (i) => Array.from({ length: 10 }, (_, k) => capTiles[(i * 3 + k) % capTiles.length])
const nightsLabel = (s) => { const n = nightsBetween(s.arrive, s.depart); return `${n} night${n === 1 ? '' : 's'}` }
</script>

<template>
  <div class="l27 l27-design">
    <l27-concept-tag label="Design Matters" />

    <header class="dm-head">
      <div class="l27-wrap dm-nav">
        <img :src="brand.logoDark" alt="IMEX America 2027" class="dm-nav__logo" />
        <nav class="dm-nav__links" aria-label="Page sections">
          <button v-for="n in nav" :key="n.id" type="button" class="dm-nav__link" @click="scrollToId(n.id)">{{ n.label }}</button>
        </nav>
        <button type="button" class="l27-btn l27-btn--pill dm-btn-blue dm-nav__cta" @click="openPanel()">
          <q-icon name="event_available" size="20px" /> <span>Plan your stay</span>
        </button>
      </div>
    </header>

    <main>
      <!-- HERO -->
      <section class="dm-hero" aria-labelledby="dm-title">
        <div class="l27-wrap">
          <div class="dm-hero__grid">
            <div>
              <p class="l27-eyebrow dm-hero__eyebrow"><span class="dm-dot" aria-hidden="true" />IMEX America · Sept 28–30, 2027</p>
              <h1 id="dm-title" class="dm-hero__title">Design your <span class="dm-yellow">stay</span> like you design your <span class="dm-coral">events</span>.</h1>
            </div>
            <div class="dm-hero__side">
              <p class="dm-hero__lead">You plan run-of-show down to the minute. Give your own three days in Vegas the same care — pick the sessions you’ll be at, and we’ll line up the nights in the official block at {{ event.venue }}.</p>
              <div class="dm-hero__actions">
                <button type="button" class="l27-btn l27-btn--lg l27-btn--pill dm-btn-blue" @click="openPanel()"><q-icon name="event_available" size="22px" /> Plan your stay</button>
                <button type="button" class="l27-btn l27-btn--lg l27-btn--pill l27-btn--ghost dm-ghost" @click="scrollToId('dm-days')">Pick your days <q-icon name="south" size="20px" /></button>
              </div>
            </div>
          </div>
          <div class="dm-tiles" aria-hidden="true">
            <span v-for="(t, i) in heroTiles" :key="t" class="dm-t" :class="`dm-t--${t}`" :style="{ '--i': i }"><i /><i /></span>
          </div>
          <l27-stats-band tone="dark" class="dm-hero__stats" />
        </div>
      </section>

      <!-- 01 · PICK YOUR DAYS -->
      <section id="dm-days" class="dm-sec dm-sec--cream" aria-labelledby="dm-days-t">
        <span class="dm-deco dm-deco--a" aria-hidden="true" />
        <span class="dm-deco dm-deco--b" aria-hidden="true" />
        <div class="l27-wrap">
          <div class="dm-sechead">
            <span class="dm-num dm-num--red" aria-hidden="true">01</span>
            <div>
              <h2 id="dm-days-t" class="l27-h2">Pick your days. <span class="dm-under">We’ll do the nights.</span></h2>
              <p class="l27-lead">Tick the days you’ll be at IMEX. We check you in the night before your first day and out the morning after your last — then book it in one side panel without leaving the page.</p>
            </div>
          </div>
          <l27-stay-planner class="dm-planner" @book="openPanel" />
        </div>
      </section>

      <!-- 02 · THREE WAYS IN -->
      <section id="dm-ways" class="dm-sec" aria-labelledby="dm-ways-t">
        <div class="l27-wrap">
          <div class="dm-sechead">
            <span class="dm-num dm-num--blue" aria-hidden="true">02</span>
            <div>
              <h2 id="dm-ways-t" class="l27-h2">One show, three ways in.</h2>
              <p class="l27-lead">However you do IMEX, there’s a stay shaped for it. Start from one of these and adjust in the panel.</p>
            </div>
          </div>
          <ul class="dm-ways">
            <li v-for="w in ways" :key="w.title" class="dm-way">
              <div class="dm-way__cap" aria-hidden="true">
                <span v-for="t in w.tiles" :key="t" class="dm-t" :class="`dm-t--${t}`"><i /><i /></span>
              </div>
              <div class="dm-way__body">
                <p class="dm-way__when">{{ w.when }}</p>
                <h3 class="dm-way__title">{{ w.title }}</h3>
                <p class="dm-way__text">{{ w.text }}</p>
                <div class="dm-way__foot">
                  <span class="dm-way__stay"><q-icon name="nights_stay" size="18px" aria-hidden="true" />{{ stayLabel(w.stay) }}</span>
                  <button type="button" class="dm-arrow" :aria-label="`Plan a ${nightsLabel(w.stay)} stay for ${w.title}`" @click="openPanel(w.stay)"><q-icon name="arrow_forward" size="22px" /></button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <!-- 03 · HOTELS -->
      <section id="dm-hotels" class="dm-sec dm-sec--cream" aria-labelledby="dm-hotels-t">
        <div class="l27-wrap">
          <div class="dm-sechead">
            <span class="dm-num dm-num--green" aria-hidden="true">03</span>
            <div>
              <h2 id="dm-hotels-t" class="l27-h2">Stay close to the stage.</h2>
              <p class="l27-lead">Six official hotels, all a short walk or free tram ride from the show floor. Block rates are per room, per night, before tax.</p>
            </div>
          </div>
          <ul class="dm-hotels">
            <li v-for="(h, i) in hotels" :key="h.id" class="dm-hotel">
              <div class="dm-hotel__cap" aria-hidden="true">
                <span v-for="(t, k) in capFor(i)" :key="k" class="dm-t" :class="`dm-t--${t}`"><i /><i /></span>
              </div>
              <div class="dm-hotel__img">
                <img :src="h.image" :alt="h.name" />
                <span class="dm-hotel__walk"><q-icon :name="h.walk === 0 ? 'location_on' : 'directions_walk'" size="15px" aria-hidden="true" />{{ h.walkLabel }}</span>
              </div>
              <div class="dm-hotel__body">
                <h3 class="dm-hotel__name">{{ h.name }}</h3>
                <p class="dm-hotel__perks">{{ h.perks.join(' · ') }}</p>
                <div class="dm-hotel__foot">
                  <div>
                    <span class="dm-hotel__was">${{ h.was }}</span>
                    <span class="dm-hotel__rate">${{ h.rate }}</span><span class="dm-hotel__per">/night</span>
                    <p class="dm-hotel__left" :class="{ 'is-low': h.left < 20 }">{{ h.left }} rooms left in the block</p>
                  </div>
                  <button type="button" class="l27-btn l27-btn--dark l27-btn--pill" :aria-label="`Book ${h.name}`" @click="bookHotel(h.id)">Book</button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <!-- 04 · DESIGN MATTERS -->
      <section id="dm-design" class="dm-dm" aria-labelledby="dm-dm-t">
        <div class="l27-wrap dm-dm__grid">
          <img :src="photos.designMatters" alt="IMEX talking point artwork: Design Matters" class="dm-dm__img" />
          <div class="dm-dm__copy">
            <span class="dm-num dm-num--yellow" aria-hidden="true">04</span>
            <p class="l27-eyebrow dm-dm__eyebrow">IMEX talking point</p>
            <h2 id="dm-dm-t" class="dm-dm__title">Design matters — right down to where you sleep.</h2>
            <p class="dm-dm__text">This year IMEX asks how intentional design shapes every attendee moment. The first one happens long before the keynote: the walk from your room to the show floor. Book inside the official block and that walk is minutes, not a cab queue.</p>
            <button type="button" class="l27-btn l27-btn--lg l27-btn--pill l27-btn--yellow" @click="openPanel()"><q-icon name="event_available" size="22px" /> Plan your stay</button>
          </div>
        </div>
      </section>

      <!-- PARTNERS -->
      <section class="dm-partners" aria-label="Industry partners">
        <div class="l27-wrap"><l27-logo-strip /></div>
      </section>

      <!-- CLOSING CTA -->
      <section class="dm-close" aria-labelledby="dm-close-t">
        <span class="dm-close__shape dm-close__shape--1" aria-hidden="true" />
        <span class="dm-close__shape dm-close__shape--2" aria-hidden="true" />
        <span class="dm-close__shape dm-close__shape--3" aria-hidden="true" />
        <div class="l27-wrap dm-close__inner">
          <h2 id="dm-close-t" class="dm-close__title">See you in Vegas this September.</h2>
          <p class="dm-close__text">Official IMEX block rates are held until {{ event.blockDeadline }} — or until the rooms run out.</p>
          <button type="button" class="l27-btn l27-btn--lg l27-btn--pill l27-btn--dark" @click="openPanel()"><q-icon name="event_available" size="22px" /> Plan your stay</button>
        </div>
      </section>
    </main>

    <footer class="dm-foot">
      <div class="l27-wrap dm-foot__grid">
        <div>
          <img :src="brand.logoDark" alt="IMEX America 2027" class="dm-foot__logo" />
          <p class="dm-foot__addr">{{ event.venue }}<br />{{ event.address }}</p>
        </div>
        <nav aria-label="Footer">
          <button v-for="n in nav" :key="n.id" type="button" class="dm-nav__link" @click="scrollToId(n.id)">{{ n.label }}</button>
        </nav>
        <p class="dm-foot__by">Concept by EventPipe · Powered by Presto<br /><span>Not affiliated with IMEX. Rates and room counts are sample data.</span></p>
      </div>
    </footer>

    <!-- SIDE PANEL BOOKING (teleported — re-wrap in .l27 for the brand vars) -->
    <ds-side-panel v-model="panelOpen" side="right" width="480px" title="Plan your stay">
      <div class="l27 dm-panel">
        <div class="dm-panel__tiles" aria-hidden="true">
          <span v-for="t in ['sun', 'half', 'plus', 'quarter', 'rings', 'split', 'dots', 'leaf']" :key="t" class="dm-t" :class="`dm-t--${t}`"><i /><i /></span>
        </div>
        <div class="dm-panel__stay">
          <span class="dm-panel__lbl">From your schedule</span>
          <strong class="dm-panel__val">{{ stayLabel(stay) }}</strong>
          <span class="dm-panel__hint">Fine-tune the nights below — block rates apply to every night from Sat 25 to Sat 2.</span>
        </div>
        <l27-booking-widget layout="stacked" :stay="stay" cta-label="Search official hotels" @search="onPanelSearch" />
        <p class="dm-panel__fine"><q-icon name="verified_user" size="16px" aria-hidden="true" /> Official IMEX housing, powered by Presto. Free changes until {{ event.blockDeadline }}.</p>
      </div>
    </ds-side-panel>

    <l27-booking-modal :key="modalKey" v-model="bookOpen" :stay="stay" :hotel-id="hotelId" :initial-state="modalState" :search="lastSearch" />
  </div>
</template>

<style scoped>
/* .dm-panel is teleported to <body> by DsSidePanel, so it carries the vars too. */
.l27-design, .dm-panel { --dm-ink: #1D1D1B; --dm-cream: #F4EDE1; --dm-electric: #0000FE; }
.l27-design { overflow-x: clip; background: var(--dm-ink); }
.l27-design main > section { background: #fff; }
.dm-yellow { color: var(--l27-yellow); }
.dm-coral { color: var(--l27-coral); }
.dm-btn-blue { background: var(--l27-blue); color: var(--dm-ink); }
.dm-btn-blue:hover { background: #6BA6DA; }
.dm-ghost { color: #fff; }

/* Nav */
.dm-head { background: var(--dm-ink); color: #fff; border-bottom: 1px solid rgba(255,255,255,.1); }
.dm-nav { display: flex; align-items: center; gap: 32px; min-height: 84px; }
.dm-nav__logo { height: 38px; width: auto; }
.dm-nav__links { display: flex; gap: 4px; margin-left: auto; }
.dm-nav__link { border: 0; background: none; padding: 10px 14px; border-radius: 999px; font: 700 0.9375rem var(--l27-font); color: inherit; cursor: pointer; }
.dm-nav__link:hover { background: rgba(255,255,255,.1); }
.l27-design button:focus-visible { outline: 3px solid var(--l27-yellow); outline-offset: 2px; }

/* Hero */
.l27-design main > .dm-hero { background: var(--dm-ink); color: #fff; padding: 72px 0 88px; }
.dm-hero__grid { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); gap: 56px; align-items: end; }
.dm-hero__eyebrow { display: flex; align-items: center; gap: 10px; color: rgba(255,255,255,.8); margin-bottom: 22px; }
.dm-dot { width: 12px; height: 12px; border-radius: 50%; background: var(--l27-red); }
.dm-hero__title { font-size: clamp(2.75rem, 6.4vw, 5.6rem); font-weight: 900; line-height: 0.94; letter-spacing: -0.045em; }
.dm-hero__lead { font-size: 1.125rem; line-height: 1.6; color: rgba(255,255,255,.78); }
.dm-hero__actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
.dm-hero__stats { margin-top: 64px; }

/* Pattern tiles — every shape drawn in CSS */
.dm-tiles { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); margin-top: 64px; }
.dm-tiles .dm-t { animation: dm-pop .4s cubic-bezier(.2,.8,.3,1.2) both; animation-delay: calc(var(--i) * 35ms); }
.dm-tiles .dm-t i { transition: transform .5s cubic-bezier(.2,.8,.3,1); }
.dm-tiles .dm-t:hover i { transform: rotate(90deg); }
@keyframes dm-pop { from { opacity: 0; transform: scale(.6); } }
.dm-t { position: relative; display: block; aspect-ratio: 1; overflow: hidden; background: var(--dm-cream); }
.dm-t i { position: absolute; display: block; }
.dm-t--sun { background: var(--l27-yellow); }
.dm-t--sun i:first-child { inset: 18%; border-radius: 50%; background: var(--l27-red); }
.dm-t--half { background: var(--l27-blue); }
.dm-t--half i:first-child { left: 0; right: 0; bottom: 0; height: 50%; border-radius: 999px 999px 0 0; background: var(--l27-coral); }
.dm-t--half i:last-child { left: 38%; right: 38%; top: 16%; aspect-ratio: 1; border-radius: 50%; background: var(--dm-cream); }
.dm-t--plus { background: linear-gradient(var(--dm-ink), var(--dm-ink)) center / 20% 64% no-repeat, linear-gradient(var(--dm-ink), var(--dm-ink)) center / 64% 20% no-repeat, var(--l27-coral); }
.dm-t--quarter { background: var(--l27-green); }
.dm-t--quarter i:first-child { inset: 0; border-top-right-radius: 100%; background: var(--l27-orange); }
.dm-t--quarter i:last-child { top: 10%; right: 10%; width: 22%; height: 22%; border-radius: 50%; background: var(--l27-yellow); }
.dm-t--stripes { background: repeating-linear-gradient(90deg, var(--l27-orange) 0 12.5%, var(--dm-cream) 12.5% 25%); }
.dm-t--stripes i:first-child { right: 0; top: 0; bottom: 0; width: 50%; border-radius: 999px 0 0 999px; background: var(--dm-ink); }
.dm-t--rings { background: radial-gradient(circle, var(--l27-blue) 0 14%, var(--dm-cream) 14% 28%, var(--l27-blue) 28% 42%, var(--dm-cream) 42% 56%, var(--l27-blue) 56% 70%, var(--dm-cream) 70%); }
.dm-t--split { background: linear-gradient(135deg, var(--l27-red) 50%, var(--l27-yellow) 50%); }
.dm-t--split i:first-child { inset: 30%; border-radius: 50%; background: var(--dm-cream); }
.dm-t--arch { background: var(--l27-red); }
.dm-t--arch i:first-child { left: 14%; right: 14%; bottom: 0; height: 80%; border-radius: 999px 999px 0 0; background: var(--dm-cream); }
.dm-t--arch i:last-child { left: 34%; right: 34%; bottom: 0; height: 50%; border-radius: 999px 999px 0 0; background: var(--l27-red); }
.dm-t--dots { background: radial-gradient(circle, var(--dm-ink) 0 26%, transparent 28%) 0 0 / 25% 25%, var(--l27-yellow); }
.dm-t--leaf { background: var(--l27-blue); }
.dm-t--leaf i:first-child { inset: 12%; border-radius: 0 100% 0 100%; background: var(--l27-yellow); }
.dm-t--halves { background: var(--dm-cream); }
.dm-t--halves i:first-child { left: 0; right: 0; top: 0; height: 50%; border-radius: 0 0 999px 999px; background: var(--l27-green); }
.dm-t--halves i:last-child { left: 0; right: 0; bottom: 0; height: 50%; border-radius: 999px 999px 0 0; background: var(--l27-coral); }
.dm-t--checker { background: conic-gradient(var(--dm-ink) 25%, var(--l27-orange) 0 50%, var(--dm-ink) 0 75%, var(--l27-orange) 0) 0 0 / 50% 50%; }
.dm-t--checker i:first-child { inset: 25%; border-radius: 50%; background: var(--l27-pink); }

/* Sections */
.dm-sec { position: relative; padding: 112px 0; overflow: hidden; }
.l27-design main > .dm-sec--cream { background: var(--dm-cream); }
.dm-sechead { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 28px; align-items: start; max-width: 860px; margin-bottom: 48px; }
.dm-sechead .l27-lead { margin-top: 14px; max-width: 640px; }
.dm-num { display: grid; place-items: center; width: 64px; height: 64px; border-radius: 50%; font-size: 1.25rem; font-weight: 900; letter-spacing: -0.02em; color: #fff; }
.dm-num--red { background: var(--l27-red); }
.dm-num--blue { background: var(--l27-blue); color: var(--dm-ink); border-radius: 0; }
.dm-num--green { background: var(--l27-green); border-radius: 32px 32px 0 0; }
.dm-num--yellow { background: var(--l27-yellow); color: var(--dm-ink); border-radius: 0 32px 32px 32px; }
.dm-under { background: linear-gradient(transparent 68%, var(--l27-yellow) 68% 92%, transparent 92%); }
.dm-deco { position: absolute; pointer-events: none; }
.dm-deco--a { top: -90px; right: -90px; width: 260px; height: 260px; border-radius: 50%; border: 36px solid var(--l27-coral); opacity: .9; }
.dm-deco--b { top: 120px; right: 150px; width: 72px; height: 72px; background: linear-gradient(var(--l27-blue), var(--l27-blue)) center / 28% 100% no-repeat, linear-gradient(var(--l27-blue), var(--l27-blue)) center / 100% 28% no-repeat; }
.dm-planner { position: relative; }
.dm-planner :deep(.l27sp__day) { border-radius: 0; border-width: 2.5px; }
.dm-planner :deep(.l27sp__day.is-on) { border-color: var(--dm-ink); background: #fff; box-shadow: 8px 8px 0 var(--l27-red); }
.dm-planner :deep(.l27sp__day.is-on .l27sp__check) { background: var(--dm-ink); border-color: var(--dm-ink); border-radius: 50%; }
.dm-planner :deep(.l27sp__result) { border-radius: 0; margin-top: 28px; padding: 22px 24px; }
.dm-planner :deep(.l27sp__result .l27-btn) { border-radius: 999px; background: var(--l27-blue); color: var(--dm-ink); }

/* Three ways in */
.dm-ways { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
.dm-way { display: flex; flex-direction: column; border: 2.5px solid var(--dm-ink); background: #fff; transition: transform .2s ease, box-shadow .2s ease; }
.dm-way:hover { transform: translate(-4px, -4px); box-shadow: 8px 8px 0 var(--dm-ink); }
.dm-way__cap { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-bottom: 2.5px solid var(--dm-ink); }
.dm-way__body { display: flex; flex-direction: column; flex: 1; padding: 24px 24px 20px; }
.dm-way__when { font-size: 0.8125rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--l27-red); }
.dm-way__title { font-size: 1.75rem; font-weight: 900; margin-top: 6px; }
.dm-way__text { margin-top: 10px; color: var(--l27-muted); line-height: 1.55; flex: 1; }
.dm-way__foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 22px; padding-top: 16px; border-top: 1.5px dashed var(--l27-line); }
.dm-way__stay { display: flex; align-items: center; gap: 6px; font-weight: 800; font-size: 0.9375rem; }
.dm-arrow { flex: none; width: 52px; height: 52px; border: 0; border-radius: 50%; background: var(--dm-ink); color: #fff; display: grid; place-items: center; cursor: pointer; transition: background .15s, transform .15s; }
.dm-arrow:hover { background: var(--l27-red); transform: rotate(-45deg); }

/* Hotels */
.dm-hotels { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
.dm-hotel { display: flex; flex-direction: column; background: #fff; border: 2.5px solid var(--dm-ink); overflow: hidden; }
.dm-hotel__cap { display: flex; height: 36px; border-bottom: 2.5px solid var(--dm-ink); }
.dm-hotel__cap .dm-t { flex: none; width: 36px; height: 36px; }
.dm-hotel__img { position: relative; flex: none; aspect-ratio: 16 / 10; min-height: 0; overflow: hidden; }
.dm-hotel__img img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
.dm-hotel__walk { position: absolute; left: 12px; bottom: 12px; display: inline-flex; align-items: center; gap: 4px; padding: 6px 10px; border-radius: 999px; background: var(--l27-yellow); color: var(--dm-ink); font-size: 0.8125rem; font-weight: 800; }
.dm-hotel__body { display: flex; flex-direction: column; flex: 1; padding: 18px 20px 20px; }
.dm-hotel__name { font-size: 1.25rem; font-weight: 900; }
.dm-hotel__perks { margin-top: 4px; font-size: 0.875rem; color: var(--l27-muted); }
.dm-hotel__foot { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; margin-top: auto; padding-top: 18px; }
.dm-hotel__was { font-size: 0.9375rem; color: var(--l27-muted); text-decoration: line-through; margin-right: 6px; }
.dm-hotel__rate { font-size: 1.75rem; font-weight: 900; letter-spacing: -0.02em; }
.dm-hotel__per { font-size: 0.875rem; color: var(--l27-muted); font-weight: 600; }
.dm-hotel__left { margin-top: 2px; font-size: 0.8125rem; font-weight: 700; color: var(--l27-green); }
.dm-hotel__left.is-low { color: var(--l27-red); }

/* Design Matters band */
.l27-design main > .dm-dm { background: var(--dm-electric); color: #fff; padding: 96px 0; }
.dm-dm__grid { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); gap: 56px; align-items: center; }
.dm-dm__img { width: 100%; height: auto; display: block; clip-path: inset(0 0 1.2% 0); }
.dm-dm__eyebrow { color: #7FDBFF; margin: 22px 0 12px; }
.dm-dm__title { font-size: clamp(2rem, 3.8vw, 3.1rem); font-weight: 900; line-height: 1.02; }
.dm-dm__text { margin: 18px 0 30px; font-size: 1.125rem; line-height: 1.6; color: rgba(255,255,255,.88); }

.l27-design main > .dm-partners { padding: 40px 0 32px; }

/* Closing CTA */
.l27-design main > .dm-close { position: relative; overflow: hidden; background: var(--l27-blue); color: var(--dm-ink); padding: 120px 0; }
.dm-close__inner { position: relative; z-index: 1; text-align: center; display: flex; flex-direction: column; align-items: center; }
.dm-close__title { font-size: clamp(2.6rem, 6.6vw, 5.8rem); font-weight: 900; line-height: 0.95; letter-spacing: -0.045em; max-width: 960px; }
.dm-close__text { margin: 20px 0 32px; font-size: 1.1875rem; font-weight: 600; max-width: 560px; }
.dm-close__shape { position: absolute; pointer-events: none; }
.dm-close__shape--1 { left: -80px; bottom: -80px; width: 280px; height: 280px; border-radius: 50%; background: var(--l27-yellow); }
.dm-close__shape--2 { right: 6%; top: -60px; width: 220px; height: 110px; border-radius: 0 0 999px 999px; background: var(--l27-coral); }
.dm-close__shape--3 { right: -40px; bottom: 40px; width: 160px; height: 160px; border-top-left-radius: 100%; background: var(--dm-ink); }

/* Footer */
.dm-foot { background: var(--dm-ink); color: #fff; padding: 56px 0; }
.dm-foot__grid { display: grid; grid-template-columns: 1fr auto 1fr; gap: 32px; align-items: start; }
.dm-foot__grid nav { display: flex; flex-wrap: wrap; gap: 4px; }
.dm-foot__logo { height: 34px; width: auto; }
.dm-foot__addr { margin-top: 14px; font-size: 0.875rem; color: rgba(255,255,255,.7); line-height: 1.5; }
.dm-foot__by { text-align: right; font-size: 0.875rem; font-weight: 700; line-height: 1.6; }
.dm-foot__by span { font-weight: 500; color: rgba(255,255,255,.65); font-size: 0.8125rem; }

/* Side panel content */
.dm-panel { background: transparent; }
.dm-panel__tiles { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); margin-bottom: 20px; }
.dm-panel__stay { display: flex; flex-direction: column; gap: 4px; padding: 18px 20px; margin-bottom: 22px; background: var(--dm-ink); color: #fff; box-shadow: 6px 6px 0 var(--l27-blue); }
.dm-panel__lbl { font-size: 0.75rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--l27-yellow); }
.dm-panel__val { font-size: 1.375rem; font-weight: 900; }
.dm-panel__hint { font-size: 0.8125rem; color: rgba(255,255,255,.72); line-height: 1.4; }
.dm-panel__fine { display: flex; align-items: center; gap: 6px; margin-top: 16px; font-size: 0.8125rem; font-weight: 600; color: var(--l27-muted); }

@media (max-width: 1024px) {
  .dm-nav__links { display: none; }
  .dm-nav__cta { margin-left: auto; }
  .dm-hero__grid, .dm-dm__grid { grid-template-columns: 1fr; gap: 32px; }
  .dm-ways, .dm-hotels { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dm-foot__grid { grid-template-columns: 1fr; }
  .dm-foot__by { text-align: left; }
}
@media (max-width: 640px) {
  .dm-nav { min-height: 68px; gap: 12px; }
  .dm-nav__logo { height: 30px; }
  .dm-nav__cta { height: 42px; padding: 0 16px; font-size: 0.9375rem; }
  .l27-design main > .dm-hero { padding: 44px 0 64px; }
  .dm-hero__actions .l27-btn { flex: 1 1 100%; }
  .dm-tiles { grid-template-columns: repeat(4, minmax(0, 1fr)); margin-top: 44px; }
  .dm-hero__stats { margin-top: 44px; }
  .dm-sec { padding: 72px 0; }
  .dm-sechead { grid-template-columns: 1fr; gap: 18px; }
  .dm-num { width: 52px; height: 52px; font-size: 1.0625rem; }
  .dm-deco--a { width: 160px; height: 160px; border-width: 24px; top: -70px; right: -70px; }
  .dm-deco--b { display: none; }
  .dm-ways, .dm-hotels { grid-template-columns: 1fr; }
  .dm-way__title { font-size: 1.5rem; }
  .l27-design main > .dm-dm { padding: 64px 0; }
  .l27-design main > .dm-close { padding: 88px 0 104px; }
  .dm-close__shape--1 { width: 160px; height: 160px; left: -60px; bottom: -60px; }
  .dm-close__shape--2 { width: 140px; height: 70px; }
  .dm-close__shape--3 { width: 96px; height: 96px; bottom: 20px; }
  .dm-close__inner .l27-btn { width: 100%; }
  .dm-foot { padding-bottom: 80px; }
}
</style>
