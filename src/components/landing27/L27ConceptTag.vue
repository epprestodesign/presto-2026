<script setup>
// L27ConceptTag — required on every concept page: makes clear this is an
// EventPipe design exploration, not an official IMEX page.
import './l27.css'
defineProps({
  label: { type: String, default: '' },
  // fixed → pinned top-right of the viewport; inline → flows in the layout.
  position: { type: String, default: 'fixed' },
})
</script>

<template>
  <div class="l27ct" :class="`l27ct--${position}`" role="note">
    <span class="l27ct__dot" aria-hidden="true" />
    <span><strong>Concept{{ label ? ' · ' + label : '' }}</strong> — EventPipe exploration, not affiliated with IMEX</span>
  </div>
</template>

<style scoped>
.l27ct { display: inline-flex; align-items: center; gap: 8px; padding: 7px 12px; border-radius: 999px; background: #1D1D1B; color: #fff; font-family: 'Figtree', system-ui, sans-serif; font-size: 0.75rem; line-height: 1.2; box-shadow: 0 8px 20px -8px rgba(0,0,0,.4); }
/* Bottom-left: clear of nav buttons, sticky bars (top) and the floating badge (bottom-right). */
.l27ct--fixed { position: fixed; left: 12px; bottom: 12px; z-index: 2600; max-width: calc(100vw - 24px); }
.l27ct__dot { width: 8px; height: 8px; border-radius: 50%; background: #FFD100; flex: none; }
@media (max-width: 640px) { .l27ct { font-size: 0.6875rem; } }
</style>
