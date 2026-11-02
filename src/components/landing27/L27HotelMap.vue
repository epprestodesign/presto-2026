<script setup>
// L27HotelMap — official hotels beside a stylized Las Vegas Strip map.
// Hovering a hotel card lights its pin (and vice-versa); every card shows walk
// time to Mandalay Bay, the block rate vs. public rate, and rooms left.
// "Book" emits `book` with the hotel id (pages open the booking modal).
import { ref } from 'vue'
import { hotels as defaultHotels } from './imex.js'
import './l27.css'

const props = defineProps({
  hotels: { type: Array, default: () => defaultHotels },
  tone: { type: String, default: 'light' }, // light | dark
  showMap: { type: Boolean, default: true },
  limit: { type: Number, default: 6 },
})
const emit = defineEmits(['book'])
const active = ref('')
</script>

<template>
  <div class="l27hm" :class="[`l27hm--${tone}`, { 'l27hm--nomap': !showMap }]">
    <ul class="l27hm__list">
      <li
        v-for="h in hotels.slice(0, limit)" :key="h.id" class="l27hm__card" :class="{ 'is-active': active === h.id }"
        @mouseenter="active = h.id" @mouseleave="active = ''" @focusin="active = h.id" @focusout="active = ''"
      >
        <div class="l27hm__imgwrap">
          <img :src="h.image" :alt="h.name" class="l27hm__img" />
          <span class="l27hm__walk"><q-icon :name="h.walk === 0 ? 'location_on' : 'directions_walk'" size="15px" />{{ h.walkLabel }}</span>
        </div>
        <div class="l27hm__body">
          <div class="l27hm__name">{{ h.name }}</div>
          <div class="l27hm__perks"><span v-for="p in h.perks" :key="p" class="l27hm__perk">{{ p }}</span></div>
          <div class="l27hm__foot">
            <div>
              <span class="l27hm__was">${{ h.was }}</span>
              <span class="l27hm__rate">${{ h.rate }}</span><span class="l27hm__per">/night</span>
              <div class="l27hm__left" :class="{ 'is-low': h.left < 20 }">{{ h.left }} rooms left</div>
            </div>
            <button type="button" class="l27-btn l27-btn--primary l27hm__book" @click="emit('book', h.id)">Book</button>
          </div>
        </div>
      </li>
    </ul>

    <div v-if="showMap" class="l27hm__map" aria-label="Map of official hotels along the Las Vegas Strip" role="img">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="l27hm__svg" aria-hidden="true">
        <path d="M30 100 C 34 80, 44 62, 50 46 S 62 18, 66 0" class="l27hm__strip" />
        <path d="M30 100 C 34 80, 44 62, 50 46 S 62 18, 66 0" class="l27hm__stripdash" />
        <path d="M34 78 L 46 58 L 50 44" class="l27hm__tram" />
      </svg>
      <span class="l27hm__road">Las Vegas Blvd · The Strip</span>
      <span class="l27hm__tramlbl">Free tram</span>
      <button
        v-for="h in hotels.slice(0, limit)" :key="h.id" type="button" class="l27hm__pin"
        :class="{ 'is-venue': h.walk === 0, 'is-active': active === h.id }"
        :style="{ left: h.x + '%', top: h.y + '%' }" :aria-label="`${h.name}, ${h.walkLabel}, $${h.rate} per night`"
        @mouseenter="active = h.id" @mouseleave="active = ''" @click="emit('book', h.id)"
      >
        <span class="l27hm__pinlbl">{{ h.walk === 0 ? 'IMEX · Mandalay Bay' : `$${h.rate}` }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.l27hm { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr); gap: 24px; font-family: var(--l27-font); align-items: start; }
.l27hm--nomap { grid-template-columns: 1fr; }
.l27hm__list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.l27hm--nomap .l27hm__list { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.l27hm__card { background: #fff; border: 1.5px solid var(--l27-line); border-radius: var(--l27-radius); overflow: hidden; transition: border-color .15s, transform .15s, box-shadow .15s; color: var(--l27-ink); }
.l27hm__card.is-active { border-color: var(--l27-red); transform: translateY(-2px); box-shadow: var(--l27-shadow); }
.l27hm__imgwrap { position: relative; }
.l27hm__img { width: 100%; height: 150px; object-fit: cover; display: block; }
.l27hm__walk { position: absolute; left: 10px; bottom: 10px; display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 999px; background: rgba(255,255,255,.94); font-size: 0.75rem; font-weight: 800; color: var(--l27-ink); }
.l27hm__body { padding: 14px; }
.l27hm__name { font-weight: 900; font-size: 1.0625rem; }
.l27hm__perks { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.l27hm__perk { font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 6px; background: var(--l27-pink); color: #8A1E2B; }
.l27hm__foot { display: flex; align-items: flex-end; justify-content: space-between; gap: 8px; margin-top: 14px; }
.l27hm__was { font-size: 0.8125rem; color: var(--l27-muted); text-decoration: line-through; margin-right: 6px; }
.l27hm__rate { font-size: 1.5rem; font-weight: 900; }
.l27hm__per { font-size: 0.8125rem; color: var(--l27-muted); margin-left: 2px; }
.l27hm__left { font-size: 0.75rem; font-weight: 700; color: var(--l27-green); margin-top: 2px; }
.l27hm__left.is-low { color: var(--l27-red); }
.l27hm__book { height: 40px; padding: 0 18px; font-size: 0.9375rem; }
.l27hm__map { position: sticky; top: 90px; aspect-ratio: 4 / 5; border-radius: var(--l27-radius); overflow: hidden; background: linear-gradient(160deg, #F4EFE6, #EADFCF); border: 1.5px solid var(--l27-line); }
.l27hm__svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.l27hm__strip { fill: none; stroke: #fff; stroke-width: 7; stroke-linecap: round; }
.l27hm__stripdash { fill: none; stroke: #D8CBB6; stroke-width: .6; stroke-dasharray: 2 2; }
.l27hm__tram { fill: none; stroke: var(--l27-blue); stroke-width: 1.2; stroke-dasharray: 1.5 1.5; }
.l27hm__road { position: absolute; left: 56%; top: 8%; font-size: 0.6875rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: #9C8B70; transform: rotate(-64deg); transform-origin: left top; white-space: nowrap; }
.l27hm__tramlbl { position: absolute; left: 47%; top: 64%; font-size: 0.6875rem; font-weight: 800; color: var(--l27-blue); }
.l27hm__pin { position: absolute; transform: translate(-50%, -100%); border: 0; background: none; padding: 0; cursor: pointer; }
.l27hm__pinlbl { display: inline-block; padding: 5px 10px; border-radius: 999px; background: #fff; color: var(--l27-ink); font-family: var(--l27-font); font-size: 0.8125rem; font-weight: 900; box-shadow: 0 6px 14px -6px rgba(0,0,0,.4); position: relative; transition: transform .15s, background .15s; white-space: nowrap; }
.l27hm__pinlbl::after { content: ''; position: absolute; left: 50%; bottom: -5px; transform: translateX(-50%); border: 6px solid transparent; border-bottom: 0; border-top-color: inherit; border-top-color: #fff; }
.l27hm__pin.is-venue .l27hm__pinlbl { background: var(--l27-red); color: #fff; }
.l27hm__pin.is-venue .l27hm__pinlbl::after { border-top-color: var(--l27-red); }
.l27hm__pin.is-active .l27hm__pinlbl { background: var(--l27-ink); color: #fff; transform: scale(1.12); }
.l27hm__pin.is-active .l27hm__pinlbl::after { border-top-color: var(--l27-ink); }
.l27hm--dark .l27hm__card { background: #1B1F55; border-color: rgba(255,255,255,.12); color: #fff; }
.l27hm--dark .l27hm__perk { background: rgba(255,209,0,.14); color: var(--l27-yellow); }
.l27hm--dark .l27hm__was, .l27hm--dark .l27hm__per { color: rgba(255,255,255,.6); }
.l27hm--dark .l27hm__left { color: #7FE3A6; }
.l27hm--dark .l27hm__left.is-low { color: #FF9AA0; }
.l27hm--dark .l27hm__map { background: radial-gradient(circle at 40% 70%, #2A2F78, #0E1033); border-color: rgba(255,255,255,.12); }
.l27hm--dark .l27hm__strip { stroke: rgba(255,209,0,.35); }
.l27hm--dark .l27hm__stripdash { stroke: rgba(255,255,255,.4); }
.l27hm--dark .l27hm__road { color: rgba(255,255,255,.55); }
@media (max-width: 900px) {
  .l27hm { grid-template-columns: 1fr; }
  .l27hm__map { position: relative; top: 0; aspect-ratio: 16 / 10; order: -1; }
  .l27hm--nomap .l27hm__list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 560px) { .l27hm__list, .l27hm--nomap .l27hm__list { grid-template-columns: 1fr; } }
</style>
