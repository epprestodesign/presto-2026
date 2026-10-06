// Build the library CartReview / CheckoutPageExpanded "reserve" cart from a
// priced hotel quote (see quote() in hotels.js). Shared by the hotel order
// summary, the separate-page hotel checkout (concepts E/F) and the summary rail.
import { HOTELS, NIGHTS } from './hotels.js'

const ICON = {
  'Free breakfast': 'free_breakfast', 'Free parking': 'local_parking', 'Free shuttle': 'airport_shuttle', Pool: 'pool',
  'Rooftop pool': 'pool', Gym: 'fitness_center', Laundry: 'local_laundry_service', Restaurant: 'restaurant', Spa: 'spa',
  'Pet friendly': 'pets', 'Riverwalk access': 'directions_walk', 'Rooftop bar': 'local_bar', Bar: 'local_bar',
  Kitchenette: 'kitchen', Golf: 'golf_course', 'Family rooms': 'family_restroom', 'River access': 'kayaking', Historic: 'account_balance',
}

export function cartFromQuote (q) {
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
}

/** CheckoutPageExpanded `summary` (rail header) for a quote. */
export function summaryFromQuote (q) {
  return { title: q.name, subtitle: `${q.roomLabel} · Sleeps ${q.roomType === 'king' ? 2 : 4}`, rating: String(q.stars), rrow1: `${q.rooms} ${q.rooms === 1 ? 'room' : 'rooms'} · ${q.nights} ${q.nights === 1 ? 'night' : 'nights'}`, total: q.total }
}
