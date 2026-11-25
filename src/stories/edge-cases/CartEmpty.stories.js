// EDGE CASES/CART/CART FLYOUT
// The cart flyout with nothing in it.
// The story itself lives in its component's story file (hidden there with
// excludeStories) and is shown here, so every edge case has one home.
import * as Src from '../navigation/CartFlyout.stories.js'

export default {
  ...Src.default,
  title: 'Edge Cases/Cart/Cart Flyout',
  id: 'edge-cases-cart-cart-flyout',
  excludeStories: [],
  tags: ['edge-empty', 'cart'],
}

export const Empty = { ...Src.Empty, name: 'Empty Cart' }
