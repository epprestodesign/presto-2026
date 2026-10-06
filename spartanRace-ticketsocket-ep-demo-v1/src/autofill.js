// Prototype Auto-fill — when on (prototype bar toggle), each form step fills
// itself on arrival, and turning it on fills the step you're on. Never
// overwrites what you've typed. Off = every field is left for you.
// (Your Details lives in the Eventpipe iframe and fills itself from the same
//  flag — see src/presto/YourDetails.vue.)
import { watch, nextTick } from 'vue'
import { state, primaryTicket } from './store.js'
import { WAVES } from './data.js'

function fill (route) {
  if (route === 'details') {
    const t = primaryTicket.value
    const w = t ? WAVES[t.day.key] || [] : []
    if (!state.wave && w.length) state.wave = w[0].id
    state.signature = true
    state.waiverAgreed = true
    if (!state.instagram) state.instagram = '@spartanracer'
  } else if (route === 'extras') {
    if (state.refundable === null) state.refundable = false
  } else if (route === 'payment') {
    state.paymentMethod = state.paymentMethod || 'card'
    state.termsAgreed = true
  }
}

watch(
  () => [state.route, state.autofill],
  ([route, on]) => { if (on) nextTick(() => fill(route)) },
  { immediate: true },
)
