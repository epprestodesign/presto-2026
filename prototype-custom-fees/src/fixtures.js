// Coherent mock data for the prototype. Everything except each hotel's
// name / city / address is canned; screens key their content off a chosen
// hotel `{ name, city }` (single) or `hotels: [{ name, city }]` (multiple).
//
// The real library components consume these field names verbatim — do NOT
// rename anything below. Amenities come from the canonical catalog so the
// detail page's "popular" row and grouped Amenities section stay in sync.
import { popularAmenities, amenityGroups, getAmenities } from '@lib/lib/amenities.js'
import { feePolicyItems } from '@lib/lib/secondaryFees.js'

// ── Shared trip constants (a consistent 3-night stay) ──────────────────────
export const EVENT = { name: 'Summer Soccer Classic 2027', dates: 'Wed, 6/16/2027 - Sat, 6/19/2027' }

// Detail-page night labels (verbose).
const DETAIL_NIGHTS = ['Wed, 6/16/2027', 'Thu, 6/17/2027', 'Fri, 6/18/2027']
// Checkout night labels (short).
const SHORT_NIGHTS = ['Wed, Jun 16', 'Thu, Jun 17', 'Fri, Jun 18']
// Confirmation night labels (dated).
const CONF_NIGHTS = ['Wed, 06/16/2027', 'Thu, 06/17/2027', 'Fri, 06/18/2027']

const addressFor = (city) => `123 Main St, ${city}`

// ── Secondary custom fees (DES-451…456) ────────────────────────────────────
// Up to three fees an organizer configures at the event or event hotel level.
// This prototype is the Custom Fees Request canvas, so every flow carries the
// full set of three — the case the design request is really about.
// Shape and the three-fee cap live in @lib/lib/secondaryFees.js.
const NIGHTS_COUNT = DETAIL_NIGHTS.length // 3-night stay throughout

export const SECONDARY_FEES = [
  {
    name: 'Resort Fee',
    basis: 'night',
    amount: 5,
    total: 5 * NIGHTS_COUNT,
    description: 'Covers pool and fitness centre access, in-room WiFi, and daily housekeeping. Charged per room, per night, and collected at the time of booking.',
  },
  {
    name: 'Event Parking',
    basis: 'reservation',
    amount: 15,
    total: 15,
    description: 'One tournament parking permit per reservation, valid for the length of your stay. Oversized vehicles should contact the front desk.',
  },
  {
    name: 'Facility Fee',
    basis: 'night',
    amount: 2,
    total: 2 * NIGHTS_COUNT,
    description: 'Supports the venue shuttle and on-site event staffing. Charged per room, per night.',
  },
]

// $38 on the standard 3-night stay. Charged at booking → rolls into Due Today.
export const SECONDARY_FEES_TOTAL = SECONDARY_FEES.reduce((sum, f) => sum + f.total, 0)

// ── Detail-page rooms ──────────────────────────────────────────────────────
// Reserve rooms: per-night roomsLeft only; price is a flat pricePerNight/total.
const reserveNights = (a, b, c) => [
  { date: DETAIL_NIGHTS[0], roomsLeft: a },
  { date: DETAIL_NIGHTS[1], roomsLeft: b },
  { date: DETAIL_NIGHTS[2], roomsLeft: c },
]

const RESERVE_ROOMS = [
  { roomType: 'Urban King', bedConfig: '1 King Bed', maxOccupancy: 2, pricePerNight: 179, total: 537, roomCount: 1, availability: 'available', nights: reserveNights(6, 5, 4) },
  { roomType: 'Double Queen', bedConfig: '2 Queen Beds', maxOccupancy: 4, pricePerNight: 209, total: 627, roomCount: 1, availability: 'limited', nights: reserveNights(2, 1, 2) },
  { roomType: 'Two-Room Suite King', bedConfig: '1 King Bed · Sofa Bed', maxOccupancy: 4, pricePerNight: 269, total: 807, roomCount: 1, availability: 'available', nights: reserveNights(5, 4, 3) },
  { roomType: 'Deluxe King', bedConfig: '1 King Bed', maxOccupancy: 2, pricePerNight: 229, total: 687, roomCount: 1, availability: 'available', nights: reserveNights(4, 4, 3) },
  { roomType: 'Accessible King', bedConfig: '1 King Bed · Roll-in Shower', maxOccupancy: 2, pricePerNight: 189, total: 567, roomCount: 1, availability: 'soldout', nights: reserveNights(0, 0, 0) },
]

// Group rooms: per-night roomsLeft AND price (flat price each night here).
const groupNights = (price, a, b, c) => [
  { date: DETAIL_NIGHTS[0], roomsLeft: a, price },
  { date: DETAIL_NIGHTS[1], roomsLeft: b, price },
  { date: DETAIL_NIGHTS[2], roomsLeft: c, price },
]

const GROUP_ROOMS = [
  { roomType: 'Urban King', bedConfig: '1 King Bed', maxOccupancy: 2, availability: 'available', nights: groupNights(179, 8, 8, 6) },
  { roomType: 'Double Queen', bedConfig: '2 Queen Beds', maxOccupancy: 4, availability: 'limited', nights: groupNights(209, 3, 2, 2) },
  { roomType: 'Two-Room Suite King', bedConfig: '1 King Bed · Sofa Bed', maxOccupancy: 4, availability: 'available', nights: groupNights(269, 6, 6, 5) },
  { roomType: 'Deluxe King', bedConfig: '1 King Bed', maxOccupancy: 2, availability: 'available', nights: groupNights(229, 5, 5, 4) },
  { roomType: 'Accessible King', bedConfig: '1 King Bed · Roll-in Shower', maxOccupancy: 2, availability: 'soldout', nights: groupNights(189, 0, 0, 0) },
]

const aboutFor = (hotel) => [
  `${hotel.name} sits in the heart of ${hotel.city}, a short walk from Main Arena and the Summer Soccer Classic venues. Teams, families, and fans settle in quickly thanks to a welcoming lobby, quick check-in, and staff who know exactly where the fields are.`,
  `Rooms are bright and generously sized, with plush bedding, blackout curtains for early risers and late games, and a work-and-lounge nook that doubles as a spot to lay out gear. Reliable free WiFi keeps everyone connected between matches.`,
  `On-site you'll find a heated pool, a 24-hour fitness center, and a casual restaurant serving breakfast through late dinner — convenient for teams keeping to a tournament schedule. A grab-and-go market handles game-day snacks and water.`,
  `With free parking, easy access to the arena, and a dedicated group-booking desk, ${hotel.name} is built for tournament weekends in ${hotel.city}.`,
]

const policiesFor = (hotel) => [
  { title: 'Check-in', body: 'Check-in from 3:00 PM. Guests must be 18 or older with a valid photo ID and a credit card at check-in. Early check-in is subject to availability.' },
  { title: 'Check-out', body: 'Check-out by 11:00 AM. Late check-out may be available for a fee — please ask the front desk the night before departure.' },
  { title: 'Cancellation Policy', body: 'Free cancellation up to 72 hours before arrival. Cancellations within 72 hours are charged one night plus tax. No-shows are charged the full stay.' },
  { title: 'Deposit', body: 'A credit-card authorization of one night plus tax is held at check-in for incidentals and released at check-out. Some charges may take several business days to clear.' },
  { title: 'Pets', body: `Pet-friendly rooms are available at ${hotel.name} for a nightly fee, limit two pets per room. Service animals are always welcome at no charge.` },
  // DES-453: each secondary custom fee's description, so the terms behind the
  // Price Details rows are readable on the page itself.
  ...feePolicyItems(SECONDARY_FEES),
]

// ── 1. HotelDetailPage props ───────────────────────────────────────────────
const ratingLabelFor = (r) => (r >= 4.6 ? 'Exceptional' : r >= 4.3 ? 'Excellent' : r >= 4.0 ? 'Very Good' : 'Good')

// Rescale the base room list to the specific hotel's price (keeps the availability
// variety — including the sold-out room — but reflects the chosen hotel's rate).
function roomsForHotel(hotel, flow) {
  if (flow === 'group') {
    const base = hotel.startingPrice ?? 199
    return GROUP_ROOMS.map((r, i) => ({
      ...r,
      // DES-90: per-night rates can differ across the stay (e.g. weekend uplift).
      nights: r.nights.map((n, ni) => ({ ...n, price: base + i * 30 + ni * 10 })),
    }))
  }
  const base = hotel.fromNightly ?? 179
  return RESERVE_ROOMS.map((r, i) => ({
    ...r,
    pricePerNight: base + i * 30,
    total: (base + i * 30) * 3,
  }))
}

export function detailProps(hotel, flow) {
  const amenityKeys = hotel.amenities && hotel.amenities.length ? hotel.amenities : null
  return {
    name: hotel.name,
    stars: hotel.stars ?? 4,
    address: `123 Main St, ${hotel.city}`,
    distance: hotel.distance ?? '0.3 mi from Main Arena',
    score: hotel.rating ?? 4.5,
    reviews: hotel.reviews ?? 1284,
    ratingLabel: ratingLabelFor(hotel.rating ?? 4.5),
    preferred: hotel.preferred ?? false,
    lowRateGuarantee: hotel.lowRateGuarantee ?? true,
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    popularAmenities: amenityKeys ? getAmenities(amenityKeys.slice(0, 6)) : popularAmenities(),
    lat: 28.5383,
    lng: -81.3792,
    galleryCategories: ['exterior', 'rooms', 'suites', 'pool', 'dining', 'bar', 'lobby', 'spa', 'bathroom'],
    seed: hotel.seed ?? 0,
    about: aboutFor(hotel),
    amenityGroups: amenityKeys ? amenityGroups(amenityKeys) : amenityGroups(),
    policies: policiesFor(hotel),
    // DES-453: surfaced in each room card's Price Details modal.
    secondaryFees: SECONDARY_FEES,
    rooms: roomsForHotel(hotel, flow),
    roomsFlow: flow,
    roomsTitle: flow === 'group' ? 'Hold Rooms for Your Group' : 'Select Your Room',
    roomsSubtitle: flow === 'group'
      ? 'Choose how many rooms to hold each night.'
      : 'Prices shown are per room per night for your selected dates.',
  }
}

// ── 2. CheckoutPage cart ───────────────────────────────────────────────────
export function cartFor(hotels, mode) {
  if (mode === 'reservation') {
    return {
      heldSeconds: 895,
      hotel: { name: hotels[0].name, address: addressFor(hotels[0].city) },
      imageCategories: ['suites', 'rooms', 'lobby', 'pool', 'dining'],
      seed: 1,
      checkIn: { date: '06/16/2027', time: '3:00pm' },
      checkOut: { date: '06/19/2027', time: '11:00am' },
      nights: 3,
      highlights: [
        { icon: 'kitchen', label: 'Kitchen' },
        { icon: 'ac_unit', label: 'Air conditioning' },
        { icon: 'wifi', label: 'Free WiFi' },
      ],
      roomType: 'Urban King',
      bedConfig: '1 King Bed',
      sleeps: 2,
      amenities: [{ icon: 'microwave', label: 'Microwave' }],
      // DES-85: itemized breakdown — `lines` enables CartReview's detailed layout.
      priceDetails: {
        nights: 3, rooms: 1, rate: 179, subtotal: 537, taxes: 64.44, propertyFee: 90, total: 691.44,
        lines: [
          { label: 'Check In', value: 'Wed, 6/16/2027', text: true },
          { label: 'Check Out', value: 'Sat, 6/19/2027', text: true },
          { label: 'Wed, 6/16/2027', value: 110 },
          { label: 'Thu, 6/17/2027', value: 115 },
          { label: 'Fri, 6/18/2027', value: 120 },
          { label: 'Booking Fee', value: 10 },
          { label: 'Taxes', value: 15 },
          { label: 'Guest Fees', value: 15 },
        ],
        // DES-456: the three secondary custom fees, replacing the single ad-hoc
        // "Secondary Fee" line. Charged at booking → inside Due Today
        // (115 room + 38 fees = 153); the room cost stays as Balance due.
        secondaryFees: SECONDARY_FEES,
        subtotals: [
          { label: 'Room Cost', value: 385 },
          { label: 'Due Today', value: 115 + SECONDARY_FEES_TOTAL },
        ],
        balanceDue: 270,
      },
      roomsLeft: 3,
    }
  }

  if (mode === 'reservations') {
    return {
      heldSeconds: 895,
      taxRate: 0.12,
      feePerNight: 0,
      // DES-456: multi-hotel carts have no single priceDetails, so the fees hang
      // off the cart and are totalled across the whole order.
      secondaryFees: SECONDARY_FEES,
      hotels: hotels.map((h, i) => ({
        name: h.name,
        imageCategories: ['suites', 'rooms'],
        seed: i,
        rooms: [
          {
            type: 'King Bedroom',
            summary: '1 King Bed · Sleeps 2',
            price: 179,
            adults: 2,
            children: 0,
            nights: [
              { date: SHORT_NIGHTS[0], price: 179 },
              { date: SHORT_NIGHTS[1], price: 179 },
              { date: SHORT_NIGHTS[2], price: 189 },
            ],
          },
        ],
      })),
    }
  }

  // mode === 'group' — use the rooms the user actually held (accumulated in the
  // cart entry); fall back to a sample only if none were captured.
  const fallback = [{
    type: 'Two-Room Suite King', summary: '1 King Bed · Sleeps 4', price: 269,
    nights: [
      { date: SHORT_NIGHTS[0], qty: 4, roomsLeft: 6 },
      { date: SHORT_NIGHTS[1], qty: 4, roomsLeft: 6 },
      { date: SHORT_NIGHTS[2], qty: 1, roomsLeft: 5 },
    ],
  }]
  return {
    heldSeconds: 895,
    // DES-456 (group block): held rooms aren't charged, so CartReview shows these
    // as an "Additional fees" note — names and terms, no amounts — since each
    // attendee pays them when they book into the block.
    secondaryFees: SECONDARY_FEES,
    hotels: hotels.map((h, i) => ({
      name: h.name,
      imageCategories: ['suites', 'rooms'],
      seed: i,
      rooms: (h.rooms && h.rooms.length)
        ? h.rooms.map((r) => ({
            type: r.type, summary: r.summary || '', price: r.price,
            nights: r.nights.map((n) => ({ date: n.date, qty: n.qty, roomsLeft: n.roomsLeft ?? 6, price: n.price ?? r.price })),
          }))
        : fallback,
    })),
  }
}

// ── 3. CheckoutPage summary ────────────────────────────────────────────────
export function summaryFor(hotels, mode) {
  if (mode === 'reservation') {
    return {
      image: '',
      title: hotels[0].name,
      subtitle: `${hotels[0].city} · Sleeps 2`,
      rating: '4.8',
      cancellation: 'Free cancellation before Jun 13, 2027.',
      rrow1: '1 room · 3 nights',
      rows: [
        { label: 'Dates', value: 'Jun 16 – 19, 2027', change: true },
        { label: 'Guests', value: '2 adults', change: true },
      ],
      priceLines: [
        { label: '3 nights × $179', value: 537 },
        { label: 'Taxes', value: 64.44 },
        { label: 'Property fee', value: 90 },
      ],
      // DES-456: named fee rows below the price lines; the total includes them.
      secondaryFees: SECONDARY_FEES,
      nights: 3,
      rooms: 1,
      total: 691.44 + SECONDARY_FEES_TOTAL,
      note: 'Rare find! This room is usually booked',
    }
  }

  const names = hotels.map((h) => h.name).join(', ')

  if (mode === 'reservations') {
    // One King Bedroom per hotel: 3 nights at 179/179/189 = 547 each.
    const perHotel = 547
    const roomCharges = perHotel * hotels.length
    const taxes = Math.round(roomCharges * 0.12 * 100) / 100
    const total = Math.round((roomCharges + taxes) * 100) / 100
    return {
      image: '',
      title: 'Multiple reservations',
      subtitle: names,
      rating: '4.8',
      cancellation: 'Free cancellation before Jun 13, 2027.',
      rrow1: `${hotels.length} rooms · ${hotels.length} hotels`,
      rows: [
        { label: 'Dates', value: 'Jun 16 – 19, 2027', change: true },
        { label: 'Rooms', value: `${hotels.length} rooms`, change: true },
      ],
      priceLines: [
        { label: 'Room charges', value: roomCharges },
        { label: 'Taxes', value: taxes },
      ],
      secondaryFees: SECONDARY_FEES,
      nights: 3,
      rooms: hotels.length,
      total: total + SECONDARY_FEES_TOTAL,
      note: 'Rooms held — finish before the timer ends',
    }
  }

  // mode === 'group' — held block, no pricing shown. Count the rooms actually held.
  const totalRooms = hotels.reduce((s, h) =>
    s + (h.rooms || []).reduce((a, r) => a + r.nights.reduce((x, n) => x + (n.qty || 0), 0), 0), 0) || hotels.length
  return {
    image: '',
    title: 'Group hold',
    subtitle: names,
    rating: '4.8',
    cancellation: 'Free cancellation before Jun 13, 2027.',
    rrow1: `${totalRooms} rooms · ${hotels.length} hotels`,
    rows: [
      { label: 'Dates', value: 'Jun 16 – 19, 2027', change: true },
      { label: 'Rooms', value: `${totalRooms} rooms held`, change: true },
    ],
    note: 'Rooms held — finish before the timer ends',
  }
}

// ── 4. ConfirmationPage data ───────────────────────────────────────────────
// `totals` (DES-455) closes each reserved stay with taxes → the secondary custom
// fees → what was charged now vs. owed at the property. Group blocks are held,
// not charged, so `confirmationData('hold')` omits it and the block never renders.
const confTotals = (rooms) => {
  const roomCost = (rooms[0]?.nights || []).reduce((sum, n) => sum + n.price * (n.qty || 1), 0)
  return {
    taxes: 0,
    rooms: 1,
    secondaryFees: SECONDARY_FEES,
    roomCost,
    amountPaid: SECONDARY_FEES_TOTAL, // fees are collected at booking
    balanceDue: roomCost,             // the stay itself is settled at the property
  }
}

const confHotel = (h, i, rooms, withTotals = false) => ({
  name: h.name,
  stars: 4,
  address: `123 Main St, ${h.city}`,
  seed: i,
  checkIn: 'Wed, 06/16/2027 03:00 PM',
  checkOut: 'Sat, 06/19/2027 11:00 AM',
  rooms,
  ...(withTotals ? { totals: confTotals(rooms) } : {}),
})

const reserveRoomBlock = () => [
  {
    type: 'Urban King · 1 King Bed',
    note: 'Sleeps 2',
    nights: [
      { date: CONF_NIGHTS[0], qty: 1, price: 179 },
      { date: CONF_NIGHTS[1], qty: 1, price: 179 },
      { date: CONF_NIGHTS[2], qty: 1, price: 189 },
    ],
  },
]

const holdRoomBlock = () => [
  {
    type: 'Two-Room Suite King · 1 King Bed',
    note: 'Sleeps 4',
    nights: [
      { date: CONF_NIGHTS[0], qty: 4, price: 269 },
      { date: CONF_NIGHTS[1], qty: 4, price: 269 },
      { date: CONF_NIGHTS[2], qty: 4, price: 269 },
    ],
  },
]

// Each fee's custom description also lands in the policies list — where the live
// booking site surfaces it today (DES-455).
const confPolicies = (h, group) => ({
  hotel: h.name,
  items: [...(group
    ? [
        { title: 'Group Cancellation Policy', body: 'Held rooms not claimed by the release date are returned to inventory automatically. Individual guests may cancel free up to 72 hours before arrival.' },
        { title: 'Cancellation Policy', body: 'Cancellations within 72 hours of arrival are charged one night plus tax per room. No-shows are charged the full stay.' },
        { title: 'Amenities Notice', body: 'Free WiFi, pool, and fitness center are included. Parking is complimentary; valet and pet fees apply where noted.' },
      ]
    : [
        { title: 'Cancellation Policy', body: 'Free cancellation up to 72 hours before arrival. Within 72 hours you are charged one night plus tax; no-shows are charged the full stay.' },
        { title: 'Amenities Notice', body: 'Free WiFi, pool, and fitness center are included. Parking is complimentary; valet and pet fees apply where noted.' },
      ]), ...feePolicyItems(SECONDARY_FEES)],
})

export function confirmationData(hotels, mode) {
  if (mode === 'reserve') {
    const h = hotels[0]
    return {
      contactName: 'Alex Smith',
      confirmationId: '72055771948934',
      reservedOn: 'Mon, 06/14/2027 02:14 PM EST',
      guest: 'Alex Smith — (555) 018-2245',
      email: 'youraccount@eventpipe.com',
      hotels: [confHotel(h, 0, reserveRoomBlock(), true)],
      policies: [confPolicies(h, false)],
    }
  }

  if (mode === 'reservations') {
    return {
      contactName: 'Alex Smith',
      confirmationId: '72055771948934',
      reservedOn: 'Mon, 06/14/2027 02:14 PM EST',
      guest: 'Alex Smith — (555) 018-2245',
      email: 'youraccount@eventpipe.com',
      hotels: hotels.map((h, i) => confHotel(h, i, reserveRoomBlock(), true)),
      policies: hotels.map((h) => confPolicies(h, false)),
    }
  }

  // mode === 'hold' — group block. Use the rooms the user actually held.
  const realHoldRooms = (h) => (h.rooms && h.rooms.length)
    ? h.rooms.map((r) => ({ type: r.type, note: r.summary || '', nights: r.nights.map((n) => ({ date: n.date, qty: n.qty, price: r.price })) }))
    : holdRoomBlock()
  return {
    contactName: 'Coach Lee',
    groupId: 'G-00584977',
    reservedOn: 'Thu, 06/11/2027 03:31 PM EST',
    releaseDate: 'Thu, 06/18/2027 11:59 PM PT',
    organizationName: 'Eagles SC',
    groupContact: 'Coach Lee — (518) 796-3050',
    email: 'youraccount@eventpipe.com',
    hotels: hotels.map((h, i) => confHotel(h, i, realHoldRooms(h))),
    policies: hotels.map((h) => confPolicies(h, true)),
  }
}
