// Screenshots for the hand-designed docs pages (Start Here, the journey map,
// the request and Labs overviews). Each one is a live story, captured at
// 1440×900 and saved as a small JPEG in src/stories/start-here/screens/.
//
// Run it against a running Storybook after a page changes:
//   pnpm storybook            (port 6006), then
//   node scripts/capture-docs-screens.mjs [http://127.0.0.1:6006]
//
// Story ids are pinned in each story file, so this list doesn't change when a
// story moves in the sidebar.
import { chromium } from 'playwright'
import { fileURLToPath } from 'node:url'

const BASE = process.argv[2] || 'http://127.0.0.1:6006'
const OUT = fileURLToPath(new URL('../src/stories/start-here/screens/', import.meta.url))

const SHOTS = {
  // The six journey steps
  'step-01-landing': 'landing-page-book-reservation--teams-booking-widget',
  'step-02-browse': 'browse-hotels-book-reservation--teams-booking-widget',
  'step-03-details': 'hotel-details-book-reservation--page',
  'step-04-checkout': 'checkout-experience-book-reservation--page',
  'step-05-confirmation': 'confirmation-book-reservation--single-reservation',
  'step-06-manage': 'manage-booking-account--default',
  // Requests
  'dr-des-478': 'linear-tickets-des-478-xnow-youth-sports-families--on-confirmation-page',
  'dr-team-name-qualifiers': 'team-name-qualifiers-book-reservation-checkout-contact-qualifiers--reservation',
  'dr-custom-fees': ['edge-cases-checkout-fee-limit-reservation-summary--three-fees', 'crop'],
  'or-landing-27': 'landing-page-concepts-27-concepts-heartbeat--desktop',
  // Labs
  'lab-checkout-all-at-once': 'checkout-experience-expanded-overview--book-reservation',
  'lab-booking-widget-ideas': ['landing-page-components-teams-booking-widget-explorations--tabs', 'crop'],
  'lab-room-card-cart-ideas': 'hotel-details-components-group-block-room-card-cart-concepts--all-concepts',
  // Edge cases
  'edge-no-results': 'browse-hotels-components-results-result-states-book-reservation--no-results',
}

const browser = await chromium.launch()
// A value of [id, 'crop'] frames a small component: the shot is cropped to it
// (with some room around it) instead of showing the whole empty canvas.
for (const [name, spec] of Object.entries(SHOTS)) {
  const [id, mode] = Array.isArray(spec) ? spec : [spec]
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(`${BASE}/iframe.html?viewMode=story&id=${id}`, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(2000)
  let clip
  if (mode === 'crop') {
    const box = await page.evaluate(() => {
      const r = document.querySelector('#storybook-root').getBoundingClientRect()
      return { x: r.x, y: r.y, width: r.width, height: r.height }
    })
    const pad = 32
    const w = Math.min(1440, box.width + pad * 2)
    const h = Math.max(Math.round(w * 10 / 16), box.height + pad * 2)
    clip = { x: Math.max(0, box.x - pad), y: Math.max(0, box.y - pad), width: w, height: Math.min(900, h) }
  }
  await page.screenshot({ path: `${OUT}${name}.jpg`, type: 'jpeg', quality: 72, clip })
  console.log('saved', name)
  await page.close()
}
await browser.close()
