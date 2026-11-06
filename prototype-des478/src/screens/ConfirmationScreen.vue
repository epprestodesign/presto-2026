<script setup>
// Stage 4 — Confirmation. The real ConfirmationPage; mode + data are cart-driven
// (reserve / reservations / hold), keyed on the chosen hotels. The success-banner
// CTA ("Book Another Reservation" / "Hold Another Group Block") is intercepted
// globally (App.vue) → reset the journey back to the Landing screen.
//
// DES-478: the Experience Now partner offer sits in the page's `after-summary`
// slot (after the booking details, before the policies) in all three flows.
// A prototype-only button opens the matching confirmation EMAIL mockup.
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import { journey, cartMode, confirmationMode } from '../store.js'
import { confirmationData, EVENT } from '../fixtures.js'
import PageFrame from '@lib/components/PageFrame.vue'
import ConfirmationPage from '@lib/components/confirmation/ConfirmationPage.vue'
import DsModal from '@lib/components/DsModal.vue'
import ExperienceNowOffer from '@lib/components/des478/ExperienceNowOffer.vue'
import ConfirmationEmail from '@lib/components/des478/ConfirmationEmail.vue'

const $q = useQuasar()
const data = computed(() => confirmationData(journey.cart, confirmationMode.value))

// `?email=1` opens the email preview on load (deep links / screenshots).
const emailOpen = ref(typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('email') === '1')

const onOffer = () => $q.notify({
  message: 'Experience Now link goes here (placeholder until we get the real URL).',
  color: 'dark', position: 'bottom', timeout: 2500,
})
</script>

<template>
  <page-frame brand="Presto" :cart-mode="cartMode" :show-cart="false">
    <confirmation-page :mode="confirmationMode" :data="data">
      <template #after-summary>
        <experience-now-offer :city="EVENT.city" @open="onOffer" />
      </template>
    </confirmation-page>

    <button type="button" class="des478-emailbtn" @click="emailOpen = true">
      <q-icon name="mail" size="20px" /> Preview confirmation email
    </button>

    <ds-modal v-model="emailOpen" title="Confirmation email" subtitle="DES-478 mockup · what the guest gets in their inbox" size="lg">
      <confirmation-email
        :mode="confirmationMode" :data="data" :event="EVENT"
        :device="$q.screen.lt.sm ? 'mobile' : 'desktop'" @offer="onOffer"
      />
    </ds-modal>
  </page-frame>
</template>

<style scoped>
/* Prototype-only control (not part of the product UI). */
.des478-emailbtn {
  position: fixed; right: 24px; bottom: 24px; z-index: 2000;
  display: inline-flex; align-items: center; gap: 8px;
  height: 48px; padding: 0 20px; border: 0; border-radius: 999px;
  background: var(--ds-color-background-brand-bold); color: #fff;
  font-family: inherit; font-weight: 700; font-size: 0.9375rem; cursor: pointer;
  box-shadow: 0 10px 24px -10px rgba(1, 16, 63, 0.6);
}
.des478-emailbtn:hover { background: var(--ds-palette-navy-800); }
.des478-emailbtn:focus-visible { outline: 3px solid var(--ds-color-border-focused); outline-offset: 3px; }
@media (max-width: 600px) { .des478-emailbtn { right: 16px; bottom: 16px; } }
</style>
