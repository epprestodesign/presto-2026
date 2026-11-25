// EDGE CASES/04 · CHECKOUT/FORM ERRORS/PAYMENT
// The payment form after Submit with empty or invalid fields.
// The story itself lives in its component's story file (hidden there with
// excludeStories) and is shown here, so every edge case has one home.
import * as Src from '../checkout/PaymentForm.stories.js'

export default {
  ...Src.default,
  title: 'Edge Cases/04 · Checkout/Form Errors/Payment',
  id: 'edge-cases-checkout-form-errors-payment',
  excludeStories: [],
  tags: ['edge-error', 'step-04', 'book-reservation'],
}

export const ValidationErrors = { ...Src.ValidationErrors, name: 'Validation Errors' }
