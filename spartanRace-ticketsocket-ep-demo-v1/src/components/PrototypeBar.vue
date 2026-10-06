<script setup>
// Prototype chrome — sits above the Spartan site on every screen except the
// hub. Not part of either brand's UI.
import { computed } from 'vue'
import { state, hrefFor, CONCEPTS, conceptOf } from '../store.js'

const LABEL = { inline: 'Inline', modal: 'Modal' }
const SKIN = { presto: 'Presto colors', spartan: 'Spartan colors' }
const current = computed(() => conceptOf(state.variant, state.skin))
const list = Object.entries(CONCEPTS).map(([id, c]) => ({ id, ...c }))
</script>

<template>
  <div class="pb" role="banner" aria-label="Prototype">
    <a class="pb__home" href="#/">
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
      All prototypes
    </a>
    <span class="pb__sep" aria-hidden="true" />
    <span class="pb__tag">Prototype</span>
    <span class="pb__title">Spartan × Eventpipe hotel add-ons</span>
    <span class="pb__ver">Concept {{ current.toUpperCase() }} · {{ LABEL[state.variant] }} · {{ SKIN[state.skin] }}</span>
    <nav class="pb__switch" aria-label="Switch concept">
      <span>Switch</span>
      <a
        v-for="c in list"
        :key="c.id"
        :href="hrefFor(state.route, c.variant, c.skin)"
        :class="{ on: c.id === current, 'is-spartan': c.skin === 'spartan' }"
        :aria-current="c.id === current ? 'page' : undefined"
        :title="`Concept ${c.id.toUpperCase()} · ${LABEL[c.variant]} · ${SKIN[c.skin]}`"
      >{{ c.id.toUpperCase() }}</a>
    </nav>
  </div>
</template>

<style scoped>
.pb {
  position: relative;
  z-index: 60;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 40px;
  padding: 0 20px;
  background: #1b1b1f;
  border-bottom: 1px solid #2c2c32;
  color: rgba(255, 255, 255, 0.72);
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 13px;
}
.pb a { color: inherit; text-decoration: none; }
.pb__home { display: inline-flex; align-items: center; gap: 4px; padding: 5px 10px 5px 6px; border-radius: 6px; color: #fff !important; font-weight: 600; }
.pb__home:hover { background: rgba(255, 255, 255, 0.1); }
.pb__sep { width: 1px; height: 18px; background: rgba(255, 255, 255, 0.16); }
.pb__tag { padding: 2px 7px; border-radius: 4px; background: rgba(255, 90, 95, 0.16); color: #ff7a7e; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
.pb__title { color: rgba(255, 255, 255, 0.6); }
.pb__ver { padding: 3px 9px; border: 1px solid rgba(255, 255, 255, 0.22); border-radius: 999px; color: #fff; font-weight: 600; }
.pb__switch { display: flex; align-items: center; gap: 4px; margin-left: auto; }
.pb__switch span { margin-right: 4px; color: rgba(255, 255, 255, 0.5); }
.pb__switch a { display: grid; place-items: center; width: 28px; height: 26px; border-radius: 6px; border-bottom: 2px solid #4e63a0; font-weight: 700; }
.pb__switch a.is-spartan { border-bottom-color: #be2d27; }
.pb__switch a:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
.pb__switch a.on { background: #fff; color: #111; }
</style>
