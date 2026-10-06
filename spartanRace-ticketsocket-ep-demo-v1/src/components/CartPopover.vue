<script setup>
import { state, cartLines, removeLine, setTicketQty, setDayAddonQty, go, ensureOrder } from '../store.js'
import { asset } from '../data.js'

const close = () => (state.cartOpen = false)
const commit = () => {
  ensureOrder()
  state.cartOpen = false
  go(state.signedIn ? 'details' : 'login')
}
const setQty = (line, q) => (line.kind === 'ticket' ? setTicketQty(line.id, q) : setDayAddonQty(line.id, q))
</script>

<template>
  <div class="pop" role="dialog" aria-label="Ticket cart">
    <span class="pop__notch" aria-hidden="true" />
    <div class="pop__head">
      <h2>Ticket cart</h2>
      <button class="pop__close" aria-label="Close cart" @click="close">
        <svg viewBox="0 0 24 24" width="22" height="22"><path d="M5 5l14 14M19 5 5 19" stroke="#000" stroke-width="2.4" stroke-linecap="round" /></svg>
      </button>
    </div>
    <div class="pop__body">
      <p v-if="!cartLines.length" class="pop__empty">Your cart is empty.</p>
      <div v-for="line in cartLines" :key="line.id" class="line">
        <p class="line__group">{{ line.group }}</p>
        <div class="line__row">
          <p class="line__label">{{ line.label }}</p>
          <button class="line__trash" aria-label="Remove" @click="removeLine(line)">
            <img :src="asset('icons/trash.svg')" alt="" />
          </button>
          <select class="line__qty" :value="line.qty" :aria-label="`Quantity for ${line.label}`" @change="setQty(line, +$event.target.value)">
            <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>
      </div>
    </div>
    <button class="pop__commit" :disabled="!cartLines.length" @click="commit">Commit now</button>
  </div>
</template>

<style scoped>
.pop {
  position: absolute;
  top: calc(100% + 28px);
  left: -155px;
  width: 340px;
  background: #fff;
  color: #000;
  border-radius: 4px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.18);
  z-index: 60;
}
.pop__notch {
  position: absolute;
  top: -9px;
  left: 162px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #fff;
}
.pop__head {
  height: 66px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 22px 0 24px;
  border-bottom: 1.5px solid #e0e0e0;
}
.pop__head h2 { font-size: 14.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.005em; }
.pop__close { line-height: 0; }
.pop__body { min-height: 256px; padding: 23px 22px 20px; }
.pop__empty { color: #999; font-size: 14px; }
.line + .line { margin-top: 18px; }
.line__group {
  color: #bbb;
  font-size: 9.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  line-height: 1.25;
  padding-right: 90px;
}
.line__row { display: flex; align-items: flex-start; margin-top: 8px; }
.line__label { flex: 1; font-size: 14px; font-weight: 600; line-height: 1.22; padding-right: 8px; }
.line__trash { margin-top: -6px; line-height: 0; padding: 2px; }
.line__trash img { width: 10px; height: 12px; }
.line__qty {
  appearance: none;
  border: 0;
  background: none;
  width: 34px;
  margin-top: -9px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  text-align-last: center;
  cursor: pointer;
}
.pop__commit {
  display: block;
  width: 100%;
  height: 56px;
  background: var(--red-checkout);
  color: #fff;
  font-size: 15.5px;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 0 0 4px 4px;
}
.pop__commit:disabled { opacity: 0.5; cursor: not-allowed; }
.pop__commit:not(:disabled):hover { filter: brightness(0.92); }
</style>
