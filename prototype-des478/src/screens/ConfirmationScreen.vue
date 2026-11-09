<script setup>
// Stage 4 — Confirmation. The real ConfirmationPage; mode + data are cart-driven
// (reserve / reservations / hold), keyed on the chosen hotels. The success-banner
// CTA ("Book Another Reservation" / "Hold Another Group Block") is intercepted
// globally (App.vue) → reset the journey back to the Landing screen.
//
// DES-478: the Experience Now partner offer sits in the page's `after-summary`
// slot (after the booking details, before the policies) in all three flows.
// A prototype-only button opens the matching confirmation EMAIL mockup, and a
// prototype-only chip bar switches between the XNow callout looks (?look=…).
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import { journey, cartMode, confirmationMode } from '../store.js'
import { confirmationData, EVENT } from '../fixtures.js'
import PageFrame from '@lib/components/PageFrame.vue'
import ConfirmationPage from '@lib/components/confirmation/ConfirmationPage.vue'
import DsModal from '@lib/components/DsModal.vue'
import ExperienceNowOffer from '@lib/components/des478/ExperienceNowOffer.vue'
import ConfirmationEmail from '@lib/components/des478/ConfirmationEmail.vue'
import { FAMILY_LOOKS, LOOKS } from '@lib/components/des478/des478.js'

const $q = useQuasar()
const data = computed(() => confirmationData(journey.cart, confirmationMode.value))

// `?email=1` opens the email preview on load (deep links / screenshots).
const emailOpen = ref(typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('email') === '1')

// `?look=f-card|f-note|f-split|f-banner|presto|banner|ribbon|dark|sunset|split`
// picks the XNow callout look. Default = the youth-sports-family card
// (Christine, 2026-11-09); the original six looks stay in the switcher.
const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
const ALL = { ...FAMILY_LOOKS, ...LOOKS }
const look = ref(ALL[params.get('look')] ? params.get('look') : 'f-card')
const familyLooks = Object.entries(FAMILY_LOOKS)
const looks = Object.entries(LOOKS)

const onOffer = () => $q.notify({
  message: 'XNow link goes here (placeholder until we get the real URL).',
  color: 'dark', position: 'bottom', timeout: 2500,
})
</script>

<template>
  <page-frame brand="Presto" :cart-mode="cartMode" :show-cart="false">
    <confirmation-page :mode="confirmationMode" :data="data">
      <template #after-summary>
        <experience-now-offer :look="look" :city="EVENT.city" @open="onOffer" />
      </template>
    </confirmation-page>

    <div class="des478-looks" role="group" aria-label="XNow callout look (prototype only)">
      <span class="des478-looks__label">XNow look</span>
      <button
        v-for="[key, l] in familyLooks" :key="key" type="button"
        class="des478-chip" :class="{ 'is-active': look === key }" :aria-pressed="look === key"
        :title="l.note" @click="look = key"
      >{{ l.label }}</button>
      <span class="des478-looks__sep" aria-hidden="true" />
      <span class="des478-looks__label">Earlier</span>
      <button
        v-for="([key, l], i) in looks" :key="key" type="button"
        class="des478-chip" :class="{ 'is-active': look === key }" :aria-pressed="look === key"
        :title="l.note" @click="look = key"
      >{{ i + 1 }} · {{ l.label }}</button>
    </div>

    <button type="button" class="des478-emailbtn" @click="emailOpen = true">
      <q-icon name="mail" size="20px" /> Preview confirmation email
    </button>

    <ds-modal v-model="emailOpen" title="Confirmation email" subtitle="DES-478 mockup · what the guest gets in their inbox" size="lg">
      <confirmation-email
        :mode="confirmationMode" :data="data" :event="EVENT"
        :look="look" :device="$q.screen.lt.sm ? 'mobile' : 'desktop'" @offer="onOffer"
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

/* Prototype-only look switcher: rounded chips, pinned bottom-left. */
.des478-looks {
  position: fixed; left: 24px; bottom: 24px; z-index: 2000; max-width: calc(100vw - 340px);
  display: flex; flex-wrap: wrap; align-items: center; gap: 6px;
  padding: 8px 10px; border-radius: 16px; background: #fff;
  border: 1px solid var(--ds-color-border); box-shadow: 0 10px 24px -12px rgba(1, 16, 63, 0.45);
}
.des478-looks__label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ds-color-text-subtle); padding: 0 4px; }
.des478-looks__sep { width: 1px; height: 22px; background: var(--ds-color-border); margin: 0 4px; }
.des478-chip {
  height: 32px; padding: 0 12px; border-radius: 999px; cursor: pointer;
  border: 1px solid var(--ds-color-border); background: #fff; color: var(--ds-color-text);
  font-family: inherit; font-size: 0.8125rem; font-weight: 600;
}
.des478-chip:hover { background: var(--ds-color-background-brand-subtlest); }
.des478-chip.is-active { background: var(--ds-color-background-brand-bold); border-color: transparent; color: #fff; }
.des478-chip:focus-visible { outline: 3px solid var(--ds-color-border-focused); outline-offset: 2px; }
@media (max-width: 900px) {
  .des478-looks { left: 12px; right: 12px; bottom: 76px; max-width: none; flex-wrap: nowrap; overflow-x: auto; }
  .des478-chip { flex: none; }
}
</style>
