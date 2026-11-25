import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vite'
import { quasar } from '@quasar/vite-plugin'
import remarkGfm from 'remark-gfm'

const quasarVariables = fileURLToPath(
  new URL('../src/css/quasar.variables.scss', import.meta.url)
)

/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-themes',
    {
      // MDX ships without GFM, so every markdown table in a .mdx file rendered
      // as raw `| --- |` pipes (Architecture, Build Spec, the DES-478 and Team
      // Name Qualifiers overviews). remark-gfm restores tables, strikethrough,
      // task lists and autolinks. Same fix as the EventPipe admin Storybook.
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: { remarkPlugins: [remarkGfm] },
        },
      },
    },
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  docs: {},
  // The EventPipe logo and favicon (see manager.js and manager-head.html).
  staticDirs: ['./static'],
  // Hide Storybook's own onboarding checklist and "what's new" notices, so the
  // top of the sidebar is the library, not Storybook.
  features: { sidebarOnboardingChecklist: false },
  core: { disableWhatsNewNotifications: true },
  async viteFinal(baseConfig) {
    // Note: @storybook/vue3-vite already provides the @vitejs/plugin-vue
    // ('vite:vue') plugin. We must NOT add a second one — a duplicate Vue
    // plugin breaks .vue SFC compilation. Quasar's plugin auto-detects the
    // existing Vue plugin and slots in after it.
    return mergeConfig(baseConfig, {
      plugins: [quasar({ sassVariables: quasarVariables })],
    })
  },
}

export default config
