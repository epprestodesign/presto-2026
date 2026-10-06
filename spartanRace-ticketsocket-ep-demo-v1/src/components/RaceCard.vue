<script setup>
import { state, setTicketQty, setDayAddonQty } from '../store.js'

const props = defineProps({
  race: { type: Object, required: true },
  expanded: { type: Boolean, default: false },
})
const emit = defineEmits(['expand'])

const fmt = (n) => `$${n.toFixed(2)}`

function pick(kind, id) {
  if (kind === 'ticket') setTicketQty(id, 1)
  else setDayAddonQty(id, 1)
  state.cartOpen = true
}
function change(kind, id, q) {
  if (kind === 'ticket') setTicketQty(id, q)
  else setDayAddonQty(id, q)
}
const qtyOf = (kind, id) => (kind === 'ticket' ? state.tickets[id] : state.addons[id]) || 0
</script>

<template>
  <article class="rc" :class="{ 'rc--open': expanded, 'rc--bar': race.bar, 'rc--nofrom': race.from == null }" :style="race.bar ? { '--bar': race.bar } : null">
    <div v-if="race.ribbon" class="rib" :style="{ '--rib': race.ribbon.color, '--rib-bg': race.ribbon.bg }">
      <span class="rib__pill">{{ race.ribbon.label }}</span>
    </div>

    <div class="rc__card">
      <header class="rc__head">
        <div class="rc__id">
          <p class="rc__dates">{{ race.dates }}</p>
          <h3 class="rc__name t-cond">
            <span v-for="l in race.name" :key="l">{{ l }}</span>
          </h3>
        </div>
        <div class="rc__side" :class="{ 'rc__side--panel': !expanded, 'rc__side--nofrom': race.from == null }">
          <p v-if="race.from != null" class="rc__from t-cond-italic t-cond--r">From ${{ race.from.toFixed(2) }}</p>
          <button v-if="!expanded" class="pill pill--red rc__tickets" @click="emit('expand', race.id)">Tickets</button>
        </div>
      </header>

      <div v-if="expanded" class="rc__days">
        <section v-for="d in race.days" :key="d.key" class="day">
          <div class="day__head">
            <h4>{{ d.label }}</h4>
            <button class="day__types" type="button">
              Ticket types
              <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                <circle cx="10" cy="10" r="10" fill="#b1b1b1" />
                <path d="M7.6 7.6a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.6" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" />
                <circle cx="10" cy="14.6" r="1.15" fill="#fff" />
              </svg>
            </button>
          </div>

          <ul class="rows">
            <li v-for="t in d.tickets" :key="t.id" class="row">
              <div class="row__info">
                <p class="row__time">{{ t.time }}</p>
                <p class="row__name">{{ t.name }}</p>
                <p class="row__left">{{ t.left }} left at this price</p>
              </div>
              <button v-if="!qtyOf('ticket', t.id)" class="pill pill--red row__price" data-opens-cart @click="pick('ticket', t.id)">
                {{ fmt(t.price) }}
              </button>
              <label v-else class="qty" data-opens-cart>
                <span class="sr-only">Quantity for {{ t.name }}</span>
                <select :value="qtyOf('ticket', t.id)" @change="change('ticket', t.id, +$event.target.value)">
                  <option v-for="n in 11" :key="n" :value="n - 1">{{ n - 1 }}</option>
                </select>
              </label>
            </li>
          </ul>

          <template v-if="d.addons.length">
            <h4 class="addons__title">Add-ons</h4>
            <ul class="rows rows--addons">
              <li v-for="a in d.addons" :key="a.id" class="row row--addon">
                <p class="row__addon">{{ a.name }}</p>
                <button v-if="!qtyOf('addon', a.id)" class="pill pill--red row__price row__price--addon" data-opens-cart @click="pick('addon', a.id)">
                  {{ fmt(a.price) }}
                </button>
                <label v-else class="qty" data-opens-cart>
                  <span class="sr-only">Quantity for {{ a.name }}</span>
                  <select :value="qtyOf('addon', a.id)" @change="change('addon', a.id, +$event.target.value)">
                    <option v-for="n in 11" :key="n" :value="n - 1">{{ n - 1 }}</option>
                  </select>
                </label>
              </li>
            </ul>
          </template>
        </section>
      </div>
    </div>
  </article>
</template>

<style scoped>
.rc + .rc { margin-top: 24px; }

/* ribbon */
.rib { height: 27px; background: var(--rib-bg); }
.rib__pill {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 507px;
  height: 100%;
  padding-right: 24px;
  border-radius: 0 14px 14px 0;
  background: var(--rib);
  color: #fff;
  font-size: 12.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.rc__card {
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.09);
}
.rc--bar .rc__card { border-top: 4px solid var(--bar); border-radius: 3px 3px 0 0; }
.rc--bar .rc__head { min-height: 134px; }
.rc--nofrom .rc__head { min-height: 112px; }
.rc--nofrom .rc__id { padding-top: 33px; }

/* head */
.rc__head { display: flex; justify-content: space-between; min-height: 140px; }
.rc__id { padding: 36px 0 24px 24px; }
.rc__dates {
  color: var(--grey-450);
  font-size: 15px;
  font-weight: 600;
  text-transform: uppercase;
  line-height: 1;
  letter-spacing: 0.005em;
}
.rc__name {
  display: block;
  margin-top: 1px;
  font-size: 27.4px;
  line-height: 28px;
  color: #000;
}
.rc__name span { display: block; }
.rc__side { padding: 29px 20px 0 0; text-align: right; }
.rc__side--panel {
  width: 154px;
  padding: 22px 20px 0 0;
  background: var(--grey-50);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.rc__side--nofrom { justify-content: center; padding-top: 0; }
.rc__from { display: block; font-size: 26px; line-height: 1; color: #000; }
.rc__tickets {
  margin-top: 15px;
  margin-right: 4px;
  width: 105px;
  height: 40px;
  font-size: 14px;
  letter-spacing: 0.02em;
}
.rc__side--nofrom .rc__tickets { margin-top: 0; }

/* expanded inventory */
.rc--open .rc__head { min-height: 0; }
.rc--open .rc__id { padding-bottom: 0; }
.rc__days { padding: 34px 48px 48px 24px; }
.day + .day { margin-top: 48px; }
.day__head { display: flex; align-items: center; justify-content: space-between; }
.day__head h4 { font-size: 18px; font-weight: 700; text-transform: uppercase; color: #000; letter-spacing: 0.005em; }
.day__types {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--grey-400);
  font-size: 14.8px;
  font-weight: 700;
  text-transform: uppercase;
}
.rows { margin-top: 47.5px; }
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 89px;
  padding: 14px 0 16px;
  border-bottom: 1.5px solid #e5e5e5;
}
.row__time { color: var(--grey-500); font-size: 14px; line-height: 1.25; }
.row__name { color: #000; font-size: 18px; font-weight: 700; text-transform: uppercase; line-height: 1.1; margin-top: 1px; }
.row__left { color: var(--purple-stock); font-size: 12px; font-weight: 500; line-height: 1.2; margin-top: -1px; }
.row__price { width: 99px; height: 40px; font-size: 12.8px; }
.row__price--addon { width: 94px; }

.qty { position: relative; display: block; }
.qty select {
  appearance: none;
  width: 88px;
  height: 42px;
  margin-right: 1px;
  padding: 0 0 0 17px;
  border: 0;
  border-radius: 21px;
  background: #f2f2f2;
  color: #000;
  font-size: 14.5px;
  font-weight: 700;
  cursor: pointer;
}
.qty::after {
  content: '';
  position: absolute;
  right: 20px;
  top: 18px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5.5px solid #000;
  pointer-events: none;
}

.addons__title { margin-top: 47px; font-size: 18px; font-weight: 700; text-transform: uppercase; color: #000; }
.rows--addons { margin-top: 28.5px; }
.row--addon { min-height: 82px; }
.row__addon { font-size: 18px; font-weight: 700; color: #000; }
</style>
