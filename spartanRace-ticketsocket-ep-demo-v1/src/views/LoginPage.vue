<script setup>
import { ref, nextTick } from 'vue'
import { asset } from '../data.js'
import { state, go, cartCount, ensureOrder } from '../store.js'
import SiteHeader from '../components/SiteHeader.vue'

const emailMode = ref(false)
const email = ref('')
const emailInput = ref(null)

function signIn() {
  state.signedIn = true
  // Coming from COMMIT NOW → continue into checkout; otherwise back to the event.
  if (cartCount.value) {
    ensureOrder()
    go('details')
  } else go('event')
}
async function useEmail() {
  emailMode.value = true
  await nextTick()
  emailInput.value?.focus()
}
</script>

<template>
  <div class="lg">
    <SiteHeader variant="account" />
    <div class="lg__body">
      <div class="lg__imgwrap">
        <img class="lg__img" :src="asset('img/login-hero.png')" alt="Spartan racers high-fiving at the finish line" />
      </div>
      <section class="lg__panel">
        <div class="lg__inner">
          <h1 class="t-wide lg__h"><span>Join for free</span><span>or sign in</span></h1>
          <ul class="lg__list">
            <li>· Get personalized results and photos</li>
            <li>· Manage your tickets</li>
            <li>· Create or join a Spartan team</li>
          </ul>

          <div class="lg__btns">
            <button class="sso sso--light" @click="signIn">
              <img :src="asset('icons/apple.svg')" alt="" class="sso__icon sso__icon--apple" />
              Continue with Apple
            </button>
            <button class="sso sso--light" @click="signIn">
              <img :src="asset('icons/google.svg')" alt="" class="sso__icon" />
              Continue with Google
            </button>
            <button v-if="!emailMode" class="sso sso--dark" @click="useEmail">
              <svg class="sso__icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M3 5h18v14H3Z" fill="#fff" /><path d="m3.5 6 8.5 6.5L20.5 6" fill="none" stroke="#191818" stroke-width="1.8" /></svg>
              Continue with email
            </button>
            <form v-else class="lg__email" @submit.prevent="signIn">
              <label class="sr-only" for="lg-email">Email</label>
              <input id="lg-email" ref="emailInput" v-model="email" type="email" required placeholder="Email address" />
              <button class="sso sso--light" type="submit">Continue</button>
            </form>
          </div>

          <p class="lg__legal">
            By using an account, you agree to Spartan's<br />
            <a href="#" @click.prevent>Privacy Policy</a> and <a href="#" @click.prevent>Terms of Use</a>.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.lg { background: var(--grey-login); }
.lg__body { display: flex; min-height: calc(100vh - 79px); }
/* the reference crops the portrait photo in tight on the finish-line clock */
.lg__imgwrap { position: relative; width: 474px; flex: none; overflow: hidden; }
.lg__img { position: absolute; left: -154px; top: -46px; width: 1056px; max-width: none; height: auto; }
.lg__panel { flex: 1; display: flex; align-items: center; justify-content: center; padding: 48px 0 40px 18px; }
.lg__inner { width: 400px; }
.lg__h { display: block; font-size: 34.6px; line-height: 32px; color: #fff; }
.lg__h span { display: block; }
.lg__h span + span { margin-top: 7.5px; }
.lg__list { margin-top: 34px; color: #fff; font-size: 15.7px; font-weight: 500; line-height: 24.4px; }
.lg__btns { display: grid; gap: 12px; margin-top: 58px; }
.sso {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.sso--light { background: #fff; color: #000; }
.sso--dark { border: 1px solid rgba(255, 255, 255, 0.55); color: #fff; }
.sso:hover { filter: brightness(0.94); }
.sso--dark:hover { border-color: #fff; filter: none; }
.sso__icon { position: absolute; left: 17px; width: 22px; height: 22px; }
.sso__icon--apple { filter: brightness(0); width: 20px; height: 20px; left: 14px; }
.lg__email { display: grid; gap: 12px; }
.lg__email input {
  height: 50px;
  padding: 0 22px;
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 25px;
  background: transparent;
  color: #fff;
  font-size: 15px;
  outline: none;
}
.lg__email input:focus { border-color: #fff; }
.lg__legal { margin-top: 32px; text-align: center; color: #757474; font-size: 12.8px; font-weight: 500; line-height: 21px; }
.lg__legal a { color: #757474; text-decoration: none; border-bottom: 1px solid #4a4a4a; padding-bottom: 1px; }
.lg__legal a:hover { color: #aaa; }
</style>
