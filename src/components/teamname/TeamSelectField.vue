<script>
// Module scope so defineProps()'s default can reference the team list — a
// script-setup local can't be referenced by the hoisted defineProps().
const DEFAULT_TEAMS = [
  'A3 16 Elite', 'A3 16 Red', 'A3 18 Heat', 'AVC ATL 12 Red', 'AVC ATL 12 White',
  'AVC ATL 13 Blue', 'AVC ATL 13 Gold', 'AVC ATL 13 Red', 'Arsenal U12 Boys Select',
  'Arsenal U14 Girls Gold', 'Bulls U12 Boys Gold', 'Eagles SC 15 Premier',
  'Falcons U10 Boys', 'Phoenix 16 National',
]
</script>

<script setup>
// TeamSelectField — the Team name field on the Book Reservation contact step.
// Supports both event setups (DES-461):
//   • team list SHOWN  → searchable dropdown (radio list) + "My team isn't
//     listed" (add form) + "I'm not with a team".
//   • team list HIDDEN → the add form renders inline as the field.
// Whenever a team is chosen, the organizer's qualifiers are still asked —
// Age division · Gender, each toggleable (DES-462). Choosing "I'm not with a
// team" adds one confirmation step that nudges toward entering a team (DES-463).
// v-model = team name · v-model:age-division · v-model:gender.
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import TeamAddForm from './TeamAddForm.vue'

const AGE_DIVISIONS = ['U8', 'U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U17', 'U18', 'U19', 'Open']
const GENDERS = ['Boys', 'Girls', 'Coed']
const NOT_WITH_TEAM = "I'm not with a team"

const props = defineProps({
  modelValue: { type: String, default: '' },
  ageDivision: { type: String, default: '' },
  gender: { type: String, default: '' },
  teams: { type: Array, default: () => DEFAULT_TEAMS },
  // Team name missing (red trigger / panel).
  error: { type: [Boolean, String], default: false },
  // Surface "Required" on empty qualifier fields.
  showErrors: { type: Boolean, default: false },
  // Event setup: hide the registered-team list (scenario 2).
  listHidden: { type: Boolean, default: false },
  // Event setup: which qualifiers the organizer requires.
  askAgeDivision: { type: Boolean, default: true },
  askGender: { type: Boolean, default: true },
  // Storybook: start open / on a given view — list | add | confirm.
  initialOpen: { type: Boolean, default: false },
  initialView: { type: String, default: 'list' },
})
const emit = defineEmits(['update:modelValue', 'update:ageDivision', 'update:gender', 'blur'])

const open = ref(props.initialOpen)
const view = ref(props.initialView === 'add' ? 'add' : 'list') // list | add
const confirming = ref(props.initialView === 'confirm') // DES-463 confirmation step
const editing = ref(false) // list hidden: re-open the inline form after saving
const query = ref('')
const localTeams = ref([...props.teams])
const selected = ref(props.modelValue || '')
watch(() => props.modelValue, (v) => { selected.value = v || '' })
watch(() => props.listHidden, () => { open.value = false; view.value = 'list'; confirming.value = false; editing.value = false })

const isNoTeam = computed(() => selected.value === NOT_WITH_TEAM)
const hasTeam = computed(() => !!selected.value && !isNoTeam.value)
const askAny = computed(() => props.askAgeDivision || props.askGender)
const askedCount = computed(() => (props.askAgeDivision ? 1 : 0) + (props.askGender ? 1 : 0))
const filtered = computed(() => localTeams.value.filter((t) => t.toLowerCase().includes(query.value.trim().toLowerCase())))
const displayValue = computed(() => selected.value || 'Search or select your team...')
const meta = computed(() => [props.askAgeDivision ? props.ageDivision : '', props.askGender ? props.gender : ''].filter(Boolean).join(' · '))

// DES-462 — qualifiers below the field once a team is picked from the list.
const showDetails = computed(() => !props.listHidden && hasTeam.value && askAny.value)
const missing = (key) => props.showErrors && !props[key]

function setDetails (age, gender) {
  emit('update:ageDivision', age || '')
  emit('update:gender', gender || '')
}
function commit (name) {
  selected.value = name
  emit('update:modelValue', name)
}
function close () {
  open.value = false; view.value = 'list'; query.value = ''; confirming.value = false
  emit('blur')
}
function toggle () { open.value ? close() : (open.value = true) }

// Picking a different listed team clears the old qualifiers — they belong to
// the team, so the guest confirms them again.
function pick (name) {
  if (name !== selected.value) setDetails('', '')
  commit(name)
  close()
}
function chooseNoTeam () {
  commit(NOT_WITH_TEAM)
  setDetails('', '')
  editing.value = false
  close()
}

// Add form (custom team) — both workflows.
const addForm = ref(null)
const addInitial = computed(() => (hasTeam.value ? { name: selected.value, ageDivision: props.ageDivision, gender: props.gender } : {}))
function onAdd ({ name, ageDivision, gender }) {
  if (!localTeams.value.includes(name)) localTeams.value.unshift(name)
  commit(name)
  setDetails(ageDivision, gender)
  editing.value = false
  close()
}
// "Enter my team name" on the confirmation step → back to entering a team.
function enterTeamName () {
  confirming.value = false
  if (props.listHidden) editing.value = true
  else view.value = 'add'
  nextTick(() => addForm.value?.focus())
}

// List hidden: show the inline form until a team is saved (or on Edit).
const showInlineForm = computed(() => !selected.value || editing.value)
function editTeam () { editing.value = true; confirming.value = false; nextTick(() => addForm.value?.focus()) }

// Close the dropdown on an outside click.
function onDocClick (e) { if (open.value && !e.target.closest('.tsf')) close() }
watch(open, (v) => {
  if (v) document.addEventListener('mousedown', onDocClick)
  else document.removeEventListener('mousedown', onDocClick)
}, { immediate: true })
onBeforeUnmount(() => document.removeEventListener('mousedown', onDocClick))
</script>

<template>
  <div class="tsf" :class="{ 'tsf--hidden': listHidden }">
    <!-- ── TEAM LIST SHOWN (scenario 1) ─────────────────────────────── -->
    <template v-if="!listHidden">
      <button type="button" class="tsf__trigger" :class="{ 'is-open': open, 'is-error': error && !open }" @click="toggle">
        <span class="tsf__value" :class="{ 'tsf__value--ph': !selected }">{{ displayValue }}</span>
        <q-icon :name="open ? 'arrow_drop_up' : 'arrow_drop_down'" size="22px" class="tsf__caret" />
      </button>

      <div v-if="open" class="tsf__panel">
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
          <button type="button" class="tsf__notlisted" @click="enterTeamName">My team isn't listed</button>
          <!-- DES-463: one confirmation step before "no team" -->
          <div v-if="confirming" class="tsf__confirm" role="alert">
            <p>Most guests are supporting a team. Please enter a team name if possible.</p>
            <div class="tsf__confirm-actions">
              <button type="button" class="tsf__confirm-btn tsf__confirm-btn--primary" @click="enterTeamName">Enter my team name</button>
              <button type="button" class="tsf__confirm-btn" @click="chooseNoTeam">No, I'm not with a team</button>
            </div>
          </div>
          <button v-else type="button" class="tsf__noteam" @click="confirming = true">I'm not with a team</button>
        </template>

        <template v-else>
          <button type="button" class="tsf__back" aria-label="Back to team list" @click="view = 'list'"><q-icon name="arrow_back" size="22px" /></button>
          <team-add-form ref="addForm" :ask-age-division="askAgeDivision" :ask-gender="askGender" @submit="onAdd" />
        </template>
      </div>

      <!-- DES-462: still ask Age division · Gender for a listed team -->
      <div v-if="showDetails" class="tsf__details">
        <div class="tsf__details-h">Additional team details</div>
        <p class="tsf__details-sub">This event's organizer needs a few more details to identify your team in their records.</p>
        <div class="tsf__grid" :class="{ 'tsf__grid--one': askedCount === 1 }">
          <label v-if="askAgeDivision" class="tsf__field">
            <span>Age division <i class="tsf__req">*</i></span>
            <div class="tsf__selectwrap">
              <select :value="ageDivision" :class="{ 'is-error': missing('ageDivision') }" @change="emit('update:ageDivision', $event.target.value)">
                <option value="" disabled>Select...</option>
                <option v-for="a in AGE_DIVISIONS" :key="a" :value="a">{{ a }}</option>
              </select>
              <q-icon name="unfold_more" size="18px" />
            </div>
            <small v-if="missing('ageDivision')" class="tsf__err">Required</small>
          </label>
          <label v-if="askGender" class="tsf__field">
            <span>Gender <i class="tsf__req">*</i></span>
            <div class="tsf__selectwrap">
              <select :value="gender" :class="{ 'is-error': missing('gender') }" @change="emit('update:gender', $event.target.value)">
                <option value="" disabled>Select...</option>
                <option v-for="g in GENDERS" :key="g" :value="g">{{ g }}</option>
              </select>
              <q-icon name="unfold_more" size="18px" />
            </div>
            <small v-if="missing('gender')" class="tsf__err">Required</small>
          </label>
        </div>
      </div>
    </template>

    <!-- ── TEAM LIST HIDDEN (scenario 2) ────────────────────────────── -->
    <template v-else>
      <div v-if="showInlineForm" class="tsf__inline" :class="{ 'is-error': error }">
        <button v-if="editing && selected" type="button" class="tsf__back" aria-label="Cancel edit" @click="editing = false"><q-icon name="arrow_back" size="22px" /></button>
        <team-add-form :key="editing ? 'edit' : 'new'" ref="addForm" :ask-age-division="askAgeDivision" :ask-gender="askGender" :initial="addInitial" :submit-label="hasTeam && editing ? 'Save Team' : 'Add Team'" @submit="onAdd" />
        <div v-if="confirming" class="tsf__confirm" role="alert">
          <p>Most guests are supporting a team. Please enter a team name if possible.</p>
          <div class="tsf__confirm-actions">
            <button type="button" class="tsf__confirm-btn tsf__confirm-btn--primary" @click="enterTeamName">Enter my team name</button>
            <button type="button" class="tsf__confirm-btn" @click="chooseNoTeam">No, I'm not with a team</button>
          </div>
        </div>
        <button v-else type="button" class="tsf__noteam" @click="confirming = true">I'm not with a team</button>
      </div>

      <!-- Saved: the added team (or "not with a team") + Edit -->
      <div v-else class="tsf__savedrow">
        <q-icon :name="isNoTeam ? 'person' : 'groups'" size="20px" class="tsf__savedrow-icon" />
        <div class="tsf__savedrow-text">
          <strong>{{ isNoTeam ? 'Not with a team' : selected }}</strong>
          <span v-if="meta && !isNoTeam">{{ meta }}</span>
        </div>
        <button type="button" class="tsf__edit" @click="editTeam">{{ isNoTeam ? 'Add a team' : 'Edit' }}</button>
      </div>
    </template>
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

/* search + list */
.tsf__search { position: relative; display: flex; align-items: center; margin-bottom: 8px; }
.tsf__search input { width: 100%; height: 44px; border: 1px solid var(--ds-color-border-focused); border-radius: var(--ds-radius-md); padding: 0 40px 0 14px; font-family: inherit; font-size: 0.9375rem; color: var(--ds-color-text); outline: none; }
.tsf__search .q-icon { position: absolute; right: 12px; color: var(--ds-color-text-subtle); pointer-events: none; }
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
.tsf__noteam { width: 100%; height: 40px; margin-top: 6px; border: 0; background: none; color: var(--ds-color-text-subtle); font-family: inherit; font-size: 0.9375rem; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
.tsf__noteam:hover { color: var(--ds-color-text); }
.tsf__back { width: 36px; height: 36px; border: 0; background: none; color: var(--ds-color-text); cursor: pointer; display: flex; align-items: center; margin-bottom: 4px; }

/* DES-463 confirmation step */
.tsf__confirm { margin-top: 10px; padding: 14px 16px; border: 1px solid var(--ds-palette-amber-200); border-radius: var(--ds-radius-md); background: var(--ds-palette-amber-50); text-align: center; }
.tsf__confirm p { margin: 0 0 12px; color: var(--ds-color-text); font-size: 0.875rem; line-height: 1.45; }
.tsf__confirm-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.tsf__confirm-btn { height: 36px; padding: 0 14px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-button); background: var(--ds-color-surface); color: var(--ds-color-text); font-family: inherit; font-weight: 600; font-size: 0.8125rem; cursor: pointer; }
.tsf__confirm-btn:hover { background: var(--ds-palette-slate-100); }
.tsf__confirm-btn--primary { border-color: var(--ds-color-border-brand); color: var(--ds-color-text-brand); font-weight: 700; }

/* DES-462 additional team details */
.tsf__details { margin-top: 16px; }
.tsf__details-h { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ds-color-text-subtle); }
.tsf__details-sub { margin: 4px 0 10px; color: var(--ds-color-text-subtle); font-size: 0.8125rem; line-height: 1.45; }
.tsf__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.tsf__grid--one { grid-template-columns: 1fr; }
@media (max-width: 560px) { .tsf__grid { grid-template-columns: 1fr; } }
.tsf__field { display: flex; flex-direction: column; gap: 6px; }
.tsf__field span { font-size: 0.8125rem; font-weight: 600; color: var(--ds-color-text); }
.tsf__req { color: var(--ds-color-text-danger); font-style: normal; }
.tsf__err { color: var(--ds-color-text-danger); font-size: 0.75rem; font-weight: 500; }
.tsf__selectwrap { position: relative; display: flex; align-items: center; }
.tsf__selectwrap select { width: 100%; height: 46px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md); padding: 0 38px 0 14px; font-family: inherit; font-size: 0.9375rem; color: var(--ds-color-text); background: var(--ds-color-surface); outline: none; appearance: none; -webkit-appearance: none; cursor: pointer; }
.tsf__selectwrap select:focus { border-color: var(--ds-color-border-focused); }
.tsf__selectwrap select.is-error { border-color: var(--ds-color-text-danger); }
.tsf__selectwrap .q-icon { position: absolute; right: 12px; color: var(--ds-color-text-subtle); pointer-events: none; }

/* DES-461 list hidden — inline add panel + saved row */
.tsf__inline { border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-md); background: var(--ds-color-surface-sunken); padding: 14px 16px 10px; }
.tsf__inline.is-error { border-color: var(--ds-color-text-danger); }
.tsf__savedrow { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-md); background: var(--ds-color-surface); }
.tsf__savedrow-icon { color: var(--ds-color-text-brand); flex: none; }
.tsf__savedrow-text { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.tsf__savedrow-text strong { color: var(--ds-color-text); font-size: 0.9375rem; }
.tsf__savedrow-text span { color: var(--ds-color-text-subtle); font-size: 0.8125rem; }
.tsf__edit { border: 0; background: none; padding: 4px 0; color: var(--ds-color-link); font-family: inherit; font-weight: 700; font-size: 0.875rem; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
</style>
