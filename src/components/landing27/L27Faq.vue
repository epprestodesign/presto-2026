<script setup>
// L27Faq — accordion of housing questions (one open at a time).
import { ref } from 'vue'
import { faqs as defaultFaqs } from './imex.js'
import './l27.css'
const props = defineProps({
  faqs: { type: Array, default: () => defaultFaqs },
  tone: { type: String, default: 'light' }, // light | dark
  initialOpen: { type: Number, default: 0 },
})
const open = ref(props.initialOpen)
</script>

<template>
  <div class="l27fq" :class="`l27fq--${tone}`">
    <div v-for="(f, i) in faqs" :key="f.q" class="l27fq__item" :class="{ 'is-open': open === i }">
      <button type="button" class="l27fq__q" :aria-expanded="open === i" :aria-controls="`l27fq-${i}`" @click="open = open === i ? -1 : i">
        <span>{{ f.q }}</span>
        <span class="l27fq__icon" aria-hidden="true">{{ open === i ? '−' : '+' }}</span>
      </button>
      <div v-show="open === i" :id="`l27fq-${i}`" class="l27fq__a">{{ f.a }}</div>
    </div>
  </div>
</template>

<style scoped>
.l27fq { font-family: var(--l27-font); }
.l27fq__item { border-bottom: 1.5px solid var(--l27-line); }
.l27fq__q { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 20px 0; border: 0; background: none; font-family: inherit; font-size: 1.125rem; font-weight: 800; text-align: left; cursor: pointer; color: var(--l27-ink); }
.l27fq__q:focus-visible { outline: 3px solid var(--l27-blue); outline-offset: 2px; }
.l27fq__icon { width: 32px; height: 32px; flex: none; border-radius: 50%; background: #F2F0F5; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 700; }
.l27fq__item.is-open .l27fq__icon { background: var(--l27-red); color: #fff; }
.l27fq__a { padding: 0 48px 20px 0; font-size: 1rem; line-height: 1.6; color: var(--l27-muted); }
.l27fq--dark .l27fq__item { border-bottom-color: rgba(255,255,255,.14); }
.l27fq--dark .l27fq__q { color: #fff; }
.l27fq--dark .l27fq__icon { background: rgba(255,255,255,.1); }
.l27fq--dark .l27fq__a { color: rgba(255,255,255,.72); }
</style>
