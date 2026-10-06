// postMessage bridge between this embedded Presto widget (iframe) and the
// Spartan host checkout. The host owns the order; the widget reports changes.
//
//   widget → host  { source: 'presto', type, payload }
//     resize        { height }               auto-size the inline iframe
//     state         { parking, photo, hotelOn, hotel }  live order changes
//     open-overlay  —                        variant B: open the hotel modal
//     confirm       { hotel }                modal: add hotel to order
//     cancel        —                        modal: closed without adding
//     booked        { hotel }                journey (E/F): hotel booked on its own
//     back          —                        journey (E/F): back to the race order
//     top           —                        journey step changed: scroll host to top
//     modal         { open }                 a library DsModal (Filters / Map) opened inside the inline embed
//   host → widget  { source: 'spartan', type: 'sync', payload: { parking, photo, hotelOn, hotel, party } }
//                  { source: 'spartan', type: 'scroll', payload: { y } }  align content while pinned
import { reactive } from 'vue'

const params = new URLSearchParams(location.search)
export const VIEW = params.get('view') || 'addons' // addons | modal | details | confirm | journey
export const VARIANT = params.get('variant') || 'inline' // inline | modal
export const SKIN = params.get('skin') === 'spartan' ? 'spartan' : 'presto' // widget color skin
document.documentElement.classList.add(`skin-${SKIN}`)

let initial = {}
try { initial = JSON.parse(params.get('s') || '{}') } catch (e) { /* ignore */ }

export const store = reactive({
  parking: !!initial.parking,
  photo: !!initial.photo,
  hotelOn: !!initial.hotelOn,
  hotel: initial.hotel || null,
  party: initial.party || 1,
  total: initial.total || 0, // host order total (shown in Review your reservation)
  receipt: initial.receipt || null, // race order lines (confirmation page)
  autofill: initial.autofill !== false, // prototype Auto-fill (fills Your Details forms)
})

const embedded = window.parent && window.parent !== window
export function send (type, payload) {
  if (embedded) window.parent.postMessage({ source: 'presto', type, payload: JSON.parse(JSON.stringify(payload ?? null)) }, '*')
}
export const pushState = () => send('state', { parking: store.parking, photo: store.photo, hotelOn: store.hotelOn, hotel: store.hotel })

window.addEventListener('message', (e) => {
  const m = e.data
  if (!m || m.source !== 'spartan') return
  if (m.type === 'sync') Object.assign(store, m.payload)
  else if (m.type === 'scroll') window.scrollTo(0, m.payload.y)
  else if (m.type === 'fill') window.dispatchEvent(new CustomEvent('ew:fill', { detail: m.payload || {} }))
})

// Inline embed: the iframe is always exactly as tall as the widget, so the
// host page is the only thing that scrolls. Measures the content element
// itself (Quasar pins body to 100% height, so observing body misses growth).
export function autoResize (el) {
  document.documentElement.classList.add('ew-embed')
  let last = 0
  const report = () => {
    const h = Math.ceil(el.getBoundingClientRect().height)
    if (h && h !== last) { last = h; send('resize', { height: h }) }
  }
  new ResizeObserver(report).observe(el)
  report()

  // Library modals (FilterRail sheet, map) teleport a .dsm onto <body>; the
  // host pins the iframe to the viewport while one is open so it's on screen.
  let open = false
  new MutationObserver(() => {
    const o = !!document.querySelector('.dsm')
    if (o !== open) { open = o; send('modal', { open: o }) }
  }).observe(document.body, { childList: true })
}
