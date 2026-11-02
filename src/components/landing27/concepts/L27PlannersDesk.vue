<script setup>
// Concept 3 — "Planner's Desk". Corporate, practical, trustworthy: built for
// planners booking rooms for a company, department or team. The stacked
// corporate widget lives in the hero card, so booking is the first thing you
// see. CONCEPT ONLY — not affiliated with IMEX; rates + blocks are sample data.
import { ref, computed, onBeforeUnmount } from 'vue'
import '../l27.css'
import L27BookingWidget from '../L27BookingWidget.vue'
import L27BookingModal from '../L27BookingModal.vue'
import L27BlockMeter from '../L27BlockMeter.vue'
import L27StayStrip from '../L27StayStrip.vue'
import L27Faq from '../L27Faq.vue'
import L27ConceptTag from '../L27ConceptTag.vue'
import { scrollToId } from '../L27Extras.js'
import { brand, photos, event, hotels, defaultStay, stayLabel } from '../imex.js'

const props = defineProps({
  initialModal: { type: Boolean, default: false },
  initialModalState: { type: String, default: 'form' },
})

// ── one booking modal, owned by the page ──
const bookOpen = ref(props.initialModal)
const modalState = ref(props.initialModalState)
const modalKey = ref(0)
const search = ref(null) // the widget's search payload, echoed in the modal
const stay = ref({ ...defaultStay })
const hotelId = ref('')
function openModal (state, { stay: s, hotel = '' } = {}) {
  if (s) stay.value = { ...s }
  hotelId.value = hotel
  modalState.value = state
  modalKey.value++
  bookOpen.value = true
}
// Hero search: the "searching" beat plays inside the hero card (the guest's eye
// is already there), then the modal opens on the results preview.
const searching = ref(false)
let timer = null
function onSearch (payload) {
  stay.value = { ...payload.stay }
  search.value = payload
  searching.value = true
  clearTimeout(timer)
  timer = setTimeout(() => { searching.value = false; openModal('results') }, 1100)
}
onBeforeUnmount(() => clearTimeout(timer))

// ── who's attending ──
const roles = [
  { id: 'exhibitor', label: 'Exhibitor', icon: 'storefront', photo: photos.showfloor, alt: 'Exhibitor stands on the IMEX America show floor',
    title: 'Arrive Sunday for booth build.', cta: 'Book this stay', stay: { arrive: '2027-09-26', depart: '2027-10-01' },
    tips: ['Stand build runs Sunday 26 and Smart Monday — check your exhibitor manual for your move-in slot.', 'Book your whole stand team at once and add each colleague’s name so every guest gets their own confirmation.', 'Mandalay Bay and Delano keep you under five minutes from your stand for early set-up and late tear-down.'] },
  { id: 'hosted', label: 'Hosted buyer', icon: 'workspace_premium', photo: photos.buyers, alt: 'Hosted buyers in appointments at IMEX America',
    title: 'Your housing is included — check your invite.', cta: 'Book extra nights', stay: { arrive: '2027-09-30', depart: '2027-10-02' },
    tips: ['The Hosted Buyer Program books your program nights for you. Your invitation lists the hotel and dates.', 'Don’t book a second room for program nights — you’d be charged for both.', 'Staying on for the weekend or bringing a colleague? Add nights at the same block rate here.'] },
  { id: 'buyer', label: 'Buyer / planner', icon: 'event_note', photo: photos.education, alt: 'Planners in an education session at IMEX America',
    title: 'Come in for Smart Monday.', cta: 'Book this stay', stay: { arrive: '2027-09-26', depart: '2027-09-30' },
    tips: ['Smart Monday education starts at 9:00 on Sept 27 — arrive Sunday so you’re fresh for the first session.', 'Booking for a department? Put every room on one company invoice and approve changes in one place.', 'Pre-scheduled appointments fill Tuesday and Wednesday; a hotel on the free tram keeps the commute painless.'] },
  { id: 'speaker', label: 'Speaker', icon: 'record_voice_over', photo: photos.designMatters, alt: 'A speaker on stage at IMEX America',
    title: 'Stay close to the stage.', cta: 'Book this stay', stay: { arrive: '2027-09-27', depart: '2027-09-30' },
    tips: ['Check in the night before your session so you can do your AV run-through in the speaker ready room.', 'Delano and Mandalay Bay connect to the venue indoors — no Las Vegas heat before you present.', 'Your company is paying? Add the cost centre and the invoice goes straight to your finance team.'] },
]
const role = ref('exhibitor')
const active = computed(() => roles.find((r) => r.id === role.value))
function onTabKey (e, i) {
  const n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
  if (!n) return
  const next = roles[(i + n + roles.length) % roles.length]
  role.value = next.id
  document.getElementById(`pd-tab-${next.id}`)?.focus()
}
function goRole (id) { role.value = id; scrollToId('pd-who') }

// ── rate table ──
const sortBy = ref('rate')
const save = (h) => Math.round((1 - h.rate / h.was) * 100)
const rows = computed(() => [...hotels].sort((a, b) => (sortBy.value === 'rate' ? a.rate - b.rate : a.walk - b.walk)))

// ── group request ──
const group = ref({ company: '', rooms: 12, email: '', stay: { ...defaultStay } })
const groupSent = ref(false)
const groupErr = ref('')
function sendGroup () {
  const g = group.value
  if (!g.company.trim() || !/^\S+@\S+\.\S+$/.test(g.email) || g.rooms < 10 || !g.stay.depart) {
    groupErr.value = 'Add your company, 10 or more rooms, your nights and a work email.'
    return
  }
  groupErr.value = ''
  groupSent.value = true
}
</script>

<template>
  <div class="l27 l27-pd">
    <l27-concept-tag label="Planner’s Desk" />

    <div class="pd-util">
      <div class="l27-wrap pd-util__in"><q-icon name="verified_user" size="16px" /> Official housing for {{ event.name }} · Block rates held until {{ event.blockDeadline }}</div>
    </div>
    <header class="pd-nav">
      <div class="l27-wrap pd-nav__in">
        <img :src="brand.logo" alt="IMEX America 2027" class="pd-nav__logo" />
        <nav class="pd-nav__links" aria-label="Who is booking">
          <button type="button" @click="goRole('exhibitor')">For exhibitors</button>
          <button type="button" @click="goRole('hosted')">For buyers</button>
          <button type="button" @click="goRole('buyer')">For planners</button>
          <button type="button" class="pd-nav__group" @click="scrollToId('pd-group')"><q-icon name="groups" size="18px" /> Need 10+ rooms?</button>
        </nav>
        <button type="button" class="l27-btn l27-btn--primary pd-nav__cta" @click="openModal('form')">Book rooms</button>
      </div>
    </header>

    <main>
      <!-- 1 · hero: booking first -->
      <section class="pd-hero" aria-labelledby="pd-h1">
        <div class="l27-wrap pd-hero__in">
          <div class="pd-hero__copy">
            <p class="l27-eyebrow pd-eyebrow"><q-icon name="verified" size="18px" /> Official IMEX America housing</p>
            <h1 id="pd-h1" class="pd-hero__h1">Book your team’s IMEX rooms <span class="l27-c-red">in minutes.</span></h1>
            <p class="l27-lead pd-hero__lead">{{ event.datesLabel }} · {{ event.venue }}. One booking for your whole company — every colleague confirmed, one invoice for finance.</p>
            <ul class="pd-checks">
              <li><q-icon name="check_circle" size="22px" /> Up to 35% below public rates</li>
              <li><q-icon name="check_circle" size="22px" /> One invoice for your company</li>
              <li><q-icon name="check_circle" size="22px" /> Free changes until Aug 27</li>
            </ul>
            <div class="pd-trust">
              <span class="pd-trust__presto"><q-icon name="bolt" size="16px" /> Concept: Powered by Presto</span>
              <span><q-icon name="lock" size="16px" /> Secure booking</span>
              <span><q-icon name="support_agent" size="16px" /> Housing team 24/7</span>
            </div>
          </div>
          <div class="pd-card" aria-labelledby="pd-card-h">
            <div class="pd-card__head">
              <h2 id="pd-card-h" class="pd-card__title">Find your hotel</h2>
              <span class="pd-card__badge">Official block</span>
            </div>
            <l27-block-meter compact class="pd-card__meter" />
            <div class="pd-card__widget" :aria-busy="searching">
              <l27-booking-widget layout="stacked" :stay="stay" cta-label="Search official hotels" @search="onSearch" />
              <div v-if="searching" class="pd-card__busy" role="status" aria-live="polite">
                <span class="pd-spin" aria-hidden="true" />
                <strong>Finding rooms near Mandalay Bay…</strong>
                <span>{{ stayLabel(stay) }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2 · booking for colleagues -->
      <section class="pd-steps" aria-labelledby="pd-steps-h">
        <div class="l27-wrap">
          <div class="pd-steps__head">
            <h2 id="pd-steps-h" class="pd-steps__h2">Booking for colleagues?</h2>
            <p>Built for planners, team leads and EAs — the whole team in one checkout.</p>
          </div>
          <ol class="pd-steps__list">
            <li><span class="pd-num">1</span><div><h3>Add your company</h3><p>Pick it from the list or type it in. We attach your billing details once.</p></div></li>
            <li><span class="pd-num">2</span><div><h3>Add rooms for each colleague</h3><p>Name, nights and room type per guest — mix arrival days for build crews.</p></div></li>
            <li><span class="pd-num">3</span><div><h3>One confirmation each, one invoice</h3><p>Guests get their own confirmation. Finance gets a single company invoice.</p></div></li>
          </ol>
        </div>
      </section>

      <!-- 3 · who's attending -->
      <section id="pd-who" class="pd-who" aria-labelledby="pd-who-h">
        <div class="l27-wrap">
          <p class="l27-eyebrow pd-eyebrow">Plan the right nights</p>
          <h2 id="pd-who-h" class="l27-h2 pd-h2">Who’s attending?</h2>
          <div class="pd-tabs" role="tablist" aria-label="Attendee type">
            <button v-for="(r, i) in roles" :id="`pd-tab-${r.id}`" :key="r.id" type="button" role="tab" class="pd-tab" :class="{ 'is-on': role === r.id }"
              :aria-selected="role === r.id" :aria-controls="`pd-panel`" :tabindex="role === r.id ? 0 : -1" @click="role = r.id" @keydown="onTabKey($event, i)">
              <q-icon :name="r.icon" size="20px" /> {{ r.label }}
            </button>
          </div>
          <div id="pd-panel" class="pd-panel" role="tabpanel" :aria-labelledby="`pd-tab-${role}`">
            <img :src="active.photo" :alt="active.alt" class="pd-panel__img" />
            <div class="pd-panel__body">
              <h3 class="pd-panel__h3">{{ active.title }}</h3>
              <ul class="pd-panel__tips">
                <li v-for="t in active.tips" :key="t"><q-icon name="arrow_forward" size="18px" /> {{ t }}</li>
              </ul>
              <div class="pd-panel__stay">
                <div><span class="pd-panel__lbl">Recommended stay</span><strong>{{ stayLabel(active.stay) }}</strong></div>
                <button type="button" class="l27-btn l27-btn--primary" @click="openModal('form', { stay: active.stay })">{{ active.cta }} <q-icon name="arrow_forward" size="18px" /></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4 · rate comparison -->
      <section class="pd-rates" aria-labelledby="pd-rates-h">
        <div class="l27-wrap">
          <div class="pd-rates__head">
            <div>
              <p class="l27-eyebrow pd-eyebrow">Compare official hotels</p>
              <h2 id="pd-rates-h" class="l27-h2 pd-h2">The IMEX rate, side by side.</h2>
            </div>
            <div class="pd-sort" role="group" aria-label="Sort hotels">
              <span>Sort by</span>
              <button type="button" :aria-pressed="sortBy === 'rate'" @click="sortBy = 'rate'">Price</button>
              <button type="button" :aria-pressed="sortBy === 'walk'" @click="sortBy = 'walk'">Walk time</button>
            </div>
          </div>
          <table class="pd-table">
            <caption class="pd-sr">Official IMEX hotels, nightly rates, sorted by {{ sortBy === 'rate' ? 'price' : 'walk time' }}</caption>
            <thead><tr><th scope="col">Hotel</th><th scope="col">To the show</th><th scope="col">Public rate</th><th scope="col">IMEX rate</th><th scope="col">You save</th><th scope="col">Rooms left</th><th scope="col"><span class="pd-sr">Book</span></th></tr></thead>
            <tbody>
              <tr v-for="h in rows" :key="h.id">
                <th scope="row" class="pd-table__hotel"><img :src="h.image" alt="" /><span><strong>{{ h.name }}</strong><small>{{ h.perks[0] }}</small></span></th>
                <td data-label="To the show">{{ h.walkLabel }}</td>
                <td data-label="Public rate"><s>${{ h.was }}</s></td>
                <td data-label="IMEX rate" class="pd-table__rate">${{ h.rate }}<small>/night</small></td>
                <td data-label="You save"><span class="pd-save">{{ save(h) }}%</span></td>
                <td data-label="Rooms left" :class="{ 'pd-low': h.left < 20 }">{{ h.left }}</td>
                <td class="pd-table__go"><button type="button" class="l27-btn l27-btn--dark" :aria-label="`Book ${h.name}`" @click="openModal('form', { hotel: h.id })">Book</button></td>
              </tr>
            </tbody>
          </table>
          <p class="pd-fine">Sample rates per room, per night, before tax. Public rates checked against major travel sites for the same nights.</p>
        </div>
      </section>

      <!-- 5 · group block request -->
      <section id="pd-group" class="pd-group" aria-labelledby="pd-group-h">
        <div class="l27-wrap pd-group__in">
          <div class="pd-group__copy">
            <p class="l27-eyebrow pd-eyebrow pd-eyebrow--light">Groups &amp; delegations</p>
            <h2 id="pd-group-h" class="l27-h2">Need 10 or more rooms?</h2>
            <p class="pd-group__lead">Bringing a sales team, a client delegation or a full stand crew? A Presto housing specialist holds a sub-block for you inside the official IMEX allocation — same rates, one contract, names added later.</p>
            <ul class="pd-group__list">
              <li><q-icon name="check" size="20px" /> Names due 30 days out, not today</li>
              <li><q-icon name="check" size="20px" /> Rooming list upload or per-guest invites</li>
              <li><q-icon name="check" size="20px" /> Master bill or individual payment</li>
            </ul>
          </div>
          <div class="pd-form-card">
            <div v-if="groupSent" class="pd-sent" role="status">
              <q-icon name="task_alt" size="44px" />
              <h3>Request received</h3>
              <p>Thanks — a Presto housing specialist will reply within 1 business day.</p>
              <p class="pd-sent__sum">{{ group.company }} · {{ group.rooms }} rooms · {{ stayLabel(group.stay) }}</p>
            </div>
            <form v-else class="pd-form" novalidate @submit.prevent="sendGroup">
              <h3 class="pd-form__h3">Request a group block</h3>
              <div class="pd-form__row">
                <label class="pd-field"><span>Company</span><input v-model="group.company" type="text" autocomplete="organization" placeholder="e.g. Northwind Events Co." /></label>
                <label class="pd-field pd-field--sm"><span>Rooms needed</span><input v-model.number="group.rooms" type="number" min="10" inputmode="numeric" /></label>
              </div>
              <div class="pd-field"><span>Nights</span><l27-stay-strip v-model="group.stay" compact /></div>
              <label class="pd-field"><span>Work email</span><input v-model="group.email" type="email" autocomplete="email" placeholder="you@company.com" /></label>
              <p v-if="groupErr" class="pd-form__err" role="alert">{{ groupErr }}</p>
              <button type="submit" class="l27-btn l27-btn--primary l27-btn--lg pd-form__go">Send request</button>
            </form>
          </div>
        </div>
      </section>

      <!-- 6 · FAQ -->
      <section class="pd-faq" aria-labelledby="pd-faq-h">
        <div class="l27-wrap pd-faq__in">
          <div>
            <p class="l27-eyebrow pd-eyebrow">Questions</p>
            <h2 id="pd-faq-h" class="l27-h2 pd-h2">Before you book</h2>
            <p class="pd-faq__note">Still stuck? The housing team answers 24/7 — chat or call +1 (800) 555-0127.</p>
          </div>
          <l27-faq tone="light" />
        </div>
      </section>
    </main>

    <footer class="pd-foot">
      <div class="l27-wrap pd-foot__in">
        <img :src="brand.logoDark" alt="IMEX America 2027" class="pd-foot__logo" />
        <p>Official housing · {{ event.datesLabel }} · {{ event.address }}</p>
        <p>Housing help 24/7: +1 (800) 555-0127 · Concept by EventPipe — not affiliated with IMEX.</p>
      </div>
    </footer>

    <l27-booking-modal :key="modalKey" v-model="bookOpen" :stay="stay" :hotel-id="hotelId" :initial-state="modalState" :search="search" />
  </div>
</template>

<style scoped>
.l27-pd { --pd-navy: var(--l27-navy); --pd-bg: #F5F6FA; }
.pd-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.pd-eyebrow { display: inline-flex; align-items: center; gap: 6px; color: var(--l27-red); margin-bottom: 12px; }
.pd-eyebrow--light { color: #FF8A8F; }
.pd-h2 { color: var(--pd-navy); }
.l27-pd button:focus-visible, .l27-pd input:focus-visible { outline: 3px solid var(--l27-blue); outline-offset: 2px; }

.l27-pd h2, .l27-pd h3 { line-height: 1.15; }

/* utility bar + nav */
.pd-util { background: var(--pd-navy); color: rgba(255,255,255,.85); font-size: 0.8125rem; font-weight: 600; }
.pd-util__in { display: flex; align-items: center; gap: 8px; height: 44px; padding-right: 480px; }
.pd-util .q-icon { color: var(--l27-yellow); }
.pd-nav { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,.96); backdrop-filter: blur(8px); border-bottom: 1px solid var(--l27-line); }
.pd-nav__in { display: flex; align-items: center; gap: 28px; height: 72px; }
.pd-nav__logo { height: 34px; width: auto; }
.pd-nav__links { display: flex; align-items: center; gap: 4px; margin-left: auto; }
.pd-nav__links button { border: 0; background: none; font: 600 0.9375rem var(--l27-font); color: var(--pd-navy); padding: 8px 12px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
.pd-nav__links button:hover { background: var(--pd-bg); }
.pd-nav__group { color: var(--l27-red) !important; }
.pd-nav__cta { height: 42px; }

/* hero */
.pd-hero { background: linear-gradient(180deg, #fff 0%, var(--pd-bg) 100%); padding: 64px 0 80px; }
.pd-hero__in { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 500px); gap: 64px; align-items: center; }
.pd-hero__h1 { font-size: clamp(2.4rem, 5vw, 4rem); font-weight: 900; line-height: 1.02; color: var(--pd-navy); }
.pd-hero__lead { margin-top: 20px; max-width: 520px; }
.pd-checks { list-style: none; padding: 0; margin: 28px 0 0; display: grid; gap: 12px; }
.pd-checks li { display: flex; align-items: center; gap: 10px; font-size: 1.125rem; font-weight: 700; color: var(--pd-navy); }
.pd-checks .q-icon { color: var(--l27-green); }
.pd-trust { display: flex; flex-wrap: wrap; gap: 10px 20px; margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--l27-line); font-size: 0.875rem; font-weight: 600; color: var(--l27-muted); }
.pd-trust span { display: inline-flex; align-items: center; gap: 6px; }
.pd-trust__presto { background: var(--pd-navy); color: #fff; padding: 5px 10px; border-radius: 999px; }
.pd-card { background: #fff; border-radius: 18px; border: 1px solid var(--l27-line); box-shadow: 0 30px 60px -30px rgba(25,29,78,.45); padding: 28px; }
.pd-card__head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.pd-card__title { font-size: 1.5rem; font-weight: 900; color: var(--pd-navy); }
.pd-card__badge { font-size: 0.75rem; font-weight: 800; color: var(--l27-green); background: #E6F2EA; padding: 4px 10px; border-radius: 999px; }
.pd-card__meter { padding: 14px 16px; background: var(--pd-bg); border-radius: 12px; margin-bottom: 20px; }
.pd-card__widget { position: relative; }
.pd-card__busy { position: absolute; inset: -6px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; background: rgba(255,255,255,.94); border-radius: 12px; color: var(--pd-navy); text-align: center; }
.pd-card__busy span:last-child { color: var(--l27-muted); font-size: 0.9375rem; }
.pd-spin { width: 40px; height: 40px; border-radius: 50%; border: 4px solid #F3D0D2; border-top-color: var(--l27-red); animation: pd-spin .8s linear infinite; }
@keyframes pd-spin { to { transform: rotate(360deg); } }

/* steps */
.pd-steps { background: var(--pd-navy); color: #fff; padding: 64px 0; }
.pd-steps__head { display: flex; justify-content: space-between; align-items: baseline; gap: 24px; flex-wrap: wrap; margin-bottom: 36px; }
.pd-steps__h2 { font-size: clamp(1.6rem, 2.6vw, 2.125rem); font-weight: 900; }
.pd-steps__head p { color: rgba(255,255,255,.75); font-size: 1.0625rem; }
.pd-steps__list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
.pd-steps__list li { display: flex; gap: 16px; align-items: flex-start; }
.pd-steps__list h3 { font-size: 1.1875rem; font-weight: 800; margin-bottom: 6px; }
.pd-steps__list p { color: rgba(255,255,255,.75); line-height: 1.5; }
.pd-num { flex: none; width: 44px; height: 44px; border-radius: 50%; background: var(--l27-red); display: grid; place-items: center; font-weight: 900; font-size: 1.125rem; }

/* who's attending */
.pd-who { padding: 88px 0; }
.pd-tabs { display: flex; gap: 8px; margin: 28px 0 24px; flex-wrap: wrap; }
.pd-tab { display: inline-flex; align-items: center; gap: 8px; height: 46px; padding: 0 18px; border: 1.5px solid var(--l27-line); border-radius: 999px; background: #fff; font: 700 0.9375rem var(--l27-font); color: var(--pd-navy); cursor: pointer; }
.pd-tab:hover { border-color: var(--pd-navy); }
.pd-tab.is-on { background: var(--pd-navy); border-color: var(--pd-navy); color: #fff; }
.pd-panel { display: grid; grid-template-columns: 1fr 1.1fr; border: 1px solid var(--l27-line); border-radius: 18px; overflow: hidden; background: #fff; }
.pd-panel__img { width: 100%; height: 100%; min-height: 340px; object-fit: cover; display: block; }
.pd-panel__body { padding: 40px; display: flex; flex-direction: column; }
.pd-panel__h3 { font-size: 1.75rem; font-weight: 900; color: var(--pd-navy); }
.pd-panel__tips { list-style: none; padding: 0; margin: 20px 0 28px; display: grid; gap: 14px; }
.pd-panel__tips li { display: flex; gap: 10px; line-height: 1.5; color: #33354D; }
.pd-panel__tips .q-icon { color: var(--l27-red); margin-top: 3px; flex: none; }
.pd-panel__stay { margin-top: auto; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; padding: 18px 20px; background: var(--pd-bg); border-radius: 12px; }
.pd-panel__stay strong { display: block; font-size: 1.125rem; color: var(--pd-navy); }
.pd-panel__lbl { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--l27-muted); }

/* rates */
.pd-rates { background: var(--pd-bg); padding: 88px 0; }
.pd-rates__head { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; flex-wrap: wrap; margin-bottom: 28px; }
.pd-sort { display: inline-flex; align-items: center; gap: 4px; background: #fff; border: 1px solid var(--l27-line); border-radius: 999px; padding: 4px 4px 4px 14px; font-size: 0.875rem; font-weight: 600; color: var(--l27-muted); }
.pd-sort span { margin-right: 6px; }
.pd-sort button { border: 0; background: none; height: 36px; padding: 0 16px; border-radius: 999px; font: 700 0.875rem var(--l27-font); color: var(--pd-navy); cursor: pointer; }
.pd-sort button[aria-pressed="true"] { background: var(--pd-navy); color: #fff; }
.pd-table { width: 100%; border-collapse: separate; border-spacing: 0; background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid var(--l27-line); }
.pd-table th, .pd-table td { padding: 14px 16px; text-align: left; border-bottom: 1px solid var(--l27-line); font-size: 0.9375rem; vertical-align: middle; }
.pd-table thead th { background: #fff; font-size: 0.75rem; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: var(--l27-muted); }
.pd-table tbody tr:last-child > * { border-bottom: 0; }
.pd-table tbody tr:hover { background: #FAFAFD; }
.pd-table__hotel { display: flex; align-items: center; gap: 14px; }
.pd-table__hotel img { width: 64px; height: 48px; border-radius: 8px; object-fit: cover; flex: none; }
.pd-table__hotel strong { display: block; color: var(--pd-navy); font-size: 1rem; }
.pd-table__hotel small { color: var(--l27-muted); font-weight: 500; }
.pd-table s { color: var(--l27-muted); }
.pd-table__rate { font-size: 1.25rem !important; font-weight: 900; color: var(--pd-navy); }
.pd-table__rate small { font-size: 0.75rem; font-weight: 600; color: var(--l27-muted); }
.pd-save { display: inline-block; background: #E6F2EA; color: var(--l27-green); font-weight: 800; padding: 3px 10px; border-radius: 999px; }
.pd-low { color: var(--l27-red); font-weight: 800; }
.pd-table__go { text-align: right !important; }
.pd-table__go .l27-btn { height: 40px; padding: 0 20px; background: var(--pd-navy); }
.pd-fine { margin-top: 14px; font-size: 0.8125rem; color: var(--l27-muted); }

/* group */
.pd-group { background: var(--l27-navy-deep); color: #fff; padding: 88px 0; }
.pd-group__in { display: grid; grid-template-columns: 1fr minmax(0, 540px); gap: 64px; align-items: center; }
.pd-group__lead { margin-top: 16px; font-size: 1.125rem; line-height: 1.55; color: rgba(255,255,255,.8); }
.pd-group__list { list-style: none; padding: 0; margin: 24px 0 0; display: grid; gap: 10px; font-weight: 600; }
.pd-group__list li { display: flex; align-items: center; gap: 10px; }
.pd-group__list .q-icon { color: var(--l27-yellow); }
.pd-form-card { background: #fff; color: var(--l27-ink); border-radius: 18px; padding: 32px; }
.pd-form { display: grid; gap: 18px; }
.pd-form__h3 { font-size: 1.375rem; font-weight: 900; color: var(--pd-navy); }
.pd-form__row { display: grid; grid-template-columns: 1fr 140px; gap: 14px; }
.pd-field { display: grid; gap: 6px; min-width: 0; }
.pd-field > span { font-size: 0.8125rem; font-weight: 700; color: var(--l27-muted); }
.pd-field input { height: 48px; border: 1.5px solid var(--l27-line); border-radius: 10px; padding: 0 14px; font: 600 1rem var(--l27-font); color: var(--l27-ink); width: 100%; }
.pd-field input:focus { border-color: var(--pd-navy); }
.pd-form__err { color: var(--l27-red); font-weight: 600; font-size: 0.9375rem; }
.pd-form__go { width: 100%; }
.pd-sent { text-align: center; padding: 40px 12px; }
.pd-sent .q-icon { color: var(--l27-green); }
.pd-sent h3 { font-size: 1.5rem; font-weight: 900; color: var(--pd-navy); margin: 12px 0 8px; }
.pd-sent p { color: var(--l27-muted); line-height: 1.5; }
.pd-sent__sum { margin-top: 12px; font-weight: 700; color: var(--pd-navy) !important; }

/* faq + footer */
.pd-faq { padding: 88px 0; }
.pd-faq__in { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 64px; align-items: start; }
.pd-faq__note { margin-top: 16px; color: var(--l27-muted); line-height: 1.55; }
.pd-foot { background: var(--pd-navy); color: rgba(255,255,255,.75); padding: 48px 0; font-size: 0.875rem; }
.pd-foot__in { display: grid; gap: 10px; }
.pd-foot__logo { height: 34px; width: auto; margin-bottom: 8px; }

/* responsive */
@media (max-width: 1080px) {
  .pd-nav__links button:not(.pd-nav__group) { display: none; }
  .pd-hero__in, .pd-group__in, .pd-faq__in { grid-template-columns: 1fr; gap: 40px; }
  .pd-card { max-width: 560px; }
  .pd-panel { grid-template-columns: 1fr; }
  .pd-panel__img { min-height: 0; aspect-ratio: 16 / 8; }
}
@media (max-width: 760px) {
  .pd-nav__links { display: none; }
  .pd-util { display: none; }
  .pd-nav__cta { margin-left: auto; }
  .pd-nav__in { height: 64px; }
  .pd-nav__logo { height: 28px; }
  .pd-hero { padding: 36px 0 48px; }
  .pd-card { padding: 20px 16px; }
  .pd-steps__list { grid-template-columns: 1fr; gap: 24px; }
  .pd-who, .pd-rates, .pd-group, .pd-faq { padding: 56px 0; }
  .pd-panel__body { padding: 24px 20px; }
  .pd-panel__h3 { font-size: 1.375rem; }
  .pd-panel__stay .l27-btn { width: 100%; }
  .pd-table, .pd-table tbody, .pd-table tr, .pd-table td, .pd-table th { display: block; }
  .pd-table thead { display: none; }
  .pd-table { background: none; border: 0; border-radius: 0; overflow: visible; }
  .pd-table tbody { display: grid; gap: 12px; }
  .pd-table tbody tr { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); background: #fff; border: 1px solid var(--l27-line); border-radius: 14px; padding: 6px 0; }
  .pd-table tbody tr > * { border-bottom: 0; padding: 8px 16px; }
  .pd-table th.pd-table__hotel { grid-column: 1 / -1; display: flex; padding-top: 12px; }
  .pd-table td[data-label]::before { content: attr(data-label); display: block; font-size: 0.6875rem; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: var(--l27-muted); margin-bottom: 2px; }
  .pd-table__go { grid-column: 1 / -1; }
  .pd-table__go .l27-btn { width: 100%; }
  .pd-form-card { padding: 24px 16px; }
  .pd-form__row { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) { .pd-spin { animation: none; } }
</style>
