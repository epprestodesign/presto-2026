<script setup>
// Stage 4 — Confirmation. The real ConfirmationPage; mode + data are cart-driven
// (reserve / reservations / hold), keyed on the chosen hotels. The success-banner
// CTA ("Book Another Reservation" / "Hold Another Group Block") is intercepted
// globally (App.vue) → reset the journey back to the Landing screen.
import { computed } from 'vue'
import { journey, cartMode, confirmationMode } from '../store.js'
import { confirmationData } from '../fixtures.js'
import PageFrame from '@lib/components/PageFrame.vue'
import TeamConfirmationPage from '@lib/components/teamname/TeamConfirmationPage.vue'

const data = computed(() => confirmationData(journey.cart, confirmationMode.value))
// Team Name Qualifiers — Team section on the confirmation (demo/derived).
const teamSummary = computed(() => journey.team || (confirmationMode.value === 'hold'
  ? { teamFlow: 'group', teams: ['Team 1', 'Team 2', 'Arsenal U12 Boys Select'], roomsAdded: 6 }
  : { teamFlow: 'reserve', team: { name: 'Arsenal U12 Boys Select', ageDivision: 'U12', gender: 'Boys' } }))
</script>

<template>
  <page-frame brand="Presto" :cart-mode="cartMode" :show-cart="false">
    <team-confirmation-page :mode="confirmationMode" :data="data" v-bind="teamSummary" />
  </page-frame>
</template>
