<script setup>
import { LOCATIONS } from '../data.js'
import { go } from '../store.js'
import SiteHeader from '../components/SiteHeader.vue'
</script>

<template>
  <div class="loc">
    <SiteHeader variant="account" />
    <main class="loc__main">
      <h1 class="loc__h">Select Your Location</h1>
      <section v-for="r in LOCATIONS" :key="r.region" class="region">
        <h2 class="region__h">{{ r.region }}</h2>
        <ul class="grid">
          <li v-for="[country, langs] in r.countries" :key="country">
            <p class="country">{{ country }}</p>
            <a v-for="l in langs" :key="l" class="lang" href="#/" @click.prevent="go('event')">{{ l }}</a>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<style scoped>
.loc { background: #fff; }
.loc__main { padding: 37px 0 120px 290px; }
.loc__h { font-size: 35.8px; font-weight: 700; line-height: 44px; color: #000; }
.region { margin-top: 63px; }
.region + .region { margin-top: 73px; }
.region__h { font-size: 19.7px; font-weight: 400; line-height: 24px; color: #000; }
.grid { display: grid; grid-template-columns: repeat(5, 171px); row-gap: 30px; margin-top: 27px; }
.country { font-size: 14.8px; font-weight: 700; line-height: 22px; letter-spacing: 0.02em; text-transform: uppercase; color: #000; }
.lang { display: block; font-size: 13.9px; font-weight: 400; line-height: 22px; color: #000; text-decoration: none; }
.lang:hover { text-decoration: underline; }
</style>
