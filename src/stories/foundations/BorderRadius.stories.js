/**
 * FOUNDATIONS / Border Radius
 * Tokens: --ds-radius-sm/md/lg/pill/button (src/css/tokens.scss).
 * $generic-border-radius and $button-border-radius (quasar.variables.scss)
 * drive Quasar's own components. The Scale story reads each value from the
 * live CSS, so this page can't drift from the code.
 */
import { ref, onMounted } from 'vue'

const TOKENS = ['sm', 'md', 'lg', 'button', 'pill']

const meta = {
  title: 'Design System/Foundations/Border Radius',
  id: 'foundations-border-radius',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Overview
Presto uses one corner size: **4px** on cards, inputs, buttons and choice chips.
The only other value is the **pill** (999px) for fully round shapes.

| Token | Value | Use |
| --- | --- | --- |
| \`--ds-radius-sm\` | 4px | small controls |
| \`--ds-radius-md\` | 4px | fields, menus, panels |
| \`--ds-radius-lg\` | 4px | cards, sheets, dialogs |
| \`--ds-radius-button\` | 4px | buttons |
| \`--ds-radius-pill\` | 999px | pills, avatars, round buttons |

The sm, md and lg tokens are all 4px today. They stay separate so one size can
change later without touching every component.

Quasar's global radius comes from \`$generic-border-radius\` and
\`$button-border-radius\` (both 4px, in \`quasar.variables.scss\`).

The squares below read their values from the live CSS.
`,
      },
    },
  },
}
export default meta

export const Scale = {
  render: () => ({
    setup() {
      const values = ref({})
      onMounted(() => {
        const css = getComputedStyle(document.documentElement)
        values.value = Object.fromEntries(TOKENS.map((t) => [t, css.getPropertyValue(`--ds-radius-${t}`).trim() || 'not set']))
      })
      return { radii: TOKENS, values }
    },
    template: `
      <div class="row q-gutter-lg">
        <div v-for="r in radii" :key="r" class="column items-center q-gutter-xs">
          <div class="bg-primary" :style="{ width: '88px', height: '88px', borderRadius: 'var(--ds-radius-' + r + ')' }"></div>
          <div class="text-caption">--ds-radius-{{ r }}</div>
          <div class="text-caption text-weight-bold">{{ values[r] }}</div>
        </div>
      </div>`,
  }),
}
