import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Deliberately NOT using @quasar/vite-plugin or anything from ../src —
// this prototype is a pixel recreation of Spartan's own UI.
export default defineConfig({
  plugins: [vue()],
  base: './',
})
