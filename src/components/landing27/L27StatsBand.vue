<script setup>
// L27StatsBand — big-number social proof (IMEX 2026 show stats). Numbers count
// up the first time the band scrolls into view.
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { stats as defaultStats } from './imex.js'
import './l27.css'

const props = defineProps({
  stats: { type: Array, default: () => defaultStats },
  tone: { type: String, default: 'light' }, // light | dark | pink | color
  animate: { type: Boolean, default: true },
})
const root = ref(null)
const shown = ref(props.stats.map((s) => (props.animate ? 0 : s.value)))
let io = null
function run () {
  const start = performance.now(); const dur = 1200
  const step = (now) => {
    const k = Math.min(1, (now - start) / dur); const e = 1 - Math.pow(1 - k, 3)
    shown.value = props.stats.map((s) => Math.round(s.value * e))
    if (k < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}
onMounted(() => {
  if (!props.animate) return
  if (!('IntersectionObserver' in window)) { shown.value = props.stats.map((s) => s.value); return }
  io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { run(); io.disconnect() } }, { threshold: 0.3 })
  io.observe(root.value)
})
onBeforeUnmount(() => io && io.disconnect())
const fmt = (n) => n.toLocaleString('en-US')
const accents = ['var(--l27-coral)', 'var(--l27-blue)', 'var(--l27-orange)', 'var(--l27-green)']
</script>

<template>
  <div ref="root" class="l27sb" :class="`l27sb--${tone}`">
    <div v-for="(s, i) in stats" :key="s.label" class="l27sb__item">
      <span class="l27sb__num" :style="tone === 'color' ? { color: accents[i % 4] } : null">{{ fmt(shown[i]) }}{{ s.suffix || '' }}</span>
      <span class="l27sb__lbl">{{ s.label }}</span>
    </div>
  </div>
</template>

<style scoped>
.l27sb { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; font-family: var(--l27-font); }
.l27sb__item { display: flex; flex-direction: column; gap: 6px; padding-top: 14px; border-top: 2px solid currentColor; }
.l27sb__num { font-size: clamp(2rem, 4vw, 3.25rem); font-weight: 900; line-height: 1; font-variant-numeric: tabular-nums; letter-spacing: -0.03em; }
.l27sb__lbl { font-size: 0.9375rem; font-weight: 600; opacity: .75; }
.l27sb--light { color: var(--l27-ink); }
.l27sb--dark { color: #fff; }
.l27sb--dark .l27sb__item { border-top-color: rgba(255,255,255,.25); }
.l27sb--pink { color: var(--l27-ink); }
.l27sb--color .l27sb__item { border-top-color: var(--l27-line); }
@media (max-width: 760px) { .l27sb { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
</style>
