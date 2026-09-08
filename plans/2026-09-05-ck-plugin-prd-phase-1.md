# `ck` Plugin, Phase One: Product Requirements Document

> **Status:** PRD, ready for build
> **Date:** 2026-09-05
> **Author:** Fable (with Will Curran)
> **Derives from:** [`plans/2026-09-05-agent-workflows-research-and-proposal.md`](2026-09-05-agent-workflows-research-and-proposal.md) (the research proposal)
> **Supersedes:** the marketplace-retired decision in `claude-team-cli` (2026-07-31), for `ck` only; see §3.1
> **Scope:** phase one only: plugin skeleton, `/ck:brief`, `/ck:prd`, `/ck:panel`, and `/ck:next` end to end, 21 personas as subagents on the §5.6 tiers. Everything else is in §10
> **Revised:** 2026-09-05, after a cross-model panel against the Opus-written PRD; see [`plans/2026-09-05-ck-prd-panel-memo.md`](2026-09-05-ck-prd-panel-memo.md)

---

## 0. How to read this document

### 0.1 Grading

Every claim carries the proposal's grade, plus one more:

| Grade | Meaning |
|---|---|
| **[D]** | Product documentation, verified against the primary source on 2026-09-05. The URL is in Appendix I |
| **[M]** | Measured, independent, method stated (carried over from the proposal) |
| **[V]** | Vendor self-measured |
| **[R]** | The family's own record: a devlog entry, roadmap revision, or test in a code-katz repo |
| **[P]** | Practitioner assertion or judgment call. Open to challenge; the rationale is stated |

### 0.2 What this document is

The proposal is a research summary with a proposed shape. This is the specification for the first slice of that shape: what ships, what each piece must do, how it is tested, and what is deliberately left out. It contains acceptance criteria, schemas, and the full text of the three workflow scripts, three skills, and the brief-and-PRD contract, as appendices.

### 0.3 The three answers up front

1. **It is a plugin.** Claude Code is the runtime for subagents, workflow scripts, and skills; nothing else can run them. No UI ships in phase one. The catalog view is a phase-two command that renders from files. A workbench is phase three, only if the files-as-workbench proves insufficient, and never a hosted app with its own store of definitions. See §4.7.
2. **The skill owns the gates; each span between gates is one workflow.** A sign-off point is not a workflow. It is a gate: a review page with comments, a file the author edits, or, for Will, an interview. Gates live in the main session, because a workflow cannot pause for input and subagents cannot ask. See §4.2 and §4.9.
3. **`ck` coexists with `claude-team-cli`.** Phase one is additive. The three handoff routes survive: switch this session (team-cli), delegate one task (`ck:<name>`), open a separate session (team-cli). Retirement is revisited at 90 days with usage data. See §8.6.

---

## 1. Summary

`ck` is a Claude Code plugin. Phase one ships:

| Component | Count | What it is |
|---|---|---|
| Persona subagents | 21 | `agents/<name>.md`, generated from `claude-team-cli` profiles, registered as `ck:<name>`, model from the §5.6 tiers |
| Workflows | 3 | `/ck:brief` (River writes the brief from one sentence), `/ck:panel` (three lenses on different models and different evidence, one decision memo), and `/ck:prd-draft` (River drafts, a checker validates, the panel challenges, River rewrites) |
| Skills | 3 | `/ck:prd` (the entry point that owns the review before and after the draft), `/ck:next` (says what to run next in one sentence), and `prd-artifact` (the contract for the brief and the PRD: template, required fields, checklist) |
| Hooks | 1 | `SubagentStart` on `^ck:` appending one line per persona invocation to a usage log, so the 90-day prune has data |
| Tests | 1 suite | Manifest, drift against the pinned upstream, script lint, user-2 wording, Phase 0 answers, end-to-end drills |

Revised on 2026-09-05 after a cross-model panel against the Opus-written PRD: nine changes adopted and eleven rejected, each with a reason, recorded in [`plans/2026-09-05-ck-prd-panel-memo.md`](2026-09-05-ck-prd-panel-memo.md).

Everything in the proposal's §5.3 catalog beyond these commands, the hook-based gates, the model fallback chain, the Advisor tool, Routines, folding in the five artifact skills, persona switch skills, `/ck:map`, and any workbench are deferred with reasons in §10.

---

## 2. Problem, users, journey, goals

### 2.1 Problem

The unit of Will's work is the workflow, not the roster (proposal §2.1). Today the personas exist only as session takeovers and delegation subagents. They own no artifacts, so their output varies run to run (proposal §3.4). Multi-lens input on a decision requires opening three sessions by hand, and the three lenses run on one model, which is one opinion in three costumes (proposal §3.4, [M] error correlation rises with capability). Nothing is repeatable across projects, and nothing is measured, so the persona question ("likely 15 more than are used", proposal §7) cannot be answered.

### 2.2 Users

Adapted from the Opus PRD §3, which made the harder user the first-class one. Where the two conflict, she wins and Will gets an escape hatch.

| | Will | Will's wife |
|---|---|---|
| Technical? | Yes. Reads and writes code, comfortable in files and the terminal | No. Has shipped several iOS apps with Claude and claude-team-cli |
| Wants | Repeatability, adversarial input on decisions, visibility into cost and activity, a place to tune personas | To say what she wants in her own words and get a good document back |
| Tolerates | Several commands, flags, JavaScript, terminal output, cost decisions | One command at a time, plain language, no model names, no token counts |
| Fails when | The tool is slower than doing it himself | A command errors and she cannot tell what to do next |

### 2.3 Journey J1: Will's wife starts a new product

The primary journey. Phase one is done when this works without her opening a text editor or a hidden directory.

1. She has an idea. She creates a folder and opens Claude Code in it.
2. She types `/ck:` and sees the commands. She does not know where to start, so she runs `/ck:next`. It sees an empty project and says: "Start with `/ck:brief` and describe your idea in a sentence. It takes about a minute and writes `docs/brief.md`."
3. She runs `/ck:brief An app that reminds you to water each plant on its own schedule`. River writes the brief: the problem and the chain of whys behind it, the user, one success number, the scope with a smaller first version, and what it will not do. A checker confirms the shape. `docs/brief.md` appears with a short list of questions River could not answer for her.
4. She reads it. The user is not quite right. She either edits the file and saves, or, when the review page is available, opens the page and leaves a comment on the line. No approval screen, no command.
5. `/ck:next` now says: "Run `/ck:prd`. It turns the brief into full requirements and takes a few minutes." She runs it. It reads her edited brief. A draft is written and checked, three specialists argue about it on three different models, and River revises it. `docs/PRD.md` appears.
6. She gets a review page for `docs/PRD.md` with a short question at the top: "Imagine this shipped and did not move the number. What went wrong?" She comments where she disagrees, answers the question in a comment, and says "done". Claude works through every comment, changes the document, and marks each comment resolved with one line saying what changed. Without the review page she edits the file and runs `/ck:prd` again.
7. `/ck:next` suggests what comes next.

What she never does: choose a model, learn what a subagent is, sequence the stages herself, approve or reject anything in a form, or see a token count.

### 2.4 Goals and measures

| # | Goal | Measure | Source |
|---|---|---|---|
| G1 | Consistency: the same stage produces the same document shape every time | Two PRDs from two projects have identical section structure; the validator passes on both | The contract checklist (§7.8) |
| G2 | Repeatability: the stages ship with every project | A fresh project has every phase-one command after one install | The install drill (§9) |
| G3 | Adversarial input: real disagreement on a judgment call | In more than half of panel runs, at least one lens recommends differently, or at least one kill condition is met | `panelFailedToDisagree` and `agreementRate` in each memo |
| G4 | The harder user succeeds | J1 completes on a new project without a text editor or a hidden directory | The user-2 drill (§9) |
| G5 | Retention (proposal §3.4: the real metric for a personal tool) | At 30 days after install, at least one `/ck:prd`, `/ck:brief`, or `/ck:panel` run per week of active building | `${CLAUDE_PLUGIN_DATA}/usage.jsonl` (§5.5) |
| G6 | Instrumented: the persona question can be answered at 90 days | Every persona invocation is logged with its type and session | The same log |

Leading indicator: usage log entries in the first week. A panel that always agrees is a failed panel (proposal §5.5); if G3 is missed, the lenses or the question template are wrong, not the users.

### 2.5 Non-goals for phase one

- No workflow other than `brief`, `panel`, and `prd-draft`. The rest of the catalog in proposal §5.3 is phase two.
- No UI, dashboard, map, or workbench. `/workflows` is the run view (proposal §9, [D]).
- No retirement of `claude-team-cli`, no persona switch skills (`/ck:river`), no CLI in `bin/`.
- No hook-enforced artifact gates, no model fallback chain, no Advisor tool, no Routines, no mid-run arbitration (workflows cannot pause; §4.2).
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
| 2 | Workflow granularity vs sign-off | **The skill owns the gates; each span between gates that needs fan-out or verification is one workflow; a single-agent span runs inline via the Agent tool.** `/ck:prd` is a skill: the brief (from `/ck:brief`, or an optional interview) → `prd-draft` workflow → review (a page with comments, or a file edit) → inline finalize. `/ck:panel` and `/ck:brief` are pure workflows: inputs are args, output is a document, no gate. Full rule and the failure modes it must survive: §4.2, §4.3 | [D]-backed |
| 3 | Where artifacts live | **The artifact is the state** (adopted from the Opus PRD §7.9). Deliverables live at fixed, conventional, committed paths: `docs/brief.md`, `docs/PRD.md`, `docs/decisions/<timestamp>-<slug>.md`, overridable by argument. `.ck/runs/<run-id>/` is a cache (per-lens JSON, the harness run id), locally excluded via `.git/info/exclude`; nothing depends on it. Resume works from which documents exist plus a start-at stage (§4.3). The plugin never edits the user's `.gitignore` | [P] |
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
15. **§4.1, fan-out cache economics.** The prompt-cache sharing described there applies to agents matching on model, effort, agent type, tools, schema, and cwd [D]. A persona panel is three agent types on three models and shares nothing. The cost model in Appendix H assumes no sharing.

What the proposal gets right and this PRD keeps unchanged: §3 (topology, not persona strings, is the lever; buy quality with a different model and a real oracle), §4.3 (Agent Teams is not the executor), §5.2 (the four layers), §5.5 (forced self-disagreement; three approvals is a failed panel), §6 (the not-building list), §7 (the honest assessment), §9 (the UI stance).

A second review, against the PRD Opus wrote from the same proposal, produced nine changes adopted into this document and eleven rejections. The Opus PRD's own errors, verified against the docs, and the reason for each rejection are in [`plans/2026-09-05-ck-prd-panel-memo.md`](2026-09-05-ck-prd-panel-memo.md). The largest change: this document had named Will's wife as customer zero and then designed for Will. §2.2, §2.3, §4.8, and the file-edit path in §7.6 exist because the Opus PRD made her the harder constraint.

---

## 4. Architecture

### 4.1 The four layers and their phase-one instances

| Layer | Primitive | Owns | Phase-one instance |
|---|---|---|---|
| Workflow | `workflows/*.js` | The order of stages, outside the conversation | `panel.js`, `prd-draft.js` |
| Persona | `agents/*.md` | Voice, domain constraints, default model tier | 21 generated files, `ck:<name>` |
| Artifact | `skills/*/SKILL.md` | Output template, required fields, checklist | `prd-artifact` |
| Gate | The skill in the main session | Sign-off: a review page with comments, a file edit, or the optional interview; plus schema-forced output and a validator agent inside the workflow | `prd` (the brief check and the review); the validators in `brief.js` and `prd-draft.js` |

The proposal put the gate layer in `hooks/hooks.json`. Phase one puts human gates in the skill and machine gates in the scripts (§3.3 item 7). The hook that does ship is instrumentation, not enforcement.

### 4.2 The gate rule

The docs: "No mid-run user input. Only agent permission prompts can pause a run. For sign-off between stages, run each stage as its own workflow." [D] And: `AskUserQuestion` is removed from every subagent [D].

Therefore:

1. A sign-off is a **gate**. A gate runs in the main session, inside a skill: a review page with comments (§4.9), a file the author edits and re-runs, or, optionally, an interview with `AskUserQuestion`.
2. The span between two gates is a **workflow** when it needs fan-out, structured output, or resume. A span that is one agent runs inline through the Agent tool; a workflow for one agent buys nothing.
3. A workflow never contains a decision point. A skill never fans out by hand.
4. A skill or slash command whose instructions say to call Workflow is explicit opt-in [D]; no `ultracode` keyword, no "use a workflow" phrase is needed.

Rejected alternatives: one workflow per persona action (the skill would orchestrate fan-out itself, which is what Workflow exists to do); one workflow per command (impossible with a gate in the middle); no workflows (loses resume, schema validation, the progress view, and the "don't ask again for `<name>`" consent that plugin workflows get by name [D]).

What would make the rule wrong: subagents regaining `AskUserQuestion`, or workflows gaining a pause primitive. Neither is on the record.

### 4.3 Artifacts are the state; the run directory is a cache

Adopted from the Opus PRD §7.9. The deliverables outlive the tool, so they live at plain, committed paths, and the plugin keeps no private state that anything depends on.

| Artifact | Path | Written by | Committed |
|---|---|---|---|
| Brief | `docs/brief.md` | `/ck:brief`, or the optional interview in `/ck:prd` | Yes |
| PRD | `docs/PRD.md` | `/ck:prd` (written progressively by the `prd-draft` stages, then finalized) | Yes |
| Decision memo | `docs/decisions/<timestamp>-<slug>.md` | `/ck:panel`, and the nested panel inside `prd-draft` | Yes |

Paths are overridable by argument. `docs/` is the Opus convention; the family's root-level files (`ROADMAP.md`, `DEVLOG.md`) are unchanged.

The run directory is a cache. It holds what a fresh session might want but nothing the deliverable depends on:

```
.ck/runs/<run-id>/
├── run.json            { runId, createdAt, status, stage, outputPath, lenses, harnessRunId, scriptPath }
├── interview.md        the optional interview's answers, appended one at a time
├── panel/<persona>.json  one file per lens
└── gate-1.md           review-page comments or file edits, as applied
```

Rules, each of which closes a failure mode found in review:

| Rule | Failure it closes |
|---|---|
| `run-id` is `<UTC timestamp>-<slug>`, minted by the skill with `date -u`; workflows receive `timestamp` in `args` because `Date.now()` throws in scripts [D] | Non-deterministic scripts break resume |
| `runDir` is passed **absolute** in `args` | Subagents inherit the session cwd; a user in a subdirectory would get `.ck/` in the wrong place |
| Every workflow accepts `args.startAt` and skips completed stages; the skill decides `startAt` by which artifacts exist | A fresh session cannot replay the harness cache [D]; the file on disk is what survives |
| The optional interview appends each answer to `interview.md` as it is given, and the skill offers to resume an interview that has answers but no brief | Compaction in the middle of the interview loses the answers |
| The skill writes the Workflow tool's own run id into `run.json` as `harnessRunId` before it waits | Within a session, `resumeFromRunId` replays completed agents at no cost [D] |
| The skill adds `.ck/` to `.git/info/exclude` on first use, never to `.gitignore` | team-cli's `session done` refuses untracked files [R]; the cache must not block closing a worktree |
| Every agent that writes returns the path it wrote, in its schema | The script cannot check the filesystem; the next stage needs the path |

### 4.4 Naming

- Plugin `name`: `ck`. Everything is `/ck:<name>` or `ck:<name>` [D].
- Skills: `prd` and `next` (user-invocable, `disable-model-invocation: true`), `prd-artifact` (not user-invocable; read by agents and loadable by Claude when writing any brief or PRD).
- Workflows: `brief`, `panel`, `prd-draft`. A plugin workflow is itself a slash command [D], so `/ck:brief`, `/ck:panel`, and `/ck:prd-draft` all appear in autocomplete. `prd-draft` is safe to run directly if `docs/brief.md` exists; `/ck:prd` is the supported path.
- No name is shared between a skill and a workflow, because both occupy `/ck:<name>`.
- Agents: `river`, `akira`, ... in frontmatter (no colon allowed [D]); registered as `ck:river`, referenced as `agentType: 'ck:river'` in scripts and `subagent_type: "ck:river"` from the Agent tool.

### 4.5 Model policy and the effort axis

Two axes, adopted from the Opus PRD §7.8: the persona sets the model floor; the workflow stage sets the effort. Difficulty belongs to the task, not the persona.

| Agent kind | Model comes from | Effort comes from | Who may override the model |
|---|---|---|---|
| Persona agent (`agentType: 'ck:<name>'`) | Frontmatter `model:` from the §5.6 tiers, via `tiers.conf` upstream | The script, per stage; omitted means the session's effort | `panel.js` only, for lens decorrelation |
| Neutral utility agent (no `agentType`): validator, synthesis | The script sets `model` for the validator (Haiku 4.5, classification tier); synthesis inherits the session model | The script: validators run at `low` | The script |
| The main session (gates, `/ck:next`, finalize) | The user's session model | The session | The user |

Precedence is per-invocation → frontmatter → `CLAUDE_CODE_SUBAGENT_MODEL` → session [D]. `agent()` accepts `effort` per call [D]. Persona frontmatter never sets `effort`, so one persona can run a mechanical stage at `low` and a design stage at `xhigh` without a second definition. `/workflows` shows the requested and any substituted model per agent [D]; that is the "resolved model recorded per run" the proposal asks for, at no cost.

Not in phase one: escalation chains, the Advisor tool, and mid-run arbitration. Workflows cannot pause for input [D], and `PreModelSwitch` fires only on a requested session switch [D], so the escalation design in the Opus PRD §7.8 has no mechanism today. Phase-one resilience is null-tolerant scripts: a stage that fails returns `null`, the script logs it and continues where it can.

### 4.6 What phase one deliberately does not build

Everything in proposal §6, plus: hook-enforced gates, a fallback chain, the Advisor tool, Routines, mid-run arbitration, persona switch skills, a `bin/` CLI, any UI. Reasons are in §10.

### 4.7 Plugin, web app, wrapper, or dashboard

Will's question, answered with a recommendation:

1. **It is a plugin.** Subagents, workflow scripts, and skills execute only inside Claude Code. A web app cannot run them. The plugin is the product; nothing wraps it.
2. **Single source of truth rules out a hosted app with its own store.** The family retired local persona overrides twice on exactly this ground [R]. A web app that stores persona or workflow definitions recreates the problem. Anything that edits must edit the same files, and the change must flow through git, the generator, and the tests.
3. **`/workflows` is the run view** [D]: phases, agent counts, tokens, elapsed time, drill-down to any agent's prompt and result. What it does not show is the static catalog (which workflows exist; which personas, tiers, and models each stage uses) and the per-run interaction graph (which lens asked which lens what).
4. **The catalog is derivable from files.** Every `ck` workflow declares `phases` and a `personas` list in `meta` (§6.5, §7.5). `meta` is a pure literal [D], so it names the default roster, not a run-time choice. Phase two `/ck:map` emits a Mermaid graph (workflow → phase → persona → tier → model) with one agent and no infrastructure; `/ck:map --run <id>` draws the per-run graph from `panel/*.json`. GitHub renders Mermaid in Markdown.
5. **If a workbench is ever built**, decide its two halves separately. The *viewer* half reads and never owns; it could be a local page or a published Artifact generated from the plugin's files. The *editor* half must be local, because only a local process can run `generate-agents.sh` and `tests/run.sh` before a commit. The conductor precedent applies: local server plus browser, Tauri dropped [R], Python by preference. Build it only when the files-as-workbench is shown insufficient, which means a specific edit Will could not make in a text editor plus `bump-upstream.sh`.

### 4.8 Failure handling for the harder user

Adapted from the Opus PRD §7.11. This is a phase-one deliverable, not polish: one bad failure is how user 2 abandons a tool.

Three rules for every message the skills print:

1. Never show a stack trace, a model name, or a token count.
2. Always name the file that holds the work completed so far.
3. Always give exactly one next action.

Three failure classes and what she sees:

| Failure | What she sees | What she can do |
|---|---|---|
| The checker rejects a draft | "The PRD is missing a success metric. Fixing that section." | Nothing. It self-corrects, up to twice |
| A stage fails after retries | "I couldn't finish the requirements section. Everything up to it is saved in `docs/PRD.md`. Run `/ck:prd` again to continue from there." | Run it again. Completed stages are skipped |
| A panel lens or the whole workflow is unavailable | "One of the three reviewers didn't answer. The memo is based on the other two and says so." or "Claude is at capacity right now. Run `/ck:prd` again in a few minutes." | Wait or retry |

Will's escape hatch: `/workflows` shows every agent, model, and token count for anyone who wants them. The skills never print them.


### 4.9 Review pages: the feedback channel

Will's rule, recorded 2026-09-05: whenever a workflow produces a document for review, it arrives as a web page he can comment on; whenever there are designs to review, they arrive as mockups with labeled variants side by side, also commentable. That page is how he gives feedback. Claude holds every comment, then works through and resolves all of them once he says he is done.

Mechanism, verified in this session's tool contract: a published Artifact is a private HTML page on claude.ai; viewers leave comment threads on it; Claude reads the threads, replies on threads a person has sent to Claude, republishes the same URL, and marks each thread resolved.

Rules:

1. One page per review, republished in place; never a new URL for a revision.
2. When the author says "done", read every thread, apply each change to the file on disk (the artifact is the state, §4.3), republish, and resolve each thread with one line saying what changed. A comment Claude will not act on gets a reply with the reason and stays open.
3. Mockup pages show labeled variants (A, B, C); the author comments to pick one or ask for changes.
4. Availability is a Phase 0 spike (§8.0, S5). Every gate keeps a file-edit path that works without it.

Phase one uses this at Gate 1 of `/ck:prd` (§7.6). Mockup review pages arrive with `/ck:brand-guide` in phase two.

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

The interactive versions of River's three behaviors live in `skills/prd/SKILL.md`, for the optional interview and the review, where there is a user. A CI check asserts the skill carries the three behavior headings from `upstream/profiles/river.md`, so a renamed behavior fails the build instead of diverging silently (§9).

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

Proposal goal 4: adversarial and complementary input on one decision, from the product lens, the marketing lens, and the UX lens, each on a different model, each reading its own evidence, each forced to argue against itself. The output is a decision memo that shows where the lenses disagree and leaves the decision to the author (proposal §5.5). The memo format follows Will's own panel brief: agreement is flagged as low-information, kill conditions are quoted and checked, and unique findings and unchecked areas are listed.

### 6.2 Invocation

```
/ck:panel Should the first release include the branding guide step?
/ck:panel Is this PRD ready for review? --context docs/PRD.md
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
  "contextPath": "/abs/path/docs/PRD.md",
  "rationalePath": "/abs/path/docs/brief.md",
  "memoPath": "docs/decisions/20260905T210000Z-branding-step.md",
  "lenses": [{ "persona": "river", "lens": "product", "model": "claude-opus-5", "reads": ["docs/PRD.md", "ROADMAP.md"] }]
}
```

`runId`, `runDir`, `pluginRoot`, `timestamp`, and `question` are required; the script throws without them. Because a workflow is a slash command with no skill in front of it, the main session mints `runId` and `timestamp` with `date -u` and passes absolute paths; the workflow's `description` carries those instructions so a direct invocation still works.

### 6.3 Lenses, models, and evidence

| Lens | Persona | Default model | Reads by default | Why this model |
|---|---|---|---|---|
| product | `ck:river` | `claude-opus-5` | `docs/PRD.md`, `ROADMAP.md` | River's own tier; the anchor lens |
| marketing | `ck:toni` | `claude-fable-5-1` | `docs/market-research.md`, `docs/gtm.md` | The strongest model on the lens most often under-argued in a product decision; also the most expensive lens (Appendix H) |
| ux | `ck:kai` | `claude-sonnet-5` | `brand/`, `docs/mockups/` | Completes three distinct models at the lowest added cost |

Every lens also reads `contextPath` when given. Files in `reads` that do not exist are skipped and named in the result. Varying the evidence does more than varying the model (Opus PRD P7): three Claude tiers give scale diversity, not independent judgment, because they share one training pipeline. The memo header states this limitation (proposal §8.5).

**Two passes.** Each lens forms and records its view from the material and its own evidence first. Only then, if `rationalePath` is given, does it read the author's rationale, check whether the claims it relied on are supported, and report whether its view changed. A reviewer who reads the rationale first ratifies instead of testing (Will's panel brief).

Any lens can be replaced or re-modelled per run. If two lenses share a model the script logs that their agreement counts as one opinion. `panel.js` is the one script allowed to pass `model` on a persona agent (§4.5). [P]

### 6.4 Lens schema

Every lens returns, and writes to `<runDir>/panel/<persona>.json`:

| Field | Meaning |
|---|---|
| `recommendation` | `yes`, `no`, `yes-if`, `not-yet` |
| `position` | One paragraph |
| `reasoning` | Evidence from the material or the lens's own reading, not from the other lenses |
| `evidenceRead` | The files actually read, so the memo can say what each lens saw |
| `strongestArgumentAgainstOwnRecommendation` | The best case a smart colleague would make against it; a weak one is a failed answer |
| `killCondition` | The specific, observable condition under which the lens would say this should not be done at all |
| `killConditionMet` | `yes`, `no`, or `unknown`: does the material already show that condition |
| `killConditionEvidence` | Where in the material, or why unknown |
| `viewChangedByRationale` | `yes`, `no`, or `not-read` |
| `questionsForOtherLenses` | `[{to, question}]`, addressed to `author` or a lens persona |
| `handoffBrief` | Decisions to record, open risks in the domain, one direct question to a named lens |

The schema is enforced at the tool-call layer, so a lens that omits a field is retried by the harness [D].

### 6.5 Stages

`meta.phases` and `meta.personas` (for the phase-two map):

| Phase | Agents | What happens |
|---|---|---|
| Lenses | 3, in parallel, `agentType: 'ck:<persona>'`, `model` per lens | Each reads the material and its own evidence, records its view, then reads the rationale if given; applies its behaviors in subagent form; writes `panel/<persona>.json`; returns the object |
| Synthesis | 1, neutral (no `agentType`, session model) | Reads the three results, writes the memo at `memoPath`, returns the memo object |

Four agents. One concurrency round on any machine with four or more CPUs. Full script: Appendix A.

### 6.6 Decision memo

Default path `docs/decisions/<timestamp>-<slug>.md`, committed; the artifact is the state (§4.3). Sections, in order:

1. Question and context: run id, timestamp, the lens table with models and what each read, the decorrelation limitation, any lens that did not answer
2. Recommendations: table, lens | persona | model | recommendation | one-line position
3. Agreement, flagged as low-information: what all lenses concur on, and whether that is because it is obviously true or because they share a blind spot; the memo says which
4. Disagreement: every point where two lenses conflict, both positions at full strength, and the decision the author must make. Not adjudicated
5. Kill conditions, verbatim, with each lens's own answer to whether the material already shows it met
6. Each lens against itself, verbatim
7. Unique findings: anything only one lens saw
8. What nobody checked
9. Questions between lenses, verbatim
10. Handoff briefs, verbatim, one per lens

The synthesis agent is neutral and holds no lens. It never averages positions or picks a winner. It computes `agreementRate` (the share of lenses on the most common recommendation) and sets `panelFailedToDisagree` when every lens recommends the same thing and no self-argument is substantive; the header then says the panel should be re-run with a different question or lens set. Above roughly two-thirds agreement the panel is theater (Will's brief); the rate is in the memo so `/ck:report` can track it later.

### 6.7 Failure handling

| Failure | Behavior |
|---|---|
| A lens is stopped by the user or dies on an API error | `agent()` returns `null` [D]; the script logs which lens is missing and synthesizes on the survivors; the memo header says so; the skill's message follows §4.8 |
| Every lens fails | The script throws; nothing is written; the session sees the error and the skill translates it |
| Synthesis returns `null` | The script returns the raw lens results with `memoPath: null`; `panel/*.json` is on disk |
| Two lenses share a model | Logged; the run proceeds |
| A file in `reads` does not exist | Skipped; listed in `evidenceRead` as absent |

### 6.8 Cost

About $0.75 per run at today's prices, dominated by the Fable lens. Assumptions and arithmetic: Appendix H.

### 6.9 Acceptance criteria

- [ ] `/ck:panel <question>` in a session with the plugin enabled shows the consent prompt with the option "don't ask again for `ck:panel`" [D]; after consent it runs in the background and `/workflows` shows phases Lenses and Synthesis.
- [ ] `<runDir>/panel/river.json`, `toni.json`, `kai.json` exist and validate against the lens schema; the memo exists at `docs/decisions/` with the ten sections.
- [ ] `/workflows` shows three different models on the three lens agents.
- [ ] Each lens's `evidenceRead` lists different files when the default `reads` exist.
- [ ] With `rationalePath` given, each lens reports `viewChangedByRationale` as `yes` or `no`, never `not-read`.
- [ ] Stopping one lens in `/workflows` produces a memo whose header names the missing lens.
- [ ] `--lenses` with a replaced persona and model is honored (visible in `/workflows` and in the memo's table).
- [ ] A deliberately one-sided question ("Should we keep the tests passing?") yields `panelFailedToDisagree: true` and an `agreementRate` of 1.
- [ ] The script passes §9 test 9.

---

## 7. `/ck:brief`, `/ck:prd`, and `/ck:next`

### 7.1 Purpose

Proposal goal 3: a PRD that has the same shape every time, in every project, produced by River with the product, marketing, and UX lenses challenging it before the author sees it. The shape comes from the artifact contract (§7.8); the process comes from three commands. The split between `brief` and `prd` is the one place a cheap early document governs an expensive later run (Opus PRD §7.4).

### 7.2 `/ck:brief`

A workflow (`workflows/brief.js`, Appendix C). Input: one line of idea text. Output: `docs/brief.md`.

```
/ck:brief An app that reminds you to water each plant on its own schedule
```

| Phase | Agents | What happens |
|---|---|---|
| Draft | 1, `ck:river` | Reads the idea and Part A of the contract. Writes `docs/brief.md`: the idea; the problem with the root-cause chain (why, why, why) written out; the user; one success number with a date and a leading indicator; the scope with a smaller first version and River's recommendation; non-goals; open questions for the author. River's interactive behaviors run in subagent form (§5.4): the chain of whys is written, not asked; the smaller version is proposed, not negotiated |
| Validate | 1 neutral, Haiku 4.5, `effort: 'low'`; then `ck:river` once if needed | Checks the brief against Part A's checklist; one revision at most |

Three agents at most. About a minute. Cost in Appendix H. Acceptance: `docs/brief.md` exists with Part A's seven sections; the open-questions list is present even when empty; the skill's closing message names the file and gives one next action ("Read it, change anything, then run `/ck:prd`").

### 7.3 `/ck:prd`: entry

A skill (`skills/prd/SKILL.md`, Appendix D), `disable-model-invocation: true`, argument hint `[--interview] [idea]`.

1. **Precondition.** If the Workflow tool is not available in the session, stop: "Dynamic workflows are not available here. `/ck:prd` needs them." No fallback to running the stages by hand.
2. **Find the brief.** If `docs/brief.md` exists, go to step 4. If not and `--interview` was given, run the interview (step 3). Otherwise stop with one action: "Run `/ck:brief <your idea>` first. It takes about a minute and writes `docs/brief.md`. Then run `/ck:prd` again."
3. **The interview (Will's path).** River asks, one question at a time, and appends each answer to `<runDir>/interview.md` before asking the next. Three Whys with early-stop options; the user; the success number and leading indicator; non-goals; the V0 Challenge with its three options; the lens choice ("default panel, or name lenses"); the output path (default `docs/PRD.md`). Then River writes `docs/brief.md` from the answers. The interview's three behavior headings match `upstream/profiles/river.md` (CI-checked, §9). An interview with answers but no brief is offered for resume on the next run.
4. **Resume check.** If `docs/PRD.md` exists and the latest `run.json` says the run stopped at a stage, offer to continue from that stage. If it says `final`, ask whether to revise (re-run the panel on named sections) or start over.
5. **Mint the run** (§4.3): timestamp, run id, absolute cache directory, `.git/info/exclude`, `run.json` with `status: "starting"`.

### 7.4 Launch and wait

The skill calls, exactly:

```
Workflow({
  scriptPath: "${CLAUDE_PLUGIN_ROOT}/workflows/prd-draft.js",
  args: {
    runId, runDir, pluginRoot: "${CLAUDE_PLUGIN_ROOT}", timestamp,
    briefPath: "<abs>/docs/brief.md", prdPath: "<abs>/docs/PRD.md",
    startAt: "<draft | validate | panel | synthesize>",
    lenses: <list or null>
  }
})
```

It writes the returned run id into `run.json` as `harnessRunId` with `scriptPath`, sets `status: "drafting"`, tells the user in plain words that the draft is running in the background, and **stops: it waits for the task notification. It does not poll, does not narrate, and does not start other work on this run.** On a stop or failure it prints the §4.8 message naming `docs/PRD.md` and the one action, and records the failed stage in `run.json` so the next run passes the right `startAt`. Within the same session it may instead offer `Workflow({ scriptPath, resumeFromRunId: harnessRunId })`, which replays completed agents from cache [D].

`${CLAUDE_PLUGIN_ROOT}` expands anywhere in skill content [D]. Whether `name: "ck:prd-draft"` also works for the Workflow tool is unverified (§10.2); `scriptPath` is the specified path.

### 7.5 The `prd-draft` workflow

`meta.personas: ['river', 'toni', 'kai']`. Full script: Appendix B. Stages run in order and each is skipped when `args.startAt` names a later one.

| Phase | Agents | What happens | Writes |
|---|---|---|---|
| Draft | 1, `ck:river` | Reads `docs/brief.md` and Part B of the contract. Writes `docs/PRD.md` to the contract's section order. Tags every claim not taken from the brief `[C1]`, `[C2]`, ... so the lenses can address it. Root-cause chain and V0 counter-proposal in subagent form. No premortem yet | `docs/PRD.md` |
| Validate | 1 neutral, Haiku 4.5, `effort: 'low'`; then `ck:river` to revise, at most twice | Checks the draft against Part B's checklist; returns `{valid, missing[], notes}`. On `missing`, River revises in place, keeping every `[C<n>]` tag. After two revisions the workflow proceeds and logs what is still missing | `docs/PRD.md` |
| Panel | 4, nested `workflow({scriptPath: pluginRoot + '/workflows/panel.js'})` | Question: "Is this PRD ready for the author's review, and what would you change before it ships?" Material: `docs/PRD.md`. Rationale, read second: `docs/brief.md`. Evidence per lens: River the brief and `ROADMAP.md`; Toni any positioning material; Kai any screens or mockups | `panel/*.json`, `docs/decisions/<timestamp>-prd-review.md` |
| Synthesize | 1, `ck:river` | Rewrites `docs/PRD.md`: revised where the panel showed a claim wrong or unsupported; **Appendix A, Challenged claims** (claim, challenged by, severity, status ∈ upheld, revised, withdrawn, open; resolution; the memo's disagreements reproduced verbatim; nothing deleted); **Appendix B, Premortem** (the scenario, the exposed assumption, the question "What went wrong?" left verbatim for the review) | `docs/PRD.md` |

Seven agents without a revision, up to nine with two. Under the default "medium" size guideline; about four sequential steps on a 4-CPU laptop, since the stages depend on each other. If the nested panel throws, the workflow logs it and synthesizes without it, saying so in the PRD header.

### 7.6 Gate 1: the review

Two paths, chosen by whether the Artifact tool is available in the session (Phase 0 spike, §8.0).

**Review page (Will's feedback channel, §4.9).** The skill publishes `docs/PRD.md` as a private review page, with the premortem question at the top and one line of instructions: "Comment on anything. Say 'done' here when you are finished." It waits. When the user says done, it reads every comment thread, applies each one to `docs/PRD.md` (or replies with a reason when it will not), republishes the same page, and resolves each thread with one line saying what changed. Then it finalizes.

**File edit (always available).** "Open `docs/PRD.md`, change anything you like, save, and run `/ck:prd` again. I'll fold your edits in." On the next run the skill sees `status: "review"` in `run.json` and finalizes from the edited file.

Either path may also trigger a targeted re-run: `Workflow({ scriptPath: "${CLAUDE_PLUGIN_ROOT}/workflows/panel.js", args: { ..., question: "<the focused question>", contextPath: "<abs>/docs/PRD.md", rationalePath: "<abs>/docs/brief.md" } })`, then back to this gate.

### 7.7 Finalize

One agent, so no workflow (§4.2):

```
Agent({
  subagent_type: "ck:river",
  description: "Finalize PRD",
  prompt: "Read docs/PRD.md and <runDir>/gate-1.md (the review comments and how each was applied, or the note that the file was edited directly). Fold the premortem answer into Assumptions and Risks, resolve each open decision as answered, keep Appendix A intact, and check the result against Part B of the contract. Write docs/PRD.md. Set status 'final' in <runDir>/run.json. Return the path and a five-line summary."
})
```

The skill prints the path and one next action: "Run `/ck:next`." It suggests `/devlog` for the decision memo when that skill is installed.

### 7.8 The artifact contract

`skills/prd-artifact/SKILL.md` (full text: Appendix F). Not user-invocable. Two parts in one file, so the validator has one thing to read.

**Part A, the brief.** Sections: Idea; Problem and root-cause chain; User; Success metric and leading indicator; Scope (decision and the smaller first version); Non-goals; Open questions for the author. Checklist A1 to A6.

**Part B, the PRD.** Sections: Summary; Problem; User; Success metric and leading indicator; Scope; Non-goals; Requirements (numbered, each with acceptance criteria); Sequencing and dependencies; Assumptions; Risks; Open questions; Appendix A Challenged claims; Appendix B Premortem. Checklist B1 to B10, each a statement the validator can check by reading.

Claude also loads this skill on its own when asked to write a brief or a PRD outside the workflow (its description says so), which is the proposal's consistency mechanism (§3.4) reaching the plain session too.

### 7.9 `/ck:next`

A skill (`skills/next/SKILL.md`, Appendix E). It looks at which of `docs/brief.md`, `docs/PRD.md`, and `docs/decisions/` exist and says one thing in plain words:

| State | It says |
|---|---|
| No `docs/brief.md` | "Start with `/ck:brief` and describe your idea in a sentence. It takes about a minute and writes `docs/brief.md`." |
| Brief, no PRD | "Run `/ck:prd`. It turns the brief into full requirements and takes a few minutes." |
| PRD not final (`run.json` says review or a stopped stage) | "Your PRD is waiting for your review. Open `docs/PRD.md` (or the review page), then run `/ck:prd` again." or the resume message from §4.8 |
| PRD final | "The PRD is done. When you have a decision to make, run `/ck:panel <your question>`. The next stages (`brand-guide`, `roadmap`) are not installed yet." |

No model names, no token counts, no more than one action. It runs in the main session with no agents.

### 7.10 Cost

About $0.20 for `/ck:brief`; about $1.50 for `/ck:prd` without a revision, about $2.00 with one, plus the main session's own turns. Appendix H.

### 7.11 Acceptance criteria

- [ ] `/ck:brief <idea>` writes `docs/brief.md` with Part A's sections and passes the validator; the closing message names the file and one action.
- [ ] `/ck:prd` without a brief stops with the one-action message and runs nothing.
- [ ] `/ck:prd --interview` asks one question at a time; after the second why, `<runDir>/interview.md` already holds the first two answers; killing the session and re-running offers to resume.
- [ ] `run.json` contains `harnessRunId` before the skill goes idle.
- [ ] `.git/info/exclude` contains `.ck/`; `git status` shows `docs/` files and nothing under `.ck/`.
- [ ] `/workflows` shows phases Draft, Validate, Panel (with the nested panel's agents), Synthesize; the validator runs on Haiku 4.5.
- [ ] `docs/PRD.md` has every Part B section, an Appendix A with at least one row per finding a lens raised, and an Appendix B with a scenario and the verbatim question.
- [ ] Stopping the workflow during Panel, then running `/ck:prd` again, continues from Panel without re-drafting (`startAt`).
- [ ] With the Artifact tool available: a review page is published; two comments are applied and resolved with one-line replies; the page is republished.
- [ ] Without it: the file-edit message is printed; an edit to `docs/PRD.md` followed by `/ck:prd` finalizes from the edited file.
- [ ] The final PRD is at `docs/PRD.md` with `status: final` in `run.json`, and its checklist passes when re-validated by hand.
- [ ] `/ck:next` gives the right one-line answer in each of the four states, with no model names.
- [ ] J1 (§2.3) completes on a fresh project without a text editor or `.ck/`, on the file-edit path.
- [ ] The consent prompts seen during the drill are recorded, including whether the nested panel prompted separately (§10.2).
- [ ] `skills/prd/SKILL.md` contains the three behavior headings from `upstream/profiles/river.md` (CI-checked).

---

## 8. Repository, packaging, release

### 8.0 Phase 0: spikes before the build

Adopted from the Opus PRD §9. Each is a one-session experiment with a yes-or-no answer recorded in `tests/drill/`.

| # | Spike | Why it gates the build | Answer today |
|---|---|---|---|
| S1 | Install from the marketplace on a second machine; `/ck:next` runs | Distribution is the whole point | Open |
| S2 | Inside a workflow, `agentType: 'ck:river'` runs on the model in its frontmatter, and `model:` on the call overrides it | The tier table and the panel's decorrelation both depend on it | Open; the docs say yes [D] |
| S3 | A nested `workflow({scriptPath})` consent: separate prompt or covered by "don't ask again" | Friction on every `/ck:prd` run | Open |
| S4 | The `SubagentStart` hook's stdin carries `agent_type` and `session_id`, and `CLAUDE_PLUGIN_DATA` is writable | The usage log, so G6 | Open; the docs say yes [D] |
| S5 | The Artifact tool (review pages) is available in Will's local Claude Code, and its comments can be read from a skill | Chooses the Gate 1 path | Open |
| S6 | Can `PreModelSwitch` interrupt a workflow to arbitrate a model change | The Opus PRD's escalation design | **Answered: no.** Workflows accept no mid-run input and the hook fires on a requested session switch only [D] |

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
│   ├── prd/SKILL.md              /ck:prd (Appendix D)
│   ├── next/SKILL.md             /ck:next (Appendix E)
│   └── prd-artifact/SKILL.md     the contract, Parts A and B (Appendix F)
├── workflows/
│   ├── panel.js                  /ck:panel (Appendix A)
│   ├── prd-draft.js              /ck:prd-draft (Appendix B)
│   └── brief.js                  /ck:brief (Appendix C)
├── hooks/hooks.json              §5.5
├── scripts/
│   ├── generate-agents.sh
│   ├── bump-upstream.sh
│   ├── usage-log.sh
│   └── upstream.lock
└── tests/
    ├── run.sh
    ├── drill/                    Phase 0 answers and drill logs, dated
    └── fixtures/                 a tiny project with a one-line idea and a one-page context doc
```

A project that uses the plugin gains: `docs/brief.md`, `docs/PRD.md`, `docs/decisions/*.md` (committed), and `.ck/runs/` (a cache, locally excluded).

### 8.2 Manifest

```json
{
  "name": "ck",
  "description": "Persona workflows for Claude Code: /ck:brief and /ck:prd (a River-led brief and PRD, challenged by a three-lens panel), /ck:panel (product, marketing, and UX lenses on different models), /ck:next, and 21 Code Katz personas as ck:<name> subagents.",
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
  "description": "Persona workflows: /ck:brief and /ck:prd (River-led, challenged by a three-lens panel), /ck:panel (product, marketing, UX lenses on different models), /ck:next, and 21 personas as ck:<name> subagents. Phase one of the code-katz plugin.",
  "category": "workflow",
  "keywords": ["workflows", "personas", "prd", "brief", "panel", "subagents"]
}
```

Install: `/plugin marketplace add code-katz/claude-plugins` then `/plugin install ck@code-katz`. For development: `claude --plugin-dir /path/to/ck`, then `/reload-skills` after editing a workflow [D].

### 8.4 Prerequisites

| Prerequisite | Why | Grade |
|---|---|---|
| A paid Claude Code plan with dynamic workflows available; on Pro, enabled in `/config` | Workflows are the orchestrator | [D] |
| Workflows not disabled by the organization (`disableWorkflows`) | Same | [D] |
| team-cli PR re-basing `tiers.conf` to §5.3 | `ck` copies the tier verbatim; without the PR, River runs on Fable 5 and the panel's Opus lens is an override, not a tier | [R] |
| The Artifact tool, for the review-page path of Gate 1 | Optional; the file-edit path always works | Spike S5 |
| Node 20+ on the developer's machine, for the script check in the tests only | The plugin itself needs no Node at run time | [P] |
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
| Run a repeatable pipeline | `/ck:brief`, `/ck:prd`, `/ck:panel`, `/ck:next` | ck |
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
| 4 | Per agent: `model:` equals the `tiers.conf` line; `name:` equals the filename, no colon; `## Handoff Brief` present; `## Greeting` absent; the §5.4 preamble sentence present; no `effort:` line | drift |
| 5 | `scripts/upstream.lock` has exactly one `commit=` with a 40-hex value | drift |
| 6 | Opt-in (dispatch or schedule, never on push): `git fetch --depth 1 origin <sha>` and `diff -r` the vendored files against it | drift, network |
| 7 | `skills/prd/SKILL.md` contains the three `### N. <name>` headings from `upstream/profiles/river.md` | contract |
| 8 | `skills/prd-artifact/SKILL.md` Part A and Part B section lists equal the lists in the `brief.js` and `prd-draft.js` Draft prompts | contract |
| 9 | Every `workflows/*.js`: `node --check` passes on a copy with `export` stripped and the body wrapped in `(async () => { ... })()`, because workflow scripts use top-level `return` and `await`, which a bare module rejects; first statement is `export const meta`; `meta` has `name`, `description`, `phases`, `personas`; grep for `Date.now|Math.random|new Date\(\)|require\(|import\(` is empty | lint |
| 10 | `hooks/hooks.json` parses; the matcher is `^ck:`; `usage-log.sh` given a fixture stdin appends one valid JSON line and exits 0, and exits 0 on garbage input | hook |
| 11 | `skills/next/SKILL.md` and `skills/prd/SKILL.md` contain no model names and no token counts in user-facing text (grep for `claude-`, `opus`, `sonnet`, `fable`, `haiku`, `token` outside code fences) | user 2 |
| 12 | Phase 0 answers recorded under `tests/drill/` for S1 to S6 before the release is tagged | phase 0 |
| 13 | End-to-end drill, by hand, on the fixture project and then on one real project: `/ck:next`, `/ck:brief`, `/ck:prd` on the file-edit path, `/ck:panel`; a second pass on the review-page path where S5 says yes; a stop during Panel followed by a resume. Record the consent prompts, the files under `docs/` and `.ck/runs/<id>/`, the models shown in `/workflows`, and every message the skills printed. The drill log is committed under `tests/drill/<date>.md` | e2e |
| 14 | The J1 drill: someone who is not Will runs the file-edit path on a fresh project from the README alone; every message they see is checked against §4.8's three rules | user 2 |

`claude plugin eval` is early access and not enabled today; when it is, the drills become an eval suite and tests 13 and 14 stop being manual.

---

## 10. Deferred and open

### 10.1 Deferred, with the trigger to revisit

| Item | Why not in phase one | Revisit when |
|---|---|---|
| The other seven workflows in proposal §5.3 (`opportunity`, `market-research`, `brand-guide`, `roadmap`, `feature`, `bugfix`, `gtm`) | Phase one proves the gate rule, the port, and the artifact contract on the brief and the PRD first | Phase one has been used weekly for 30 days |
| `/ck:review`: a six-reviewer artifact review with adversarial refuters and a verify cap (designed during this PRD's review; a different product from the three-lens panel) | The panel is the decision primitive the proposal asks for; a review workflow is a second one | The panel proves too narrow for code, design, or plan reviews |
| Persona switch skills `/ck:<name>` | team-cli's `/name` commands cover the switch route today | The retire-or-coexist decision at 90 days |
| Persona scopes: core, project cast (the game and genre seats moved to the projects that use them), personal (Opus PRD §7.7) | The shape of the 90-day prune; casts stay generated from upstream, never hand-copied | The 90-day review |
| `/ck:report`: a static HTML report of spend, runs, and persona usage | Phase one has no data yet; conductor's fixture-fenced cost parser and `pricing.json` are the reuse [R] | Thirty days of usage log |
| Mockup review pages with labeled variants (§4.9) | No design stage in phase one | `/ck:brand-guide` |
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
8. Is the Artifact tool (review pages, §4.9) available in Will's local Claude Code, and can a skill read its comments there? Phase 0 spike S5. The file-edit path covers phase one either way.

---

## 11. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Workflows unavailable (plan, `/config`, or org `disableWorkflows`) | Low for Will; real for other users | The plugin is inert | README states the prerequisite; the `prd` skill checks for the Workflow tool before anything else and stops with a plain reason |
| An API error nulls a lens | Medium | Memo on two lenses | Logged; memo header says so; re-run offered; a lens can be re-modelled per run |
| The Fable lens dominates cost | Certain | About $0.30 to $0.50 of every panel | `--lenses` override; an all-Opus-and-Sonnet assignment is one flag away |
| Persona text drifts from upstream | Low | Two Rivers disagree | `upstream.lock`, drift test, `bump-upstream.sh` prints the diff |
| 21 personas is 15 too many | Likely (proposal §7) | Maintenance and choice paralysis | Generated, so carrying cost is near zero; `usage.jsonl`; prune at 90 days |
| River and Akira on Opus 5 write worse PRDs than on Fable | Unknown | Quality of the flagship artifact | One line in `tiers.conf` reverts it; the panel disagreement rate and Gate 1 edit volume are the signal |
| The 4.7-and-later tokenizer produces about 30% more tokens [D] | Certain | Appendix H underestimates by up to 30% | Stated in Appendix H; `/workflows` shows real token totals |
| Compaction during the interview | Medium on long interviews | Lost answers | Append-as-you-go and the resume check (§4.3) |
| The harder user gets designed out again as features accrete | Medium | She abandons it after one bad run | J1 is a test (§9 test 14); §4.8's three rules are grep-checked (test 11); every new command needs a one-line `/ck:next` answer |
| Consent prompts on every run annoy | Medium | Friction | "Don't ask again for `ck:panel`" on the first run; allow rules `Workflow(ck:panel)`, `Workflow(ck:prd-draft)` |
| Two River subagents (`river`, `ck:river`) confuse delegation | Low | Wrong tier or stale text | README note; every `ck` prompt names `ck:<persona>` explicitly |
| `meta.personas` rejected by the loader | Low | Workflow missing from autocomplete | Open question 5; fallback is to move the roster into `description` |

---

## Appendix A. `workflows/panel.js`

```js
export const meta = {
  name: 'panel',
  description: 'Three-lens decision panel: product (river), marketing (toni), and UX (kai) personas, each on a different model and each reading its own evidence, argue one question; a neutral memo surfaces where they disagree and leaves the decision to the author. Args: runId, runDir (absolute cache directory), pluginRoot, timestamp (UTC, minted by the caller with date -u), question, contextPath (optional), rationalePath (optional; each lens reads it only after forming its view), memoPath (optional; default docs/decisions/<timestamp>-panel.md), lenses (optional [{persona, lens, model, reads}]).',
  phases: [
    { title: 'Lenses', detail: 'ck:river, ck:toni, ck:kai in parallel, one model each, each reading its own evidence, each forced to argue against itself' },
    { title: 'Synthesis', detail: 'one neutral agent writes the decision memo: agreement flagged as low-information, disagreement preserved, decision left to the author' },
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
const rationalePath = args.rationalePath || null
const memoPath = args.memoPath || ('docs/decisions/' + stamp + '-panel.md')

// Three lenses, three models, three bodies of evidence. The same model in three
// costumes is one opinion; the same evidence read three times is one reading.
// This is the one script in ck allowed to set `model` on a persona agent; the
// per-invocation model beats the agent's frontmatter tier.
const DEFAULT_LENSES = [
  { persona: 'river', lens: 'product', model: 'claude-opus-5', reads: ['docs/PRD.md', 'ROADMAP.md'] },
  { persona: 'toni', lens: 'marketing', model: 'claude-fable-5-1', reads: ['docs/market-research.md', 'docs/gtm.md'] },
  { persona: 'kai', lens: 'ux', model: 'claude-sonnet-5', reads: ['brand/', 'docs/mockups/'] },
]
const lenses = Array.isArray(args.lenses) && args.lenses.length
  ? args.lenses.map((l, i) => {
      if (!l || !l.persona) throw new Error('panel: every entry in args.lenses needs a persona')
      const d = DEFAULT_LENSES[i % DEFAULT_LENSES.length]
      return { persona: l.persona, lens: l.lens || l.persona, model: l.model || d.model, reads: Array.isArray(l.reads) ? l.reads : [] }
    })
  : DEFAULT_LENSES
if (new Set(lenses.map(l => l.model)).size < lenses.length) {
  log('panel: two or more lenses share a model; their agreement counts as one opinion')
}

const QUESTION = {
  type: 'object',
  properties: { to: { type: 'string' }, question: { type: 'string' } },
  required: ['to', 'question'],
}
const YES_NO_UNKNOWN = { type: 'string', enum: ['yes', 'no', 'unknown'] }

const LENS_SCHEMA = {
  type: 'object',
  properties: {
    persona: { type: 'string' },
    lens: { type: 'string' },
    recommendation: { type: 'string', enum: ['yes', 'no', 'yes-if', 'not-yet'] },
    position: { type: 'string' },
    reasoning: { type: 'string' },
    evidenceRead: { type: 'array', items: { type: 'string' } },
    strongestArgumentAgainstOwnRecommendation: { type: 'string' },
    killCondition: { type: 'string' },
    killConditionMet: YES_NO_UNKNOWN,
    killConditionEvidence: { type: 'string' },
    viewChangedByRationale: { type: 'string', enum: ['yes', 'no', 'not-read'] },
    questionsForOtherLenses: { type: 'array', items: QUESTION },
    handoffBrief: { type: 'string' },
  },
  required: [
    'persona', 'lens', 'recommendation', 'position', 'reasoning', 'evidenceRead',
    'strongestArgumentAgainstOwnRecommendation', 'killCondition', 'killConditionMet',
    'killConditionEvidence', 'viewChangedByRationale', 'questionsForOtherLenses', 'handoffBrief',
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
    agreementRate: { type: 'number' },
    agreement: { type: 'string' },
    agreementIsLowInformationBecause: { type: 'string', enum: ['obviously-true', 'shared-blind-spot', 'mixed', 'no-agreement'] },
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
    killConditions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          persona: { type: 'string' }, condition: { type: 'string' },
          met: YES_NO_UNKNOWN, evidence: { type: 'string' },
        },
        required: ['persona', 'condition', 'met', 'evidence'],
      },
    },
    uniqueFindings: {
      type: 'array',
      items: {
        type: 'object',
        properties: { persona: { type: 'string' }, finding: { type: 'string' } },
        required: ['persona', 'finding'],
      },
    },
    nobodyChecked: { type: 'array', items: { type: 'string' } },
    panelFailedToDisagree: { type: 'boolean' },
    summary: { type: 'string' },
  },
  required: [
    'memoPath', 'question', 'recommendations', 'agreementRate', 'agreement',
    'agreementIsLowInformationBecause', 'disagreements', 'killConditions',
    'uniqueFindings', 'nobodyChecked', 'panelFailedToDisagree', 'summary',
  ],
}

// ---- Lenses ----
phase('Lenses')
const roster = lenses.map(l => `${l.persona}: ${l.lens}`).join('; ')
const results = (await parallel(lenses.map(l => () => agent(
  `You are ${l.persona}, the ${l.lens} lens on a ${lenses.length}-lens decision panel (${roster}).\n` +
  `The question: ${question}\n` +
  `Work in two passes and keep them separate.\n` +
  `Pass 1. Read ` + (contextPath ? `${contextPath} (the material the question is about) and ` : '') +
  `your own evidence: ${l.reads.length ? l.reads.join(', ') : 'nothing beyond the material'}. Skip any file or ` +
  `directory that does not exist and record what you actually read in evidenceRead. Form your view and write it ` +
  `down: recommendation (yes, no, yes-if, not-yet); position (one paragraph); reasoning (evidence from what you ` +
  `read or from your domain, not from the other lenses); strongestArgumentAgainstOwnRecommendation (the best ` +
  `case a smart colleague would make against you; a weak one is a failed answer); killCondition (the specific, ` +
  `observable condition under which this should not be done at all); killConditionMet (does the material already ` +
  `show it: yes, no, unknown) with killConditionEvidence (where, or why unknown).\n` +
  (rationalePath
    ? `Pass 2. Only now read ${rationalePath}, the author's rationale. Check whether the claims you relied on ` +
      `are supported there. Set viewChangedByRationale to yes or no and, if yes, say how in reasoning. Do not ` +
      `rewrite pass 1 to agree with it.\n`
    : `Pass 2. There is no rationale document; set viewChangedByRationale to not-read.\n`) +
  `Answer from your own domain only. Apply your Required Behaviors in subagent form: where a behavior tells you ` +
  `to ask the user, put the question in questionsForOtherLenses addressed to 'author' or to a lens persona, ` +
  `state your assumption, and proceed.\n` +
  `handoffBrief: decisions you want recorded, open risks in your domain, one direct question to a named lens.\n` +
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
  `against itself and its kill condition verbatim.\n` +
  `agreementRate is the share of lenses on the most common recommendation (two of three is 0.67). Treat ` +
  `agreement as low-information: say whether what they agree on is obviously true or a shared blind spot, and ` +
  `which. If every lens recommends the same thing and no self-argument is substantive, set ` +
  `panelFailedToDisagree to true and say in the header that the panel should be re-run with a different ` +
  `question or lens set. State in the header that all lenses are Claude models from one training pipeline, so ` +
  `decorrelation is partial, and list what each lens actually read.\n` +
  `Write ${memoPath} (create the directory if needed) with these sections: 1 Question and context (run id, ` +
  `timestamp, lens table with models and evidence read, the limitation, any missing lens); 2 Recommendations ` +
  `(table: lens | persona | model | recommendation | one-line position); 3 Agreement, flagged as ` +
  `low-information, with why; 4 Disagreement (every point where two lenses conflict, both positions at full ` +
  `strength, the decision the author must make); 5 Kill conditions, verbatim, each with the lens's own answer ` +
  `to whether the material already shows it met; 6 Each lens against itself, verbatim; 7 Unique findings ` +
  `(anything only one lens saw); 8 What nobody checked; 9 Questions between lenses (to -> question, verbatim); ` +
  `10 Handoff briefs (verbatim, one per lens). Then return the memo object; memoPath must be '${memoPath}'.`,
  { label: 'synthesis', phase: 'Synthesis', schema: MEMO_SCHEMA },
)

if (!memo) {
  log('panel: synthesis returned nothing; returning raw lens results')
  const recs = results.map(r => r.recommendation)
  const top = recs.sort((a, b) => recs.filter(x => x === b).length - recs.filter(x => x === a).length)[0]
  return {
    runId: args.runId, question, memoPath: null, lenses: lenses.map(l => l.persona), missing,
    recommendations: results.map(r => ({ persona: r.persona, lens: r.lens, model: modelOf(r.persona), recommendation: r.recommendation })),
    agreementRate: recs.filter(x => x === top).length / recs.length,
    agreement: '', agreementIsLowInformationBecause: 'no-agreement', disagreements: [],
    killConditions: results.map(r => ({ persona: r.persona, condition: r.killCondition, met: r.killConditionMet, evidence: r.killConditionEvidence })),
    uniqueFindings: [], nobodyChecked: [], panelFailedToDisagree: false,
    summary: 'synthesis agent returned nothing; see panel/*.json',
  }
}
if (memo.panelFailedToDisagree) log('panel: the panel failed to disagree; re-run with a different question or lens set')
log(`panel: agreement rate ${memo.agreementRate}; ${memo.disagreements.length} disagreement(s); ${memo.killConditions.filter(k => k.met === 'yes').length} kill condition(s) already met`)
return { runId: args.runId, ...memo, lenses: lenses.map(l => l.persona), missing }
```

## Appendix B. `workflows/prd-draft.js`

```js
export const meta = {
  name: 'prd-draft',
  description: "River drafts docs/PRD.md from docs/brief.md to Part B of the prd-artifact contract, a checker validates it, the three-lens panel challenges it (forming its view before reading the brief), and River rewrites it with a Challenged claims appendix and a premortem. Args: runId, runDir (absolute cache directory), pluginRoot, timestamp, briefPath (optional; default docs/brief.md), prdPath (optional; default docs/PRD.md), startAt (optional: draft | validate | panel | synthesize; earlier stages are skipped and the PRD on disk is used), lenses (optional). Normally launched by /ck:prd, which owns the review before and after.",
  phases: [
    { title: 'Draft', detail: 'ck:river writes docs/PRD.md from docs/brief.md to the contract; every non-brief claim tagged [C<n>]' },
    { title: 'Validate', detail: 'one neutral Haiku agent checks Part B of the contract; ck:river revises at most twice' },
    { title: 'Panel', detail: "nested /ck:panel on the draft: is it ready for the author's review, and what would you change" },
    { title: 'Synthesize', detail: 'ck:river rewrites docs/PRD.md: revised PRD, Appendix A Challenged claims, Appendix B Premortem' },
  ],
  personas: ['river', 'toni', 'kai'],
}

if (!args || !args.runId || !args.runDir || !args.pluginRoot || !args.timestamp) {
  throw new Error('prd-draft: args.runId, args.runDir, args.pluginRoot, and args.timestamp are required')
}
const runDir = args.runDir
const stamp = args.timestamp
const brief = args.briefPath || 'docs/brief.md'
const prdPath = args.prdPath || 'docs/PRD.md'
const contract = args.pluginRoot + '/skills/prd-artifact/SKILL.md'
const MAX_REVISIONS = 2
const VALIDATOR_MODEL = 'claude-haiku-4-5-20251001'

const ORDER = ['draft', 'validate', 'panel', 'synthesize']
const startAt = ORDER.includes(args.startAt) ? args.startAt : 'draft'
const runs = stage => ORDER.indexOf(stage) >= ORDER.indexOf(startAt)
if (startAt !== 'draft') log(`prd-draft: starting at ${startAt}; ${prdPath} on disk is the draft`)

const QUESTION = {
  type: 'object',
  properties: { to: { type: 'string' }, question: { type: 'string' } },
  required: ['to', 'question'],
}

const DRAFT_SCHEMA = {
  type: 'object',
  properties: {
    prdPath: { type: 'string' },
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
  required: ['prdPath', 'title', 'rootCauseChain', 'claims', 'assumptions', 'v0', 'questions'],
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
let draft = null
if (runs('draft')) {
  phase('Draft')
  draft = await agent(
    `Read ${brief}. It records what the author already decided: the idea, the problem and its root-cause chain, ` +
    `the user, the success metric and leading indicator, the scope decision and the smaller first version, ` +
    `non-goals, and open questions. Do not re-ask any of it.\n` +
    `Read Part B of ${contract}. It is the PRD contract: section order, required fields, and the checklist ` +
    `your draft will be validated against.\n` +
    `Write ${prdPath} to that contract, all sections in order (create the directory if needed). Apply your ` +
    `Required Behaviors in subagent form: restate the root-cause chain from the brief and extend it if the brief ` +
    `stopped at a symptom, saying which; always present the smaller first version with what it cuts and your ` +
    `recommendation, even if the brief chose full scope; leave the premortem for the pass after the panel, and ` +
    `say so under Appendix B.\n` +
    `Tag every claim that is not taken directly from the brief with an inline marker [C1], [C2], ... so the ` +
    `panel can address it, and list those claims with their section. Put anything you would have asked the ` +
    `author under Open questions, with your assumption.\n` +
    `Return the draft object; prdPath must be '${prdPath}'.`,
    { label: 'river:draft', phase: 'Draft', agentType: 'ck:river', schema: DRAFT_SCHEMA },
  )
  if (!draft) throw new Error('prd-draft: River returned nothing for the draft')
  log(`draft: ${draft.claims.length} tagged claim(s), ${draft.assumptions.length} assumption(s), ${draft.questions.length} open question(s)`)
}

// ---- Validate ----
let validation = null
if (runs('validate')) {
  phase('Validate')
  for (let round = 1; round <= MAX_REVISIONS + 1; round++) {
    validation = await agent(
      `Read Part B of ${contract} and ${prdPath}. Check the PRD against every numbered item in Part B's ` +
      `checklist and against the section order. Return valid=true only if every item holds. For each unmet ` +
      `item, one line in missing that quotes the checklist item and says what is absent or wrong. Judge the ` +
      `shape, not the product.`,
      { label: `validate:${round}`, phase: 'Validate', model: VALIDATOR_MODEL, effort: 'low', schema: VALIDATION_SCHEMA },
    )
    if (!validation) { log('validate: validator returned nothing; proceeding unvalidated'); break }
    if (validation.valid) { log(`validate: draft passes the contract checklist (round ${round})`); break }
    if (round > MAX_REVISIONS) {
      log(`validate: still unmet after ${MAX_REVISIONS} revision(s): ${validation.missing.join(' | ')}`)
      break
    }
    log(`validate: ${validation.missing.length} unmet item(s); River revises (revision ${round} of ${MAX_REVISIONS})`)
    const revised = await agent(
      `Read Part B of ${contract}, ${brief}, and ${prdPath}. A checker found these unmet checklist items:\n` +
      validation.missing.map(m => '- ' + m).join('\n') + '\n' +
      `Revise ${prdPath} in place so each item holds. Keep every existing [C<n>] tag and add tags for any new ` +
      `claim not from the brief. Return the updated draft object; prdPath must be '${prdPath}'.`,
      { label: `river:revise:${round}`, phase: 'Validate', agentType: 'ck:river', schema: DRAFT_SCHEMA },
    )
    if (!revised) { log('validate: revision returned nothing; keeping the previous draft'); break }
    draft = revised
  }
}

// ---- Panel (nested; one level only; each lens reads its own evidence and sees the brief last) ----
let panel = null
if (runs('panel')) {
  phase('Panel')
  const lenses = Array.isArray(args.lenses) && args.lenses.length ? args.lenses : [
    { persona: 'river', lens: 'product', model: 'claude-opus-5', reads: ['ROADMAP.md'] },
    { persona: 'toni', lens: 'marketing', model: 'claude-fable-5-1', reads: ['docs/market-research.md', 'docs/gtm.md'] },
    { persona: 'kai', lens: 'ux', model: 'claude-sonnet-5', reads: ['brand/', 'docs/mockups/'] },
  ]
  try {
    panel = await workflow({ scriptPath: args.pluginRoot + '/workflows/panel.js' }, {
      runId: args.runId,
      runDir,
      pluginRoot: args.pluginRoot,
      timestamp: stamp,
      question: "Is this PRD ready for the author's review, and what would you change before it ships?",
      contextPath: prdPath,
      rationalePath: brief,
      memoPath: 'docs/decisions/' + stamp + '-prd-review.md',
      lenses,
    })
  } catch (e) {
    log('panel: failed (' + (e && e.message ? e.message : String(e)) + '); synthesizing without it')
  }
  if (panel) {
    log(`panel: ${panel.lenses.join(', ')}; agreement ${panel.agreementRate}; ${(panel.disagreements || []).length} disagreement(s)` +
      (panel.panelFailedToDisagree ? '; the panel failed to disagree' : '') +
      (panel.missing && panel.missing.length ? `; missing: ${panel.missing.join(', ')}` : ''))
  }
}

// ---- Synthesize ----
phase('Synthesize')
const panelInputs = panel && panel.memoPath
  ? `${panel.memoPath} and every file under ${runDir}/panel/`
  : (panel
    ? `every file under ${runDir}/panel/ (the memo was not written)`
    : 'nothing else: the panel did not run, and the PRD header must say so')
const prd = await agent(
  `Read ${brief}, ${prdPath}, Part B of ${contract}, and ${panelInputs}.\n` +
  `Rewrite ${prdPath}: the same sections, in contract order, revised where the panel showed a claim wrong or ` +
  `unsupported, followed by two appendices.\n` +
  `Appendix A, Challenged claims: one row per point a lens raised against a [C<n>] claim or against something ` +
  `untagged: claim | challenged by (persona and lens) | severity (blocking, major, minor: your call from the ` +
  `memo) | status | resolution. Status is upheld (you kept it; say why), revised (you changed it; quote the ` +
  `change), withdrawn, or open (the author must decide). Never delete a challenge. Reproduce the memo's ` +
  `Disagreement section and its Kill conditions verbatim below the table.\n` +
  `Appendix B, Premortem: your Required Behavior in subagent form. Write the 2-3 sentence scenario in which ` +
  `this shipped on time and did not move the success metric; name the hidden assumption it exposes; add that ` +
  `assumption to the Assumptions section; leave the question "What went wrong?" verbatim for the author. ` +
  `The review asks it.\n` +
  `Check your own output against Part B's checklist before returning. List every decision you left open ` +
  `under openDecisions. Generated ${stamp}, run ${args.runId}. Return the PRD object; prdPath must be '${prdPath}'.`,
  { label: 'river:synthesize', phase: 'Synthesize', agentType: 'ck:river', schema: PRD_SCHEMA },
)
if (!prd) throw new Error('prd-draft: River returned nothing for the synthesis; the draft is at ' + prdPath)

return {
  runId: args.runId,
  startedAt: startAt,
  prdPath: prd.prdPath,
  memoPath: panel ? panel.memoPath : null,
  lenses: panel ? panel.lenses : [],
  validation,
  challengedClaims: prd.challengedClaims,
  premortem: prd.premortem,
  openDecisions: prd.openDecisions,
  summary: prd.summary,
}
```

## Appendix C. `workflows/brief.js`

```js
export const meta = {
  name: 'brief',
  description: 'River writes docs/brief.md from one line of idea text, to Part A of the prd-artifact contract, and a checker validates the shape. Args: runId, runDir (absolute cache directory), pluginRoot, timestamp, idea (text), briefPath (optional; default docs/brief.md).',
  phases: [
    { title: 'Draft', detail: 'ck:river writes the brief: problem and root-cause chain, user, success metric, scope with a smaller first version, non-goals, open questions' },
    { title: 'Validate', detail: 'one neutral Haiku agent checks Part A of the contract; ck:river revises at most once' },
  ],
  personas: ['river'],
}

if (!args || !args.runId || !args.runDir || !args.pluginRoot || !args.timestamp || !args.idea) {
  throw new Error('brief: args.runId, args.runDir, args.pluginRoot, args.timestamp, and args.idea are required')
}
const briefPath = args.briefPath || 'docs/brief.md'
const contract = args.pluginRoot + '/skills/prd-artifact/SKILL.md'
const stamp = args.timestamp
const VALIDATOR_MODEL = 'claude-haiku-4-5-20251001'

const BRIEF_SCHEMA = {
  type: 'object',
  properties: {
    briefPath: { type: 'string' },
    title: { type: 'string' },
    rootCauseChain: { type: 'array', items: { type: 'string' } },
    user: { type: 'string' },
    successMetric: { type: 'string' },
    leadingIndicator: { type: 'string' },
    v0: {
      type: 'object',
      properties: {
        scope: { type: 'string' },
        cuts: { type: 'array', items: { type: 'string' } },
        recommendation: { type: 'string' },
      },
      required: ['scope', 'cuts', 'recommendation'],
    },
    nonGoals: { type: 'array', items: { type: 'string' } },
    openQuestions: { type: 'array', items: { type: 'string' } },
  },
  required: ['briefPath', 'title', 'rootCauseChain', 'user', 'successMetric', 'leadingIndicator', 'v0', 'nonGoals', 'openQuestions'],
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

// ---- Draft ----
phase('Draft')
let brief = await agent(
  `The author's idea, in their own words: ${args.idea}\n` +
  `Read Part A of ${contract}. It is the brief contract: section order, required fields, and the checklist ` +
  `your brief will be validated against.\n` +
  `Write ${briefPath} to that contract (create the directory if needed). Apply your Required Behaviors in ` +
  `subagent form. Three Whys: do not accept the idea as the problem; write the chain (idea, why, why, why), ` +
  `each step more specific, until the user pain is exposed or the idea is shown to address a symptom, and say ` +
  `which. V0 Challenge: propose a first version that cuts at least half the scope, say what it cuts, and give ` +
  `your recommendation with the decision marked open for the author. Premortem: not yet; it belongs to the PRD.\n` +
  `One primary user. One success number with a target and a date, plus one leading indicator. At least two ` +
  `non-goals. Anything you would have asked the author goes under Open questions for the author, each with ` +
  `the assumption you proceeded on; the list is present even when empty.\n` +
  `Plain words: the author may not be technical. Return the brief object; briefPath must be '${briefPath}'.`,
  { label: 'river:draft', phase: 'Draft', agentType: 'ck:river', schema: BRIEF_SCHEMA },
)
if (!brief) throw new Error('brief: River returned nothing')
log(`brief: ${brief.rootCauseChain.length} step(s) in the root-cause chain, ${brief.openQuestions.length} open question(s)`)

// ---- Validate ----
phase('Validate')
const validation = await agent(
  `Read Part A of ${contract} and ${briefPath}. Check the brief against every numbered item in Part A's ` +
  `checklist and against the section order. Return valid=true only if every item holds. For each unmet item, ` +
  `one line in missing that quotes the checklist item and says what is absent or wrong. Judge the shape, not ` +
  `the idea.`,
  { label: 'validate', phase: 'Validate', model: VALIDATOR_MODEL, effort: 'low', schema: VALIDATION_SCHEMA },
)
if (validation && !validation.valid) {
  log(`validate: ${validation.missing.length} unmet item(s); River revises once`)
  const revised = await agent(
    `Read Part A of ${contract} and ${briefPath}. A checker found these unmet checklist items:\n` +
    validation.missing.map(m => '- ' + m).join('\n') + '\n' +
    `Revise ${briefPath} in place so each item holds. Return the updated brief object; briefPath must be '${briefPath}'.`,
    { label: 'river:revise', phase: 'Validate', agentType: 'ck:river', schema: BRIEF_SCHEMA },
  )
  if (revised) brief = revised
  else log('validate: revision returned nothing; keeping the first draft')
} else if (!validation) {
  log('validate: validator returned nothing; proceeding unvalidated')
} else {
  log('validate: brief passes the contract checklist')
}

return {
  runId: args.runId,
  briefPath: brief.briefPath,
  title: brief.title,
  openQuestions: brief.openQuestions,
  validation,
  generated: stamp,
}
```

## Appendix D. `skills/prd/SKILL.md`

````markdown
---
name: prd
description: Turn docs/brief.md into a full PRD with River. A draft is written and checked, three specialists argue about it on three different models, River revises it, and you review it on a page you can comment on (or by editing the file). Runs only when you type /ck:prd.
disable-model-invocation: true
argument-hint: "[--interview] [idea]"
---

You are River for the whole of this skill. Read `${CLAUDE_PLUGIN_ROOT}/agents/river.md` for your voice and standards. Speak plainly: the person running this may not be technical. Never print a stack trace, a model name, or a token count. Always name the file that holds the work so far. Always give exactly one next action.

## 0. Preconditions

Confirm the Workflow tool is available in this session. If it is not, stop and say: "Dynamic workflows are not available here. `/ck:prd` needs them. This is a setting in Claude Code, not something in your project." Do not run the stages by hand.

## 1. Find the brief

- If `docs/brief.md` exists, go to step 3.
- If it does not and `--interview` was given, run step 2.
- Otherwise stop with one action: "Run `/ck:brief <your idea in a sentence>` first. It takes about a minute and writes `docs/brief.md`. Then run `/ck:prd` again."

## 2. The interview (only with `--interview`)

Create the run directory first (step 4, with a provisional slug from the first answer) so every answer can be saved as it is given. Ask one question at a time with AskUserQuestion. **After every answer, append it to `<runDir>/interview.md` under its heading before asking the next.** On entry, if an `interview.md` with answers but no `docs/brief.md` exists, offer to continue it.

### 1. Three Whys

Do not accept the idea as the problem. Ask "Why?" up to three times, each answer more specific than the last:

- "In one or two sentences, what do you want to build?" (skip if the idea was given after `--interview`)
- "Why does that need to exist? What happens to the person today without it?"
- "Why is [their answer] a problem worth solving now?"
- "Why [their answer]? What is underneath that?"

Each why offers two fixed options, "That is the root cause" and "I am solving a symptom and I know it", plus free text. Stop early on either fixed option and record which.

Then: "Who exactly has this problem? One main person." (options drawn from the answers, plus Other); "What single number moves if this works, by how much, by when? And what early sign will you watch?"; "Name two or three things this will not do."

### 2. V0 Challenge

Propose a first version that cuts at least half the scope. Say: "Here is a smaller first version that solves the core problem: [scope]. It leaves out [list]. Would this still move [the number]?" Offer: "Build the smaller version"; "Build the full scope"; "Full scope, and here is what specifically needs the extra" (free text). Record the decision and the reason.

Finally: "Default reviewers, or name them?" (record as a lens list or nothing) and "Where should the PRD go?" (default `docs/PRD.md`). Then write `docs/brief.md` from the answers, to Part A of `${CLAUDE_PLUGIN_ROOT}/skills/prd-artifact/SKILL.md`, and continue.

## 3. Resume check

Read the latest `.ck/runs/*/run.json` for this project, if any.

- If `docs/PRD.md` exists and `status` names a stopped stage, offer: "Your PRD stopped at [stage]. Everything before it is saved in `docs/PRD.md`. Continue from there, or start over?" Continue means `startAt` = that stage.
- If `status` is `review`, go to step 7: the author has edited the file.
- If `status` is `final`, ask: "The PRD is finished. Re-run the reviewers on some sections, or start over?"

## 4. Mint the run

```bash
timestamp=$(date -u +%Y%m%dT%H%M%SZ)
runId="${timestamp}-<slug>"
runDir="$(pwd)/.ck/runs/${runId}"
mkdir -p "$runDir"
grep -qxF '.ck/' .git/info/exclude 2>/dev/null || echo '.ck/' >> .git/info/exclude
```

Write `run.json`: `{ "runId", "createdAt": timestamp, "status": "starting", "stage": "draft", "outputPath": "docs/PRD.md", "lenses" }`. The `.ck/` folder is a cache; the documents in `docs/` are the work.

## 5. Launch the draft and wait

Call the Workflow tool exactly like this (absolute paths):

```
Workflow({
  scriptPath: "${CLAUDE_PLUGIN_ROOT}/workflows/prd-draft.js",
  args: {
    runId: "<runId>", runDir: "<runDir>", pluginRoot: "${CLAUDE_PLUGIN_ROOT}", timestamp: "<timestamp>",
    briefPath: "<abs>/docs/brief.md", prdPath: "<abs>/docs/PRD.md",
    startAt: "<draft, or the stage to continue from>",
    lenses: <list or null>
  }
})
```

Immediately write the returned run id into `run.json` as `harnessRunId`, with `scriptPath`, and set `status` to `drafting`. Say: "Writing the PRD. This takes a few minutes and runs in the background; I'll tell you when it's ready." Then stop. Wait for the task notification. Do not poll, do not narrate, do not start other work on this run.

If the notification reports a stop or a failure: record the failed stage in `run.json` and say: "I couldn't finish the [stage] step. Everything up to it is saved in `docs/PRD.md`. Run `/ck:prd` again to continue from there." Within the same session you may instead offer to relaunch with `resumeFromRunId`.

## 6. The review

Set `status` to `review`. Read `docs/PRD.md`. Then take one of two paths.

**Review page (when the Artifact tool is available).** Publish `docs/PRD.md` as a private page. At the top put the premortem question from Appendix B and one line: "Comment on anything. Say 'done' here when you are finished." Tell the user the link and stop. When they say done: read every comment thread; apply each one to `docs/PRD.md` (write the change and the reason to `<runDir>/gate-1.md`); where you will not apply one, reply with the reason and leave it open; republish the same page; resolve each applied thread with one line saying what changed. Then go to step 7.

**File edit (always).** Say: "Your PRD is at `docs/PRD.md`. Open it, change anything you like, save, and run `/ck:prd` again. I'll fold your edits in." Stop. On the next run, step 3 sees `review` and continues at step 7.

### 3. Premortem

The question at the top of the review, and the first thing to ask if the author is reviewing in conversation: "Imagine this shipped on time and did not move the number. What went wrong?" Use the answer to surface the hidden assumption; do not argue with it. Record it in `<runDir>/gate-1.md`.

To re-run the reviewers on named sections, call `Workflow({ scriptPath: "${CLAUDE_PLUGIN_ROOT}/workflows/panel.js", args: { runId, runDir, pluginRoot: "${CLAUDE_PLUGIN_ROOT}", timestamp: "<new>", question: "<the focused question>", contextPath: "<abs>/docs/PRD.md", rationalePath: "<abs>/docs/brief.md", lenses } })`, record its run id, wait, and return to this step.

## 7. Finalize

One agent, inline:

```
Agent({
  subagent_type: "ck:river",
  description: "Finalize PRD",
  prompt: "Read docs/PRD.md and <runDir>/gate-1.md (the review comments and how each was applied, or the note that the file was edited directly). Fold the premortem answer into Assumptions and Risks, resolve each open decision as answered, keep Appendix A intact, and check the result against Part B of ${CLAUDE_PLUGIN_ROOT}/skills/prd-artifact/SKILL.md. Write docs/PRD.md. Set status 'final' in <runDir>/run.json. Return the path and a five-line summary."
})
```

Say: "Your PRD is finished: `docs/PRD.md`. Next: run `/ck:next`." If the devlog skill is installed, add that `/devlog` can record the reviewers' memo from `docs/decisions/`.
````

## Appendix E. `skills/next/SKILL.md`

````markdown
---
name: next
description: Says what to run next, in one sentence, by looking at which documents exist. Use when you do not know where to start or what comes after the step you just finished.
disable-model-invocation: true
---

Look at the project and say exactly one thing. Plain words. No model names, no token counts, no more than one action.

Check, in order:

1. Does `docs/brief.md` exist?
2. Does `docs/PRD.md` exist, and what does the latest `.ck/runs/*/run.json` say its `status` is (if any)?
3. Does `docs/decisions/` contain anything?

Then say:

| State | Say |
|---|---|
| No `docs/brief.md` | "Start with `/ck:brief` and describe your idea in a sentence. It takes about a minute and writes `docs/brief.md`." |
| Brief, no PRD | "Run `/ck:prd`. It turns the brief into full requirements and takes a few minutes." |
| PRD exists, status is a stopped stage | "Your PRD stopped partway. Everything so far is in `docs/PRD.md`. Run `/ck:prd` again to continue." |
| PRD exists, status `review` | "Your PRD is waiting for your review. Open `docs/PRD.md` (or the review page), make any changes, then run `/ck:prd` again." |
| PRD exists, status `final` or unknown | "The PRD is done. When you have a decision to make, run `/ck:panel` followed by your question. The next stages (brand guide, roadmap) are not installed yet." |

Do not run any agent. Do not explain how the tool works unless asked.
````

## Appendix F. `skills/prd-artifact/SKILL.md`

````markdown
---
name: prd-artifact
description: The Code Katz contract for a product brief (Part A) and a PRD (Part B): section order, required fields, and the checklist each must pass. Load when writing, revising, or validating a brief or a PRD, inside or outside a ck workflow.
user-invocable: false
---

# The brief and PRD contract

A document written to this contract has the same shape every time, in every project. Consistency comes from this file, not from who writes it. Plain words throughout: the author may not be technical.

# Part A: the brief (`docs/brief.md`)

## Section order

Use these headings verbatim, in this order.

1. `## Idea`: the author's idea, in their words, one paragraph.
2. `## Problem and root-cause chain`: the person's pain, not the solution. The chain written out (idea, why, why, why), each step more specific, ending at a root cause or at "this addresses a symptom", and saying which.
3. `## User`: one main person, specific enough to recognize.
4. `## Success metric and leading indicator`: one number, a target, a date; one early sign to watch.
5. `## Scope`: the smaller first version (what it keeps, what it leaves out, whether it would still move the number) and River's recommendation, with the decision marked open unless the author has made it.
6. `## Non-goals`: at least two things this will not do.
7. `## Open questions for the author`: anything River could not answer, each with the assumption used meanwhile. Present even when empty.

## Checklist A

1. Every Part A section is present, in order, with its heading verbatim.
2. Problem names the person's pain and the chain reaches a root cause or says it stops at a symptom.
3. User is one person, not a category.
4. Success metric has a number, a target, and a date, plus one leading indicator.
5. Scope names what the smaller version leaves out and carries a recommendation.
6. Non-goals has at least two entries.

# Part B: the PRD (`docs/PRD.md`)

## Section order

1. `## Summary`: three sentences: what, for whom, and the one number that says it worked.
2. `## Problem`: the pain, not the solution. Cite the root-cause chain from the brief and say whether it reached a root cause or a known symptom.
3. `## User`: one main person, from the brief.
4. `## Success metric and leading indicator`: from the brief, restated.
5. `## Scope`: the decision taken (smaller version or full, with the reason) and the smaller version River would still propose: what it keeps, what it leaves out, whether it would still move the number.
6. `## Non-goals`: at least two.
7. `## Requirements`: numbered. Each has at least one acceptance criterion a reader could check without asking the author.
8. `## Sequencing and dependencies`: what must be true before this can ship; what depends on what.
9. `## Assumptions`: every assumption the document rests on, including the one the premortem exposes.
10. `## Risks`: what would cause this to fail, each with a mitigation or an explicit acceptance.
11. `## Open questions`: every decision left to the author.
12. `## Appendix A. Challenged claims`: claim | challenged by | severity | status | resolution. Nothing deleted. The reviewers' disagreements and kill conditions reproduced verbatim below the table.
13. `## Appendix B. Premortem`: the scenario, the exposed assumption, and the question "What went wrong?" verbatim.

## Claim tags

Every claim not taken directly from the brief carries an inline tag `[C1]`, `[C2]`, ... in the body. Appendix A addresses tags by id. A tag no reviewer challenged is listed there as unchallenged.

## Checklist B

1. Every Part B section is present, in order, with its heading verbatim.
2. Problem names the pain, not the solution, and cites the root-cause chain.
3. Success metric is one number with a target and a date, plus one leading indicator.
4. Scope records the decision and the smaller version with what it leaves out.
5. Non-goals has at least two entries.
6. Every requirement has at least one acceptance criterion a reader could check without asking the author.
7. Every claim not from the brief carries a `[C<n>]` tag, and every tag appears in Appendix A or is marked unchallenged.
8. Assumptions includes the assumption the premortem exposed (or, before the premortem exists, says the premortem is pending).
9. Open questions lists every decision left to the author.
10. No em-dashes in prose. Em-dashes are acceptable only as separators in structured lists.

## File paths

`docs/brief.md` and `docs/PRD.md`, committed with the project. Decision memos from reviewers go to `docs/decisions/`. The author may choose other paths when running the commands.

## Writing

Plain technical English: name the actor, one instruction per sentence, no filler, no loss of precision. Second person is fine for the reader; third person for the system.
````

## Appendix G. `agents/river.md` as generated (excerpt)

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

## Appendix H. Cost model

Prices per million tokens from the pricing page read 2026-09-05 [D]: Fable 5.1 $10 in / $50 out; Opus 5 $5 / $25; Sonnet 5 $2 / $10; Haiku 4.5 $1 / $5. Token counts are assumptions [P] for a one-page context document; the newer tokenizer produces about 30% more tokens than these figures assume [D]. No prompt-cache sharing between lenses (§3.3 item 15). Neutral agents assumed on Opus 5 (the session model).

### `/ck:brief`

| Agent | Model | Input | Output | Cost |
|---|---|---|---|---|
| river draft | Opus 5 | 12k | 4k | $0.16 |
| validator | Haiku 4.5 | 8k | 1k | $0.01 |
| **Total** | | | | **about $0.17**, plus about $0.15 if one revision runs |

### `/ck:panel`

| Agent | Model | Input | Output | Cost |
|---|---|---|---|---|
| river (product) | Opus 5 | 18k | 3k | $0.17 |
| toni (marketing) | Fable 5.1 | 18k | 3k | $0.33 |
| kai (ux) | Sonnet 5 | 18k | 3k | $0.07 |
| synthesis | Opus 5 | 22k | 5k | $0.24 |
| **Total** | | | | **about $0.80** |

Per-lens evidence and the second pass over the rationale add about 2k input tokens per lens over the earlier estimate.

### `/ck:prd` (the `prd-draft` workflow)

| Agent | Model | Input | Output | Cost |
|---|---|---|---|---|
| river draft | Opus 5 | 20k | 8k | $0.30 |
| validator | Haiku 4.5 | 15k | 1k | $0.02 |
| panel (above) | mixed | | | $0.80 |
| river synthesize | Opus 5 | 35k | 10k | $0.43 |
| **Total, no revision** | | | | **about $1.55** |
| one revision (validator again plus River revise) | | | | + about $0.32 |
| finalize (inline, Opus 5) | | 30k | 8k | + about $0.35 |

Call it $1.60 to $2.30 per PRD plus the main session's own turns. Concurrency: min(16, CPUs minus 2) [D]; on a 4-CPU laptop the panel runs in one round and `prd-draft` in about four sequential steps, since its stages depend on each other. `/ck:next` costs one main-session turn and runs no agents.

## Appendix I. Sources

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

The cross-model panel, 2026-09-05:

- The Opus PRD, its panel brief, and its workbench mockups: `plans/opus/`
- The panel memo recording what was adopted and rejected, with reasons: `plans/2026-09-05-ck-prd-panel-memo.md`

Research [M], [V]: as listed in the proposal's §10; this PRD adds none.
