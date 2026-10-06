<script setup>
// "Make a weekend of it" — the add-ons card from the Eventpipe checkout sketch,
// rebuilt with Presto primitives (Quasar q-toggle + DS tokens, PT Sans).
//   inline  → the Hotel toggle expands the HotelBrowser right below (variant A)
//   modal   → the Hotel toggle asks the host to open the hotel modal (variant B)
import { ref, computed } from 'vue'
import HotelOrderSummary from './HotelOrderSummary.vue'
import { store, send, pushState, VARIANT } from './bridge.js'
import { ADDONS, FROM_NIGHTLY, money } from './hotels.js'


const hotelOn = computed({
  get: () => store.hotelOn,
  set: (v) => {
    store.hotelOn = v
    if (!v) store.hotel = null
    pushState()
    if (v && VARIANT === 'modal') send('open-overlay')
  },
})
const setAddon = (id, v) => { store[id] = v; pushState() }
const priceOf = (a) => (a.perRacer ? a.price * store.party : a.price)
const reopen = () => send('open-overlay')
const showSummary = ref(true)

// Reservation actions (library pattern: CheckoutPage "Edit reservation" / "Start over")
function editReservation () {
  if (VARIANT === 'modal') send('open-overlay')
  else window.dispatchEvent(new CustomEvent('ew:edit-hotel'))
}
function startOver () {
  store.hotel = null
  // A: keep the finder open, cleared, to pick again · B: remove the hotel entirely
  if (VARIANT === 'modal') store.hotelOn = false
  pushState()
  window.dispatchEvent(new CustomEvent('ew:reset-hotel'))
}
</script>

<template>
  <section class="wk">
    <header class="wk__head">
      <h2 class="wk__title">Make a weekend of it</h2>
      <p class="wk__sub">{{ VARIANT === 'separate' ? 'Add what you need for race day.' : 'Add what you need now. Everything stays in one order.' }}</p>
    </header>

    <div v-for="a in ADDONS" :key="a.id" class="wk__row">
      <div class="wk__info">
        <p class="wk__name">{{ a.name }}</p>
        <p class="wk__detail">{{ a.detail }}<template v-if="a.perRacer && store.party > 1"> · {{ store.party }} racers</template></p>
      </div>
      <span class="wk__price">{{ money(priceOf(a)) }}</span>
      <q-toggle :model-value="store[a.id]" color="primary" size="lg" :aria-label="`Add ${a.name}`" @update:model-value="setAddon(a.id, $event)" />
    </div>

    <!-- E/F: no hotel in the checkout — it's booked on its own page after the tickets -->
    <p v-if="VARIANT === 'separate'" class="wk__later">
      <q-icon name="hotel" size="18px" /> Need a place to stay? You can book a hotel for race weekend right after checkout.
    </p>
    <div v-else class="wk__row wk__row--last">
      <div class="wk__info">
        <p class="wk__name">Hotel room</p>
        <p v-if="!store.hotel" class="wk__detail">Held for you, billed in this order</p>
        <p v-else class="wk__detail wk__detail--picked">
          <q-icon name="check_circle" size="16px" class="wk__ok" />
          {{ store.hotel.name }} · {{ store.hotel.stayShort }} · {{ store.hotel.roomLabel }}
        </p>
      </div>
      <span class="wk__price">
        <template v-if="store.hotel">{{ money(store.hotel.dueToday) }} <small>today</small></template>
        <template v-else>from {{ money(FROM_NIGHTLY).replace('.00', '') }}/night</template>
      </span>
      <q-toggle v-model="hotelOn" color="primary" size="lg" aria-label="Add a hotel room" />
    </div>

    <div v-if="store.hotel" class="wk__sum">
      <button type="button" class="wk__sum-toggle" :aria-expanded="showSummary" @click="showSummary = !showSummary">
        <span>Hotel order summary</span>
        <q-icon :name="showSummary ? 'expand_less' : 'expand_more'" size="22px" />
      </button>
      <div class="wk__actions">
        <button type="button" class="wk__railbtn" @click="editReservation"><q-icon name="edit" size="18px" /> Edit reservation</button>
        <button type="button" class="wk__railbtn wk__railbtn--ghost" @click="startOver"><q-icon name="restart_alt" size="18px" /> Start over</button>
      </div>
      <hotel-order-summary v-if="showSummary" :quote="store.hotel" class="wk__sum-body" />
    </div>

    <div v-if="VARIANT === 'modal' && store.hotelOn" class="wk__overlay-note">
      <template v-if="store.hotel">
        <span>{{ store.hotel.nights }} {{ store.hotel.nights === 1 ? 'night' : 'nights' }} · {{ store.hotel.payOption === 'full' ? 'Paid in full' : `${money(store.hotel.dueAtHotel)} due at the hotel` }}</span>
        <q-btn flat dense no-caps color="primary" label="Change hotel" icon-right="chevron_right" @click="reopen" />
      </template>
      <template v-else>
        <span>Finish choosing a hotel in the hotel finder.</span>
        <q-btn flat dense no-caps color="primary" label="Open hotel finder" icon-right="open_in_new" @click="reopen" />
      </template>
    </div>
  </section>
</template>

<style scoped>
.wk {
  border: 1px solid var(--ds-color-border);
  border-radius: var(--ds-radius-lg);
  background: var(--ds-color-surface);
  box-shadow: var(--ds-shadow-1);
  padding: 24px 24px 8px;
  overflow: hidden;
}
.wk__title { margin: 0; font-size: 1.5rem; font-weight: 700; line-height: 1.25; color: var(--ds-color-text-brand); }
.wk__sub { margin: 4px 0 0; font-size: 1rem; color: var(--ds-color-text-subtle); }
.wk__row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 0;
  border-bottom: 1px solid var(--ds-color-border);
}
.wk__row:first-of-type { margin-top: 12px; }
.wk__row--last { border-bottom: 0; }
.wk__info { flex: 1; min-width: 0; }
.wk__name { margin: 0; font-size: 1.0625rem; font-weight: 700; color: var(--ds-color-text); }
.wk__detail { margin: 2px 0 0; font-size: 0.9375rem; color: var(--ds-color-text-subtle); }
.wk__detail--picked { display: flex; align-items: center; gap: 6px; color: var(--ds-color-text); font-weight: 700; }
.wk__ok { color: var(--ds-color-text-success); }
.wk__price { font-size: 1.0625rem; font-weight: 700; color: var(--ds-color-text-brand); white-space: nowrap; }
.wk__price small { font-size: 0.8125rem; font-weight: 400; color: var(--ds-color-text-subtle); }
.wk__sum { margin: 0 -24px; padding: 4px 24px 18px; border-top: 1px solid var(--ds-color-border); background: var(--ds-color-surface-sunken); }
.wk__sum:last-child { margin-bottom: -8px; border-radius: 0 0 var(--ds-radius-lg) var(--ds-radius-lg); }
.wk__sum-toggle { display: flex; align-items: center; justify-content: space-between; width: 100%; min-height: 48px; padding: 0; border: 0; background: none; font: inherit; font-size: 1rem; font-weight: 700; color: var(--ds-color-text-brand); cursor: pointer; }
.wk__sum-body { margin-top: 14px; }
/* same treatment as the library's .ck__railbtn (CheckoutPage reservation actions) */
.wk__actions { display: flex; gap: 10px; }
.wk__railbtn { flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 46px; border: 1px solid var(--ds-color-border-brand); border-radius: var(--ds-radius-md); background: var(--ds-color-surface); color: var(--ds-color-text-brand); font-family: inherit; font-weight: 700; font-size: 0.9375rem; cursor: pointer; transition: background var(--ds-duration-fast) var(--ds-ease-standard); }
.wk__railbtn:hover { background: var(--ds-palette-navy-50); }
.wk__railbtn--ghost { border-color: var(--ds-color-border-bold); color: var(--ds-color-text); }
.wk__railbtn--ghost:hover { background: var(--ds-palette-slate-100); }
.wk__later { display: flex; align-items: center; gap: 8px; margin: 0 -24px -8px; padding: 14px 24px; border-top: 1px solid var(--ds-color-border); background: var(--ds-color-surface-sunken); border-radius: 0 0 var(--ds-radius-lg) var(--ds-radius-lg); font-size: 0.9375rem; color: var(--ds-color-text-subtle); }
.wk__later .q-icon { color: var(--ds-color-text-brand); }
.wk__overlay-note {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 0 -24px -8px;
  padding: 10px 16px 10px 24px;
  border-top: 1px solid var(--ds-color-border);
  background: var(--ds-color-background-brand-subtlest);
  border-radius: 0 0 var(--ds-radius-lg) var(--ds-radius-lg);
  font-size: 0.9375rem;
  color: var(--ds-color-text);
}
</style>
