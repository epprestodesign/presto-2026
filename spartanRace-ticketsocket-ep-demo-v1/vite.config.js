import { fileURLToPath } from 'node:url'
import { realpathSync } from 'node:fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

// Two pages:
//   index.html  — the Spartan host site + checkout (plain Vue, NO design system)
//   presto.html — the embedded Eventpipe/Presto widget (hotel add-ons). This page
//                 uses the REAL presto-2026 library (Quasar + ../src components),
//                 rendered inside an iframe so its global styles can't touch the
//                 pixel-matched Spartan page — the same isolation a real embed gets.
const repoRoot = fileURLToPath(new URL('../', import.meta.url))
const libSrc = fileURLToPath(new URL('../src', import.meta.url))
// node_modules may be a symlink to the main checkout (git worktree) — allow its real path too.
const nodeModules = realpathSync(fileURLToPath(new URL('../node_modules', import.meta.url)))
const quasarVariables = fileURLToPath(new URL('../src/css/quasar.variables.scss', import.meta.url))

export default defineConfig({
  plugins: [vue({ template: { transformAssetUrls } }), quasar({ sassVariables: quasarVariables })],
  base: './',
  envDir: repoRoot, // shares the repo's VITE_GOOGLE_MAPS_API_KEY (.env is gitignored)
  resolve: { alias: { '@lib': libSrc } },
  server: { fs: { allow: [repoRoot, nodeModules] } },
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        presto: fileURLToPath(new URL('./presto.html', import.meta.url)),
      },
    },
  },
})
