<script setup>
// Hotel order summary — the library's CartReview in "reserve" mode, exactly as
// the Checkout Experience Expanded / Book Reservation story renders it (photo,
// stay dates, room, price details with Due Today + Balance Due), fed from the
// priced quote the hotel finder produced.
import { computed } from 'vue'
import CartReview from '@lib/components/CartReview.vue'
import { cartFromQuote } from './cart.js'

const props = defineProps({ quote: { type: Object, required: true } })

const cart = computed(() => cartFromQuote(props.quote))
</script>

<template>
  <cart-review mode="reserve" :cart="cart" readonly cards :show-requests="false" />
</template>
