<script setup>
// New checkout step: Details › Add-ons › Extras › Payment.
// The step body is the embedded Eventpipe/Presto widget (iframe).
//   Version A (#/a/…) — the hotel finder expands inline under the toggle
//   Version B (#/b/…) — the hotel finder opens in a 900px responsive modal
// #/<a|b>/checkout/addons/hotels deep-links straight to the finder open.
import { onBeforeMount, watch } from 'vue'
import { state, ensureOrder, go, setRouteSilently } from '../store.js'
import CheckoutLayout from '../components/CheckoutLayout.vue'
import PrestoFrame from '../components/PrestoFrame.vue'
import HotelModal from '../components/HotelModal.vue'

function openFinder () {
  state.hotelOn = true
  if (state.variant === 'modal') state.overlayOpen = true
}
onBeforeMount(() => {
  ensureOrder()
  if (state.route === 'hotels') openFinder()
})
// also re-run when switching versions on the same /hotels screen (prototype bar)
watch(() => [state.route, state.variant, state.skin], ([r]) => { if (r === 'hotels') openFinder() })

// keep the URL in step with the finder so any open state can be shared
watch(
  () => (state.variant === 'modal' ? state.overlayOpen : state.hotelOn),
  (open) => setRouteSilently(open ? 'hotels' : 'addons'),
)
</script>

<template>
  <CheckoutLayout step="addons" :title="['Add-ons']" cta="Continue" @submit="go('extras')">
    <p class="ao__lead">Hotels, parking and more for race weekend — added to this same order.</p>
    <PrestoFrame
      :key="state.variant + state.skin"
      class="ao__frame"
      view="addons"
      :variant="state.variant"
      :skin="state.skin"
      @open-overlay="state.overlayOpen = true"
    />
    <p class="ao__by">Add-ons powered by <strong>Eventpipe</strong></p>
    <HotelModal v-if="state.variant === 'modal' && state.overlayOpen" />
  </CheckoutLayout>
</template>

<style scoped>
.ao__lead { margin-top: 58px; font-size: 15.8px; font-weight: 500; line-height: 22px; color: #000; }
.ao__frame { margin-top: 26px; margin-left: -2px; }
.ao__by { margin-top: 14px; font-size: 12px; color: #8a8a8a; }
.ao__by strong { color: #555; }
</style>
