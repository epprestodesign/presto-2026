<script setup>
// L27Countdown — live days/hours/min/sec to the show. Ticks every second.
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { event } from './imex.js'
import './l27.css'

const props = defineProps({
  target: { type: String, default: event.startsAt },
  tone: { type: String, default: 'light' }, // light | dark | outline
  label: { type: String, default: 'Doors open in' },
  // Storybook/tests: freeze "now" for a stable render.
  now: { type: String, default: '' },
})
const tick = ref(props.now ? new Date(props.now).getTime() : Date.now())
let t = null
onMounted(() => { if (!props.now) t = setInterval(() => { tick.value = Date.now() }, 1000) })
onBeforeUnmount(() => clearInterval(t))
const parts = computed(() => {
  let s = Math.max(0, Math.floor((new Date(props.target).getTime() - tick.value) / 1000))
  const d = Math.floor(s / 86400); s -= d * 86400
  const h = Math.floor(s / 3600); s -= h * 3600
  const m = Math.floor(s / 60); s -= m * 60
  return [{ v: d, l: 'Days' }, { v: h, l: 'Hours' }, { v: m, l: 'Min' }, { v: s, l: 'Sec' }]
})
const pad = (n, i) => (i === 0 ? String(n) : String(n).padStart(2, '0'))
</script>

<template>
  <div class="l27cd" :class="`l27cd--${tone}`" role="timer" :aria-label="`${parts[0].v} days until IMEX America opens`">
    <span v-if="label" class="l27cd__label">{{ label }}</span>
    <div class="l27cd__units">
      <div v-for="(p, i) in parts" :key="p.l" class="l27cd__unit">
        <span class="l27cd__num">{{ pad(p.v, i) }}</span>
        <span class="l27cd__lbl">{{ p.l }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.l27cd { font-family: var(--l27-font, 'Figtree', sans-serif); display: inline-flex; flex-direction: column; gap: 10px; }
.l27cd__label { font-size: 0.75rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; opacity: .75; }
.l27cd__units { display: flex; gap: 8px; }
.l27cd__unit { display: flex; flex-direction: column; align-items: center; min-width: 68px; padding: 10px 8px; border-radius: 12px; }
.l27cd__num { font-size: 2rem; font-weight: 900; line-height: 1; font-variant-numeric: tabular-nums; }
.l27cd__lbl { font-size: 0.6875rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; margin-top: 4px; opacity: .7; }
.l27cd--light .l27cd__unit { background: #fff; color: #1D1D1B; box-shadow: 0 6px 18px -10px rgba(25,29,78,.4); }
.l27cd--dark { color: #fff; }
.l27cd--dark .l27cd__unit { background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.16); }
.l27cd--dark .l27cd__num { color: #FFD100; }
.l27cd--outline .l27cd__unit { border: 1.5px solid currentColor; }
@media (max-width: 480px) { .l27cd__unit { min-width: 56px; } .l27cd__num { font-size: 1.5rem; } }
</style>
