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
    if (el.closest('.q-menu, .bw-menu, .tsf__search')) return
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

// Group hold (DES-464/466/467): enter a team count, then either check teams from
// the list or — when the list is hidden — add each team one at a time.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const GROUP_TEAMS = ['Augusta Arsenal VBC', 'Eagles SC 15 Premier', 'Falcons U10 Boys', 'Phoenix 16 National', 'Bulls U12 Gold', 'A3 18 Heat']
async function tryGroupTeams(root) {
  try {
    const flow = root.querySelector('.gtb__flow')
    if (!flow) return
    const count = flow.querySelector('.gtb__countinput')
    if (count) {
      if (!count.value) setNativeValue(count, '2')
      await sleep(80)
      const next = flow.querySelector('.gtb__nextbtn:not(.is-disabled)')
      if (next) next.click()
      await sleep(180)
    }
    if (flow.querySelector('.gtb__teamlist')) {
      for (let i = 0; i < 12; i++) {
        const t = flow.querySelector('.gtb__team:not(.is-disabled):not(.is-on)')
        if (!t) break
        t.click(); await sleep(60)
      }
      const confirm = flow.querySelector('.gtb__confirm:not(.is-disabled)')
      if (confirm) confirm.click()
      return
    }
    for (let i = 0; i < 12 && flow.querySelector('.gtb__seq-eyebrow'); i++) {
      const form = flow.querySelector('.taf')
      if (!form) break
      const name = form.querySelector('input')
      if (name) setNativeValue(name, GROUP_TEAMS[i % GROUP_TEAMS.length])
      form.querySelectorAll('select').forEach((sel) => { const o = [...sel.options].find((x) => x.value && !x.disabled); if (o) setNativeValue(sel, o.value) })
      await sleep(80)
      const add = form.querySelector('.taf__add:not(:disabled)')
      if (!add) break
      add.click(); await sleep(180)
    }
  } catch (e) { /* best effort */ }
}

// Book Reservation team field (DES-461/462): list hidden → commit the inline
// add form; list shown → pick the first listed team, then fill its qualifiers.
function tryTeamSelect(root) {
  try {
    ;[...root.querySelectorAll(".tsf")].forEach((tsf, idx) => setTimeout(() => {
      const add = tsf.querySelector(".taf__add:not(:disabled)")
      if (add) { add.click(); return }
      const trigger = tsf.querySelector(".tsf__trigger")
      if (trigger && tsf.querySelector(".tsf__value--ph")) {
        trigger.click()
        setTimeout(() => {
          const opt = tsf.querySelector(".tsf__opt")
          if (opt) opt.click()
          setTimeout(() => fillNativeFields(tsf), 140)
        }, 140)
      } else {
        fillNativeFields(tsf)
      }
    }, 80 + idx * 500))
  } catch (e) { /* best effort */ }
}

// Entry point — fills whatever the current screen offers.
export function autofillScreen(screen) {
  if (screen === 'checkout') {
    const root = document.querySelector('.ck') || document
    const n = fillNativeFields(root)
    tryGroupTeams(root)
    tryTeamSelect(root)
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
