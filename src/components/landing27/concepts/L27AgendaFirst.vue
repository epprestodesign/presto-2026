<script setup>
// Concept 5 · Agenda First — an editorial conference site (99U-style: bold red
// abstract hero art, yellow band, speakers, schedule, venue, FAQ). Booking is
// woven into the agenda: every day has "Book for this day", which opens the
// booking modal with that day's stay pre-filled (in the night before, out the
// morning after). Plus a sticky bottom bar and a widget bar in the venue.
import { ref, onBeforeUnmount } from 'vue'
import '../l27.css'
import { brand, photos, event, schedule, speakers, stayDays, defaultStay, block, stayLabel } from '../imex.js'
import { scrollToId } from '../L27Extras.js'
import L27ConceptTag from '../L27ConceptTag.vue'
import L27BookingModal from '../L27BookingModal.vue'
import L27BookingWidget from '../L27BookingWidget.vue'
import L27HotelMap from '../L27HotelMap.vue'
import L27StickyBar from '../L27StickyBar.vue'
import L27Faq from '../L27Faq.vue'
import L27AddToCalendar from '../L27AddToCalendar.vue'

const props = defineProps({
  initialModal: { type: Boolean, default: false },
  initialModalState: { type: String, default: 'form' },
})

// ── one booking modal for the whole page ──
const bookOpen = ref(props.initialModal)
const modalState = ref(props.initialModalState)
const modalKey = ref(0)
const search = ref(null) // the widget's search payload, echoed in the modal
const hotelId = ref('')
const stay = ref({ ...defaultStay })
function openBooking (state = 'form', opts = {}) {
  modalState.value = state
  hotelId.value = opts.hotelId || ''
  if (opts.stay) stay.value = { ...opts.stay }
  modalKey.value++
  bookOpen.value = true
}
// Widget search → modal opens on "Finding rooms…", then results for that search.
const onWidgetSearch = (p) => { search.value = p; openBooking('searching', { stay: p.stay }) }
const onHotelBook = (id) => openBooking('form', { hotelId: id })

// "Book for this day": check in the night before, out the morning after.
function stayFor (iso) {
  const i = stayDays.findIndex((d) => d.iso === iso)
  return { arrive: stayDays[Math.max(0, i - 1)].iso, depart: stayDays[Math.min(stayDays.length - 1, i + 1)].iso }
}
const fullStay = { arrive: '2027-09-26', depart: '2027-10-01' }

const links = [
  { id: 'af-agenda', label: 'Agenda' },
  { id: 'af-speakers', label: 'Speakers' },
  { id: 'af-venue', label: 'Venue & hotels' },
  { id: 'af-faq', label: 'FAQ' },
]
const expect = [
  { icon: 'handshake', title: 'Meet 6,000+ buyers', text: 'Pre-scheduled appointments with hosted buyers and planners from 70+ countries — your diary fills before you land.' },
  { icon: 'school', title: 'Learn in 400+ sessions', text: 'Smart Monday, Inspiration Hub talks and roundtables on AI, sustainability and the future of the meeting room.' },
  { icon: 'nightlife', title: 'Connect at evening events', text: 'Welcome receptions, IMEXrun at sunrise and after-dark parties across the Strip — all a short walk from your room.' },
]
const tileColors = ['coral', 'blue', 'orange', 'green']
const initials = (n) => n.split(' ').map((w) => w[0]).join('').slice(0, 2)
const tagTone = { Education: 'blue', Forum: 'green', Social: 'coral', 'Trade show': 'red', Keynote: 'orange', Meetings: 'navy', Panel: 'green' }
const pct = Math.round((block.booked / block.total) * 100)

const menuOpen = ref(false)
function go (id) { menuOpen.value = false; scrollToId(id) }
onBeforeUnmount(() => { bookOpen.value = false })
</script>

<template>
  <div class="l27 l27-af">
    <l27-concept-tag label="Agenda First" />

    <header class="af-nav">
      <div class="l27-wrap af-nav__in">
        <img :src="brand.logo" alt="IMEX America 2027" class="af-nav__logo" />
        <nav class="af-nav__links" aria-label="Page sections">
          <button v-for="l in links" :key="l.id" type="button" class="af-nav__link" @click="go(l.id)">{{ l.label }}</button>
        </nav>
        <button type="button" class="l27-btn l27-btn--primary af-nav__cta" @click="openBooking()"><q-icon name="hotel" size="20px" /> Book your hotel</button>
      </div>
    </header>

    <main>
      <!-- 2 · hero -->
      <section class="af-hero" aria-labelledby="af-title">
        <div class="af-art" aria-hidden="true">
          <div class="af-art__rings" />
          <div class="af-art__stripes" />
          <svg class="af-art__waves" viewBox="0 0 400 240" preserveAspectRatio="none">
            <path v-for="n in 6" :key="n" :d="`M-20 ${40 + n * 26} C 60 ${n * 26 - 10}, 140 ${90 + n * 26}, 220 ${40 + n * 26} S 360 ${n * 26 - 10}, 420 ${40 + n * 26}`" :class="n % 2 ? 'is-pink' : 'is-coral'" />
          </svg>
          <div class="af-art__sun" />
          <div class="af-art__word"><span>IMEX</span><span>America</span><span class="af-art__yr">’27</span></div>
        </div>
        <div class="af-hero__copy">
          <p class="l27-eyebrow af-red">Smart Monday Sept 27 · Show Sept 28–30</p>
          <h1 id="af-title" class="af-hero__h1">IMEX America <span class="l27-c-red">2027</span></h1>
          <p class="af-hero__meta"><q-icon name="location_on" size="20px" /> Mandalay Bay · Las Vegas · Sept 28–30</p>
          <p class="l27-lead">Three days on the show floor, a full day of Smart Monday learning and more meetings than any other week of your year. Plan your agenda here — then lock in a room in the official hotel block before it fills.</p>
          <div class="af-hero__ctas">
            <button type="button" class="l27-btn l27-btn--primary l27-btn--lg" @click="openBooking()"><q-icon name="hotel" size="20px" /> Book your hotel</button>
            <l27-add-to-calendar class="l27-btn--lg" />
          </div>
          <p class="af-hero__note"><span class="af-hero__bar"><span :style="{ width: pct + '%' }" /></span>{{ pct }}% of the official block is booked · rates held until {{ event.blockDeadline }}</p>
        </div>
      </section>

      <!-- 3 · yellow band -->
      <section class="af-band" aria-labelledby="af-expect">
        <div class="l27-wrap">
          <h2 id="af-expect" class="af-band__h">What to expect at IMEX</h2>
          <div class="af-band__grid">
            <div v-for="e in expect" :key="e.title" class="af-band__col">
              <span class="af-band__ico"><q-icon :name="e.icon" size="28px" /></span>
              <h3>{{ e.title }}</h3>
              <p>{{ e.text }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 4 · speakers -->
      <section id="af-speakers" class="af-sec l27-wrap" aria-labelledby="af-spk">
        <div class="af-head">
          <p class="l27-eyebrow af-red">On stage</p>
          <h2 id="af-spk" class="l27-h2">Speakers worth the trip</h2>
          <p class="l27-lead">Planners, founders and association leaders sharing what actually works in business events right now.</p>
        </div>
        <ul class="af-spk">
          <li v-for="(s, i) in speakers" :key="s.name" class="af-spk__card">
            <div class="af-spk__tile" :class="`is-${tileColors[i % 4]}`" aria-hidden="true"><span>{{ initials(s.name) }}</span></div>
            <h3 class="af-spk__name">{{ s.name }}</h3>
            <p class="af-spk__role">{{ s.role }}</p>
            <p class="af-spk__topic">“{{ s.topic }}”</p>
          </li>
        </ul>
      </section>

      <!-- 5 · agenda -->
      <section id="af-agenda" class="af-agenda" aria-labelledby="af-ag">
        <div class="l27-wrap">
          <div class="af-head af-head--row">
            <div>
              <p class="l27-eyebrow af-red">The agenda</p>
              <h2 id="af-ag" class="l27-h2">Pick your days. Book your nights.</h2>
              <p class="l27-lead">Every day below has its own booking link — we pre-fill a stay that checks you in the night before and out the morning after.</p>
            </div>
            <button type="button" class="l27-btn l27-btn--dark" @click="openBooking('form', { stay: fullStay })"><q-icon name="date_range" size="20px" /> Book all four days</button>
          </div>
          <ol class="af-days">
            <li v-for="d in schedule" :key="d.day" class="af-day">
              <div class="af-day__head">
                <p class="af-day__date">{{ d.label }}</p>
                <h3 class="af-day__title">{{ d.title }}</h3>
                <p class="af-day__sub">{{ d.sub }}</p>
                <button type="button" class="l27-btn l27-btn--primary af-day__book" :aria-label="`Book for ${d.title}: ${stayLabel(stayFor(d.day))}`" @click="openBooking('form', { stay: stayFor(d.day) })">
                  <q-icon name="hotel" size="18px" /> Book for this day
                </button>
                <p class="af-day__stay">{{ stayLabel(stayFor(d.day)) }}</p>
              </div>
              <ul class="af-day__items">
                <li v-for="it in d.items" :key="it.time + it.title" class="af-item">
                  <span class="af-item__time">{{ it.time }}</span>
                  <span class="af-item__title">{{ it.title }}</span>
                  <span class="af-tag" :class="`is-${tagTone[it.tag] || 'navy'}`">{{ it.tag }}</span>
                </li>
              </ul>
            </li>
          </ol>
        </div>
      </section>

      <!-- 6 · venue & hotels -->
      <section id="af-venue" class="af-sec l27-wrap" aria-labelledby="af-vn">
        <div class="af-venue">
          <figure class="af-venue__photo">
            <img :src="photos.mandalay" alt="Mandalay Bay resort and convention center, Las Vegas" />
            <figcaption>Show floor · Mandalay Bay Convention Center</figcaption>
          </figure>
          <div class="af-venue__copy">
            <p class="l27-eyebrow af-red">Venue & hotels</p>
            <h2 id="af-vn" class="l27-h2">Stay steps from the stage</h2>
            <p class="af-venue__addr"><q-icon name="place" size="20px" /> {{ event.address }}</p>
            <p class="l27-lead">The official IMEX block puts you inside the venue or a short walk away — at rates up to 35% below public prices, with free changes until {{ event.blockDeadline }}.</p>
            <ul class="af-venue__facts">
              <li><q-icon name="directions_walk" size="20px" /> Six partner hotels, all under 20 minutes on foot</li>
              <li><q-icon name="tram" size="20px" /> Free tram between Mandalay Bay, Luxor and Excalibur</li>
              <li><q-icon name="receipt_long" size="20px" /> Book your whole team on one invoice</li>
            </ul>
          </div>
        </div>
        <div class="af-venue__widget"><l27-booking-widget layout="bar" :stay="stay" @search="onWidgetSearch" /></div>
        <l27-hotel-map :show-map="false" :limit="3" @book="onHotelBook" />
      </section>

      <!-- 7 · FAQ -->
      <section id="af-faq" class="af-faq" aria-labelledby="af-fq">
        <div class="l27-wrap af-faq__in">
          <div>
            <p class="l27-eyebrow af-red">Housing FAQ</p>
            <h2 id="af-fq" class="l27-h2">Before you book</h2>
            <p class="l27-lead">The EventPipe housing team answers around the clock — and never cold-calls exhibitors.</p>
            <button type="button" class="l27-btn l27-btn--primary af-faq__cta" @click="openBooking()">Book your hotel</button>
          </div>
          <l27-faq />
        </div>
      </section>
    </main>

    <!-- 8 · footer -->
    <footer class="af-foot">
      <div class="l27-wrap">
        <p class="af-foot__word" aria-hidden="true">IMEX America 2027</p>
        <div class="af-foot__row">
          <p>{{ event.venue }} · {{ event.datesLabel }} · {{ event.smartMonday }}</p>
          <p>Official housing powered by Presto · Concept by EventPipe, not affiliated with IMEX. Rates are sample data.</p>
        </div>
      </div>
    </footer>

    <l27-sticky-bar position="bottom" @book="openBooking()" />
    <l27-booking-modal :key="modalKey" v-model="bookOpen" :stay="stay" :hotel-id="hotelId" :initial-state="modalState" :search="search" />
  </div>
</template>

<style scoped>
.l27-af { overflow-x: clip; }
.af-red { color: var(--l27-red); }
.af-sec { padding-top: 104px; padding-bottom: 104px; }
.af-head { max-width: 680px; margin-bottom: 40px; display: grid; gap: 14px; }
.af-head--row { max-width: none; display: flex; align-items: flex-end; justify-content: space-between; gap: 32px; }
.af-head--row > div { max-width: 680px; display: grid; gap: 14px; }

/* nav */
.af-nav { position: relative; z-index: 5; background: #fff; border-bottom: 1px solid var(--l27-line); }
.af-nav__in { display: flex; align-items: center; gap: 24px; min-height: 76px; }
.af-nav__logo { height: 34px; width: auto; }
.af-nav__links { display: flex; gap: 4px; margin-left: auto; }
.af-nav__link { border: 0; background: none; font: inherit; font-weight: 700; color: var(--l27-ink); padding: 10px 14px; border-radius: 8px; cursor: pointer; }
.af-nav__link:hover { background: #F6F4F8; }
.af-nav__link:focus-visible, .af-day__book:focus-visible { outline: 3px solid var(--l27-blue); outline-offset: 2px; }

/* hero */
.af-hero { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); min-height: 640px; }
.af-art { position: relative; overflow: hidden; background: var(--l27-red); min-height: 420px; }
.af-art__rings { position: absolute; width: 130%; aspect-ratio: 1; left: -55%; bottom: -60%; border-radius: 50%; background: repeating-radial-gradient(circle, var(--l27-coral) 0 22px, var(--l27-red) 22px 44px); }
.af-art__stripes { position: absolute; right: -6%; top: -8%; width: 58%; height: 62%; transform: rotate(-12deg); background: repeating-linear-gradient(90deg, var(--l27-pink) 0 10px, transparent 10px 30px); opacity: .9; animation: af-drift 14s ease-in-out infinite alternate; }
.af-art__waves { position: absolute; left: 0; right: 0; top: 34%; width: 100%; height: 44%; }
.af-art__waves path { fill: none; stroke-width: 9; stroke-linecap: round; }
.af-art__waves .is-pink { stroke: var(--l27-pink); }
.af-art__waves .is-coral { stroke: var(--l27-coral); }
.af-art__sun { position: absolute; right: 12%; bottom: 14%; width: 120px; aspect-ratio: 1; border-radius: 50%; background: var(--l27-yellow); box-shadow: 0 0 0 18px rgba(255,209,0,.25); }
.af-art__word { position: absolute; left: 40px; top: 40px; display: flex; flex-direction: column; color: #fff; font-weight: 900; line-height: .86; letter-spacing: -0.04em; text-shadow: 0 2px 24px rgba(120,0,8,.35); }
.af-art__word span:first-child { font-size: clamp(4rem, 9vw, 8.5rem); }
.af-art__word span:nth-child(2) { font-size: clamp(1.8rem, 3.6vw, 3.4rem); }
.af-art__yr { font-size: clamp(1.8rem, 3.6vw, 3.4rem); color: var(--l27-yellow); }
@keyframes af-drift { from { transform: rotate(-12deg) translateX(0); } to { transform: rotate(-8deg) translateX(-24px); } }
.af-hero__copy { display: flex; flex-direction: column; justify-content: center; gap: 20px; padding: 64px clamp(24px, 5vw, 80px); }
.af-hero__h1 { font-size: clamp(2.75rem, 5.6vw, 5rem); font-weight: 900; line-height: .95; }
.af-hero__meta { display: flex; align-items: center; gap: 6px; font-size: 1.25rem; font-weight: 800; }
.af-hero__meta .q-icon { color: var(--l27-red); }
.af-hero__ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 4px; }
.af-hero__note { display: flex; align-items: center; gap: 10px; font-size: 0.875rem; font-weight: 600; color: var(--l27-muted); }
.af-hero__bar { width: 84px; height: 8px; border-radius: 99px; background: var(--l27-pink); overflow: hidden; flex: none; }
.af-hero__bar span { display: block; height: 100%; background: var(--l27-red); }

/* yellow band */
.af-band { background: var(--l27-yellow); padding: 72px 0; }
.af-band__h { font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 900; margin-bottom: 36px; }
.af-band__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 40px; }
.af-band__col { display: grid; gap: 10px; align-content: start; border-top: 3px solid var(--l27-ink); padding-top: 22px; }
.af-band__ico { width: 52px; height: 52px; border-radius: 50%; background: var(--l27-ink); color: var(--l27-yellow); display: flex; align-items: center; justify-content: center; }
.af-band__col h3 { font-size: 1.5rem; font-weight: 900; }
.af-band__col p { font-size: 1.0625rem; line-height: 1.5; }

/* speakers */
.af-spk { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; }
.af-spk__tile { position: relative; aspect-ratio: 1; border-radius: var(--l27-radius); overflow: hidden; display: flex; align-items: flex-end; padding: 18px; color: #fff; margin-bottom: 16px; }
.af-spk__tile::before { content: ''; position: absolute; inset: 0; background: repeating-radial-gradient(circle at 100% 0, rgba(255,255,255,.18) 0 14px, transparent 14px 32px); }
.af-spk__tile span { position: relative; font-size: clamp(4rem, 7vw, 6rem); font-weight: 900; line-height: .8; letter-spacing: -0.05em; }
.af-spk__tile.is-coral { background: var(--l27-red); }
.af-spk__tile.is-blue { background: #2F6FAE; }
.af-spk__tile.is-orange { background: #C25F00; }
.af-spk__tile.is-green { background: var(--l27-green); }
.af-spk__name { font-size: 1.25rem; font-weight: 900; }
.af-spk__role { font-size: 0.9375rem; color: var(--l27-muted); margin-top: 2px; }
.af-spk__topic { font-weight: 700; margin-top: 10px; line-height: 1.4; }

/* agenda */
.af-agenda { background: var(--l27-cream); padding: 104px 0; }
.af-days { list-style: none; margin: 0; padding: 0; display: grid; gap: 16px; }
.af-day { display: grid; grid-template-columns: 300px minmax(0, 1fr); background: #fff; border-radius: var(--l27-radius); border: 1px solid var(--l27-line); overflow: hidden; }
.af-day__head { padding: 28px; border-right: 1px solid var(--l27-line); display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }
.af-day__date { font-size: 2.5rem; font-weight: 900; line-height: 1; color: var(--l27-red); letter-spacing: -0.03em; }
.af-day__title { font-size: 1.25rem; font-weight: 900; margin-top: 6px; }
.af-day__sub { color: var(--l27-muted); font-size: 0.9375rem; }
.af-day__book { margin-top: 16px; height: 42px; padding: 0 16px; font-size: 0.9375rem; }
.af-day__stay { font-size: 0.8125rem; font-weight: 700; color: var(--l27-muted); margin-top: 4px; }
.af-day__items { list-style: none; margin: 0; padding: 12px 28px; display: flex; flex-direction: column; justify-content: center; }
.af-item { display: grid; grid-template-columns: 72px minmax(0, 1fr) auto; align-items: center; gap: 16px; padding: 18px 0; border-bottom: 1px solid var(--l27-line); }
.af-item:last-child { border-bottom: 0; }
.af-item__time { font-weight: 900; font-variant-numeric: tabular-nums; }
.af-item__title { font-size: 1.125rem; font-weight: 700; }
.af-tag { font-size: 0.75rem; font-weight: 800; padding: 5px 10px; border-radius: 999px; white-space: nowrap; }
.af-tag.is-blue { background: #E3EEF9; color: #1F5A93; }
.af-tag.is-green { background: #E0F0E6; color: var(--l27-green); }
.af-tag.is-coral { background: var(--l27-pink); color: #A3242F; }
.af-tag.is-red { background: #FDE2E4; color: var(--l27-red-dark); }
.af-tag.is-orange { background: #FDEBD6; color: #9A4B00; }
.af-tag.is-navy { background: #E6E7F2; color: var(--l27-navy); }

/* venue */
.af-venue { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: 56px; align-items: center; }
.af-venue__photo { position: relative; margin: 0; border-radius: var(--l27-radius); overflow: hidden; aspect-ratio: 4 / 3; }
.af-venue__photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.af-venue__photo figcaption { position: absolute; left: 16px; bottom: 16px; padding: 6px 12px; border-radius: 999px; background: rgba(29,29,27,.82); color: #fff; font-size: 0.8125rem; font-weight: 700; }
.af-venue__copy { display: grid; gap: 16px; }
.af-venue__addr { display: flex; align-items: center; gap: 6px; font-weight: 800; }
.af-venue__addr .q-icon, .af-venue__facts .q-icon { color: var(--l27-red); flex: none; }
.af-venue__facts { list-style: none; margin: 4px 0 0; padding: 0; display: grid; gap: 10px; font-weight: 600; }
.af-venue__facts li { display: flex; align-items: center; gap: 10px; }
.af-venue__widget { margin: 48px 0 28px; }

/* faq */
.af-faq { background: #F7F5F9; padding: 104px 0; }
.af-faq__in { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr); gap: 64px; align-items: start; }
.af-faq__in > div:first-child { display: grid; gap: 14px; justify-items: start; }
.af-faq__cta { margin-top: 8px; }

/* footer */
.af-foot { background: #fff; padding: 72px 0 120px; border-top: 1px solid var(--l27-line); }
.af-foot__word { font-size: clamp(2.6rem, 8.4vw, 7.75rem); font-weight: 900; line-height: .9; letter-spacing: -0.05em; color: var(--l27-red); }
.af-foot__row { display: flex; justify-content: space-between; gap: 24px; margin-top: 28px; font-size: 0.875rem; color: var(--l27-muted); }

@media (max-width: 1080px) {
  .af-hero { grid-template-columns: 1fr; min-height: 0; }
  .af-spk { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .af-venue, .af-faq__in { grid-template-columns: 1fr; gap: 32px; }
  .af-day { grid-template-columns: 240px minmax(0, 1fr); }
}
@media (max-width: 760px) {
  .af-nav__links { display: none; }
  .af-nav__cta { margin-left: auto; }
  .af-nav__in { min-height: 64px; }
  .af-nav__logo { height: 26px; }
  .af-art { min-height: 300px; }
  .af-art__word { left: 24px; top: 24px; }
  .af-art__sun { width: 72px; box-shadow: 0 0 0 10px rgba(255,209,0,.25); }
  .af-hero__copy { padding: 40px 16px 48px; }
  .af-hero__meta { font-size: 1.0625rem; }
  .af-sec, .af-agenda, .af-faq { padding-top: 64px; padding-bottom: 64px; }
  .af-band { padding: 56px 0; }
  .af-band__grid { grid-template-columns: 1fr; gap: 28px; }
  .af-head--row { flex-direction: column; align-items: flex-start; }
  .af-spk { gap: 16px; }
  .af-spk__tile span { font-size: 3.25rem; }
  .af-day { grid-template-columns: 1fr; }
  .af-day__head { border-right: 0; border-bottom: 1px solid var(--l27-line); padding: 22px; }
  .af-day__items { padding: 4px 22px; }
  .af-item { grid-template-columns: 52px minmax(0, 1fr); gap: 4px 12px; padding: 14px 0; }
  .af-item .af-tag { grid-column: 2; justify-self: start; }
  .af-item__title { font-size: 1rem; }
  .af-foot { padding: 48px 0 140px; }
  .af-foot__row { flex-direction: column; gap: 8px; }
}
@media (max-width: 480px) {
  /* workaround: the sticky bar's title + logo + button overflow at 390px */
  .l27-af :deep(.l27stk__info) { display: none; }
}
/* concept tag: bottom-left, clear of the nav CTA and above the bottom sticky bar */
.l27-af :deep(.l27ct--fixed) { top: auto; right: auto; left: 12px; bottom: 84px; }
@media (max-width: 420px) {
  .af-spk__name { font-size: 1.0625rem; }
  .af-spk__role, .af-spk__topic { font-size: 0.875rem; }
}
@media (prefers-reduced-motion: reduce) {
  .af-art__stripes { animation: none; }
}
</style>
