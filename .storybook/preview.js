import { setup } from '@storybook/vue3-vite'
import { Quasar, Notify, Dialog, Loading } from 'quasar'
import * as QComponents from 'quasar'

// Icon + font extras
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/roboto-font/roboto-font.css'

// Quasar core styles — imported from SASS source so our brand
// variables (src/css/quasar.variables.scss) are applied.
import 'quasar/src/css/index.sass'

// Our global styles + component-level overrides.
import '../src/css/app.scss'
// The "On this page" panel's look.
import './docs-theme.css'

// Register Quasar as a Vue plugin for every story, then globally
// register every Q* component so any story template can use <q-*>
// tags directly without per-file imports.
setup((app) => {
  // App-level providers (Quasar plugins). These power the imperative
  // patterns used by the design system: Snackbar (Notify), programmatic
  // Dialog, and Backdrop/Loading overlays.
  app.use(Quasar, { plugins: { Notify, Dialog, Loading } })

  for (const [name, component] of Object.entries(QComponents)) {
    if (
      /^Q[A-Z]/.test(name) &&
      component &&
      (component.render || component.setup || component.__name || component.name)
    ) {
      app.component(name, component)
    }
  }
})

/** @type { import('@storybook/vue3-vite').Preview } */
const preview = {
  parameters: {
    backgrounds: {
      options: {
        light: { name: 'light', value: '#ffffff' },
        grey: { name: 'grey', value: '#f5f5f7' },
        dark: { name: 'dark', value: '#141218' }
      }
    },
    // Mobile QA presets — flip any story to a phone width from the toolbar.
    // Primary target is 390 (iPhone 12/13/14); 360 is the small-Android floor and
    // 414 the large-phone ceiling of the 360–414 band we design to. No default is
    // forced, so stories stay responsive/desktop until you pick a viewport (or a
    // story opts in via `globals: { viewport: { value: 'mobile' } }`).
    viewport: {
      options: {
        mobileSm: { name: 'Mobile — 360', styles: { width: '360px', height: '800px' } },
        mobile: { name: 'Mobile — 390 (target)', styles: { width: '390px', height: '844px' } },
        mobileLg: { name: 'Mobile — 414', styles: { width: '414px', height: '896px' } },
        tablet: { name: 'Tablet — 768', styles: { width: '768px', height: '1024px' } },
      },
    },
    // Accessibility (addon-a11y / axe-core). Audit every story against WCAG 2.2
    // level A + AA. The extra 2.1/2.2 tags cover criteria added after 2.0 (e.g.
    // 2.2's focus-appearance / target-size). Findings show in the Accessibility
    // panel mapped to their WCAG success criterion; 'todo' surfaces them without
    // failing local dev (the CI run enforces).
    a11y: {
      test: 'todo',
      config: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
        },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // "On this page" on every docs page (Storybook's built-in table of contents).
    docs: {
      toc: { title: 'On this page', headingSelector: 'h2, h3', ignoreSelector: '.sh-noc' },
    },
    // The sidebar reads in the order people work (reorganised 2026-11-25):
    // orientation, the design system, the booking journey step by step, the
    // edge cases of that journey, then request work, then early ideas, then
    // replaced work. Every CSF file pins its old id, so links don't change when
    // a title does; moved docs pages redirect (see .storybook/manager.js).
    options: {
      storySort: {
        order: [
          'Start Here', ['Overview', 'How to browse', 'Run and check', 'Booking modes', 'Architecture & Conventions', "What's new"],
          'Design System', [
            'Foundations', [
              'Colors', 'Palette', 'Color Contrast', 'Typography', 'Icons', 'Imagery',
              'Spacing', 'Border Radius', 'Elevation', 'Breakpoints', 'Motion',
            ],
            'Components', [
              'Actions', ['Button', 'Dialog', 'Modal', 'Side Panel', 'Backdrop'],
              'Forms', [
                'Text Field', 'Text Area', 'Select', 'Autocomplete', 'Checkbox', 'Checkbox Tree',
                'Radio Group', 'Choice Chips', 'Switch', 'Date Picker', 'Time Picker',
                'Slider', 'Range', 'Rating', 'Quantity Stepper', 'Phone Field', 'Transfer List',
              ],
              'Feedback & Status', ['Alert', 'Banner', 'Badge', 'Snackbar', 'Toast', 'Progress', 'Skeleton'],
              'Layout & Structure', [
                'Box', 'Card', 'Container', 'Grid', 'Stack', 'Divider', 'Section Header',
                'List', 'List Item', 'Accordion', 'Tabs', 'Table',
              ],
              'Media & Visuals', ['Avatar', 'Icon', 'Image List', 'Display Ad', 'Hero Banner', 'Rating'],
              'Typography & Content', ['Typography', 'Chip', 'Amenity', 'Tooltip'],
            ],
            'App Chrome', ['Global Nav & Cart', 'Cart Flyout', 'Cart Behavior', 'Added To Cart', 'Page Frame', 'Mobile'],
          ],
          // Each step: Overview, the page in each booking mode, Mobile, then the Parts it's built from.
          'User Journey', [
            'Journey map', 'Build Spec',
            '01 · Landing', ['Overview', 'Book Reservation', 'Group Block', 'Mobile', 'Parts', ['Teams Booking Widget', 'Core Booking Widget']],
            '02 · Browse Hotels', [
              'Overview', 'Book Reservation', 'Group Block', 'Mobile',
              'Parts', [
                // Grouped by page region: top bar, left rail, results, right rail, footer.
                'Top Bar', ['Breadcrumbs', 'Results Toolbar'],
                'Left Rail', ['Filter Rail', 'Search & Filters', 'Hotel Map'],
                'Results', ['Hotel Listing Card', 'Availability Dialog', 'Forms'],
                'Right Rail', ['Display Ads', ['160×600', '160×320', '120×600']],
                'Footer', ['Pagination'],
              ],
            ],
            '03 · Hotel Details', [
              'Overview', 'Book Reservation', 'Group Block', 'Mobile',
              'Parts', [
                // Both mode folders list their parts in the SAME order.
                'Book Reservation', ['Rooms', 'Room Card', 'Room Booking Dialog', 'Price Details'],
                'Group Block', ['Rooms', 'Room Card', 'Room Booking Dialog'],
                'Photo Gallery', 'Detail Tabs', 'Hotel Summary Header', 'Amenities', 'Policies & Property',
              ],
            ],
            '04 · Checkout', [
              'Overview', 'Book Reservation', 'Group Block', 'Mobile',
              'Parts', [
                'Book Reservation', ['Review Order', 'Contact Info', 'Reservation Guests', 'Payment', 'Review Reservation'],
                'Group Block', ['Review Order', 'Contact Info', 'Review Reservation'],
                'Reservation Summary',
              ],
            ],
            '05 · Confirmation', ['Overview', 'Book Reservation', 'Group Block', 'Mobile'],
            '06 · Manage Booking', ['Overview', 'Account'],
          ],
          // What a page does when something is empty, slow, wrong, full or out of time.
          'Edge Cases', [
            'Overview',
            '02 · Browse Hotels', ['Result States', ['Book Reservation', 'Group Block', ['Full Results', 'Partial Results', 'No Results', 'Error', 'Loading']], 'Empty States', 'Loading States'],
            '03 · Hotel Details', ['Sold Out Room Card', 'Fee Limit'],
            '04 · Checkout', ['Form Errors', 'Teams Block', 'Fee Limit', 'Hold Timer'],
            'Cart',
          ],
          // Work tied to a Linear design ticket, newest first.
          'Design Requests', [
            'Overview',
            'DES-478 · Experience Now', ['Overview', 'XNow Youth Sports Families', 'XNow Explorations', 'Confirmation Page', 'Confirmation Email', 'Experience Now Offer', 'Earlier Rounds'],
            'Team Name Qualifiers', [
              'Overview',
              'Book Reservation', ['Booking Widget', 'Add a Team', 'Team Name Select', 'Checkout Contact & Qualifiers', 'Order Rail Summary', 'Confirmation'],
              'Group Block', ['Booking Widget', 'Add a Team', 'Contact & Teams', 'Group Block Details', 'Confirmation'],
            ],
            'Custom Fees',
          ],
          // Asks from sales, marketing or partners that have no design ticket.
          'Other Requests', [
            'Overview',
            "Landing Concepts '27", [
              'Overview',
              'Concepts', ['Heartbeat', 'After Dark', "Planner's Desk", 'Design Matters', 'Agenda First'],
              'Components', [
                'Booking Widget', 'Booking Modal', 'Stay Planner', 'Hotels & Map', 'Countdown',
                'Stats Band', 'Block Meter', 'Sticky Bar & Floating Button', 'Logo Strip', 'FAQ', 'Add to Calendar',
              ],
            ],
            'Partner Widgets',
          ],
          // Ideas we are trying out. A concept until it becomes a request.
          'Eventpipe Labs', ['Overview', 'Checkout All at Once', 'Booking Widget Ideas', 'Room Card Cart Ideas'],
          // Replaced work, kept so old links still open.
          'Archive',
        ],
      },
    },
  },

  initialGlobals: {
    backgrounds: {
      value: 'light'
    }
  }
}

export default preview
