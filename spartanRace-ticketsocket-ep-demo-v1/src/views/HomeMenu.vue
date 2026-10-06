<script setup>
// Prototype hub — shown before the Spartan site. Not part of either brand's UI.
import { ref } from 'vue'
import { state, go, ensureOrder, hrefFor } from '../store.js'
import { asset } from '../data.js'

const INLINE = 'Turn on “Hotel room” and the hotel finder expands right inside the Spartan checkout. Picking a hotel updates the order total as you go.'
const MODAL = 'Turn on “Hotel room” to open the hotel finder in a 900px modal over the checkout (full-screen on phones). Pick a hotel, review how to pay beside the stay summary, then confirm it into the Spartan order.'
const CONCEPTS = [
  { id: 'a', tag: 'A', variant: 'inline', skin: 'presto', name: 'Inline', body: INLINE },
  { id: 'b', tag: 'B', variant: 'modal', skin: 'presto', name: 'Modal', body: MODAL },
  { id: 'c', tag: 'C', variant: 'inline', skin: 'spartan', name: 'Inline', body: INLINE },
  { id: 'd', tag: 'D', variant: 'modal', skin: 'spartan', name: 'Modal', body: MODAL },
]
const SKINS = [
  { id: 'presto', name: 'Presto colors', note: 'The widget in the Presto design system’s native navy — clearly an embedded Eventpipe experience.', acc: '#01113e' },
  { id: 'spartan', name: 'Spartan colors', note: 'Same components and layout, re-pointed at Spartan’s red/black palette so the widget blends into the host checkout.', acc: '#be2d27' },
]

// Deep links: every screen per version, so feedback can point at a URL.
const LINKS = [
  ['event', 'Event page'],
  ['details', 'Order details'],
  ['addons', 'Add-ons'],
  ['hotels', 'Add-ons · hotel finder open'],
  ['extras', 'Extras'],
  ['guest', 'Your Details'],
  ['payment', 'Payment'],
]
const origin = location.origin + location.pathname
const full = (route, c) => origin + hrefFor(route, c.variant, c.skin)
const copied = ref('')
async function copy (route, c) {
  try { await navigator.clipboard.writeText(full(route, c)) } catch (e) { /* clipboard blocked */ }
  copied.value = route + c.id
  setTimeout(() => (copied.value = ''), 1400)
}

function start (c, jump = false) {
  Object.assign(state, { variant: c.variant, skin: c.skin, hotel: null, hotelOn: false, parking: false, photo: false, overlayOpen: false })
  if (jump) {
    ensureOrder()
    state.signedIn = true
    go('addons')
  } else go('event')
}
</script>

<template>
  <div class="hm">
    <header class="hm__head">
      <div class="hm__logos">
        <img :src="asset('icons/spartan-logo.svg')" alt="Spartan" />
        <span>×</span>
        <strong>Eventpipe</strong>
      </div>
      <p class="hm__eyebrow">Prototype · Hotel add-ons</p>
      <h1 class="hm__title">2026 San Antonio Spartan Trifecta Weekend</h1>
      <p class="hm__lead">
        Spartan’s TicketSocket checkout with an Eventpipe “Make a weekend of it” step. The hotel finder is built from the
        Presto design system. Two UX patterns (inline vs. modal) × two color treatments (Presto vs. Spartan) = four concepts.
      </p>
    </header>

    <section v-for="sk in SKINS" :key="sk.id" class="hm__skin">
    <div class="hm__skinhead">
      <span class="hm__swatch" :style="{ background: sk.acc }" aria-hidden="true" />
      <h2>{{ sk.name }}</h2>
      <p>{{ sk.note }}</p>
    </div>
    <div class="hm__grid">
      <article v-for="v in CONCEPTS.filter((c) => c.skin === sk.id)" :key="v.id" class="card" :style="{ '--acc': sk.acc }">
        <div class="card__art" :class="`card__art--${v.variant}`" aria-hidden="true">
          <!-- schematic: Spartan checkout page + where the hotel finder appears -->
          <div class="sk">
            <div class="sk__bar" />
            <div class="sk__body">
              <div class="sk__main">
                <div class="sk__h" />
                <div class="sk__card">
                  <div class="sk__row"><i /><b /></div>
                  <div class="sk__row sk__row--on"><i /><b class="on" /></div>
                </div>
                <div v-if="v.variant === 'inline'" class="sk__finder">
                  <div class="sk__hotel" /><div class="sk__hotel" /><div class="sk__hotel sk__hotel--sel" />
                </div>
              </div>
              <div class="sk__aside" />
            </div>
            <div v-if="v.variant === 'modal'" class="sk__scrim">
              <div class="sk__modal">
                <div class="sk__mhead" />
                <div class="sk__mbody">
                  <div class="sk__rail" />
                  <div class="sk__mlist"><div class="sk__hotel" /><div class="sk__hotel sk__hotel--sel" /><div class="sk__hotel" /></div>
                </div>
                <div class="sk__mfoot"><span class="sk__cta" /></div>
              </div>
            </div>
          </div>
        </div>
        <div class="card__body">
          <p class="card__tag">Concept {{ v.tag }} · {{ sk.name }}</p>
          <h2 class="card__name">{{ v.name }}</h2>
          <p class="card__text">{{ v.body }}</p>
          <div class="card__actions">
            <button class="btn btn--primary" @click="start(v)">Start from the event page</button>
            <button class="btn btn--ghost" @click="start(v, true)">Jump to Add-ons</button>
          </div>
          <div class="links">
            <p class="links__h">Deep links · Concept {{ v.tag }}</p>
            <ul>
              <li v-for="[r, label] in LINKS" :key="r">
                <a :href="hrefFor(r, v.variant, v.skin)">
                  <span class="links__label">{{ label }}</span>
                  <code>{{ hrefFor(r, v.variant, v.skin) }}</code>
                </a>
                <button class="links__copy" :aria-label="`Copy link to ${label}`" @click="copy(r, v)">{{ copied === r + v.id ? 'Copied' : 'Copy' }}</button>
              </li>
            </ul>
          </div>
        </div>
      </article>
    </div>

    </section>

    <section class="hm__flow" aria-label="Flow">
      <span>Event page</span><i>›</i><span>Ticket cart</span><i>›</i><span>Sign in</span><i>›</i><span>Details</span><i>›</i>
      <span class="is-new">Add-ons</span><i>›</i><span>Extras</span><i>›</i><span class="is-new">Your Details</span><i>›</i><span>Payment</span>
    </section>

    <section class="hm__next">
      <p class="hm__next-h">All four concepts</p>
      <div class="hm__chips">
        <a v-for="c in CONCEPTS" :key="c.id" :href="hrefFor('event', c.variant, c.skin)">{{ c.tag }} · {{ c.name }} · {{ c.skin === 'presto' ? 'Presto colors' : 'Spartan colors' }}</a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hm {
  min-height: 100vh;
  padding: 64px 80px 80px;
  background: radial-gradient(1200px 600px at 20% -10%, #24242a 0%, #0e0e10 60%);
  color: #fff;
}
.hm__head { max-width: 860px; }
.hm__logos { display: flex; align-items: center; gap: 12px; font-size: 18px; color: rgba(255, 255, 255, 0.6); }
.hm__logos img { width: 40px; height: 40px; }
.hm__logos strong { color: #fff; font-weight: 700; letter-spacing: -0.01em; }
.hm__eyebrow { margin-top: 36px; font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #ff5a5f; }
.hm__title { margin-top: 10px; font-family: var(--font-wide); font-weight: 900; font-stretch: 125%; font-variation-settings: 'wdth' 125; font-size: 40px; line-height: 1.02; text-transform: uppercase; }
.hm__lead { margin-top: 16px; font-size: 17px; line-height: 1.55; color: rgba(255, 255, 255, 0.72); }

.hm__skin { margin-top: 44px; max-width: 1280px; }
.hm__skinhead { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; }
.hm__skinhead h2 { font-size: 20px; font-weight: 700; }
.hm__skinhead p { flex-basis: 100%; margin-top: 2px; padding-left: 26px; font-size: 14px; color: rgba(255, 255, 255, 0.6); }
.hm__swatch { width: 14px; height: 14px; border-radius: 4px; box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.25); transform: translateY(1px); }
.hm__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-top: 16px; }
.card { overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 18px; background: #18181c; }
.card__art { height: 250px; padding: 28px 36px 0; background: linear-gradient(180deg, #232329, #1a1a1f); }
.card__body { padding: 26px 32px 30px; }
.card__tag { font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #ff5a5f; }
.card__name { margin-top: 6px; font-size: 26px; font-weight: 700; }
.card__text { margin-top: 10px; font-size: 15px; line-height: 1.55; color: rgba(255, 255, 255, 0.7); }
.card__actions { display: flex; gap: 12px; margin-top: 22px; }
.btn { height: 46px; padding: 0 20px; border-radius: 999px; font-size: 14px; font-weight: 700; }
.btn--primary { background: var(--red); color: #fff; }
.btn--primary:hover { filter: brightness(1.08); }
.btn--ghost { border: 1px solid rgba(255, 255, 255, 0.28); color: #fff; }
.btn--ghost:hover { background: rgba(255, 255, 255, 0.08); }

/* schematic */
.sk { position: relative; height: 100%; overflow: hidden; border-radius: 10px 10px 0 0; background: #fff; }
.sk__bar { height: 18px; background: #000; }
.sk__body { display: flex; gap: 14px; padding: 14px 16px; }
.sk__main { flex: 1; }
.sk__h { width: 46%; height: 12px; border-radius: 2px; background: #111; }
.sk__card { margin-top: 12px; padding: 8px 10px; border: 1px solid #d7dbe4; border-radius: 6px; }
.sk__row { display: flex; align-items: center; justify-content: space-between; height: 20px; }
.sk__row i { width: 40%; height: 6px; border-radius: 3px; background: #cfd5e1; }
.sk__row b { width: 22px; height: 12px; border-radius: 6px; background: #cfd5e1; }
.sk__row b.on { background: var(--acc); }
.sk__finder { margin-top: 10px; padding: 8px; border: 2px solid var(--acc); border-radius: 6px; display: grid; gap: 6px; }
.sk__hotel { height: 22px; border-radius: 4px; background: #eef1f6; }
.sk__hotel--sel { outline: 2px solid var(--acc); }
.sk__aside { width: 30%; height: 90px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12); }
.sk__scrim { position: absolute; inset: 0; display: grid; place-items: center; background: rgba(0, 0, 0, 0.55); }
.sk__modal { position: relative; top: 8px; width: 74%; height: 176px; display: flex; flex-direction: column; border-radius: 8px; background: #fff; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4); }
.sk__mhead { height: 20px; border-bottom: 1px solid #e3e6ee; }
.sk__mbody { flex: 1; display: flex; gap: 8px; padding: 8px; }
.sk__rail { width: 26%; border-radius: 4px; background: #eef1f6; }
.sk__mlist { flex: 1; display: grid; gap: 6px; align-content: start; }
.sk__mfoot { height: 26px; display: flex; justify-content: flex-end; align-items: center; padding: 0 8px; border-top: 1px solid #e3e6ee; }
.sk__mfoot .sk__cta { width: 70px; height: 14px; margin: 0; }
.sk__phone { width: 108px; height: 200px; padding: 18px 8px 8px; border: 5px solid #0c0c0e; border-radius: 20px; background: #fff; display: grid; gap: 6px; align-content: start; position: relative; top: 26px; }
.sk__cta { height: 18px; margin-top: 30px; border-radius: 4px; background: var(--acc); }

.links { margin-top: 24px; padding-top: 18px; border-top: 1px solid rgba(255, 255, 255, 0.1); }
.links__h { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255, 255, 255, 0.45); }
.links ul { margin-top: 8px; }
.links li { display: flex; align-items: center; gap: 8px; }
.links li + li { border-top: 1px solid rgba(255, 255, 255, 0.06); }
.links a { flex: 1; display: flex; align-items: baseline; justify-content: space-between; gap: 12px; padding: 7px 0; color: #fff; text-decoration: none; }
.links a:hover .links__label { text-decoration: underline; }
.links__label { font-size: 14px; }
.links code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; color: #8fd3a8; }
.links__copy { width: 58px; height: 26px; border-radius: 6px; background: rgba(255, 255, 255, 0.08); color: rgba(255, 255, 255, 0.75); font-size: 12px; }
.links__copy:hover { background: rgba(255, 255, 255, 0.16); }
.hm__flow { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-top: 36px; font-size: 13px; color: rgba(255, 255, 255, 0.6); }
.hm__flow span { padding: 6px 12px; border: 1px solid rgba(255, 255, 255, 0.14); border-radius: 999px; }
.hm__flow span.is-new { border-color: #ff5a5f; color: #fff; }
.hm__flow i { font-style: normal; opacity: 0.5; }
.hm__next { margin-top: 30px; }
.hm__next-h { font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255, 255, 255, 0.45); }
.hm__chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
.hm__chips a { padding: 6px 12px; border-radius: 6px; background: rgba(255, 255, 255, 0.08); color: #fff; font-size: 13px; text-decoration: none; }
.hm__chips a:hover { background: rgba(255, 255, 255, 0.16); }
.hm__chips em { margin-left: 6px; font-style: normal; color: #8fd3a8; font-size: 12px; }
.hm__chips .off { background: transparent; border: 1px dashed rgba(255, 255, 255, 0.2); color: rgba(255, 255, 255, 0.45); }
</style>
