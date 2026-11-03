<script setup>
// L27BookingWidget — the Presto booking widget re-thought for corporate events
// (Christine, 11/2: "the team selector becomes company/department"). Fields:
//   Company / organization (search or type a new one) · Attendee type
//   (Exhibitor, Hosted buyer…) · Your stay (event-aware nights, not a blank
//   calendar) · Rooms & guests → Search hotels.
// Layouts:
//   bar     → one horizontal row with popovers (heroes, sticky bars)
//   stacked → everything inline, top to bottom (modal, side panel, hero card)
// Emits `search` with { organization, attendeeType, stay, rooms, guests }.
import { ref, reactive, computed, watch } from 'vue'
import L27StayStrip from './L27StayStrip.vue'
import './l27.css'
import { organizations, attendeeTypes, defaultStay, stayLabel } from './imex.js'

const props = defineProps({
  layout: { type: String, default: 'bar' }, // bar | stacked
  tone: { type: String, default: 'light' }, // light | dark (bar only)
  stay: { type: Object, default: () => ({ ...defaultStay }) },
  organization: { type: String, default: '' },
  attendeeType: { type: String, default: '' },
  ctaLabel: { type: String, default: 'Search hotels' },
  // Hide the organization/attendee fields (plain dates + guests search).
  showCorporate: { type: Boolean, default: true },
})
const emit = defineEmits(['search'])

const org = ref(props.organization)
const orgQuery = ref('')
const type = ref(props.attendeeType)
const stayModel = ref({ ...props.stay })
watch(() => props.stay, (v) => { stayModel.value = { ...v } }, { deep: true })
const party = reactive({ rooms: 1, guests: 1 })

const orgOptions = computed(() => {
  const q = orgQuery.value.trim().toLowerCase()
  return organizations.filter((o) => o.toLowerCase().includes(q))
})
const canUseTyped = computed(() => {
  const q = orgQuery.value.trim()
  return q.length > 1 && !organizations.some((o) => o.toLowerCase() === q.toLowerCase())
})
const typeLabel = computed(() => attendeeTypes.find((t) => t.value === type.value)?.label || '')
const partyLabel = computed(() => `${party.rooms} room${party.rooms === 1 ? '' : 's'} · ${party.guests} guest${party.guests === 1 ? '' : 's'}`)
const stayReady = computed(() => !!(stayModel.value.arrive && stayModel.value.depart))

const menus = reactive({ org: false, type: false, stay: false, party: false })
function chooseOrg (name, close = true) { org.value = name; orgQuery.value = ''; if (close) menus.org = false }
function chooseType (v) { type.value = v; menus.type = false }
function step (k, dlt) {
  party[k] = Math.max(1, party[k] + dlt)
  if (party.guests < party.rooms) party.guests = party.rooms
}
watch(() => stayModel.value.depart, (v) => { if (v && props.layout === 'bar') menus.stay = false })

const tried = ref(false)
function submit () {
  tried.value = true
  if (!stayReady.value) { if (props.layout === 'bar') menus.stay = true; return }
  emit('search', { organization: org.value, attendeeType: type.value, stay: { ...stayModel.value }, rooms: party.rooms, guests: party.guests })
}
</script>

<template>
  <!-- ── BAR LAYOUT ─────────────────────────────────────────────── -->
  <div v-if="layout === 'bar'" class="l27bw l27bw--bar" :class="`l27bw--${tone}`">
    <template v-if="showCorporate">
      <button type="button" class="l27bw__field" :class="{ 'is-empty': !org }" aria-haspopup="dialog">
        <q-icon name="business" size="22px" class="l27bw__ico" />
        <span class="l27bw__txt"><span class="l27bw__lbl">Company / organization</span><span class="l27bw__val">{{ org || 'Search or add yours' }}</span></span>
        <q-menu v-model="menus.org" class="l27bw-menu" :offset="[0, 10]" anchor="bottom left" self="top left">
          <div class="l27bw-pop" style="width:340px">
            <input v-model="orgQuery" class="l27bw-pop__input" placeholder="Type your company name" aria-label="Company name" @keydown.enter.prevent="canUseTyped ? chooseOrg(orgQuery.trim()) : orgOptions[0] && chooseOrg(orgOptions[0])" />
            <button v-if="canUseTyped" type="button" class="l27bw-pop__opt l27bw-pop__opt--new" @click="chooseOrg(orgQuery.trim())"><q-icon name="add_circle" size="18px" /> Use “{{ orgQuery.trim() }}”</button>
            <button v-for="o in orgOptions" :key="o" type="button" class="l27bw-pop__opt" :class="{ 'is-on': o === org }" @click="chooseOrg(o)">{{ o }}<q-icon v-if="o === org" name="check" size="18px" /></button>
          </div>
        </q-menu>
      </button>

      <button type="button" class="l27bw__field" :class="{ 'is-empty': !type }" aria-haspopup="dialog">
        <q-icon name="badge" size="22px" class="l27bw__ico" />
        <span class="l27bw__txt"><span class="l27bw__lbl">Attending as</span><span class="l27bw__val">{{ typeLabel || 'Choose one' }}</span></span>
        <q-menu v-model="menus.type" class="l27bw-menu" :offset="[0, 10]">
          <div class="l27bw-pop l27bw-pop--grid" style="width:360px">
            <button v-for="t in attendeeTypes" :key="t.value" type="button" class="l27bw-type" :class="{ 'is-on': t.value === type }" @click="chooseType(t.value)">
              <q-icon :name="t.icon" size="22px" /><span>{{ t.label }}</span>
            </button>
          </div>
        </q-menu>
      </button>
    </template>

    <button type="button" class="l27bw__field l27bw__field--stay" :class="{ 'is-error': tried && !stayReady }" aria-haspopup="dialog">
      <q-icon name="calendar_month" size="22px" class="l27bw__ico" />
      <span class="l27bw__txt"><span class="l27bw__lbl">Your stay</span><span class="l27bw__val">{{ stayLabel(stayModel) }}</span></span>
      <q-menu v-model="menus.stay" class="l27bw-menu" :offset="[0, 10]">
        <div class="l27bw-pop" style="width:min(620px, 92vw)">
          <l27-stay-strip v-model="stayModel" />
        </div>
      </q-menu>
    </button>

    <button type="button" class="l27bw__field" aria-haspopup="dialog">
      <q-icon name="group" size="22px" class="l27bw__ico" />
      <span class="l27bw__txt"><span class="l27bw__lbl">Rooms & guests</span><span class="l27bw__val">{{ partyLabel }}</span></span>
      <q-menu v-model="menus.party" class="l27bw-menu" :offset="[0, 10]">
        <div class="l27bw-pop" style="width:300px">
          <div v-for="k in ['rooms', 'guests']" :key="k" class="l27bw-step">
            <span class="l27bw-step__lbl">{{ k === 'rooms' ? 'Rooms' : 'Guests' }}</span>
            <button type="button" class="l27bw-step__btn" :aria-label="`Fewer ${k}`" :disabled="party[k] <= 1" @click="step(k, -1)">−</button>
            <span class="l27bw-step__val">{{ party[k] }}</span>
            <button type="button" class="l27bw-step__btn" :aria-label="`More ${k}`" @click="step(k, 1)">+</button>
          </div>
          <p class="l27bw-pop__note">Booking for colleagues? Add rooms — each guest gets their own confirmation.</p>
        </div>
      </q-menu>
    </button>

    <button type="button" class="l27-btn l27-btn--primary l27bw__go" @click="submit"><q-icon name="search" size="20px" /> {{ ctaLabel }}</button>
  </div>

  <!-- ── STACKED LAYOUT ─────────────────────────────────────────── -->
  <div v-else class="l27bw l27bw--stacked">
    <template v-if="showCorporate">
      <label class="l27bw-s__block">
        <span class="l27bw-s__lbl">Company / organization</span>
        <div class="l27bw-s__orgwrap">
          <q-icon name="business" size="20px" />
          <input :value="org || orgQuery" class="l27bw-s__input" placeholder="Search or type your company" list="l27-orgs" @input="org = ''; orgQuery = $event.target.value" @change="org = $event.target.value.trim(); orgQuery = ''" />
          <datalist id="l27-orgs"><option v-for="o in organizations" :key="o" :value="o" /></datalist>
        </div>
      </label>
      <div class="l27bw-s__block">
        <span class="l27bw-s__lbl">Attending as</span>
        <div class="l27bw-s__types" role="radiogroup" aria-label="Attending as">
          <button v-for="t in attendeeTypes" :key="t.value" type="button" role="radio" :aria-checked="t.value === type" class="l27bw-type" :class="{ 'is-on': t.value === type }" @click="type = t.value">
            <q-icon :name="t.icon" size="20px" /><span>{{ t.label }}</span>
          </button>
        </div>
      </div>
    </template>
    <div class="l27bw-s__block">
      <span class="l27bw-s__lbl">Your stay</span>
      <l27-stay-strip v-model="stayModel" compact />
      <small v-if="tried && !stayReady" class="l27bw-s__err">Pick your check-in and check-out to search.</small>
    </div>
    <div class="l27bw-s__block l27bw-s__party">
      <div v-for="k in ['rooms', 'guests']" :key="k" class="l27bw-step">
        <span class="l27bw-step__lbl">{{ k === 'rooms' ? 'Rooms' : 'Guests' }}</span>
        <button type="button" class="l27bw-step__btn" :aria-label="`Fewer ${k}`" :disabled="party[k] <= 1" @click="step(k, -1)">−</button>
        <span class="l27bw-step__val">{{ party[k] }}</span>
        <button type="button" class="l27bw-step__btn" :aria-label="`More ${k}`" @click="step(k, 1)">+</button>
      </div>
    </div>
    <button type="button" class="l27-btn l27-btn--primary l27-btn--lg l27bw__go l27bw__go--full" @click="submit"><q-icon name="search" size="20px" /> {{ ctaLabel }}</button>
  </div>
</template>

<style scoped>
.l27bw { font-family: var(--l27-font); }
/* bar */
.l27bw--bar { display: flex; align-items: stretch; gap: 0; background: #fff; border-radius: var(--l27-radius); padding: 8px; box-shadow: var(--l27-shadow); border: 1px solid var(--l27-line); }
.l27bw__field { flex: 1 1 0; min-width: 0; display: flex; align-items: center; gap: 10px; padding: 10px 14px; border: 0; border-radius: 10px; background: transparent; text-align: left; cursor: pointer; font-family: inherit; color: var(--l27-ink); position: relative; }
.l27bw__field + .l27bw__field::before { content: ''; position: absolute; left: 0; top: 14px; bottom: 14px; width: 1px; background: var(--l27-line); }
.l27bw__field:hover { background: #F6F4F8; }
.l27bw__field:focus-visible { outline: 3px solid var(--l27-blue); outline-offset: -3px; }
.l27bw__field--stay { flex: 1.35 1 0; }
.l27bw__field.is-error .l27bw__val { color: var(--l27-red); }
.l27bw__ico { color: var(--l27-red); flex: none; }
.l27bw__txt { display: flex; flex-direction: column; min-width: 0; }
.l27bw__lbl { font-size: 0.75rem; font-weight: 700; color: var(--l27-muted); letter-spacing: .02em; }
.l27bw__val { font-size: 0.9875rem; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.l27bw__field.is-empty .l27bw__val { font-weight: 500; color: #8A8A96; }
.l27bw__go { height: auto; min-height: 56px; margin-left: 6px; border-radius: 10px; flex: none; }
.l27bw--dark.l27bw--bar { background: rgba(14, 16, 51, 0.72); border-color: rgba(255,255,255,.14); backdrop-filter: blur(14px); }
.l27bw--dark .l27bw__field { color: #fff; }
.l27bw--dark .l27bw__field:hover { background: rgba(255,255,255,.08); }
.l27bw--dark .l27bw__lbl { color: rgba(255,255,255,.65); }
.l27bw--dark .l27bw__field.is-empty .l27bw__val { color: rgba(255,255,255,.55); }
.l27bw--dark .l27bw__ico { color: var(--l27-yellow); }
.l27bw--dark .l27bw__field + .l27bw__field::before { background: rgba(255,255,255,.14); }
@media (max-width: 900px) {
  .l27bw--bar { flex-direction: column; }
  .l27bw__field + .l27bw__field::before { left: 14px; right: 14px; top: 0; bottom: auto; width: auto; height: 1px; }
  .l27bw__go { margin: 6px 0 0; }
}
/* stacked */
.l27bw--stacked { display: flex; flex-direction: column; gap: 18px; }
.l27bw-s__block { display: flex; flex-direction: column; gap: 8px; }
.l27bw-s__lbl { font-size: 0.8125rem; font-weight: 800; letter-spacing: .02em; }
.l27bw-s__orgwrap { display: flex; align-items: center; gap: 10px; height: 50px; padding: 0 14px; border: 1.5px solid var(--l27-line); border-radius: 10px; color: var(--l27-red); }
.l27bw-s__orgwrap:focus-within { border-color: var(--l27-ink); }
.l27bw-s__input { flex: 1; border: 0; outline: 0; font-family: inherit; font-size: 1rem; color: var(--l27-ink); background: transparent; height: 100%; }
.l27bw-s__types { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
@media (max-width: 520px) { .l27bw-s__types { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.l27bw-s__party { flex-direction: row; gap: 24px; flex-wrap: wrap; }
.l27bw-s__err { color: var(--l27-red); font-weight: 600; font-size: 0.8125rem; }
.l27bw__go--full { width: 100%; margin: 0; }
/* shared bits */
.l27bw-type { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border: 1.5px solid var(--l27-line); border-radius: 10px; background: #fff; font-family: var(--l27-font); font-size: 0.875rem; font-weight: 700; color: var(--l27-ink); cursor: pointer; text-align: left; }
.l27bw-type .q-icon { color: var(--l27-muted); }
.l27bw-type:hover { border-color: var(--l27-ink); }
.l27bw-type.is-on { border-color: var(--l27-red); background: #FDEBEC; }
.l27bw-type.is-on .q-icon { color: var(--l27-red); }
.l27bw-step { display: flex; align-items: center; gap: 12px; }
.l27bw-step__lbl { font-weight: 700; min-width: 56px; }
.l27bw-step__btn { width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid var(--l27-line); background: #fff; font-size: 1.25rem; line-height: 1; cursor: pointer; color: var(--l27-ink); font-family: var(--l27-font); }
.l27bw-step__btn:hover:not(:disabled) { border-color: var(--l27-ink); }
.l27bw-step__btn:disabled { opacity: .4; cursor: not-allowed; }
.l27bw-step__val { min-width: 20px; text-align: center; font-weight: 800; }
</style>

<style>
/* Popovers are teleported by Quasar — unscoped, prefixed. */
.l27bw-menu { border-radius: 14px !important; box-shadow: 0 24px 60px -20px rgba(25,29,78,.45) !important; font-family: 'Figtree', system-ui, sans-serif; --l27-red: #E30613; --l27-ink: #1D1D1B; --l27-muted: #5B5B66; --l27-line: #E6E3EA; --l27-pink: #FBE3EA; --l27-blue: #4D92CF; --l27-yellow: #FFD100; --l27-font: 'Figtree', system-ui, sans-serif; color: #1D1D1B; }
.l27bw-pop { padding: 14px; display: flex; flex-direction: column; gap: 4px; }
.l27bw-pop--grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.l27bw-pop__input { height: 44px; border: 1.5px solid #E6E3EA; border-radius: 10px; padding: 0 12px; font: inherit; font-size: 1rem; margin-bottom: 6px; outline: 0; }
.l27bw-pop__input:focus { border-color: #1D1D1B; }
.l27bw-pop__opt { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px; border: 0; border-radius: 8px; background: none; font: inherit; font-size: 0.9375rem; text-align: left; cursor: pointer; color: #1D1D1B; }
.l27bw-pop__opt:hover { background: #F6F4F8; }
.l27bw-pop__opt.is-on { font-weight: 800; color: #E30613; }
.l27bw-pop__opt--new { justify-content: flex-start; font-weight: 700; color: #E30613; }
.l27bw-pop__note { margin: 10px 0 0; font-size: 0.8125rem; color: #5B5B66; line-height: 1.4; }
.l27bw-pop .l27bw-step { display: flex; align-items: center; gap: 12px; padding: 6px 0; }
.l27bw-pop .l27bw-step__lbl { flex: 1; font-weight: 700; }
.l27bw-pop .l27bw-step__btn { width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid #E6E3EA; background: #fff; font-size: 1.25rem; cursor: pointer; }
.l27bw-pop .l27bw-step__btn:disabled { opacity: .4; cursor: not-allowed; }
.l27bw-pop .l27bw-step__val { min-width: 20px; text-align: center; font-weight: 800; }
.l27bw-pop .l27bw-type { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border: 1.5px solid #E6E3EA; border-radius: 10px; background: #fff; font: inherit; font-size: 0.875rem; font-weight: 700; cursor: pointer; text-align: left; color: #1D1D1B; }
.l27bw-pop .l27bw-type .q-icon { color: #5B5B66; }
.l27bw-pop .l27bw-type.is-on { border-color: #E30613; background: #FDEBEC; }
.l27bw-pop .l27bw-type.is-on .q-icon { color: #E30613; }
</style>
