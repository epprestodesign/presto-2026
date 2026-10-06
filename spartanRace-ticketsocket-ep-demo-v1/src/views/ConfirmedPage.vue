<script setup>
// Order confirmed — after Pay. Black bar with the Spartan logo centered and
// "Manage booking" at the right; body is the embedded Eventpipe confirmation
// (library ConfirmationPage) in the concept's color skin.
import { onBeforeMount } from 'vue'
import { state, ensureOrder } from '../store.js'
import { asset } from '../data.js'
import PrestoFrame from '../components/PrestoFrame.vue'

onBeforeMount(ensureOrder)
</script>

<template>
  <div class="cp">
    <header class="cp__bar">
      <a href="#/event" class="cp__logo" aria-label="Spartan Race home">
        <img :src="asset('icons/spartan-logo.svg')" alt="" />
      </a>
      <a href="#" class="cp__manage" @click.prevent>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        Manage booking
      </a>
    </header>
    <main class="cp__main">
      <PrestoFrame :key="state.skin" class="cp__frame" view="confirm" :skin="state.skin" :width="1100" />
    </main>
  </div>
</template>

<style scoped>
.cp { min-height: 100vh; background: #f5f5f5; }
.cp__bar {
  position: sticky;
  top: 0;
  z-index: 40;
  height: 67px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}
.cp__logo img { width: 40px; height: 40px; }
.cp__manage {
  position: absolute;
  right: 40px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 16px;
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 999px;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-decoration: none;
  text-transform: uppercase;
}
.cp__manage:hover { border-color: #fff; background: rgba(255, 255, 255, 0.08); }
.cp__main { display: flex; justify-content: center; padding: 8px 0 40px; }
</style>
