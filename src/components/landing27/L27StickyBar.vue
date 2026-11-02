<script setup>
// L27StickyBar — slides in once the hero scrolls away so "Book your hotel" is
// always one click from anywhere on the page. Emits `book`.
// `forceVisible` pins it on (Storybook / static screenshots).
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { brand, event, stayLabel, defaultStay } from './imex.js'
import L27BlockMeter from './L27BlockMeter.vue'
import './l27.css'

const props = defineProps({
  threshold: { type: Number, default: 520 },
  forceVisible: { type: Boolean, default: false },
  tone: { type: String, default: 'light' }, // light | dark
  position: { type: String, default: 'top' }, // top | bottom
  showMeter: { type: Boolean, default: true },
  scrollTarget: { type: String, default: '' }, // CSS selector of a scroll container (defaults to window)
})
const emit = defineEmits(['book'])
const visible = ref(props.forceVisible)
let el = null
const onScroll = () => { const y = el && el !== window ? el.scrollTop : window.scrollY; visible.value = props.forceVisible || y > props.threshold }
onMounted(() => { el = (props.scrollTarget && document.querySelector(props.scrollTarget)) || window; el.addEventListener('scroll', onScroll, { passive: true }); onScroll() })
onBeforeUnmount(() => el && el.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="l27stk" :class="[`l27stk--${tone}`, `l27stk--${position}`, { 'is-visible': visible }]" :aria-hidden="!visible">
    <div class="l27-wrap l27stk__inner">
      <img :src="tone === 'dark' ? brand.logoDark : brand.logo" alt="IMEX America 2027" class="l27stk__logo" />
      <div class="l27stk__info">
        <strong>Official IMEX hotels</strong>
        <span>{{ event.datesLabel }} · {{ stayLabel(defaultStay) }}</span>
      </div>
      <l27-block-meter v-if="showMeter" class="l27stk__meter" compact :tone="tone" />
      <button type="button" class="l27-btn l27-btn--primary" :tabindex="visible ? 0 : -1" @click="emit('book')"><q-icon name="hotel" size="20px" /> Book your hotel</button>
    </div>
  </div>
</template>

<style scoped>
.l27stk { position: fixed; left: 0; right: 0; z-index: 2400; background: rgba(255,255,255,.96); backdrop-filter: blur(10px); box-shadow: 0 10px 30px -14px rgba(25,29,78,.4); transition: transform .3s ease; font-family: var(--l27-font); }
.l27stk--top { top: 0; transform: translateY(-110%); border-bottom: 1px solid var(--l27-line); }
.l27stk--bottom { bottom: 0; transform: translateY(110%); border-top: 1px solid var(--l27-line); }
.l27stk.is-visible { transform: translateY(0); }
.l27stk__inner { display: flex; align-items: center; gap: 20px; min-height: 72px; }
.l27stk__logo { height: 30px; width: auto; flex: none; }
.l27stk__info { display: flex; flex-direction: column; line-height: 1.25; }
.l27stk__info strong { font-weight: 900; }
.l27stk__info span { font-size: 0.8125rem; color: var(--l27-muted); }
.l27stk__meter { flex: 1; max-width: 360px; margin-left: auto; }
/* The bar is one line tall — the meter's deadline note lives elsewhere. */
.l27stk__meter :deep(.l27bm2__note) { display: none; }
.l27stk .l27-btn { flex: none; }
.l27stk--dark { background: rgba(14,16,51,.94); color: #fff; }
.l27stk--dark .l27stk__info span { color: rgba(255,255,255,.65); }
@media (max-width: 760px) {
  .l27stk__meter, .l27stk__info span { display: none; }
  .l27stk__inner { gap: 12px; min-height: 64px; }
  .l27stk__logo { height: 24px; }
  .l27stk .l27-btn { margin-left: auto; height: 44px; padding: 0 16px; font-size: 0.9375rem; }
}
@media (max-width: 420px) { .l27stk__info { display: none; } }
</style>
