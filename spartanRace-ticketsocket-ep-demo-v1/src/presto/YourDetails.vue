<script setup>
// "Your Details" — steps 1–4 of the library's Checkout Experience Expanded
// (Book Reservation): contact · payment method · review your reservation ·
// policies. No right-hand order rail (the Spartan checkout keeps its own total
// card) and no "Book Now": the host's Continue moves on to Payment.
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import StepContactInfo from '@lib/components/checkout/steps/StepContactInfo.vue'
import StepPayment from '@lib/components/checkout/steps/StepPayment.vue'
import StepReviewReservation from '@lib/components/checkout/steps/StepReviewReservation.vue'
import PoliciesAgreement from '@lib/components/checkout/PoliciesAgreement.vue'
import { store } from './bridge.js'

const contact = ref({})
const payment = ref({})

const rooms = computed(() => {
  const n = store.hotel?.rooms || 1
  return Array.from({ length: n }, () => ({ adults: Math.max(1, Math.ceil(store.party / n)), children: 0 }))
})
const hotels = computed(() => (store.hotel ? [{ name: store.hotel.name }] : [{}]))
const paymentLabel = computed(() => {
  const d = (payment.value.cardNumber || '').replace(/\D/g, '')
  return d.length >= 4 ? `Card ending ${d.slice(-4)}` : 'Card details'
})

// ── Prototype Auto-fill ──
// The library forms seed their state from props only once, so fill the DOM the
// way a person would (value + input/change events), skipping anything typed.
const root = ref(null)
const TEXT = {
  'First name': 'Alex',
  'Last name': 'Smith',
  '(617) 470-7879': '(210) 555-0142',
  'you@example.com': 'alex.smith@example.com',
  'Address Line 1': '123 Alamo Plaza',
  City: 'San Antonio',
  'Postal Code': '78205',
  'Cardholder Name': 'Alex Smith',
  'Card Number': '4242 4242 4242 4242',
  'Security Code': '123',
}
const PREFERRED_OPTIONS = ['Texas', 'TX', '12', '2028']
function setValue (el, v) {
  const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
  Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v)
  el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }))
}
async function fill (force = false) {
  const el = root.value
  if (!el) return
  el.querySelectorAll('input[placeholder]').forEach((i) => {
    const v = TEXT[i.getAttribute('placeholder')]
    if (v && (force || !i.value)) setValue(i, v)
  })
  await nextTick()
  el.querySelectorAll('select').forEach((s) => {
    // required pickers (state / month / year) start on a disabled placeholder option;
    // Country has none and is left alone
    const isPicker = s.options[0]?.disabled
    if (s.value && !(force && isPicker)) return
    const opts = [...s.options].filter((o) => !o.disabled && o.value)
    const pick = PREFERRED_OPTIONS.map((p) => opts.find((o) => o.value === p || o.text === p)).find(Boolean) || opts[0]
    if (pick) setValue(s, pick.value)
  })
  if (!el.querySelector('.bp__opt.is-sel')) el.querySelector('.bp__opt--no')?.click()
  el.querySelectorAll('.pol__check').forEach((c) => { if (!c.checked) c.click() })
}
onMounted(() => { if (store.autofill) setTimeout(fill, 150) })
watch(() => store.autofill, (on) => { if (on) fill() })
// prototype "Fill form" button (relayed by bridge.js)
const onFillEvent = (e) => fill(!!e.detail?.force)
onMounted(() => window.addEventListener('ew:fill', onFillEvent))

const steps = [
  { key: 'contact', label: 'Enter contact information' },
  { key: 'payment', label: 'Add a payment method' },
  { key: 'protect', label: 'Review your reservation' },
  { key: 'policies', label: 'Policies' },
]
</script>

<template>
  <div ref="root" class="yd">
    <section v-for="(s, i) in steps" :key="s.key" class="yd__step">
      <header class="yd__head">
        <span class="yd__num">{{ i + 1 }}</span>
        <span class="yd__title">{{ s.label }}</span>
      </header>
      <div class="yd__body">
        <step-contact-info v-if="s.key === 'contact'" v-model="contact" mode="reservation" :rooms="rooms" :show-teams="false" flat />
        <step-payment v-else-if="s.key === 'payment'" v-model="payment" flat />
        <step-review-reservation
          v-else-if="s.key === 'protect'"
          contact-summary="Contact details"
          :payment-label="paymentLabel"
          :total="store.total || 0"
          flow="reserve"
          :hotels="hotels"
          flat
          hide-policies
        />
        <policies-agreement v-else flow="reserve" :hotels="hotels" hide-cta />
      </div>
    </section>
  </div>
</template>

<style scoped>
/* same step chrome as CheckoutPageExpanded (.ck__step …) */
.yd__step { background: var(--ds-color-surface); border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-lg); padding: 18px 20px; margin-bottom: 16px; }
.yd__step:last-child { margin-bottom: 0; }
.yd__head { display: flex; align-items: center; gap: 12px; }
.yd__num { width: 26px; height: 26px; border-radius: 50%; background: var(--ds-color-background-brand-bold); color: #fff; font-weight: 700; font-size: 0.875rem; display: flex; align-items: center; justify-content: center; flex: none; }
.yd__title { flex: 1; font-weight: 700; color: var(--ds-color-text); }
.yd__body { margin-top: 18px; }
@media (max-width: 600px) { .yd__step { padding: 16px; } }
</style>
