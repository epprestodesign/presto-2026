// Team Name Qualifiers — walkthrough highlight overlay.
// Outlines and labels the team-name touchpoints as the user moves through the
// full booking journey. Pure prototype-level enhancement driven off the rendered
// DOM (same no-library-change approach as App.vue's click router). A debounced
// MutationObserver re-applies after each screen render and catches teleported
// popovers / dialogs (team search, add-a-team) that mount outside the screen.
// Can be toggled on/off at runtime via setTeamHighlights().

// Find fields whose label text matches — supports both Quasar q-fields
// (.q-field__label) and the native-input forms (first <span> label).
function fieldsByLabel(sel, re) {
  return [...document.querySelectorAll(sel)].filter((el) => {
    const lbl = el.querySelector('.q-field__label') || el.querySelector(':scope > span') || el.querySelector('span')
    return lbl && re.test(lbl.textContent || '')
  })
}

// Each rule: a finder → elements, and the label shown on the highlight.
const RULES = [
  // Booking widget — the registered team field (single-select + multi-select).
  { find: () => fieldsByLabel('.bw__field', /registered team/i), label: 'Team selection' },
  // Booking widget — add-a-team entry points (inline link + popover footer).
  { find: () => [...document.querySelectorAll('.bw__add')], label: 'Add a team' },
  { find: () => [...document.querySelectorAll('.bw-menu .bw__link')].filter((el) => /add them/i.test(el.textContent || '')), label: 'Add a team' },
  // Add-a-team dialog.
  { find: () => [...document.querySelectorAll('.bw-dialog')], label: 'Add a team' },
  // Checkout — group teams block (count → select/add teams + Age/Gender qualifiers).
  { find: () => [...document.querySelectorAll('.gtb__flow')], label: 'Team block + qualifiers' },
  // Checkout — reservation team-name + qualifier (Age division / Gender) fields.
  { find: () => fieldsByLabel('.cgf__field', /team name|age division|gender/i), label: 'Team name + qualifiers' },
  // Cart / review rail — group block details + team summary cards.
  { find: () => [...document.querySelectorAll('.cr__groupcard, .gbd__head')].map((el) => el.closest('.cr__pricecard') || el), label: 'Team summary' },
]

let enabled = true

export function clearTeamHighlights() {
  document.querySelectorAll('.tnq-hl').forEach((el) => {
    el.classList.remove('tnq-hl')
    delete el.dataset.tnq
  })
}

export function applyTeamHighlights() {
  if (!enabled) return
  for (const rule of RULES) {
    let els = []
    try { els = rule.find() || [] } catch (e) { els = [] }
    els.forEach((el) => {
      if (el && el.nodeType === 1 && el.dataset.tnq !== rule.label) {
        el.classList.add('tnq-hl')
        el.dataset.tnq = rule.label
      }
    })
  }
}

// Turn the overlay on/off at runtime (the toggle in App.vue).
export function setTeamHighlights(on) {
  enabled = !!on
  if (enabled) applyTeamHighlights()
  else clearTeamHighlights()
}

// Observe childList/subtree only (NOT attributes) so our own class/data edits
// don't retrigger the observer. Debounced to one pass per frame.
export function initTeamHighlights() {
  let scheduled = false
  const run = () => { scheduled = false; applyTeamHighlights() }
  const schedule = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(() => setTimeout(run, 60)) } }
  const obs = new MutationObserver(schedule)
  obs.observe(document.body, { childList: true, subtree: true })
  schedule()
  return obs
}
