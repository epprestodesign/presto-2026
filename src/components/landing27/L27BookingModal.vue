<script setup>
// L27BookingModal — how any landing concept (or an outside page builder like
// Framer) opens Presto booking without leaving the page. Built on the design
// system's DsModal. Three states, all inside the modal (concept stays in
// Storybook — no hand-off): 1) the stacked corporate widget → 2) "Finding
// rooms near Mandalay Bay…" → 3) a results preview of official hotels.
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import DsModal from '../DsModal.vue'
import './l27.css'
import L27BookingWidget from './L27BookingWidget.vue'
import { brand, event, hotels, attendeeTypes, stayLabel, defaultStay } from './imex.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  stay: { type: Object, default: () => ({ ...defaultStay }) },
  // Storybook: open straight on a state — form | searching | results.
  initialState: { type: String, default: 'form' },
  // Start the results on a specific hotel (e.g. "Book" on a hotel card).
  hotelId: { type: String, default: '' },
  // The search that opened the modal (the widget's `search` payload), so the
  // searching/results states echo what the guest actually picked.
  search: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue'])

const state = ref(props.initialState)
const query = ref(props.search
  ? { rooms: 1, guests: 1, ...props.search, stay: { ...(props.search.stay || props.stay) } }
  : { organization: '', attendeeType: '', stay: { ...props.stay }, rooms: 1, guests: 1 })
let timer = null
// "Searching" always moves on to results — whether the guest searched inside
// the modal or a page opened the modal straight on 'searching'.
function advance () { clearTimeout(timer); timer = setTimeout(() => { state.value = 'results' }, 1400) }
onMounted(() => { if (props.modelValue && state.value === 'searching') advance() })
onBeforeUnmount(() => clearTimeout(timer))
watch(() => props.modelValue, (open) => {
  if (!open) { clearTimeout(timer); return }
  if (props.initialState === 'form') state.value = 'form'
  if (state.value === 'searching') advance()
})

function onSearch (q) {
  query.value = q
  state.value = 'searching'
  advance()
}
const typeLabel = computed(() => attendeeTypes.find((t) => t.value === query.value?.attendeeType)?.label || '')
const results = computed(() => {
  const list = [...hotels].sort((a, b) => a.walk - b.walk)
  if (!props.hotelId) return list.slice(0, 4)
  const pick = list.find((h) => h.id === props.hotelId)
  return pick ? [pick, ...list.filter((h) => h.id !== pick.id).slice(0, 3)] : list.slice(0, 4)
})
const nights = computed(() => {
  const s = query.value?.stay
  return s ? Math.max(1, Math.round((new Date(s.depart) - new Date(s.arrive)) / 86400000)) : 1
})
const close = () => emit('update:modelValue', false)
</script>

<template>
  <ds-modal :model-value="modelValue" size="lg" hide-header aria-label="Book your IMEX hotel" @update:model-value="emit('update:modelValue', $event)">
    <div class="l27 l27bm">
      <header class="l27bm__head">
        <img :src="brand.logo" alt="IMEX America 2027" class="l27bm__logo" />
        <div class="l27bm__titles">
          <h2 class="l27bm__title">{{ state === 'results' ? 'Official hotels near the show' : 'Book your IMEX hotel' }}</h2>
          <p class="l27bm__sub">{{ event.venue }} · {{ event.datesLabel }} · Powered by Presto</p>
        </div>
        <button type="button" class="l27bm__close" aria-label="Close" @click="close"><q-icon name="close" size="22px" /></button>
      </header>

      <!-- 1 · form -->
      <div v-if="state === 'form'" class="l27bm__body">
        <l27-booking-widget layout="stacked" :stay="stay" @search="onSearch" />
        <p class="l27bm__fine"><q-icon name="verified_user" size="16px" /> Official IMEX housing — rates held until {{ event.blockDeadline }}.</p>
      </div>

      <!-- 2 · searching -->
      <div v-else-if="state === 'searching'" class="l27bm__body l27bm__searching" role="status" aria-live="polite">
        <div class="l27bm__pulse" aria-hidden="true"><span /><span /><span /></div>
        <h3>Finding rooms near Mandalay Bay…</h3>
        <p>{{ stayLabel(query?.stay) }} · {{ query?.rooms }} room{{ query?.rooms === 1 ? '' : 's' }}</p>
      </div>

      <!-- 3 · results preview -->
      <div v-else class="l27bm__body">
        <div class="l27bm__chips">
          <span v-if="query?.organization" class="l27bm__chip"><q-icon name="business" size="16px" />{{ query.organization }}</span>
          <span v-if="typeLabel" class="l27bm__chip"><q-icon name="badge" size="16px" />{{ typeLabel }}</span>
          <span class="l27bm__chip"><q-icon name="calendar_month" size="16px" />{{ stayLabel(query?.stay) }}</span>
          <button type="button" class="l27bm__edit" @click="state = 'form'">Edit search</button>
        </div>
        <ul class="l27bm__list">
          <li v-for="(h, i) in results" :key="h.id" class="l27bm__hotel" :class="{ 'is-first': i === 0 }">
            <img :src="h.image" alt="" class="l27bm__img" />
            <div class="l27bm__info">
              <div class="l27bm__name">{{ h.name }}</div>
              <div class="l27bm__meta"><q-icon name="directions_walk" size="16px" />{{ h.walkLabel }}<span class="l27bm__dot">·</span>{{ h.perks[0] }}</div>
              <div class="l27bm__left" :class="{ 'is-low': h.left < 20 }">{{ h.left < 20 ? `Only ${h.left} rooms left in the block` : `${h.left} rooms left in the block` }}</div>
            </div>
            <div class="l27bm__price">
              <span class="l27bm__was">${{ h.was }}</span>
              <span class="l27bm__rate">${{ h.rate }}</span>
              <span class="l27bm__per">/ night · ${{ h.rate * nights }} total</span>
              <button type="button" class="l27-btn l27-btn--primary l27bm__select">Select rooms</button>
            </div>
          </li>
        </ul>
        <p class="l27bm__fine">Concept preview — in production this hands off to the Presto hotel list with your search filled in.</p>
      </div>
    </div>
  </ds-modal>
</template>

<style scoped>
.l27bm { margin: -4px; }
.l27bm__head { display: flex; align-items: center; gap: 16px; padding-bottom: 18px; border-bottom: 1px solid var(--l27-line); margin-bottom: 20px; }
.l27bm__logo { height: 34px; width: auto; flex: none; }
.l27bm__titles { flex: 1; min-width: 0; }
.l27bm__title { font-size: 1.375rem; font-weight: 900; line-height: 1.15; }
.l27bm__sub { font-size: 0.875rem; color: var(--l27-muted); margin-top: 2px; }
.l27bm__close { width: 40px; height: 40px; border-radius: 50%; border: 0; background: #F2F0F5; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--l27-ink); flex: none; }
.l27bm__fine { display: flex; align-items: center; gap: 6px; margin-top: 16px; font-size: 0.8125rem; color: var(--l27-muted); }
.l27bm__searching { text-align: center; padding: 56px 0; }
.l27bm__searching h3 { font-size: 1.375rem; font-weight: 900; margin-top: 20px; }
.l27bm__searching p { color: var(--l27-muted); margin-top: 6px; }
.l27bm__pulse { display: inline-flex; gap: 10px; }
.l27bm__pulse span { width: 16px; height: 16px; border-radius: 50%; animation: l27bm-bounce 1s infinite ease-in-out; }
.l27bm__pulse span:nth-child(1) { background: var(--l27-coral); }
.l27bm__pulse span:nth-child(2) { background: var(--l27-blue); animation-delay: .15s; }
.l27bm__pulse span:nth-child(3) { background: var(--l27-green); animation-delay: .3s; }
@keyframes l27bm-bounce { 0%, 80%, 100% { transform: translateY(0); opacity: .5; } 40% { transform: translateY(-12px); opacity: 1; } }
.l27bm__chips { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 16px; }
.l27bm__chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; background: #F2F0F5; font-size: 0.875rem; font-weight: 700; }
.l27bm__chip .q-icon { color: var(--l27-red); }
.l27bm__edit { border: 0; background: none; font: inherit; font-weight: 800; color: var(--l27-red); text-decoration: underline; cursor: pointer; }
.l27bm__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.l27bm__hotel { display: grid; grid-template-columns: 120px 1fr auto; gap: 16px; align-items: center; padding: 12px; border: 1.5px solid var(--l27-line); border-radius: 14px; }
.l27bm__hotel.is-first { border-color: var(--l27-red); box-shadow: 0 0 0 3px #FDEBEC; }
.l27bm__img { width: 120px; height: 90px; object-fit: cover; border-radius: 10px; }
.l27bm__name { font-weight: 900; font-size: 1.0625rem; }
.l27bm__meta { display: flex; align-items: center; gap: 4px; font-size: 0.875rem; color: var(--l27-muted); margin-top: 4px; }
.l27bm__dot { margin: 0 2px; }
.l27bm__left { font-size: 0.8125rem; font-weight: 700; color: var(--l27-green); margin-top: 6px; }
.l27bm__left.is-low { color: var(--l27-red); }
.l27bm__price { display: flex; flex-direction: column; align-items: flex-end; text-align: right; }
.l27bm__was { font-size: 0.8125rem; color: var(--l27-muted); text-decoration: line-through; }
.l27bm__rate { font-size: 1.625rem; font-weight: 900; line-height: 1; }
.l27bm__per { font-size: 0.75rem; color: var(--l27-muted); margin: 2px 0 8px; }
.l27bm__select { height: 40px; padding: 0 16px; font-size: 0.875rem; }
@media (max-width: 640px) {
  .l27bm__hotel { grid-template-columns: 84px 1fr; }
  .l27bm__img { width: 84px; height: 72px; }
  .l27bm__price { grid-column: 1 / -1; flex-direction: row; align-items: baseline; gap: 8px; justify-content: flex-start; }
  .l27bm__select { margin-left: auto; }
  .l27bm__logo { height: 26px; }
}
</style>
