// Presto widget bootstrap — mirrors .storybook/preview.js (and prototype/src/main.js)
// so the library components render exactly as they do in Storybook: same Quasar
// plugins, global Q-component registration, and DS stylesheets. No library
// files are copied or modified; everything imports from ../src via @lib.
import { createApp } from 'vue'
import { Quasar, Notify, Dialog, Loading } from 'quasar'
import * as QComponents from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/roboto-font/roboto-font.css'
import 'quasar/src/css/index.sass'
import '@lib/css/app.scss'
import { loadGoogleMaps } from '@lib/lib/googleMaps.js'
import PrestoApp from './PrestoApp.vue'

const app = createApp(PrestoApp)
app.use(Quasar, { plugins: { Notify, Dialog, Loading } })
for (const [name, c] of Object.entries(QComponents)) {
  if (/^Q[A-Z]/.test(name) && c && (c.render || c.setup || c.__name || c.name)) app.component(name, c)
}

// Seed the library's Maps loader with the build-time key (see prototype/src/main.js
// for why: the @lib copy of googleMaps.js can't see this app's env).
async function boot () {
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  if (key) {
    try { sessionStorage.setItem('ds-gmaps-key', key) } catch (e) { /* sandboxed */ }
    try { await loadGoogleMaps(key) } catch (e) { /* map falls back gracefully */ }
  }
  app.mount('#app')
}
boot()
