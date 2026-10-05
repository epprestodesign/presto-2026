<script setup>
import { ref } from 'vue'
import { SPONSOR_ROWS, FOOTER_COLS, asset } from '../data.js'

const email = ref('')
const subscribed = ref(false)
const submit = () => { if (email.value.includes('@')) subscribed.value = true }
</script>

<template>
  <footer class="ft">
    <section class="sponsors" aria-label="Sponsors">
      <div v-for="(row, i) in SPONSOR_ROWS" :key="i" class="sponsors__row" :class="`sponsors__row--${i}`">
        <img v-for="l in row" :key="l.src" :src="asset(l.src)" :style="{ width: l.w + 'px' }" alt="" />
      </div>
    </section>

    <section class="stay">
      <div>
        <h2 class="t-wide stay__h">Stay connected</h2>
        <p class="stay__legal">*By entering my email address, I agree to the terms and policy!</p>
      </div>
      <form class="stay__form" @submit.prevent="submit">
        <label class="sr-only" for="ft-email">Email</label>
        <input id="ft-email" v-model="email" type="email" placeholder="Enter your email here" :disabled="subscribed" />
        <button class="pill stay__submit" type="submit">{{ subscribed ? 'Thanks!' : 'Submit' }}</button>
      </form>
    </section>

    <section class="links">
      <div class="links__top">
        <div class="links__social">
          <a href="#" aria-label="Instagram" @click.prevent><img :src="asset('icons/instagram.svg')" alt="" /></a>
          <a href="#" aria-label="Facebook" @click.prevent><img :src="asset('icons/facebook.svg')" alt="" style="width: 24px; height: 24px" /></a>
          <a href="#" aria-label="Twitter" @click.prevent><img :src="asset('icons/twitter.svg')" alt="" style="width: 22px; height: 20px" /></a>
          <a href="#" aria-label="YouTube" @click.prevent><img :src="asset('icons/youtube.svg')" alt="" style="width: 26px; height: 19px" /></a>
        </div>
        <img class="links__mark" :src="asset('logos/spartan-wordmark.webp')" alt="Spartan" />
      </div>
      <div class="links__cols">
        <div v-for="(c, i) in FOOTER_COLS" :key="i" class="links__col">
          <div v-for="g in c.groups" :key="g.head" class="links__group">
            <p class="links__head">{{ g.head }}</p>
            <a v-for="l in g.links" :key="l" href="#" @click.prevent>{{ l }}</a>
          </div>
          <div v-if="c.apps" class="links__apps">
            <img :src="asset('icons/appstore-google.svg')" alt="Get it on Google Play" />
            <img :src="asset('icons/appstore-apple.svg')" alt="Download on the App Store" />
          </div>
        </div>
      </div>
      <div class="links__bottom">
        <p>© 2026 Spartan Race Inc. Established 2010 - Vermont</p>
        <nav>
          <a href="#" @click.prevent>Privacy Policy</a>
          <a href="#" @click.prevent>Terms &amp; Conditions</a>
          <a href="#" @click.prevent>Cookies</a>
        </nav>
      </div>
    </section>
  </footer>
</template>

<style scoped>
.ft { color: #fff; }

/* sponsor wall */
.sponsors { background: var(--grey-900); padding: 69px 89px 0; }
.sponsors__row { display: flex; align-items: center; justify-content: space-around; height: 114px; }
.sponsors__row img { opacity: 0.5; }
.sponsors__row--0 { padding: 0 20px 0 20px; }
.sponsors__row--3 { padding: 0 210px 0 230px; }

/* newsletter */
.stay {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--grey-900);
  padding: 199px 151px 132px 99px;
}
.stay__h { font-size: 29.9px; color: #fff; }
.stay__legal { margin-top: 13px; font-size: 12px; font-weight: 500; color: #fff; }
.stay__form { display: flex; align-items: center; gap: 32px; }
.stay__form input {
  width: 420px;
  height: 40px;
  padding: 0;
  border: 0;
  border-bottom: 1px solid #8a8a8a;
  background: transparent;
  color: #fff;
  font-size: 14.5px;
  font-weight: 500;
  text-transform: uppercase;
  outline: none;
}
.stay__form input::placeholder { color: #8a8a8a; }
.stay__submit { width: 101px; height: 40px; background: #fff; color: #000; font-size: 13px; letter-spacing: 0.03em; }

/* link farm */
.links { background: #000; padding: 32px 0 0; }
.links__top { display: flex; align-items: center; justify-content: space-between; padding: 0 181px 0 182px; }
.links__social { display: flex; align-items: center; gap: 48px; }
.links__social a { display: grid; place-items: center; width: 24px; height: 24px; }
.links__social img { width: 21px; height: 21px; }
.links__mark { width: 165px; opacity: 0.6; }
.links__cols { display: flex; padding: 57px 0 0 180px; }
.links__col:nth-child(1) { width: 233px; }
.links__col:nth-child(2) { width: 227px; }
.links__col:nth-child(3) { width: 173px; }
.links__col:nth-child(4) { width: 259px; }
.links__group + .links__group { margin-top: 38px; }
.links__head { font-size: 14.6px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.01em; line-height: 18px; }
.links__group a { display: block; margin-top: 15px; font-size: 13.7px; font-weight: 500; line-height: 18px; color: #fff; text-decoration: none; }
.links__group a:hover { text-decoration: underline; }
.links__apps { margin-top: 20px; }
.links__apps img { width: 112px; margin-bottom: 14px; }
.links__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 36px 30px 15px 70px;
  font-size: 14px;
  font-weight: 500;
  color: #8a8a8a;
}
.links__bottom nav { display: flex; gap: 30px; }
.links__bottom a { color: #8a8a8a; text-decoration: none; }
</style>
