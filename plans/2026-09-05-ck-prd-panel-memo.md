# Panel memo: the `ck` phase-one PRD against the Opus PRD

> **Date:** 2026-09-05
> **Question:** Should the `ck` phase-one PRD change in light of the Opus-written PRD, its panel brief, and its workbench mockups?
> **Inputs under review:** [`plans/opus/2026-09-05-prd-code-katz.md`](opus/2026-09-05-prd-code-katz.md), [`plans/opus/2026-09-05-panel-review-brief.md`](opus/2026-09-05-panel-review-brief.md), [`plans/opus/2026-09-05-workbench-concepts.html`](opus/2026-09-05-workbench-concepts.html), against [`plans/2026-09-05-ck-plugin-prd-phase-1.md`](2026-09-05-ck-plugin-prd-phase-1.md)
> **Lenses that ran:** one. Fable 5.1 took the engineering lens from the brief (verify the load-bearing claims against current documentation), with the repos as extra evidence. The product and UX lenses did not run. This memo follows the brief's synthesis format anyway, so the gaps are visible.
> **Decision:** Will's. Recorded in section 7.

---

## 1. Input difference, stated first

The Opus PRD was written from the research proposal alone. It never mentions claude-conductor, the seven marketplace plugins, or team-cli's recorded decisions, and it repeats the proposal's persona count of 22. Some of its gaps are missing inputs, not weaker reasoning. The `ck` PRD had the repos and the docs as read on 2026-09-05; its gaps run the other way: engineering-complete, product-thin.

## 2. Agreement (low-information)

Both documents agree on: a plugin on native Claude Code primitives with no orchestration of its own; `/panel` in phase one; three lenses on Opus 5, Fable 5.1, and Sonnet 5 with a forced argument against the lens's own recommendation; a synthesis that surfaces disagreement and never resolves it; unanimous panels as a failure signal; a live activity view duplicating `/workflows`; a workflow editor as a trap; hooks as the telemetry spine.

Per the brief, agreement is either obviously true or a shared blind spot. Judgment: obviously true for the first six, because each follows from a documented constraint. The last two are shared judgment, not fact, and the Opus PRD's own sizing table is the only evidence for them.

## 3. Disagreement, both positions at full strength

| Topic | Opus PRD | `ck` PRD | What decides it |
|---|---|---|---|
| Who the design is for | Will's wife is the harder user and wins conflicts; she never approves in a UI, never sees a model name | Designed for Will: a ten-question interview, model names in a question, flags | Whether user 2 is the customer. Both authors say yes. Only Opus designed for it |
| How a human signs off | The file is the gate: read it, edit it, run the next command | A gate in the skill, using questions in the terminal; later, a review page with comments | The docs allow both. The file gate works for user 2; the review page works for both once its availability is proven |
| Where state lives | Artifacts at conventional committed paths; the plugin keeps no private state | A hidden run directory holds the brief, drafts, and memos, excluded from git | "The artifact is the state" survives a fresh session and a new machine; a hidden directory does not |
| Composing workflows | "There is no `workflow()` primitive" | `workflow()` exists, one level deep | The harness reference. Opus is wrong |
| Model policy | Effort first, then the Advisor, then a model switch; fallback on quota via a hook; pause mid-run to arbitrate | Tiers in agent files; one override in the panel; null-tolerant scripts; no mid-run pause | The docs: no mid-run input, and the hook fires only on a requested session switch. Opus's mechanism does not exist as described |
| Quality gates | Hooks reject malformed output with exit code 2 | Schema-forced output plus a validator agent inside the workflow | Plugin agents ignore per-agent hooks; the subagent hook's feedback path is undocumented |
| team-cli | Retired at Phase 1 (§1) or Phase 5 (§9) | Coexists; revisit at 90 days | Moot since 2026-09-08: Will decided `ck` is independent and the old tool must be uninstalled before use. Neither position stands (see §8) |
| Persona roster | 22; a core of 9 that omits Alex, Morgan, Sage, Jordan while tiering them | 21, all generated from upstream, prune on evidence | The repo has 21 profiles |

## 4. Kill conditions

**Engineering lens on the Opus PRD:** if a workflow cannot pause for input and `PreModelSwitch` cannot catch a subagent quota failure, then goal G3, principles P9 and P10, section 7.8, journey J2 step 6, and the Economics mockup's "Model resolution" table cannot be built as written. The docs show both. Met. This kills the "policy resolves the model" pillar, not the document.

**Engineering lens on the `ck` PRD:** if Will's wife cannot produce a PRD without answering an interview in a terminal or opening `.ck/`, the design as specified should not be built. The document shows this: section 7.3 requires ten answers before anything runs. Met. Changes A1 to A3 below exist to remove it.

## 5. Unique findings (one lens saw them)

1. The Opus PRD retires `TODOS.md`, which is a shipped marketplace plugin with its own repository and published posts. That is a product decision for that repository, not a line in this PRD.
2. The Opus workbench's persona editor writes `agents/toni.md` in place. An installed plugin is a copy under the user's plugin directory and is replaced on update, so edits there are lost. Any editor must write the source checkout and run the generator.
3. The Opus telemetry plan rebuilds cost parsing that claude-conductor already has, fixture-fenced, with a pricing table.
4. The Opus PRD's "prior stages replay from cache" holds only within one session or a resumed one. A fresh session needs a start-at-stage argument that reads artifacts from disk. The Opus PRD describes that mechanism in §7.4 and then contradicts it in §7.11.
5. The Opus PRD never states the plugin's `name`, which fixes the `/katz:` prefix.
6. The mockups' colour code (hue for model, shade for effort) passes only because each block also carries a text label. The swatch legend alone would not.

## 6. What nobody checked

- Whether the Artifact tool (the review page) is available in Will's local Claude Code, as opposed to this web session. It is now a Phase 0 spike.
- Whether `agentType` with a frontmatter model honors the tier inside a running workflow. Both PRDs assume it. Phase 0 spike.
- Whether a nested workflow prompts for consent separately. Phase 0 spike.
- A user-2 test of the panel's own output: can she read a decision memo and act on it. Neither PRD has one.
- The panel brief's model table swaps the marketing lens for an engineering lens while saying it matches the PRD. Fine for reviewing a PRD; not what it claims.

## 7. Decision and record

Will's decision, 2026-09-05: keep the `ck` PRD as the base and adopt nine changes from the Opus PRD plus the review-page idea. Rejections carry the reason.

### Adopted

| # | From the Opus PRD | Change to the `ck` PRD |
|---|---|---|
| A1 | Users table, journey J1, failure rules, "done when she produces a PRD without touching a file" | Users table and J1 added; the three failure rules adopted; user-2 done criterion added |
| A2 | `brief` before `prd`; the file is the gate | `/ck:brief` added; the interview becomes optional; Gate 1 is a review page with a file-edit fallback |
| A3 | The artifact is the state; conventional committed paths | `docs/brief.md`, `docs/PRD.md`, `docs/decisions/`; the run directory becomes a cache; resume by start-at stage |
| A4 | Each lens reads different evidence | Per-lens `reads` list in the panel |
| A5 | Persona sets the model floor; the stage sets effort | Effort per stage in scripts; never in persona files |
| A6 | Phase 0 spikes | Phase 0 added with five spikes; the `PreModelSwitch` spike is answered: no |
| A7 | `/next` | `/ck:next` promoted to phase one |
| A8 | Three persona scopes | Adopted as the shape of the 90-day prune; all 21 still generated from upstream |
| A9 | Goals with a measure each | Goals table |
| A10 | (Will's idea, neither PRD) | Review pages with comments as the feedback channel for documents and mockups |

### Rejected, with reasons

| # | Opus PRD claim | Reason |
|---|---|---|
| W1 | No `workflow()` primitive | It exists, one level deep |
| W2 | Pause a running workflow to arbitrate | Workflows accept no mid-run input; contradicts its own P6 |
| W3 | Quota fallback via `PreModelSwitch` | The hook fires on a requested session switch only |
| W4 | Gates via `Stop` or `TaskCompleted` hooks | Wrong event for subagents; feedback path undocumented; plugin agents ignore per-agent hooks |
| W5 | Retire team-cli at Phase 1, or Phase 5 | Contradiction between the two sections. Superseded on 2026-09-08 by Will's decision (§8) |
| W6 | 22 personas; a core list that omits four it tiers | The repo has 21; the split is inconsistent |
| W7 | Retire `TODOS.md` | Out of scope; a shipped plugin |
| W8 | `maxBudgetUsd` in agent frontmatter | Not in the documented frontmatter table |
| W9 | Persona editor writes the installed agent file; telemetry ignores conductor | Installed copies are replaced on update; conductor already parses cost |
| W10 | `commands/` for persona switches | The docs say new plugins use `skills/` |
| W11 | Re-runs replay from cache | Only within a session; a fresh session needs start-at |

### Panel health

Agreement rate cannot be computed from one lens. The brief's threshold ("above roughly two-thirds agreement the panel is theater") is recorded as the target for when `/ck:panel` runs this comparison properly, with three lenses that have not seen each other.

## 8. Superseded by Will's review of 2026-09-08

Will reviewed revision 2 of the `ck` PRD on its review page and left sixteen comments. Where they touch this memo:

| Item here | What Will decided | Effect on this memo |
|---|---|---|
| §3 row "team-cli", W5 | `ck` is independent; the old tool must be uninstalled before use; neither retire nor coexist is a consideration | Both positions moot. The row and W5 are annotated above, not deleted |
| §2 agreement "three lenses on Opus 5, Fable 5.1, and Sonnet 5" | Fable where judgment matters, Sonnet where volume matters: six judgment seats on Fable 5.1, eleven craft seats on Opus 5, four execution seats on Sonnet 5 | The panel default becomes River on Fable 5.1, Toni on Opus 5, Kai on Sonnet 5. The agreement stands; the assignment changed |
| A1 "she never sees a model name" | Clare is proficient, not fragile; she runs many sessions; consistency and efficiency are her needs | Kept as house style, dropped as a hard rule. Users table rewritten around Clare (PRD §2.2) |
| A8 "all 21 still generated from upstream" | `ck` owns its profiles; one-time import, no vendoring | Generated from `ck/profiles/` |
| §6 "whether the Artifact tool is available locally" | Reviews go through Claude's built-in review and comment system, in the desktop app or at claude.ai | Still a Phase 0 spike (S5); the mechanism is now the specified one, not an option |
| §1 "product-thin" | Phase one is the full definition pipeline plus `/ck:design`; the Workbench is phase three; `/ck:feature` is phase two with the question open | The PRD's §6, §10 |

The full record of the sixteen comments and the decision each drove is PRD §3.4.
