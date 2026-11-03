// LANDING PAGE CONCEPTS '27 / Components / Add to Calendar — concept only.
import L27AddToCalendar from '../../components/landing27/L27AddToCalendar.vue'
import L27ConceptTag from '../../components/landing27/L27ConceptTag.vue'
import { frame } from './_helpers.js'

export default {
  title: "Landing Page Concepts '27/Components/Add to Calendar",
  component: L27AddToCalendar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: `
## Add to Calendar
Google, Outlook or .ics for Sept 27–30, 2027. Also shows the **Concept tag**
every concept page carries.
` } } },
}
export const Default = {
  name: 'Default',
  render: () => ({ components: { L27AddToCalendar, L27ConceptTag }, template: frame('<div style="display:flex;gap:16px;flex-wrap:wrap;align-items:center"><l27-add-to-calendar /><l27-add-to-calendar variant="dark" /><l27-concept-tag position="inline" /></div>') }),
}
