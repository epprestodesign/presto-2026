<script setup>
// L27StayStrip — event-aware stay picker. Instead of a blank calendar that
// opens on today's month, guests see the nights around the show, with Smart
// Monday and the show days marked. Click your arrival night, then your
// departure day; the range and night count update. v-model = { arrive, depart }.
import { computed, ref } from 'vue'
import { stayDays, nightsBetween } from './imex.js'
import './l27.css'

const props = defineProps({
  modelValue: { type: Object, default: () => ({ arrive: '', depart: '' }) },
  tone: { type: String, default: 'light' }, // light | dark
  compact: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const picking = ref('arrive') // next click sets arrive | depart
const a = computed(() => props.modelValue?.arrive || '')
const d = computed(() => props.modelValue?.depart || '')
const nights = computed(() => (a.value && d.value ? nightsBetween(a.value, d.value) : 0))

function pick (iso) {
  if (picking.value === 'arrive' || !a.value || iso <= a.value) {
    emit('update:modelValue', { arrive: iso, depart: '' })
    picking.value = 'depart'
  } else {
    emit('update:modelValue', { arrive: a.value, depart: iso })
    picking.value = 'arrive'
  }
}
const inRange = (iso) => a.value && d.value && iso > a.value && iso < d.value
const hint = computed(() => (picking.value === 'depart' && a.value && !d.value ? 'Now pick your check-out day' : 'Pick your check-in night'))
</script>

<template>
  <div class="l27ss" :class="[`l27ss--${tone}`, { 'l27ss--compact': compact }]">
    <div class="l27ss__head">
      <span class="l27ss__hint">{{ hint }}</span>
      <span v-if="nights" class="l27ss__nights">{{ nights }} night{{ nights === 1 ? '' : 's' }}</span>
    </div>
    <div class="l27ss__days" role="group" aria-label="Choose your stay">
      <button
        v-for="day in stayDays" :key="day.iso" type="button" class="l27ss__day"
        :class="{ 'is-start': day.iso === a, 'is-end': day.iso === d, 'is-in': inRange(day.iso), 'is-show': !!day.tag }"
        :aria-pressed="day.iso === a || day.iso === d"
        :aria-label="`${day.dow} ${day.mon} ${day.day}${day.tag ? ', ' + day.tag : ''}`"
        @click="pick(day.iso)"
      >
        <span class="l27ss__dow">{{ day.dow }}</span>
        <span class="l27ss__num">{{ day.day }}</span>
        <span class="l27ss__tag">{{ (compact ? day.short : day.tag) || day.tag || (day.iso === a ? (compact ? 'In' : 'Check-in') : day.iso === d ? (compact ? 'Out' : 'Check-out') : ' ') }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.l27ss__head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; font-size: 0.875rem; }
.l27ss__hint { color: var(--l27-muted); font-weight: 600; }
.l27ss__nights { font-weight: 800; color: var(--l27-red); }
.l27ss__days { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 6px; }
.l27ss__day { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 10px 2px 8px; border: 1.5px solid var(--l27-line); border-radius: 10px; background: #fff; font-family: var(--l27-font); color: var(--l27-ink); cursor: pointer; transition: border-color .15s, background .15s; min-width: 0; }
.l27ss__day:hover { border-color: var(--l27-ink); }
.l27ss__day:focus-visible { outline: 3px solid var(--l27-blue); outline-offset: 2px; }
.l27ss__dow { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--l27-muted); }
.l27ss__num { font-size: 1.25rem; font-weight: 900; line-height: 1.1; }
.l27ss__tag { font-size: 0.625rem; font-weight: 700; line-height: 1.15; min-height: 1.4em; text-align: center; color: var(--l27-muted); overflow: hidden; text-overflow: ellipsis; max-width: 100%; white-space: nowrap; }
.l27ss__day.is-show { background: var(--l27-pink); border-color: transparent; }
.l27ss__day.is-show .l27ss__tag { color: var(--l27-red); }
.l27ss__day.is-in { background: #fde9ea; border-color: #f6b9bc; }
.l27ss__day.is-start, .l27ss__day.is-end { background: var(--l27-red); border-color: var(--l27-red); color: #fff; }
.l27ss__day.is-start .l27ss__dow, .l27ss__day.is-end .l27ss__dow, .l27ss__day.is-start .l27ss__tag, .l27ss__day.is-end .l27ss__tag { color: #fff; }
.l27ss--compact .l27ss__days { gap: 4px; }
.l27ss--compact .l27ss__day { padding: 8px 1px 6px; }
.l27ss--compact .l27ss__num { font-size: 1.05rem; }
/* dark tone */
.l27ss--dark .l27ss__hint { color: rgba(255,255,255,.7); }
.l27ss--dark .l27ss__nights { color: var(--l27-yellow); }
.l27ss--dark .l27ss__day { background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.14); color: #fff; }
.l27ss--dark .l27ss__dow, .l27ss--dark .l27ss__tag { color: rgba(255,255,255,.6); }
.l27ss--dark .l27ss__day.is-show { background: rgba(255,209,0,.12); }
.l27ss--dark .l27ss__day.is-show .l27ss__tag { color: var(--l27-yellow); }
.l27ss--dark .l27ss__day.is-in { background: rgba(227,6,19,.25); border-color: rgba(227,6,19,.4); }
@media (max-width: 560px) {
  .l27ss__days { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
</style>
