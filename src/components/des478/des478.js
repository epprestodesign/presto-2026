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
  // Short name + dates for the "For families at …" line on the family looks.
  short: 'Baltimore Summer Soccer Classic',
  shortDates: 'Jun 16–19',
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

// Experience Now goes by "XNow" on its site (xnow.com), so the guest-facing
// copy uses XNow. The link stays a placeholder until we get the real join URL.
export const PARTNER = {
  name: 'XNow',
  fullName: 'Experience Now',
  href: '#experience-now',
}

// Offer copy. `ticket` is Christine's suggested copy (partner name switched to
// XNow to match their site and logo); the two alternatives are shorter options
// for her to pick from.
export const COPY = {
  ticket: {
    label: 'Ticket copy',
    message: (city) => `You're going to ${city}! Our partners at XNow have special offers on some fun activities while you are there.`,
    link: 'Click here to join and learn more!',
  },
  short: {
    label: 'Option A · Shorter',
    message: (city) => `Make the most of ${city}. Our partners at XNow have member deals on things to do while you're in town.`,
    link: 'Join free and see the offers',
  },
  shortest: {
    label: 'Option B · Shortest',
    message: (city) => `Heading to ${city}? Save on games, museums and more with our partner XNow.`,
    link: 'See local offers',
  },
  // Verified-groups copy (feedback 2026-11-07): XNow verifies you belong to a
  // group (military, student, etc.) and gives discounts on experiences like
  // sports events and museums. These say WHO qualifies and WHAT they get.
  // `cta` replaces a look's button text when this copy is picked.
  verified: {
    label: 'Option C · Verified groups',
    message: (city) => `You're going to ${city}! Students, teachers, military, healthcare workers and first responders can save on sports games, museums and more with XNow.`,
    link: 'Verify & see deals',
    cta: 'Verify & see deals',
  },
  verifiedShort: {
    label: 'Option D · Verified groups, short',
    message: (city) => `Heading to ${city}? Verified groups save on games, museums & more with XNow.`,
    link: 'Verify free',
    cta: 'Verify free',
  },
  // Youth-sports-family copy (Christine, 2026-11-09): the offer is given
  // because the guest is "verified" as a youth sports family — their
  // tournament booking IS the proof, so there's nothing to verify and the
  // button just opens the offers. Copy says "Experience Now", as she wrote it.
  // `family: true` swaps verify-group lists for family-friendly chips.
  family: {
    label: 'Christine #1 · Benefit first',
    message: (city) => `Make it more than a tournament weekend. Our partner Experience Now has special offers on events and experiences in ${city}, created with youth sports families in mind.`,
    link: 'See my offers', cta: 'See my offers', family: true,
  },
  familyFriendly: {
    label: 'Christine #2 · Friendly & personal',
    message: (city) => `Heading to ${city} for the big weekend? When the games are over, our partner Experience Now has special offers on local events and attractions to help your family make the most of the trip.`,
    link: 'See my offers', cta: 'See my offers', family: true,
  },
  familyShort: {
    label: 'Short · banner & phone',
    message: (city) => `Make it more than a tournament weekend. Special offers in ${city} for youth sports families.`,
    link: 'See my offers', cta: 'See my offers', family: true,
  },
  // Body-only halves of Christine's copy, for looks whose headline already
  // carries the first sentence (so it isn't said twice).
  familyBody1: {
    label: 'Christine #1 · body under headline',
    message: (city) => `Our partner Experience Now has special offers on events and experiences in ${city}, created with youth sports families in mind.`,
    link: 'See my offers', cta: 'See my offers', family: true,
  },
  familyBody2: {
    label: 'Christine #2 · body under headline',
    message: () => 'When the games are over, our partner Experience Now has special offers on local events and attractions to help your family make the most of the trip.',
    link: 'See my offers', cta: 'See my offers', family: true,
  },
}

// ── XNow callout looks (explorations) ───────────────────────────────────────
// How far the offer leans into XNow's brand (crawled from xnow.com 2026-11-07:
// orange gradient logo, Poppins, pill buttons, #141414, the "sunset" sign-up
// gradient and the red→orange "Verify now" banner). Brand gradients are
// darkened slightly where text sits on them so white text passes WCAG AA.
// `copy` = the default COPY key for that look; `cta` = button text.
export const LOOKS = {
  presto: {
    label: 'Logo only',
    note: 'Presto card + XNow logo. The quietest option; reads as a Presto message.',
    copy: 'ticket',
  },
  banner: {
    label: 'Verify banner',
    note: 'Pill banner in the red→orange gradient from XNow\'s "Verify now" bar. One line + a white pill button.',
    copy: 'shortest',
    cta: 'Join free',
  },
  ribbon: {
    label: 'Gradient accent',
    note: 'White card with XNow\'s pink gradient edge, "ExperienceNow!" headline and an outlined pill button. Branded but light.',
    copy: 'short',
    headline: (city) => `Start your Experience<em>Now!</em> in ${city}`,
    cta: 'Join free & see offers',
  },
  dark: {
    label: 'Dark card',
    note: 'XNow\'s #141414 surface, "Member Exclusive" tag and orange gradient button. Looks like an XNow tile.',
    copy: 'ticket',
    headline: (city) => `Save on things to do in ${city}`,
    cta: 'Create free account',
  },
  sunset: {
    label: 'Sunset card',
    note: 'The purple→magenta→orange gradient from XNow\'s sign-up screen with a big Poppins headline. The loudest option.',
    copy: 'ticket',
    headline: (city) => `Unlock exclusive deals in ${city}`,
    cta: 'Join free',
  },
  split: {
    label: 'Split + who qualifies',
    note: 'Sunset panel + white panel that lists who can verify (students, teachers, healthcare, first responders, military). Sets the right expectation.',
    copy: 'short',
    headline: () => 'Unlock your exclusive deals',
    cta: 'Join free',
  },
}

// Who can verify on XNow (their sign-up screen lists these and more).
export const GROUPS = [
  { icon: 'school', label: 'Students & alumni' },
  { icon: 'menu_book', label: 'Teachers & staff' },
  { icon: 'medical_services', label: 'Healthcare workers' },
  { icon: 'local_police', label: 'First responders' },
  { icon: 'military_tech', label: 'Military' },
]

// ── Verified-groups alts (feedback 2026-11-07) ──────────────────────────────
// What verified members get: experiences, not hotels. Generic categories, so
// we don't promise a deal XNow may not have in every city.
export const PERKS = [
  { icon: 'stadium', label: 'Sports' },
  { icon: 'museum', label: 'Museums' },
  { icon: 'theater_comedy', label: 'Shows' },
  { icon: 'attractions', label: 'Attractions' },
]
export const STEPS = ['Verify who you are', 'Pick a deal', 'Save on your trip']
export const FINE_PRINT = 'Verification by XNow. Deals vary by city.'

// Alt versions built on three of the looks above (`base` = which look's layout).
// Kept apart from LOOKS so the six looks already shared stay unchanged.
// Flags: perks = "what you get" chips · steps = how-it-works row ·
// fine = fine-print line · sub = panel subline (split only).
export const ALT_LOOKS = {
  'v-banner': {
    base: 'banner',
    label: 'Alt A · Verified banner',
    note: 'Verify banner with copy that says who saves and on what. Smallest change.',
    copy: 'verifiedShort',
    cta: 'Verify free',
  },
  'v-card': {
    base: 'sunset',
    label: 'Alt B · Verified card',
    note: 'Sunset card: group-discount headline, the new copy, "what you get" chips and fine print.',
    copy: 'verified',
    headline: (city) => `Your group discount works in ${city}`,
    cta: 'Verify & see deals',
    perks: true,
    fine: true,
  },
  'v-split': {
    base: 'split',
    label: 'Alt C · Verified split',
    note: 'Split card: a 3-step "how it works", who can verify, and fine print. Explains XNow best.',
    copy: 'verified',
    headline: () => 'Unlock your group discount',
    sub: (city) => `Sports, museums & more in ${city}`,
    cta: 'Verify & see deals',
    steps: true,
    whoLabel: 'Who can verify',
    fine: true,
  },
}

// ── Youth sports family alts (Christine, 2026-11-09) ────────────────────────
// No verify step and no group lists: a badge says the offer is already
// unlocked by their booking, the tournament name makes it personal, and the
// chips are things a team family would do between games.
export const FAMILY_BADGE = 'Youth sports family offer'
export const FAMILY_PERKS = [
  { icon: 'attractions', label: 'Family attractions' },
  { icon: 'sports_baseball', label: 'Ballgames' },
  { icon: 'museum', label: 'Museums' },
  { icon: 'icecream', label: 'Food & treats' },
]
// Step 1 is already done (their booking) — drawn with a check, not a number.
export const FAMILY_STEPS = (city) => ['You booked your stay', 'Pick an offer', `Enjoy ${city}`]
export const FAMILY_FINE = 'Offers by Experience Now. Deals vary by city.'

// Family alts reuse four of the looks above (`base`). Flags: badge = "Youth
// sports family offer" pill · event = "For families at {event} · {dates}" ·
// perks = family chips · steps = done/next/next row · fine = fine print ·
// emailCopy = copy used in the email instead (Christine's friendlier #2).
export const FAMILY_LOOKS = {
  'f-card': {
    base: 'sunset',
    label: 'Fam A · Family card',
    note: 'Her #1 as a big headline, the family badge, the tournament name and family chips. Uses her #2 in the email.',
    copy: 'familyBody1',
    emailCopy: 'familyBody2',
    headline: () => 'Make it more than a tournament weekend',
    cta: 'See my offers',
    badge: true, event: true, perks: true, fine: true,
  },
  'f-note': {
    base: 'ribbon',
    label: 'Fam B · Friendly note',
    note: 'Her #2 on the light white card: a question headline, then the "when the games are over" line. Best fit for the email.',
    copy: 'familyBody2',
    headline: (city) => `Heading to ${city} for the big weekend?`,
    cta: 'See my offers',
    badge: true, event: true,
  },
  'f-split': {
    base: 'split',
    label: 'Fam C · Family split',
    note: 'Shows the booking already counts: step 1 is checked off. Family chips replace the old "who can verify" list.',
    copy: 'familyBody1',
    headline: () => 'Your family offers are unlocked',
    sub: (city) => `Events & attractions in ${city}`,
    cta: 'See my offers',
    badge: true, steps: true, perks: true, fine: true,
  },
  'f-banner': {
    base: 'banner',
    label: 'Fam D · Family banner',
    note: 'The banner with the short version of her #1. Smallest change.',
    copy: 'familyShort',
    cta: 'See my offers',
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
