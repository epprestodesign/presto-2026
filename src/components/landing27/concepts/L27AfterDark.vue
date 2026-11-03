<script setup>
// L27AfterDark — Concept 2 "After Dark": an immersive, cinematic IMEX America
// page (black/navy, huge type, red + yellow glows). There is no inline booking
// widget — the booking modal IS the booking surface, reached from the nav pill,
// hero CTA, hotel cards/pins, block-meter panel, closing CTA and the floating
// round "Book your hotel" badge. Concept only; not affiliated with IMEX.
import { ref } from 'vue'
import '../l27.css'
import L27BookingModal from '../L27BookingModal.vue'
import L27FloatingBook from '../L27FloatingBook.vue'
import L27HotelMap from '../L27HotelMap.vue'
import L27Countdown from '../L27Countdown.vue'
import L27BlockMeter from '../L27BlockMeter.vue'
import L27Faq from '../L27Faq.vue'
import L27ConceptTag from '../L27ConceptTag.vue'
import { scrollToId } from '../L27Extras.js'
import { brand, photos, event, hotels, block, defaultStay } from '../imex.js'

const props = defineProps({
  initialModal: { type: Boolean, default: false },
  initialModalState: { type: String, default: 'form' },
})

const stay = ref({ ...defaultStay })
const bookOpen = ref(props.initialModal)
const modalState = ref(props.initialModalState)
const hotelId = ref('')
const modalKey = ref(0)

function openBooking ({ state = 'form', hotel = '', nextStay = null } = {}) {
  if (nextStay) stay.value = { ...nextStay }
  hotelId.value = hotel
  modalState.value = state
  modalKey.value++
  bookOpen.value = true
}
const bookHotel = (id) => openBooking({ hotel: id })

const navLinks = [
  { id: 'ad-why', label: 'Why the block' },
  { id: 'ad-hotels', label: 'Hotels' },
  { id: 'ad-gallery', label: 'The show' },
  { id: 'ad-faq', label: 'FAQ' },
]
const ticker = ['18,200 participants', '96,000 meetings', '3,800 exhibitors', '90+ countries', '6,292 hosted buyers', '3 show days + Smart Monday']
const avatars = [
  { i: 'AO', c: 'var(--l27-coral)' }, { i: 'DR', c: 'var(--l27-blue)' },
  { i: 'PN', c: 'var(--l27-orange)' }, { i: 'LF', c: 'var(--l27-green)' },
]
const reasons = [
  { n: '01', title: 'Up to 35% below public rates', text: 'Negotiated IMEX pricing with resort fees waived at Mandalay Bay — rates you won’t find on travel sites.' },
  { n: '02', title: 'Minutes from your booth', text: 'Every official hotel is a short walk or free tram ride to the show floor. Back for your 9:00 meeting, every day.' },
  { n: '03', title: 'Free changes until Aug 27', text: 'Plans shift. Change names, dates or cancel without a fee until the block closes.' },
]
const scarce = [...hotels].sort((a, b) => a.left - b.left).slice(0, 3)
const pctBooked = Math.round((block.booked / block.total) * 100)
const mosaic = [
  { src: photos.networking, alt: 'Attendees networking between meetings on the IMEX show floor', cap: 'Networking', cls: 'a' },
  { src: photos.designMatters, alt: 'Design Matters keynote stage at IMEX America', cap: 'Design Matters', cls: 'b' },
  { src: photos.buyers, alt: 'Hosted buyers meeting exhibitors at IMEX America', cap: 'Hosted buyers', cls: 'c' },
  { src: photos.mandalay, alt: 'Mandalay Bay resort on the Las Vegas Strip', cap: 'Mandalay Bay', cls: 'd' },
  { src: photos.education, alt: 'Audience raising hands during an education session', cap: 'Smart Monday', cls: 'e' },
]
</script>

<template>
  <div class="l27 l27-afterdark">
    <l27-concept-tag label="After Dark" />

    <!-- 1 · Transparent nav over the hero -->
    <header class="ad-nav">
      <div class="l27-wrap ad-nav__in">
        <img :src="brand.logoDark" alt="IMEX America 2027" class="ad-nav__logo" />
        <nav aria-label="Page sections" class="ad-nav__links">
          <button v-for="l in navLinks" :key="l.id" type="button" class="ad-nav__link" @click="scrollToId(l.id)">{{ l.label }}</button>
        </nav>
        <button type="button" class="l27-btn l27-btn--yellow l27-btn--pill ad-nav__cta" @click="openBooking()">
          <q-icon name="hotel" size="18px" />Book your hotel
        </button>
      </div>
    </header>

    <main>
      <!-- 2 · Full-viewport hero -->
      <section class="ad-hero" aria-labelledby="ad-hero-h">
        <img :src="photos.showfloor" alt="" class="ad-hero__bg" />
        <div class="ad-hero__shade" aria-hidden="true" />
        <div class="l27-wrap ad-hero__in">
          <p class="l27-eyebrow ad-hero__eyebrow"><span class="ad-dot" aria-hidden="true" />{{ event.venue }} · {{ event.datesLabel }}</p>
          <h1 id="ad-hero-h" class="ad-hero__h">Vegas, <span class="ad-nowrap">Sept 28–30.</span><br />Your room is <span class="l27-c-yellow">waiting.</span></h1>
          <p class="ad-hero__sub">The official IMEX America hotel block — negotiated rates, waived resort fees and every room minutes from the show floor. Lock in yours before the Strip sells out.</p>
          <div class="ad-hero__ctas">
            <button type="button" class="l27-btn l27-btn--yellow l27-btn--lg l27-btn--pill" @click="openBooking()">Book your hotel<q-icon name="arrow_forward" size="20px" /></button>
            <button type="button" class="l27-btn l27-btn--ghost l27-btn--lg l27-btn--pill ad-ghost" @click="scrollToId('ad-hotels')">See official hotels</button>
          </div>
          <div class="ad-hero__foot">
            <l27-countdown tone="dark" label="Show floor opens in" />
            <div class="ad-chip">
              <span class="ad-chip__stack" aria-hidden="true">
                <span v-for="a in avatars" :key="a.i" class="ad-chip__av" :style="{ background: a.c }">{{ a.i }}</span>
              </span>
              <span><strong>6,292 buyers</strong> already planning their trip</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 3 · Yellow ticker band -->
      <section class="ad-ticker" aria-label="IMEX America by the numbers">
        <ul class="ad-ticker__sr"><li v-for="t in ticker" :key="t">{{ t }}</li></ul>
        <div class="ad-ticker__track" aria-hidden="true">
          <span v-for="n in 2" :key="n" class="ad-ticker__run">
            <span v-for="t in ticker" :key="t" class="ad-ticker__item">{{ t }}<span class="ad-ticker__star">✳</span></span>
          </span>
        </div>
      </section>

      <!-- 4 · Split typography -->
      <section id="ad-why" class="ad-why" aria-labelledby="ad-why-h">
        <div class="l27-wrap">
          <h2 id="ad-why-h" class="ad-why__h">
            <span class="ad-why__line">Three days. <img :src="photos.education" alt="Attendees at a Smart Monday education session" class="ad-why__pill" /></span>
            <span class="ad-why__line ad-why__line--r"><span class="l27-c-red">One block.</span></span>
            <span class="ad-why__line"><img :src="photos.buyers" alt="Buyers and exhibitors meeting at IMEX America" class="ad-why__pill ad-why__pill--wide" /> Zero hassle.</span>
          </h2>
          <div class="ad-why__grid">
            <p class="ad-why__lead">With 96,000 pre-scheduled meetings across three days, where you sleep decides how you show up. Booking inside the official block keeps you close to the floor, protects the rates IMEX negotiated for the whole industry — and means nobody will ever cold-call you about “housing.”</p>
            <ol class="ad-why__list">
              <li v-for="r in reasons" :key="r.n" class="ad-why__item">
                <span class="ad-why__n">{{ r.n }}</span>
                <div><h3>{{ r.title }}</h3><p>{{ r.text }}</p></div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <!-- 5 · Hotels & map -->
      <section id="ad-hotels" class="ad-hotels" aria-labelledby="ad-hotels-h">
        <div class="l27-wrap">
          <div class="ad-head">
            <div>
              <p class="l27-eyebrow l27-c-yellow">Official hotels</p>
              <h2 id="ad-hotels-h" class="ad-h2">Sleep on the Strip,<br />walk to the show.</h2>
            </div>
            <p class="ad-head__p">Six partner hotels, all on the south Strip. Hover a hotel to find it on the map — tap Book to check rooms for {{ event.datesLabel }}.</p>
          </div>
          <l27-hotel-map tone="dark" @book="bookHotel" />
        </div>
      </section>

      <!-- 6 · Block meter panel -->
      <section class="ad-urgency" aria-labelledby="ad-urgency-h">
        <div class="l27-wrap">
          <div class="ad-panel">
            <div class="ad-panel__copy">
              <p class="l27-eyebrow">Room block status</p>
              <h2 id="ad-urgency-h" class="ad-h2">Rooms are going fast.</h2>
              <p>{{ pctBooked }}% of the IMEX room block is already spoken for — and the hotels closest to the show floor go first. Once the block is gone, you’re paying public Vegas prices in show week.</p>
              <button type="button" class="l27-btn l27-btn--yellow l27-btn--lg l27-btn--pill" @click="openBooking()">Book your hotel<q-icon name="arrow_forward" size="20px" /></button>
            </div>
            <div class="ad-panel__meter">
              <l27-block-meter tone="dark" />
              <ul class="ad-scarce">
                <li v-for="h in scarce" :key="h.id">
                  <span class="ad-scarce__name">{{ h.name }}</span>
                  <span class="ad-scarce__left" :class="{ 'is-low': h.left < 20 }">{{ h.left }} left</span>
                  <button type="button" class="ad-scarce__btn" :aria-label="`Book ${h.name}`" @click="bookHotel(h.id)"><q-icon name="arrow_forward" size="18px" /></button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 7 · Photo mosaic -->
      <section id="ad-gallery" class="ad-gallery" aria-labelledby="ad-gallery-h">
        <div class="l27-wrap">
          <div class="ad-head">
            <div>
              <p class="l27-eyebrow l27-c-coral">Inside IMEX America</p>
              <h2 id="ad-gallery-h" class="ad-h2">Ideas are better<br />when <span class="l27-c-yellow">shared.</span></h2>
            </div>
            <p class="ad-head__p">Keynotes, hosted-buyer appointments, the Inspiration Hub and nights on the Strip. Stay close and you won’t miss a minute of it.</p>
          </div>
          <div class="ad-mosaic">
            <figure v-for="m in mosaic" :key="m.cls" class="ad-mosaic__tile" :class="`ad-mosaic__tile--${m.cls}`">
              <img :src="m.src" :alt="m.alt" />
              <figcaption>{{ m.cap }}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <!-- 8 · FAQ -->
      <section id="ad-faq" class="ad-faq" aria-labelledby="ad-faq-h">
        <div class="l27-wrap ad-faq__grid">
          <div>
            <p class="l27-eyebrow l27-c-yellow">Housing FAQ</p>
            <h2 id="ad-faq-h" class="ad-h2">Questions before you book?</h2>
            <p class="ad-faq__p">The EventPipe housing team answers around the clock — changes, team bookings and company invoices included.</p>
            <div class="ad-faq__card"><q-icon name="shield" size="22px" /><span>IMEX and EventPipe never cold-call about hotels. If someone does, it’s a scam.</span></div>
          </div>
          <l27-faq tone="dark" />
        </div>
      </section>

      <!-- 9 · Closing CTA -->
      <section class="ad-close" aria-labelledby="ad-close-h">
        <div class="l27-wrap ad-close__in">
          <h2 id="ad-close-h" class="ad-close__h">Your next big deal starts <span class="l27-c-yellow">in this room.</span></h2>
          <p class="ad-close__p">Official IMEX rates are held until {{ event.blockDeadline }} — or until the block sells out.</p>
          <button type="button" class="l27-btn l27-btn--yellow l27-btn--lg l27-btn--pill" @click="openBooking()">Book your hotel<q-icon name="arrow_forward" size="20px" /></button>
        </div>
      </section>
    </main>

    <!-- 10 · Footer -->
    <footer class="ad-foot">
      <div class="l27-wrap ad-foot__in">
        <img :src="brand.logoDark" alt="IMEX America 2027" class="ad-foot__logo" />
        <p>{{ event.venue }} · {{ event.datesLabel }} · {{ event.smartMonday }}</p>
        <p class="ad-foot__fine">Official housing powered by Presto from EventPipe. Concept design — not affiliated with or endorsed by IMEX. Rates and availability are sample data.</p>
      </div>
    </footer>

    <l27-floating-book tone="yellow" @book="openBooking()" />
    <l27-booking-modal :key="modalKey" v-model="bookOpen" :stay="stay" :hotel-id="hotelId" :initial-state="modalState" />
  </div>
</template>

<style scoped>
.l27-afterdark { background: #07081C; color: #fff; overflow-x: clip; }
.ad-h2 { font-size: clamp(2.2rem, 4.6vw, 3.75rem); font-weight: 900; line-height: 1; letter-spacing: -0.03em; }
.ad-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 32px; margin-bottom: 40px; }
.ad-head .l27-eyebrow { margin-bottom: 14px; }
.ad-head__p { max-width: 400px; color: rgba(255,255,255,.7); font-size: 1.0625rem; line-height: 1.55; }
.ad-ghost { color: #fff; }
.ad-ghost:hover { background: rgba(255,255,255,.08); }
.l27-afterdark :focus-visible { outline: 3px solid var(--l27-yellow); outline-offset: 3px; }

/* 1 · nav (sits below the fixed concept tag) */
.ad-nav { position: absolute; top: 0; left: 0; right: 0; z-index: 20; padding-top: 52px; }
.ad-nav__in { display: flex; align-items: center; gap: 32px; }
.ad-nav__logo { height: 40px; width: auto; }
.ad-nav__links { display: flex; gap: 4px; margin-left: auto; }
.ad-nav__link { border: 0; background: none; color: rgba(255,255,255,.82); font: 700 0.9375rem var(--l27-font); padding: 10px 14px; border-radius: 999px; cursor: pointer; }
.ad-nav__link:hover { color: #fff; background: rgba(255,255,255,.08); }
.ad-nav__cta { height: 44px; }

/* 2 · hero */
.ad-hero { position: relative; min-height: max(100vh, 760px); display: flex; isolation: isolate; overflow: hidden; }
.ad-hero__bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: -2; filter: saturate(.85); }
.ad-hero__shade { position: absolute; inset: 0; z-index: -1; background:
  radial-gradient(60% 55% at 88% 18%, rgba(227,6,19,.55), transparent 70%),
  radial-gradient(40% 40% at 10% 100%, rgba(255,209,0,.14), transparent 70%),
  linear-gradient(90deg, rgba(7,8,28,.96) 0%, rgba(14,16,51,.85) 42%, rgba(14,16,51,.35) 100%),
  linear-gradient(0deg, #07081C 0%, transparent 35%); }
.ad-hero__in { display: flex; flex-direction: column; justify-content: center; padding-top: 170px; padding-bottom: 48px; }
.ad-hero__eyebrow { display: inline-flex; align-items: baseline; gap: 10px; color: rgba(255,255,255,.85); }
.ad-nowrap { white-space: nowrap; }
.ad-dot { flex: none; align-self: center; width: 8px; height: 8px; border-radius: 50%; background: var(--l27-red); box-shadow: 0 0 0 4px rgba(227,6,19,.3); }
.ad-hero__h { font-size: clamp(2.75rem, 7.6vw, 7rem); font-weight: 900; line-height: .95; letter-spacing: -0.04em; margin-top: 22px; max-width: 1050px; }
.ad-hero__sub { max-width: 560px; margin-top: 28px; font-size: 1.1875rem; line-height: 1.55; color: rgba(255,255,255,.8); }
.ad-hero__ctas { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 36px; }
.ad-hero__foot { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-top: auto; padding-top: 64px; flex-wrap: wrap; }
.ad-chip { display: inline-flex; align-items: center; gap: 12px; padding: 10px 18px 10px 10px; border-radius: 999px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.18); backdrop-filter: blur(10px); font-size: 0.9375rem; margin-right: 128px; }
.ad-chip__stack { display: flex; }
.ad-chip__av { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.6875rem; font-weight: 900; color: #fff; border: 2px solid #191D4E; margin-left: -10px; }
.ad-chip__av:first-child { margin-left: 0; }

/* 3 · ticker */
.ad-ticker { background: var(--l27-yellow); color: var(--l27-ink); overflow: hidden; padding: 20px 0; transform: rotate(-1.2deg); margin: 0 -20px; position: relative; z-index: 2; }
.ad-ticker__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); margin: 0; padding: 0; }
.ad-ticker__track { display: flex; width: max-content; animation: ad-marquee 38s linear infinite; }
.ad-ticker__run { display: flex; }
.ad-ticker__item { display: inline-flex; align-items: center; gap: 28px; padding-right: 28px; font-size: clamp(1.25rem, 2.4vw, 2rem); font-weight: 900; letter-spacing: -0.02em; text-transform: uppercase; white-space: nowrap; }
.ad-ticker__star { color: var(--l27-red); }
@keyframes ad-marquee { to { transform: translateX(-50%); } }

/* 4 · split type */
.ad-why { padding: 140px 0 120px; }
.ad-why__h { display: flex; flex-direction: column; font-size: clamp(2.6rem, 8vw, 7.5rem); font-weight: 900; line-height: 1; letter-spacing: -0.045em; }
.ad-why__line { display: flex; align-items: center; gap: .25em; flex-wrap: wrap; }
.ad-why__line--r { justify-content: flex-end; }
.ad-why__pill { height: .78em; width: 2.1em; object-fit: cover; border-radius: 999px; display: inline-block; }
.ad-why__pill--wide { width: 2.7em; }
.ad-why__grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 64px; margin-top: 80px; padding-top: 48px; border-top: 1px solid rgba(255,255,255,.14); }
.ad-why__lead { font-size: 1.25rem; line-height: 1.6; color: rgba(255,255,255,.78); }
.ad-why__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 28px; }
.ad-why__item { display: flex; gap: 20px; }
.ad-why__n { font-size: 0.875rem; font-weight: 900; color: var(--l27-yellow); padding-top: 4px; min-width: 24px; }
.ad-why__item h3 { font-size: 1.375rem; font-weight: 800; }
.ad-why__item p { margin-top: 6px; color: rgba(255,255,255,.68); line-height: 1.55; }

/* 5 · hotels */
.ad-hotels { padding: 120px 0 80px; background: radial-gradient(50% 40% at 0% 0%, rgba(77,146,207,.18), transparent 70%), linear-gradient(180deg, #07081C, var(--l27-navy-deep) 30%, var(--l27-navy-deep)); }

/* dark-tone contrast fix for the shared hotel cards (green/red on navy is too dim) */
.ad-hotels :deep(.l27hm__left) { color: #7BE3A4; }
.ad-hotels :deep(.l27hm__left.is-low) { color: var(--l27-yellow); }

/* shared floating badge: ring text is longer than its circle (overlaps itself) — tighten it here */
.l27-afterdark :deep(.l27fb__ring text) { font-size: 9.5px; letter-spacing: .7px; }

/* 6 · urgency */
.ad-urgency { padding: 24px 0 110px; background: var(--l27-navy-deep); }
.ad-panel { display: grid; grid-template-columns: 1.05fr 1fr; gap: 56px; align-items: center; padding: 64px; border-radius: 28px; background: radial-gradient(70% 90% at 0% 0%, rgba(255,209,0,.18), transparent 60%), linear-gradient(125deg, var(--l27-red) 0%, #8E0B2E 45%, var(--l27-navy) 100%); box-shadow: 0 40px 90px -30px rgba(227,6,19,.55); }
.ad-panel__copy .l27-eyebrow { color: rgba(255,255,255,.85); margin-bottom: 14px; }
.ad-panel__copy p:not(.l27-eyebrow) { margin: 20px 0 32px; font-size: 1.125rem; line-height: 1.6; color: rgba(255,255,255,.88); max-width: 480px; }
.ad-panel__meter { padding: 28px; border-radius: 20px; background: rgba(7,8,28,.55); border: 1px solid rgba(255,255,255,.14); backdrop-filter: blur(8px); }
.ad-panel__meter :deep(.l27bm2__note) { color: rgba(255,255,255,.8); }
.ad-scarce { list-style: none; margin: 22px 0 0; padding: 0; border-top: 1px solid rgba(255,255,255,.14); }
.ad-scarce li { display: flex; align-items: center; gap: 12px; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,.1); }
.ad-scarce__name { flex: 1; font-weight: 800; }
.ad-scarce__left { font-size: 0.875rem; font-weight: 800; color: rgba(255,255,255,.75); }
.ad-scarce__left.is-low { color: var(--l27-yellow); }
.ad-scarce__btn { width: 36px; height: 36px; border-radius: 50%; border: 0; background: rgba(255,255,255,.12); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.ad-scarce__btn:hover { background: var(--l27-yellow); color: var(--l27-ink); }

/* 7 · mosaic */
.ad-gallery { padding: 40px 0 80px; background: linear-gradient(180deg, var(--l27-navy-deep), #07081C); }
.ad-mosaic { display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: 260px 260px; gap: 16px; }
.ad-mosaic__tile { position: relative; margin: 0; border-radius: 20px; overflow: hidden; }
.ad-mosaic__tile img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .6s ease; }
.ad-mosaic__tile:hover img { transform: scale(1.05); }
.ad-mosaic__tile::after { content: ''; position: absolute; inset: 0; background: linear-gradient(0deg, rgba(7,8,28,.75), transparent 45%); }
.ad-mosaic__tile figcaption { position: absolute; left: 18px; bottom: 16px; z-index: 1; font-weight: 800; font-size: 1rem; }
.ad-mosaic__tile--a { grid-column: span 2; grid-row: span 2; }

/* 8 · faq */
.ad-faq { padding: 80px 0 120px; background: #07081C; }
.ad-faq__grid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 72px; align-items: start; }
.ad-faq__grid .l27-eyebrow { margin-bottom: 14px; }
.ad-faq__p { margin-top: 20px; color: rgba(255,255,255,.72); font-size: 1.0625rem; line-height: 1.6; }
.ad-faq__card { display: flex; gap: 12px; margin-top: 28px; padding: 18px; border-radius: 14px; background: rgba(255,209,0,.08); border: 1px solid rgba(255,209,0,.3); color: rgba(255,255,255,.88); line-height: 1.5; }
.ad-faq__card .q-icon { color: var(--l27-yellow); flex: none; }

/* 9 · closing */
.ad-close { padding: 140px 0; text-align: center; background: radial-gradient(55% 70% at 50% 110%, rgba(227,6,19,.85), transparent 70%), radial-gradient(40% 45% at 85% 35%, rgba(77,146,207,.22), transparent 70%), linear-gradient(180deg, #07081C, var(--l27-navy)); }
.ad-close__in { display: flex; flex-direction: column; align-items: center; }
.ad-close__h { font-size: clamp(2.6rem, 7.4vw, 6.75rem); font-weight: 900; line-height: .95; letter-spacing: -0.045em; max-width: 1080px; }
.ad-close__p { margin: 28px 0 36px; font-size: 1.125rem; color: rgba(255,255,255,.82); }

/* 10 · footer */
.ad-foot { background: #04050F; padding: 48px 0 56px; border-top: 1px solid rgba(255,255,255,.08); }
.ad-foot__in { display: flex; flex-direction: column; gap: 12px; color: rgba(255,255,255,.75); font-size: 0.9375rem; }
.ad-foot__logo { height: 36px; width: auto; align-self: flex-start; margin-bottom: 8px; }
.ad-foot__fine { font-size: 0.8125rem; color: rgba(255,255,255,.62); max-width: 720px; }

@media (max-width: 980px) {
  .ad-nav__links { display: none; }
  .ad-nav__cta { margin-left: auto; }
  .ad-why__grid, .ad-panel, .ad-faq__grid { grid-template-columns: 1fr; gap: 40px; }
  .ad-panel { padding: 40px; }
  .ad-head { flex-direction: column; align-items: flex-start; gap: 16px; }
  .ad-mosaic { grid-template-columns: repeat(2, 1fr); grid-template-rows: none; grid-auto-rows: 200px; }
  .ad-mosaic__tile--a { grid-row: span 1; }
}
@media (max-width: 640px) {
  .ad-nav { padding-top: 16px; }
  .ad-nav__in { gap: 12px; }
  .ad-nav__logo { height: 30px; }
  .ad-nav__cta { height: 40px; padding: 0 14px; font-size: 0.875rem; }
  .ad-hero { min-height: auto; }
  .ad-hero__in { padding-top: 112px; padding-bottom: 32px; }
  .ad-hero__sub { font-size: 1.0625rem; }
  .ad-hero__ctas .l27-btn { width: 100%; }
  .ad-hero__foot { padding-top: 48px; flex-direction: column; align-items: flex-start; }
  .ad-chip { margin-right: 0; font-size: 0.875rem; }
  .ad-why, .ad-hotels, .ad-gallery, .ad-faq { padding: 80px 0; }
  .ad-why__line--r { justify-content: flex-start; }
  .ad-why__grid { margin-top: 48px; }
  .ad-urgency { padding: 16px 0 72px; }
  .ad-gallery { padding: 24px 0 64px; }
  .ad-hero__h { font-size: 2.6rem; }
  .ad-panel { padding: 28px 20px; border-radius: 22px; }
  .ad-panel__meter { padding: 20px; }
  .ad-panel__copy .l27-btn { width: 100%; }
  .ad-mosaic { grid-template-columns: 1fr; grid-auto-rows: 220px; }
  .ad-mosaic__tile--a, .ad-mosaic__tile--e { grid-column: auto; }
  .ad-close { padding: 96px 0 140px; }
  .ad-foot { padding-bottom: 120px; }
}
@media (prefers-reduced-motion: reduce) {
  .ad-ticker__track { animation: none; flex-wrap: wrap; width: auto; }
  .ad-ticker__run + .ad-ticker__run { display: none; }
  .ad-mosaic__tile img { transition: none; }
}
</style>
