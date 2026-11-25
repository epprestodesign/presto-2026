// EDGE CASES/04 · CHECKOUT/TEAMS BLOCK
// The Group Block teams block at its team limit, and with missing team details.
// The story itself lives in its component's story file (hidden there with
// excludeStories) and is shown here, so every edge case has one home.
import * as Src from '../checkout/GroupTeamsBlockStates.stories.js'

export default {
  ...Src.default,
  title: 'Edge Cases/04 · Checkout/Teams Block',
  id: 'edge-cases-checkout-teams-block',
  excludeStories: [],
  tags: ['edge-limits', 'edge-error', 'step-04', 'group-block'],
}

export const TeamLimit = { ...Src.MultipleTeams, name: 'Team Limit' }
export const ValidationErrors = { ...Src.ValidationErrors, name: 'Validation Errors' }
