// BROWSE HOTELS / Mobile — the mobile-optimized browse experience, consolidated
// in one folder (alongside the Hotel Listing Card stories). Reuses the REAL list
// page story at phone width:
//   • shortened hero, Filters + Sort bar that sticks under the nav on scroll
//   • results switch to the compact Expedia-style horizontal card
import { Mobile as ListMobile } from './HotelListPage.stories.js'

export default {
  title: 'Browse Hotels/Mobile',
  tags: ['mobile'],
  parameters: { layout: 'fullscreen' },
}

/** The full hotel-list page at 390 — sticky Filters/Sort bar + horizontal cards. */
export const HotelListPage = { ...ListMobile, name: 'Hotel List Page' }
