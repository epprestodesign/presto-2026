// Link check for the Storybook. Fails (exit 1) if a link would break.
//
// 1. Every story and docs id that existed before the 2026-11-25 sidebar
//    reorganisation (scripts/story-ids-baseline.json) must still exist, or be
//    redirected by MOVED in .storybook/manager.js to a page that exists.
//    These are the links already shared in Linear, Slack and docs.
// 2. Every MOVED target must exist.
// 3. Every <Go page="…"> and <Go to="…"> link in the MDX pages must point at a
//    page that exists.
//
// Usage, after `pnpm build-storybook`:
//   node scripts/check-story-links.mjs                       (reads storybook-static/index.json)
//   node scripts/check-story-links.mjs http://127.0.0.1:6006 (reads a running Storybook)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const arg = process.argv[2] || path.join(root, 'storybook-static/index.json')

const index = arg.startsWith('http')
  ? await (await fetch(arg.replace(/\/$/, '') + '/index.json')).json()
  : JSON.parse(fs.readFileSync(arg, 'utf8'))
const ids = new Set(Object.keys(index.entries))

const baseline = JSON.parse(fs.readFileSync(path.join(root, 'scripts/story-ids-baseline.json'), 'utf8')).ids

// MOVED is read from manager.js as text: entries look like 'old-id': 'docs/new-id',
const manager = fs.readFileSync(path.join(root, '.storybook/manager.js'), 'utf8')
const movedBlock = manager.slice(manager.indexOf('const MOVED = {'), manager.indexOf('\n}', manager.indexOf('const MOVED = {')))
const MOVED = Object.fromEntries([...movedBlock.matchAll(/'([^']+)':\s*'(?:docs|story)\/([^']+)'/g)].map((m) => [m[1], m[2]]))

// Storybook's own title → id rule (same as src/stories/start-here/_blocks.js).
const sanitize = (s) => s.toLowerCase()
  .replace(/[ ’–—―′¿'`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '-')
  .replace(/-+/g, '-').replace(/^-+/, '').replace(/-+$/, '')

const problems = []

let kept = 0, redirected = 0
for (const id of baseline) {
  if (ids.has(id)) { kept++; continue }
  const to = MOVED[id]
  if (!to) problems.push(`Old link broken, no redirect: ${id}`)
  else if (!ids.has(to)) problems.push(`Redirect points nowhere: ${id} → ${to}`)
  else redirected++
}
for (const [from, to] of Object.entries(MOVED)) {
  if (!ids.has(to)) problems.push(`MOVED target missing: ${from} → ${to}`)
}

const mdx = []
const walk = (dir) => {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name)
    if (f.isDirectory()) walk(p)
    else if (f.name.endsWith('.mdx')) mdx.push(p)
  }
}
walk(path.join(root, 'src'))
let goLinks = 0
for (const file of mdx) {
  const src = fs.readFileSync(file, 'utf8')
  for (const m of src.matchAll(/<Go\b[^>]*?\b(page|to)=(["'])(.*?)\2/g)) {
    goLinks++
    const target = m[1] === 'page' ? `${sanitize(m[3])}--docs` : m[3]
    if (!ids.has(target)) problems.push(`${path.relative(root, file)}: <Go ${m[1]}="${m[3]}"> → ${target} does not exist`)
  }
}

console.log(`Old links: ${kept} kept, ${redirected} redirected, of ${baseline.length}.`)
console.log(`MDX links checked: ${goLinks} in ${mdx.length} pages.`)
if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n- ` + problems.join('\n- '))
  process.exit(1)
}
console.log('All links resolve.')
