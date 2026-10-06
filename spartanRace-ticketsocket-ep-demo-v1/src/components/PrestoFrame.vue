<script setup>
// Host side of the Eventpipe/Presto embed. Renders the widget page in an iframe
// (style isolation, like a real embed) and keeps the Spartan order in sync with
// it over postMessage — see src/presto/bridge.js for the protocol.
//
// Inline embeds auto-size to their content (the page scrolls, never the frame).
// When the widget opens a library modal (Filters sheet / map), the frame is
// pinned to the widget's visible area for the duration, so the modal is on
// screen but stays inside the widget — the rest of the checkout is untouched.
import { ref, reactive, watch, onMounted, onBeforeUnmount } from 'vue'
import { state, partySize } from '../store.js'

const props = defineProps({
  view: { type: String, default: 'addons' }, // addons | modal
  variant: { type: String, default: 'inline' }, // inline | modal
  fill: { type: Boolean, default: false }, // fill the parent (modal layer)
  skin: { type: String, default: 'presto' }, // presto | spartan (widget color skin)
  width: { type: Number, default: 600 },
})
const emit = defineEmits(['open-overlay', 'confirm', 'cancel'])

const wrap = ref(null)
const frame = ref(null)
const autoH = ref(320)
const pinned = reactive({ on: false, top: 0, left: 0, height: 0 })
const snapshot = () => JSON.parse(JSON.stringify({ parking: state.parking, photo: state.photo, hotelOn: state.hotelOn, hotel: state.hotel, party: partySize.value }))
// built once — later changes travel as 'sync' messages so the widget never reloads
const src = `./presto.html?view=${props.view}&variant=${props.variant}&skin=${props.skin}&s=${encodeURIComponent(JSON.stringify(snapshot()))}`
const post = (type, payload) => frame.value?.contentWindow?.postMessage({ source: 'spartan', type, payload }, '*')

// Contain library modals (Filters sheet, map) inside the widget: while one is
// open the frame is pinned to the part of the widget that's visible below the
// sticky checkout header, so the modal + its backdrop cover only the widget.
const MIN_VISIBLE = 520
function visibleBox () {
  const r = wrap.value.getBoundingClientRect()
  const head = document.querySelector('.co__bar')?.getBoundingClientRect().bottom || 0
  const top = Math.max(r.top, head)
  const bottom = Math.min(r.bottom, window.innerHeight)
  return { r, top, bottom, head }
}
function pin (open) {
  if (open && !pinned.on) {
    let b = visibleBox()
    // too little of the widget on screen? scroll it into view first
    if (b.bottom - b.top < MIN_VISIBLE) {
      const dy = b.r.top > b.head ? b.r.top - b.head - 8 : -(window.innerHeight - b.r.bottom)
      window.scrollBy(0, dy)
      b = visibleBox()
    }
    Object.assign(pinned, { on: true, top: b.top, left: b.r.left, height: Math.max(0, b.bottom - b.top) })
    post('scroll', { y: Math.max(b.top - b.r.top, 0) })
    document.body.style.overflow = 'hidden'
  } else if (!open && pinned.on) {
    pinned.on = false
    post('scroll', { y: 0 })
    document.body.style.overflow = ''
  }
}

function onMessage (e) {
  if (!frame.value || e.source !== frame.value.contentWindow) return
  const m = e.data
  if (!m || m.source !== 'presto') return
  if (m.type === 'resize' && !props.fill) autoH.value = m.payload.height
  else if (m.type === 'state') Object.assign(state, m.payload)
  else if (m.type === 'modal' && !props.fill) pin(m.payload.open)
  else if (m.type === 'open-overlay') emit('open-overlay')
  else if (m.type === 'confirm') emit('confirm', m.payload.hotel)
  else if (m.type === 'cancel') emit('cancel')
}
onMounted(() => window.addEventListener('message', onMessage))
onBeforeUnmount(() => {
  window.removeEventListener('message', onMessage)
  if (pinned.on) document.body.style.overflow = ''
})

watch(() => [state.parking, state.photo, state.hotelOn, state.hotel, partySize.value], () => post('sync', snapshot()), { deep: true })
</script>

<template>
  <div ref="wrap" class="pfw" :class="{ 'pfw--fill': fill }" :style="fill ? null : { width: width + 'px', height: autoH + 'px' }">
    <iframe
      ref="frame"
      class="pf"
      :src="src"
      scrolling="no"
      :title="view === 'modal' ? 'Eventpipe hotel finder' : 'Eventpipe add-ons'"
      :style="pinned.on ? { position: 'fixed', top: pinned.top + 'px', left: pinned.left + 'px', width: width + 'px', height: pinned.height + 'px', zIndex: 30, borderRadius: '8px' } : null"
    />
  </div>
</template>

<style scoped>
.pfw { position: relative; }
.pfw--fill { width: 100%; height: 100%; }
.pf { display: block; width: 100%; height: 100%; border: 0; background: transparent; }
</style>
