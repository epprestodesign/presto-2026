<script setup>
// Black post-purchase bar: Spartan logo centered, "Manage booking" at the right.
// Used by the confirmations and the separate hotel page (E/F).
import { asset } from '../data.js'
</script>

<template>
  <header class="scb">
    <a href="#/event" class="scb__logo" aria-label="Spartan Race home">
      <img :src="asset('icons/spartan-logo.svg')" alt="" />
    </a>
    <a href="#" class="scb__manage" @click.prevent>
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      Manage booking
    </a>
  </header>
</template>

<style scoped>
.scb { position: sticky; top: 0; z-index: 40; height: 67px; display: flex; align-items: center; justify-content: center; background: #000; }
.scb__logo img { width: 40px; height: 40px; }
.scb__manage {
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
.scb__manage:hover { border-color: #fff; background: rgba(255, 255, 255, 0.08); }
</style>
