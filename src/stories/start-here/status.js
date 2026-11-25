/* One place to set the status of a request, idea or folder.
 *
 * The sidebar (.storybook/manager.js) puts a coloured dot beside every folder
 * named here, and the docs pages use the same values for their status chip.
 * Change a status in this file and both update.
 *
 * Keys are sidebar folder names exactly as they appear. Only set a status you
 * know: a folder that isn't listed simply shows no dot. */

export const STATUSES = {
  'in-review': { label: 'In review', color: '#B86E00', bg: '#FFF4E0', meaning: 'Designed and waiting for feedback.' },
  approved: { label: 'Approved', color: '#1B47C2', bg: '#EAF0FF', meaning: 'Signed off by design and product. Ready to build.' },
  shipped: { label: 'Shipped', color: '#15803D', bg: '#E8F7EE', meaning: 'Live in the product.' },
  concept: { label: 'Concept', color: '#6B4EE6', bg: '#F1EDFF', meaning: 'An idea we are trying. Not asked for yet.' },
  replaced: { label: 'Replaced', color: '#6B7385', bg: '#F1F3F7', meaning: 'Superseded by newer work. Kept so old links open.' },
}

export const STATUS_BY_FOLDER = {
  // Design Requests
  'DES-478 · Experience Now': 'in-review',
  'Team Name Qualifiers': 'approved',
  'Custom Fees': 'approved',
  // Other Requests
  "Landing Concepts '27": 'in-review',
  'Partner Widgets': 'in-review',
  // Eventpipe Labs: everything here is a concept until it becomes a request.
  'Checkout All at Once': 'concept',
  'Booking Widget Ideas': 'concept',
  'Room Card Cart Ideas': 'concept',
  // Replaced work.
  'Earlier Rounds': 'replaced',
  'Old Payment Dialogs': 'replaced',
}
