<script setup>
// CartFlyout — a right-side slide-over order summary (Uber Eats-style). Modes:
//   'hold'    → "Hold Rooms for Group or Team": hotels are collapsible parents;
//               each hotel lists its rooms (title + summary + price/night) with
//               indented per-day QuantitySteppers; an aggregated Price details
//               card totals every selection.
//   'reserve' → "Hotel Reservation": carousel, stay dates, highlights, room
//               features, and a Price details card.
// Accents use the DS primary (Zinc 900); the "Time left to book" bar counts down
// live just above the action buttons.
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'
import { loadImagery } from '../lib/imagery'
import QuantityStepper from './QuantityStepper.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  mode: { type: String, default: 'reserve' }, // reserve | hold
  cart: { type: Object, default: () => ({}) },
  currency: { type: String, default: '$' },
})
const emit = defineEmits(['update:modelValue', 'update:count'])
const $q = useQuasar()

const close = () => emit('update:modelValue', false)

// Special requests sub-flyout (opens over the cart).
const requestsOpen = ref(false)
const requestText = ref('')
const saveRequest = () => {
  requestsOpen.value = false
  $q.notify({ message: 'Your message has been saved.', icon: 'check_circle', color: 'grey-9', position: 'bottom', timeout: 2500 })
}
const money = (n) => props.currency + Number(n ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const isReserve = computed(() => props.mode === 'reserve')

// Reveal the "Your Cart" title + header divider once the body scrolls.
const scrolled = ref(false)
const onScroll = (e) => { scrolled.value = e.target.scrollTop > 12 }

// --- Live "time left to book" countdown (mm:ss) ---
const secs = ref(props.cart.heldSeconds ?? 895)
const initialSecs = props.cart.heldSeconds ?? 895
const clock = computed(() => `${Math.floor(secs.value / 60)}:${String(secs.value % 60).padStart(2, '0')}`)
// Progress line depletes as the booking hold counts down.
const progressPct = computed(() => `${initialSecs ? Math.max(0, (secs.value / initialSecs) * 100) : 0}%`)
let timer = null
onMounted(() => { timer = setInterval(() => { if (props.modelValue && secs.value > 0) secs.value-- }, 1000) })
onBeforeUnmount(() => clearInterval(timer))

// --- Imagery (reserve carousel + per-hotel thumbnails) ---
const lib = ref(null)
onMounted(async () => { lib.value = await loadImagery() })
const resolveImages = (cats, seed) => {
  if (!lib.value) return []
  const out = []
  for (const c of cats || []) { const arr = lib.value[c]; if (arr?.length) { const e = arr[(seed || 0) % arr.length]; out.push({ url: e.url, alt: e.alt }) } }
  return out
}
const slides = computed(() => (props.cart.images?.length ? props.cart.images : resolveImages(props.cart.imageCategories || ['suites', 'rooms', 'lobby', 'pool', 'dining'], props.cart.seed)))
const idx = ref(0)
const go = (n) => { const len = slides.value.length || 1; idx.value = (n + len) % len }
const prev = () => go(idx.value - 1)
const next = () => go(idx.value + 1)
const hotelThumb = (h) => resolveImages(h.imageCategories || ['suites', 'rooms'], h.seed)[0]

const hotel = computed(() => props.cart.hotel || {})

// --- Hold: collapsible hotels → rooms → nights (cloned so source is untouched) ---
const hotels = ref((props.cart.hotels || []).map((h) => ({ ...h, rooms: h.rooms.map((r) => ({ ...r, nights: r.nights.map((n) => ({ ...n })) })) })))
const openHotels = ref((props.cart.hotels || []).map(() => true))
const toggleHotel = (hi) => { openHotels.value[hi] = !openHotels.value[hi] }
const removeNight = (hi, ri, ni) => {
  const rooms = hotels.value[hi].rooms
  rooms[ri].nights.splice(ni, 1)
  if (rooms[ri].nights.length === 0) rooms.splice(ri, 1)
  if (rooms.length === 0) { hotels.value.splice(hi, 1); openHotels.value.splice(hi, 1) }
}
const clearCart = () => { hotels.value = []; openHotels.value = [] }
const hotelRooms = (h) => h.rooms.reduce((s, r) => s + r.nights.reduce((a, n) => a + n.qty, 0), 0)
const hotelSubtotal = (h) => h.rooms.reduce((s, r) => s + r.nights.reduce((a, n) => a + n.qty * r.price, 0), 0)
const totalRooms = computed(() => hotels.value.reduce((s, h) => s + hotelRooms(h), 0))

// Aggregated, itemized price details across every group selection.
const roomLines = computed(() => {
  const lines = []
  for (const h of hotels.value) {
    for (const r of h.rooms) {
      const nights = r.nights.reduce((a, n) => a + n.qty, 0)
      if (nights > 0) lines.push({ label: r.type, nights, subtotal: nights * r.price })
    }
  }
  return lines
})
const holdSubtotal = computed(() => roomLines.value.reduce((s, l) => s + l.subtotal, 0))
const holdTaxes = computed(() => holdSubtotal.value * (props.cart.taxRate ?? 0.12))
const holdFee = computed(() => totalRooms.value * (props.cart.feePerNight ?? 0))
const holdTotal = computed(() => holdSubtotal.value + holdTaxes.value + holdFee.value)

// Cart total shown right-justified in the checkout CTA.
const ctaTotal = computed(() => (isReserve.value ? (props.cart.priceDetails?.total ?? 0) : holdTotal.value))

// Keep the nav badge in sync (hold → live count; reserve → single reservation).
watch(totalRooms, (v) => emit('update:count', props.mode === 'hold' ? v : 1), { immediate: true })
</script>

<template>
  <teleport to="body">
    <div v-if="modelValue" class="cf">
      <div class="cf__scrim" @click="close" />
      <aside class="cf__panel" role="dialog" aria-label="Cart">
        <!-- Hold: top bar — close, title (reveals on scroll), kebab menu -->
        <div v-if="!isReserve" class="cf__top" :class="{ 'is-scrolled': scrolled }">
          <button class="cf__top-close" aria-label="Close" @click="close"><q-icon name="close" size="22px" /></button>
          <span class="cf__top-title" :class="{ 'is-visible': scrolled }">Your Cart</span>
          <q-btn flat round dense class="cf__top-kebab" aria-label="More options">
            <q-icon name="more_horiz" size="22px" />
            <q-menu auto-close anchor="bottom right" self="top right">
              <q-list style="min-width: 184px">
                <q-item clickable @click="clearCart">
                  <q-item-section avatar><q-icon name="delete" color="negative" /></q-item-section>
                  <q-item-section class="text-negative">Clear Cart</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
        <!-- Reserve: close overlaid on the hero carousel -->
        <button v-else class="cf__close" aria-label="Close" @click="close"><q-icon name="close" size="22px" /></button>

        <div class="cf__body" @scroll="onScroll">
          <!-- ============ RESERVE ============ -->
          <template v-if="isReserve">
            <div class="cf__carousel">
              <img v-if="slides.length" :src="slides[idx].url" :alt="slides[idx].alt" class="cf__img" />
              <div v-else class="cf__img cf__img--empty"><q-icon name="image" size="36px" /></div>
              <span v-if="slides.length" class="cf__counter">{{ idx + 1 }}/{{ slides.length }}</span>
              <template v-if="slides.length > 1">
                <button class="cf__arrow cf__arrow--prev" aria-label="Previous photo" @click="prev"><q-icon name="chevron_left" size="20px" /></button>
                <button class="cf__arrow cf__arrow--next" aria-label="Next photo" @click="next"><q-icon name="chevron_right" size="20px" /></button>
              </template>
            </div>

            <div class="cf__pad">
              <h3 class="cf__hotel">{{ hotel.name }}</h3>
              <div v-if="hotel.address" class="cf__addr">{{ hotel.address }}</div>

              <div class="cf__stay">
                <div class="cf__stay-col">
                  <span class="cf__stay-label">Check-in</span>
                  <span class="cf__stay-val">{{ cart.checkIn?.date }}</span>
                  <span v-if="cart.checkIn?.time" class="cf__stay-sub">{{ cart.checkIn.time }}</span>
                </div>
                <div class="cf__stay-col">
                  <span class="cf__stay-label">Check-out</span>
                  <span class="cf__stay-val">{{ cart.checkOut?.date }}</span>
                  <span v-if="cart.checkOut?.time" class="cf__stay-sub">{{ cart.checkOut.time }}</span>
                </div>
                <div class="cf__stay-col">
                  <span class="cf__stay-label">Nights</span>
                  <span class="cf__stay-val">{{ cart.nights }}</span>
                </div>
              </div>

              <div v-if="cart.highlights?.length" class="cf__feat">
                <h4 class="cf__feat-h">Property highlights</h4>
                <div class="cf__feat-grid">
                  <span v-for="h in cart.highlights" :key="h.label" class="cf__feat-item"><q-icon :name="h.icon" size="18px" />{{ h.label }}</span>
                </div>
              </div>

              <div v-if="cart.roomType" class="cf__feat">
                <h4 class="cf__feat-h">{{ cart.roomType }}</h4>
                <div class="cf__feat-grid">
                  <span v-if="cart.bedConfig" class="cf__feat-item"><q-icon name="king_bed" size="18px" />{{ cart.bedConfig }}</span>
                  <span v-if="cart.sleeps != null" class="cf__feat-item"><q-icon name="group" size="18px" />Sleeps {{ cart.sleeps }}</span>
                </div>
                <div v-if="cart.amenities?.length" class="cf__feat-grid">
                  <span v-for="a in cart.amenities" :key="a.label" class="cf__feat-item"><q-icon :name="a.icon" size="18px" />{{ a.label }}</span>
                </div>
              </div>

              <button class="cf__reqrow" @click="requestsOpen = true">Any special/accessibility requests? <q-icon name="chevron_right" size="20px" /></button>
            </div>

            <div v-if="cart.priceDetails" class="cf__pricecard">
              <h4 class="cf__price-h">Price details</h4>
              <div class="cf__priceline">
                <div class="cf__priceline-l">
                  <span>{{ cart.priceDetails.nights }} night{{ cart.priceDetails.nights === 1 ? '' : 's' }} x {{ cart.priceDetails.rooms }} room{{ cart.priceDetails.rooms === 1 ? '' : 's' }} x {{ money(cart.priceDetails.rate) }}</span>
                  <span v-if="cart.priceDetails.program" class="cf__price-sub">{{ cart.priceDetails.program }}</span>
                </div>
                <span>{{ money(cart.priceDetails.subtotal) }}</span>
              </div>
              <div v-if="cart.priceDetails.discount" class="cf__discount">{{ cart.priceDetails.discount }}</div>
              <div class="cf__kv"><span>Taxes</span><span>{{ money(cart.priceDetails.taxes) }}</span></div>
              <div v-if="cart.priceDetails.propertyFee != null" class="cf__kv"><span>Property fee</span><span>{{ money(cart.priceDetails.propertyFee) }}</span></div>
              <div class="cf__rule" />
              <div class="cf__kv cf__kv--total"><span>Total</span><span>{{ money(cart.priceDetails.total) }}</span></div>
              <div class="cf__quoted">Rates are quoted in USD ($).</div>
              <div v-if="cart.roomsLeft" class="cf__heldnote cf__heldnote--price"><q-icon name="king_bed" size="15px" /> <span>We have {{ cart.roomsLeft }} room{{ cart.roomsLeft === 1 ? '' : 's' }} left at this price!</span></div>
            </div>
          </template>

          <!-- ============ HOLD ============ -->
          <template v-else>
            <div class="cf__hold">
              <div v-for="(h, hi) in hotels" :key="hi" class="cf__hotelblock">
                <button class="cf__hotelhead" :aria-expanded="openHotels[hi]" @click="toggleHotel(hi)">
                  <img v-if="hotelThumb(h)" :src="hotelThumb(h).url" :alt="hotelThumb(h).alt" class="cf__hthumb" />
                  <div v-else class="cf__hthumb cf__img--empty"><q-icon name="image" size="18px" /></div>
                  <div class="cf__hinfo">
                    <span class="cf__hname">{{ h.name }}</span>
                    <span class="cf__hsummary">{{ hotelRooms(h) }} room{{ hotelRooms(h) === 1 ? '' : 's' }} · {{ money(hotelSubtotal(h)) }}</span>
                  </div>
                  <q-icon :name="openHotels[hi] ? 'expand_less' : 'expand_more'" size="24px" class="cf__hchevron" />
                </button>

                <div v-show="openHotels[hi]" class="cf__hbody">
                  <div v-for="(r, ri) in h.rooms" :key="ri" class="cf__room">
                    <div class="cf__roomhead">
                      <div class="cf__rinfo">
                        <span class="cf__rtitle">{{ r.type }}</span>
                        <span v-if="r.summary" class="cf__rsummary">{{ r.summary }}</span>
                      </div>
                      <span class="cf__rprice">{{ money(r.price) }}<small>/nt</small></span>
                    </div>
                    <div v-for="(n, ni) in r.nights" :key="ni" class="cf__dayrow">
                      <div class="cf__dayinfo">
                        <span class="cf__date">{{ n.date }}</span>
                        <span class="cf__left">{{ n.roomsLeft - n.qty }} left</span>
                      </div>
                      <quantity-stepper v-model="n.qty" :min="1" :max="n.roomsLeft" removable size="sm" @remove="removeNight(hi, ri, ni)" />
                    </div>
                  </div>
                </div>
              </div>

              <button class="cf__addhotel"><q-icon name="add" size="18px" /> Add another hotel</button>

              <div v-if="totalRooms > 0" class="cf__pricecard">
                <h4 class="cf__price-h">Price details</h4>
                <div v-for="(l, i) in roomLines" :key="i" class="cf__kv"><span>{{ l.label }} · {{ l.nights }} night{{ l.nights === 1 ? '' : 's' }}</span><span>{{ money(l.subtotal) }}</span></div>
                <div class="cf__rule" />
                <div class="cf__kv"><span>Taxes</span><span>{{ money(holdTaxes) }}</span></div>
                <div class="cf__kv"><span>Property fee</span><span>{{ money(holdFee) }}</span></div>
                <div class="cf__rule" />
                <div class="cf__kv cf__kv--total"><span>Total</span><span>{{ money(holdTotal) }}</span></div>
                <div class="cf__quoted">Rates are quoted in USD ($).</div>
              </div>
            </div>
          </template>
        </div>

        <!-- ============ FOOTER ============ -->
        <div class="cf__foot">
          <div class="cf__timer">
            <div class="cf__timer-row">
              <span class="cf__timer-label"><q-icon name="timer" size="18px" /> Time left to book</span>
              <span class="cf__timer-clock">{{ clock }}</span>
            </div>
            <div class="cf__timer-track"><div class="cf__timer-fill" :style="{ width: progressPct }" /></div>
          </div>
          <div class="cf__actions">
            <q-btn unelevated no-caps class="cf__cta" :class="{ 'is-disabled': mode === 'hold' && totalRooms === 0 }" :tabindex="(mode === 'hold' && totalRooms === 0) ? -1 : 0">
              <span class="cf__cta-label">Go to checkout</span>
              <span class="cf__cta-total">{{ money(ctaTotal) }}</span>
            </q-btn>
          </div>
        </div>
      </aside>

      <!-- Special requests — sub-flyout over the cart -->
      <aside v-if="requestsOpen" class="cf__sub" role="dialog" aria-label="Special requests">
        <div class="cf__sub-head">
          <button class="cf__sub-close" aria-label="Close" @click="requestsOpen = false"><q-icon name="close" size="22px" /></button>
          <h3 class="cf__sub-title">Special requests (optional)</h3>
        </div>
        <div class="cf__sub-body">
          <p class="cf__sub-desc">We'll send your requests to the property, but they cannot be guaranteed. Please follow up with the property directly to confirm.</p>
          <label class="cf__sub-label" for="cf-req">Message to property</label>
          <textarea id="cf-req" v-model="requestText" class="cf__sub-textarea" maxlength="250" rows="4" placeholder="Special requests" />
          <div class="cf__sub-count">{{ requestText.length }}/250</div>
        </div>
        <div class="cf__sub-foot">
          <q-btn unelevated no-caps class="cf__sub-save" label="Save" @click="saveRequest" />
        </div>
      </aside>
    </div>
  </teleport>
</template>

<style scoped>
.cf { position: fixed; inset: 0; z-index: 3000; }
.cf__scrim { position: absolute; inset: 0; background: rgba(9, 9, 11, 0.5); animation: cf-fade 0.18s ease; }
.cf__panel { position: absolute; top: 0; right: 0; height: 100%; width: 500px; max-width: 92vw; background: var(--ds-color-surface); display: flex; flex-direction: column; box-shadow: var(--ds-shadow-4); animation: cf-slide 0.22s var(--ds-ease-standard); }
@keyframes cf-fade { from { opacity: 0; } }
@keyframes cf-slide { from { transform: translateX(100%); } }

.cf__close { position: absolute; top: 14px; left: 14px; width: 34px; height: 34px; border: 0; border-radius: 50%; background: var(--ds-palette-zinc-100); color: var(--ds-color-text); cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 2; }
.cf__close:hover { background: var(--ds-palette-zinc-200); }

/* Hold top bar — close (circle), centered title on scroll, kebab menu */
.cf__top { display: flex; align-items: center; gap: 12px; padding: 12px 16px; flex: none; background: var(--ds-color-surface); border-bottom: 1px solid transparent; position: relative; z-index: 3; transition: border-color var(--ds-duration-fast) var(--ds-ease-standard), box-shadow var(--ds-duration-fast) var(--ds-ease-standard); }
.cf__top.is-scrolled { border-bottom-color: var(--ds-color-border); box-shadow: var(--ds-shadow-1); }
.cf__top-close { width: 36px; height: 36px; border: 0; border-radius: 50%; background: var(--ds-palette-zinc-100); color: var(--ds-color-text); cursor: pointer; display: flex; align-items: center; justify-content: center; flex: none; }
.cf__top-close:hover { background: var(--ds-palette-zinc-200); }
.cf__top-title { flex: 1; text-align: center; font-weight: 700; font-size: 1.0625rem; color: var(--ds-color-text); opacity: 0; transition: opacity var(--ds-duration-fast) var(--ds-ease-standard); }
.cf__top-title.is-visible { opacity: 1; }
.cf__top-kebab { color: var(--ds-color-text); flex: none; }

.cf__body { flex: 1; overflow-y: auto; }
.cf__pad { padding: 18px 20px 24px; }

/* Reserve carousel */
.cf__carousel { position: relative; }
.cf__img { width: 100%; aspect-ratio: 16 / 10; object-fit: cover; display: block; background: var(--ds-palette-zinc-100); }
.cf__img--empty { display: flex; align-items: center; justify-content: center; color: var(--ds-color-text-disabled); }
.cf__arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 32px; height: 32px; border: 0; border-radius: 50%; background: rgba(0, 0, 0, 0.45); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.cf__arrow:hover { background: rgba(0, 0, 0, 0.65); }
.cf__arrow--prev { left: 10px; }
.cf__arrow--next { right: 10px; }
.cf__counter { position: absolute; bottom: 10px; left: 10px; background: rgba(0, 0, 0, 0.55); color: #fff; font-size: 0.75rem; font-weight: 600; padding: 2px 9px; border-radius: var(--ds-radius-pill); }

/* Reserve hotel heading */
.cf__hotel { font-size: 1.375rem; font-weight: 700; margin: 0; color: var(--ds-color-text); line-height: 1.2; }
.cf__addr { color: var(--ds-color-text-subtle); font-size: 0.9375rem; margin-top: 8px; }

/* Reserve stay panel */
.cf__stay { display: flex; gap: 32px; background: var(--ds-palette-zinc-100); border-radius: var(--ds-radius-md); padding: 24px; margin-top: 14px; }
.cf__stay-col { display: flex; flex-direction: column; gap: 2px; }
.cf__stay-label { font-size: 0.75rem; color: var(--ds-color-text-subtle); }
.cf__stay-val { font-size: 0.875rem; font-weight: 600; color: var(--ds-color-text); line-height: 1.25; white-space: nowrap; }
.cf__stay-sub { font-size: 0.8125rem; color: var(--ds-color-text-subtle); }

/* Reserve highlights / room features */
.cf__feat { margin-top: 18px; }
.cf__feat-h { font-size: 0.9375rem; font-weight: 700; color: var(--ds-color-text); margin: 0 0 10px; }
.cf__feat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 12px; }
.cf__feat-grid + .cf__feat-grid { margin-top: 10px; }
.cf__feat-item { display: inline-flex; align-items: center; gap: 8px; font-size: 0.875rem; color: var(--ds-color-text-subtle); }
.cf__feat-item :deep(.q-icon) { color: var(--ds-color-text); flex: none; }
.cf__reqrow { display: flex; align-items: center; justify-content: space-between; width: 100%; gap: 12px; margin-top: 18px; padding: 14px 0 0; border: 0; border-top: 1px solid var(--ds-color-border); background: none; cursor: pointer; font-size: 0.9375rem; color: var(--ds-color-text); }
.cf__reqrow:hover { color: var(--ds-color-text-info); }

/* Hold: collapsible hotels */
.cf__hold { display: flex; flex-direction: column; }
.cf__hotelblock { border-bottom: 1px solid var(--ds-color-border); }
.cf__hotelhead { display: flex; align-items: center; gap: 12px; width: 100%; padding: 14px 20px; background: none; border: 0; cursor: pointer; text-align: left; }
.cf__hotelhead:hover { background: var(--ds-palette-zinc-50); }
.cf__hthumb { width: 44px; height: 44px; border-radius: var(--ds-radius-sm); object-fit: cover; flex: none; background: var(--ds-palette-zinc-100); }
.cf__hinfo { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.cf__hname { font-weight: 700; font-size: 0.9375rem; color: var(--ds-color-text); }
.cf__hsummary { font-size: 0.8125rem; color: var(--ds-color-text-subtle); }
.cf__hchevron { color: var(--ds-color-text-subtle); flex: none; }
.cf__hbody { padding: 0 20px 10px; }

.cf__room { padding: 12px 0; border-top: 1px solid var(--ds-color-border); }
.cf__room:first-child { border-top: 0; }
.cf__roomhead { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.cf__rinfo { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.cf__rtitle { font-weight: 600; font-size: 0.9375rem; color: var(--ds-color-text); }
.cf__rsummary { font-size: 0.8125rem; color: var(--ds-color-text-subtle); }
.cf__rprice { font-weight: 700; font-size: 0.9375rem; color: var(--ds-color-text); white-space: nowrap; }
.cf__rprice small { font-weight: 500; color: var(--ds-color-text-subtle); font-size: 0.8125rem; }
.cf__dayrow { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 8px 0 0 16px; }
.cf__dayinfo { display: flex; align-items: center; gap: 10px; }
.cf__date { font-size: 0.875rem; color: var(--ds-color-text); }
.cf__left { font-size: 0.75rem; font-weight: 600; color: var(--ds-palette-orange-600); white-space: nowrap; }
.cf__addhotel { display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; margin: 14px 20px 20px; padding: 10px 18px; border: 1px solid var(--ds-color-background-brand-bold); border-radius: var(--ds-radius-pill); background: var(--ds-color-surface); color: var(--ds-color-text); font-weight: 600; font-size: 0.9375rem; cursor: pointer; transition: background var(--ds-duration-fast) var(--ds-ease-standard), color var(--ds-duration-fast) var(--ds-ease-standard); }
.cf__addhotel:hover { background: var(--ds-color-background-brand-bold); color: #fff; }

/* Shared key/value + rule */
.cf__rule { height: 1px; background: var(--ds-color-border); margin: 12px 0; }
.cf__kv { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; padding: 4px 0; font-size: 0.9375rem; }
.cf__kv > span:first-child { color: var(--ds-color-text-subtle); }
.cf__kv > span:last-child { color: var(--ds-color-text); }
.cf__kv--total { font-size: 1.0625rem; }
.cf__kv--total > span { color: var(--ds-color-text) !important; font-weight: 700; }

/* Price details card (shared by reserve + hold) */
.cf__pricecard { margin: 6px 20px 20px; border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-md); padding: 16px; }
.cf__price-h { font-size: 1.0625rem; font-weight: 700; margin: 0 0 12px; color: var(--ds-color-text); }
.cf__priceline { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; }
.cf__priceline-l { display: flex; flex-direction: column; }
.cf__priceline-l > span:first-child { color: var(--ds-color-text); font-size: 0.9375rem; }
.cf__price-sub { color: var(--ds-color-text-subtle); font-size: 0.8125rem; margin-top: 2px; }
.cf__discount { display: inline-block; background: var(--ds-palette-green-600); color: #fff; font-weight: 600; font-size: 0.8125rem; padding: 3px 10px; border-radius: var(--ds-radius-sm); margin-top: 10px; }
.cf__quoted { color: var(--ds-color-text-subtlest); font-size: 0.75rem; margin-top: 12px; }
.cf__heldnote { display: flex; align-items: center; gap: 7px; background: var(--ds-color-background-warning); color: var(--ds-palette-amber-800); border: 1px solid var(--ds-palette-amber-200); border-radius: var(--ds-radius-md); padding: 9px 12px; font-size: 0.8125rem; }
.cf__heldnote--price { margin-top: 12px; }

/* Footer — countdown progress bar (Instacart-style layout) above a rounded CTA */
.cf__foot { flex: none; border-top: 1px solid var(--ds-color-border); padding: 0; display: flex; flex-direction: column; background: var(--ds-color-surface); }
.cf__timer { background: var(--ds-palette-blue-100); }
.cf__timer-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 24px; color: var(--ds-palette-blue-800); }
.cf__timer-label { display: inline-flex; align-items: center; gap: 8px; font-size: 0.9375rem; font-weight: 600; }
.cf__timer-clock { font-weight: 700; font-variant-numeric: tabular-nums; font-size: 1rem; }
.cf__timer-track { height: 4px; background: rgba(37, 99, 235, 0.15); }
.cf__timer-fill { height: 100%; background: var(--ds-palette-blue-600); transition: width 1s linear; }
.cf__actions { padding: 16px 24px; }
.cf__cta { width: 100%; height: 54px; border-radius: var(--ds-radius-pill); background: var(--ds-color-background-brand-bold); color: #fff; font-weight: 700; font-size: 1rem; }
.cf__cta.is-disabled { background: var(--ds-palette-slate-400); pointer-events: none; }
.cf__cta :deep(.q-btn__content) { width: 100%; justify-content: space-between; flex-wrap: nowrap; padding: 0 10px; }

/* Special requests sub-flyout — slides over the cart panel */
.cf__sub { position: absolute; top: 0; right: 0; height: 100%; width: 500px; max-width: 92vw; background: var(--ds-color-surface); display: flex; flex-direction: column; box-shadow: var(--ds-shadow-4); z-index: 10; animation: cf-slide 0.22s var(--ds-ease-standard); }
.cf__sub-head { display: flex; align-items: center; gap: 12px; padding: 18px 20px; flex: none; }
.cf__sub-close { width: 32px; height: 32px; border: 0; background: none; color: var(--ds-color-text); cursor: pointer; display: flex; align-items: center; justify-content: center; flex: none; }
.cf__sub-title { font-size: 1.25rem; font-weight: 700; margin: 0; color: var(--ds-color-text); }
.cf__sub-body { flex: 1; overflow-y: auto; padding: 6px 24px 24px; }
.cf__sub-desc { color: var(--ds-color-text-subtle); font-size: 0.9375rem; line-height: 1.5; margin: 0 0 22px; }
.cf__sub-label { display: block; font-weight: 700; font-size: 0.9375rem; color: var(--ds-color-text); margin-bottom: 8px; }
.cf__sub-textarea { width: 100%; min-height: 110px; resize: vertical; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md); padding: 12px 14px; font-family: inherit; font-size: 0.9375rem; color: var(--ds-color-text); outline: none; transition: border-color var(--ds-duration-fast) var(--ds-ease-standard); }
.cf__sub-textarea:focus { border-color: var(--ds-color-border-focused); }
.cf__sub-textarea::placeholder { color: var(--ds-color-text-subtlest); }
.cf__sub-count { text-align: right; color: var(--ds-color-text-subtle); font-size: 0.8125rem; margin-top: 6px; }
.cf__sub-foot { flex: none; padding: 16px 24px 24px; }
.cf__sub-save { width: 100%; height: 52px; border-radius: var(--ds-radius-pill); background: var(--ds-color-background-brand-bold); color: #fff; font-weight: 700; font-size: 1rem; }

@media (max-width: 520px) { .cf__panel, .cf__sub { width: 100vw; } }
</style>
