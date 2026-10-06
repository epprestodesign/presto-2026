<script setup>
// Order confirmed — after Pay. Black bar with the Spartan logo centered and
// "Manage booking" at the right; body is the embedded Eventpipe confirmation
// (library ConfirmationPage) in the concept's color skin.
import { onBeforeMount } from 'vue'
import { state, ensureOrder } from '../store.js'
import PrestoFrame from '../components/PrestoFrame.vue'
import SpartanConfirmBar from '../components/SpartanConfirmBar.vue'

onBeforeMount(ensureOrder)
</script>

<template>
  <div class="cp">
    <SpartanConfirmBar />
    <main class="cp__main">
      <PrestoFrame :key="state.skin" class="cp__frame" view="confirm" :skin="state.skin" :width="1100" />
    </main>
  </div>
</template>

<style scoped>
.cp { min-height: 100vh; background: #f5f5f5; }
.cp__main { display: flex; justify-content: center; padding: 8px 0 40px; }
</style>
