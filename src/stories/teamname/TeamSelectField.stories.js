// TEAM NAME QUALIFIERS / Book Reservation / Team Name Select — the single-team
// selection widget used on the Book Reservation checkout contact step. A
// searchable dropdown (radio list) with a "My team isn't listed" path to an
// inline add-team form (Org/Team name + Age division + Gender, with a "saved as"
// preview) and an "I'm not with a team" option.
import { ref } from 'vue'
import TeamSelectField from '../../components/teamname/TeamSelectField.vue'

export default {
  title: 'Team Name Qualifiers/Book Reservation/Team Name Select',
  component: TeamSelectField,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: `
## Team Name Select — Book Reservation

The **single-team** version of the group-block team picker, used as the
**Team name** field on the Book Reservation contact step. Click to open: search,
pick one team (radio), **My team isn't listed** → inline add-team form (Org/Team
name + required **Age division / Gender**, with a live *"TEAM WILL BE SAVED AS"*
preview), or **I'm not with a team**.
` } } },
}

/** Default — empty, click to open the dropdown. */
export const Default = {
  name: 'Searchable Team Select',
  render: () => ({
    components: { TeamSelectField },
    setup: () => ({ model: ref('') }),
    template: `<div style="max-width:560px">
      <label style="font-size:0.8125rem;font-weight:600;display:block;margin-bottom:6px">Team name <i style="color:var(--ds-color-text-danger);font-style:normal">*</i></label>
      <team-select-field v-model="model" />
      <p style="margin-top:14px;color:var(--ds-color-text-subtle);font-size:0.875rem">Selected: <strong>{{ model || '—' }}</strong></p>
    </div>`,
  }),
}

/** Preselected — a team already chosen. */
export const Preselected = {
  name: 'Preselected Team',
  render: () => ({
    components: { TeamSelectField },
    setup: () => ({ model: ref('A3 16 Elite') }),
    template: `<div style="max-width:560px"><team-select-field v-model="model" /></div>`,
  }),
}
