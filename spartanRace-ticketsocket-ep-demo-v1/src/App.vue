<script setup>
import { computed } from 'vue'
import { state } from './store.js'
import HomeMenu from './views/HomeMenu.vue'
import EventPage from './views/EventPage.vue'
import AddonsPage from './views/AddonsPage.vue'
import LoginPage from './views/LoginPage.vue'
import LocationPage from './views/LocationPage.vue'
import OrderDetails from './views/OrderDetails.vue'
import ExtrasPage from './views/ExtrasPage.vue'
import PaymentPage from './views/PaymentPage.vue'
import ChatBubble from './components/ChatBubble.vue'
import DemoNav from './components/DemoNav.vue'
import PrototypeBar from './components/PrototypeBar.vue'

const VIEWS = {
  home: HomeMenu,
  event: EventPage,
  login: LoginPage,
  location: LocationPage,
  details: OrderDetails,
  addons: AddonsPage,
  hotels: AddonsPage,
  extras: ExtrasPage,
  payment: PaymentPage,
}
const view = computed(() => VIEWS[state.route] || HomeMenu)
</script>

<template>
  <PrototypeBar v-if="state.route !== 'home'" />
  <component :is="view" />
  <ChatBubble v-if="state.route !== 'home'" />
  <DemoNav />
</template>
