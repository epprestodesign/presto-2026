// EDGE CASES/03 · HOTEL DETAILS/SOLD OUT ROOM CARD/GROUP BLOCK
// The Group Block room card when every night is sold out: dimmed card, disabled button, steppers at zero.
// The story itself lives in its component's story file (hidden there with
// excludeStories) and is shown here, so every edge case has one home.
import * as Src from '../details/RoomCardGroup.stories.js'

export default {
  ...Src.default,
  title: 'Edge Cases/03 · Hotel Details/Sold Out Room Card/Group Block',
  id: 'edge-cases-hotel-details-sold-out-room-card-group-block',
  excludeStories: [],
  tags: ['edge-sold-out', 'step-03', 'group-block'],
}

export const SoldOut = { ...Src.SoldOut, name: 'Sold Out' }
