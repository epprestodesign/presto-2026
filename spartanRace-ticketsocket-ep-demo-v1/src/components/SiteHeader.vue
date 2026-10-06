<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { UTILITY_BRANDS, MAIN_NAV, PROMOS, asset } from '../data.js'
import { state, cartCount, go } from '../store.js'
import CartPopover from './CartPopover.vue'

// 'event'   → utility bar + nav + promo banner (marketing site)
// 'account' → nav only, with profile + locale icons (account / login app)
const props = defineProps({ variant: { type: String, default: 'event' } })

const promo = ref(0)
const step = (d) => (promo.value = (promo.value + d + PROMOS.length) % PROMOS.length)
let timer
// close the cart on outside click / Esc — but not on the clicks that add tickets
const onDocClick = (e) => {
  if (state.cartOpen && !e.target.closest('.cart, [data-opens-cart]')) state.cartOpen = false
}
const onKey = (e) => { if (e.key === 'Escape') state.cartOpen = false }
onMounted(() => {
  if (props.variant === 'event') timer = setInterval(() => step(1), 6000)
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  clearInterval(timer)
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})

const toggleCart = () => (state.cartOpen = !state.cartOpen)
</script>

<template>
  <header class="hdr" :class="`hdr--${variant}`">
    <div v-if="variant === 'event'" class="util">
      <nav class="util__brands" aria-label="Spartan family brands">
        <a v-for="b in UTILITY_BRANDS" :key="b" href="#" @click.prevent>{{ b }}</a>
      </nav>
      <button class="util__globe" aria-label="Select your location" @click="go('location')">
        <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
          <circle cx="12" cy="12" r="10.2" fill="none" stroke="#fff" stroke-width="2.2" />
          <path fill="#fff" d="M8.2 4.6c1.4.6 1.2 1.9 2.4 2.1 1 .2 1.6-.7 2.6-.2.9.5.2 1.7-.6 2.3-.9.7-2.3.4-2.7 1.6-.3 1 .9 1.6.6 2.6-.3 1.1-1.9 1.1-2.4 2.2-.4.9.3 2 0 2.9-1.9-1.2-3.3-3.4-3.3-5.9 0-3.3 1.4-6.3 3.4-7.6Zm8.6 8.8c1 .2 2.3.1 2.9.9.5.7-.1 1.8-.7 2.5-.8.9-1.7 1.8-2.8 2.3-.5-.9.6-2-.1-2.8-.5-.6-1.4-.6-1.6-1.4-.2-.9 1.2-1.7 2.3-1.5Z" />
        </svg>
      </button>
    </div>

    <div class="nav">
      <a class="nav__logo" href="#/event" aria-label="Spartan Race home">
        <img :src="asset('icons/spartan-logo.svg')" alt="" />
      </a>
      <nav class="nav__main" aria-label="Main">
        <a v-for="n in MAIN_NAV" :key="n" href="#" @click.prevent>{{ n }}</a>
      </nav>
      <div class="nav__right">
        <div class="cart">
          <button class="cart__btn" :aria-expanded="state.cartOpen" aria-label="Ticket cart" @click="toggleCart">
            <img :src="asset('icons/cart-tickets.svg')" alt="" />
            <span v-if="cartCount" class="cart__badge">{{ cartCount }}</span>
          </button>
          <CartPopover v-if="state.cartOpen" />
        </div>
        <a class="pill pill--red nav__find" href="#/event" >Find a race</a>
        <button v-if="variant === 'event'" class="nav__profile" aria-label="Account" @click="go('login')">
          <img :src="asset('icons/profile.svg')" alt="" />
        </button>
        <template v-else>
          <button class="nav__profile nav__profile--sm" aria-label="Account" @click="go('login')">
            <img :src="asset('icons/profile.svg')" alt="" />
          </button>
          <button class="nav__locale" aria-label="Select your location" @click="go('location')">
            <img :src="asset('icons/locale.svg')" alt="" />
          </button>
        </template>
      </div>
    </div>

    <div v-if="variant === 'event'" class="promo">
      <button class="promo__arrow promo__arrow--l" aria-label="Previous promotion" @click="step(-1)">
        <svg viewBox="0 0 24 24" width="22" height="22"><path d="M15 4 7 12l8 8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
      <div class="promo__body" aria-live="polite">
        <p class="promo__title">{{ PROMOS[promo].title }}</p>
        <p class="promo__text">
          {{ PROMOS[promo].body }}
          <a href="#" @click.prevent>{{ PROMOS[promo].cta }}</a>
        </p>
      </div>
      <button class="promo__arrow promo__arrow--r" aria-label="Next promotion" @click="step(1)">
        <svg viewBox="0 0 24 24" width="22" height="22"><path d="m9 4 8 8-8 8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
    </div>
  </header>
</template>

<style scoped>
.hdr { position: relative; z-index: 50; background: #000; color: #fff; }

/* utility bar */
.util {
  position: relative;
  height: 40px;
  padding-top: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 3px solid #333;
}
.util__brands { display: flex; gap: 19.5px; }
.util__brands a {
  color: #808080;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 600;
}
.util__brands a:hover { color: #fff; }
.util__globe { position: absolute; right: 54px; top: 10px; line-height: 0; }

/* main nav */
.nav {
  position: relative;
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 49px 0 70px;
}
.hdr--account .nav { height: 79px; }
.nav__logo img { width: 50px; height: 50px; }
.nav__main {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 34.5px;
}
.nav__main a {
  color: #fff;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 18px;
  font-weight: 700;
}
.nav__right { margin-left: auto; display: flex; align-items: center; }
.cart { position: relative; }
.cart__btn { position: relative; display: block; line-height: 0; }
.cart__btn img { width: 29px; height: 23px; }
.cart__badge {
  position: absolute;
  top: -10px;
  right: -8px;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  background: var(--red-badge);
  color: #fff;
  font-size: 10.5px;
  font-weight: 700;
  line-height: 16px;
  text-align: center;
  box-shadow: 0 0 0 1.5px #000;
}
.nav__find {
  margin-left: 24px;
  height: 44px;
  padding: 0 22px;
  font-size: 14px;
}
.nav__profile { margin-left: 26px; line-height: 0; }
.nav__profile img { width: 32px; height: 32px; }

.hdr--account .nav__find { margin-left: 25px; }
.nav__profile--sm { margin-left: 22px; }
.nav__profile--sm img { width: 18px; height: 18px; }
.nav__locale { margin-left: 18px; line-height: 0; }
.nav__locale img { width: 17px; height: 17px; }

/* promo banner */
.promo {
  height: 53px;
  background: var(--red-banner);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  text-align: center;
}
.promo__title { font-size: 17px; font-weight: 700; line-height: 1.15; }
.promo__text { font-size: 12.8px; font-weight: 500; line-height: 1.3; }
.promo__text a {
  margin-left: 18px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.promo__arrow { position: absolute; top: 15px; line-height: 0; }
.promo__arrow--l { left: 49px; }
.promo__arrow--r { right: 49px; }
</style>
