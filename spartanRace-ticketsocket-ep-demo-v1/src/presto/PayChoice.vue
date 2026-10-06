<script setup>
// "How to pay for the room" — first night now vs. pay in full (from the sketch).
// Shared by the inline finder (Version A) and the modal's review step (Version B).
import { computed } from 'vue'
import { quote, money } from './hotels.js'

const props = defineProps({
  hotel: { type: Object, required: true }, // HOTELS entry
  opts: { type: Object, required: true }, // { roomType, rooms, stay }
  modelValue: { type: String, default: 'first' }, // first | full
  label: { type: String, default: 'How to pay for the room' },
  stacked: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])
const first = computed(() => quote(props.hotel, { ...props.opts, payOption: 'first' }))
const full = computed(() => quote(props.hotel, { ...props.opts, payOption: 'full' }))
</script>

<template>
  <div class="pay">
    <p class="pay__label">{{ label }}</p>
    <div class="pay__opts" :class="{ 'pay__opts--stacked': stacked }" role="radiogroup" :aria-label="label">
      <button type="button" role="radio" class="pay__opt" :class="{ 'is-on': modelValue === 'first' }" :aria-checked="modelValue === 'first'" @click="emit('update:modelValue', 'first')">
        <span class="pay__name">First night now</span>
        <span class="pay__desc">Pay the balance at the hotel</span>
        <span class="pay__amt">{{ money(first.dueToday) }} today</span>
        <span v-if="stacked" class="pay__later">{{ money(first.dueAtHotel) }} due at check-in</span>
      </button>
      <button type="button" role="radio" class="pay__opt" :class="{ 'is-on': modelValue === 'full' }" :aria-checked="modelValue === 'full'" @click="emit('update:modelValue', 'full')">
        <span class="pay__name">Pay in full now</span>
        <span class="pay__desc">Nothing due at check-in</span>
        <span class="pay__amt">{{ money(full.dueToday) }} today</span>
      </button>
    </div>
    <p v-if="hotel.shuttle" class="pay__shuttle"><q-icon name="airport_shuttle" size="18px" /> Includes a free shuttle to Sandy Oaks Ranch on race mornings.</p>
  </div>
</template>

<style scoped>
.pay__label { margin: 0 0 8px; font-size: 0.8125rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ds-color-text-subtle); }
.pay__opts { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.pay__opts--stacked { grid-template-columns: 1fr; }
.pay__opt { display: grid; gap: 2px; padding: 12px 14px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md); background: var(--ds-color-surface); font: inherit; text-align: left; cursor: pointer; }
.pay__opt.is-on { border: 2px solid var(--ds-color-border-brand); padding: 11px 13px; background: var(--ds-color-background-selected); }
.pay__name { font-weight: 700; color: var(--ds-color-text); }
.pay__desc { font-size: 0.875rem; color: var(--ds-color-text-subtle); }
.pay__amt { margin-top: 6px; font-weight: 700; color: var(--ds-color-text-brand); }
.pay__later { font-size: 0.8125rem; color: var(--ds-color-text-subtle); }
.pay__shuttle { display: flex; align-items: center; gap: 6px; margin: 12px 0 0; font-size: 0.9375rem; color: var(--ds-color-text-success); }
@media (max-width: 600px) { .pay__opts { grid-template-columns: 1fr; } }
</style>
