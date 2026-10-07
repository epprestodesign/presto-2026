<script setup>
// Stage 3 — Checkout ("Confirm and pay"). The real CheckoutPage in the minimal
// "Secure Checkout" nav. Mode is cart-driven: 1 reserved hotel → 'reservation'
// (single); 2+ → 'reservations' (multiple); group flow → 'group' (hold, no
// payment). The final CTA ("Book Now"/"Hold Group Block Now") is intercepted
// globally (App.vue) → Confirmation.
import { computed } from 'vue'
import { journey, holdTimer, cartMode, checkoutMode, setTeam } from '../store.js'
import { cartFor, summaryFor } from '../fixtures.js'
import PageFrame from '@lib/components/PageFrame.vue'
// Expanded checkout: every step open at once with one submit (instead of the
// stepped accordion). Same props; the timer strip + pill are built in.
import TeamCheckoutPage from '@lib/components/teamname/TeamCheckoutPage.vue'

// DES-84: for a group block, the rail's "Time left to book" continues the same
// hold that started when the first room was added — seed it from the shared
// timer so it doesn't reset to a fresh countdown on arrival.
const cart = computed(() => {
  const c = cartFor(journey.cart, checkoutMode.value)
  if (checkoutMode.value === 'group' && holdTimer.active) c.heldSeconds = holdTimer.remaining
  return c
})
const summary = computed(() => summaryFor(journey.cart, checkoutMode.value))
// Team Name Qualifiers — the event's required team fields for the reservation flow.
const qualifiers = [
  { key: 'guestType', label: 'Guest type', type: 'select', options: ['Athlete', 'Coach', 'Parent / Guardian', 'Team Staff', 'Other'], required: true },
]
</script>

<template>
  <!-- DES-81/DES-82: full site header (EventPipe logo + Contact Us + Manage
       Booking), same as the rest of the booking site — not the minimal nav. -->
  <page-frame brand="Presto" :cart-mode="cartMode">
    <!-- proto-ck--group scopes group-only checkout tweaks (DES-79) without
         touching the individual flow. -->
    <div class="proto-ck" :class="{ 'proto-ck--group': checkoutMode === 'group' }">
      <team-checkout-page :mode="checkoutMode" :cart="cart" :summary="summary" :show-teams="true" :team-name="true" :custom-fields="qualifiers" @update:team="setTeam" />
    </div>
  </page-frame>
</template>
