// Prototype Auto-fill for the library checkout forms (ReservationGuests,
// PaymentForm, booking protection, policies). Those forms seed their state from
// props only once, so fill the DOM the way a person would: value + input/change
// events. Skips typed values unless force (the "Fill form" button).
import { nextTick } from 'vue'

const TEXT = {
  'First name': 'Alex',
  'Last name': 'Smith',
  '(617) 470-7879': '(210) 555-0142',
  'you@example.com': 'alex.smith@example.com',
  'Address Line 1': '123 Alamo Plaza',
  City: 'San Antonio',
  'Postal Code': '78205',
  'Cardholder Name': 'Alex Smith',
  'Card Number': '4242 4242 4242 4242',
  'Security Code': '123',
}
const PREFERRED_OPTIONS = ['Texas', 'TX', '12', '2028']
function setValue (el, v) {
  const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
  Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v)
  el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }))
}
export async function fillDom (el, force = false) {
  if (!el) return
  el.querySelectorAll('input[placeholder]').forEach((i) => {
    const v = TEXT[i.getAttribute('placeholder')]
    if (v && (force || !i.value)) setValue(i, v)
  })
  await nextTick()
  el.querySelectorAll('select').forEach((s) => {
    // required pickers (state / month / year) start on a disabled placeholder option;
    // Country has none and is left alone
    const isPicker = s.options[0]?.disabled
    if (s.value && !(force && isPicker)) return
    const opts = [...s.options].filter((o) => !o.disabled && o.value)
    const pick = PREFERRED_OPTIONS.map((p) => opts.find((o) => o.value === p || o.text === p)).find(Boolean) || opts[0]
    if (pick) setValue(s, pick.value)
  })
  if (!el.querySelector('.bp__opt.is-sel')) el.querySelector('.bp__opt--no')?.click()
  el.querySelectorAll('.pol__check').forEach((c) => { if (!c.checked) c.click() })
}
