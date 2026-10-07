// Demo auto-fill for the Team Name Qualifiers walkthrough.
// Populates the current page's form fields with realistic sample data so the
// journey can be demoed without typing. Sets native input/select/textarea values
// through the framework-visible setter and dispatches input/change/blur so Vue's
// v-model + validation update. Prototype-only; no library changes.

const DEMO = {
  firstName: 'Alex',
  lastName: 'Smith',
  email: 'alex.smith@eventpipe.com',
  phone: '5125550148',
  org: 'Arsenal Soccer Club',
  team: 'Arsenal U12 Boys Select',
  block: 'Summer Soccer Classic — Arsenal',
  address: '2371 Carl D. Silver Pkwy',
  city: 'Fredericksburg',
  postal: '22401',
  special: 'Early check-in if possible.',
}

function setNativeValue(el, value) {
  const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype
    : el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype
  const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set
  if (setter) setter.call(el, value)
  else el.value = value
  el.dispatchEvent(new Event('input', { bubbles: true }))
  el.dispatchEvent(new Event('change', { bubbles: true }))
  el.dispatchEvent(new Event('blur', { bubbles: true }))
}

// Build a lowercase haystack from the field's label span + placeholder + name.
function labelTextFor(el) {
  const field = el.closest('label, .cgf__field, .tcq__field, .gtb__field, .rg__guest')
  const span = field?.querySelector(':scope > span') || field?.querySelector('span')
  return `${span?.textContent || ''} ${el.placeholder || ''} ${el.name || ''} ${el.type || ''}`.toLowerCase()
}

function demoFor(el) {
  const t = labelTextFor(el)
  if (/email/.test(t)) return DEMO.email
  if (/mobile|phone|tel/.test(t)) return DEMO.phone
  if (/group block name/.test(t)) return DEMO.block
  if (/organization|club/.test(t)) return DEMO.org
  if (/team name|registered team/.test(t)) return DEMO.team
  if (/first name/.test(t)) return DEMO.firstName
  if (/last name/.test(t)) return DEMO.lastName
  if (/postal|zip/.test(t)) return DEMO.postal
  if (/city/.test(t)) return DEMO.city
  if (/address/.test(t)) return DEMO.address
  if (/rewards/.test(t)) return '' // optional — leave blank
  if (/special|request/.test(t)) return DEMO.special
  return 'Sample'
}

function fillNativeFields(root) {
  let n = 0
  root.querySelectorAll('input, select, textarea').forEach((el) => {
    if (el.disabled || el.readOnly) return
    if (['hidden', 'checkbox', 'radio', 'file', 'number'].includes(el.type)) return
    // Skip fields inside teleported popovers / filter menus (not this form).
    if (el.closest('.q-menu, .bw-menu')) return
    if (el.tagName === 'SELECT') {
      const opt = [...el.options].find((o) => o.value && !o.disabled)
      if (opt && el.value !== opt.value) { setNativeValue(el, opt.value); n++ }
    } else {
      const v = demoFor(el)
      if (v !== '') { setNativeValue(el, v); n++ }
    }
  })
  return n
}

// Group hold: best-effort click-through to add one team (count → list → confirm),
// since team selection uses custom buttons rather than form fields.
function tryGroupTeams(root) {
  try {
    const flow = root.querySelector('.gtb__flow')
    if (!flow) return
    const next = flow.querySelector('.gtb__nextbtn:not(.is-disabled)')
    if (next) next.click()
    setTimeout(() => {
      const first = flow.querySelector('.gtb__team:not(.is-disabled)')
      if (first) first.click()
      setTimeout(() => {
        const confirm = flow.querySelector('.gtb__confirm:not(.is-disabled)')
        if (confirm) confirm.click()
      }, 140)
    }, 140)
  } catch (e) { /* best effort */ }
}

// Entry point — fills whatever the current screen offers.
export function autofillScreen(screen) {
  if (screen === 'checkout') {
    const root = document.querySelector('.ck') || document
    const n = fillNativeFields(root)
    tryGroupTeams(root)
    return n ? `Auto-filled ${n} field${n === 1 ? '' : 's'}` : 'Nothing to fill here'
  }
  if (screen === 'landing') {
    const bw = document.querySelector('.bw')
    const n = bw ? fillNativeFields(bw) : 0
    return n ? `Auto-filled ${n} field${n === 1 ? '' : 's'}` : 'Search is pre-filled — click Search'
  }
  if (screen === 'details') return 'Pick a room (use the steppers) to continue'
  if (screen === 'browse') return 'No form fields on Browse'
  return 'Nothing to fill on this page'
}
