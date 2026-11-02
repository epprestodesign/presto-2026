<script setup>
// L27BlockMeter — honest urgency: how much of the official room block is gone,
// and when block rates end. Encourages booking inside the block (the thing
// that protects the organizer's hotel contract).
import { computed } from 'vue'
import { block as defaultBlock, event } from './imex.js'
import './l27.css'

const props = defineProps({
  booked: { type: Number, default: defaultBlock.booked },
  total: { type: Number, default: defaultBlock.total },
  deadline: { type: String, default: event.blockDeadline },
  tone: { type: String, default: 'light' }, // light | dark
  compact: { type: Boolean, default: false },
})
const pct = computed(() => Math.min(100, Math.round((props.booked / props.total) * 100)))
const left = computed(() => Math.max(0, props.total - props.booked))
</script>

<template>
  <div class="l27bm2" :class="[`l27bm2--${tone}`, { 'l27bm2--compact': compact }]">
    <div class="l27bm2__top">
      <span class="l27bm2__pct"><strong>{{ pct }}%</strong> of the IMEX room block is booked</span>
      <span v-if="!compact" class="l27bm2__left">{{ left.toLocaleString('en-US') }} rooms left</span>
    </div>
    <div class="l27bm2__track" role="progressbar" :aria-valuenow="pct" aria-valuemin="0" aria-valuemax="100" aria-label="Room block booked">
      <div class="l27bm2__fill" :style="{ width: pct + '%' }" />
    </div>
    <p class="l27bm2__note"><q-icon name="schedule" size="16px" /> Block rates end {{ deadline }} — or sooner if it sells out.</p>
  </div>
</template>

<style scoped>
.l27bm2 { font-family: var(--l27-font); }
.l27bm2__top { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap; margin-bottom: 10px; font-size: 0.9375rem; }
.l27bm2__pct strong { font-size: 1.25rem; font-weight: 900; }
.l27bm2__left { font-weight: 800; color: var(--l27-red); }
.l27bm2__track { height: 12px; border-radius: 999px; background: #EEEAF2; overflow: hidden; }
.l27bm2__fill { height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--l27-coral), var(--l27-orange) 55%, var(--l27-red)); transition: width .8s ease; }
.l27bm2__note { display: flex; align-items: center; gap: 6px; margin-top: 10px; font-size: 0.8125rem; color: var(--l27-muted); }
.l27bm2--dark { color: #fff; }
.l27bm2--dark .l27bm2__track { background: rgba(255,255,255,.14); }
.l27bm2--dark .l27bm2__left { color: var(--l27-yellow); }
.l27bm2--dark .l27bm2__note { color: rgba(255,255,255,.7); }
.l27bm2--compact .l27bm2__top { margin-bottom: 6px; font-size: 0.8125rem; }
.l27bm2--compact .l27bm2__pct strong { font-size: 1rem; }
.l27bm2--compact .l27bm2__track { height: 8px; }
.l27bm2--compact .l27bm2__note { margin-top: 6px; }
</style>
