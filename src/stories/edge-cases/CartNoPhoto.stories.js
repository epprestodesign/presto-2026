// EDGE CASES/CART/ADDED TO CART
// The added-to-cart message for a hotel with no photo, which shows an icon instead.
// The story itself lives in its component's story file (hidden there with
// excludeStories) and is shown here, so every edge case has one home.
import * as Src from '../navigation/AddedToCartToast.stories.js'

export default {
  ...Src.default,
  title: 'Edge Cases/Cart/Added to Cart',
  id: 'edge-cases-cart-added-to-cart',
  excludeStories: [],
  tags: ['edge-empty', 'cart'],
}

export const NoPhoto = { ...Src.NoPhoto, name: 'No Photo' }
