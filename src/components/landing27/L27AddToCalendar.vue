<script setup>
// L27AddToCalendar — "Add to calendar" button with Google / Outlook / .ics.
import { calendarLinks } from './L27Extras.js'
import './l27.css'
defineProps({ variant: { type: String, default: 'ghost' } }) // ghost | dark | yellow
</script>

<template>
  <button type="button" class="l27-btn" :class="`l27-btn--${variant}`">
    <q-icon name="event" size="20px" /> Add to calendar <q-icon name="expand_more" size="18px" />
    <q-menu class="l27bw-menu" :offset="[0, 8]">
      <div class="l27atc">
        <a v-for="c in calendarLinks" :key="c.label" class="l27atc__opt" :href="c.href" :download="c.download || null" target="_blank" rel="noopener">{{ c.label }}</a>
        <p class="l27atc__note">Adds Sept 27–30, 2027 (Smart Monday + show days).</p>
      </div>
    </q-menu>
  </button>
</template>

<style>
.l27atc { padding: 8px; min-width: 240px; display: flex; flex-direction: column; }
.l27atc__opt { padding: 10px 12px; border-radius: 8px; font-weight: 700; color: #1D1D1B; text-decoration: none; }
.l27atc__opt:hover { background: #F6F4F8; }
.l27atc__note { margin: 6px 12px 6px; font-size: 0.75rem; color: #5B5B66; }
</style>
