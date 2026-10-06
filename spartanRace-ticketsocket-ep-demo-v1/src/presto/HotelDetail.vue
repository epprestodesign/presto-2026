<script setup>
// Hotel details — the library's HotelDetailPage (Hotel Details / Book Reservation
// in Storybook) for one of the race-weekend hotels: gallery, summary, about,
// rooms carousel (RoomCardReserve), amenities, policies. Opened from a hotel's
// name in the results or from its map popup.
//
// RoomsCarousel doesn't re-emit RoomCardReserve's "reserve" event, so the
// "Reserve Room" clicks are picked up here by delegation (no library changes).
import { computed } from 'vue'
import HotelDetailPage from '@lib/components/details/HotelDetailPage.vue'
import { AMENITIES, amenityGroups } from '@lib/lib/amenities.js'
import { ROOM_TYPES, STAYS, NIGHTS, TAX_RATE } from './hotels.js'

const props = defineProps({
  hotel: { type: Object, required: true },
  stay: { type: String, default: 'fri-sun' },
  rooms: { type: Number, default: 1 },
})
const emit = defineEmits(['back', 'reserve'])

const stayObj = computed(() => STAYS.find((s) => s.id === props.stay) || STAYS[0])
const nightsFor = (rt) =>
  stayObj.value.nights.map((k) => ({
    date: NIGHTS.find((n) => n.key === k).full,
    roomsLeft: Math.max(0, props.hotel.left[k] - (rt === 'king' ? 3 : 0)),
  }))

const FEATURES = [
  { label: 'Entertainment', value: '50" Smart TV, premium channels' },
  { label: 'Food & Drink', value: 'Coffee maker, mini fridge, microwave' },
  { label: 'Bathroom', value: 'Shower/tub combo, toiletries, hair dryer' },
  { label: 'Race weekend', value: 'Early breakfast from 5:00 AM on race days' },
  { label: 'Non-smoking', value: 'Yes' },
]

const roomCards = computed(() =>
  ROOM_TYPES.map((r, i) => {
    const nights = nightsFor(r.id)
    const minLeft = Math.min(...nights.map((n) => n.roomsLeft))
    const nightly = props.hotel.rates[r.id]
    return {
      id: r.id,
      roomType: r.id === 'queen' ? 'Standard Double Queen' : 'Standard King',
      bedConfig: r.id === 'queen' ? '2 Queen Beds' : '1 King Bed',
      maxOccupancy: r.id === 'queen' ? 4 : 2,
      imageCategories: ['rooms'],
      seed: props.hotel.seed + i,
      features: FEATURES,
      pricePerNight: nightly,
      total: Math.round(nightly * (1 + TAX_RATE) * nights.length * props.rooms * 100) / 100,
      roomCount: props.rooms,
      availability: minLeft <= 0 ? 'soldout' : minLeft <= 3 ? 'limited' : 'available',
      nights,
    }
  }),
)

const amenityItems = computed(() => {
  const want = new Set([...props.hotel.amenities, 'Free WiFi'])
  return AMENITIES.filter((a) => want.has(a.label))
})

const score = computed(() => Math.min(4.9, 3.4 + props.hotel.stars * 0.3 + (props.hotel.seed % 3) * 0.1))
const ratingLabel = computed(() => (score.value >= 4.5 ? 'Excellent' : score.value >= 4 ? 'Very good' : 'Good'))

const detail = computed(() => {
  const h = props.hotel
  return {
    name: h.name,
    stars: h.stars,
    address: `${h.city} · ${h.airportMiles} mi from San Antonio International (SAT)`,
    distance: `${h.miles} mi from Sandy Oaks Ranch (race venue)`,
    score: Math.round(score.value * 10) / 10,
    reviews: 180 + h.seed * 73,
    ratingLabel: ratingLabel.value,
    preferred: h.id === 'hill-country-lodge',
    lowRateGuarantee: true,
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    popularAmenities: amenityItems.value,
    lat: h.lat,
    lng: h.lng,
    galleryCategories: ['exterior', 'rooms', 'lobby', 'pool', 'dining', 'suites', 'bathroom'],
    seed: h.seed,
    rooms: roomCards.value,
    roomsFlow: 'reserve',
    roomsTitle: 'Select Your Room',
    roomsSubtitle: `${stayObj.value.label} · prices are per room per night; totals include taxes & fees.`,
    about: [
      `${h.name} is ${h.miles} miles from Sandy Oaks Ranch — ${h.shuttle ? 'with a free shuttle to the venue on race mornings' : 'an easy drive to the venue on race mornings'}. Rooms held for Spartan racers are released on Nov 13, so book early for the best rates.`,
      `Expect clean, quiet rooms built for an early start: blackout curtains, a mini fridge for recovery drinks, and ${h.tags.slice(0, 2).join(' and ').toLowerCase()}. ${h.city} puts you ${h.airportMiles} miles from San Antonio International Airport.`,
    ],
    amenityGroups: amenityGroups(amenityItems.value.map((a) => a.key)),
    policies: [
      { title: 'Check-in', body: 'Check-in from 3:00 PM. Photo ID and the card used for booking are required at check-in.' },
      { title: 'Check-out', body: 'Check-out before 11:00 AM. Late check-out on Sunday may be available for racers on request.' },
      { title: 'Cancellation', body: 'Free cancellation until Nov 13, 2026. After that, the first night plus taxes is non-refundable.' },
      { title: 'Payment', body: 'Pay the first night today and the balance at the hotel, or pay the full stay today — your choice at checkout.' },
      { title: 'Pets', body: h.tags.includes('Pet friendly') ? 'Pets welcome for a $40 per-stay fee.' : 'Only service animals are permitted.' },
    ],
  }
})

function onClick (e) {
  const cta = e.target.closest('.rcr__cta')
  if (!cta) return
  const all = [...e.currentTarget.querySelectorAll('.rcr__cta')]
  const room = roomCards.value[all.indexOf(cta)]
  if (room && room.availability !== 'soldout') emit('reserve', { hotelId: props.hotel.id, roomType: room.id })
}
</script>

<template>
  <div class="hd" @click="onClick">
    <hotel-detail-page v-bind="detail" @back="emit('back')" />
  </div>
</template>

<style scoped>
.hd { background: var(--ds-color-surface); }
</style>
