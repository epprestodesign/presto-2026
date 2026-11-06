<script setup>
// ExperienceNowOffer (DES-478) — a text-only partner offer for the booking
// confirmation page and email. No partner logo until we have Experience Now
// brand guidelines: just a small label, the message and a link.
//
// It sits AFTER the reservation summary, so the guest sees their booking
// first. The tinted card stands out from the white summary cards, but the copy
// is smaller and lighter than the summary, so it reads as an add-on.
import { computed } from 'vue'
import { COPY, EVENT, PARTNER } from './des478.js'

const props = defineProps({
  city: { type: String, default: EVENT.city },
  // 'ticket' | 'short' | 'shortest' — see COPY in des478.js
  copy: { type: String, default: 'ticket' },
  href: { type: String, default: PARTNER.href },
  // 'page' = confirmation-page card · 'email' = block inside the email body
  variant: { type: String, default: 'page' },
})
const emit = defineEmits(['open'])

const text = computed(() => COPY[props.copy] || COPY.ticket)
const onClick = (e) => {
  // Placeholder link: stay on the page and let the host react (toast, etc.).
  if (props.href.startsWith('#')) e.preventDefault()
  emit('open', props.href)
}
</script>

<template>
  <aside class="xn" :class="`xn--${variant}`" aria-label="Partner offer from Experience Now">
    <p class="xn__label">Partner offer</p>
    <p class="xn__message">{{ text.message(city) }}</p>
    <a class="xn__link" :href="href" @click="onClick">{{ text.link }}</a>
  </aside>
</template>

<style scoped>
.xn {
  font-family: inherit;
  background: var(--ds-color-background-brand-subtlest);
  border: 1px solid var(--ds-color-border);
  border-left: 4px solid var(--ds-color-border-brand);
  border-radius: var(--ds-radius-lg);
  padding: 18px 24px;
  margin-bottom: 20px;
}
.xn__label {
  margin: 0 0 4px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ds-color-text-subtle);
}
.xn__message { margin: 0; font-size: 1rem; line-height: 1.5; color: var(--ds-color-text); }
.xn__link {
  display: inline-block;
  margin-top: 8px;
  font-weight: 700;
  font-size: 0.9375rem;
  color: var(--ds-color-link);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.xn__link:hover { text-decoration-thickness: 2px; }
.xn__link:focus-visible { outline: 2px solid var(--ds-color-border-focused); outline-offset: 2px; border-radius: 2px; }

/* Email: same idea, flatter (emails can't rely on rounded borders everywhere). */
.xn--email { border-radius: 6px; margin: 0; padding: 16px 20px; }

@media (max-width: 600px) {
  .xn { padding: 16px 18px; }
}
</style>
