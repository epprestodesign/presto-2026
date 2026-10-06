<script setup>
// HotelBrowser — the sketch's hotel block, built from the Presto library and its
// responsive conventions (Browse Hotels in Storybook):
//   ≥ 700px  filter rail (FilterRail inline) beside the results; search fields in a row;
//            results toolbar = count · Sort (pill) · Map
//   600–699  same pieces stacked in one column
//   ≤ 600px  the library's phone pattern: SearchSummaryBar (pencil → fields),
//            [Filters] [Map] side by side, full-width "Sort By" box
// Cards are HotelCardHorizontal in Group-Block mode ("Starting price · Select
// Rooms" + Availability panel) at every size. Emits the priced selection; the
// host checkout owns the order.
//
//   layout="inline" → Version A, inside the Add-ons step (iframe is 600px wide)
//   layout="modal"  → Version B, inside a 900px DsModal (full-screen on phones)
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import HotelDetail from './HotelDetail.vue'
import PayChoice from './PayChoice.vue'
import SearchSummaryBar from '@lib/components/browse/SearchSummaryBar.vue'
import FilterRail from '@lib/components/browse/FilterRail.vue'
import SortDropdown from '@lib/components/browse/SortDropdown.vue'
import HotelCardHorizontal from '@lib/components/browse/HotelCardHorizontal.vue'
import HotelCardGroup from '@lib/components/browse/HotelCardGroup.vue'
import HotelMap from '@lib/components/HotelMap.vue'
import DsModal from '@lib/components/DsModal.vue'
import { HOTELS, STAYS, ROOM_TYPES, NIGHTS, EVENT_LOCATION, PAGE_SIZE, quote, money } from './hotels.js'

const props = defineProps({
  party: { type: Number, default: 1 },
  initial: { type: Object, default: null }, // an existing quote to restore
  layout: { type: String, default: 'inline' }, // inline | modal | page (E/F full booking page)
  showPay: { type: Boolean, default: true }, // modal: payment moves to the review step
})
const emit = defineEmits(['update:quote', 'selected'])

// ── search ──
const stay = ref(props.initial?.stay || 'fri-sun')
const rooms = ref(props.initial?.rooms || 1)
const roomType = ref(props.initial?.roomType || 'queen')
const editing = ref(false)
const stayObj = computed(() => STAYS.find((s) => s.id === stay.value))
const guestsLabel = computed(() => `${rooms.value} ${rooms.value === 1 ? 'room' : 'rooms'} · ${props.party} ${props.party === 1 ? 'guest' : 'guests'}`)

// ── filters (the library's FilterRail emits { amenities, budget, minStars, roomTypes, ... }) ──
const filters = ref({})
const onFilters = (f) => {
  filters.value = f || {}
  const rt = ROOM_TYPES.find((r) => (f?.roomTypes || []).includes(r.filter))
  if (rt) roomType.value = rt.id
}
const sort = ref('distance')
const mapOpen = ref(false)

const minLeft = (h) => Math.min(...stayObj.value.nights.map((n) => h.left[n]))
const matches = (h) => {
  const f = filters.value
  if (f.minStars && h.stars < f.minStars) return false
  if (f.amenities?.length && !f.amenities.every((a) => h.amenities.includes(a))) return false
  if (f.propertyQuery?.trim() && !h.name.toLowerCase().includes(f.propertyQuery.trim().toLowerCase())) return false
  if (f.budget && f.budget.max !== '' && f.budget.max != null) {
    const nightly = h.rates[roomType.value]
    const cap = f.budget.basis === 'total' ? f.budget.max / stayObj.value.nights.length : f.budget.max
    if (nightly > cap) return false
  }
  return minLeft(h) >= rooms.value
}
const results = computed(() => {
  const list = HOTELS.filter(matches)
  const by = {
    distance: (a, b) => a.miles - b.miles,
    price_asc: (a, b) => a.rates[roomType.value] - b.rates[roomType.value],
    price_desc: (a, b) => b.rates[roomType.value] - a.rates[roomType.value],
    guest_rating: (a, b) => b.stars - a.stars,
  }[sort.value]
  return by ? [...list].sort(by) : list
})

// ── pagination (library: Navigation / Pagination → QPagination, "Rich" config) ──
const page = ref(1)
const pages = computed(() => Math.max(1, Math.ceil(results.value.length / PAGE_SIZE)))
const paged = computed(() => results.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE))
const rangeLabel = computed(() => {
  const n = results.value.length
  if (!n) return ''
  const from = (page.value - 1) * PAGE_SIZE + 1
  return `Showing ${from}–${Math.min(n, page.value * PAGE_SIZE)} of ${n}`
})
watch([filters, sort, rooms, roomType, stay], () => { page.value = 1 }, { deep: true })
const listTop = ref(null)
watch(page, () => nextTick(() => listTop.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })))

const roomsFor = (h) =>
  ROOM_TYPES.map((r) => ({
    type: r.label,
    nightly: h.rates[r.id],
    nights: NIGHTS.filter((n) => n.key !== 'thu' || stay.value === 'thu-sun').map((n) => ({ date: n.label, roomsLeft: Math.max(0, h.left[n.key] - (r.id === 'king' ? 3 : 0)) })),
  }))
// Map popups link to the hotel's details page: the library renders <a href=url>,
// so each hotel gets a "#hotel=<id>" link that the hashchange handler opens.
const mapHotels = computed(() =>
  results.value.map((h) => ({ id: h.id, name: h.name, location: `${h.miles} mi from Sandy Oaks Ranch`, lat: h.lat, lng: h.lng, price: h.rates[roomType.value], rating: h.stars, url: `#hotel=${h.id}` })),
)

// ── hotel details (library HotelDetailPage) ──
const root = ref(null)
const detailId = ref(null)
const detailHotel = computed(() => HOTELS.find((h) => h.id === detailId.value) || null)
function openDetail (id) {
  mapOpen.value = false
  detailId.value = id
  nextTick(() => root.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}
function closeDetail () {
  const id = detailId.value
  detailId.value = null
  nextTick(() => root.value?.querySelector(`[data-hotel="${id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
}
function onReserve ({ hotelId, roomType: rt }) {
  roomType.value = rt
  selectedId.value = hotelId
  detailId.value = null
  if (!props.showPay) { emit('selected', current.value); return }
  nextTick(() => payRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
}
// hotel names in the results open details (the card renders the name as an <h3>)
function onListClick (e) {
  const name = e.target.closest('.hch__name')
  const item = name && e.target.closest('[data-hotel]')
  if (item) openDetail(item.dataset.hotel)
}
function onHash () {
  const m = location.hash.match(/^#hotel=(.+)$/)
  if (!m) return
  history.replaceState(null, '', location.pathname + location.search)
  openDetail(m[1])
}

// The map draws the venue as an unlabelled pulse — tag it so it reads as the race.
let pulseObs
function labelVenue () {
  document.querySelectorAll('.hm-pulse:not([data-venue])').forEach((el) => {
    el.dataset.venue = '1'
    const tag = document.createElement('div')
    tag.className = 'hb-venue'
    tag.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M5 21V4M5 4h11l-2 4 2 4H5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/></svg><span><b>Sandy Oaks Ranch</b> · Race venue</span>'
    el.appendChild(tag)
  })
}
// Reservation actions from the order summary (WeekendCard)
function editSelected () {
  if (!selectedId.value) return
  detailId.value = null
  const i = results.value.findIndex((h) => h.id === selectedId.value)
  if (i >= 0) page.value = Math.floor(i / PAGE_SIZE) + 1
  nextTick(() => root.value?.querySelector(`[data-hotel="${selectedId.value}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
}
function resetSelection () {
  selectedId.value = null
  payOption.value = 'first'
  detailId.value = null
  page.value = 1
  nextTick(() => root.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}
onMounted(() => {
  window.addEventListener('ew:edit-hotel', editSelected)
  window.addEventListener('ew:reset-hotel', resetSelection)
  window.addEventListener('hashchange', onHash)
  pulseObs = new MutationObserver(labelVenue)
  pulseObs.observe(document.body, { childList: true, subtree: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('ew:edit-hotel', editSelected)
  window.removeEventListener('ew:reset-hotel', resetSelection)
  window.removeEventListener('hashchange', onHash)
  pulseObs?.disconnect()
})

// ── selection ──
const selectedId = ref(props.initial?.hotelId || null)
const payOption = ref(props.initial?.payOption || 'first')
const selected = computed(() => HOTELS.find((h) => h.id === selectedId.value) || null)
const opts = (pay) => ({ roomType: roomType.value, rooms: rooms.value, stay: stay.value, payOption: pay })
const current = computed(() => (selected.value ? quote(selected.value, opts(payOption.value)) : null))
watch(current, (q) => emit('update:quote', q), { deep: true })

const payRef = ref(null)
async function pick (h) {
  // modal (review step): Select Rooms always picks + advances, never toggles off
  if (!props.showPay) { selectedId.value = h.id; emit('selected', current.value); return }
  selectedId.value = selectedId.value === h.id ? null : h.id
  if (selectedId.value) {
    await nextTick()
    payRef.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }
}
</script>

<template>
  <section ref="root" class="hb" :class="`hb--${layout}`">
    <header v-if="layout === 'inline'" class="hb__banner">
      <h3 class="hb__title">Hotel for {{ party }} {{ party === 1 ? 'guest' : 'guests' }}</h3>
      <p class="hb__note">Free cancellation until Nov 13. Every room night supports the event.</p>
    </header>

    <hotel-detail
      v-if="detailHotel"
      class="hb__detail"
      :hotel="detailHotel"
      :stay="stay"
      :rooms="rooms"
      @back="closeDetail"
      @reserve="onReserve"
    />

    <div v-show="!detailHotel" class="hb__body">
      <!-- SEARCH — phones: one-line summary + pencil; larger: the fields in a row -->
      <div class="hb__search">
        <search-summary-bar
          class="hb__summary"
          location="Near Sandy Oaks Ranch, Devine, TX"
          :dates="stayObj.label"
          :guests="guestsLabel"
          :expanded="editing"
          @edit="editing = !editing"
        />
        <div class="hb__fields" :class="{ 'is-open': editing }">
          <q-select v-model="stay" :options="STAYS" option-value="id" option-label="label" emit-value map-options outlined dense label="Check in / out" class="hb__f hb__f--stay" />
          <q-select v-model="rooms" :options="[1, 2, 3, 4]" outlined dense label="# of rooms" class="hb__f" />
          <q-select v-model="roomType" :options="ROOM_TYPES" option-value="id" option-label="label" emit-value map-options outlined dense label="Room type" class="hb__f" />
          <q-btn unelevated no-caps color="primary" label="Update search" class="hb__apply" @click="editing = false" />
        </div>
      </div>

      <div class="hb__grid">
        <!-- LEFT: the library filter rail (inline rail ≥600, "Filters" sheet on phones) -->
        <aside class="hb__side">
          <div class="hb__bar">
            <filter-rail class="hb__rail" :result-count="results.length" @update:filters="onFilters" />
            <button type="button" class="hb__mapbtn hb__mapbtn--phone" @click="mapOpen = true"><q-icon name="map" size="18px" /> Map</button>
          </div>
          <sort-dropdown v-model="sort" class="hb__sort-phone" variant="box" label="Sort By" />
        </aside>

        <!-- RIGHT: results -->
        <div class="hb__main">
          <div ref="listTop" class="hb__toolbar">
            <p class="hb__count">
              <strong>{{ results.length }} {{ results.length === 1 ? 'hotel' : 'hotels' }}</strong> near Sandy Oaks Ranch
              <span v-if="pages > 1" class="hb__range">{{ rangeLabel }}</span>
              <span v-if="results.length" class="hb__fits"><q-icon name="check" size="16px" /> Fits your party of {{ party }}</span>
            </p>
            <div class="hb__tools">
              <sort-dropdown v-model="sort" class="hb__sort-wide" />
              <button type="button" class="hb__mapbtn hb__mapbtn--wide" @click="mapOpen = true"><q-icon name="map" size="18px" /> Map</button>
            </div>
          </div>

          <div class="hb__list" @click="onListClick">
            <div v-for="h in paged" :key="h.id" :data-hotel="h.id" class="hb__item" :class="{ 'is-selected': h.id === selectedId }">
              <!-- page (E/F): the desktop listing card; its CTA opens Hotel Details, like the booking site -->
              <hotel-card-group
                v-if="layout === 'page'"
                flow="group"
                :name="h.name"
                :city="h.city"
                :stars="h.stars"
                :distance="`${h.miles} mi from Sandy Oaks Ranch · ${h.airportMiles} mi from SAT`"
                :availability="minLeft(h) <= 3 ? 'partial' : 'matches'"
                :rooms-available="minLeft(h)"
                :rooms-max="minLeft(h)"
                :starting-price="h.rates[roomType]"
                :rooms="roomsFor(h)"
                :seed="h.seed"
                :preferred="h.id === 'hill-country-lodge'"
                cta-label="Select Rooms"
                @select="openDetail(h.id)"
              />
              <hotel-card-horizontal
                v-else
                flow="group"
                :name="h.name"
                :city="h.city"
                :stars="h.stars"
                :distance="`${h.miles} mi from Sandy Oaks Ranch · ${h.airportMiles} mi from SAT`"
                :availability="minLeft(h) <= 3 ? 'partial' : 'matches'"
                :rooms-available="minLeft(h)"
                :starting-price="h.rates[roomType]"
                :rooms="roomsFor(h)"
                :seed="h.seed"
                :cta-label="h.id === selectedId ? 'Selected ✓' : 'Select Rooms'"
                @select="pick(h)"
              />
              <ul class="hb__tags"><li v-for="t in h.tags" :key="t">{{ t }}</li></ul>
            </div>
            <div v-if="!results.length" class="hb__empty">
              <q-icon name="search_off" size="40px" />
              <p>No hotels match these filters. Try fewer filters or fewer rooms.</p>
            </div>
          </div>

          <nav v-if="pages > 1" class="hb__pager" aria-label="Hotel results pages">
            <q-pagination v-model="page" :max="pages" :max-pages="5" boundary-numbers direction-links color="primary" />
            <span class="hb__pager-range">{{ rangeLabel }} hotels</span>
          </nav>

          <!-- HOW TO PAY (Version A; Version B does this on the modal's review step) -->
          <div v-if="selected && showPay" ref="payRef" class="hb__pay">
            <p v-if="!paged.some((h) => h.id === selectedId)" class="pay__which">
              <q-icon name="check_circle" size="16px" /> {{ selected.name }} · {{ money(selected.rates[roomType]) }}/night
              <button type="button" @click="page = Math.floor(results.findIndex((h) => h.id === selectedId) / PAGE_SIZE) + 1">View</button>
            </p>
            <pay-choice v-model="payOption" :hotel="selected" :opts="{ roomType, rooms, stay }" />
          </div>
        </div>
      </div>
    </div>

    <ds-modal v-model="mapOpen" title="Hotels near Sandy Oaks Ranch" subtitle="Tap a price to preview · open a hotel for details" size="fullscreen" flush :z-index="4200">
      <div class="hb__legend">
        <span class="hb__legend-dot" aria-hidden="true" />
        <span><b>Race venue</b> · Sandy Oaks Ranch, 1480 I-35, Devine, TX</span>
      </div>
      <hotel-map
        :hotels="mapHotels"
        :event-location="{ lat: EVENT_LOCATION.lat, lng: EVENT_LOCATION.lng, label: 'Sandy Oaks Ranch', sublabel: 'Race venue' }"
        :zoom="9"
        height="100%"
        :cluster="false"
      />
    </ds-modal>
  </section>
</template>

<style scoped>
.hb { background: var(--ds-color-surface); }
.hb--inline { border: 2px solid var(--ds-color-border-brand); border-radius: var(--ds-radius-lg); overflow: hidden; }
.hb__banner { padding: 16px 20px; background: var(--ds-color-background-brand-subtlest); border-bottom: 1px solid var(--ds-color-border); }
.hb__title { margin: 0; font-size: 1.25rem; font-weight: 700; color: var(--ds-color-text-brand); }
.hb__note { margin: 2px 0 0; font-size: 0.9375rem; color: var(--ds-color-text-subtle); }
.hb--inline .hb__body { padding: 16px; }

/* search */
.hb__summary { display: none; }
.hb__fields { display: grid; grid-template-columns: 1.6fr 0.8fr 1.1fr auto; gap: 10px; align-items: center; }
.hb__apply { display: none; height: 40px; font-weight: 700; }

/* layout grid */
.hb__grid { display: grid; grid-template-columns: 236px minmax(0, 1fr); gap: 24px; margin-top: 20px; }
.hb--page .hb__grid { grid-template-columns: 280px minmax(0, 1fr); gap: 32px; margin-top: 24px; }
.hb--page .hb__fields { grid-template-columns: 1.6fr 0.8fr 1.1fr; }
.hb__side { min-width: 0; }
.hb__rail :deep(.fr__inline > .frf__section:first-child) { display: none; } /* rail's mini-map shows library sample data — the Map button covers it */
.hb__mapbtn--phone, .hb__sort-phone { display: none; }

.hb__toolbar { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
.hb__count { margin: 0; font-size: 0.9375rem; color: var(--ds-color-text); }
.hb__range { display: block; margin-top: 2px; font-size: 0.8125rem; color: var(--ds-color-text-subtle); }
.hb__pager { display: flex; flex-direction: column; align-items: center; gap: 6px; margin-top: 20px; }
.hb__pager-range { font-size: 0.8125rem; color: var(--ds-color-text-subtle); }
.pay__which { display: flex; align-items: center; gap: 6px; margin: 0 0 10px; font-size: 0.9375rem; font-weight: 700; color: var(--ds-color-text); }
.pay__which .q-icon { color: var(--ds-color-text-success); }
.pay__which button { margin-left: auto; border: 0; background: none; font: inherit; font-weight: 700; color: var(--ds-color-link); text-decoration: underline; cursor: pointer; }
.hb__fits { display: flex; align-items: center; gap: 4px; margin-top: 2px; color: var(--ds-color-text-success); }
.hb__tools { display: flex; align-items: center; gap: 8px; flex: none; }
.hb__mapbtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid var(--ds-color-border-bold);
  border-radius: var(--ds-radius-button);
  background: var(--ds-color-surface);
  color: var(--ds-color-text);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}
.hb__mapbtn:hover { background: var(--ds-color-background-neutral-subtle); }

.hb__list { display: grid; gap: 14px; }
.hb__item :deep(.hch__name) { cursor: pointer; }
.hb__item :deep(.hch__name:hover) { text-decoration-thickness: 2px; color: var(--ds-color-link); }
.hb--inline .hb__detail { padding: 0; }
.hb__legend {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: calc(100% - 80px);
  padding: 8px 12px;
  border-radius: var(--ds-radius-md);
  background: var(--ds-color-surface);
  box-shadow: var(--ds-shadow-2);
  font-size: 0.875rem;
  color: var(--ds-color-text);
}
.hb__legend-dot { width: 12px; height: 12px; flex: none; border-radius: 50%; background: var(--ds-color-background-brand-bold); box-shadow: 0 0 0 4px rgba(1, 17, 62, 0.18); }
.hb__item { border-radius: 12px; outline: 2px solid transparent; outline-offset: 2px; transition: outline-color var(--ds-duration-fast); }
.hb__item.is-selected { outline-color: var(--ds-color-border-brand); }
.hb__tags { display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 2px 0; padding: 0; list-style: none; }
.hb__tags li { padding: 2px 8px; border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-sm); font-size: 0.8125rem; color: var(--ds-color-text-subtle); background: var(--ds-color-surface); }
.hb__empty { display: grid; justify-items: center; gap: 6px; padding: 28px 12px; text-align: center; color: var(--ds-color-text-subtle); }

.hb__pay { margin-top: 20px; }

/* 600–699: stack the rail above the results */
@media (max-width: 699px) {
  .hb__grid { grid-template-columns: minmax(0, 1fr); }
}

/* ≤600: the library's phone browse pattern (matches HotelListPage < 600px) */
@media (max-width: 600px) {
  .hb__summary { display: flex; }
  .hb__fields { display: none; grid-template-columns: 1fr 1fr; margin-top: 10px; padding: 12px; border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-md); background: var(--ds-color-surface-sunken); }
  .hb__fields.is-open { display: grid; }
  .hb__f--stay, .hb__apply { grid-column: 1 / -1; }
  .hb__apply { display: inline-flex; height: 44px; }
  .hb__grid { gap: 0; margin-top: 12px; }
  .hb__bar { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .hb__rail :deep(.fr__toggle) { width: 100%; min-height: 44px; height: 44px; justify-content: center; gap: 6px; }
  .hb__rail :deep(.fr__toggle > .q-icon) { display: none; }
  .hb__mapbtn--phone { display: inline-flex; min-height: 44px; }
  .hb__sort-phone { display: block; margin-top: 12px; }
  .hb__sort-phone :deep(.srt) { display: block; }
  .hb__sort-phone :deep(.srt__btn) { width: 100%; justify-content: space-between; }
  .hb__tools { display: none; }
  .hb__toolbar { margin: 16px 0 10px; }
}
</style>
