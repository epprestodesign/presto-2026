<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <div class="chat">
    <div v-if="open" class="chat__panel" role="dialog" aria-label="Chat with Spartan">
      <p class="chat__title">Hi, Spartan! 👋</p>
      <p class="chat__body">Questions about your race, tickets or passes? Our team typically replies in a few minutes.</p>
    </div>
    <button class="chat__btn" :aria-label="open ? 'Close chat' : 'Open chat'" @click="open = !open">
      <svg v-if="!open" viewBox="0 0 32 32" width="36" height="36" aria-hidden="true">
        <path d="M7.5 8h17A3.5 3.5 0 0 1 28 11.5v6a3.5 3.5 0 0 1-3.5 3.5H22l.6 4.2L17.8 21H7.5A3.5 3.5 0 0 1 4 17.5v-6A3.5 3.5 0 0 1 7.5 8Z" fill="#fff" />
      </svg>
      <svg v-else viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="#fff" stroke-width="2.6" stroke-linecap="round" /></svg>
    </button>
  </div>
</template>

<style scoped>
.chat { position: fixed; right: 20px; bottom: 18px; z-index: 80; }
.chat__btn {
  width: 63px;
  height: 63px;
  border-radius: 50%;
  background: var(--red-checkout);
  display: grid;
  place-items: center;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.22);
}
.chat__panel {
  position: absolute;
  right: 0;
  bottom: 76px;
  width: 300px;
  padding: 20px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}
.chat__title { font-size: 16px; font-weight: 700; }
.chat__body { margin-top: 6px; font-size: 14px; line-height: 1.45; color: #444; }
</style>
