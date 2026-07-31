<script setup>
// FilterRail — the Browse Hotels left-rail filter MODULE. It owns all the filter
// state and renders the field stack (FilterRailFields) TWICE from the same refs:
//   • desktop → inline in the left column
//   • phones  → inside a full-screen DsModal (same shell as the Price Details /
//     Availability dialogs) opened by the "Filters" trigger, with a sticky
//     "Show N results" footer.
// Rendering one shared state into both keeps desktop + mobile perfectly in sync.
import { ref, computed } from 'vue'
import DsModal from '../DsModal.vue'
import FilterRailFields from './FilterRailFields.vue'

// `exactOnly` is lifted so the page can react to it (the filtered edge case).
const props = defineProps({
  exactOnly: { type: Boolean, default: false },
  // Live result count — shown in the mobile dialog's "Show N results" CTA.
  resultCount: { type: Number, default: null },
})
const emit = defineEmits(['view-map', 'update:exactOnly'])

// Mobile dialog open state.
const open = ref(false)

const exactOnly = computed({
  get: () => props.exactOnly,
  set: (v) => emit('update:exactOnly', v),
})
const propertyQuery = ref('')
const brandSel = ref([])
const amenitySel = ref([])
// Default to a tight 0.25-mile radius on load so the map isn't crowded.
const radius = ref(0.25)
const budget = ref({ basis: 'night', max: '' })
const minStars = ref(0)
const roomSel = ref([])

function clearAll () {
  exactOnly.value = false
  propertyQuery.value = ''
  brandSel.value = []
  amenitySel.value = []
  radius.value = 0.25
  budget.value = { basis: 'night', max: '' }
  minStars.value = 0
  roomSel.value = []
}

const showLabel = computed(() =>
  props.resultCount == null
    ? 'Show results'
    : `Show ${props.resultCount.toLocaleString('en-US')} result${props.resultCount === 1 ? '' : 's'}`
)
</script>

<template>
  <div class="fr">
    <!-- Mobile-only trigger (hidden on desktop) — opens the DS modal. -->
    <button type="button" class="fr__toggle" :aria-expanded="open" @click="open = true">
      <span><q-icon name="tune" size="18px" /> Filters</span>
      <q-icon name="expand_more" size="22px" />
    </button>

    <!-- Desktop: the field stack rendered inline as the left column. -->
    <filter-rail-fields
      class="fr__inline"
      :exact-only="exactOnly"
      :property-query="propertyQuery"
      :brand-sel="brandSel"
      :amenity-sel="amenitySel"
      :radius="radius"
      :budget="budget"
      :min-stars="minStars"
      :room-sel="roomSel"
      @update:exact-only="exactOnly = $event"
      @update:property-query="propertyQuery = $event"
      @update:brand-sel="brandSel = $event"
      @update:amenity-sel="amenitySel = $event"
      @update:radius="radius = $event"
      @update:budget="budget = $event"
      @update:min-stars="minStars = $event"
      @update:room-sel="roomSel = $event"
      @view-map="emit('view-map')"
      @clear="clearAll"
    />

    <!-- Phones: the SAME fields inside the design-system modal (matches the
         Price Details / Availability dialog chrome). -->
    <ds-modal
      v-model="open"
      title="Filters"
      header-align="center"
      size="fullscreen"
      :z-index="4000"
    >
      <filter-rail-fields
        :exact-only="exactOnly"
        :property-query="propertyQuery"
        :brand-sel="brandSel"
        :amenity-sel="amenitySel"
        :radius="radius"
        :budget="budget"
        :min-stars="minStars"
        :room-sel="roomSel"
        @update:exact-only="exactOnly = $event"
        @update:property-query="propertyQuery = $event"
        @update:brand-sel="brandSel = $event"
        @update:amenity-sel="amenitySel = $event"
        @update:radius="radius = $event"
        @update:budget="budget = $event"
        @update:min-stars="minStars = $event"
        @update:room-sel="roomSel = $event"
        @view-map="emit('view-map')"
        @clear="clearAll"
      />
      <template #footer="{ close }">
        <button type="button" class="fr__showresults" @click="close">{{ showLabel }}</button>
      </template>
    </ds-modal>
  </div>
</template>

<style scoped>
.fr { background: transparent; }

/* Desktop: inline rail visible, the mobile trigger hidden. */
.fr__toggle { display: none; }

/* The "Show N results" button fills the modal's sticky footer. */
.fr__showresults {
  flex: 1; height: 52px; border: 0; border-radius: var(--ds-radius-button);
  background: var(--ds-color-background-brand-bold); color: #fff; font-family: inherit;
  font-weight: 700; font-size: 1rem; cursor: pointer;
}
.fr__showresults:hover { background: var(--ds-palette-navy-800, #0a1f4d); }

/* Phones: hide the inline rail, show the "Filters" trigger (a box matching the
   Sort control; HotelListPage's filter bar sets its final height/border). */
@media (max-width: 600px) {
  .fr__inline { display: none; }
  .fr__toggle {
    display: flex; align-items: center; justify-content: space-between; width: 100%; height: 56px;
    padding: 0 16px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-button);
    background: var(--ds-color-surface); color: var(--ds-color-text); font-family: inherit;
    font-weight: 700; font-size: 0.9375rem; cursor: pointer;
  }
  .fr__toggle > span { display: inline-flex; align-items: center; gap: 8px; }
}
</style>
