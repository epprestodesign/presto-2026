<script setup>
// E/F — the separate hotel booking page, opened from the ticket confirmation
// in the same tab under the Spartan bar. Body: the full Presto booking journey
// (Browse → Details → Checkout → Confirmation) in the concept's color skin.
import { onBeforeMount } from 'vue'
import { state, ensureOrder, go } from '../store.js'
import PrestoFrame from '../components/PrestoFrame.vue'
import SpartanConfirmBar from '../components/SpartanConfirmBar.vue'

onBeforeMount(ensureOrder)
const onBooked = (hotel) => { state.stayHotel = hotel }
</script>

<template>
  <div class="sp">
    <SpartanConfirmBar />
    <div class="sp__sub">
      <button type="button" class="sp__back" @click="go('ticketconf')">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
        Back to my order
      </button>
      <span class="sp__by">Hotel booking powered by <strong>Eventpipe</strong></span>
    </div>
    <PrestoFrame :key="state.skin" class="sp__frame" view="journey" :skin="state.skin" :width="1440" @booked="onBooked" @back="go('ticketconf')" />
  </div>
</template>

<style scoped>
.sp { min-height: 100vh; background: #f9f9fa; }
.sp__sub { display: flex; align-items: center; justify-content: space-between; height: 46px; padding: 0 40px; background: #fff; border-bottom: 1px solid #e2e2e2; font-size: 14px; }
.sp__back { display: inline-flex; align-items: center; gap: 6px; font-weight: 700; color: #000; }
.sp__back:hover { text-decoration: underline; }
.sp__by { color: #8a8a8a; }
.sp__by strong { color: #555; }
.sp__frame { width: 100% !important; }
</style>
