<script setup>
import { computed } from 'vue'
import { state } from './store.js'
import EventPage from './views/EventPage.vue'
import LoginPage from './views/LoginPage.vue'
import LocationPage from './views/LocationPage.vue'
import OrderDetails from './views/OrderDetails.vue'
import ExtrasPage from './views/ExtrasPage.vue'
import PaymentPage from './views/PaymentPage.vue'
import ChatBubble from './components/ChatBubble.vue'
import DemoNav from './components/DemoNav.vue'

const VIEWS = {
  event: EventPage,
  login: LoginPage,
  location: LocationPage,
  details: OrderDetails,
  extras: ExtrasPage,
  payment: PaymentPage,
}
const view = computed(() => VIEWS[state.route] || EventPage)
</script>

<template>
  <component :is="view" />
  <ChatBubble />
  <DemoNav />
</template>
