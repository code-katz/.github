# `ck` Plugin, Phase One: Product Requirements Document

> **Status:** PRD, ready for build
> **Date:** 2026-09-05
> **Author:** Fable (with Will Curran)
> **Derives from:** [`plans/2026-09-05-agent-workflows-research-and-proposal.md`](2026-09-05-agent-workflows-research-and-proposal.md) (the research proposal)
> **Supersedes:** the marketplace-retired decision in `claude-team-cli` (2026-07-31), for `ck` only; see §3.1
> **Scope:** phase one only: plugin skeleton, `/ck:prd` and `/ck:panel` end to end, 21 personas as subagents on the §5.6 tiers. Everything else is in §10

---

## 0. How to read this document

### 0.1 Grading

Every claim carries the proposal's grade, plus one more:

| Grade | Meaning |
|---|---|
| **[D]** | Product documentation, verified against the primary source on 2026-09-05. The URL is in Appendix G |
| **[M]** | Measured, independent, method stated (carried over from the proposal) |
| **[V]** | Vendor self-measured |
| **[R]** | The family's own record: a devlog entry, roadmap revision, or test in a code-katz repo |
| **[P]** | Practitioner assertion or judgment call. Open to challenge; the rationale is stated |

### 0.2 What this document is

The proposal is a research summary with a proposed shape. This is the specification for the first slice of that shape: what ships, what each piece must do, how it is tested, and what is deliberately left out. It contains acceptance criteria, schemas, and the full text of the two workflow scripts and two skills, as appendices.

### 0.3 The three answers up front

1. **It is a plugin.** Claude Code is the runtime for subagents, workflow scripts, and skills; nothing else can run them. No UI ships in phase one. The catalog view is a phase-two command that renders from files. A workbench is phase three, only if the files-as-workbench proves insufficient, and never a hosted app with its own store of definitions. See §4.7.
2. **The skill owns the gates; each span between gates is one workflow.** A sign-off point is not a workflow. It is a gate, and a gate can only live in the main session, because `AskUserQuestion` is removed from every subagent and a workflow cannot pause for input. See §4.2.
3. **`ck` coexists with `claude-team-cli`.** Phase one is additive. The three handoff routes survive: switch this session (team-cli), delegate one task (`ck:<name>`), open a separate session (team-cli). Retirement is revisited at 90 days with usage data. See §8.6.

---

## 1. Summary

`ck` is a Claude Code plugin. Phase one ships:

| Component | Count | What it is |
|---|---|---|
| Persona subagents | 21 | `agents/<name>.md`, generated from `claude-team-cli` profiles, registered as `ck:<name>`, model from the §5.6 tiers |
| Workflows | 2 | `/ck:panel` (three lenses on different models, one decision memo) and `/ck:prd-draft` (River drafts, a validator checks, the panel challenges, River synthesizes) |
| Skills | 2 | `/ck:prd` (the interactive entry point that owns both gates) and `prd-artifact` (the PRD contract: template, required fields, checklist) |
| Hooks | 1 | `SubagentStart` on `^ck:` appending one line per persona invocation to a usage log, so the 90-day prune has data |
| Tests | 1 suite | Manifest, drift against the pinned upstream, script lint, end-to-end drill |

Everything in the proposal's §5.3 catalog beyond these two commands, the hook-based gates, the model fallback chain, the Advisor tool, Routines, folding in the five artifact skills, persona switch skills, `/ck:map`, and any workbench are deferred with reasons in §10.

---

## 2. Problem, user, outcome

### 2.1 Problem

The unit of Will's work is the workflow, not the roster (proposal §2.1). Today the personas exist only as session takeovers and delegation subagents. They own no artifacts, so their output varies run to run (proposal §3.4). Multi-lens input on a decision requires opening three sessions by hand, and the three lenses run on one model, which is one opinion in three costumes (proposal §3.4, [M] error correlation rises with capability). Nothing is repeatable across projects, and nothing is measured, so the 22-persona question ("likely 15 more than are used", proposal §7) cannot be answered.

### 2.2 User

Customer zero: Will and his wife, building and maintaining real products (proposal §2, goal 3). The core requirement is team members that behave consistently, starting a product from an opportunity exploration, then a PRD, then a brand guide. Phase one covers the PRD step and the decision panel that every step uses.

### 2.3 Success metrics

| Metric | Target | How measured |
|---|---|---|
| Both commands run end to end on a real project | Before the phase-one release is tagged | The end-to-end drill in §9, run by hand on one of Will's projects, with the files listed in §6.9 and §7.10 present |
| Retention (proposal §3.4: the real metric for a personal tool) | At 30 days after install, at least one `/ck:prd` or `/ck:panel` run per week of active building | `${CLAUDE_PLUGIN_DATA}/usage.jsonl`, §5.5 |
| The panel disagrees | In more than half of panel runs, at least one lens recommends differently from the others, or at least one condition-to-say-no is unmet by the material | `panelFailedToDisagree` in each `decision-memo.md` |
| Leading indicator | Usage log entries in the first week | `usage.jsonl` |

A panel that always agrees is a failed panel (proposal §5.5). If the disagreement rate is low, the lenses or the question template are wrong, not the users.

### 2.4 Non-goals for phase one

- No workflow other than `panel` and `prd-draft`. The catalog in proposal §5.3 is phase two.
- No UI, dashboard, map, or workbench. `/workflows` is the run view (proposal §9, [D]).
- No retirement of `claude-team-cli`, no persona switch skills (`/ck:river`), no CLI in `bin/`.
- No hook-enforced artifact gates, no model fallback chain, no Advisor tool, no Routines.
- No persona pruning. All 21 port; the instrument ships; the cut list follows the data.
- No changes to the persona text. Profiles stay upstream; `ck` transforms them mechanically.

---

## 3. Decisions

### 3.1 Decisions on record that this PRD supersedes or honors

| Date | Decision and where it is recorded | What `ck` does | Grade |
|---|---|---|---|
| 2026-07-29 | No second source of persona truth. Local overrides and team-scoped profiles retired (team-cli `ROADMAP.md` revision history, `CONTRIBUTING.md`) | Honored. `ck/agents/` is generated from a byte-for-byte vendored copy of team-cli `profiles/` at a pinned commit, committed, and drift-tested. Editing a persona still means a PR or a fork upstream | [R] |
| 2026-07-31 | Marketplace publishing retired for team-cli, not deferred: `/akira` would become `/claude-team:akira`, and a plugin cannot put `claude-team` in the user's shell, so `launch` and `session` could not ship (team-cli `ROADMAP.md`, `DEVLOG.md`) | **Superseded for `ck` only.** `ck` accepts namespacing because the prefix is two characters, because workflows and subagents need no shell CLI, and because the things the 07-31 decision protected (`/akira`, `launch`, `session`, the coordinator) stay exactly where they are. team-cli's own decision stands | [R], [P] |
| 2026-07-04 | Conductor: keep and harden the local Node dashboard; JSONL parsing fenced with fixtures; plugin packaging (conductor `DEVLOG.md`) | Honored as precedent for any future viewer: local server plus browser, reading files on disk | [R] |
| 2026-07-25 | Conductor research branch: "drop Tauri, target local server + browser" | Honored. A desktop app is not on the table | [R] |
| proposal §9 | "Use `/workflows` and do not build a UI until it proves insufficient" | Honored in phase one. §4.7 says what would count as insufficient | [P] |

### 3.2 Decisions made in this PRD (the proposal's §8, resolved)

| # | Question (proposal §8) | Decision | Grade |
|---|---|---|---|
| 1 | Retire or coexist? | **Coexist.** `ck` is additive. team-cli keeps switch commands, coordinator, `launch`, `session`, `install.sh`. The three routes survive (§8.6). Revisit at 90 days with `usage.jsonl` | [P] |
| 2 | Workflow granularity vs sign-off | **The skill owns the gates; each span between gates that needs fan-out or verification is one workflow; a single-agent span runs inline via the Agent tool.** `/ck:prd` is a skill: Gate 0 → `prd-draft` workflow → Gate 1 → inline finalize. `/ck:panel` is a pure workflow: inputs are args, output is a memo, no gate. Full rule and the failure modes it must survive: §4.2, §4.3 | [D]-backed |
| 3 | Where artifacts live | **Final artifacts follow the family's convention per artifact type, committed.** A PRD defaults to `plans/<date>-<slug>-prd.md`, the location the plans skill already indexes and where this PRD itself lives; overridable at Gate 0. Run intermediates live under `.ck/runs/<run-id>/`, excluded via `.git/info/exclude`; a memo worth keeping is promoted with `/devlog`. The plugin never edits the user's `.gitignore` | [P] |
| 4 | Which personas survive? | **All 21 port now; prune at 90 days on evidence.** The port is generated, so carrying 21 costs nothing. No usage data exists, so a cut list today is a guess. The instrument ships in phase one (§5.5). This contradicts proposal §8.4 and agrees with proposal §7 | [P] |
| 5 | Panel model assignment | **River on Opus 5, Toni on Fable 5.1, Kai on Sonnet 5 by default,** overridable per run. `panel.js` is the one script allowed to set `model` on a persona agent, because per-invocation model beats frontmatter [D] and decorrelation is the point. The memo header states the limitation: one training pipeline, partial decorrelation. A lens that dies on an API error returns `null`; the memo runs on the survivors and says so | [P] |
| 6 | `/ck:feature` scope | **Deferred to phase two.** Both options recorded in §10.2 | deferred |
| 7 | Routines | **Deferred.** One constraint carried into phase one: `panel` must be runnable headless (no gate inside it), which it is. `prd` cannot be, by construction | deferred |
| 8 | Oracle for non-code artifacts | **A structural validator plus the human gate.** `skills/prd-artifact/SKILL.md` carries the checklist; a neutral Haiku agent checks the draft against it inside the workflow, with at most two revise loops; Gate 1 is the human oracle. Hook-based gates are a phase-two spike (§3.3 item 7) | [P] |

### 3.3 Corrections to the proposal

Each item names the proposal section, what is wrong, and what this PRD does instead.

1. **§5.1, plugin name.** The tree is rooted at `code-katz/` and every command is `/ck:...`. The command prefix is the plugin's `name` and cannot be opted out of [D]. The plugin is named `ck`. The repo is `code-katz/ck`.
2. **§5.1 vs §8.1, retire or coexist.** §5.1 says "retire the bash CLI"; §8.1 asks whether to. Resolved: coexist (§3.2 item 1). A plugin `bin/` directory is on the Bash tool's PATH [D], so a `ck` CLI for Claude's use is possible later; it still cannot reach the user's shell, which is what `launch` needs.
3. **§3.2, §5.1, §5.6, §7, roster count.** The proposal says 22. `profiles/` holds 21 personas and the 2026-09-04 devlog says twenty-one [R].
4. **§5.6, unassigned personas.** The tier table assigns 14 of 21. Reiner, Cornelius, Ernie, Rez, Tracy, Travolta, and Noon are unassigned. All seven are judgment or craft seats, so they go to Judgment (Opus 5); Reiner moves from Fable, the other six from Opus 4.8. Piper is Execution as listed. Result: 17 on Opus 5, 4 on Sonnet 5, none on Fable. Fable 5.1 and Haiku 4.5 are workflow-stage tiers, not persona tiers. §5.3 has the table.
5. **§5.5 vs §5.6, the panel contradiction.** "Each lens runs on a different model. Not negotiable" and "River, Toni, Kai: Opus 5" cannot both hold through frontmatter alone. Resolved by a per-invocation override in `panel.js` only (§3.2 item 5). Consequence for the PRD: tiers are defaults; the document says which script may override them (one) and which may not (every other).
6. **§5.6, where the tier re-base happens.** `tiers.conf` in team-cli names itself the single source of truth [R]. The re-base is a prerequisite PR to team-cli; `ck`'s generator copies the value verbatim. Recommendation for that PR: aliases (`opus`, `sonnet`) rather than full IDs, so a tier tracks the current generation and the resolved model is recorded per run by `/workflows` [D]. [P]
7. **§5.2 and §5.7, the gate mechanism.** "`TaskCompleted` or `Stop`, exit code 2, rejects malformed output." `Stop` is the main conversation's event; the subagent event is `SubagentStop`, whose exit-2 feedback path to the agent is not documented [D as read]; plugin agents ignore per-agent `hooks:` frontmatter [D]. Phase one validates inside the workflow: schema-forced output, which the harness retries on mismatch [D], plus a validator agent against the artifact checklist. Hook gates are a phase-two spike with a stated test.
8. **§5.6, fallback chain via `PreModelSwitch`.** The hook fires "before Claude Code applies a model switch that you or a client requested" [D]. Nothing says it covers subagent model selection or an API quota error. Phase-one resilience is null-tolerant scripts: a lens or stage that fails returns `null`, and the script continues and logs it. A real fallback is a phase-two spike.
9. **§8.4 vs §7.** "A cut list should precede the port" against "instrument and prune after 90 days." No data exists. Port everything and instrument (§3.2 item 4).
10. **§6, "no state file".** Script variables die with the run. A gate between two workflows requires the artifact on disk. `.ck/runs/` is the artifact directory, not a coordination state file in the conductor sense; the proposal's argument against a custom task graph and lock protocol still holds.
11. **§4.1 vs §3.4, what buys consistency.** §4.1 says repeatability "is the whole answer to goal 3"; §3.4 says consistency comes from the artifact contract. §3.4 is right. Workflows give the same process; artifact skills give the same shape. Phase one's most important file is `skills/prd-artifact/SKILL.md`, not `prd-draft.js`.
12. **§4.2, `maxBudgetUsd`.** Not in the subagent frontmatter table read today [D]. Not relied on.
13. **§9, the superseded plan.** `claude-conductor/plans/2026-09-04-agent-coordination-engine.md` is on no branch of that repo. Commit it, so the supersession is traceable.
14. **§5.2, the persona layer.** "Voice, domain constraints, model tier" omits that a subagent has no user to ask. Every persona's `## Required Interactive Behaviors` is written as questions to the user; unrewritten, it is dead text or a stall. §5.4 has the transform.
15. **§4.1, fan-out cache economics.** The prompt-cache sharing described there applies to agents matching on model, effort, agent type, tools, schema, and cwd [D]. A persona panel is three agent types on three models and shares nothing. The cost model in Appendix F assumes no sharing.

What the proposal gets right and this PRD keeps unchanged: §3 (topology, not persona strings, is the lever; buy quality with a different model and a real oracle), §4.3 (Agent Teams is not the executor), §5.2 (the four layers), §5.5 (forced self-disagreement; three approvals is a failed panel), §6 (the not-building list), §7 (the honest assessment), §9 (the UI stance).

---

## 4. Architecture

### 4.1 The four layers and their phase-one instances

| Layer | Primitive | Owns | Phase-one instance |
|---|---|---|---|
| Workflow | `workflows/*.js` | The order of stages, outside the conversation | `panel.js`, `prd-draft.js` |
| Persona | `agents/*.md` | Voice, domain constraints, default model tier | 21 generated files, `ck:<name>` |
| Artifact | `skills/*/SKILL.md` | Output template, required fields, checklist | `prd-artifact` |
| Gate | The skill in the main session | Sign-off, using `AskUserQuestion`; plus schema-forced output and a validator agent inside the workflow | `prd` (Gate 0, Gate 1); `panel.js` and `prd-draft.js` schemas |

The proposal put the gate layer in `hooks/hooks.json`. Phase one puts human gates in the skill and machine gates in the scripts (§3.3 item 7). The hook that does ship is instrumentation, not enforcement.

### 4.2 The gate rule

The docs: "No mid-run user input. Only agent permission prompts can pause a run. For sign-off between stages, run each stage as its own workflow." [D] And: `AskUserQuestion` is removed from every subagent [D].

Therefore:

1. A sign-off is a **gate**. A gate runs in the main session, inside a skill, with `AskUserQuestion`.
2. The span between two gates is a **workflow** when it needs fan-out, structured output, or resume. A span that is one agent runs inline through the Agent tool; a workflow for one agent buys nothing.
3. A workflow never contains a decision point. A skill never fans out by hand.
4. A skill or slash command whose instructions say to call Workflow is explicit opt-in [D]; no `ultracode` keyword, no "use a workflow" phrase is needed.

Rejected alternatives: one workflow per persona action (the skill would orchestrate fan-out itself, which is what Workflow exists to do); one workflow per command (impossible with a gate in the middle); no workflows (loses resume, schema validation, the progress view, and the "don't ask again for `<name>`" consent that plugin workflows get by name [D]).

What would make the rule wrong: subagents regaining `AskUserQuestion`, or workflows gaining a pause primitive. Neither is on the record.

### 4.3 Run directory contract

Every run has an id and a directory. The skill mints both; workflows receive them in `args`; agents do all reading and writing under the directory (the script has no filesystem access [D]).

```
.ck/runs/<run-id>/
├── run.json            { runId, createdAt, status, outputPath, lenses, harnessRunId, scriptPath }
├── brief.md            Gate 0 output, appended answer by answer
├── draft-v0.md         River's first draft (prd-draft)
├── prd-draft.md        River's synthesis after the panel (prd-draft)
├── panel/<persona>.json  one file per lens
├── decision-memo.md    the panel's synthesis
└── gate-1.md           Gate 1 answers and edits (prd)
```

Rules, each of which closes a failure mode found in review:

| Rule | Failure it closes |
|---|---|
| `run-id` is `<UTC timestamp>-<slug>`, minted by the skill with `date -u`; workflows receive `timestamp` in `args` because `Date.now()` throws in scripts [D] | Non-deterministic scripts break resume |
| `runDir` is passed **absolute** in `args` | Subagents inherit the session cwd; a user in a subdirectory would get `.ck/` in the wrong place |
| The skill appends each Gate 0 answer to `brief.md` as it is given, and on entry offers to resume any run with a `brief.md` but no `prd-draft.md` | Compaction in the middle of Three Whys loses the answers |
| The skill writes the Workflow tool's own run id into `run.json` as `harnessRunId` before it waits | Without it, a compacted or `--resume`d session cannot `resumeFromRunId` and re-runs the workflow at full cost |
| The skill adds `.ck/` to `.git/info/exclude` on first use, never to `.gitignore` | team-cli's `session done` refuses untracked files [R, tests/run.sh]; a run inside a session worktree would block closing it |
| Every agent that writes returns the path it wrote, in its schema | The script cannot check the filesystem; the next stage needs the path |
| Final artifacts are written outside `.ck/` at the path chosen at Gate 0 | Intermediates stay excluded; the deliverable is committed |

### 4.4 Naming

- Plugin `name`: `ck`. Everything is `/ck:<name>` or `ck:<name>` [D].
- Skills: `prd` (user-invocable, `disable-model-invocation: true`), `prd-artifact` (not user-invocable; read by agents and loadable by Claude when writing any PRD).
- Workflows: `panel`, `prd-draft`. A plugin workflow is itself a slash command [D], so `/ck:panel` and `/ck:prd-draft` both appear in autocomplete. `prd-draft` is safe to run directly if a `brief.md` exists; the skill is the supported path.
- No name is shared between a skill and a workflow, because both occupy `/ck:<name>`.
- Agents: `river`, `akira`, ... in frontmatter (no colon allowed [D]); registered as `ck:river`, referenced as `agentType: 'ck:river'` in scripts and `subagent_type: "ck:river"` from the Agent tool.

### 4.5 Model policy

| Agent kind | Where the model comes from | Who may override |
|---|---|---|
| Persona agent (`agentType: 'ck:<name>'`) | Frontmatter `model:` from the §5.6 tiers, via `tiers.conf` upstream | `panel.js` only, for lens decorrelation |
| Neutral utility agent (no `agentType`): validator, synthesis | The script sets `model` explicitly for the validator (Haiku 4.5, classification tier); synthesis inherits the session model | The script |
| The main session (gates, finalize) | The user's session model | The user |

Precedence is per-invocation → frontmatter → `CLAUDE_CODE_SUBAGENT_MODEL` → session [D]. `/workflows` shows the requested and any substituted model per agent [D]; that is the "resolved model recorded per run" the proposal asks for, at no cost.

### 4.6 What phase one deliberately does not build

Everything in proposal §6, plus: hook-enforced gates, a fallback chain, the Advisor tool, Routines, `/ck:next`, persona switch skills, a `bin/` CLI, any UI. Reasons are in §10.

### 4.7 Plugin, web app, wrapper, or dashboard

Will's question, answered with a recommendation:

1. **It is a plugin.** Subagents, workflow scripts, and skills execute only inside Claude Code. A web app cannot run them. The plugin is the product; nothing wraps it.
2. **Single source of truth rules out a hosted app with its own store.** The family retired local persona overrides twice on exactly this ground [R]. A web app that stores persona or workflow definitions recreates the problem. Anything that edits must edit the same files, and the change must flow through git, the generator, and the tests.
3. **`/workflows` is the run view** [D]: phases, agent counts, tokens, elapsed time, drill-down to any agent's prompt and result. What it does not show is the static catalog (which workflows exist; which personas, tiers, and models each stage uses) and the per-run interaction graph (which lens asked which lens what).
4. **The catalog is derivable from files.** Every `ck` workflow declares `phases` and a `personas` list in `meta` (§6.5, §7.5). `meta` is a pure literal [D], so it names the default roster, not a run-time choice. Phase two `/ck:map` emits a Mermaid graph (workflow → phase → persona → tier → model) with one agent and no infrastructure; `/ck:map --run <id>` draws the per-run graph from `panel/*.json`. GitHub renders Mermaid in Markdown.
5. **If a workbench is ever built**, decide its two halves separately. The *viewer* half reads and never owns; it could be a local page or a published Artifact generated from the plugin's files. The *editor* half must be local, because only a local process can run `generate-agents.sh` and `tests/run.sh` before a commit. The conductor precedent applies: local server plus browser, Tauri dropped [R], Python by preference. Build it only when the files-as-workbench is shown insufficient, which means a specific edit Will could not make in a text editor plus `bump-upstream.sh`.

---

## 5. Personas as subagents

### 5.1 Source of truth and vendoring

`claude-team-cli/profiles/<name>.md` and `profiles/tiers.conf` remain the only place persona text and tiers are edited [R]. `ck` vendors them:

- `upstream/profiles/*.md` and `upstream/tiers.conf`: byte-for-byte copies at a pinned commit.
- `scripts/upstream.lock`: `repo=https://github.com/code-katz/claude-team-cli` and `commit=<40-hex>`. Today's `main` is `b4b211fbf4ec6f4d365a550b55e9981610ed7dda`.
- `scripts/bump-upstream.sh <sha>`: fetches the commit, replaces `upstream/`, regenerates `agents/`, updates the lock, and prints the diff of `agents/`.

A byte copy at a pinned SHA with a CI equality check is a cache, not a second source. It keeps the drift test offline, matching team-cli's rule that network checks are opt-in (its link check runs on dispatch, not on push) [R]. [P]

### 5.2 Generation rule

`scripts/generate-agents.sh` is a fork of team-cli's generator [R] with the transform in §5.4. For each `upstream/profiles/<name>.md` except `coordinator*`:

```
---
name: <name>
description: <Display>, <Role>. Reviews and drafts from the <role, lowercase> perspective for ck panels and delegation; returns structured findings.
model: <the tiers.conf value, verbatim>
---

<!-- GENERATED from upstream/profiles/<name>.md at <commit> by scripts/generate-agents.sh; edit upstream, not this file. -->

<profile body with "## Required Interactive Behaviors" transformed per §5.4, "## Greeting" removed>

---

You are running as a delegated subagent. When the prompt names a run directory, read inputs from it and write outputs only there. If a schema is imposed, fill every required field; anything you would have asked goes in `questions`. Return findings first, detail after.
```

Frontmatter carries `name`, `description`, `model` and nothing else. Not set, with the reason:

| Field | Why not in phase one |
|---|---|
| `effort` | Would override the session effort for every panel run; keep the policy in one place (the session) until the drill shows a need |
| `tools`, `disallowedTools` | Agents must write under the run directory; per-path scoping is not available; revisit after the drill |
| `maxTurns` | Workflow caps are the budget guard in phase one |
| `color` | Cosmetic; the style guide assigns colors to projects, not personas |
| `permissionMode`, `hooks`, `mcpServers` | Ignored for plugin agents [D] |

### 5.3 Tier table

From proposal §5.6, with the seven unassigned personas placed by this PRD (§3.3 item 4). The `Model` column is what `tiers.conf` must say after the prerequisite team-cli PR (§8.4); `ck` copies it verbatim.

| Persona | Role | Tier | Model | Change from today |
|---|---|---|---|---|
| akira | Backend Engineering | Judgment | `claude-opus-5` | from Fable 5 |
| river | Product Manager | Judgment | `claude-opus-5` | from Fable 5 |
| morgan | Security Engineering | Judgment | `claude-opus-5` | from Fable 5 |
| sage | Business Advisor | Judgment | `claude-opus-5` | from Fable 5 |
| jordan | Data and ML | Judgment | `claude-opus-5` | from Fable 5 |
| reiner | Tabletop Game Designer | Judgment | `claude-opus-5` | from Fable 5 (placed by this PRD) |
| toni | Product Marketing | Judgment | `claude-opus-5` | from Opus 4.8 |
| kai | UX Design and Visual Art | Judgment | `claude-opus-5` | from Opus 4.8 |
| iris | Brand and Illustration | Judgment | `claude-opus-5` | from Opus 4.8 |
| quinn | Project Manager | Judgment | `claude-opus-5` | from Opus 4.8 |
| casey | Data Analyst | Judgment | `claude-opus-5` | from Opus 4.8 |
| cornelius | Military Historian | Judgment | `claude-opus-5` | from Opus 4.8 (placed by this PRD) |
| ernie | WW2 Narrative Author | Judgment | `claude-opus-5` | from Opus 4.8 (placed by this PRD) |
| rez | Cyberpunk Genre Advisor | Judgment | `claude-opus-5` | from Opus 4.8 (placed by this PRD) |
| tracy | Fantasy Genre Advisor | Judgment | `claude-opus-5` | from Opus 4.8 (placed by this PRD) |
| travolta | Fantasy Narrative Author | Judgment | `claude-opus-5` | from Opus 4.8 (placed by this PRD) |
| noon | Cyberpunk Narrative Author | Judgment | `claude-opus-5` | from Opus 4.8 (placed by this PRD) |
| sasha | Frontend Engineering | Execution | `claude-sonnet-5` | unchanged |
| alex | DevOps and Platform | Execution | `claude-sonnet-5` | unchanged |
| robin | QA and Testing | Execution | `claude-sonnet-5` | unchanged |
| piper | Tabletop Playtester | Execution | `claude-sonnet-5` | unchanged |

Workflow-stage tiers, set in scripts, never on a persona: Deep research, `claude-fable-5-1` (the panel's decorrelation lens in phase one; deep passes in phase two); Classification, `claude-haiku-4-5-20251001` (the validator).

Two [P] notes for the team-cli PR: (a) aliases `opus` and `sonnet` would let the tier follow the current generation without a file edit; the resolved model is recorded per agent in `/workflows` [D]; (b) moving River and Akira off Fable is a reasoning-tier downgrade for the two personas that write the PRD. The proposal's argument is price (Opus 5 at half) and Fable's cache advantage mattering most on long-horizon research. The 90-day usage data and the panel disagreement rate are the check; if PRD quality drops, the change is one line in `tiers.conf`.

### 5.4 The interactive-behavior rewrite

Every profile has a `## Required Interactive Behaviors` section written as questions to the user (River: Three Whys, V0 Challenge, Premortem). team-cli's generator strips it from the slash command and keeps it in the subagent [R]. A subagent cannot ask [D]. The transform is mechanical, identical for all 21 personas, and adds no per-persona prose:

1. Rename the heading to `## Required Behaviors (subagent form)`.
2. Insert directly under it:

   > You are running with no user present. Every behavior below still applies, in output form. Where a behavior tells you to ask, halt, interrupt, or require an answer before proceeding: do not stop. State the question verbatim under `questions` (addressed to `author` or to a named teammate), state the assumption you will proceed on, and proceed. Where a behavior produces an artifact (table, diagram, scenario, counter-proposal, pitch), produce it in full. Where it requires a decision from the user, give your recommendation with evidence and mark the decision as open.

3. Keep the upstream text verbatim beneath.

What the preamble makes River do, and what `prd-draft.js` asks for by name:

| Upstream behavior | Subagent form |
|---|---|
| Three Whys: ask "Why?" up to three times | Write the root-cause chain yourself from the brief (solution → why → why → why), each step more specific, until the user pain is exposed or the request is shown to address a symptom; say which. A why the brief cannot answer becomes a `questions` entry with your assumption |
| V0 Challenge: propose a V0 cutting half the scope and require a decision | Always include the V0 counter-proposal, what it cuts, whether it would still move the metric, and your recommendation with evidence. The decision stays with the author and is listed as open |
| Premortem: write the failure scenario and ask "What went wrong?" | Write the 2-3 sentence scenario in which this shipped on time and missed the metric, name the assumption it exposes, add that assumption to the Assumptions section, and leave the question verbatim for the author's gate |

The interactive versions of River's three behaviors live in `skills/prd/SKILL.md` for Gate 0 and Gate 1, where there is a user. A CI check asserts the skill carries the three behavior headings from `upstream/profiles/river.md`, so a renamed behavior fails the build instead of diverging silently (§9).

### 5.5 Instrumentation hook

`hooks/hooks.json`:

```json
{
  "description": "ck: persona usage log, so the 90-day prune has data",
  "hooks": {
    "SubagentStart": [
      {
        "matcher": "^ck:",
        "hooks": [
          { "type": "command", "command": "\"${CLAUDE_PLUGIN_ROOT}/scripts/usage-log.sh\"" }
        ]
      }
    ]
  }
}
```

`scripts/usage-log.sh` reads the hook's stdin JSON, appends one line `{"ts":"<UTC>","agent_type":"ck:<name>","session_id":"<id>","cwd":"<path>"}` to `${CLAUDE_PLUGIN_DATA}/usage.jsonl`, and always exits 0. Facts it relies on: `SubagentStart` matchers accept plugin-scoped names such as `^my-plugin:reviewer$`; stdin carries `agent_type` and `session_id`; `CLAUDE_PLUGIN_DATA` is exported to hook processes and survives plugin updates [D]. It never blocks: a logging failure must not stop a persona.

The 90-day review reads this file and answers proposal §8.4.

### 5.6 Acceptance criteria

- [ ] `agents/` holds exactly one file per `upstream/profiles/*.md` excluding `coordinator*` (21 today).
- [ ] Every agent's `model:` equals its `tiers.conf` line; `name:` equals the filename and contains no colon; `## Handoff Brief` present; `## Greeting` absent; the §5.4 preamble present; the generated-from comment names the lock's commit.
- [ ] Regenerating from `upstream/` produces no diff against the committed `agents/`.
- [ ] In a session with the plugin enabled, `@ck:river` appears in the subagent typeahead and `Agent({subagent_type: "ck:river", ...})` runs on `claude-opus-5` (visible in the transcript).
- [ ] After one `ck:` delegation, `${CLAUDE_PLUGIN_DATA}/usage.jsonl` has one new line with `agent_type` set.

---

## 6. `/ck:panel`

### 6.1 Purpose

Proposal goal 4: adversarial and complementary input on one decision, from the product lens, the marketing lens, and the UX lens, each on a different model, each forced to argue against itself. The output is a decision memo that shows where the lenses disagree and leaves the decision to the author (proposal §5.5).

### 6.2 Invocation

```
/ck:panel Should the first release include the branding guide step?
/ck:panel Is this PRD ready for review? --context plans/2026-09-05-thing-prd.md
/ck:panel <question> --lenses river:claude-opus-5,morgan:claude-fable-5-1,sasha:claude-sonnet-5
```

Claude passes the invocation as `args` [D]:

```json
{
  "runId": "20260905T210000Z-branding-step",
  "runDir": "/abs/path/.ck/runs/20260905T210000Z-branding-step",
  "pluginRoot": "/abs/path/to/ck",
  "timestamp": "20260905T210000Z",
  "question": "Should the first release include the branding guide step?",
  "contextPath": "/abs/path/plans/2026-09-05-thing-prd.md",
  "lenses": [{ "persona": "river", "lens": "product", "model": "claude-opus-5" }]
}
```

`runId`, `runDir`, `pluginRoot`, `timestamp`, and `question` are required; the script throws without them. Because a workflow is a slash command with no skill in front of it, the main session mints `runId` and `timestamp` with `date -u` and passes absolute paths, following the same instructions the `prd` skill carries; those instructions are duplicated in the workflow's `description` so a direct invocation still works.

### 6.3 Lenses and models

| Lens | Persona | Default model | Why this model |
|---|---|---|---|
| product | `ck:river` | `claude-opus-5` | River's own tier; the anchor lens |
| marketing | `ck:toni` | `claude-fable-5-1` | The strongest model on the lens most often under-argued in a product decision; also the most expensive lens (Appendix F) |
| ux | `ck:kai` | `claude-sonnet-5` | Completes three distinct models at the lowest added cost |

Any lens can be replaced or re-modelled per run. If two lenses share a model the script logs that their agreement counts as one opinion. The memo header always states: all lenses are Claude models from one training pipeline, so decorrelation is partial (proposal §8.5). [P]

### 6.4 Lens schema

Every lens returns, and writes to `panel/<persona>.json`:

| Field | Meaning |
|---|---|
| `recommendation` | `yes`, `no`, `yes-if`, `not-yet` |
| `position` | One paragraph |
| `reasoning` | Evidence from the material or the lens's domain, not from the other lenses |
| `strongestArgumentAgainstOwnRecommendation` | The best case a smart colleague would make against it; a weak one is a failed answer |
| `conditionThatWouldMakeMeSayNo` | The specific, checkable condition under which the lens reverses |
| `questionsForOtherLenses` | `[{to, question}]`, addressed to `author` or a lens persona |
| `handoffBrief` | Decisions to record, open risks in the domain, one direct question to a named lens |

The schema is enforced at the tool-call layer, so a lens that omits a field is retried by the harness [D].

### 6.5 Stages

`meta.phases` and `meta.personas` (for the phase-two map):

| Phase | Agents | What happens |
|---|---|---|
| Lenses | 3, in parallel, `agentType: 'ck:<persona>'`, `model` per lens | Each reads the context, applies its behaviors in subagent form, writes `panel/<persona>.json`, returns the object |
| Synthesis | 1, neutral (no `agentType`, session model) | Reads the three results, writes `decision-memo.md`, returns the memo object |

Four agents. One concurrency round on any machine with four or more CPUs. Full script: Appendix A.

### 6.6 Decision memo

`decision-memo.md` sections, in order:

1. Question and context (with the run id, timestamp, lens table, and the decorrelation limitation)
2. Recommendations: table, lens | persona | model | recommendation | one-line position
3. Where they agree
4. Where they disagree: topic, each position with its evidence, the decision the author must make
5. Each lens against itself, verbatim
6. Conditions to say no, verbatim
7. Questions between lenses, verbatim
8. Handoff briefs, verbatim, one per lens

The synthesis agent is neutral and holds no lens. It never averages positions or picks a winner. If every lens recommends the same thing and no self-argument is substantive, it sets `panelFailedToDisagree` and says in the header that the panel should be re-run with a different question or lens set.

### 6.7 Failure handling

| Failure | Behavior |
|---|---|
| A lens is stopped by the user or dies on an API error | `agent()` returns `null` [D]; the script logs which lens is missing and synthesizes on the survivors; the memo header says so |
| Every lens fails | The script throws; nothing is written; the session sees the error |
| Synthesis returns `null` | The script returns the raw lens results with `memoPath: null`; `panel/*.json` is on disk |
| Two lenses share a model | Logged; the run proceeds |

### 6.8 Cost

About $0.75 per run at today's prices, dominated by the Fable lens. Assumptions and arithmetic: Appendix F.

### 6.9 Acceptance criteria

- [ ] `/ck:panel <question>` in a session with the plugin enabled shows the consent prompt with the option "don't ask again for `ck:panel`" [D]; after consent it runs in the background and `/workflows` shows phases Lenses and Synthesis.
- [ ] `.ck/runs/<id>/panel/river.json`, `toni.json`, `kai.json` exist and validate against the lens schema; `decision-memo.md` exists with the eight sections.
- [ ] `/workflows` shows three different models on the three lens agents.
- [ ] Stopping one lens in `/workflows` produces a memo whose header names the missing lens.
- [ ] `--lenses` with a replaced persona and model is honored (visible in `/workflows` and in the memo's table).
- [ ] The memo of a deliberately one-sided question ("Should we keep the tests passing?") reports `panelFailedToDisagree: true`.
- [ ] The script passes §9 test 9: `node --check` on the body wrapped as an async function, and no `Date.now`, `Math.random`, `new Date()`, `require(`, or `import(`.

---

## 7. `/ck:prd`

### 7.1 Purpose

Proposal goal 3: a PRD that has the same shape every time, in every project, produced by River with the product, marketing, and UX lenses challenging it before the author sees it. The shape comes from the artifact contract (§7.8); the process comes from the skill and the workflow.

### 7.2 Invocation

```
/ck:prd
/ck:prd A branding-guide step between the PRD and the roadmap
```

The argument, if given, answers Q1 below. Everything else is asked.

### 7.3 Gate 0: intake, in the main session, as River

The skill reads `${CLAUDE_PLUGIN_ROOT}/agents/river.md` for voice; the interactive forms below are the skill's own text (a subagent cannot ask, so the skill carries the interactive versions of River's three behaviors). One `AskUserQuestion` per step. **Each answer is appended to `brief.md` as it is given.**

| Step | Question (River's wording) | Options |
|---|---|---|
| Resume check | If any `.ck/runs/*/brief.md` exists without a `prd-draft.md`: "Resume run `<id>` from `<timestamp>`, or start new?" | Resume, Start new |
| Q1 Proposal | "In one or two sentences, what do you want to build?" | free text (skipped when given as the argument) |
| Q2 Why 1 | "Why does that need to exist? What happens to the user today without it?" | free text; "That is the root cause"; "I am solving a symptom and I know it" |
| Q3 Why 2 | "Why is [answer] a problem worth solving now?" | same; stop early on either fixed option |
| Q4 Why 3 | "Why [answer]? What is underneath that?" | same |
| Q5 User | "Who exactly has this pain? One primary user." | options drawn from the answers, plus Other |
| Q6 Metric | "What single number moves if this works, by how much, by when? And what leading indicator will you watch?" | free text |
| Q7 Non-goals | "Name two or three things this will explicitly not do." | free text |
| Q8 V0 Challenge | River states a V0 cutting at least half the scope, then: "Would this still move [metric]?" | "Build the V0"; "Build the full scope"; "Full scope, and here is what specifically requires it" (free text) |
| Q9 Lenses | "Default panel (River on Opus 5, Toni on Fable 5.1, Kai on Sonnet 5), or name lenses and models?" | Default; custom |
| Q10 Output | "Where should the final PRD go?" | default `plans/<date>-<slug>-prd.md`; free text |

`brief.md` sections, in order: Proposal; Root-cause chain; User; Success metric and leading indicator; Scope decision and rationale; Non-goals; Lenses; Output path.

After Q10 the skill mints the run:

```bash
timestamp=$(date -u +%Y%m%dT%H%M%SZ)
runId="${timestamp}-<slug>"
runDir="$(pwd)/.ck/runs/${runId}"
mkdir -p "$runDir"
grep -qxF '.ck/' .git/info/exclude 2>/dev/null || echo '.ck/' >> .git/info/exclude
```

and writes `run.json` with `{runId, createdAt, status: "gate-0", outputPath, lenses}`.

### 7.4 Launch and wait

The skill calls, exactly:

```
Workflow({
  scriptPath: "${CLAUDE_PLUGIN_ROOT}/workflows/prd-draft.js",
  args: {
    runId, runDir, pluginRoot: "${CLAUDE_PLUGIN_ROOT}", timestamp,
    briefPath: "<runDir>/brief.md",
    lenses: <array or null>
  }
})
```

It writes the returned run id into `run.json` as `harnessRunId` together with `scriptPath`, sets `status: "drafting"`, tells the user the draft is running in the background, and **stops: it waits for the task notification. It does not poll, does not narrate, and does not start other work on this run.** If the notification reports a stop or failure, it offers `Workflow({ scriptPath, resumeFromRunId: harnessRunId })`, which replays completed agents from cache [D].

`${CLAUDE_PLUGIN_ROOT}` expands anywhere in skill content [D]. Whether `name: "ck:prd-draft"` also works for the Workflow tool is unverified (§10.2); `scriptPath` is the specified path.

### 7.5 The `prd-draft` workflow

`meta.personas: ['river', 'toni', 'kai']`. Full script: Appendix B.

| Phase | Agents | What happens | Output |
|---|---|---|---|
| Draft | 1, `ck:river` | Reads `brief.md` and the artifact contract. Writes `draft-v0.md` to the contract's section order. Tags every claim not taken from the brief `[C1]`, `[C2]`, ... so the lenses can address it. Root-cause chain and V0 counter-proposal in subagent form. No premortem yet | `draft-v0.md`; claims list; assumptions; V0; questions |
| Validate | 1 neutral, `claude-haiku-4-5-20251001`; then `ck:river` to revise, at most twice | Checks the draft against every item in the contract's checklist; returns `{valid, missing[], notes}`. On `missing`, River revises in place, keeping every `[C<n>]` tag. After two revisions the workflow proceeds and logs what is still missing | validation result |
| Panel | 4, nested `workflow({scriptPath: pluginRoot + '/workflows/panel.js'})` | Question: "Is this PRD ready for the author's review, and what would you change before it ships?" Context: `draft-v0.md`. Same lenses as Q9 | `panel/*.json`, `decision-memo.md` |
| Synthesize | 1, `ck:river` | Writes `prd-draft.md`: the PRD revised where the panel showed a claim wrong or unsupported; **Appendix A, Challenged claims** (claim, challenged by, severity, status ∈ upheld, revised, withdrawn, open; resolution; the panel's disagreements reproduced verbatim; nothing deleted); **Appendix B, Premortem** (the scenario, the exposed assumption, the question "What went wrong?" left verbatim for Gate 1) | `prd-draft.md`; challenged claims; premortem; open decisions |

Seven agents without a revision, up to nine with two. Under the default "medium" size guideline; two concurrency rounds on a 4-CPU laptop. If the nested panel throws, the workflow logs it and synthesizes without it, saying so in the PRD header.

### 7.6 Gate 1: review, in the main session, as River

The skill reads `prd-draft.md` and shows, in this order: the summary; the Challenged claims table; the open decisions; the premortem scenario verbatim. Then:

| Step | Question | Options |
|---|---|---|
| Premortem | "What went wrong?" | "The metric was wrong"; "The user was not who we thought"; "Scope crept"; free text |
| Disposition | "Accept, edit named sections, or re-run the panel on named sections?" | Accept; Edit: ...; Re-run panel on: ... |

Answers and edits go to `gate-1.md`. A re-run calls `Workflow({ scriptPath: "${CLAUDE_PLUGIN_ROOT}/workflows/panel.js", args: { ..., question: "<focused question>", contextPath: "<runDir>/prd-draft.md" } })`, waits, and returns to this gate.

### 7.7 Finalize, inline

One agent, so no workflow (§4.2):

```
Agent({
  subagent_type: "ck:river",
  description: "Finalize PRD",
  prompt: "Read <runDir>/prd-draft.md and <runDir>/gate-1.md. Fold the premortem answer into Assumptions and Risks, apply the requested edits, resolve each open decision as answered, keep Appendix A intact. Write the final PRD to <outputPath>. Set status 'final' in <runDir>/run.json. Return the path and a five-line summary."
})
```

The skill prints the output path and the run directory and suggests `/devlog` for the decision memo.

### 7.8 The PRD artifact contract

`skills/prd-artifact/SKILL.md` (full text: Appendix D). Not user-invocable. It is the file River reads to draft, the validator reads to check, and Claude loads on its own when asked to write a PRD outside the workflow (its description says so), which is the proposal's consistency mechanism (§3.4) reaching the plain session too.

Section order: Summary; Problem; User; Success metric and leading indicator; Scope (the decision, and the V0 counter-proposal); Non-goals; Requirements (numbered, each with acceptance criteria); Sequencing and dependencies; Assumptions; Risks; Open questions; Appendix A Challenged claims; Appendix B Premortem.

Checklist (each item is a statement the validator can check by reading):

1. Every section above is present, in order, with its heading verbatim.
2. Problem names the user pain, not the solution, and cites the root-cause chain.
3. Success metric is one number with a target and a date, plus one leading indicator.
4. Scope records the V0 or full decision and the V0 counter-proposal with what it cuts.
5. Non-goals has at least two entries.
6. Every requirement has at least one acceptance criterion that a reader could verify without asking the author.
7. Every claim not from the brief carries a `[C<n>]` tag, and every tag appears in Appendix A or is marked unchallenged.
8. Assumptions includes the assumption the premortem exposed.
9. Open questions lists every decision left to the author.
10. No em-dashes in prose (the family writing rule; the structural-list exception applies).

### 7.9 Cost

About $1.50 per run without a revision, about $2.00 with one, plus the main session's own turns. Appendix F.

### 7.10 Acceptance criteria

- [ ] `/ck:prd` never auto-triggers (`disable-model-invocation: true`); typing it starts Gate 0 as River.
- [ ] After Q3, `brief.md` already contains Proposal and the first two whys (compaction safety).
- [ ] Killing the session after Q6 and running `/ck:prd` again offers to resume the run.
- [ ] `run.json` contains `harnessRunId` before the skill goes idle.
- [ ] `.git/info/exclude` contains `.ck/`; `git status` shows nothing under `.ck/`.
- [ ] `/workflows` shows phases Draft, Validate, Panel (with the nested panel's agents), Synthesize; the validator agent runs on Haiku 4.5.
- [ ] `prd-draft.md` has every contract section, an Appendix A with at least one row per blocking or major lens finding, and an Appendix B with a scenario and the verbatim question.
- [ ] Gate 1 asks "What went wrong?" first, then the disposition.
- [ ] The final PRD lands at the Q10 path with `status: final` in `run.json`, and its checklist passes when re-validated by hand against §7.8.
- [ ] The consent prompts seen during the drill are recorded, including whether the nested panel prompted separately (§10.2).
- [ ] `skills/prd/SKILL.md` contains the three behavior headings from `upstream/profiles/river.md` (CI-checked).

---

## 8. Repository, packaging, release

### 8.1 Repository and layout

New repository `code-katz/ck`, one plugin per repo like the seven marketplace entries today [R]. Rejected: inside `claude-team-cli` (reopens the 07-31 decision inside the same repo and mixes the shell install path with the plugin) and inside `claude-plugins` as a subdirectory plugin (supported by the marketplace-root source form [D], but it breaks the family's per-repo README, DEVLOG, ROADMAP, and test convention). [P]

```
ck/
├── .claude-plugin/plugin.json
├── README.md  DEVLOG.md  ROADMAP.md  LICENSE
├── upstream/                     vendored from claude-team-cli at the pinned commit
│   ├── profiles/*.md
│   └── tiers.conf
├── agents/*.md                   21 generated files (§5)
├── skills/
│   ├── prd/SKILL.md              /ck:prd (Appendix C)
│   └── prd-artifact/SKILL.md     the contract (Appendix D)
├── workflows/
│   ├── panel.js                  /ck:panel (Appendix A)
│   └── prd-draft.js              /ck:prd-draft (Appendix B)
├── hooks/hooks.json              §5.5
├── scripts/
│   ├── generate-agents.sh
│   ├── bump-upstream.sh
│   ├── usage-log.sh
│   └── upstream.lock
└── tests/
    ├── run.sh
    └── fixtures/                 a tiny project with a brief.md and a one-page context doc
```

### 8.2 Manifest

```json
{
  "name": "ck",
  "description": "Persona workflows for Claude Code: /ck:prd (a River-led PRD challenged by a three-lens panel), /ck:panel (product, marketing, and UX lenses on different models), and 21 Code Katz personas as ck:<name> subagents.",
  "version": "0.1.0",
  "author": { "name": "Code Katz" }
}
```

`version` pins the plugin: users receive a new copy only when the string changes [D]. Every release, including a regenerated `agents/` after `bump-upstream.sh`, bumps it. This is written next to `bump-upstream.sh` because it is not testable.

### 8.3 Marketplace entry

Appended to `claude-plugins/.claude-plugin/marketplace.json` (bumping its `metadata.version` to 1.4.0):

```json
{
  "name": "ck",
  "source": { "source": "github", "repo": "code-katz/ck" },
  "description": "Persona workflows: /ck:prd (River-led PRD with a three-lens panel), /ck:panel (product, marketing, UX lenses on different models), and 21 personas as ck:<name> subagents. Phase one of the code-katz plugin.",
  "category": "workflow",
  "keywords": ["workflows", "personas", "prd", "panel", "subagents"]
}
```

Install: `/plugin marketplace add code-katz/claude-plugins` then `/plugin install ck@code-katz`. For development: `claude --plugin-dir /path/to/ck`, then `/reload-skills` after editing a workflow [D].

### 8.4 Prerequisites

| Prerequisite | Why | Grade |
|---|---|---|
| A paid Claude Code plan with dynamic workflows available; on Pro, enabled in `/config` | Workflows are the orchestrator | [D] |
| Workflows not disabled by the organization (`disableWorkflows`) | Same | [D] |
| team-cli PR re-basing `tiers.conf` to §5.3 | `ck` copies the tier verbatim; without the PR, River runs on Fable 5 and the panel's Opus lens is an override, not a tier | [R] |
| Node 20+ on the developer's machine, for `node --check` in the tests only | The plugin itself needs no Node at run time | [P] |
| `jq` optional, for the usage log; the script falls back to appending the raw line | Family convention: jq is optional | [R] |

### 8.5 Version and update policy

- `0.1.0` is the phase-one release. `0.x` until the 90-day review.
- A change to any file under `agents/`, `skills/`, `workflows/`, or `hooks/` bumps the patch or minor version in the same commit.
- `bump-upstream.sh` refuses to run if the working tree is dirty and prints the `agents/` diff so the reviewer sees what changed in persona text.

### 8.6 Coexistence with `claude-team-cli`

| Route | How | Lives in |
|---|---|---|
| Switch this session to a persona | `/river`, `/akira`, ... | team-cli (`install.sh`) |
| Delegate one task to a persona on its tier | `ck:river` subagent, or team-cli's `river` subagent | both; `ck:` is the plugin form |
| Open a separate session as a persona | `claude-team launch river` | team-cli |
| Run a repeatable pipeline | `/ck:prd`, `/ck:panel` | ck |
| Plan parallel sessions, track them | `/parallel`, `/conductor` | team-cli, conductor |

A user with both installed has two River subagents (`river` from `~/.claude/agents/`, priority 4, and `ck:river`, priority 5) [D]. They are generated from the same profile text at possibly different commits; `upstream.lock` says which. The README says this once.

---

## 9. Tests

`tests/run.sh`, bash, `set -uo pipefail`, `ok`/`fail` helpers and a `mktemp` scratch tree, in the family's style [R].

| # | Test | Type |
|---|---|---|
| 1 | `plugin.json` parses; `name` is `ck`; `version` matches a semver | static |
| 2 | Regenerate `agents/` from `upstream/` into scratch; `diff -q` each file against the committed copy; fail listing stale names | drift |
| 3 | Agent count equals profile count minus `coordinator*` | drift |
| 4 | Per agent: `model:` equals the `tiers.conf` line; `name:` equals the filename, no colon; `## Handoff Brief` present; `## Greeting` absent; the §5.4 preamble sentence present | drift |
| 5 | `scripts/upstream.lock` has exactly one `commit=` with a 40-hex value | drift |
| 6 | Opt-in (dispatch or schedule, never on push): `git fetch --depth 1 origin <sha>` and `diff -r` the vendored files against it | drift, network |
| 7 | `skills/prd/SKILL.md` contains the three `### N. <name>` headings from `upstream/profiles/river.md` | contract |
| 8 | `skills/prd-artifact/SKILL.md` section list equals the list in the `prd-draft.js` Draft prompt | contract |
| 9 | Every `workflows/*.js`: `node --check` passes on a copy with `export` stripped and the body wrapped in `(async () => { ... })()`, because workflow scripts use top-level `return` and `await`, which a bare module rejects; first statement is `export const meta`; `meta` has `name`, `description`, `phases`, `personas`; grep for `Date.now|Math.random|new Date\(\)|require\(|import\(` is empty | lint |
| 10 | `hooks/hooks.json` parses; the matcher is `^ck:`; `usage-log.sh` given a fixture stdin appends one valid JSON line and exits 0, and exits 0 on garbage input | hook |
| 11 | End-to-end drill, by hand, on the fixture project and then on one real project: `/ck:panel` then `/ck:prd`; record the consent prompts, the files under `.ck/runs/<id>/`, the models shown in `/workflows`, and the final PRD path. The drill log is committed under `tests/drill/<date>.md` | e2e |

`claude plugin eval` is early access and not enabled today; when it is, the drill becomes an eval suite and test 11 stops being manual.

---

## 10. Deferred and open

### 10.1 Deferred, with the trigger to revisit

| Item | Why not in phase one | Revisit when |
|---|---|---|
| The other seven workflows in proposal §5.3 (`opportunity`, `market-research`, `brand-guide`, `roadmap`, `feature`, `bugfix`, `gtm`) and `/ck:next` | Phase one proves the gate rule, the port, and the artifact contract on one workflow first | Phase one has been used weekly for 30 days |
| `/ck:review`: a six-reviewer artifact review with adversarial refuters and a verify cap (designed during this PRD's review; a different product from the three-lens panel) | The panel is the decision primitive the proposal asks for; a review workflow is a second one | The panel proves too narrow for code, design, or plan reviews |
| Persona switch skills `/ck:<name>` | team-cli's `/name` commands cover the switch route today | The retire-or-coexist decision at 90 days |
| Hook-enforced artifact gates (`SubagentStop`, exit 2) | Feedback path undocumented; plugin agents ignore per-agent hooks [D]; the validator agent covers the shape check | More than one draft in five passes the validator and still fails Gate 1 on structure |
| Model fallback chain | `PreModelSwitch` does not cover it [D]; null-tolerant scripts cover phase one | More than one run in ten loses a lens to an API error |
| Advisor tool | API-only and experimental [V] | Available inside Claude Code |
| Routines | No headless workflow the user wants scheduled yet | `market-research` ships (the natural candidate) |
| Folding in `devlog`, `roadmap`, `plans`, `todo`, `publish` as artifact contracts | Their repos work as they are; folding in orphans seven marketplace entries | A `ck` workflow needs to read one of them as a contract (`roadmap.js` first) |
| Retiring `claude-team-cli` | No usage data | The 90-day review |
| `/ck:map`, any workbench | §4.7 | A specific edit Will could not make in a text editor plus `bump-upstream.sh` |
| A `bin/` CLI | Nothing needs one | Never, unless a workflow needs a helper the Bash tool should call |
| Conductor bug fixes from proposal §9 (`update_session_field` and `insert_active_row` tmp-then-mv without a lock; `watcher.js:134` empty-cell filter vs positional awk) | They are conductor's, not `ck`'s | Filed against conductor now |

### 10.2 Open questions carried forward

1. Proposal §8.6, verbatim: "`/ck:feature` scope. Full end-to-end including marketing copy, or code-only with content as a separate workflow?" Not needed until `feature.js`.
2. Proposal §8.7, verbatim: "Routines integration. Which workflows, if any, should run scheduled or on GitHub events?"
3. Does the Workflow tool's `name` parameter accept `ck:prd-draft` for a plugin workflow? `scriptPath` is the specified path; the drill tries `name` and records the answer.
4. Does a nested `workflow({scriptPath})` prompt for consent separately on first run, and does "don't ask again for `ck:panel`" cover the nested call? The drill records it.
5. Does the workflow loader accept the extra `personas` key in `meta`? The docs require `name` and `description` and describe `whenToUse` and `phases`; an extra literal key is expected to pass. Test 9 asserts it; the drill confirms `/ck:panel` still appears in autocomplete.
6. Does `SubagentStop` exit 2 feed stderr back to a workflow agent? Decides the hook-gate spike.
7. Aliases or full IDs in `tiers.conf`? The team-cli PR decides (§5.3).

---

## 11. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Workflows unavailable (plan, `/config`, or org `disableWorkflows`) | Low for Will; real for other users | The plugin is inert | README states the prerequisite; the `prd` skill checks for the Workflow tool before Gate 0 and stops with the reason |
| An API error nulls a lens | Medium | Memo on two lenses | Logged; memo header says so; re-run offered; a lens can be re-modelled per run |
| The Fable lens dominates cost | Certain | About $0.30 to $0.50 of every panel | `--lenses` override; an all-Opus-and-Sonnet assignment is one flag away |
| Persona text drifts from upstream | Low | Two Rivers disagree | `upstream.lock`, drift test, `bump-upstream.sh` prints the diff |
| 21 personas is 15 too many | Likely (proposal §7) | Maintenance and choice paralysis | Generated, so carrying cost is near zero; `usage.jsonl`; prune at 90 days |
| River and Akira on Opus 5 write worse PRDs than on Fable | Unknown | Quality of the flagship artifact | One line in `tiers.conf` reverts it; the panel disagreement rate and Gate 1 edit volume are the signal |
| The 4.7-and-later tokenizer produces about 30% more tokens [D] | Certain | Appendix F underestimates by up to 30% | Stated in Appendix F; `/workflows` shows real token totals |
| Compaction during Gate 0 | Medium on long intakes | Lost answers | Append-as-you-go and the resume check (§4.3) |
| Consent prompts on every run annoy | Medium | Friction | "Don't ask again for `ck:panel`" on the first run; allow rules `Workflow(ck:panel)`, `Workflow(ck:prd-draft)` |
| Two River subagents (`river`, `ck:river`) confuse delegation | Low | Wrong tier or stale text | README note; every `ck` prompt names `ck:<persona>` explicitly |
| `meta.personas` rejected by the loader | Low | Workflow missing from autocomplete | Open question 5; fallback is to move the roster into `description` |

---

## Appendix A. `workflows/panel.js`

```js
export const meta = {
  name: 'panel',
  description: 'Three-lens decision panel: product (river), marketing (toni), and UX (kai) personas, each on a different model, argue one question; a neutral memo surfaces where they disagree and leaves the decision to the author. Args: runId, runDir (absolute), pluginRoot, timestamp (UTC, minted by the caller with date -u), question, contextPath (optional), lenses (optional [{persona, lens, model}]).',
  phases: [
    { title: 'Lenses', detail: 'ck:river, ck:toni, ck:kai in parallel, one model each, each forced to argue against itself' },
    { title: 'Synthesis', detail: 'one neutral agent writes decision-memo.md; disagreement preserved, decision left to the author' },
  ],
  personas: ['river', 'toni', 'kai'],
}

if (!args || !args.runId || !args.runDir || !args.pluginRoot || !args.timestamp || !args.question) {
  throw new Error('panel: args.runId, args.runDir, args.pluginRoot, args.timestamp, and args.question are required')
}
const runDir = args.runDir
const stamp = args.timestamp
const question = args.question
const contextPath = args.contextPath || null

// Three lenses, three models: the same model in three costumes is one opinion.
// This is the one script in ck allowed to set `model` on a persona agent; the
// per-invocation model beats the agent's frontmatter tier. Any lens may be
// replaced or re-modelled through args.lenses.
const DEFAULT_LENSES = [
  { persona: 'river', lens: 'product', model: 'claude-opus-5' },
  { persona: 'toni', lens: 'marketing', model: 'claude-fable-5-1' },
  { persona: 'kai', lens: 'ux', model: 'claude-sonnet-5' },
]
const lenses = Array.isArray(args.lenses) && args.lenses.length
  ? args.lenses.map((l, i) => ({
      persona: l.persona,
      lens: l.lens || l.persona,
      model: l.model || DEFAULT_LENSES[i % DEFAULT_LENSES.length].model,
    }))
  : DEFAULT_LENSES
if (lenses.some(l => !l.persona)) throw new Error('panel: every entry in args.lenses needs a persona')
if (new Set(lenses.map(l => l.model)).size < lenses.length) {
  log('panel: two or more lenses share a model; their agreement counts as one opinion')
}

const QUESTION = {
  type: 'object',
  properties: { to: { type: 'string' }, question: { type: 'string' } },
  required: ['to', 'question'],
}

const LENS_SCHEMA = {
  type: 'object',
  properties: {
    persona: { type: 'string' },
    lens: { type: 'string' },
    recommendation: { type: 'string', enum: ['yes', 'no', 'yes-if', 'not-yet'] },
    position: { type: 'string' },
    reasoning: { type: 'string' },
    strongestArgumentAgainstOwnRecommendation: { type: 'string' },
    conditionThatWouldMakeMeSayNo: { type: 'string' },
    questionsForOtherLenses: { type: 'array', items: QUESTION },
    handoffBrief: { type: 'string' },
  },
  required: [
    'persona', 'lens', 'recommendation', 'position', 'reasoning',
    'strongestArgumentAgainstOwnRecommendation', 'conditionThatWouldMakeMeSayNo',
    'questionsForOtherLenses', 'handoffBrief',
  ],
}

const MEMO_SCHEMA = {
  type: 'object',
  properties: {
    memoPath: { type: 'string' },
    question: { type: 'string' },
    recommendations: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          persona: { type: 'string' }, lens: { type: 'string' },
          model: { type: 'string' }, recommendation: { type: 'string' },
        },
        required: ['persona', 'lens', 'model', 'recommendation'],
      },
    },
    agreements: { type: 'array', items: { type: 'string' } },
    disagreements: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          topic: { type: 'string' },
          positions: {
            type: 'array',
            items: {
              type: 'object',
              properties: { persona: { type: 'string' }, position: { type: 'string' } },
              required: ['persona', 'position'],
            },
          },
          decisionForAuthor: { type: 'string' },
        },
        required: ['topic', 'positions', 'decisionForAuthor'],
      },
    },
    conditions: {
      type: 'array',
      items: {
        type: 'object',
        properties: { persona: { type: 'string' }, condition: { type: 'string' } },
        required: ['persona', 'condition'],
      },
    },
    panelFailedToDisagree: { type: 'boolean' },
    summary: { type: 'string' },
  },
  required: [
    'memoPath', 'question', 'recommendations', 'agreements', 'disagreements',
    'conditions', 'panelFailedToDisagree', 'summary',
  ],
}

// ---- Lenses ----
phase('Lenses')
const roster = lenses.map(l => `${l.persona}: ${l.lens}`).join('; ')
const results = (await parallel(lenses.map(l => () => agent(
  `You are ${l.persona}, the ${l.lens} lens on a ${lenses.length}-lens decision panel (${roster}).\n` +
  `The question: ${question}\n` +
  (contextPath ? `Read ${contextPath} in full before answering; it is the material the question is about. ` : '') +
  `If ${runDir}/brief.md exists, read it too; it records the author's intent.\n` +
  `Answer from your own domain only. Apply your Required Behaviors in subagent form: where a behavior tells you ` +
  `to ask the user, put the question in questionsForOtherLenses addressed to 'author' or to a lens persona, ` +
  `state your assumption, and proceed.\n` +
  `Return: recommendation (yes, no, yes-if, not-yet); position (one paragraph); reasoning (evidence from the ` +
  `material or from your domain, not from the other lenses); strongestArgumentAgainstOwnRecommendation (the ` +
  `best case a smart colleague would make against you; a weak one is a failed answer); ` +
  `conditionThatWouldMakeMeSayNo (the specific, checkable condition under which you would reverse); ` +
  `handoffBrief (decisions you want recorded, open risks in your domain, one direct question to a named lens).\n` +
  `Write the same object as JSON to ${runDir}/panel/${l.persona}.json (create the directory if needed) and ` +
  `return it with persona '${l.persona}' and lens '${l.lens}'.`,
  { label: `${l.lens}:${l.persona}`, phase: 'Lenses', agentType: 'ck:' + l.persona, model: l.model, schema: LENS_SCHEMA },
)))).filter(Boolean)

if (results.length === 0) throw new Error('panel: every lens was stopped or failed; nothing to synthesize')
const missing = lenses.filter(l => !results.some(r => r.persona === l.persona)).map(l => l.persona)
if (missing.length) {
  log(`panel: ${missing.join(', ')} returned nothing (stopped or API error); the memo runs on ${results.length} lens(es)`)
}

// ---- Synthesis ----
phase('Synthesis')
const modelOf = persona => (lenses.find(l => l.persona === persona) || {}).model || 'unknown'
const memo = await agent(
  `Write the decision memo for a ${lenses.length}-lens panel. Question: ${question}. Run ${args.runId}, generated ${stamp}.\n` +
  `Lens results, also on disk under ${runDir}/panel/:\n` +
  JSON.stringify(results.map(r => ({ ...r, model: modelOf(r.persona) })), null, 1) + '\n' +
  (missing.length ? `Lenses that returned nothing: ${missing.join(', ')}. Say so in the memo header.\n` : '') +
  `Rules. You are neutral and hold no lens. Surface where the lenses disagree and do not resolve it; the ` +
  `decision is the author's. Never average positions or pick a winner. Quote each lens's strongest argument ` +
  `against itself and its condition to say no verbatim. If every lens recommends the same thing and no ` +
  `self-argument is substantive, set panelFailedToDisagree to true and say in the header that the panel ` +
  `failed to disagree and should be re-run with a different question or lens set. State in the header that ` +
  `all lenses are Claude models from one training pipeline, so decorrelation is partial.\n` +
  `Write ${runDir}/decision-memo.md with these sections: 1 Question and context (run id, timestamp, lens ` +
  `table with models, the limitation); 2 Recommendations (table: lens | persona | model | recommendation | ` +
  `one-line position); 3 Where they agree; 4 Where they disagree (topic, each position with its evidence, ` +
  `the decision the author must make); 5 Each lens against itself (verbatim); 6 Conditions to say no ` +
  `(verbatim); 7 Questions between lenses (to -> question, verbatim); 8 Handoff briefs (verbatim, one per ` +
  `lens). Then return the memo object; memoPath must be '${runDir}/decision-memo.md'.`,
  { label: 'synthesis', phase: 'Synthesis', schema: MEMO_SCHEMA },
)

if (!memo) {
  log('panel: synthesis returned nothing; returning raw lens results')
  return {
    runId: args.runId, question, memoPath: null, lenses: lenses.map(l => l.persona), missing,
    recommendations: results.map(r => ({ persona: r.persona, lens: r.lens, model: modelOf(r.persona), recommendation: r.recommendation })),
    agreements: [], disagreements: [], conditions: results.map(r => ({ persona: r.persona, condition: r.conditionThatWouldMakeMeSayNo })),
    panelFailedToDisagree: null, summary: 'synthesis agent returned nothing; see panel/*.json',
  }
}
if (memo.panelFailedToDisagree) log('panel: the panel failed to disagree; re-run with a different question or lens set')
return { runId: args.runId, ...memo, lenses: lenses.map(l => l.persona), missing }
```

## Appendix B. `workflows/prd-draft.js`

```js
export const meta = {
  name: 'prd-draft',
  description: "River drafts a PRD from brief.md to the prd-artifact contract, a validator checks it, the three-lens panel challenges it, and River writes prd-draft.md with a Challenged claims appendix and a premortem. Args: runId, runDir (absolute), pluginRoot, timestamp, briefPath (optional), lenses (optional). Normally launched by /ck:prd, which owns the gates before and after.",
  phases: [
    { title: 'Draft', detail: 'ck:river writes draft-v0.md from brief.md to the contract; every non-brief claim tagged [C<n>]' },
    { title: 'Validate', detail: 'one neutral Haiku agent checks the draft against the contract checklist; ck:river revises at most twice' },
    { title: 'Panel', detail: "nested /ck:panel on the draft: is it ready for the author's review, and what would you change" },
    { title: 'Synthesize', detail: 'ck:river writes prd-draft.md: revised PRD, Appendix A Challenged claims, Appendix B Premortem' },
  ],
  personas: ['river', 'toni', 'kai'],
}

if (!args || !args.runId || !args.runDir || !args.pluginRoot || !args.timestamp) {
  throw new Error('prd-draft: args.runId, args.runDir, args.pluginRoot, and args.timestamp are required')
}
const runDir = args.runDir
const brief = args.briefPath || (runDir + '/brief.md')
const stamp = args.timestamp
const contract = args.pluginRoot + '/skills/prd-artifact/SKILL.md'
const draftPath = runDir + '/draft-v0.md'
const prdPath = runDir + '/prd-draft.md'
const MAX_REVISIONS = 2
const VALIDATOR_MODEL = 'claude-haiku-4-5-20251001'

const QUESTION = {
  type: 'object',
  properties: { to: { type: 'string' }, question: { type: 'string' } },
  required: ['to', 'question'],
}

const DRAFT_SCHEMA = {
  type: 'object',
  properties: {
    draftPath: { type: 'string' },
    title: { type: 'string' },
    rootCauseChain: { type: 'array', items: { type: 'string' } },
    claims: {
      type: 'array',
      items: {
        type: 'object',
        properties: { id: { type: 'string' }, text: { type: 'string' }, section: { type: 'string' } },
        required: ['id', 'text', 'section'],
      },
    },
    assumptions: { type: 'array', items: { type: 'string' } },
    v0: {
      type: 'object',
      properties: {
        scope: { type: 'string' },
        cuts: { type: 'array', items: { type: 'string' } },
        recommendation: { type: 'string' },
      },
      required: ['scope', 'cuts', 'recommendation'],
    },
    questions: { type: 'array', items: QUESTION },
  },
  required: ['draftPath', 'title', 'rootCauseChain', 'claims', 'assumptions', 'v0', 'questions'],
}

const VALIDATION_SCHEMA = {
  type: 'object',
  properties: {
    valid: { type: 'boolean' },
    missing: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' },
  },
  required: ['valid', 'missing', 'notes'],
}

const PRD_SCHEMA = {
  type: 'object',
  properties: {
    prdPath: { type: 'string' },
    title: { type: 'string' },
    challengedClaims: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          claim: { type: 'string' },
          challengedBy: { type: 'string' },
          severity: { type: 'string', enum: ['blocking', 'major', 'minor'] },
          status: { type: 'string', enum: ['upheld', 'revised', 'withdrawn', 'open'] },
          resolution: { type: 'string' },
        },
        required: ['claim', 'challengedBy', 'severity', 'status', 'resolution'],
      },
    },
    premortem: {
      type: 'object',
      properties: {
        scenario: { type: 'string' },
        exposedAssumption: { type: 'string' },
        question: { type: 'string' },
      },
      required: ['scenario', 'exposedAssumption', 'question'],
    },
    openDecisions: { type: 'array', items: { type: 'string' } },
    summary: { type: 'string' },
  },
  required: ['prdPath', 'title', 'challengedClaims', 'premortem', 'openDecisions', 'summary'],
}

// ---- Draft ----
phase('Draft')
let draft = await agent(
  `Read ${brief}. It records the intake gate the author already answered with you: proposal, root-cause chain, ` +
  `user, success metric and leading indicator, scope decision (V0 or full, with rationale), non-goals, lenses, ` +
  `and the output path. Do not re-ask any of it.\n` +
  `Read ${contract}. It is the PRD contract: section order, required fields, and the checklist your draft will ` +
  `be validated against.\n` +
  `Write ${draftPath} to that contract, all sections in order. Apply your Required Behaviors in subagent form: ` +
  `restate the root-cause chain from the brief and extend it if the brief stopped at a symptom, saying which; ` +
  `always present the V0 counter-proposal with what it cuts and your recommendation, even if the brief chose ` +
  `full scope; leave the premortem for the synthesis pass after the panel, and say so under Appendix B.\n` +
  `Tag every claim that is not taken directly from the brief with an inline marker [C1], [C2], ... so the panel ` +
  `can address it, and list those claims with their section. Put anything you would have asked the author in ` +
  `questions, with your assumption.\n` +
  `Return the draft object; draftPath must be '${draftPath}'.`,
  { label: 'river:draft', phase: 'Draft', agentType: 'ck:river', schema: DRAFT_SCHEMA },
)
if (!draft) throw new Error('prd-draft: River returned nothing for the draft; check ' + runDir)
log(`draft: ${draft.claims.length} tagged claim(s), ${draft.assumptions.length} assumption(s), ${draft.questions.length} question(s) for the author`)

// ---- Validate ----
phase('Validate')
let validation = null
for (let round = 1; round <= MAX_REVISIONS + 1; round++) {
  validation = await agent(
    `Read ${contract} and ${draftPath}. Check the draft against every numbered item in the contract's Checklist ` +
    `section and against the section order. Return valid=true only if every item holds. For each unmet item, ` +
    `one line in missing that quotes the checklist item and says what is absent or wrong. Judge the shape, ` +
    `not the product.`,
    { label: `validate:${round}`, phase: 'Validate', model: VALIDATOR_MODEL, schema: VALIDATION_SCHEMA },
  )
  if (!validation) { log('validate: validator returned nothing; proceeding unvalidated'); break }
  if (validation.valid) { log(`validate: draft passes the contract checklist (round ${round})`); break }
  if (round > MAX_REVISIONS) {
    log(`validate: still unmet after ${MAX_REVISIONS} revision(s): ${validation.missing.join(' | ')}`)
    break
  }
  log(`validate: ${validation.missing.length} unmet item(s); River revises (revision ${round} of ${MAX_REVISIONS})`)
  const revised = await agent(
    `Read ${contract}, ${brief}, and ${draftPath}. A validator found these unmet checklist items:\n` +
    validation.missing.map(m => '- ' + m).join('\n') + '\n' +
    `Revise ${draftPath} in place so each item holds. Keep every existing [C<n>] tag and add tags for any new ` +
    `claim not from the brief. Return the updated draft object; draftPath must be '${draftPath}'.`,
    { label: `river:revise:${round}`, phase: 'Validate', agentType: 'ck:river', schema: DRAFT_SCHEMA },
  )
  if (!revised) { log('validate: revision returned nothing; keeping the previous draft'); break }
  draft = revised
}

// ---- Panel (nested; one level only) ----
phase('Panel')
let panel = null
try {
  panel = await workflow({ scriptPath: args.pluginRoot + '/workflows/panel.js' }, {
    runId: args.runId,
    runDir,
    pluginRoot: args.pluginRoot,
    timestamp: stamp,
    question: "Is this PRD ready for the author's review, and what would you change before it ships?",
    contextPath: draftPath,
    lenses: args.lenses || null,
  })
} catch (e) {
  log('panel: failed (' + (e && e.message ? e.message : String(e)) + '); synthesizing without it')
}
if (panel) {
  log(`panel: ${panel.lenses.join(', ')}; ${(panel.disagreements || []).length} disagreement(s)` +
    (panel.panelFailedToDisagree ? '; the panel failed to disagree' : '') +
    (panel.missing && panel.missing.length ? `; missing: ${panel.missing.join(', ')}` : ''))
}

// ---- Synthesize ----
phase('Synthesize')
const panelInputs = panel && panel.memoPath
  ? `${panel.memoPath} and every file under ${runDir}/panel/`
  : (panel
    ? `every file under ${runDir}/panel/ (the memo was not written)`
    : 'nothing else: the panel did not run, and the PRD header must say so')
const prd = await agent(
  `Read ${brief}, ${draftPath}, ${contract}, and ${panelInputs}.\n` +
  `Write ${prdPath}: the same PRD sections as the draft, in contract order, revised where the panel showed a ` +
  `claim wrong or unsupported, followed by two appendices.\n` +
  `Appendix A, Challenged claims: one row per point a lens raised against a [C<n>] claim or against something ` +
  `untagged: claim | challenged by (persona and lens) | severity (blocking, major, minor: your call from the ` +
  `memo) | status | resolution. Status is upheld (you kept it; say why), revised (you changed it; quote the ` +
  `change), withdrawn, or open (the author must decide). Never delete a challenge. Reproduce the memo's Where ` +
  `they disagree section and its Conditions to say no verbatim below the table.\n` +
  `Appendix B, Premortem: your Required Behavior in subagent form. Write the 2-3 sentence scenario in which ` +
  `this shipped on time and did not move the success metric; name the hidden assumption it exposes; add that ` +
  `assumption to the Assumptions section; leave the question "What went wrong?" verbatim for the author. ` +
  `The next gate asks it.\n` +
  `Check your own output against the contract checklist before returning. List every decision you left open ` +
  `under openDecisions. Generated ${stamp}, run ${args.runId}. Return the PRD object; prdPath must be '${prdPath}'.`,
  { label: 'river:synthesize', phase: 'Synthesize', agentType: 'ck:river', schema: PRD_SCHEMA },
)
if (!prd) throw new Error('prd-draft: River returned nothing for the synthesis; the draft is at ' + draftPath)

return {
  runId: args.runId,
  prdPath: prd.prdPath,
  draftPath,
  memoPath: panel ? panel.memoPath : null,
  lenses: panel ? panel.lenses : [],
  validation,
  challengedClaims: prd.challengedClaims,
  premortem: prd.premortem,
  openDecisions: prd.openDecisions,
  summary: prd.summary,
}
```

## Appendix C. `skills/prd/SKILL.md`

````markdown
---
name: prd
description: Write a PRD with River. An intake gate (Three Whys, V0 Challenge), a background draft challenged by the product, marketing, and UX lenses on different models, a premortem gate, then finalize to the path you choose. Launches a paid workflow, so it runs only when you type /ck:prd.
disable-model-invocation: true
argument-hint: "[one-sentence proposal]"
---

You are River for the whole of this skill. Read `${CLAUDE_PLUGIN_ROOT}/agents/river.md` for your voice and standards. The subagent form of your behaviors is in that file; the interactive form is here, because this is the one place a user is present.

Before anything else, confirm the Workflow tool is available in this session. If it is not, stop and say: "Dynamic workflows are not available here (plan, /config, or organization setting). /ck:prd needs them." Do not fall back to running the stages by hand.

## 0. Resume check

Run `ls .ck/runs/*/brief.md 2>/dev/null`. For any run directory that has `brief.md` but no `prd-draft.md`, ask with AskUserQuestion: "Resume run `<id>` from `<timestamp>`, or start new?" On resume, read `run.json`; if it has `harnessRunId`, skip to step 3 and relaunch with `resumeFromRunId`; otherwise continue Gate 0 from the last section present in `brief.md`.

## 1. Gate 0: intake

Ask one question at a time with AskUserQuestion. **After every answer, append it to `brief.md` under its section heading before asking the next question.** If the run directory does not exist yet, create it first (step 2 shows how; do it as soon as Q1 is answered, using a provisional slug from the proposal).

### 1. Three Whys

Do not accept the proposal as the problem. Ask "Why?" up to three times, each answer more specific than the last:

- Q1 Proposal: "In one or two sentences, what do you want to build?" (skip if `$ARGUMENTS` is given; record it)
- Q2: "Why does that need to exist? What happens to the user today without it?"
- Q3: "Why is [their answer] a problem worth solving now?"
- Q4: "Why [their answer]? What is underneath that?"

Each of Q2 to Q4 offers two fixed options, "That is the root cause" and "I am solving a symptom and I know it", plus free text. Stop early on either fixed option and record which.

Then:

- Q5 User: "Who exactly has this pain? One primary user." Offer options drawn from the answers so far, plus Other.
- Q6 Metric: "What single number moves if this works, by how much, by when? And what leading indicator will you watch?"
- Q7 Non-goals: "Name two or three things this will explicitly not do."

### 2. V0 Challenge

Propose a V0 that cuts at least half the requested scope. Say: "Here is a V0 that solves the core problem with half the features: [scope]. It cuts [list]. Would this still move [metric]?" Offer: "Build the V0"; "Build the full scope"; "Full scope, and here is what specifically requires it" (free text). Record the decision and the rationale.

- Q9 Lenses: "Default panel (River on Opus 5, Toni on Fable 5.1, Kai on Sonnet 5), or name lenses and models?" Record as a list of `{persona, lens, model}` or `null`.
- Q10 Output: "Where should the final PRD go?" Default `plans/<date>-<slug>-prd.md`.

`brief.md` sections, in this order: Proposal; Root-cause chain; User; Success metric and leading indicator; Scope decision and rationale; Non-goals; Lenses; Output path.

## 2. Mint the run

```bash
timestamp=$(date -u +%Y%m%dT%H%M%SZ)
runId="${timestamp}-<slug>"
runDir="$(pwd)/.ck/runs/${runId}"
mkdir -p "$runDir"
grep -qxF '.ck/' .git/info/exclude 2>/dev/null || echo '.ck/' >> .git/info/exclude
```

Write `run.json`: `{ "runId", "createdAt": timestamp, "status": "gate-0", "outputPath", "lenses" }`. Tell the user once: `.ck/` is excluded from git locally; the final PRD is not.

## 3. Launch the draft and wait

Call the Workflow tool exactly like this:

```
Workflow({
  scriptPath: "${CLAUDE_PLUGIN_ROOT}/workflows/prd-draft.js",
  args: {
    runId: "<runId>", runDir: "<runDir>", pluginRoot: "${CLAUDE_PLUGIN_ROOT}", timestamp: "<timestamp>",
    briefPath: "<runDir>/brief.md", lenses: <list or null>
  }
})
```

Immediately write the returned run id into `run.json` as `harnessRunId`, with `scriptPath`, and set `status` to `drafting`. Tell the user the draft is running in the background and that `/workflows` shows progress. Then stop. Wait for the task notification. Do not poll, do not narrate, do not start other work on this run.

If the notification reports a stop or a failure, offer to relaunch: `Workflow({ scriptPath: "<scriptPath>", resumeFromRunId: "<harnessRunId>" })`. Completed agents replay from cache.

## 4. Gate 1: review

Read `<runDir>/prd-draft.md`. Show, in this order: the summary; the Challenged claims table (Appendix A); the open decisions; the premortem scenario from Appendix B, verbatim.

### 3. Premortem

Ask, with AskUserQuestion: "What went wrong?" Options: "The metric was wrong"; "The user was not who we thought"; "Scope crept"; plus free text. Use the answer to surface the hidden assumption; do not argue with it.

Then ask: "Accept, edit named sections, or re-run the panel on named sections?" Options: Accept; Edit: ...; Re-run the panel on: ... Write the premortem answer, the edits, and a decision for each open item to `<runDir>/gate-1.md`.

On re-run: `Workflow({ scriptPath: "${CLAUDE_PLUGIN_ROOT}/workflows/panel.js", args: { runId, runDir, pluginRoot: "${CLAUDE_PLUGIN_ROOT}", timestamp: "<new timestamp>", question: "<the focused question>", contextPath: "<runDir>/prd-draft.md", lenses } })`, record its run id in `run.json`, wait for the notification, and return to the top of this gate.

## 5. Finalize

One agent, inline:

```
Agent({
  subagent_type: "ck:river",
  description: "Finalize PRD",
  prompt: "Read <runDir>/prd-draft.md and <runDir>/gate-1.md. Fold the premortem answer into Assumptions and Risks, apply the requested edits, resolve each open decision as answered, keep Appendix A intact. Write the final PRD to <outputPath>. Set status 'final' in <runDir>/run.json. Return the path and a five-line summary."
})
```

Print the output path and the run directory. Suggest `/devlog` for the decision memo if the user has the devlog skill.
````

## Appendix D. `skills/prd-artifact/SKILL.md`

````markdown
---
name: prd-artifact
description: The Code Katz PRD contract: section order, required fields, and the checklist a PRD must pass. Load when writing, revising, or validating a PRD, inside or outside a ck workflow.
user-invocable: false
---

# The PRD contract

A PRD written to this contract has the same shape every time, in every project. Consistency comes from this file, not from who writes it.

## Section order

Use these headings verbatim, in this order.

1. `## Summary`: three sentences: what, for whom, and the one number that says it worked.
2. `## Problem`: the user pain, not the solution. Cite the root-cause chain (solution → why → why → why) and say whether it reached a root cause or a known symptom.
3. `## User`: one primary user, specific enough to recognize.
4. `## Success metric and leading indicator`: one number, a target, a date; one leading indicator.
5. `## Scope`: the decision taken (V0 or full, with rationale) and the V0 counter-proposal: what it keeps, what it cuts, whether it would still move the metric.
6. `## Non-goals`: at least two, each a thing this will explicitly not do.
7. `## Requirements`: numbered. Each has at least one acceptance criterion a reader could verify without asking the author.
8. `## Sequencing and dependencies`: what must be true before this can ship; what depends on what.
9. `## Assumptions`: every assumption the document rests on, including the one the premortem exposed.
10. `## Risks`: what would cause this to fail, with a mitigation or an explicit acceptance.
11. `## Open questions`: every decision left to the author.
12. `## Appendix A. Challenged claims`: claim | challenged by | severity | status | resolution. Nothing deleted.
13. `## Appendix B. Premortem`: the scenario, the exposed assumption, and the question "What went wrong?" verbatim.

## Claim tags

Every claim not taken directly from the brief carries an inline tag `[C1]`, `[C2]`, ... in the body. Appendix A addresses tags by id. A tag no lens challenged is listed there as unchallenged.

## File path

Default `plans/<YYYY-MM-DD>-<slug>-prd.md`, next to the archived plans. The author may choose another path at Gate 0.

## Checklist

A validator checks each item by reading. Each is a statement that is true or false.

1. Every section above is present, in order, with its heading verbatim.
2. Problem names the user pain, not the solution, and cites the root-cause chain.
3. Success metric is one number with a target and a date, plus one leading indicator.
4. Scope records the V0 or full decision and the V0 counter-proposal with what it cuts.
5. Non-goals has at least two entries.
6. Every requirement has at least one acceptance criterion a reader could verify without asking the author.
7. Every claim not from the brief carries a `[C<n>]` tag, and every tag appears in Appendix A or is marked unchallenged.
8. Assumptions includes the assumption the premortem exposed (or, before the premortem exists, says the premortem is pending).
9. Open questions lists every decision left to the author.
10. No em-dashes in prose. Em-dashes are acceptable only as separators in structured lists.

## Writing

Plain technical English: name the actor, one instruction per sentence, no filler, no loss of precision. Second person is fine for the user; third person for the system.
````

## Appendix E. `agents/river.md` as generated (excerpt)

```markdown
---
name: river
description: River, Product Manager. Reviews and drafts from the product manager perspective for ck panels and delegation; returns structured findings.
model: claude-opus-5
---

<!-- GENERATED from upstream/profiles/river.md at b4b211fbf4ec6f4d365a550b55e9981610ed7dda by scripts/generate-agents.sh; edit upstream, not this file. -->

# River — Product Manager

[body verbatim from upstream/profiles/river.md through "## How You Communicate"]

## Required Behaviors (subagent form)

You are running with no user present. Every behavior below still applies, in output form. Where a behavior tells you to ask, halt, interrupt, or require an answer before proceeding: do not stop. State the question verbatim under `questions` (addressed to `author` or to a named teammate), state the assumption you will proceed on, and proceed. Where a behavior produces an artifact (table, diagram, scenario, counter-proposal, pitch), produce it in full. Where it requires a decision from the user, give your recommendation with evidence and mark the decision as open.

### 1. Three Whys
[verbatim]

### 2. V0 Challenge
[verbatim]

### 3. Premortem
[verbatim]

## Handoff Brief
[verbatim]

## Signature Question
[verbatim]

---

You are running as a delegated subagent. When the prompt names a run directory, read inputs from it and write outputs only there. If a schema is imposed, fill every required field; anything you would have asked goes in `questions`. Return findings first, detail after.
```

The `model` line shows the value after the team-cli tiers PR (§8.4). Before that PR it reads `claude-fable-5`, verbatim from today's `tiers.conf`.

## Appendix F. Cost model

Prices per million tokens from the pricing page read 2026-09-05 [D]: Fable 5.1 $10 in / $50 out; Opus 5 $5 / $25; Sonnet 5 $2 / $10; Haiku 4.5 $1 / $5. Token counts are assumptions [P] for a one-page context document; the newer tokenizer produces about 30% more tokens than these figures assume [D]. No prompt-cache sharing between lenses (§3.3 item 15). Neutral agents assumed on Opus 5 (the session model).

### `/ck:panel`

| Agent | Model | Input | Output | Cost |
|---|---|---|---|---|
| river (product) | Opus 5 | 16k | 3k | $0.16 |
| toni (marketing) | Fable 5.1 | 16k | 3k | $0.31 |
| kai (ux) | Sonnet 5 | 16k | 3k | $0.06 |
| synthesis | Opus 5 | 20k | 4k | $0.20 |
| **Total** | | | | **about $0.73** |

### `/ck:prd` (the `prd-draft` workflow)

| Agent | Model | Input | Output | Cost |
|---|---|---|---|---|
| river draft | Opus 5 | 20k | 8k | $0.30 |
| validator | Haiku 4.5 | 15k | 1k | $0.02 |
| panel (above) | mixed | | | $0.73 |
| river synthesize | Opus 5 | 35k | 10k | $0.43 |
| **Total, no revision** | | | | **about $1.48** |
| one revision (validator again plus River revise) | | | | + about $0.32 |
| finalize (inline, Opus 5) | | 30k | 8k | + about $0.35 |

Call it $1.50 to $2.20 per PRD plus the main session's own gate turns. Concurrency: min(16, CPUs minus 2) [D]; on a 4-CPU laptop the panel runs in one round and `prd-draft` in about four sequential steps, since its stages depend on each other.

## Appendix G. Sources

Documentation, verified 2026-09-05:

- Dynamic workflows: https://code.claude.com/docs/en/workflows
- Subagents: https://code.claude.com/docs/en/sub-agents
- Plugins reference: https://code.claude.com/docs/en/plugins-reference
- Plugin marketplaces: https://code.claude.com/docs/en/plugin-marketplaces
- Hooks: https://code.claude.com/docs/en/hooks
- Skills: https://code.claude.com/docs/en/skills
- Pricing: https://platform.claude.com/docs/en/about-claude/pricing

Family record [R]:

- `claude-team-cli`: `ROADMAP.md` revision history (2026-07-29, 2026-07-31), `DEVLOG.md` (2026-09-04 entries), `scripts/generate-agents.sh`, `profiles/tiers.conf`, `tests/run.sh`
- `claude-conductor`: `DEVLOG.md` (2026-07-04), `docs/2026-07-03-fable-harness-modernization-analysis.md`, `docs/2026-07-04-agent-teams-spike.md`, branch `claude/research-desktop-tile-updates-BJqoP`
- `claude-plugins`: `.claude-plugin/marketplace.json` v1.3.0

Research [M], [V]: as listed in the proposal's §10; this PRD adds none.
