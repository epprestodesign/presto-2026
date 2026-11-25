/* Building blocks for the hand-designed docs pages: Start Here, the journey
 * and edge-case overviews, the request overviews and Labs. Storybook renders
 * MDX with React even in a Vue project, so these are React components, written
 * with createElement because this repo has no JSX build step outside MDX.
 * Styles: start-here.css (everything scoped under .sh).
 *
 *   Go        a link to another Storybook page that opens in place
 *   Browser   a browser-window frame around a screenshot
 *   Status    the status chip (values from status.js)
 *   MetaRow   the row under a title: status, Linear ticket, dates, links
 *   Live      a number read from the Storybook index as the page loads
 *   ModeGrid  each journey step in each booking mode, read from the index
 *
 * Linking: pass `to` (an id from the index, e.g. "start-here-overview--docs")
 * or `page` (a docs page title, e.g. "Edge Cases/Overview"), which is turned
 * into its id the same way Storybook does. scripts/check-story-links.mjs
 * checks every link on these pages against the built index. */
import React, { useEffect, useState } from 'react'
import { addons } from 'storybook/preview-api'
import { STATUSES, STATUS_BY_FOLDER } from './status.js'
import './start-here.css'

const h = React.createElement

/** Storybook's own title → id rule. */
export const sanitize = (s) => s.toLowerCase()
  .replace(/[ ’–—―′¿'`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '-')
  .replace(/-+/g, '-').replace(/^-+/, '').replace(/-+$/, '')

export const docsId = (title) => `${sanitize(title)}--docs`

/** A link to a docs page (or, with `story`, a canvas). */
export function Go({ to, page, story = false, className = 'sh-link', children }) {
  const id = to || docsId(page)
  const path = `?path=/${story ? 'story' : 'docs'}/${id}`
  const onClick = (event) => {
    // Let cmd/ctrl/shift/middle-click open a new tab the normal way.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button) return
    event.preventDefault()
    addons.getChannel().emit('navigateUrl', path)
  }
  return h('a', { href: `./${path}`, target: '_top', className, onClick, 'data-go': id }, children)
}

const shot = (src, alt) => h('img', { src, alt, loading: 'lazy', className: 'sh-shot' })

export function Browser({ src, alt, className = '' }) {
  return h('div', { className: `sh-browser ${className}` },
    h('div', { className: 'sh-browser__bar', 'aria-hidden': true }, h('i'), h('i'), h('i')),
    shot(src, alt))
}

/** A status chip. `status` is a key of STATUSES, or `folder` looks it up. */
export function Status({ status, folder }) {
  const s = STATUSES[status || STATUS_BY_FOLDER[folder]]
  if (!s) return null
  return h('span', { className: 'sh-status', style: { color: s.color, background: s.bg } }, s.label)
}

/** The row under a page title. `items` are strings or elements. */
export function MetaRow({ status, folder, items = [] }) {
  return h('div', { className: 'sh-meta' },
    h(Status, { status, folder }),
    ...items.map((it, i) => h('span', { key: i, className: 'sh-meta__item' }, it)))
}

/* ---- The Storybook index, read once per page load ------------------------ */
let indexPromise
const loadIndex = () => {
  indexPromise = indexPromise || fetch('./index.json').then((r) => r.json()).then((j) => Object.values(j.entries || {}))
  return indexPromise
}
function useIndex() {
  const [entries, setEntries] = useState(null)
  useEffect(() => { loadIndex().then(setEntries).catch(() => setEntries([])) }, [])
  return entries
}

const COUNTS = {
  // Distinct component pages under Design System › Components.
  components: (e) => new Set(e.filter((x) => x.title.startsWith('Design System/Components/')).map((x) => x.title)).size,
  steps: (e) => new Set(e.filter((x) => /^User Journey\/0\d · /.test(x.title)).map((x) => x.title.split('/')[1])).size,
  'edge-cases': (e) => e.filter((x) => x.type === 'story' && x.title.startsWith('Edge Cases/')).length,
  requests: (e) => new Set(e.filter((x) => x.title.startsWith('Design Requests/') && x.title.split('/').length > 2).map((x) => x.title.split('/')[1])).size,
  'other-requests': (e) => new Set(e.filter((x) => x.title.startsWith('Other Requests/') && x.title.split('/').length > 2).map((x) => x.title.split('/')[1])).size,
  ideas: (e) => new Set(e.filter((x) => x.title.startsWith('Eventpipe Labs/') && x.title !== 'Eventpipe Labs/Overview').map((x) => x.title.split('/')[1])).size,
  stories: (e) => e.filter((x) => x.type === 'story').length,
}

/** A live count: <Live count="components" label="components" /> → "51 components". */
export function Live({ count, label, className = 'sh-chip' }) {
  const entries = useIndex()
  const n = entries && entries.length ? COUNTS[count](entries) : null
  return h('span', { className }, n === null ? '…' : `${n} ${label}`)
}

/* ---- Each journey step in each booking mode ------------------------------ */
const STEPS = ['01 · Landing', '02 · Browse Hotels', '03 · Hotel Details', '04 · Checkout', '05 · Confirmation', '06 · Manage Booking']
const MODES = ['Book Reservation', 'Group Block', 'Mobile']

/** A grid of steps × modes. Each cell links to that page, or says there isn't one yet. */
export function ModeGrid() {
  const entries = useIndex()
  if (!entries) return h('p', { className: 'sh-sub' }, 'Loading…')
  const first = (title) => entries.find((x) => x.title === title && x.type === 'story')
  const edge = (step) => entries.filter((x) => x.type === 'story' && x.title.startsWith(`Edge Cases/${step}`)).length
  const head = h('tr', null, h('th', null, 'Step'), ...MODES.map((m) => h('th', { key: m }, m)), h('th', null, 'Edge cases'))
  const rows = STEPS.map((step) => h('tr', { key: step },
    h('th', { scope: 'row' }, h(Go, { page: `User Journey/${step}/Overview`, className: 'sh-gridlink' }, step)),
    ...MODES.map((m) => {
      const s = first(`User Journey/${step}/${m}`)
      return h('td', { key: m }, s
        ? h(Go, { to: s.id, story: true, className: 'sh-yes' }, 'Open')
        : h('span', { className: 'sh-no' }, 'Not yet'))
    }),
    h('td', null, edge(step) ? h('span', { className: 'sh-count' }, String(edge(step))) : h('span', { className: 'sh-no' }, 'None'))))
  return h('div', { className: 'sh-tablewrap' }, h('table', { className: 'sh-table' }, h('thead', null, head), h('tbody', null, ...rows)))
}
