<script setup>
// Presenter-only jump menu (bottom-left). Not part of the Spartan UI —
// hidden until hovered so it never shows up in screenshots.
import { state, go, resetDemo } from '../store.js'
const STEPS = [
  ['event', 'Event page'],
  ['login', 'Sign in'],
  ['details', 'Order details'],
  ['extras', 'Extras'],
  ['payment', 'Payment'],
  ['location', 'Location picker'],
]
</script>

<template>
  <nav class="demo" aria-label="Prototype navigation">
    <span class="demo__tab">Demo</span>
    <div class="demo__menu">
      <button v-for="[r, l] in STEPS" :key="r" :class="{ on: state.route === r }" @click="go(r)">{{ l }}</button>
      <button class="demo__reset" @click="resetDemo">Reset demo</button>
    </div>
  </nav>
</template>

<style scoped>
.demo { position: fixed; left: 0; bottom: 0; z-index: 90; font-family: system-ui, sans-serif; }
.demo__tab {
  display: block;
  padding: 4px 10px;
  border-radius: 0 6px 0 0;
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.25);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.demo__menu {
  display: none;
  position: absolute;
  left: 8px;
  bottom: 8px;
  min-width: 170px;
  padding: 6px;
  border-radius: 8px;
  background: #1d1d1f;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}
.demo:hover .demo__menu, .demo:focus-within .demo__menu { display: block; }
.demo__menu button { display: block; width: 100%; padding: 7px 10px; border-radius: 5px; color: #ddd; font-size: 13px; text-align: left; }
.demo__menu button:hover { background: #333; }
.demo__menu button.on { color: #fff; font-weight: 600; }
.demo__reset { margin-top: 4px; border-top: 1px solid #333 !important; color: #ff8a80 !important; }
</style>
