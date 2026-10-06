<script setup>
import { ref, onBeforeMount } from 'vue'
import { CHARITIES, REFUND_COVERS, asset } from '../data.js'
import { state, pricing, money, ensureOrder, go } from '../store.js'
import CheckoutLayout from '../components/CheckoutLayout.vue'

onBeforeMount(ensureOrder)

const tried = ref(false)
function submit() {
  tried.value = true
  if (state.refundable === null) {
    document.querySelector('.rb')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }
  go('payment')
}
const check = `<svg viewBox="0 0 20 20" width="21" height="21" aria-hidden="true"><path d="M3 10.5l4.5 4.5L17 5.5" fill="none" stroke="#7aa972" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`
</script>

<template>
  <CheckoutLayout step="extras" :title="['Extras']" cta="Payment" @submit="submit">
    <section class="cause">
      <h2 class="cause__h">Race for a Cause</h2>
      <p class="cause__p">
        Choose a charity and givestar, our official fundraising partner, will create your personalised fundraising page. By choosing to fundraise, you agree to receive emails and SMS messages from givestar to help you claim your fundraising page. You can opt out at any time.
        <a href="#" @click.prevent>Learn how</a>
      </p>
      <p class="cause__label">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 20.5s-8-4.9-8-10.7A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8 2.8c0 5.8-8 10.7-8 10.7Z" fill="none" stroke="#000" stroke-width="1.9" stroke-linejoin="round" /></svg>
        Select a charity
      </p>
      <label class="select">
        <span class="sr-only">Charity</span>
        <select v-model="state.charity">
          <option v-for="c in CHARITIES" :key="c">{{ c }}</option>
        </select>
      </label>
      <p class="cause__legal">
        By selecting a charity a fundraising page will be created via our partner givestar and your details will be shared for this purpose. By selecting this feature, you agree to the <a href="#" @click.prevent>Privacy Policy</a>. If you wish you can change your fundraising target later
      </p>
      <img class="cause__gs" :src="asset('logos/givestar-powered.png')" alt="Powered by givestar" />
    </section>
    <hr class="rule" />

    <section class="rb" :class="{ 'is-err': tried && state.refundable === null }">
      <span class="rb__badge">Recommended</span>
      <h2 class="rb__h">
        <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
          <circle cx="16" cy="16" r="15" fill="#f0f0f0" />
          <path d="M16 7.5 9.5 10v5.2c0 4.2 2.8 7.6 6.5 8.8 3.7-1.2 6.5-4.6 6.5-8.8V10Z" fill="#000" />
          <path d="M16 9.6v12.2c-2.6-1-4.4-3.6-4.4-6.6v-3.8Z" fill="#fff" />
        </svg>
        Make my Booking Refundable
      </h2>
      <ul class="rb__covers">
        <li v-for="c in REFUND_COVERS" :key="c"><span v-html="check" />{{ c }}</li>
        <li><span v-html="check" /><a href="#" @click.prevent>And many more!</a></li>
      </ul>
      <p class="rb__p">
        No stress, no hassle—just peace of mind. If you can’t make it and have supporting evidence, we’ll refund you in full. Check the details in our
        <a href="#" @click.prevent>Terms &amp; Conditions.</a>
      </p>
      <p class="rb__fast">
        <svg viewBox="0 0 24 24" width="27" height="27" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#7aa972" /><path d="M12 6.5V12l3.5 2.5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" /></svg>
        Average refund payment in less than four hours for complete applications
      </p>
      <div class="rb__opts" role="radiogroup" aria-label="Refundable booking">
        <label class="opt opt--yes" :class="{ 'is-on': state.refundable === true }">
          <input v-model="state.refundable" type="radio" :value="true" name="refund" />
          <span class="opt__dot" aria-hidden="true" />
          <span class="opt__label">Refundable Booking</span>
          <span class="opt__price">{{ money(pricing.refundFee) }}</span>
        </label>
        <label class="opt" :class="{ 'is-on': state.refundable === false }">
          <input v-model="state.refundable" type="radio" :value="false" name="refund" />
          <span class="opt__dot" aria-hidden="true" />
          <span class="opt__label opt__label--no">Non-refundable Booking</span>
        </label>
      </div>
      <p v-if="tried && state.refundable === null" class="rb__err">Please choose whether to make your booking refundable</p>
    </section>
  </CheckoutLayout>
</template>

<style scoped>
.rule { margin: 0; border: 0; border-top: 1.5px solid #e2e2e2; }

.cause { padding-bottom: 47px; }
.cause__h { margin-top: 57px; font-size: 17.9px; font-weight: 700; line-height: 22px; color: #000; }
.cause__p { max-width: 618px; margin-top: 24px; font-size: 15.9px; font-weight: 400; line-height: 23.8px; color: #000; }
.cause__p a { color: #000; text-underline-offset: 2px; }
.cause__label { display: flex; align-items: center; gap: 13px; margin-top: 25px; font-size: 15.9px; color: #000; }
.select { position: relative; display: block; margin-top: 25px; }
.select select {
  appearance: none;
  width: 100%;
  height: 41px;
  padding: 0 40px 0 9px;
  border: 1.5px solid #4b4b4b;
  border-radius: 6px;
  background: #fff;
  font-size: 13.6px;
  font-weight: 500;
  color: #4b4b4b;
  cursor: pointer;
}
.select::after {
  content: '';
  position: absolute;
  right: 15px;
  top: 18px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5.5px solid #4b4b4b;
  pointer-events: none;
}
.cause__legal { margin-top: 26px; font-size: 11.8px; font-weight: 500; line-height: 23.8px; color: #000; }
.cause__legal a { color: #555; text-underline-offset: 2px; }
.cause__gs { width: 149px; margin-top: 12px; }

.rb {
  position: relative;
  margin-top: 42px;
  padding: 37px 24px 25px;
  border: 1px solid #d4d4d4;
  border-radius: 8px;
}
.rb.is-err { border-color: var(--red-error); }
.rb__badge {
  position: absolute;
  top: -13px;
  left: 20px;
  height: 29.5px;
  padding: 0 9px;
  display: flex;
  align-items: center;
  border-radius: 3px;
  background: var(--green-refund);
  color: #fff;
  font-size: 12.9px;
  font-weight: 600;
  text-transform: uppercase;
}
.rb__h { display: flex; align-items: center; gap: 6px; font-size: 24px; font-weight: 700; line-height: 29px; color: #000; }
.rb__h svg { width: 24px; height: 24px; }
.rb__covers { display: grid; grid-template-columns: 1fr 1fr; row-gap: 14px; margin-top: 13px; }
.rb__covers li { display: flex; align-items: center; gap: 9px; font-size: 15.7px; font-weight: 500; line-height: 21px; color: #000; }
.rb__covers li > span { line-height: 0; }
.rb__covers a { color: var(--blue-link); text-underline-offset: 2px; }
.rb__p { margin-top: 15px; font-size: 15.7px; font-weight: 500; line-height: 24px; color: #000; }
.rb__p a { color: var(--blue-link); text-underline-offset: 2px; }
.rb__fast { display: flex; align-items: center; gap: 11px; margin-top: 18px; padding-right: 30px; font-size: 15px; font-weight: 700; line-height: 22.3px; color: var(--green-refund); }
.rb__fast svg { flex: none; width: 19px; height: 19px; }
.rb__opts { margin-top: 18px; }
.opt {
  position: relative;
  display: flex;
  align-items: center;
  height: 55px;
  padding: 0 17px 0 16px;
  border: 1px solid #cfcfcf;
  border-radius: 6px;
  cursor: pointer;
}
.opt + .opt { margin-top: 11px; }
.opt--yes { height: 56px; border: 2px solid #8c8c8c; }
.opt.is-on { border: 2px solid #000; }
.opt input { position: absolute; opacity: 0; pointer-events: none; }
.opt__dot { width: 20px; height: 20px; flex: none; border: 1.5px solid #bbb; border-radius: 50%; background: #fff; }
.opt.is-on .opt__dot { border: 6px solid #000; }
.opt input:focus-visible ~ .opt__dot { outline: 2px solid #4191dd; outline-offset: 2px; }
.opt__label { margin-left: 22px; font-size: 14.9px; font-weight: 700; color: #000; }
.opt__label--no { font-weight: 500; }
.opt__price { margin-left: auto; font-size: 15px; font-weight: 500; color: #000; }
.rb__err { margin-top: 12px; font-size: 13px; font-weight: 500; color: var(--red-error); }
</style>
