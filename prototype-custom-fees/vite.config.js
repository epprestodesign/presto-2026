import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

// The design-system repo root (one level up from this prototype folder).
// The prototype imports the REAL library components from here — nothing is
// copied or forked. Deps (vue, quasar, plugins) resolve up the tree to the
// parent repo's node_modules; no local install needed.
const repoRoot = fileURLToPath(new URL('../', import.meta.url))
const libSrc = fileURLToPath(new URL('../src', import.meta.url))
const quasarVariables = fileURLToPath(new URL('../src/css/quasar.variables.scss', import.meta.url))

// When deployed as a Storybook sub-page on GitHub Pages the app is served from
// `/presto-2026/prototype-custom-fees/`; local dev serves from `/`. The base is
// passed at build time (the deploy workflow passes
// `--base=/presto-2026/prototype-custom-fees/`, Netlify `--base=/custom-fees/`).
export default defineConfig({
  plugins: [
    vue({ template: { transformAssetUrls } }),
    quasar({ sassVariables: quasarVariables }),
  ],
  resolve: {
    alias: {
      // Import library components/lib/assets via a stable alias, e.g.
      //   import GlobalNav from '@lib/components/GlobalNav.vue'
      '@lib': libSrc,
    },
  },
  server: {
    // 6200 — the booking journey keeps 6100 so both can run side by side.
    port: 6200,
    fs: {
      // Allow serving the library source, assets, credit-card SVGs, and
      // background imagery that live outside this prototype folder.
      allow: [repoRoot],
    },
  },
})
