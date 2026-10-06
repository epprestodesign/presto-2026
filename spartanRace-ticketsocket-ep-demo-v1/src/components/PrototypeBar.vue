<script setup>
// Prototype chrome — sits above the Spartan site on every screen except the
// hub. Not part of either brand's UI.
import { ref, computed } from 'vue'
import { fillNow, FORM_ROUTES } from '../autofill.js'
import { state, hrefFor, CONCEPTS, conceptOf } from '../store.js'

const LABEL = { inline: 'Inline', modal: 'Modal' }
const SKIN = { presto: 'Presto colors', spartan: 'Spartan colors' }
const current = computed(() => conceptOf(state.variant, state.skin))
const list = Object.entries(CONCEPTS).map(([id, c]) => ({ id, ...c }))

const hasForm = computed(() => FORM_ROUTES.includes(state.route))
const filled = ref(false)
function onFill () {
  fillNow()
  filled.value = true
  setTimeout(() => (filled.value = false), 1400)
}
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
    <label class="pb__fill" :class="{ on: state.autofill }" title="Auto-fill: form steps fill themselves so you can click straight through. Off: type everything yourself.">
      <input v-model="state.autofill" type="checkbox" role="switch" :aria-checked="state.autofill" />
      <span class="pb__track" aria-hidden="true"><span class="pb__thumb" /></span>
      <span class="pb__filltext">Auto-fill forms <b>{{ state.autofill ? 'On' : 'Off' }}</b></span>
    </label>
    <button v-if="state.autofill" type="button" class="pb__fillbtn" :disabled="!hasForm" :title="hasForm ? 'Fill every field on this step' : 'No form on this step'" @click="onFill">
      <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4ZM14 6l4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
      {{ filled ? 'Filled ✓' : 'Fill form' }}
    </button>
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
.pb__fill { display: inline-flex; align-items: center; gap: 8px; margin-left: auto; padding: 4px 10px 4px 6px; border-radius: 999px; cursor: pointer; user-select: none; }
.pb__fill:hover { background: rgba(255, 255, 255, 0.08); }
.pb__fill input { position: absolute; opacity: 0; width: 1px; height: 1px; }
.pb__track { position: relative; width: 30px; height: 18px; border-radius: 9px; background: #4a4a52; transition: background 0.15s; }
.pb__thumb { position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: #fff; transition: transform 0.15s; }
.pb__fill.on .pb__track { background: #2fa36b; }
.pb__fill.on .pb__thumb { transform: translateX(12px); }
.pb__fill input:focus-visible + .pb__track { outline: 2px solid #8fd3a8; outline-offset: 2px; }
.pb__filltext { color: rgba(255, 255, 255, 0.8); font-weight: 600; }
.pb__filltext b { color: #fff; }
.pb__fillbtn { display: inline-flex; align-items: center; gap: 6px; height: 26px; margin-left: 8px; padding: 0 12px; border-radius: 6px; background: #2fa36b; color: #fff; font: inherit; font-weight: 700; cursor: pointer; }
.pb__fillbtn:hover:not(:disabled) { background: #27925f; }
.pb__fillbtn:disabled { background: rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.4); cursor: default; }
.pb__switch { display: flex; align-items: center; gap: 4px; margin-left: 16px; padding-left: 16px; border-left: 1px solid rgba(255, 255, 255, 0.16); }
.pb__switch span { margin-right: 4px; color: rgba(255, 255, 255, 0.5); }
.pb__switch a { display: grid; place-items: center; width: 28px; height: 26px; border-radius: 6px; border-bottom: 2px solid #4e63a0; font-weight: 700; }
.pb__switch a.is-spartan { border-bottom-color: #be2d27; }
.pb__switch a:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
.pb__switch a.on { background: #fff; color: #111; }
</style>
