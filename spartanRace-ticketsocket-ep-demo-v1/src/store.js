// Tiny hash router + reactive store. No vue-router / pinia on purpose —
// the prototype stays dependency-free beyond vue + vite.
import { reactive, computed, watch } from 'vue'
import { RACES, CHECKOUT_ADDONS } from './data.js'

export const ROUTES = {
  event: '/',
  login: '/account',
  location: '/location',
  details: '/checkout/details',
  extras: '/checkout/extras',
  payment: '/checkout/payment',
}

const pathToRoute = (hash) => {
  const path = hash.replace(/^#/, '') || '/'
  return Object.keys(ROUTES).find((k) => ROUTES[k] === path) || 'event'
}

export const state = reactive({
  route: pathToRoute(location.hash),
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
})

window.addEventListener('hashchange', () => {
  state.route = pathToRoute(location.hash)
  state.cartOpen = false
  window.scrollTo(0, 0)
})

export function go(route) {
  location.hash = ROUTES[route]
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

  const beforeRefund = round(registration + addonTotal + insurance + service + tax - discount)
  const refundFee = round(beforeRefund * REFUND_RATE)
  const refund = state.refundable ? refundFee : 0

  return {
    registration,
    addons,
    discount,
    insurance: round(insurance),
    service: round(service),
    tax: round(tax),
    refundFee,
    refund,
    total: round(beforeRefund + refund),
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
  if (saved) Object.assign(state, saved, { route: state.route, cartOpen: false, signature: false, waiverAgreed: false })
} catch {}
watch(
  () => ({ ...state, route: undefined, cartOpen: undefined }),
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
