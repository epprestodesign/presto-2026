<script setup>
import { ref, onMounted } from 'vue'
import { VIEW, VARIANT, store, pushState, autoResize } from './bridge.js'
import WeekendCard from './WeekendCard.vue'
import HotelBrowser from './HotelBrowser.vue'
import ModalShell from './ModalShell.vue'
import YourDetails from './YourDetails.vue'

// Variant A: the inline browser writes straight into the order as you choose.
const onQuote = (q) => { store.hotel = q; pushState() }
const root = ref(null)
onMounted(() => { if (VIEW === 'addons' || VIEW === 'details') autoResize(root.value) })
</script>

<template>
  <modal-shell v-if="VIEW === 'modal'" />
  <div v-else-if="VIEW === 'details'" ref="root" class="pa"><your-details /></div>
  <div v-else ref="root" class="pa">
    <weekend-card />
    <transition name="pa-slide">
      <hotel-browser
        v-if="VARIANT === 'inline' && store.hotelOn"
        class="pa__browser"
        layout="inline"
        :party="store.party"
        :initial="store.hotel"
        @update:quote="onQuote"
      />
    </transition>
  </div>
</template>

<style>
/* the widget sits on the host's white checkout page */
html, body { background: transparent; }
html.ew-embed, html.ew-embed body { overflow: hidden; }
body { margin: 0; }
/* ── Spartan color skin (concepts C + D) ─────────────────────────────────────
   Colors only: Presto's components, type and shapes stay as-is; the brand
   tokens are re-pointed at Spartan's checkout palette (red CTAs, black text).
   Semantic tokens reference the navy palette, so re-pointing the palette
   carries through every library component; a few semantics are set directly
   where Spartan uses black rather than its red. */
html.skin-spartan {
  --q-primary: #be2d27;
  --ds-palette-navy-50: #fdf1f1;
  --ds-palette-navy-100: #fae8ea;
  --ds-palette-navy-200: #f2c3c1;
  --ds-palette-navy-300: #e3908c;
  --ds-palette-navy-400: #d4625c;
  --ds-palette-navy-500: #cf111a;
  --ds-palette-navy-600: #c41e25;
  --ds-palette-navy-700: #be2d27;
  --ds-palette-navy-800: #a1231e;
  --ds-palette-navy-900: #be2d27;
  --ds-palette-navy-950: #000000;
  /* Neutrals: Presto's Slate scale leans blue. Re-point the full 50–950 ramp at
     true grays matched to Spartan's site (panels #FAFAFA/#F3F3F3, rules #E2E2E2,
     greys #B1B1B1/#8C8C8C, ink #222/#121212) so every container is neutral. */
  --ds-palette-slate-50: #fafafa;
  --ds-palette-slate-100: #f3f3f3;
  --ds-palette-slate-200: #e2e2e2;
  --ds-palette-slate-300: #d6d6d6;
  --ds-palette-slate-400: #b1b1b1;
  --ds-palette-slate-500: #8c8c8c;
  --ds-palette-slate-600: #6b6b6b;
  --ds-palette-slate-700: #4a4a4a;
  --ds-palette-slate-800: #222222;
  --ds-palette-slate-900: #121212;
  --ds-palette-slate-950: #000000;
  --ds-color-surface-canvas: #fafafa;
  --ds-color-surface-sunken: #f3f3f3;
  /* Text defaults to black (status colors — available / limited — keep their meaning). */
  --ds-color-text: #000000;
  --ds-color-text-subtle: #000000;
  --ds-color-text-subtlest: #000000;
  --ds-color-icon: #000000;
  --ds-color-icon-subtle: #000000;
  --ds-color-text-brand: #000000;
  --ds-color-link: #000000;
  --ds-color-link-visited: #000000;
  /* Brand: Spartan checkout red for actions + selection outlines; tinted
     containers use the neutral ramp instead of pink. */
  --ds-color-border-brand: #be2d27;
  --ds-color-border-focused: #be2d27;
  --ds-color-background-brand-bold: #be2d27;
  --ds-color-background-brand-subtlest: #f3f3f3;
  --ds-color-background-selected: #f3f3f3;
  --ds-color-background-selected-bold: #be2d27;
  --q-dark: #121212;
}
/* Quasar's own greys (field labels, hints) and the navy-tinted card shadows */
html.skin-spartan .q-field__label,
html.skin-spartan .q-field__native,
html.skin-spartan .q-field__marginal,
html.skin-spartan .q-field__bottom { color: #000; }
html.skin-spartan .text-grey-7,
html.skin-spartan .text-grey-8 { color: #000 !important; }
/* HotelMap paints its price pills with a hard-coded navy inline style. */
html.skin-spartan [style*="background: rgb(1, 17, 62)"] { background: #be2d27 !important; }
html.skin-spartan [style*="rgb(1, 17, 62)"] { border-color: #be2d27 !important; }
html.skin-spartan [style*="color: rgb(1, 17, 62)"] { color: #be2d27 !important; }
/* HotelMap popups author their text in zinc greys inline — default them to black */
html.skin-spartan [style*="#71717A"], html.skin-spartan [style*="rgb(113, 113, 122)"],
html.skin-spartan [style*="color:#18181B"], html.skin-spartan [style*="color: rgb(24, 24, 27)"] { color: #000 !important; }
html.skin-spartan .hb__legend-dot { box-shadow: 0 0 0 4px rgba(190, 45, 39, 0.18); }
html.skin-spartan .hb-venue { background: #000; }
html.skin-spartan .hb-venue::after { border-top-color: #000; }

/* Version B review step: the pinned Confirm footer is phones-only (desktop has it inline). */
@media (min-width: 761px) { .dsm__foot:has(.mf__phonebar) { display: none; } }

/* Race-venue tag attached to HotelMap's event pulse (see HotelBrowser labelVenue). */
.hm-pulse { position: relative; }
.hb-venue {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  background: #01113e;
  color: #fff;
  font: 400 13px/1.2 'PT Sans', system-ui, sans-serif;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  pointer-events: none;
}
.hb-venue::after { content: ''; position: absolute; top: 100%; left: 50%; margin-left: -6px; border: 6px solid transparent; border-top-color: #01113e; }
.hb-venue b { font-weight: 700; }

/* DsModal has no 900px size; this widget sets "lg" to 900 for the hotel finder.
   (Proposal: add size="900" to the library.) */
@media (min-width: 641px) {
  .dsm > .dsm__card.dsm__card--lg { max-width: 900px; height: min(860px, 88vh); margin-top: -2vh; }
}
</style>
<style scoped>
.pa { padding: 2px; }
.pa__browser { margin-top: 16px; }
.pa-slide-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.pa-slide-enter-from { opacity: 0; transform: translateY(-6px); }
</style>
