export const meta = {
  name: 'panel-spike',
  description: 'Phase 0 spike: two persona agents (one on its frontmatter model, one overridden) and one neutral web-search agent.',
  phases: [
    { title: 'Lenses', detail: 'ck:river on its frontmatter model; ck:toni overridden to Opus 5' },
    { title: 'Research', detail: 'one neutral agent runs one web search' },
  ],
  personas: ['river', 'toni'],
}

const REPLY = {
  type: 'object',
  properties: { firstWord: { type: 'string' }, text: { type: 'string' } },
  required: ['firstWord', 'text'],
}
const SEARCH = {
  type: 'object',
  properties: {
    searched: { type: 'boolean' },
    toolUsed: { type: 'string' },
    url: { type: 'string' },
    error: { type: 'string' },
  },
  required: ['searched', 'toolUsed', 'url', 'error'],
}

phase('Lenses')
const lenses = await parallel([
  () => agent('Say hello in one sentence. Put the first word of your answer in firstWord.',
    { label: 'river:frontmatter-model', phase: 'Lenses', agentType: 'ck:river', schema: REPLY }),
  () => agent('Say hello in one sentence. Put the first word of your answer in firstWord.',
    { label: 'toni:override-opus', phase: 'Lenses', agentType: 'ck:toni', model: 'claude-opus-5', schema: REPLY }),
])

phase('Research')
const research = await agent(
  'Run exactly one web search for: Claude Code dynamic workflows documentation. Return searched=true and the ' +
  'first result URL in url, with the name of the tool you used in toolUsed. If no web search tool is available ' +
  'to you, return searched=false, toolUsed="none", url="", and put the reason in error. Do not read any file.',
  { label: 'neutral:web-search', phase: 'Research', schema: SEARCH },
)

return {
  river: lenses[0],
  toni: lenses[1],
  research,
  pluginRoot: args && args.pluginRoot ? args.pluginRoot : null,
}
