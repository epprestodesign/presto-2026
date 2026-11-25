/* Storybook manager: the EventPipe brand in the sidebar, status dots beside
 * request and Labs folders, and redirects for pages that moved. */
import React from 'react'
import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'
import { STATUSES, STATUS_BY_FOLDER } from '../src/stories/start-here/status.js'

/* ---------------------------------------------------------------------------
 * Brand: the EventPipe logo in the sidebar in place of Storybook's, and Presto
 * Navy (the booking site's one action colour) on the selected item. The
 * logo is served from .storybook/static (main.js `staticDirs`); the path is
 * relative so it also resolves under GitHub Pages' /presto-2026/ prefix.
 *
 * Status: a dot beside every folder listed in src/stories/start-here/status.js. */
const h = React.createElement

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'EventPipe · Presto booking',
    brandImage: './eventpipe-logo.svg',
    brandUrl: './',
    brandTarget: '_self',
    colorPrimary: '#01113E',
    colorSecondary: '#01113E',
  }),
  sidebar: {
    renderLabel: (item) => {
      const key = STATUS_BY_FOLDER[item.name]
      const status = key && STATUSES[key]
      if (!status) return item.name
      return h('span', { className: 'ep-status', title: status.label },
        item.name,
        h('span', { className: 'ep-status__dot', style: { background: status.color }, 'aria-label': status.label, role: 'img' }))
    },
  },
})

/* ---------------------------------------------------------------------------
 * Moved pages. Every CSF file pins its old id, so stories kept their links
 * through the 2026-11-25 sidebar reorganisation. The entries below are the
 * pages whose id did change: standalone docs pages (their id comes from their
 * title) and the edge-case stories that moved into Edge Cases. Each old link
 * is sent to its current page on load. Keys are old ids; values are the new
 * `docs/…` or `story/…` path. Add an entry whenever a shared page is renamed
 * or removed. scripts/check-story-links.mjs fails the build if one is missing. */
const MOVED = {
  // Docs pages
  'getting-started-introduction--docs': 'docs/start-here-overview--docs',
  'getting-started-architecture-conventions--docs': 'docs/start-here-architecture-conventions--docs',
  'getting-started-user-journey-build-spec--docs': 'docs/user-journey-build-spec--docs',
  'widgets-embeds-r-d-overview--docs': 'docs/other-requests-partner-widgets-overview--docs',
  'landing-page-concepts-27-overview--docs': 'docs/other-requests-landing-concepts-27-overview--docs',
  'team-name-qualifiers-overview--docs': 'docs/design-requests-team-name-qualifiers-overview--docs',
  'linear-tickets-des-478-overview--docs': 'docs/design-requests-des-478-·-experience-now-overview--docs',
  // Edge-case stories now shown under Edge Cases
  'hotel-details-components-book-reservation-room-card--sold-out': 'story/edge-cases-hotel-details-sold-out-room-card-book-reservation--sold-out',
  'hotel-details-components-group-block-room-card--sold-out': 'story/edge-cases-hotel-details-sold-out-room-card-group-block--sold-out',
  'hotel-details-components-book-reservation-price-details--three-fees': 'story/edge-cases-hotel-details-fee-limit-price-details--three-fees',
  'checkout-experience-components-reservation-summary--three-fees': 'story/edge-cases-checkout-fee-limit-reservation-summary--three-fees',
  'checkout-experience-components-book-reservation-payment--validation-errors': 'story/edge-cases-checkout-form-errors-payment--validation-errors',
  'checkout-experience-components-group-block-contact-info-teams-block--multiple-teams': 'story/edge-cases-checkout-teams-block--team-limit',
  'checkout-experience-components-group-block-contact-info-teams-block--validation-errors': 'story/edge-cases-checkout-teams-block--validation-errors',
  'checkout-experience-group-block-hold-timer-pill--urgent': 'story/edge-cases-checkout-hold-timer--under-a-minute',
  'app-shell-cart-flyout--empty': 'story/edge-cases-cart-cart-flyout--empty',
  'app-shell-added-to-cart--no-photo': 'story/edge-cases-cart-added-to-cart--no-photo',
}

try {
  const url = new URL(window.location.href)
  const path = url.searchParams.get('path') || ''
  const match = path.match(/^\/(?:docs|story)\/(.+)$/)
  const target = match && MOVED[decodeURIComponent(match[1])]
  if (target) {
    url.searchParams.set('path', `/${target}`)
    // Keep the path readable (Storybook writes it unencoded).
    window.history.replaceState(null, '', url.toString().replace(/path=[^&]*/, `path=/${target}`))
  }
} catch { /* a malformed URL just loads as it is */ }
