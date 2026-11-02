<script setup>
// L27LogoStrip — partner/association marquee (wordmarks as type, no logos).
// Scrolls gently; pauses on hover; static for reduced-motion users.
import { partners as defaultPartners } from './imex.js'
import './l27.css'
defineProps({
  partners: { type: Array, default: () => defaultPartners },
  label: { type: String, default: 'Supported by the associations that run the industry' },
  tone: { type: String, default: 'light' }, // light | dark
})
</script>

<template>
  <div class="l27ls" :class="`l27ls--${tone}`">
    <p v-if="label" class="l27ls__label">{{ label }}</p>
    <div class="l27ls__viewport">
      <div class="l27ls__track">
        <span v-for="(p, i) in [...partners, ...partners]" :key="i" class="l27ls__item" :aria-hidden="i >= partners.length">{{ p }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.l27ls { font-family: var(--l27-font); }
.l27ls__label { text-align: center; font-size: 0.8125rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--l27-muted); margin-bottom: 18px; }
.l27ls__viewport { overflow: hidden; mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); }
.l27ls__track { display: flex; gap: 56px; width: max-content; animation: l27ls-scroll 36s linear infinite; }
.l27ls__viewport:hover .l27ls__track { animation-play-state: paused; }
.l27ls__item { font-size: 1.5rem; font-weight: 900; letter-spacing: -0.01em; color: #B7B2BE; white-space: nowrap; }
.l27ls--dark .l27ls__label { color: rgba(255,255,255,.6); }
.l27ls--dark .l27ls__item { color: rgba(255,255,255,.4); }
@keyframes l27ls-scroll { to { transform: translateX(-50%); } }
</style>
