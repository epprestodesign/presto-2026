// TEAM NAME QUALIFIERS / Group Block / Contact & Teams — the group hold contact
// step: primary contact + the teams block (count → select & add teams; unlisted
// teams capture Org/Team name + Age division + Gender).
import { ref } from 'vue'
import TeamGroupContactBlock from '../../components/teamname/TeamGroupContactBlock.vue'

export default {
  title: 'Team Name Qualifiers/Group Block/Contact & Teams',
  component: TeamGroupContactBlock,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `
## Contact & Teams — Group Block

The Group Block (hold) contact step: the primary organizer contact beside the
**teams block** — step 1 picks how many teams, step 2 searches/selects and adds
them. Adding an unlisted team captures its **Age division + Gender** qualifiers.
` } } },
}

/** Group Hold — primary contact + the teams block. */
export const GroupHold = {
  name: 'Group Hold',
  render: () => ({ components: { TeamGroupContactBlock }, setup: () => ({ m: ref({}) }), template: `<div style="max-width:720px;margin:0 auto;padding:32px"><team-group-contact-block v-model="m" /></div>` }),
}
