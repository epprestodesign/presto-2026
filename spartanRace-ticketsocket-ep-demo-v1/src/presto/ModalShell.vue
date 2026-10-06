<script setup>
// Version B — the hotel finder in the design system's modal (DsModal), two steps:
//   1 · browse  — HotelBrowser (filters / map / results / details)
//   2 · review  — How to pay + Confirm on the left, the hotel order summary
//                 (library CartReview, as in Checkout Expanded) on the right
// 900px on desktop; DsModal goes full-screen ≤640px and the review step stacks
// with the summary first (library mobile checkout order, DES-421). Runs in a
// full-viewport iframe, so breakpoints read the real browser width.
import { ref, computed, watch, nextTick } from 'vue'
import DsModal from '@lib/components/DsModal.vue'
import epLogoWhite from '@lib/assets/eventpipe logos/eventpipe-logo-fff.svg'
import HotelBrowser from './HotelBrowser.vue'
import HotelOrderSummary from './HotelOrderSummary.vue'
import PayChoice from './PayChoice.vue'
import { store, send } from './bridge.js'
import { HOTELS, quote, money } from './hotels.js'

const open = ref(true)
// Opening with a hotel already in the order (Edit reservation / Change hotel) lands on review.
const step = ref(store.hotel ? 'review' : 'browse')
const pick = ref(store.hotel ? { hotelId: store.hotel.hotelId, roomType: store.hotel.roomType, rooms: store.hotel.rooms, stay: store.hotel.stay } : null)
const payOption = ref(store.hotel?.payOption || 'first')

const hotel = computed(() => (pick.value ? HOTELS.find((h) => h.id === pick.value.hotelId) : null))
const opts = computed(() => (pick.value ? { roomType: pick.value.roomType, rooms: pick.value.rooms, stay: pick.value.stay } : null))
const final = computed(() => (hotel.value ? quote(hotel.value, { ...opts.value, payOption: payOption.value }) : null))

function onSelected (q) {
  if (!q) return
  pick.value = { hotelId: q.hotelId, roomType: q.roomType, rooms: q.rooms, stay: q.stay }
  step.value = 'review'
}
// each step starts at the top of the modal body
watch(step, () => nextTick(() => document.querySelector('.dsm__body')?.scrollTo({ top: 0 })))
const confirm = () => { if (final.value) send('confirm', { hotel: final.value }) }
const cancel = () => send('cancel')

const title = computed(() => (step.value === 'review' ? 'Review your stay' : 'Stay for the race'))
const subtitle = computed(() =>
  step.value === 'review' && final.value
    ? `${final.value.name} · ${final.value.stayShort} · ${final.value.nights} ${final.value.nights === 1 ? 'night' : 'nights'} · ${final.value.roomLabel}`
    : `2026 San Antonio Spartan Trifecta Weekend · Hotel for ${store.party} ${store.party === 1 ? 'guest' : 'guests'} · Free cancellation until Nov 13`,
)
</script>

<template>
  <ds-modal v-model="open" size="lg" :title="title" :subtitle="subtitle" @close="cancel">
    <!-- STEP 1 · browse (kept mounted so filters / page survive "Back to hotels") -->
    <div v-show="step === 'browse'">
      <hotel-browser layout="modal" :show-pay="false" :party="store.party" :initial="store.hotel" @selected="onSelected" />
    </div>

    <!-- STEP 2 · review -->
    <div v-if="step === 'review' && final" class="rv">
      <button type="button" class="rv__back" @click="step = 'browse'">
        <q-icon name="chevron_left" size="20px" /> Back to hotels
      </button>
      <div class="rv__main">
        <pay-choice v-model="payOption" class="rv__pay" :hotel="hotel" :opts="opts" stacked />
        <ul class="rv__facts">
          <li><q-icon name="event_available" size="18px" /> Free cancellation until Nov 13, 2026</li>
          <li><q-icon name="receipt_long" size="18px" /> Billed with your race order — one checkout</li>
          <li><q-icon name="verified_user" size="18px" /> Room held for you until checkout is complete</li>
        </ul>
        <q-btn unelevated no-caps color="primary" class="rv__confirm" @click="confirm">
          Confirm &amp; add to order · {{ money(final.dueToday) }}
        </q-btn>
        <p class="rv__fine">
          {{ final.dueAtHotel ? `${money(final.dueAtHotel)} is due at check-in.` : 'Nothing is due at check-in.' }}
          Total stay {{ money(final.total) }} incl. taxes &amp; fees.
        </p>
      </div>
      <aside class="rv__side">
        <hotel-order-summary :quote="final" />
      </aside>
    </div>

    <template #footer>
      <template v-if="step === 'browse'">
        <span class="mf__hint"><q-icon name="touch_app" size="18px" /> Choose <b>Select Rooms</b> on a hotel to review your stay</span>
        <q-btn flat no-caps label="Cancel" class="mf__cancel" @click="cancel" />
      </template>
      <!-- phones only: the summary leads the review step, so keep Confirm pinned -->
      <div v-else-if="final" class="mf__phonebar">
        <span class="mf__due"><b>{{ money(final.dueToday) }}</b> today</span>
        <q-btn unelevated no-caps color="primary" class="mf__confirm" label="Confirm & add to order" @click="confirm" />
      </div>
    </template>
  </ds-modal>

  <!-- Powered by Eventpipe — sits on the backdrop, just under the modal card -->
  <a v-if="open" class="pwr" href="https://www.eventpipe.com" target="_blank" rel="noopener" aria-label="Powered by Eventpipe">
    <span>Powered by</span>
    <img :src="epLogoWhite" alt="Eventpipe" />
  </a>
</template>

<style scoped>
/* review step: pay + confirm left, summary right */
.rv { display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 28px; align-items: start; }
.rv__back { grid-column: 1 / -1; justify-self: start; display: inline-flex; align-items: center; gap: 2px; margin: -6px 0 -8px -6px; padding: 6px; border: 0; background: none; font: inherit; font-weight: 700; color: var(--ds-color-link); cursor: pointer; }
.rv__facts { display: grid; gap: 8px; margin: 18px 0 0; padding: 14px 16px; list-style: none; border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-md); background: var(--ds-color-surface-sunken); font-size: 0.9375rem; color: var(--ds-color-text); }
.rv__facts li { display: flex; align-items: center; gap: 8px; }
.rv__facts .q-icon { color: var(--ds-color-text-brand); }
.rv__confirm { width: 100%; height: 52px; margin-top: 20px; font-size: 1rem; font-weight: 700; }
.rv__fine { margin: 10px 0 0; font-size: 0.8125rem; color: var(--ds-color-text-subtle); text-align: center; }
.rv__side { position: sticky; top: 0; }

.mf__hint { display: inline-flex; align-items: center; gap: 6px; font-size: 0.875rem; color: var(--ds-color-text-subtle); }
.mf__cancel { height: 44px; font-weight: 700; }
.mf__phonebar { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; }
.mf__due { font-size: 0.9375rem; color: var(--ds-color-text-subtle); }
.mf__due b { color: var(--ds-color-text); font-size: 1.0625rem; }
.mf__confirm { height: 46px; padding: 0 16px; font-weight: 700; }

.pwr {
  position: fixed;
  left: 50%;
  bottom: max(10px, calc((100vh - min(860px, 88vh)) / 2 - 38px));
  z-index: 3600;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-decoration: none;
}
.pwr img { height: 20px; width: auto; display: block; }
.pwr:hover { color: #fff; }

/* phones: summary leads, then pay + confirm (library mobile checkout order) */
@media (max-width: 760px) {
  .rv { grid-template-columns: minmax(0, 1fr); gap: 20px; }
  .rv__side { position: static; order: 1; }
  .rv__main { order: 2; }
}
@media (max-width: 640px) {
  .pwr { display: none; }
  .mf__hint { display: none; }
}
</style>
