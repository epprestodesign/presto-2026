// Storybook test-runner config — runs an axe-core accessibility audit against
// every story headlessly (the CI WCAG 2.2 AA gate). Mirrors the live addon-a11y
// panel: same WCAG tag set, and it respects each story's `parameters.a11y`
// (stories with `a11y.test: 'off'` or `a11y.disable` are skipped — e.g. the
// Color Contrast audit story, which renders known-failing swatches on purpose).
//
// Blocking vs advisory: by default violations are REPORTED but do not fail the
// run (so the gate can land without blocking deploys on the existing backlog).
// Set A11Y_STRICT=true to make any violation fail the job.
import { getStoryContext } from '@storybook/test-runner'
import { injectAxe, configureAxe, checkA11y } from 'axe-playwright'

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']
const STRICT = process.env.A11Y_STRICT === 'true'

export default {
  async preVisit(page) {
    await injectAxe(page)
  },
  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context)
    const a11y = storyContext.parameters?.a11y
    if (!a11y || a11y.disable || a11y.test === 'off') return

    await configureAxe(page, { rules: a11y.config?.rules })
    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: { html: true },
      axeOptions: { runOnly: { type: 'tag', values: WCAG_TAGS } },
      // skipFailures=true → log violations without failing (advisory default).
    }, !STRICT)
  },
}
