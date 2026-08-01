// HOTEL DETAILS / Mobile — the mobile-optimized detail experience, consolidated
// in one folder. Reuses the REAL detail stories (no duplication) at phone width:
//   • gallery hero becomes a swipeable carousel; "See all photos" is full-screen,
//     single-column (top-down)
//   • the detail tab bar sticks below the app nav on scroll
//   • 16px page gutters throughout
import { Page } from './HotelDetailPage.stories.js'
import { Default as GalleryDefault } from './PhotoGallery.stories.js'
import { Mobile as RoomCardMobile } from './RoomCardGroup.stories.js'

export default {
  title: 'Hotel Details/Mobile',
  tags: ['mobile'],
  parameters: { layout: 'fullscreen' },
}

const mobile = (story, name, parameters) => ({
  ...story, name, globals: { viewport: { value: 'mobile' } },
  ...(parameters ? { parameters } : {}),
})

/** The full hotel detail page at 390 — carousel gallery, sticky tabs, rooms. */
export const HotelDetailPage = mobile(Page, 'Hotel Detail Page')

/** The photo gallery at 390 — swipe the carousel; tap to open the full-screen,
 *  single-column (top-down) all-photos view. */
export const PhotoGallery = mobile(GalleryDefault, 'Photo Gallery', { layout: 'padded' })

/** The Group Block room card at 390 — fills the phone width (single column). */
export const RoomCard = mobile(RoomCardMobile, 'Room Card', { layout: 'padded' })
