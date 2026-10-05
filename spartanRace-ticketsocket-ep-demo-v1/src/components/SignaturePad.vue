<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({ error: Boolean })
const emit = defineEmits(['change'])
const canvas = ref(null)
const strokes = []
let ctx, drawing = false

onMounted(() => {
  const c = canvas.value
  const dpr = window.devicePixelRatio || 1
  const r = c.getBoundingClientRect()
  c.width = r.width * dpr
  c.height = r.height * dpr
  ctx = c.getContext('2d')
  ctx.scale(dpr, dpr)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.lineWidth = 2.6
  ctx.strokeStyle = '#000'
})

const pt = (e) => {
  const r = canvas.value.getBoundingClientRect()
  return [e.clientX - r.left, e.clientY - r.top]
}
function down(e) {
  drawing = true
  canvas.value.setPointerCapture(e.pointerId)
  strokes.push([pt(e)])
}
function move(e) {
  if (!drawing) return
  strokes[strokes.length - 1].push(pt(e))
  redraw()
}
function up() {
  if (!drawing) return
  drawing = false
  emit('change', strokes.length > 0)
}
function redraw() {
  const c = canvas.value
  ctx.clearRect(0, 0, c.width, c.height)
  for (const s of strokes) {
    ctx.beginPath()
    s.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
    if (s.length === 1) ctx.lineTo(s[0][0] + 0.1, s[0][1])
    ctx.stroke()
  }
  hasInk.value = strokes.length > 0
}
const hasInk = ref(false)
function undo() {
  strokes.pop()
  redraw()
  emit('change', strokes.length > 0)
}
</script>

<template>
  <div class="sig" :class="{ 'sig--err': error }">
    <p class="sig__ph" aria-hidden="true">Add your<br />signature</p>
    <canvas
      ref="canvas"
      class="sig__canvas"
      aria-label="Signature pad — draw your signature"
      role="img"
      @pointerdown.prevent="down"
      @pointermove="move"
      @pointerup="up"
      @pointerleave="up"
    />
    <button class="sig__undo" type="button" :disabled="!hasInk" @click="undo">
      <svg viewBox="0 0 16 12" width="15" height="11" aria-hidden="true"><path d="M5 1 1.5 4.5 5 8M2 4.5h7.5a5 5 0 0 1 5 5V11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
      Undo
    </button>
  </div>
</template>

<style scoped>
.sig {
  position: relative;
  height: 155px;
  border: 1.5px solid transparent;
  border-radius: 8px;
  background: #f4f4f4;
}
.sig--err { border-color: var(--red-error); }
.sig__ph {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  text-align: left;
  color: #a0a0a0;
  font-size: 15.8px;
  line-height: 16px;
  pointer-events: none;
  padding-right: 14px;
}
.sig__canvas { position: absolute; inset: 0; width: 100%; height: 100%; touch-action: none; cursor: crosshair; }
.sig__undo {
  position: absolute;
  right: 12px;
  bottom: 9px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #a0a0a0;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.sig__undo:disabled { cursor: default; }
.sig__undo:not(:disabled):hover { color: #555; }
</style>
