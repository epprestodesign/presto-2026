<script setup>
// Concepts E/F — the hotel booking as its own page, after the ticket purchase.
// The full Presto booking journey built from library pieces, pre-set to the
// race weekend:
//   browse    hero + HotelBrowser (page layout: filter rail, desktop listing
//             cards, map, pagination) → Hotel Details (HotelDetailPage)
//   checkout  CheckoutPageExpanded (contact · payment · review · policies)
//   confirm   ConfirmationPage (hotel only)
// Paid on its own — separate from the race order. Reports the booking to the
// host ('booked') so the ticket confirmation can show it.
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import CheckoutPageExpanded from '@lib/components/checkout/CheckoutPageExpanded.vue'
import HotelBrowser from './HotelBrowser.vue'
import Confirmation from './Confirmation.vue'
import { store, send } from './bridge.js'
import { cartFromQuote, summaryFromQuote } from './cart.js'
import { fillDom } from './fillDom.js'

const step = ref('browse') // browse | checkout | confirm
const quote = ref(null)
const browseKey = ref(0) // remount = Start over
const root = ref(null)

const cart = computed(() => (quote.value ? { ...cartFromQuote(quote.value), heldSeconds: 895 } : {}))
const summary = computed(() => (quote.value ? summaryFromQuote(quote.value) : {}))

function onSelected (q) {
  if (!q) return
  quote.value = { ...q, payOption: 'first' }
  step.value = 'checkout'
}
watch(step, (s) => {
  send('top')
  if (s === 'confirm') {
    store.hotel = quote.value // Confirmation reads store.hotel
    send('booked', { hotel: quote.value })
  }
  if (s === 'checkout' && store.autofill) setTimeout(() => fillDom(root.value), 300)
})

// The library pages' own buttons are plain buttons without events we can bind,
// so their clicks are picked up by delegation (no library changes).
function onClick (e) {
  if (step.value === 'checkout') {
    if (e.target.closest('.ck__submit')) { e.preventDefault(); step.value = 'confirm'; return }
    const rail = e.target.closest('.ck__railbtn')
    if (rail) {
      if (rail.classList.contains('ck__railbtn--ghost')) { quote.value = null; browseKey.value++ }
      step.value = 'browse'
    }
  } else if (step.value === 'confirm' && e.target.closest('.conf__banner-cta')) {
    send('back')
  }
}

// Prototype "Fill form" button (relayed by bridge.js) — fills the checkout.
const onFill = (e) => { if (step.value === 'checkout') fillDom(root.value, !!e.detail?.force) }
onMounted(() => window.addEventListener('ew:fill', onFill))
onBeforeUnmount(() => window.removeEventListener('ew:fill', onFill))
watch(() => store.autofill, (on) => { if (on && step.value === 'checkout') nextTick(() => fillDom(root.value)) })
</script>

<template>
  <div ref="root" class="sj" :class="`sj--${step}`" @click.capture="onClick">
    <div v-show="step === 'browse'">
      <section class="sj__hero">
        <div class="sj__hero-inner">
          <p class="sj__eyebrow">Hotels for race weekend</p>
          <h1 class="sj__event">2026 San Antonio Spartan Trifecta Weekend</h1>
          <p class="sj__dates">Nov 21 – 22, 2026 · Sandy Oaks Ranch, Devine, TX</p>
        </div>
      </section>
      <div class="sj__browse">
        <hotel-browser :key="browseKey" layout="page" :show-pay="false" :party="store.party" @selected="onSelected" />
      </div>
    </div>

    <div v-if="step === 'checkout' && quote" class="sj__checkout">
      <checkout-page-expanded mode="reservation" :cart="cart" :summary="summary" :show-teams="false" />
    </div>

    <confirmation v-if="step === 'confirm'" standalone />
  </div>
</template>

<style scoped>
.sj { background: var(--ds-color-surface-canvas, #f9f9fa); min-height: 400px; }
.sj__hero {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  padding: 24px;
  text-align: center;
  color: #fff;
  background: linear-gradient(rgba(1, 17, 62, 0.62), rgba(1, 17, 62, 0.62)), url('./assets/img/gallery-03.jpg') center 40% / cover;
}
:global(html.skin-spartan) .sj__hero { background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('./assets/img/gallery-03.jpg') center 40% / cover; }
.sj__eyebrow { margin: 0; font-size: 0.8125rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.85; }
.sj__event { margin: 6px 0 0; font-size: 1.75rem; font-weight: 700; line-height: 1.2; color: #fff; }
.sj__dates { margin: 6px 0 0; font-size: 1rem; opacity: 0.9; }
.sj__browse { max-width: 1240px; margin: 0 auto; padding: 24px 24px 48px; }
.sj__checkout :deep(.ck) { min-height: 0; }
/* embedded + auto-height: the library's fixed countdown pill would sit at the
   bottom of a very tall frame — the top timer strip already shows it */
</style>
