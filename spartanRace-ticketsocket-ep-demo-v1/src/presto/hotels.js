// Hotel inventory for the San Antonio Trifecta weekend.
// Names, stars, distances, nightly rates and the "how to pay" math come from
// the Eventpipe checkout sketch; amenity labels use the Presto amenity catalog
// (src/lib/amenities.js) and room types use the FilterRail vocabulary so the
// library's own Filters sheet drives the results.

export const EVENT_LOCATION = { name: 'Sandy Oaks Ranch', lat: 29.1394, lng: -98.9047 }

export const TAX_RATE = 0.13 // $108 × 1.13 = $122.04 — the sketch's "first night" figure

export const NIGHTS = [
  { key: 'thu', label: 'Thu, 11/19', full: 'Thu, 11/19/2026' },
  { key: 'fri', label: 'Fri, 11/20', full: 'Fri, 11/20/2026' },
  { key: 'sat', label: 'Sat, 11/21', full: 'Sat, 11/21/2026' },
  { key: 'sun', label: 'Sun, 11/22', full: 'Sun, 11/22/2026' },
]
const NEXT_DAY = { thu: 'fri', fri: 'sat', sat: 'sun', sun: 'sun' }
const nightFull = (k) => NIGHTS.find((n) => n.key === k).full

export const STAYS = [
  { id: 'fri-sun', label: 'Fri Nov 20 → Sun Nov 22', short: 'Nov 20 – 22', nights: ['fri', 'sat'] },
  { id: 'sat-sun', label: 'Sat Nov 21 → Sun Nov 22', short: 'Nov 21 – 22', nights: ['sat'] },
  { id: 'fri-sat', label: 'Fri Nov 20 → Sat Nov 21', short: 'Nov 20 – 21', nights: ['fri'] },
  { id: 'thu-sun', label: 'Thu Nov 19 → Sun Nov 22', short: 'Nov 19 – 22', nights: ['thu', 'fri', 'sat'] },
]

export const ROOM_TYPES = [
  { id: 'queen', label: '2 Queen beds', filter: 'Queen' },
  { id: 'king', label: '1 King bed', filter: 'King' },
]

export const HOTELS = [
  {
    id: 'sandy-oaks-inn',
    name: 'Sandy Oaks Inn & Suites',
    city: 'Devine, TX',
    stars: 2,
    miles: 6,
    airportMiles: 38,
    lat: 29.226, lng: -98.889,
    seed: 0,
    amenities: ['Free Breakfast', 'Free Parking', 'Swimming Pool', 'Pet Friendly'],
    tags: ['Free breakfast', 'Free parking', 'Pool', 'Pet friendly'],
    rates: { queen: 168, king: 158 },
    left: { thu: 6, fri: 9, sat: 7, sun: 11 },
  },
  {
    id: 'hill-country-lodge',
    name: 'Hill Country Lodge South',
    city: 'San Antonio, TX',
    stars: 3,
    miles: 32,
    airportMiles: 14,
    lat: 29.338, lng: -98.552,
    seed: 1,
    shuttle: true,
    amenities: ['Free Airport Shuttle', 'Free Breakfast', 'Fitness Center', 'Laundry'],
    tags: ['Free shuttle', 'Free breakfast', 'Gym', 'Laundry'],
    rates: { queen: 108, king: 98 },
    left: { thu: 12, fri: 8, sat: 5, sun: 14 },
  },
  {
    id: 'alamo-ridge',
    name: 'Alamo Ridge Hotel',
    city: 'San Antonio, TX',
    stars: 4,
    miles: 41,
    airportMiles: 8,
    lat: 29.425, lng: -98.489,
    seed: 2,
    shuttle: true,
    amenities: ['Free Airport Shuttle', 'Restaurant On-Site', 'Rooftop Bar / Lounge', 'Swimming Pool'],
    tags: ['Free shuttle', 'Riverwalk access', 'Restaurant', 'Rooftop pool'],
    rates: { queen: 152, king: 162 },
    left: { thu: 5, fri: 6, sat: 2, sun: 4 },
  },
]


// ── More inventory for pagination (5 pages × 4) ──
// The sketch's three hotels stay first when sorted by distance; the rest are
// plausible San Antonio-area properties farther from the ranch.
const MORE = [
  // name, city, stars, miles, airport, queen, king, tags, lat, lng
  ['Lytle Creek Lodge', 'Lytle, TX', 2, 42, 30, 94, 89, ['Free parking', 'Free breakfast'], 29.233, -98.796],
  ['Mission Trail Inn', 'San Antonio, TX', 3, 43, 12, 126, 118, ['Free shuttle', 'Pool', 'Gym'], 29.33, -98.47],
  ['Riverwalk Plaza Suites', 'San Antonio, TX', 4, 44, 8, 189, 179, ['Riverwalk access', 'Restaurant', 'Bar'], 29.424, -98.488],
  ['Alamo Heights Hotel', 'San Antonio, TX', 4, 47, 5, 204, 196, ['Free shuttle', 'Spa', 'Pool'], 29.484, -98.466],
  ['Lackland Gateway Inn', 'San Antonio, TX', 2, 45, 18, 99, 92, ['Free parking', 'Laundry'], 29.38, -98.62],
  ['SeaWorld Drive Suites', 'San Antonio, TX', 3, 46, 21, 138, 129, ['Pool', 'Free breakfast', 'Kitchenette'], 29.457, -98.699],
  ['Medical Center Residence', 'San Antonio, TX', 3, 49, 9, 132, 124, ['Gym', 'Free breakfast'], 29.507, -98.58],
  ['Pearl District Hotel', 'San Antonio, TX', 5, 48, 6, 289, 274, ['Rooftop bar', 'Spa', 'Restaurant'], 29.443, -98.48],
  ['La Cantera Golf Lodge', 'San Antonio, TX', 4, 56, 13, 239, 229, ['Golf', 'Pool', 'Spa'], 29.592, -98.61],
  ['Airport Northside Inn', 'San Antonio, TX', 2, 50, 2, 109, 102, ['Free shuttle', 'Free parking'], 29.53, -98.47],
  ['Stone Oak Suites', 'San Antonio, TX', 3, 58, 11, 141, 133, ['Pool', 'Gym', 'Free breakfast'], 29.636, -98.484],
  ['Fiesta Texas Resort', 'San Antonio, TX', 4, 57, 15, 219, 209, ['Pool', 'Restaurant', 'Family rooms'], 29.6, -98.61],
  ['Hill Country Ranch Inn', 'Boerne, TX', 3, 66, 26, 152, 144, ['Free parking', 'Pet friendly'], 29.795, -98.732],
  ['Converse Crossing Hotel', 'Converse, TX', 2, 61, 10, 89, 84, ['Free parking', 'Laundry'], 29.518, -98.316],
  ['Schertz Station Suites', 'Schertz, TX', 3, 67, 15, 118, 112, ['Free breakfast', 'Pool'], 29.552, -98.27],
  ['New Braunfels River Lodge', 'New Braunfels, TX', 3, 76, 27, 164, 156, ['River access', 'Pool'], 29.703, -98.124],
  ['Gruene Historic Inn', 'New Braunfels, TX', 4, 78, 29, 198, 188, ['Free breakfast', 'Historic'], 29.738, -98.105],
]
const AMENITY_FROM_TAG = {
  'Free parking': 'Free Parking', 'Free breakfast': 'Free Breakfast', 'Free shuttle': 'Free Airport Shuttle',
  Pool: 'Swimming Pool', Gym: 'Fitness Center', Restaurant: 'Restaurant On-Site', Spa: 'Spa & Wellness Center',
  'Rooftop bar': 'Rooftop Bar / Lounge', Bar: 'Bar / Lounge', Laundry: 'Laundry', 'Family rooms': 'Family Rooms',
  Golf: 'Golf Course', Kitchenette: 'Kitchenette', 'Pet friendly': 'Pet Friendly',
}
MORE.forEach(([name, city, stars, miles, airportMiles, queen, king, tags, lat, lng], i) => {
  HOTELS.push({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name, city, stars, miles, airportMiles, lat, lng,
    seed: i + 3,
    shuttle: tags.includes('Free shuttle'),
    amenities: tags.map((t) => AMENITY_FROM_TAG[t]).filter(Boolean),
    tags,
    rates: { queen, king },
    left: { thu: 4 + ((i * 7) % 11), fri: 3 + ((i * 5) % 9), sat: 2 + ((i * 3) % 8), sun: 6 + ((i * 4) % 10) },
  })
})

export const PAGE_SIZE = 4

export const FROM_NIGHTLY = Math.min(...HOTELS.flatMap((h) => Object.values(h.rates)))

export const ADDONS = [
  { id: 'parking', name: 'Parking pass', detail: 'On-site lot, both days', price: 20 },
  { id: 'photo', name: 'Photo package', detail: 'Digital race photos, per racer', price: 25, perRacer: true },
]

const round = (n) => Math.round(n * 100) / 100

/** Price a stay. Every figure the host checkout needs comes from here. */
export function quote(hotel, { roomType = 'queen', rooms = 1, stay = 'fri-sun', payOption = 'first' } = {}) {
  const s = STAYS.find((x) => x.id === stay) || STAYS[0]
  const nightly = hotel.rates[roomType]
  const nights = s.nights.length
  const perNightWithTax = round(nightly * (1 + TAX_RATE) * rooms)
  const subtotal = round(nightly * nights * rooms)
  const total = round(perNightWithTax * nights)
  const dueToday = payOption === 'full' ? total : perNightWithTax
  return {
    hotelId: hotel.id,
    name: hotel.name,
    stars: hotel.stars,
    city: hotel.city,
    miles: hotel.miles,
    shuttle: !!hotel.shuttle,
    roomType,
    roomLabel: ROOM_TYPES.find((r) => r.id === roomType)?.label,
    rooms,
    stay: s.id,
    stayLabel: s.label,
    stayShort: s.short,
    checkIn: nightFull(s.nights[0]),
    checkOut: nightFull(NEXT_DAY[s.nights[s.nights.length - 1]]),
    nightDates: s.nights.map(nightFull),
    seed: hotel.seed,
    tags: hotel.tags,
    roomsLeft: Math.min(...s.nights.map((n) => hotel.left[n])),
    nights,
    nightly,
    subtotal,
    taxes: round(total - subtotal),
    total,
    firstNight: perNightWithTax,
    payOption,
    dueToday: round(dueToday),
    dueAtHotel: round(total - dueToday),
  }
}

export const money = (n) =>
  '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
