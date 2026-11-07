<script setup>
// Stage 0 — the event landing page. Renders the real LandingPage (its own
// GlobalNav + hero + BookingWidget + event info + footer). The widget's "Search"
// button is intercepted globally (App.vue): it reads the widget's booking-type
// (Book Reservations vs Hold Rooms) and starts that flow. Event name/dates are
// come from the DES-478 Baltimore event (fixtures.js → des478.js).
import { EVENT } from '../fixtures.js'
import LandingPage from '@lib/components/LandingPage.vue'
</script>

<template>
  <landing-page
    mode="reservations"
    brand="Presto"
    :event-name="EVENT.name"
    :event-dates="EVENT.dates"
    :intro="EVENT.intro"
    :show-teams="false"
  />
</template>
