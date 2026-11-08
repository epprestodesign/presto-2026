<script setup>
// ExperienceNowOffer (DES-478) — the XNow (Experience Now) partner offer for
// the booking confirmation page and email.
//
// It sits AFTER the reservation summary, so the guest sees their booking first.
//
// `look` picks how far it leans into XNow's brand (see LOOKS in des478.js):
//   presto  — Presto card + XNow logo (the quiet default)
//   banner  — red→orange pill banner (XNow's "Verify now" bar)
//   ribbon  — white card, pink gradient edge, "ExperienceNow!" headline
//   dark    — #141414 XNow tile with "Member Exclusive" tag + orange button
//   sunset  — XNow's sign-up gradient with a big headline
//   split   — sunset panel + who-can-verify list
// ALT_LOOKS (v-banner, v-card, v-split) reuse one of those layouts (`base`)
// and add verified-groups extras: perks chips, how-it-works steps, fine print.
// Logo is XNow's current mark from xnow.com. Poppins (XNow's font) is loaded
// from Google Fonts for the branded looks only.
import { computed } from 'vue'
import { ALT_LOOKS, COPY, EVENT, FINE_PRINT, GROUPS, LOOKS, PARTNER, PERKS, STEPS } from './des478.js'
import xnowLogo from '../../assets/partners/xnow-logo.svg'

// Load Poppins once (mockup only — the real build would self-host it).
if (typeof document !== 'undefined' && !document.getElementById('xn-poppins')) {
  const l = document.createElement('link')
  l.id = 'xn-poppins'
  l.rel = 'stylesheet'
  l.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap'
  document.head.appendChild(l)
}

const props = defineProps({
  city: { type: String, default: EVENT.city },
  // 'presto' | 'banner' | 'ribbon' | 'dark' | 'sunset' | 'split'
  // or an alt: 'v-banner' | 'v-card' | 'v-split'
  look: { type: String, default: 'presto' },
  // 'ticket' | 'short' | 'shortest' | 'verified' | 'verifiedShort' — see COPY.
  // Empty = the look's default.
  copy: { type: String, default: '' },
  href: { type: String, default: PARTNER.href },
  // 'page' = confirmation-page card · 'email' = block inside the email body
  variant: { type: String, default: 'page' },
  // Accessible name override — only needed when several offers share a page
  // (comparison galleries), so each landmark stays unique.
  label: { type: String, default: '' },
})
const emit = defineEmits(['open'])

const ALL = { ...LOOKS, ...ALT_LOOKS }
const lookKey = computed(() => (ALL[props.look] ? props.look : 'presto'))
const lk = computed(() => ALL[lookKey.value])
const base = computed(() => lk.value.base || lookKey.value) // which layout to draw
const text = computed(() => COPY[props.copy || lk.value.copy] || COPY.ticket)
const headline = computed(() => lk.value.headline?.(props.city) || '')
// An explicitly picked copy with its own button text (verified copy) wins.
const cta = computed(() => (props.copy && text.value.cta) || lk.value.cta || text.value.link)
const onClick = (e) => {
  // Placeholder link: stay on the page and let the host react (toast, etc.).
  if (props.href.startsWith('#')) e.preventDefault()
  emit('open', props.href)
}
</script>

<template>
  <aside
    class="xn" :class="[`xn--${variant}`, `xn--${base}`, { 'xn--alt': lk.base }]"
    :aria-label="label || `Partner offer from ${PARTNER.name}`"
  >
    <!-- 1 · Logo only (Presto card) -->
    <template v-if="base === 'presto'">
      <div class="xn__head">
        <img :src="xnowLogo" :alt="PARTNER.name" class="xn__logo" width="60" height="22" />
        <p class="xn__label">Partner offer</p>
      </div>
      <p class="xn__message">{{ text.message(city) }}</p>
      <a class="xn__link" :href="href" @click="onClick">{{ text.link }}</a>
    </template>

    <!-- 2 · Verify banner -->
    <template v-else-if="base === 'banner'">
      <span class="xn__badge" aria-hidden="true"><q-icon name="auto_awesome" size="18px" /></span>
      <p class="xn__message">{{ text.message(city) }}</p>
      <a class="xn__pill xn__pill--white" :href="href" @click="onClick">{{ cta }}</a>
    </template>

    <!-- 3 · Gradient accent -->
    <template v-else-if="base === 'ribbon'">
      <div class="xn__head">
        <img :src="xnowLogo" :alt="PARTNER.name" class="xn__logo" width="60" height="22" />
        <p class="xn__label">Partner offer</p>
      </div>
      <!-- headline is static copy from des478.js (has an <em> for "Now!") -->
      <p class="xn__title" v-html="headline" />
      <p class="xn__message">{{ text.message(city) }}</p>
      <a class="xn__pill xn__pill--outline" :href="href" @click="onClick">{{ cta }}</a>
    </template>

    <!-- 4 · Dark card -->
    <template v-else-if="base === 'dark'">
      <div class="xn__head">
        <img :src="xnowLogo" :alt="PARTNER.name" class="xn__logo xn__logo--lg" width="76" height="28" />
        <span class="xn__tag">Member exclusive</span>
      </div>
      <p class="xn__title">{{ headline }}</p>
      <p class="xn__message">{{ text.message(city) }}</p>
      <a class="xn__pill xn__pill--orange" :href="href" @click="onClick">{{ cta }}</a>
    </template>

    <!-- 5 · Sunset card -->
    <template v-else-if="base === 'sunset'">
      <span class="xn__logochip"><img :src="xnowLogo" :alt="PARTNER.name" class="xn__logo" width="60" height="22" /></span>
      <p class="xn__title">{{ headline }}</p>
      <p class="xn__message">{{ text.message(city) }}</p>
      <ul v-if="lk.perks" class="xn__perks" aria-label="Deals on">
        <li v-for="p in PERKS" :key="p.label"><q-icon :name="p.icon" size="18px" aria-hidden="true" /> {{ p.label }}</li>
      </ul>
      <a class="xn__pill xn__pill--white" :href="href" @click="onClick">{{ cta }}</a>
      <p v-if="lk.fine" class="xn__fine">{{ FINE_PRINT }}</p>
    </template>

    <!-- 6 · Split + who qualifies -->
    <template v-else-if="base === 'split'">
      <div class="xn__panel">
        <span class="xn__logochip"><img :src="xnowLogo" :alt="PARTNER.name" class="xn__logo" width="60" height="22" /></span>
        <p class="xn__title">{{ headline }}</p>
        <p class="xn__sub">{{ lk.sub ? lk.sub(city) : `in ${city} and beyond` }}</p>
      </div>
      <div class="xn__body">
        <ol v-if="lk.steps" class="xn__steps" aria-label="How it works">
          <li v-for="(st, i) in STEPS" :key="st"><span class="xn__num" aria-hidden="true">{{ i + 1 }}</span> {{ st }}</li>
        </ol>
        <p v-else class="xn__message">{{ text.message(city) }}</p>
        <p class="xn__label xn__label--dark">{{ lk.whoLabel || 'Verify as one of these to save' }}</p>
        <ul class="xn__groups">
          <li v-for="g in GROUPS" :key="g.label"><q-icon :name="g.icon" size="18px" aria-hidden="true" /> {{ g.label }}</li>
        </ul>
        <a class="xn__pill xn__pill--outline" :href="href" @click="onClick">{{ cta }}</a>
        <p v-if="lk.fine" class="xn__fine xn__fine--dark">{{ FINE_PRINT }}</p>
      </div>
    </template>
  </aside>
</template>

<style scoped>
/* ── shared ─────────────────────────────────────────────────────────────── */
.xn { font-family: inherit; border-radius: var(--ds-radius-lg); margin-bottom: 20px; }
.xn__head { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.xn__logo { height: 22px; width: auto; display: block; flex: none; }
.xn__logo--lg { height: 28px; }
.xn__label {
  margin: 0; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--ds-color-text-subtle);
}
.xn__message { margin: 0; font-size: 1rem; line-height: 1.5; color: var(--ds-color-text); }
.xn__link {
  display: inline-block; margin-top: 8px; font-weight: 700; font-size: 0.9375rem;
  color: var(--ds-color-link); text-decoration: underline; text-underline-offset: 3px;
}
.xn__link:hover { text-decoration-thickness: 2px; }
.xn a:focus-visible { outline: 2px solid var(--ds-color-border-focused); outline-offset: 3px; }

/* XNow type + pill buttons (branded looks) */
.xn:not(.xn--presto) { font-family: 'Poppins', 'Roboto', sans-serif; }
.xn__title { margin: 0 0 6px; font-weight: 700; font-size: 1.375rem; line-height: 1.25; letter-spacing: -0.01em; }
.xn__pill {
  display: inline-flex; align-items: center; justify-content: center; text-align: center;
  min-height: 44px; padding: 0 24px; margin-top: 14px; border-radius: 999px;
  font-weight: 600; font-size: 0.9375rem; text-decoration: none; white-space: nowrap;
}
.xn__pill--white { background: #fff; color: #141414; box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1); }
.xn__pill--orange { background: #f5af19; background-image: linear-gradient(53deg, #f12711 -3%, #f5af19 100%); color: #141414; }
.xn__pill--outline { /* gradient border via background-clip */
  border: 2px solid transparent; color: #b02a6e;
  background: linear-gradient(#fff, #fff) padding-box, linear-gradient(90deg, #f08865, #e44a98 74%, #b45ac9) border-box;
}
.xn__logochip { display: inline-flex; padding: 6px 12px; border-radius: 999px; background: #fff; margin-bottom: 14px; }

/* ── 1 · Logo only ──────────────────────────────────────────────────────── */
.xn--presto {
  background: var(--ds-color-background-brand-subtlest);
  border: 1px solid var(--ds-color-border); border-left: 4px solid var(--ds-color-border-brand);
  padding: 18px 24px;
}

/* ── 2 · Verify banner ──────────────────────────────────────────────────── */
.xn--banner {
  display: flex; align-items: center; gap: 14px; padding: 12px 12px 12px 18px; border-radius: 999px;
  background: #b83a4b; background-image: linear-gradient(90deg, #b83a4b 0%, #c2410c 100%);
}
.xn--banner .xn__badge {
  flex: none; width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center;
  border: 2px dashed rgba(255, 255, 255, 0.85); color: #fff;
}
.xn--banner .xn__message { flex: 1; color: #fff; font-weight: 500; font-size: 0.9375rem; }
.xn--banner .xn__pill { margin: 0; text-transform: uppercase; letter-spacing: 0.03em; font-size: 0.8125rem; }

/* ── 3 · Gradient accent ────────────────────────────────────────────────── */
.xn--ribbon {
  position: relative; overflow: hidden; background: #fff; padding: 22px 24px 20px;
  border: 1px solid var(--ds-color-border);
}
.xn--ribbon::before {
  content: ''; position: absolute; inset: 0 0 auto 0; height: 5px;
  background: linear-gradient(90deg, #f08865, #e44a98 74%, #b45ac9);
}
.xn--ribbon .xn__title { color: #141414; }
.xn--ribbon .xn__title :deep(em) {
  font-style: normal; color: #c2307a;
  background: linear-gradient(90deg, #e0431f, #c2307a); -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
}
.xn--ribbon .xn__message { color: #141414; }

/* ── 4 · Dark card ──────────────────────────────────────────────────────── */
.xn--dark { background: #141414; padding: 22px 24px; color: #fff; }
.xn--dark .xn__head { justify-content: space-between; margin-bottom: 14px; }
.xn--dark .xn__tag {
  padding: 4px 10px; border-radius: 4px; background: #f5af19;
  background-image: linear-gradient(53deg, #f12711, #f5af19); color: #141414;
  font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
}
.xn--dark .xn__title { color: #fff; }
.xn--dark .xn__message { color: #e6e6e6; }

/* ── 5 · Sunset card ────────────────────────────────────────────────────── */
.xn--sunset {
  padding: 24px 28px 26px; color: #fff; background: #6b2a73;
  background-image: linear-gradient(120deg, #2b1a4f 0%, #6b2a73 38%, #b2387a 62%, #e07a3a 86%, #e9a23b 100%);
}
.xn--sunset .xn__title { font-size: 1.75rem; font-weight: 800; color: #fff; max-width: 18ch; }
.xn--sunset .xn__message { color: #fff; max-width: 52ch; font-weight: 500; }

/* ── 6 · Split + who qualifies ──────────────────────────────────────────── */
.xn--split {
  display: grid; grid-template-columns: minmax(200px, 36%) 1fr; overflow: hidden;
  border: 1px solid var(--ds-color-border); background: #fff;
}
.xn--split .xn__panel {
  padding: 24px; color: #fff; background: #6b2a73;
  background-image: linear-gradient(160deg, #2b1a4f 0%, #6b2a73 45%, #b2387a 80%, #c2410c 100%);
}
.xn--split .xn__panel .xn__title { color: #fff; font-size: 1.5rem; font-weight: 800; }
.xn--split .xn__sub { margin: 0; font-weight: 600; color: #fff; }
.xn--split .xn__body { padding: 22px 24px; }
.xn--split .xn__message { color: #141414; }
.xn--split .xn__label--dark { margin-top: 14px; color: #141414; }
.xn__groups { list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
.xn__groups li {
  display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px;
  background: #f6f3f8; color: #141414; font-size: 0.8125rem; font-weight: 500;
}
.xn__groups li .q-icon { color: #b02a6e; }

/* ── verified-groups alts (v-*) ─────────────────────────────────────────── */
.xn__perks { list-style: none; margin: 14px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
.xn__perks li {
  display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px;
  background: #fff; color: #141414; font-size: 0.8125rem; font-weight: 600;
}
.xn__perks li .q-icon { color: #b02a6e; }
/* fine print on the gradient sits on a dark strip so it passes AA anywhere */
.xn__fine {
  margin: 18px -28px -26px; padding: 8px 28px; font-size: 0.75rem; font-weight: 500; color: #fff;
  background: rgba(20, 20, 20, 0.45); border-radius: 0 0 var(--ds-radius-lg) var(--ds-radius-lg);
}
.xn__fine--dark { margin: 12px 0 0; padding: 0; background: none; color: #5c5c5c; border-radius: 0; }
.xn__steps {
  list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
}
.xn__steps li {
  display: flex; align-items: center; gap: 8px; font-size: 0.875rem; font-weight: 600; color: #141414; line-height: 1.3;
}
.xn__num {
  flex: none; width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center;
  color: #fff; font-size: 0.8125rem; font-weight: 700; background: #b02a6e;
  background-image: linear-gradient(135deg, #c2410c, #b02a6e);
}

/* ── email: flatter; gradients fall back to a solid color in Outlook ──── */
.xn--email { margin: 0; }
.xn--email.xn--presto { border-radius: 6px; padding: 16px 20px; }
.xn--email.xn--banner { border-radius: 14px; }
.xn--email .xn__pill { white-space: normal; }
.xn--email .xn__steps { grid-template-columns: 1fr; gap: 8px; }

/* ── phone ──────────────────────────────────────────────────────────────── */
@media (max-width: 600px) {
  .xn--presto { padding: 16px 18px; }
  .xn--banner { flex-wrap: wrap; border-radius: 18px; padding: 16px; }
  .xn--banner .xn__message { flex-basis: calc(100% - 48px); }
  .xn--sunset { padding: 22px 20px; }
  .xn--sunset .xn__title { font-size: 1.5rem; }
  .xn--sunset .xn__fine { margin: 18px -20px -22px; padding: 8px 20px; }
  .xn__steps { grid-template-columns: 1fr; gap: 8px; }
  .xn--split { grid-template-columns: 1fr; }
  .xn__pill { width: 100%; white-space: normal; }
}
</style>
