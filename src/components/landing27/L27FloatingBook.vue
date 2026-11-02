<script setup>
// L27FloatingBook — a floating round "Book your hotel" badge with rotating
// text (Conflux-style). Lives bottom-right on any page; emits `book`.
import './l27.css'
defineProps({
  tone: { type: String, default: 'red' }, // red | yellow | dark
  position: { type: String, default: 'fixed' }, // fixed | inline
})
const emit = defineEmits(['book'])
</script>

<template>
  <button type="button" class="l27fb" :class="[`l27fb--${tone}`, `l27fb--${position}`]" aria-label="Book your IMEX hotel" @click="emit('book')">
    <svg viewBox="0 0 120 120" class="l27fb__ring" aria-hidden="true">
      <defs><path id="l27fb-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" /></defs>
      <!-- textLength stretches/squeezes the phrase to exactly one lap (2π·44 ≈ 276). -->
      <text><textPath href="#l27fb-circle" textLength="274" lengthAdjust="spacing">BOOK YOUR HOTEL ✦ IMEX 2027 ✦ </textPath></text>
    </svg>
    <span class="l27fb__core"><q-icon name="hotel" size="26px" /></span>
  </button>
</template>

<style scoped>
.l27fb { width: 112px; height: 112px; border-radius: 50%; border: 0; cursor: pointer; display: flex; align-items: center; justify-content: center; position: relative; box-shadow: 0 16px 34px -12px rgba(0,0,0,.45); transition: transform .2s; padding: 0; }
.l27fb:hover { transform: scale(1.06); }
.l27fb:focus-visible { outline: 3px solid var(--l27-blue, #4D92CF); outline-offset: 4px; }
.l27fb--fixed { position: fixed; right: 24px; bottom: 24px; z-index: 2500; }
.l27fb__ring { position: absolute; inset: 0; width: 100%; height: 100%; animation: l27fb-spin 14s linear infinite; }
.l27fb__ring text { font-family: 'Figtree', sans-serif; font-size: 10.5px; font-weight: 800; }
.l27fb__core { width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.l27fb--red { background: #E30613; color: #fff; }
.l27fb--red .l27fb__ring text { fill: #fff; }
.l27fb--red .l27fb__core { background: #fff; color: #E30613; }
.l27fb--yellow { background: #FFD100; color: #1D1D1B; }
.l27fb--yellow .l27fb__ring text { fill: #1D1D1B; }
.l27fb--yellow .l27fb__core { background: #1D1D1B; color: #FFD100; }
.l27fb--dark { background: #1D1D1B; color: #fff; }
.l27fb--dark .l27fb__ring text { fill: #FFD100; }
.l27fb--dark .l27fb__core { background: #E30613; color: #fff; }
@keyframes l27fb-spin { to { transform: rotate(360deg); } }
@media (max-width: 640px) { .l27fb { width: 88px; height: 88px; } .l27fb--fixed { right: 14px; bottom: 56px; } .l27fb__core { width: 42px; height: 42px; } }
</style>
