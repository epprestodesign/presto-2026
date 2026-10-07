<script>
// Module scope so defineProps()'s default can reference the team list — a
// script-setup local can't be referenced by the hoisted defineProps().
const DEFAULT_TEAMS = [
  'A3 16 Elite', 'A3 16 Red', 'A3 18 Heat', 'AVC ATL 12 Red', 'AVC ATL 12 White',
  'AVC ATL 13 Blue', 'Arsenal U12 Boys Select', 'Arsenal U14 Girls Gold',
  'Bulls U12 Boys Gold', 'Eagles SC 15 Premier', 'Falcons U10 Boys', 'Phoenix 16 National',
]
</script>

<script setup>
// TeamSelectField — the group-block team-selection widget, adapted as a single
// form field for the regular reservation flow. A dropdown with: a search box, a
// radio list of registered teams, a "My team isn't listed" path to an inline
// add-team form (Org/Team name + Age division + Gender, with a "saved as"
// preview), and an "I'm not with a team" option. `v-model` is the team name.
import { ref, reactive, computed, watch, onBeforeUnmount } from 'vue'

const AGE_DIVISIONS = ['U8', 'U10', 'U12', 'U14', 'U16', 'U18', 'U19', 'Open']
const GENDERS = ['Boys', 'Girls', 'Coed']
const NOT_WITH_TEAM = "I'm not with a team"

const props = defineProps({
  modelValue: { type: String, default: '' },
  teams: { type: Array, default: () => DEFAULT_TEAMS },
  error: { type: [Boolean, String], default: false },
})
const emit = defineEmits(['update:modelValue', 'blur'])

const open = ref(false)
const view = ref('list') // list | add
const query = ref('')
const localTeams = ref([...props.teams])
const selected = ref(props.modelValue || '')
watch(() => props.modelValue, (v) => { selected.value = v || '' })

const filtered = computed(() => localTeams.value.filter((t) => t.toLowerCase().includes(query.value.trim().toLowerCase())))
const displayValue = computed(() => selected.value || 'Search or select your team...')
const isPlaceholder = computed(() => !selected.value)

const pick = (name) => { selected.value = name; emit('update:modelValue', name); close() }
const chooseNoTeam = () => pick(NOT_WITH_TEAM)
function close () { open.value = false; view.value = 'list'; query.value = ''; emit('blur') }
function toggle () { open.value ? close() : (open.value = true) }

// Add-unlisted form.
const form = reactive({ name: '', ageDivision: '', gender: '' })
const savedAs = computed(() => [form.name.trim(), form.ageDivision, form.gender].filter(Boolean).join(' · '))
const addValid = computed(() => !!(form.name.trim() && form.ageDivision && form.gender))
function addTeam () {
  if (!addValid.value) return
  const name = form.name.trim()
  if (!localTeams.value.includes(name)) localTeams.value.unshift(name)
  form.name = ''; form.ageDivision = ''; form.gender = ''
  pick(name)
}

// Close on outside click.
function onDocClick (e) { if (open.value && !e.target.closest('.tsf')) close() }
watch(open, (v) => {
  if (v) document.addEventListener('mousedown', onDocClick)
  else document.removeEventListener('mousedown', onDocClick)
})
onBeforeUnmount(() => document.removeEventListener('mousedown', onDocClick))
</script>

<template>
  <div class="tsf">
    <button type="button" class="tsf__trigger" :class="{ 'is-open': open, 'is-error': error && !open }" @click="toggle">
      <span class="tsf__value" :class="{ 'tsf__value--ph': isPlaceholder }">{{ displayValue }}</span>
      <q-icon :name="open ? 'arrow_drop_up' : 'arrow_drop_down'" size="22px" class="tsf__caret" />
    </button>

    <div v-if="open" class="tsf__panel">
      <!-- LIST -->
      <template v-if="view === 'list'">
        <div class="tsf__search">
          <input v-model="query" type="text" placeholder="Search teams..." />
          <q-icon name="search" size="20px" />
        </div>
        <div class="tsf__list">
          <button
            v-for="t in filtered" :key="t" type="button"
            class="tsf__opt" :class="{ 'is-on': t === selected }" @click="pick(t)"
          >
            <span class="tsf__radio" :class="{ 'is-on': t === selected }"><span v-if="t === selected" class="tsf__dot" /></span>
            <span class="tsf__optlabel">{{ t }}</span>
          </button>
          <p v-if="!filtered.length" class="tsf__empty">No teams match “{{ query }}”.</p>
        </div>
        <button type="button" class="tsf__notlisted" @click="view = 'add'">My team isn't listed</button>
        <button type="button" class="tsf__noteam" @click="chooseNoTeam">I'm not with a team</button>
      </template>

      <!-- ADD UNLISTED -->
      <template v-else>
        <button type="button" class="tsf__back" @click="view = 'list'" aria-label="Back"><q-icon name="arrow_back" size="22px" /></button>
        <label class="tsf__field">
          <span>Org / Team name <i class="tsf__req">*</i></span>
          <input v-model="form.name" type="text" placeholder="e.g. Augusta Arsenal Volleyball Club" />
        </label>
        <div class="tsf__grid">
          <label class="tsf__field">
            <span>Age division <i class="tsf__req">*</i></span>
            <div class="tsf__selectwrap">
              <select v-model="form.ageDivision"><option value="" disabled>Select...</option><option v-for="a in AGE_DIVISIONS" :key="a" :value="a">{{ a }}</option></select>
              <q-icon name="unfold_more" size="18px" />
            </div>
          </label>
          <label class="tsf__field">
            <span>Gender <i class="tsf__req">*</i></span>
            <div class="tsf__selectwrap">
              <select v-model="form.gender"><option value="" disabled>Select...</option><option v-for="g in GENDERS" :key="g" :value="g">{{ g }}</option></select>
              <q-icon name="unfold_more" size="18px" />
            </div>
          </label>
        </div>
        <div class="tsf__saved">
          <span class="tsf__saved-h">TEAM WILL BE SAVED AS</span>
          <span class="tsf__saved-v" :class="{ 'tsf__saved-v--empty': !savedAs }">{{ savedAs || 'Fill in the fields above...' }}</span>
        </div>
        <p class="tsf__reqby">Age division and Gender required by this event's organizer</p>
        <button type="button" class="tsf__add" :class="{ 'is-disabled': !addValid }" :disabled="!addValid" @click="addTeam">Add Team</button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.tsf { position: relative; }
.tsf__trigger { width: 100%; height: 46px; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 0 10px 0 14px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md); background: var(--ds-color-surface); font-family: inherit; font-size: 0.9375rem; color: var(--ds-color-text); cursor: pointer; text-align: left; }
.tsf__trigger.is-open { border-color: var(--ds-color-border-focused); box-shadow: 0 0 0 1px var(--ds-color-border-focused); }
.tsf__trigger.is-error { border-color: var(--ds-color-text-danger); }
.tsf__value { font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tsf__value--ph { font-weight: 400; color: var(--ds-color-text-subtlest); }
.tsf__caret { color: var(--ds-color-text-subtle); flex: none; }

.tsf__panel { position: absolute; z-index: 60; top: calc(100% + 6px); left: 0; right: 0; border: 1px solid var(--ds-color-border-focused); border-radius: var(--ds-radius-md); background: var(--ds-color-surface); box-shadow: var(--ds-shadow-2); padding: 14px; }

/* search */
.tsf__search { position: relative; display: flex; align-items: center; margin-bottom: 8px; }
.tsf__search input { width: 100%; height: 44px; border: 1px solid var(--ds-color-border-focused); border-radius: var(--ds-radius-md); padding: 0 40px 0 14px; font-family: inherit; font-size: 0.9375rem; color: var(--ds-color-text); outline: none; }
.tsf__search .q-icon { position: absolute; right: 12px; color: var(--ds-color-text-subtle); pointer-events: none; }

/* list */
.tsf__list { max-height: 260px; overflow-y: auto; margin: 4px 0 8px; }
.tsf__opt { width: 100%; display: flex; align-items: center; gap: 12px; padding: 11px 10px; border: 0; border-radius: var(--ds-radius-md); background: none; cursor: pointer; text-align: left; font-family: inherit; }
.tsf__opt:hover { background: var(--ds-palette-slate-100); }
.tsf__opt.is-on { background: var(--ds-color-background-brand-subtle, var(--ds-palette-navy-50)); }
.tsf__radio { width: 20px; height: 20px; flex: none; border: 2px solid var(--ds-color-border-bold); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.tsf__radio.is-on { border-color: var(--ds-color-background-brand-bold); }
.tsf__dot { width: 10px; height: 10px; border-radius: 50%; background: var(--ds-color-background-brand-bold); }
.tsf__optlabel { font-size: 1rem; color: var(--ds-color-text); }
.tsf__opt.is-on .tsf__optlabel { color: var(--ds-color-text-brand); font-weight: 700; }
.tsf__empty { color: var(--ds-color-text-subtle); font-size: 0.875rem; padding: 10px; margin: 0; }

/* footer actions */
.tsf__notlisted { width: 100%; height: 48px; border: 1px solid var(--ds-color-border-brand); border-radius: var(--ds-radius-md); background: var(--ds-color-background-brand-subtle, var(--ds-palette-navy-50)); color: var(--ds-color-text-brand); font-family: inherit; font-weight: 700; font-size: 0.9375rem; cursor: pointer; }
.tsf__notlisted:hover { background: var(--ds-palette-navy-100, #e2e8f5); }
.tsf__noteam { width: 100%; height: 40px; margin-top: 6px; border: 0; background: none; color: var(--ds-color-text-subtle); font-family: inherit; font-size: 0.9375rem; cursor: pointer; }
.tsf__noteam:hover { color: var(--ds-color-text); text-decoration: underline; }

/* add form */
.tsf__back { width: 36px; height: 36px; border: 0; background: none; color: var(--ds-color-text); cursor: pointer; display: flex; align-items: center; margin-bottom: 4px; }
.tsf__field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.tsf__field span { font-size: 0.8125rem; font-weight: 600; color: var(--ds-color-text); }
.tsf__req { color: var(--ds-color-text-danger); font-style: normal; }
.tsf__field input { height: 46px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md); padding: 0 14px; font-family: inherit; font-size: 0.9375rem; color: var(--ds-color-text); outline: none; }
.tsf__field input:focus { border-color: var(--ds-color-border-focused); }
.tsf__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.tsf__selectwrap { position: relative; display: flex; align-items: center; }
.tsf__selectwrap select { width: 100%; height: 46px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md); padding: 0 38px 0 14px; font-family: inherit; font-size: 0.9375rem; color: var(--ds-color-text); background: var(--ds-color-surface); outline: none; appearance: none; -webkit-appearance: none; cursor: pointer; }
.tsf__selectwrap select:focus { border-color: var(--ds-color-border-focused); }
.tsf__selectwrap .q-icon { position: absolute; right: 12px; color: var(--ds-color-text-subtle); pointer-events: none; }
.tsf__saved { background: var(--ds-color-background-brand-subtle, var(--ds-palette-navy-50)); border-radius: var(--ds-radius-md); padding: 12px 14px; display: flex; flex-direction: column; gap: 4px; }
.tsf__saved-h { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.04em; color: var(--ds-color-text-brand); }
.tsf__saved-v { font-size: 1rem; font-weight: 700; color: var(--ds-color-text-brand); }
.tsf__saved-v--empty { font-weight: 400; font-style: italic; color: var(--ds-color-text-subtle); }
.tsf__reqby { text-align: center; color: var(--ds-color-text-subtle); font-size: 0.8125rem; margin: 14px 0; }
.tsf__add { width: 100%; height: 52px; border: 0; border-radius: var(--ds-radius-md); background: var(--ds-color-background-brand-bold); color: #fff; font-family: inherit; font-weight: 700; font-size: 1rem; cursor: pointer; }
.tsf__add:hover { background: var(--ds-palette-navy-800); }
.tsf__add.is-disabled { background: var(--ds-palette-slate-200); color: var(--ds-color-text-subtlest); cursor: not-allowed; }
</style>
