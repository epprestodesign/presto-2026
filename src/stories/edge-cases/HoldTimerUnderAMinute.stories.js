// EDGE CASES/04 · CHECKOUT/HOLD TIMER
// The group hold timer in its last minute, when it turns amber.
// The story itself lives in its component's story file (hidden there with
// excludeStories) and is shown here, so every edge case has one home.
import * as Src from '../checkout/HoldTimerPill.stories.js'

export default {
  ...Src.default,
  title: 'Edge Cases/04 · Checkout/Hold Timer',
  id: 'edge-cases-checkout-hold-timer',
  excludeStories: [],
  tags: ['edge-time-out', 'step-04', 'group-block'],
}

export const UnderAMinute = { ...Src.Urgent, name: 'Under a Minute' }
