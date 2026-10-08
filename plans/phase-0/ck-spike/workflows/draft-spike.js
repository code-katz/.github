export const meta = {
  name: 'draft-spike',
  description: 'Phase 0 spike: runs panel-spike as a nested workflow by scriptPath, using the plugin root passed in args.',
  phases: [{ title: 'Nested', detail: 'workflow({scriptPath: pluginRoot + /workflows/panel-spike.js})' }],
  personas: ['river', 'toni'],
}

if (!args || !args.pluginRoot) throw new Error('draft-spike: args.pluginRoot is required')
phase('Nested')
let nested = null
let nestedError = null
try {
  nested = await workflow('ck:panel-spike', { pluginRoot: args.pluginRoot })
  log('draft-spike: nested by name ck:panel-spike worked')
} catch (e) {
  nestedError = e && e.message ? e.message : String(e)
  log('draft-spike: nested workflow failed: ' + nestedError)
}
return { nested, nestedError, nestedBy: 'name', pluginRootSeen: args.pluginRoot }
