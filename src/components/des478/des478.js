// DES-478 — Experience Now partner offer on the booking confirmation page + email.
// Shared data for the DES-478 Storybook stories AND the forked clickable
// prototype (prototype-des478/, which imports this via `@lib`). Mockup only:
// the event, hotels, people and the partner link are sample data.

// The event drives the offer copy — "You're going to {city}!" — so the city
// changes per event (Christine's open question; assumed yes).
export const EVENT = {
  name: 'Baltimore Summer Soccer Classic 2027',
  dates: 'Wed, 6/16/2027 - Sat, 6/19/2027',
  city: 'Baltimore',
  venue: 'Baltimore Convention Center',
  // Landing-page description (LandingPage `intro`).
  intro: [
    'Join clubs from across the country for one of the premier youth soccer tournaments on the East Coast. The Baltimore Summer Soccer Classic brings together players, coaches, club teams, families, and fans for four days of competitive matches across age divisions U9 through U19.',
    "Matches are centered around the Baltimore Convention Center and the Inner Harbor, with restaurants, the National Aquarium, and Camden Yards a short walk away. Whether you're stepping onto the pitch, coaching your squad, or cheering from the sidelines, Presto makes it easy to plan your trip and stay close to the action.",
  ],
}

// Hotel cities around the venue (replaces the prototype's sample suburbs).
export const CITIES = [
  'Baltimore', 'Towson', 'Linthicum', 'Columbia', 'Hanover', 'Catonsville',
  'Glen Burnie', 'Owings Mills', 'Ellicott City', 'Pikesville', 'Essex', 'Annapolis Junction',
]

// Placeholder until Experience Now gives us the real join link.
export const PARTNER = {
  name: 'Experience Now',
  href: '#experience-now',
}

// Offer copy. `ticket` is Christine's suggested copy, word for word; the two
// alternatives are shorter options for her to pick from. Text only — no logo
// until we have Experience Now brand guidelines.
export const COPY = {
  ticket: {
    label: 'Ticket copy',
    message: (city) => `You're going to ${city}! Our partners at Experience Now have special offers on some fun activities while you are there.`,
    link: 'Click here to join and learn more!',
  },
  short: {
    label: 'Option A · Shorter',
    message: (city) => `Make the most of ${city}. Our partners at Experience Now have member deals on things to do while you're in town.`,
    link: 'Join free and see the offers',
  },
  shortest: {
    label: 'Option B · Shortest',
    message: (city) => `Heading to ${city}? Save on tours, food and fun with our partner Experience Now.`,
    link: 'See local offers',
  },
}

// ── Sample confirmations (ConfirmationPage `data` shape) ────────────────────
export const SAMPLE_HOTELS = [
  { name: 'Hampton Inn & Suites Inner Harbor', city: 'Baltimore' },
  { name: 'Hyatt Place Harbor East', city: 'Baltimore' },
  { name: 'Courtyard by Marriott Towson', city: 'Towson' },
]

const NIGHTS = ['Wed, 06/16/2027', 'Thu, 06/17/2027', 'Fri, 06/18/2027']

const hotelBlock = (h, i, rooms, totals) => ({
  name: h.name,
  stars: 4,
  address: `123 Main St, ${h.city}, MD`,
  seed: i,
  checkIn: 'Wed, 06/16/2027 03:00 PM',
  checkOut: 'Sat, 06/19/2027 11:00 AM',
  rooms,
  totals,
})

const reserveRooms = () => [{
  type: 'Urban King · 1 King Bed',
  note: 'Sleeps 2',
  nights: [
    { date: NIGHTS[0], qty: 1, price: 179 },
    { date: NIGHTS[1], qty: 1, price: 179 },
    { date: NIGHTS[2], qty: 1, price: 189 },
  ],
}]

const holdRooms = () => [{
  type: 'Two-Room Suite King · 1 King Bed',
  note: 'Sleeps 4',
  nights: NIGHTS.map((date) => ({ date, qty: 4, price: 269 })),
}]

const reserveTotals = { taxes: 65.64, roomCost: 547, amountPaid: 189, balanceDue: 423.64 }

const policies = (h, group) => ({
  hotel: h.name,
  items: [
    group
      ? { title: 'Group Cancellation Policy', body: 'Held rooms not claimed by the release date are returned to inventory automatically. Individual guests may cancel free up to 72 hours before arrival.' }
      : { title: 'Cancellation Policy', body: 'Free cancellation up to 72 hours before arrival. Within 72 hours you are charged one night plus tax; no-shows are charged the full stay.' },
    { title: 'Amenities Notice', body: 'Free WiFi, pool, and fitness center are included. Parking is complimentary; valet and pet fees apply where noted.' },
  ],
})

// mode: 'reserve' (single) | 'reservations' (multiple) | 'hold' (group block)
export function sampleConfirmation(mode = 'reserve') {
  if (mode === 'hold') {
    const hotels = SAMPLE_HOTELS.slice(0, 2)
    return {
      contactName: 'Coach Lee',
      groupId: 'G-00584977',
      reservedOn: 'Thu, 06/11/2027 03:31 PM EST',
      releaseDate: 'Thu, 06/18/2027 11:59 PM PT',
      organizationName: 'Eagles SC',
      groupContact: 'Coach Lee — (518) 796-3050',
      email: 'youraccount@eventpipe.com',
      hotels: hotels.map((h, i) => hotelBlock(h, i, holdRooms())),
      policies: hotels.map((h) => policies(h, true)),
    }
  }
  const hotels = mode === 'reservations' ? SAMPLE_HOTELS.slice(0, 2) : SAMPLE_HOTELS.slice(0, 1)
  return {
    contactName: 'Alex Smith',
    confirmationId: '72055771948934',
    reservedOn: 'Mon, 06/14/2027 02:14 PM EST',
    guest: 'Alex Smith — (555) 018-2245',
    email: 'youraccount@eventpipe.com',
    hotels: hotels.map((h, i) => hotelBlock(h, i, reserveRooms(), reserveTotals)),
    policies: hotels.map((h) => policies(h, false)),
  }
}
