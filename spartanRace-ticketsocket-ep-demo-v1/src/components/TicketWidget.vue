<script setup>
// ┌──────────────────────────────────────────────────────────────────────┐
// │ WIDGET SLOT — phase 2 swaps this whole component for the Eventpipe /  │
// │ TicketSocket ticketing widget. Everything above and below it on the   │
// │ event page is the Spartan host page and stays as-is.                  │
// └──────────────────────────────────────────────────────────────────────┘
import { reactive } from 'vue'
import { RACES, TRIFECTA_PASS, asset } from '../data.js'
import RaceCard from './RaceCard.vue'

const open = reactive({ sprint: true })
const expand = (id) => (open[id] = true)
</script>

<template>
  <section class="tw" aria-label="Tickets" data-widget-slot="ticketsocket">
    <RaceCard v-for="r in RACES" :key="r.id" :race="r" :expanded="!!open[r.id]" @expand="expand" />

    <article class="tri" :style="{ backgroundImage: `url(${asset('img/trifecta-bg.jpg')})` }">
      <div class="tri__top">
        <img class="tri__medal" :src="asset('img/trifecta-medal.png')" alt="" />
        <h3 class="tri__name t-cond">Trifecta Pass</h3>
        <div class="tri__price">
          <p class="t-cond-italic t-cond--r">{{ TRIFECTA_PASS.price }}</p>
          <span>{{ TRIFECTA_PASS.savings }}</span>
        </div>
      </div>
      <ul class="tri__perks">
        <li v-for="p in TRIFECTA_PASS.perks" :key="p.text">
          <img :src="asset(p.icon)" alt="" />{{ p.text }}
        </li>
      </ul>
      <button class="pill pill--red tri__buy">Buy now</button>
    </article>

    <img class="tw__powered" :src="asset('logos/ticketsocket.png')" alt="Powered by TicketSocket" />
  </section>
</template>

<style scoped>
.tw { margin-top: 24px; }
.tw > :deep(.rc) + .tri { margin-top: 24px; }

.tri {
  position: relative;
  height: 221px;
  margin-top: 24px;
  padding: 25px 32px 0 20px;
  background: #e9e9e9 right bottom / cover no-repeat;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.09);
}
.tri__top { display: flex; align-items: center; }
.tri__medal { width: 65px; height: 64px; }
.tri__name { margin-left: 8px; font-size: 27.4px; color: #000; }
.tri__price { margin-left: auto; text-align: right; }
.tri__price p { display: block; font-size: 28px; line-height: 1; color: #000; }
.tri__price span {
  display: block;
  margin-top: 6px;
  color: #6b6b6b;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.tri__perks { margin-top: 14px; }
.tri__perks li {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 36px;
  font-size: 12.5px;
  font-weight: 600;
  color: #222;
}
.tri__perks img { width: 18px; height: 18px; flex: none; }
.tri__buy {
  position: absolute;
  right: 37px;
  bottom: 24px;
  width: 135px;
  height: 43px;
  font-size: 15px;
  letter-spacing: 0.14em;
}
.tw__powered { width: 168px; margin: 24px auto 0; }
</style>
