// EDGE CASES/03 · HOTEL DETAILS/SOLD OUT ROOM CARD/BOOK RESERVATION
// The Book Reservation room card when every night is sold out: dimmed card, disabled button.
// The story itself lives in its component's story file (hidden there with
// excludeStories) and is shown here, so every edge case has one home.
import * as Src from '../details/RoomCardReserve.stories.js'

export default {
  ...Src.default,
  title: 'Edge Cases/03 · Hotel Details/Sold Out Room Card/Book Reservation',
  id: 'edge-cases-hotel-details-sold-out-room-card-book-reservation',
  excludeStories: [],
  tags: ['edge-sold-out', 'step-03', 'book-reservation'],
}

export const SoldOut = { ...Src.SoldOut, name: 'Sold Out' }
