/**
 * FOUNDATIONS / Typography (the scale & tokens)
 * Companion to Design System › Components › Typography & Content › Typography,
 * which shows it applied. Quasar has no Typography component: classes + tokens
 * (src/css/typography.scss, src/css/tokens.scss). The Tokens story reads each
 * value from the live CSS, so this page can't drift from the code.
 */
import { ref, onMounted } from 'vue'

const TOKENS = [
  '--ds-font-family',
  '--ds-font-weight-medium',
  '--ds-font-weight-bold',
  '--ds-font-size-sm',
  '--ds-font-size-md',
  '--ds-font-size-lg',
  '--ds-text-display',
  '--ds-text-display-weight',
  '--ds-text-lead',
]

const meta = {
  title: 'Design System/Foundations/Typography',
  id: 'foundations-typography',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Overview
The type system is one font, a fixed scale and two weights. It is defined in
\`src/css/typography.scss\` and \`src/css/tokens.scss\` and applied with classes.
See **Design System › Components › Typography & Content › Typography** for how
it is used.

## Family
**PT Sans**, the same font as the live EventPipe and Presto sites:
\`--ds-font-family: 'PT Sans', -apple-system, BlinkMacSystemFont, …\`, set through
\`$typography-font-family\` in \`quasar.variables.scss\`.

## Weights
PT Sans ships two weights, so the system uses two:

| Token | Value | Use |
| --- | --- | --- |
| \`--ds-font-weight-medium\` | 400 | body copy, labels |
| \`--ds-font-weight-bold\` | 700 | headings, buttons, emphasis |

Asking for 500, 600 or 800 doesn't give a new weight. The browser rounds to 400
or 700, or fakes a bold. Use one of the two tokens.

## Scale
| Class | Role |
| --- | --- |
| \`.text-display\` | hero headline (DS token) |
| \`.text-h1\`…\`.text-h6\` | headings |
| \`.text-lead\` | intro paragraph (DS token) |
| \`.text-subtitle1/2\` | section subtitles |
| \`.text-body1/2\` | body copy |
| \`.text-caption\` | helper / metadata |
| \`.text-overline\` | eyebrow labels |

The Tokens story reads every value from the live CSS.
`,
      },
    },
  },
}
export default meta

export const Scale = {
  render: () => ({
    template: `
      <div class="column q-gutter-sm" style="max-width:720px">
        <div class="text-display">Display</div>
        <div class="text-h1">Heading 1</div>
        <div class="text-h3">Heading 3</div>
        <div class="text-h5">Heading 5</div>
        <div class="text-subtitle1">Subtitle 1</div>
        <div class="text-body1">Body 1 — default paragraph size.</div>
        <div class="text-caption">Caption — helper text.</div>
        <div class="text-overline">OVERLINE</div>
      </div>`,
  }),
}

/** Every type token, read from the live CSS. */
export const Tokens = {
  render: () => ({
    setup() {
      const rows = ref([])
      onMounted(() => {
        const css = getComputedStyle(document.documentElement)
        rows.value = TOKENS.map((t) => ({ token: t, value: css.getPropertyValue(t).trim() || 'not set' }))
      })
      return { rows }
    },
    template: `
      <table class="text-body2" style="border-collapse:collapse;max-width:720px">
        <thead><tr><th style="text-align:left;padding:6px 16px 6px 0">Token</th><th style="text-align:left;padding:6px 0">Value</th></tr></thead>
        <tbody>
          <tr v-for="r in rows" :key="r.token" style="border-top:1px solid var(--ds-color-border)">
            <td style="padding:6px 16px 6px 0"><code>{{ r.token }}</code></td>
            <td style="padding:6px 0">{{ r.value }}</td>
          </tr>
        </tbody>
      </table>`,
  }),
}
