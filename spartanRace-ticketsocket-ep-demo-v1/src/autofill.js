// Prototype Auto-fill — when on (prototype bar toggle), each form step fills
// itself on arrival, and turning it on fills the step you're on. Never
// overwrites what you've typed. Off = every field is left for you.
// (Your Details lives in the Eventpipe iframe and fills itself from the same
//  flag — see src/presto/YourDetails.vue.)
import { watch, nextTick } from 'vue'
import { state, primaryTicket } from './store.js'
import { WAVES } from './data.js'

// Steps that have a form to fill (the prototype bar shows "Fill form" on these).
export const FORM_ROUTES = ['details', 'extras', 'guest', 'payment']

function fill (route, force = false) {
  if (route === 'details') {
    const t = primaryTicket.value
    const w = t ? WAVES[t.day.key] || [] : []
    if ((force || !state.wave) && w.length) state.wave = w[0].id
    state.signature = true
    state.waiverAgreed = true
    if (force || !state.instagram) state.instagram = '@spartanracer'
    window.dispatchEvent(new CustomEvent('ew:sign')) // draw on the signature pad if blank
  } else if (route === 'extras') {
    if (force || state.refundable === null) state.refundable = false
  } else if (route === 'guest') {
    // Your Details is inside the Eventpipe iframe — ask it to fill itself
    document.querySelector('iframe.pf')?.contentWindow?.postMessage({ source: 'spartan', type: 'fill', payload: { force } }, '*')
  } else if (route === 'payment') {
    state.paymentMethod = state.paymentMethod || 'card'
    state.termsAgreed = true
  }
}

/** "Fill form" button: fill every field on the current step, overwriting. */
export function fillNow () { fill(state.route, true) }

watch(
  () => [state.route, state.autofill],
  ([route, on]) => { if (on) nextTick(() => fill(route)) },
  { immediate: true },
)
