<script setup>
// Hotel order summary — the library's CartReview in "reserve" mode, exactly as
// the Checkout Experience Expanded / Book Reservation story renders it (photo,
// stay dates, room, price details with Due Today + Balance Due), fed from the
// priced quote the hotel finder produced.
import { computed } from 'vue'
import CartReview from '@lib/components/CartReview.vue'
import { HOTELS, NIGHTS } from './hotels.js'

const props = defineProps({ quote: { type: Object, required: true } })

const ICON = {
  'Free breakfast': 'free_breakfast', 'Free parking': 'local_parking', 'Free shuttle': 'airport_shuttle', Pool: 'pool',
  'Rooftop pool': 'pool', Gym: 'fitness_center', Laundry: 'local_laundry_service', Restaurant: 'restaurant', Spa: 'spa',
  'Pet friendly': 'pets', 'Riverwalk access': 'directions_walk', 'Rooftop bar': 'local_bar', Bar: 'local_bar',
  Kitchenette: 'kitchen', Golf: 'golf_course', 'Family rooms': 'family_restroom', 'River access': 'kayaking', Historic: 'account_balance',
}

const cart = computed(() => {
  const q = props.quote
  const h = HOTELS.find((x) => x.id === q.hotelId) || {}
  // quotes saved before these fields existed — fall back to the default stay
  const nightDates = q.nightDates || NIGHTS.filter((n) => n.key === 'fri' || n.key === 'sat').map((n) => n.full)
  const checkIn = q.checkIn || nightDates[0]
  const checkOut = q.checkOut || 'Sun, 11/22/2026'
  const queen = q.roomType !== 'king'
  return {
    hotel: { name: q.name, address: h.city ? `${h.city} · ${h.miles} mi from Sandy Oaks Ranch` : q.city },
    imageCategories: ['exterior', 'rooms', 'lobby', 'pool', 'dining'],
    seed: q.seed ?? h.seed ?? 0,
    checkIn: { date: checkIn, time: '3:00pm' },
    checkOut: { date: checkOut, time: '11:00am' },
    nights: q.nights,
    highlights: (q.tags || h.tags || []).slice(0, 4).map((t) => ({ icon: ICON[t] || 'check_circle', label: t })),
    roomType: queen ? 'Standard Double Queen' : 'Standard King',
    bedConfig: queen ? '2 Queen Beds' : '1 King Bed',
    sleeps: queen ? 4 : 2,
    amenities: [{ icon: 'wifi', label: 'Free WiFi' }],
    priceDetails: {
      nights: q.nights,
      rooms: q.rooms,
      rate: q.nightly,
      subtotal: q.subtotal,
      taxes: q.taxes,
      total: q.total,
      lines: [
        { label: 'Check In', value: checkIn, text: true },
        { label: 'Check Out', value: checkOut, text: true },
        ...nightDates.map((d) => ({ label: q.rooms > 1 ? `${d} · ${q.rooms} rooms` : d, value: q.nightly * q.rooms })),
        { label: 'Taxes & Fees', value: q.taxes },
      ],
      subtotals: [
        { label: 'Room Cost', value: q.total },
        { label: 'Due Today', value: q.dueToday },
      ],
      balanceDue: q.dueAtHotel,
    },
    roomsLeft: q.roomsLeft ?? h.left?.sat ?? null,
  }
})
</script>

<template>
  <cart-review mode="reserve" :cart="cart" readonly cards :show-requests="false" />
</template>
