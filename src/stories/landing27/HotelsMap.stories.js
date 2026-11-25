// LANDING PAGE CONCEPTS '27 / Components / Hotels & Map — concept only.
import L27HotelMap from '../../components/landing27/L27HotelMap.vue'
import { frame } from './_helpers.js'

export default {
  title: "Other Requests/Landing Concepts '27/Components/Hotels & Map",
  id: 'landing-page-concepts-27-components-hotels-map',
  component: L27HotelMap,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `## Hotels & Map
Official hotels beside a stylized map of the Strip. Hovering a card lights its pin; every card shows walk time to Mandalay Bay, block rate vs. public rate, and rooms left. **Book** opens the booking modal on that hotel.` } } },
}
export const Light = { name: 'Light', render: () => ({ components: { L27HotelMap }, template: frame('<l27-hotel-map />') }) }
export const Dark = { name: 'Dark', render: () => ({ components: { L27HotelMap }, template: frame('<l27-hotel-map tone="dark" />', { dark: true }) }) }
