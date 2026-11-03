// Shared helpers for the Landing Page Concepts '27 stories (not a story file).
export const T = "Landing Page Concepts '27"
// Wrap a component in the brand layer on a neutral (or navy) canvas.
export const frame = (inner, { dark = false, pad = 40 } = {}) =>
  `<div class="l27" style="padding:${pad}px;min-height:100vh;background:${dark ? '#0E1033' : '#F7F5F9'};${dark ? 'color:#fff;' : ''}">${inner}</div>`
