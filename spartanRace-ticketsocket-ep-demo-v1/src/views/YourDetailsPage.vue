<script setup>
// Checkout step: Details › Add-ons › Extras › Your Details › Payment.
// Body = the embedded Eventpipe widget rendering the library's checkout steps
// 1–4 (Checkout Experience Expanded), in the concept's color skin. No Book Now:
// the Spartan Continue moves on to Payment.
import { onBeforeMount } from 'vue'
import { state, ensureOrder, go } from '../store.js'
import CheckoutLayout from '../components/CheckoutLayout.vue'
import PrestoFrame from '../components/PrestoFrame.vue'

onBeforeMount(ensureOrder)
</script>

<template>
  <CheckoutLayout step="guest" :title="['Your details']" cta="Payment" @submit="go('payment')">
    <p class="yd__lead">
      Guest and contact details for your order<template v-if="state.hotel"> and your stay at <strong>{{ state.hotel.name }}</strong></template>.
    </p>
    <PrestoFrame :key="state.skin" class="yd__frame" view="details" :skin="state.skin" :width="644" />
    <p class="yd__by">Details powered by <strong>Eventpipe</strong></p>
  </CheckoutLayout>
</template>

<style scoped>
.yd__lead { margin-top: 58px; font-size: 15.8px; font-weight: 500; line-height: 22px; color: #000; }
.yd__frame { margin-top: 26px; }
.yd__by { margin-top: 14px; font-size: 12px; color: #8a8a8a; }
.yd__by strong { color: #555; }
</style>
