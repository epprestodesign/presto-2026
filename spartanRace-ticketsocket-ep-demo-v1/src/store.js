// Tiny hash router + reactive store. No vue-router / pinia on purpose —
// the prototype stays dependency-free beyond vue + vite.
import { reactive, computed, watch } from 'vue'
import { RACES, CHECKOUT_ADDONS } from './data.js'

export const ROUTES = {
  home: '/',
  event: '/event',
  login: '/account',
  location: '/location',
  details: '/checkout/details',
  addons: '/checkout/addons',
  hotels: '/checkout/addons/hotels', // Add-ons with the hotel finder open (A: expanded · B: modal)
  extras: '/checkout/extras',
  payment: '/checkout/payment',
}

// Every screen is deep-linkable per version so feedback can point at a URL:
//   #/a/… A · Inline (Presto colors)     #/b/… B · Modal (Presto colors)
//   #/c/… C · Inline (Spartan colors)    #/d/… D · Modal (Spartan colors)
//   e.g. #/a/event · #/d/checkout/addons · #/b/checkout/addons/hotels
export const CONCEPTS = {
  a: { variant: 'inline', skin: 'presto' },
  b: { variant: 'modal', skin: 'presto' },
  c: { variant: 'inline', skin: 'spartan' },
  d: { variant: 'modal', skin: 'spartan' },
}
export const conceptOf = (variant, skin) =>
  Object.keys(CONCEPTS).find((k) => CONCEPTS[k].variant === variant && CONCEPTS[k].skin === skin) || 'a'

function parseHash (hash) {
  let path = hash.replace(/^#/, '') || '/'
  let variant = null
  let skin = null
  const m = path.match(/^\/([a-d])(\/.*)?$/)
  if (m) {
    ;({ variant, skin } = CONCEPTS[m[1]])
    path = m[2] || '/event'
  }
  const route = Object.keys(ROUTES).find((k) => ROUTES[k] === path) || 'home'
  return { route, variant, skin }
}
const boot = parseHash(location.hash)
// A refresh restarts the add-ons step, so a reload of ".../addons/hotels" lands on
// the plain step. Opening a /hotels deep link fresh (pasted, new tab) still opens it.
const isReload = (performance.getEntriesByType?.('navigation')[0]?.type) === 'reload'
if (isReload && boot.route === 'hotels') boot.route = 'addons'

export const state = reactive({
  route: boot.route,
  signedIn: false,
  cartOpen: false,
  // { [ticketId]: qty }
  tickets: {},
  // { [addonId]: qty }
  addons: {},
  wave: null,
  signature: false,
  waiverAgreed: false,
  instagram: '',
  promo: null,
  charity: 'No Thanks',
  refundable: null, // true | false | null
  paymentMethod: 'card',
  termsAgreed: false,
  // ── Eventpipe/Presto add-ons (embedded widget) ──
  variant: boot.variant || 'inline', // UX: inline (toggle expands in place) | modal (900px modal)
  skin: boot.skin || 'presto', // widget colors: presto (native) | spartan (host-matched)
  parking: false,
  photo: false, // Eventpipe photo package ($25 per racer)
  hotelOn: false,
  hotel: null, // priced quote from the widget — see src/presto/hotels.js quote()
  overlayOpen: false,
})

export const PARKING_PRICE = 20
export const PHOTO_PRICE = 25 // per racer
export const partySize = computed(() => Object.values(state.tickets).reduce((a, b) => a + b, 0) || 1)

export const hrefFor = (route, variant = state.variant, skin = state.skin) =>
  route === 'home' ? '#/' : `#/${conceptOf(variant, skin)}${ROUTES[route]}`

// Keep the address bar canonical (always version-prefixed) without a navigation.
const canonicalize = () => {
  const want = hrefFor(state.route)
  if (location.hash !== want) history.replaceState(null, '', want)
}

window.addEventListener('hashchange', () => {
  const { route, variant, skin } = parseHash(location.hash)
  if (variant) Object.assign(state, { variant, skin })
  const sameView = (route === 'hotels' && state.route === 'addons') || (route === 'addons' && state.route === 'hotels')
  state.route = route
  state.cartOpen = false
  if (!sameView) window.scrollTo(0, 0)
  canonicalize()
})

export function go(route) {
  location.hash = hrefFor(route)
}

/** Update the URL for in-page state (e.g. hotel finder open) without a navigation. */
export function setRouteSilently(route) {
  state.route = route
  canonicalize()
}

// ── Catalogue lookups ──
const ALL_TICKETS = RACES.flatMap((r) => r.days.flatMap((d) => d.tickets.map((t) => ({ ...t, day: d, race: r }))))
const ALL_DAY_ADDONS = [
  ...new Map(RACES.flatMap((r) => r.days.flatMap((d) => d.addons.map((a) => [a.id, { ...a, day: d }])))).values(),
]

export const ticketById = (id) => ALL_TICKETS.find((t) => t.id === id)

// ── Cart ──
export function setTicketQty(id, qty) {
  if (qty <= 0) delete state.tickets[id]
  else state.tickets[id] = qty
}

// Event-page day add-ons (Saturday/Sunday Spectator Pass) feed the same
// add-on line as the checkout's spectator card.
export function setDayAddonQty(id, qty) {
  if (qty <= 0) delete state.addons[id]
  else state.addons[id] = qty
}

export const cartLines = computed(() => {
  const lines = Object.entries(state.tickets).map(([id, qty]) => {
    const t = ticketById(id)
    return {
      id,
      kind: 'ticket',
      qty,
      price: t.price,
      group: `${t.race.eventName} - ${t.day.dayName}`,
      label: `${t.race.short} • ${t.name.toUpperCase()} (${t.day.dayName} ${t.window})`,
    }
  })
  for (const a of ALL_DAY_ADDONS) {
    if (state.addons[a.id]) {
      lines.push({
        id: a.id,
        kind: 'addon',
        qty: state.addons[a.id],
        price: a.price,
        group: `San Antonio Spartan - ${a.day.dayName}`,
        label: a.name,
      })
    }
  }
  return lines
})

export const cartCount = computed(() => cartLines.value.reduce((n, l) => n + l.qty, 0))

export function removeLine(line) {
  if (line.kind === 'ticket') setTicketQty(line.id, 0)
  else setDayAddonQty(line.id, 0)
}

// The checkout is built around one ticket line (as in the reference). If someone
// deep-links straight into checkout, seed the reference order so it renders.
export const primaryTicket = computed(() => {
  const id = Object.keys(state.tickets)[0]
  return id ? { ...ticketById(id), qty: state.tickets[id] } : null
})

export function ensureOrder() {
  if (!primaryTicket.value) setTicketQty('sat-open', 1)
}

// ── Pricing ──
// Reverse-engineered from the reference totals:
//   1 × OPEN $139.00 → $180.86 (so $41.86 of fees/taxes per registration)
//   + Photo Package $29.99 → $214.14 (add-ons carry a 10.97% service fee)
//   Refundable Booking on $214.14 → $23.56 (11% of the order)
const PER_TICKET = { insurance: 14.0, service: 19.33, tax: 8.53 }
const ADDON_FEE_RATE = 0.1097
const REFUND_RATE = 0.11
const round = (n) => Math.round(n * 100) / 100

export const checkoutAddonQty = (id) => {
  if (id === 'spectator') return (state.addons.spectator || 0) + (state.addons['sat-spectator'] || 0) + (state.addons['sun-spectator'] || 0)
  return state.addons[id] || 0
}

export function setCheckoutAddonQty(id, qty) {
  if (id === 'spectator') {
    // collapse any event-page spectator passes into the checkout line
    delete state.addons['sat-spectator']
    delete state.addons['sun-spectator']
  }
  setDayAddonQty(id, qty)
}

export const pricing = computed(() => {
  const ticketQty = Object.values(state.tickets).reduce((a, b) => a + b, 0)
  const registration = Object.entries(state.tickets).reduce((s, [id, q]) => s + ticketById(id).price * q, 0)
  const addons = CHECKOUT_ADDONS.map((a) => ({ ...a, qty: checkoutAddonQty(a.id) })).filter((a) => a.qty > 0)
  const addonTotal = addons.reduce((s, a) => s + a.price * a.qty, 0)
  const addonFees = addons.reduce((s, a) => s + round(a.price * ADDON_FEE_RATE) * a.qty, 0)
  const discount = state.promo ? round(registration * state.promo.pct) : 0

  const insurance = PER_TICKET.insurance * ticketQty
  const service = PER_TICKET.service * ticketQty + addonFees
  const tax = PER_TICKET.tax * ticketQty

  // Refundable Booking covers the Spartan registration only — the hotel has its
  // own cancellation terms and parking is non-refundable.
  const beforeRefund = round(registration + addonTotal + insurance + service + tax - discount)
  const refundFee = round(beforeRefund * REFUND_RATE)
  const refund = state.refundable ? refundFee : 0
  const parking = state.parking ? PARKING_PRICE : 0
  const photo = state.photo ? PHOTO_PRICE * ticketQty : 0
  const hotelToday = state.hotel ? state.hotel.dueToday : 0
  const hotelAtHotel = state.hotel ? state.hotel.dueAtHotel : 0

  return {
    parking,
    photo,
    hotelToday,
    hotelAtHotel,
    registration,
    addons,
    discount,
    insurance: round(insurance),
    service: round(service),
    tax: round(tax),
    refundFee,
    refund,
    total: round(beforeRefund + refund + parking + photo + hotelToday),
  }
})

export const money = (n) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const PROMO_CODES = { SPARTAN10: 0.1, AROO: 0.15 }

// Persist the in-progress order across reloads so a refresh mid-demo doesn't
// dump you back to an empty cart. Per-browser convenience only.
const KEY = 'spartan-ts-demo-v1'
try {
  const saved = JSON.parse(localStorage.getItem(KEY) || 'null')
  // the signature canvas can't be restored, so the waiver always starts unsigned
  // A reload always restarts the Eventpipe add-ons step (no parking, photo or
  // hotel carried over); everything else in the demo order survives.
  if (saved) Object.assign(state, saved, {
    route: state.route,
    variant: boot.variant || saved.variant || 'inline',
    skin: boot.skin || saved.skin || 'presto',
    cartOpen: false,
    overlayOpen: false,
    signature: false,
    waiverAgreed: false,
    parking: false,
    photo: false,
    hotelOn: false,
    hotel: null,
  })
  if (state.variant === 'overlay') state.variant = 'modal' // older saved demos
} catch {}
watch(
  () => ({ ...state, route: undefined, cartOpen: undefined, overlayOpen: undefined }),
  (v) => {
    try { localStorage.setItem(KEY, JSON.stringify(v)) } catch {}
  },
  { deep: true },
)

export function resetDemo() {
  try { localStorage.removeItem(KEY) } catch {}
  location.hash = ''
  location.reload()
}

canonicalize()
// switching version from the demo menu rewrites the URL in place
watch(() => [state.variant, state.skin], canonicalize)
