<script setup>
// Version B host layer: a transparent, full-viewport iframe. The Presto page
// inside draws DsModal's own backdrop + 900px card, so the modal (and every
// library breakpoint) responds to the real browser width, down to phones.
import { onMounted, onBeforeUnmount } from 'vue'
import { state } from '../store.js'
import PrestoFrame from './PrestoFrame.vue'

function close (hotel) {
  if (hotel) {
    state.hotel = hotel
    state.hotelOn = true
  } else if (!state.hotel) {
    state.hotelOn = false
  }
  state.overlayOpen = false
}
onMounted(() => { document.body.style.overflow = 'hidden' })
onBeforeUnmount(() => { document.body.style.overflow = '' })
</script>

<template>
  <div class="hmo">
    <PrestoFrame view="modal" fill :skin="state.skin" @confirm="close" @cancel="close()" />
  </div>
</template>

<style scoped>
.hmo { position: fixed; inset: 0; z-index: 100; }
</style>
