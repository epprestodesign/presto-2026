<script setup>
// L27StayPlanner — "Schedule → your stay". Guests tick the days they'll be at
// IMEX (Smart Monday + show days); the planner works out check-in (the night
// before the first day) and check-out (the morning after the last), then
// "Book these nights" emits `book` with { arrive, depart }.
import { ref, computed } from 'vue'
import { schedule as defaultSchedule, nightsBetween, stayLabel } from './imex.js'
import './l27.css'

const props = defineProps({
  schedule: { type: Array, default: () => defaultSchedule },
  initial: { type: Array, default: () => ['2027-09-28', '2027-09-29', '2027-09-30'] },
  tone: { type: String, default: 'light' }, // light | dark
})
const emit = defineEmits(['book'])
const picked = ref([...props.initial])
const toggle = (iso) => {
  picked.value = picked.value.includes(iso) ? picked.value.filter((d) => d !== iso) : [...picked.value, iso].sort()
}
const shift = (iso, n) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10) }
const stay = computed(() => {
  if (!picked.value.length) return null
  const first = picked.value[0]; const last = picked.value[picked.value.length - 1]
  return { arrive: shift(first, -1), depart: shift(last, 1) }
})
const nights = computed(() => (stay.value ? nightsBetween(stay.value.arrive, stay.value.depart) : 0))
const dot = { Education: 'var(--l27-blue)', Forum: 'var(--l27-green)', Social: 'var(--l27-orange)', 'Trade show': 'var(--l27-red)', Keynote: 'var(--l27-coral)', Meetings: 'var(--l27-green)', Panel: 'var(--l27-blue)' }
</script>

<template>
  <div class="l27sp" :class="`l27sp--${tone}`">
    <div class="l27sp__days">
      <button
        v-for="d in schedule" :key="d.day" type="button" class="l27sp__day" :class="{ 'is-on': picked.includes(d.day) }"
        :aria-pressed="picked.includes(d.day)" @click="toggle(d.day)"
      >
        <span class="l27sp__check" aria-hidden="true"><q-icon v-if="picked.includes(d.day)" name="check" size="16px" /></span>
        <span class="l27sp__date">{{ d.label }}</span>
        <span class="l27sp__title">{{ d.title }}</span>
        <span class="l27sp__sub">{{ d.sub }}</span>
        <ul class="l27sp__items">
          <li v-for="it in d.items" :key="it.title"><span class="l27sp__dot" :style="{ background: dot[it.tag] || 'var(--l27-muted)' }" />{{ it.time }} · {{ it.title }}</li>
        </ul>
      </button>
    </div>
    <div class="l27sp__result" aria-live="polite">
      <div v-if="stay" class="l27sp__summary">
        <span class="l27sp__lbl">Your stay</span>
        <strong class="l27sp__stay">{{ stayLabel(stay) }}</strong>
        <span class="l27sp__hint">Check in the night before your first day, out the morning after your last.</span>
      </div>
      <div v-else class="l27sp__summary"><strong class="l27sp__stay">Pick the days you’ll be at IMEX</strong></div>
      <button type="button" class="l27-btn l27-btn--primary l27-btn--lg" :disabled="!stay" @click="stay && emit('book', stay)">
        Book {{ nights || '' }} night{{ nights === 1 ? '' : 's' }} <q-icon name="arrow_forward" size="20px" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.l27sp { font-family: var(--l27-font); }
.l27sp__days { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.l27sp__day { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 4px; padding: 18px 16px 16px; border: 2px solid var(--l27-line); border-radius: var(--l27-radius); background: #fff; text-align: left; cursor: pointer; font-family: inherit; color: var(--l27-ink); transition: border-color .15s, background .15s, transform .15s; }
.l27sp__day:hover { transform: translateY(-2px); border-color: var(--l27-ink); }
.l27sp__day:focus-visible { outline: 3px solid var(--l27-blue); outline-offset: 2px; }
.l27sp__day.is-on { border-color: var(--l27-red); background: #FFF5F5; }
.l27sp__check { position: absolute; top: 14px; right: 14px; width: 24px; height: 24px; border-radius: 6px; border: 2px solid var(--l27-line); display: flex; align-items: center; justify-content: center; color: #fff; }
.l27sp__day.is-on .l27sp__check { background: var(--l27-red); border-color: var(--l27-red); }
.l27sp__date { font-size: 0.8125rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: var(--l27-red); }
.l27sp__title { font-size: 1.25rem; font-weight: 900; }
.l27sp__sub { font-size: 0.875rem; color: var(--l27-muted); }
.l27sp__items { list-style: none; margin: 10px 0 0; padding: 10px 0 0; border-top: 1px dashed var(--l27-line); display: flex; flex-direction: column; gap: 6px; width: 100%; }
.l27sp__items li { display: flex; align-items: center; gap: 8px; font-size: 0.8125rem; color: var(--l27-ink); }
.l27sp__dot { width: 8px; height: 8px; border-radius: 50%; flex: none; }
.l27sp__result { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-top: 16px; padding: 18px 20px; border-radius: var(--l27-radius); background: var(--l27-ink); color: #fff; }
.l27sp__summary { display: flex; flex-direction: column; gap: 2px; }
.l27sp__lbl { font-size: 0.75rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--l27-yellow); }
.l27sp__stay { font-size: 1.375rem; font-weight: 900; }
.l27sp__hint { font-size: 0.8125rem; color: rgba(255,255,255,.7); }
.l27sp .l27-btn:disabled { opacity: .45; cursor: not-allowed; transform: none; }
.l27sp--dark .l27sp__day { background: rgba(255,255,255,.05); border-color: rgba(255,255,255,.14); color: #fff; }
.l27sp--dark .l27sp__day.is-on { background: rgba(227,6,19,.18); border-color: var(--l27-red); }
.l27sp--dark .l27sp__sub, .l27sp--dark .l27sp__items li { color: rgba(255,255,255,.75); }
.l27sp--dark .l27sp__result { background: var(--l27-yellow); color: var(--l27-ink); }
.l27sp--dark .l27sp__lbl { color: var(--l27-red); }
.l27sp--dark .l27sp__hint { color: rgba(0,0,0,.6); }
@media (max-width: 900px) { .l27sp__days { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 480px) { .l27sp__days { grid-template-columns: 1fr; } }
</style>
