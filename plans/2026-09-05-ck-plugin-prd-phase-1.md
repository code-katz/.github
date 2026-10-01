# `ck` Plugin, Phase One: Product Requirements Document

> **Status:** PRD, revision 3, ready for build
> **Date:** 2026-09-08 (first version 2026-09-05)
> **Author:** Fable (with Will Curran)
> **Derives from:** [`plans/2026-09-05-agent-workflows-research-and-proposal.md`](2026-09-05-agent-workflows-research-and-proposal.md) (the research proposal)
> **Scope:** phase one: the plugin skeleton, the full product-definition pipeline (`/ck:opportunity`, `/ck:market-research`, `/ck:brief`, `/ck:prd`, `/ck:team`, `/ck:roadmap`, `/ck:architecture`, `/ck:brand-guide`, `/ck:design`), `/ck:panel`, `/ck:next`, and 21 personas as subagents and switch commands on three model tiers. Phases two and three are in §10
> **Revision history:** rev 2 (2026-09-05) after a cross-model panel against the Opus-written PRD, see [`plans/2026-09-05-ck-prd-panel-memo.md`](2026-09-05-ck-prd-panel-memo.md); rev 3 (2026-09-08) after Will's sixteen-comment review of rev 2, see §3.4

---

## 0. How to read this document

### 0.1 Grading

Every claim carries the proposal's grade, plus two more:

| Grade | Meaning |
|---|---|
| **[D]** | Product documentation, verified against the primary source on 2026-09-05. The URL is in Appendix J |
| **[M]** | Measured, independent, method stated (carried over from the proposal) |
| **[V]** | Vendor self-measured |
| **[R]** | The family's own record: a devlog entry, roadmap revision, or test in a code-katz repo |
| **[W]** | Will's decision, recorded with its date. Not open to challenge in this document |
| **[P]** | Practitioner assertion or judgment call. Open to challenge; the rationale is stated |

### 0.2 What this document is

The proposal is a research summary with a proposed shape. This is the specification for the first release of that shape: what ships, what each command must do, what each document it produces must contain, how it is tested, and what is deliberately left for phases two and three. It contains acceptance criteria, schemas, four complete workflow scripts, two complete skills, and two complete document contracts, as appendices. The remaining workflows are specified to the stage level in §6; their scripts are build work that follows the four written here.

### 0.3 Three words that mean one thing each

| Word | Meaning in this document |
|---|---|
| `<project-repo>` | The git repository of the product being built: the folder where Claude Code was opened. Every document `ck` produces is written here and committed here. It is never the plugin's own directory and never the home directory. See §4.3 |
| Gate | A point where a person reviews and decides. Gates run in the main session, never inside a workflow, because a workflow cannot pause for input [D]. See §4.2 |
| Review page | Claude's built-in review and comment system: a private page in the Claude desktop app or at claude.ai, with comment mode. Every document or gallery that needs a decision is reviewed there. See §4.9 |

### 0.4 The three answers up front

1. **It is a plugin, and a Workbench follows it.** Claude Code is the runtime for subagents, workflow scripts, and skills; nothing else can run them. Phase one ships the plugin with no UI. Phase three rewrites the conductor dashboard as the `ck` Workbench: catalog, runs, cost, and persona and workflow editing against the plugin's source checkout, running locally. See §4.7 and §10.3.
2. **The skill owns the gates; each span between gates is one workflow.** A sign-off point is not a workflow. It is a gate: a review page with comments, or a file the author edits. See §4.2.
3. **`ck` is independent.** It replaces `claude-team-cli`, owns its persona definitions, and requires that `claude-team-cli` be uninstalled before use. Nothing in this document depends on, defers to, or coexists with it. [W, 2026-09-08]

---

## 1. Summary

`ck` is a Claude Code plugin. Phase one ships:

| Component | Count | What it is |
|---|---|---|
| Persona subagents | 21 | `agents/<name>.md`, generated from `ck/profiles/`, registered as `ck:<name>`, on three model tiers: Fable 5.1 for judgment, Opus 5 for craft, Sonnet 5 for execution (§5.3) |
| Persona switch commands | 21 | `/ck:<name>`, generated from the same profiles, for the session-switch route that `claude-team-cli` used to provide (§5.6) |
| Pipeline commands | 9 | `/ck:opportunity`, `/ck:market-research`, `/ck:brief`, `/ck:prd`, `/ck:team`, `/ck:roadmap`, `/ck:architecture`, `/ck:brand-guide`, `/ck:design`: the definition pipeline from an idea to a designed feature, each writing one committed document or gallery into `<project-repo>` (§6) |
| Decision and navigation commands | 2 | `/ck:panel` (three lenses on three models argue one question; a memo shows where they disagree) and `/ck:next` (says what to run next in one sentence) |
| Document contracts | 10 | One skill per document type: section order, required fields, checklist. Consistency comes from these, not from who writes (§7) |
| Workflow scripts | 9 | `panel`, `brief`, `draft` (serves the PRD and the architecture document), `team`, `opportunity`, `market-research`, `roadmap`, `brand`, `design` |
| Hooks | 2 | `SubagentStart` on `^ck:` appending one line per persona invocation to a usage log; `SessionStart` warning in plain words if `claude-team-cli` is still installed |
| Tests | 1 suite | Manifest, generation drift, script lint, contract-to-script consistency, plain-language checks, Phase 0 answers, end-to-end drills (§9) |

What changed in revision 3, from Will's review (§3.4): `ck` no longer references `claude-team-cli` except to require its removal; Clare is named as the primary user and her two journeys drive the design; every path is written as `<project-repo>/...`; the Fable tier is restored for the six judgment seats; phase one grows from four commands to the full definition pipeline; the Workbench is committed as phase three; and every review happens in Claude's built-in comment system.

Phase two is `/ck:feature`, `/ck:bugfix`, `/ck:gtm`, Routines, `/ck:map`, and `/ck:report`. Phase three is the Workbench. Both are in §10 with the reason for each placement. Will confirmed on 2026-09-09 that `/ck:feature` stays in phase two.

---

## 2. Problem, users, journeys, goals

### 2.1 Problem

The unit of the work is the workflow, not the roster (proposal §2.1). Today the personas exist only as session takeovers and delegation subagents. They own no documents, so their output varies run to run (proposal §3.4). Multi-lens input on a decision means opening three sessions by hand, and the three lenses run on one model, which is one opinion in three costumes (proposal §3.4; [M] error correlation rises with capability). Nothing is repeatable across projects, and nothing is measured, so the persona question ("likely 15 more than are used", proposal §7) cannot be answered.

The person who feels this most is not Will. It is Clare, who runs the current tool every day.

### 2.2 Users

| | Clare | Will |
|---|---|---|
| Technical? | No. She has shipped several iOS apps with Claude and `claude-team-cli`, and has become proficient with it: she knows which workflows, process, and documents a product needs | Yes. Reads and writes code; maintains the plugin |
| How she works | Runs many sessions at once, one persona per session, and hands work between them by hand | One session at a time, plus panels on decisions |
| Wants | The same, efficient, high-fidelity process every time: an idea to a definition, a feature to design mockups, without re-explaining the process to each persona | Repeatability, adversarial input on decisions, visibility into cost and activity, a place to tune personas |
| Tolerates | Plain language and one command at a time. Model names are fine when they explain a cost; she does not need to choose one | Flags, JavaScript, terminal output, cost decisions |
| Fails when | Workflows, personas, and documents are inconsistent: the same step produces a different shape, asks different questions, or needs a different number of sessions than last time | The tool is slower than doing it himself |

The rebuild is based on Clare's learnings from running the current tool. Two things follow. First, she is the primary user, and a phase-one command is done when it works for her from the README alone. Second, she is not fragile: she does not need to be protected from the tool, she needs it to be consistent and to cost her fewer sessions. Her persona work should take fewer hand-offs than it does today. [W, 2026-09-08]

### 2.3 Journeys

**J1. Clare takes a new product from an idea to a definition.** The primary journey. Phase one is done when it works end to end on a new project.

1. She has an idea. She creates a folder, opens Claude Code in it, and runs `/ck:next`. It sees an empty project and says: "Start with `/ck:opportunity` and describe your idea in a sentence. It writes `docs/opportunity.md`: what the product is, who it is for, what the market looks like, and whether it is worth doing."
2. She runs `/ck:opportunity <her idea>`. River frames it, Toni writes the market context and positioning, Akira the technical shape, and the domain seat (a game designer, for a game) its own section. River assembles the analysis with stage gates, risks, and open questions. A review page opens. She comments where she disagrees and says "done". Claude applies every comment, republishes, and resolves each one with a line saying what changed. `docs/opportunity.md` is committed.
3. `/ck:next` says: "Run `/ck:market-research` to go deeper on the market, or `/ck:brief` if the opportunity is enough." She picks. Each writes its document into `docs/`.
4. `/ck:brief` writes the brief, with its own short market pass, and asks nothing. She reads it and edits or comments.
5. `/ck:team` writes `docs/TEAM.md`: which personas are on this product, who owns which document and stage, and which seat is missing. She adjusts by comment.
6. `/ck:prd` drafts the requirements, checks them, has three specialists argue about them on three different models, and rewrites. The review page carries one question at the top: "Imagine this shipped and did not move the number. What went wrong?" She answers in a comment. Claude finalizes `docs/PRD.md`.
7. `/ck:roadmap`, `/ck:architecture`, and `/ck:brand-guide` follow, each with the same shape: run, review by comment, done. The brand guide takes two review rounds, first on proposals, then on finalists, both as galleries she comments on.
8. At the end, `docs/` holds one document per step, every one committed, every one the same shape it was on her last product.

**J2. Clare takes one feature to design mockups, the same way every time.** The journey that fails most often today.

1. In a project with a PRD and a brand guide, she runs `/ck:design <feature name>`.
2. Kai reads the feature's requirements from `docs/PRD.md` and the brand guide, and produces a gallery: three labeled variants (A, B, C) of the feature's screens, each with its rationale and its trade-off.
3. The gallery opens as a review page. She comments on the variant she wants, and on what to change.
4. Claude applies the comments, produces the chosen variant at full fidelity with a written design spec, republishes, and resolves each comment.
5. `docs/design/<feature>/` holds the gallery, the chosen variant, and the spec, committed. The next feature runs exactly the same way.

**J3. Will runs a panel on a decision.** `/ck:panel <question>` with any context document. Three lenses on three models argue it; a memo shows where they disagree and leaves the decision to him. `docs/decisions/` holds the memo, committed.

### 2.4 Goals and measures

| # | Goal | Measure | Source |
|---|---|---|---|
| G1 | Consistency: the same step produces the same document shape every time | Two documents of one type from two projects have identical section structure; the validator passes on both | The contracts (§7) |
| G2 | Repeatability: the pipeline ships with every project | A fresh project has every phase-one command after one install | The install drill (§9) |
| G3 | Adversarial input: real disagreement on a judgment call | In more than half of panel runs, at least one lens recommends differently, or at least one kill condition is met | `panelFailedToDisagree` and `agreementRate` in each memo |
| G4 | Clare's journeys work | J1 and J2 complete on a new project from the README alone | The J1 and J2 drills (§9) |
| G5 | Efficiency for Clare | J2 takes one command and one review, where today it takes several sessions and hand-offs by hand | The J2 drill, session count |
| G6 | Retention (proposal §3.4: the real metric for a personal tool) | At 30 days after install, at least one pipeline or panel run per week of active building | `${CLAUDE_PLUGIN_DATA}/usage.jsonl` (§5.5) |
| G7 | Instrumented: the persona question can be answered at 90 days | Every persona invocation is logged with its type and session | The same log |

Leading indicator: usage-log entries in the first week. A panel that always agrees is a failed panel (proposal §5.5); if G3 is missed, the lenses or the question template are wrong, not the users.

### 2.5 Non-goals for phase one

- No `/ck:feature`, `/ck:bugfix`, or `/ck:gtm`. They need the definition pipeline's documents as inputs and are phase two (§10.2). Will confirmed `/ck:feature` stays there [W, 2026-09-09].
- No UI. `/workflows` is the run view in phase one [D]. The Workbench is phase three (§10.3).
- No hook-enforced document gates, no model fallback chain, no Advisor tool, no Routines, no mid-run arbitration (workflows cannot pause; §4.2).
- No persona pruning. All 21 ship; the instrument ships; the cut list follows the data.
- No compatibility with, migration from, or reference to `claude-team-cli` beyond the one-time import of its profiles (§5.1) and the uninstall prerequisite (§8.4).

---

## 3. Decisions

### 3.1 Decisions on record that this PRD honors or supersedes

| Date | Decision and where it is recorded | What `ck` does | Grade |
|---|---|---|---|
| 2026-07-29 | No second source of persona truth (team-cli `ROADMAP.md` revision history, `CONTRIBUTING.md`) | Honored by moving the source, not forking it. `ck/profiles/` is the only place persona text is edited; `agents/` and the switch skills are generated from it and drift-tested. The import from the old tool happens once (§5.1) | [R] |
| 2026-07-04 | Conductor: keep and harden the local Node dashboard; JSONL parsing fenced with fixtures (conductor `DEVLOG.md`) | Superseded in part. The dashboard is rewritten as the `ck` Workbench after phase one (§10.3). The fixture-fenced JSONL cost parser and `pricing.json` are reused | [W, 2026-09-08] |
| 2026-07-25 | Conductor research branch: "drop Tauri, target local server + browser" | Honored. The Workbench is a local server and a browser | [R] |
| proposal §9 | "Use `/workflows` and do not build a UI until it proves insufficient" | Honored in phase one, superseded for phase three: the Workbench will be built | [W, 2026-09-08] |

### 3.2 The proposal's §8, resolved

| # | Question (proposal §8) | Decision | Grade |
|---|---|---|---|
| 1 | Retire or coexist with the old tool? | **Neither is a consideration.** `ck` is a replacement, built independently. The old tool must be uninstalled before `ck` is used (§8.4). What it did that must not be lost (persona switch, "who should be on this", parallel work) is carried by `ck` itself (§5.6, §6.5, §10.2) | [W, 2026-09-08] |
| 2 | Workflow granularity vs sign-off | **The skill owns the gates; each span between gates that needs fan-out or verification is one workflow; a single-agent span runs inline via the Agent tool.** Full rule: §4.2 | [D]-backed |
| 3 | Where documents live | **The document is the state.** Every deliverable lives at a fixed, conventional, committed path under `<project-repo>` (§4.3). `.ck/runs/<run-id>/` is a cache; nothing depends on it | [W, 2026-09-08], [P] |
| 4 | Which personas survive? | **All 21 ship; prune at 90 days on evidence.** Generation makes carrying 21 free. No usage data exists, so a cut list today is a guess. The instrument ships in phase one (§5.5). Agrees with proposal §7, contradicts §8.4 | [P] |
| 5 | Panel model assignment | **River on Fable 5.1, Toni on Opus 5, Kai on Sonnet 5 by default.** River and Toni run on their own tiers; only Kai is moved, downward, so that three lenses are three models. Overridable per run. The memo header states the limitation: one training pipeline, partial decorrelation | [W, 2026-09-08] for the tiers; [P] for the assignment |
| 6 | `/ck:feature` scope | **Phase two.** Will confirmed the placement on 2026-09-09 (§10.2). The two scope options (full end-to-end with content, or code-only) stay open until `feature.js` is designed | [W, 2026-09-09] |
| 7 | Routines | **Phase two.** One constraint carried into phase one: every pure workflow (`panel`, `market-research`, `brief`, `team`, `roadmap`) is runnable headless. `market-research` is the first candidate for a schedule | deferred |
| 8 | Oracle for non-code documents | **A structural validator plus the human gate.** Each contract skill carries a checklist; a neutral Haiku agent checks the draft against it inside the workflow, with at most two revise loops; the review page is the human oracle. Hook-based gates are a phase-two spike (§3.3 item 6) | [P] |

### 3.3 Corrections to the proposal

Each item names the proposal section, what is wrong, and what this PRD does instead.

1. **§5.1, plugin name.** The tree is rooted at `code-katz/` and every command is `/ck:...`. The command prefix is the plugin's `name` and cannot be opted out of [D]. The plugin is named `ck`. The repo is `code-katz/ck`.
2. **§3.2, §5.1, §5.6, §7, roster count.** The proposal says 22. `profiles/` holds 21 personas [R].
3. **§5.6, collapsing Fable into Opus.** The proposal re-bases the six Fable seats onto Opus 5 on price. Rejected: Will wants Fable where judgment matters and Sonnet where volume matters [W, 2026-09-08]. The six judgment seats stay on Fable, moving from Fable 5 to Fable 5.1 (same price [D]); the eleven craft seats move from Opus 4.8 to Opus 5; the four execution seats stay on Sonnet 5. The seven personas the proposal left unassigned (Reiner, Cornelius, Ernie, Rez, Tracy, Travolta, Noon) are placed in §5.3. Haiku 4.5 is a workflow-stage tier for validators, never a persona tier.
4. **§5.5 vs §5.6, the panel contradiction.** "Each lens runs on a different model. Not negotiable" and a tier table that puts River and Toni on one model cannot both hold through frontmatter alone. With the tiers in item 3, River (Fable 5.1) and Toni (Opus 5) already differ; Kai is moved from Opus 5 to Sonnet 5 by a per-invocation override in `panel.js`. Tiers are defaults; `panel.js` is the one script that may override them (§4.5).
5. **§5.2 and §5.7, the gate mechanism.** "`TaskCompleted` or `Stop`, exit code 2, rejects malformed output." `Stop` is the main conversation's event; the subagent event is `SubagentStop`, whose exit-2 feedback path to the agent is not documented [D as read]; plugin agents ignore per-agent `hooks:` frontmatter [D]. Phase one validates inside the workflow: schema-forced output, which the harness retries on mismatch [D], plus a validator agent against the contract checklist.
6. **§5.6, fallback chain via `PreModelSwitch`.** The hook fires "before Claude Code applies a model switch that you or a client requested" [D]. Nothing says it covers subagent model selection or an API quota error. Phase-one resilience is null-tolerant scripts: a lens or stage that fails returns `null`, and the script continues and logs it.
7. **§8.4 vs §7.** "A cut list should precede the port" against "instrument and prune after 90 days." No data exists. Ship everything and instrument (§3.2 item 4).
8. **§6, "no state file".** Script variables die with the run. A gate between two workflows requires the document on disk. The documents in `<project-repo>/docs/` are that state; `.ck/runs/` is a cache. The proposal's argument against a custom task graph and lock protocol still holds.
9. **§4.1 vs §3.4, what buys consistency.** §4.1 says repeatability "is the whole answer to goal 3"; §3.4 says consistency comes from the document contract. §3.4 is right, and Clare's failure mode (§2.2) is exactly the one contracts fix. Workflows give the same process; contracts give the same shape. Phase one's most important files are the ten contracts in §7.
10. **§4.2, `maxBudgetUsd`.** Not in the subagent frontmatter table read today [D]. Not relied on.
11. **§9, the superseded plan.** `claude-conductor/plans/2026-09-04-agent-coordination-engine.md` is on no branch of that repo. Commit it, so the supersession is traceable.
12. **§5.2, the persona layer.** "Voice, domain constraints, model tier" omits that a subagent has no user to ask. Every persona's `## Required Interactive Behaviors` is written as questions to the user; unrewritten, it is dead text or a stall. §5.4 has the transform.
13. **§4.1, fan-out cache economics.** The prompt-cache sharing described there applies to agents matching on model, effort, agent type, tools, schema, and cwd [D]. A persona panel is three agent types on three models and shares nothing. The cost model in Appendix I assumes no sharing.
14. **§5.3, the catalog's phasing.** The proposal's phase one was `/ck:prd` and `/ck:panel`. To test the shape on a real product the whole definition pipeline is needed, and Clare's design step with it [W, 2026-09-08]. §6 is that pipeline.

What the proposal gets right and this PRD keeps unchanged: §3 (topology, not persona strings, is the lever; buy quality with a different model and a real oracle), §4.3 (Agent Teams is not the executor), §5.2 (the four layers), §5.5 (forced self-disagreement; three approvals is a failed panel), §6 (the not-building list), §7 (the honest assessment).

### 3.4 Will's review of revision 2 (sixteen comments, 2026-09-08)

Revision 2 was published as a review page; Will left sixteen comments. Each is recorded here with the decision it drove, so the thread on the page can be resolved against a line in the document.

| # | Comment (abridged) | Decision | Where |
|---|---|---|---|
| 1 | "Why is this PRD so focused on retiring team-cli? Treat ck as independent." (four comments) | Every coexistence and retirement passage removed; `ck` owns its profiles; uninstall required | §0.4, §3.2 item 1, §5.1, §8.4 |
| 2 | "Clare is not technical, but has become very proficient. She runs many multiple sessions. I want her persona work to be more efficient." | Clare named as primary user; her learnings drive the design; efficiency is a goal | §2.2, §2.4 G5 |
| 3 | "Workflows, personas and artifacts are not consistent. She wants the same, efficient, high-fidelity process for moving features into design mockups." | J2 and `/ck:design` added; contracts made the consistency mechanism | §2.3 J2, §6.9, §7 |
| 4 | "I would prefer a rewrite of the UI / dashboard after we complete ck." | Conductor's dashboard is rewritten as the Workbench, phase three | §3.1, §10.3 |
| 5 | "Be precise on these paths. Use `<project-repo>/docs/brief.md`." (two comments) | `<project-repo>` defined once; every path written against it | §0.3, §4.3 |
| 6 | "`/ck:feature`: what is this? Why is it out of scope?" | Explained in one paragraph; phase two, confirmed by Will on 2026-09-09 | §10.2 |
| 7 | "It will be built." (the Workbench) | "If ever" removed; phase three committed | §4.7, §10.3 |
| 8 | "Use Claude's review/comment system in the Claude desktop UI." | §4.9 rewritten around it; `ck` builds nothing of its own for reviews | §4.9 |
| 9 | "Why are there no Fable models? Use Fable where it matters, Sonnet where it matters." | Fable tier restored for six judgment seats; Sonnet for four execution seats; panel default follows | §3.3 item 3, §5.3, §6.10 |
| 10 | "The brief must do some basic market research." | Toni's market pass added to `/ck:brief` and to the brief contract | §6.3, §7.3 |
| 11 | "I also want a branding / style guide. See d20mob and nightgrid." | `/ck:brand-guide` modelled on the NIGHTGRID process and the d20Mob guide | §6.8, §7.8 |
| 12 | "I also want team selection. This step basically outlines R&R." | `/ck:team` writes `docs/TEAM.md` | §6.5, §7.5 |
| 13 | "I also want an architecture workflow. PRD and roadmap in, architecture out." | `/ck:architecture` | §6.7, §7.7 |
| 14 | "To truly test this I need opportunity, market-research, branding." | Phase one is the full definition pipeline | §6 |

The earlier cross-model review (2026-09-05, against the PRD Opus wrote from the same proposal) still stands where Will's review did not touch it: the users table, the goals table, the document-is-the-state rule, per-lens evidence, the effort axis, Phase 0 spikes, `/ck:next`, and persona scopes for the 90-day prune came from that review. Its record, including eleven rejected items with reasons, is [`plans/2026-09-05-ck-prd-panel-memo.md`](2026-09-05-ck-prd-panel-memo.md). One of its rejections (coexistence with the old tool) is now moot: Will's decision replaced both positions.

---

## 4. Architecture

### 4.1 The four layers and their phase-one instances

| Layer | Primitive | Owns | Phase-one instance |
|---|---|---|---|
| Workflow | `workflows/*.js` | The order of stages, outside the conversation | `panel`, `brief`, `draft`, `team`, `opportunity`, `market-research`, `roadmap`, `brand`, `design` |
| Persona | `agents/*.md` | Voice, domain constraints, default model tier | 21 generated files, `ck:<name>` |
| Contract | `skills/<document>-artifact/SKILL.md` | Section order, required fields, checklist for one document type | 10 contracts (§7) |
| Gate | The skill in the main session | Sign-off: a review page with comments, or a file edit; plus schema-forced output and a validator agent inside the workflow | `opportunity`, `prd`, `architecture`, `brand-guide`, `design` skills; the validators in every workflow |

The proposal put the gate layer in `hooks/hooks.json`. Phase one puts human gates in the skill and machine gates in the scripts (§3.3 item 5). The hooks that ship are instrumentation and a prerequisite check, not enforcement.

**One drafting engine.** `/ck:prd` and `/ck:architecture` have the same shape: one author drafts to a contract, a checker validates, a three-lens panel challenges, the author rewrites with a challenged-claims appendix and a premortem. One script, `workflows/draft.js`, serves both; the skill passes which contract, which author, and which lenses. A third document with that shape costs a skill and a contract, not a script. [P]

### 4.2 The gate rule

The docs: "No mid-run user input. Only agent permission prompts can pause a run. For sign-off between stages, run each stage as its own workflow." [D] And: `AskUserQuestion` is removed from every subagent [D].

Therefore:

1. A sign-off is a **gate**. A gate runs in the main session, inside a skill: a review page with comments (§4.9), or a file the author edits and re-runs.
2. The span between two gates is a **workflow** when it needs fan-out, structured output, or resume. A span that is one agent runs inline through the Agent tool; a workflow for one agent buys nothing.
3. A workflow never contains a decision point. A skill never fans out by hand.
4. A skill or slash command whose instructions say to call Workflow is explicit opt-in [D]; no `ultracode` keyword, no "use a workflow" phrase is needed.

Rejected alternatives: one workflow per persona action (the skill would orchestrate fan-out itself, which is what Workflow exists to do); one workflow per command (impossible with a gate in the middle); no workflows (loses resume, schema validation, the progress view, and the "don't ask again for `<name>`" consent that plugin workflows get by name [D]).

What would make the rule wrong: subagents regaining `AskUserQuestion`, or workflows gaining a pause primitive. Neither is on the record.

Applied to the catalog:

| Command | Shape | Gates |
|---|---|---|
| `/ck:panel`, `/ck:market-research`, `/ck:brief`, `/ck:team`, `/ck:roadmap` | A pure workflow: inputs are arguments, output is a document, no gate. The document is reviewed afterwards by comment or by edit whenever the author wants | None inside |
| `/ck:opportunity`, `/ck:prd`, `/ck:architecture` | Skill: workflow, then one review gate, then an inline finalize | One |
| `/ck:brand-guide` | Skill: three workflow stages with a gallery gate between each | Two |
| `/ck:design` | Skill: one workflow stage, a gallery gate, one more stage | One |
| `/ck:next`, `/ck:<persona>` | Skill only, no agents | None |

### 4.3 `<project-repo>`: the document is the state

`<project-repo>` is the git repository of the product being built: the folder in which Claude Code was opened. It is not the `ck` plugin's install directory (a copy under `~/.claude/plugins/`), not the `ck` source checkout, and not `~/.claude`. Every document `ck` writes goes into `<project-repo>` at a fixed, conventional path, and is committed with the product. [W, 2026-09-08]

| Document | Path in `<project-repo>` | Written by |
|---|---|---|
| Opportunity analysis | `docs/opportunity.md` | `/ck:opportunity` |
| Market research | `docs/market-research.md` | `/ck:market-research` |
| Brief | `docs/brief.md` | `/ck:brief` |
| PRD | `docs/PRD.md` | `/ck:prd` |
| Team, roles and responsibilities | `docs/TEAM.md` | `/ck:team` |
| Roadmap | `ROADMAP.md` (the family's root-level convention [R]) | `/ck:roadmap` |
| Architecture | `docs/ARCHITECTURE.md` | `/ck:architecture` |
| Brand direction record | `docs/decisions/<timestamp>-brand-direction.md` | `/ck:brand-guide` |
| Brand guide | `docs/brand-guide.md` | `/ck:brand-guide` |
| Brand galleries and assets | `brand/proposals/`, `brand/finalists/`, `brand/final/` | `/ck:brand-guide` |
| Design gallery, chosen variant, spec | `docs/design/<feature>/gallery.html`, `chosen.html`, `spec.md` | `/ck:design` |
| Decision memo | `docs/decisions/<timestamp>-<slug>.md` | `/ck:panel`, and the panel inside `draft` |

Paths are overridable by argument. The plugin never edits `.gitignore`; nothing it writes needs excluding except the cache below.

The cache lives at `<project-repo>/.ck/runs/<run-id>/` and holds what a fresh session might want but nothing a document depends on:

```
.ck/runs/<run-id>/
├── run.json              { runId, command, createdAt, status, stage, outputPath, lenses, harnessRunId, workflow }
├── panel/<persona>.json  one file per lens
├── sections/<persona>.md one file per contributor, for the assembled documents
└── review.md             the comments and how each was applied
```

Rules, each of which closes a failure mode found in review:

| Rule | Failure it closes |
|---|---|
| `run-id` is `<UTC timestamp>-<slug>`, minted by the skill with `date -u`; workflows receive `timestamp` in `args` because `Date.now()` throws in scripts [D] | Non-deterministic scripts break resume |
| A skill passes `projectRoot` and `runDir` **absolute** in `args`; a direct slash invocation gets the typed text as a string, and the script defaults both to the session's directory | Subagents inherit the session cwd; a skill run from a subdirectory would otherwise write `docs/` in the wrong place, and a direct run must work with nothing but the text (Phase 0, 2026-09-09) |
| Every workflow accepts `args.startAt` and skips completed stages; the skill decides `startAt` by which documents exist | A fresh session cannot replay the harness cache [D]; the file on disk is what survives |
| The skill writes the Workflow tool's own run id into `run.json` as `harnessRunId` before it waits | Within a session, `resumeFromRunId` replays completed agents at no cost [D] |
| The skill adds `.ck/` to `<project-repo>/.git/info/exclude` on first use, never to `.gitignore` | The cache must not appear in the product's history, and the plugin must not edit a tracked file the author did not ask it to |
| Every agent that writes returns the path it wrote, in its schema | The script cannot check the filesystem; the next stage needs the path |
| Scripts never depend on `${CLAUDE_PLUGIN_ROOT}`: contracts and the roster are skills (`ck:<name>-artifact`, `ck:roster`) that an agent loads by name when no `pluginRoot` was passed | The variable expands in skill and agent text, not inside workflow scripts (Phase 0, 2026-09-09) |

### 4.4 Naming

- Plugin `name`: `ck`. Everything is `/ck:<name>` or `ck:<name>` [D].
- Pipeline skills: `opportunity`, `prd`, `architecture`, `brand-guide`, `design`, `next` (user-invocable, `disable-model-invocation: true`).
- Workflows: `panel`, `market-research`, `brief`, `team`, `roadmap` (user-invocable directly, since they have no gate) and `draft`, `opportunity-draft`, `brand`, `design-round` (launched by their skills; runnable directly by Will). A plugin workflow is itself a slash command [D], so all nine appear in autocomplete. No name is shared between a skill and a workflow, because both occupy `/ck:<name>`.
- Contracts: `<document>-artifact` (not user-invocable; read by agents and loadable by Claude when writing that document type anywhere).
- Persona switch skills: `/ck:<name>`, one per persona (§5.6). No persona name collides with a command name.
- Agents: `river`, `akira`, ... in frontmatter (no colon allowed [D]); registered as `ck:river`, referenced as `agentType: 'ck:river'` in scripts and `subagent_type: "ck:river"` from the Agent tool.

### 4.5 Model policy and the effort axis

Three persona tiers and two stage tiers. The persona sets the model floor; the workflow stage sets the effort. Difficulty belongs to the task, not the persona. [W, 2026-09-08] for the tiers; the effort axis is from the Opus PRD §7.8.

| Tier | Model | Who | Why |
|---|---|---|---|
| Judgment | `claude-fable-5-1` | River, Akira, Morgan, Sage, Jordan, Reiner | The seats whose output is a decision: product, architecture, security, business, data, game design. Fable where it matters |
| Craft | `claude-opus-5` | Toni, Kai, Iris, Quinn, Casey, Cornelius, Ernie, Rez, Tracy, Travolta, Noon | Judgment-heavy craft at moderate volume |
| Execution | `claude-sonnet-5` | Sasha, Alex, Robin, Piper | Implementation and volume. Sonnet where it matters |
| Research (stage) | `claude-sonnet-5` | Neutral research agents in `market-research` | Volume reading and web search, checked afterwards |
| Classification (stage) | `claude-haiku-4-5-20251001` | Validators in every workflow | Shape checks against a checklist |
| Synthesis (stage) | The session model | Neutral synthesis and assembly agents | Holds no lens; inherits |

| Agent kind | Model comes from | Effort comes from | Who may override the model |
|---|---|---|---|
| Persona agent (`agentType: 'ck:<name>'`) | Frontmatter `model:` from `ck/tiers.conf` | The script, per stage: the draft and rewrite stages and the memo synthesis run at `medium` (drill 5c showed the author stages spending most of a run's tokens on turns, not on the document); omitted means the session's effort | `panel.js` only, and only downward, for lens decorrelation |
| Neutral utility agent (no `agentType`) | The script | The script: validators at `low`, researchers at `medium` | The script |
| The main session (gates, `/ck:next`, finalize, switch skills) | The user's session model | The session | The user |

Precedence is per-invocation → frontmatter → `CLAUDE_CODE_SUBAGENT_MODEL` → session [D]. `agent()` accepts `effort` per call [D]. Persona frontmatter never sets `effort`, so one persona can run a mechanical stage at `low` and a design stage at `xhigh` without a second definition. `/workflows` shows the requested and any substituted model per agent [D].

Not in phase one: escalation chains, the Advisor tool, and mid-run arbitration. Workflows cannot pause for input [D], and `PreModelSwitch` fires only on a requested session switch [D]. Phase-one resilience is null-tolerant scripts: a stage that fails returns `null`, the script logs it and continues where it can.

### 4.6 What phase one deliberately does not build

Everything in proposal §6, plus: hook-enforced gates, a fallback chain, the Advisor tool, Routines, mid-run arbitration, a `bin/` CLI, any UI, any review mechanism of its own (§4.9). Reasons are in §10.

### 4.7 Plugin, web app, wrapper, or dashboard

Will's question, answered:

1. **It is a plugin.** Subagents, workflow scripts, and skills execute only inside Claude Code. A web app cannot run them. The plugin is the product; nothing wraps it.
2. **Single source of truth rules out a hosted app with its own store.** The family retired local persona overrides twice on exactly this ground [R]. Anything that edits a persona or a workflow edits the same files in the `ck` source checkout, and the change flows through git, the generator, and the tests.
3. **`/workflows` is the run view in phase one** [D]: phases, agent counts, tokens, elapsed time, drill-down to any agent's prompt and result. What it does not show: the static catalog (which workflows exist; which personas, tiers, and models each stage uses) and the per-run interaction graph (which lens asked which lens what).
4. **The catalog is derivable from files.** Every `ck` workflow declares `phases` and a `personas` list in `meta`. `meta` is a pure literal [D], so it names the default roster, not a run-time choice. Phase two `/ck:map` emits a Mermaid graph (workflow → phase → persona → tier → model) with one agent and no infrastructure; `/ck:map --run <id>` draws the per-run graph from `panel/*.json`.
5. **The Workbench will be built, as phase three** [W, 2026-09-08]. It is a rewrite of the conductor dashboard, not an extension of it: a local server and a browser (the shape conductor already settled on [R]), Python by Will's preference, that shows the catalog, run history, cost, and persona usage, and edits personas and workflows against the `ck` source checkout by running the generator and the tests and committing. It reuses conductor's fixture-fenced JSONL cost parser and `pricing.json`. It never hosts a store of definitions. Its own PRD is written after phase one has run for real, because the catalog and run data it displays do not exist yet. §10.3 has the scope as far as it is known today.

### 4.8 Plain language: house style for every message a skill prints

Adapted from the Opus PRD §7.11. Clare is proficient, so this is house style rather than protection. Three rules:

1. Never show a stack trace.
2. Always name the file that holds the work completed so far.
3. Always give exactly one next action.

Model names and costs may appear once, in the closing line of a run ("Three reviewers on three models; about $0.80"), never as a choice the user must make to proceed. Will's escape hatch: `/workflows` shows every agent, model, and token count.

Three failure classes and what the user sees:

| Failure | What she sees | What she can do |
|---|---|---|
| The checker rejects a draft | "The PRD is missing a success metric. Fixing that section." | Nothing. It self-corrects, up to twice |
| A stage fails after retries | "I couldn't finish the requirements section. Everything up to it is saved in `docs/PRD.md`. Run `/ck:prd` again to continue from there." | Run it again. Completed stages are skipped |
| A panel lens or the whole workflow is unavailable | "One of the three reviewers didn't answer. The memo is based on the other two and says so." or "Claude is at capacity right now. Run `/ck:prd` again in a few minutes." | Wait or retry |

### 4.9 Reviews: Claude's built-in review and comment system

Will's rule, recorded 2026-09-05 and confirmed 2026-09-08: every document for review arrives as a page he can comment on; every design for review arrives as a gallery of labeled variants, side by side, that he can comment on. That page is how feedback is given. Claude holds every comment, then works through and resolves all of them once the reviewer says "done". The page is Claude's own review and comment system, in the Claude desktop app or at claude.ai; `ck` builds nothing of its own for this. [W]

Mechanism, verified in this session's tool contract: a published page is private to the account; viewers switch it to comment mode and leave threads on any passage or element; Claude reads the threads, replies on threads a person has sent to Claude, republishes the same URL, and marks each thread resolved.

Every review page carries these five steps in its banner, because a page that says "comment anywhere" without them is a page nobody can comment on [R, 2026-09-08]:

1. Open the link signed in to your Claude account.
2. Switch the page to comment mode from the bar at the top.
3. Click the passage or the variant and type.
4. Put `@claude` in the comment so Claude can reply to it and resolve it.
5. Say "done" in the chat when you have finished.

Rules:

1. One page per review, republished in place; never a new URL for a revision.
2. When the reviewer says "done", Claude reads every thread, applies each change to the file on disk (the document is the state, §4.3), republishes, and resolves each thread with one line saying what changed. A comment Claude will not act on gets a reply with the reason and stays open. A thread not sent to Claude is applied and reported in chat, because it cannot be replied to or resolved.
3. Document pages are built by `scripts/render-review.py` in one command, never by the session writing HTML: the document with a sticky table of contents, so a comment can point at a section. Drill 5c measured the hand-built page at about a third of a `/ck:prd` run's cost.
4. Gallery pages show labeled variants (A, B, C) side by side, each with its rationale and trade-off, each commentable; the reviewer comments to pick one or ask for changes. Brand galleries and design galleries use one page shape (§7.8, §7.9).
5. Availability, from the docs (Phase 0, S5): the Claude Code CLI 2.1.183 or later or the desktop app, signed in with `/login`, on a paid plan; reading comments needs 2.1.221 or later; replying on its own needs 2.1.228 or later; and comments are taken only on an artifact shared within a Team or Enterprise organization, so an account on a Pro or Max plan reviews by file edit. Every gate keeps that file-edit path: "Edit the file and run the command again; I'll pick up from your edits."

Phase one uses this at every gate in §4.2's table, and for the PRD you are reading.

---

## 5. Personas as subagents and switch commands

### 5.1 Source of truth

`ck/profiles/<name>.md` and `ck/tiers.conf` are the only place persona text and tiers are edited. They are imported once from the old tool's `profiles/` directory at its commit `b4b211fbf4ec6f4d365a550b55e9981610ed7dda`, in the first commit of the `ck` repository, and are owned by `ck` from then on. There is no vendored copy, no lock file, no sync script, and no drift check against anything outside the repository. [W, 2026-09-08]

Two files are generated from every profile, and one index from all of them:

| Generated file | Purpose | Registered as |
|---|---|---|
| `agents/<name>.md` | The persona as a subagent, on its tier, with interactive behaviors rewritten for output (§5.2, §5.4) | `ck:<name>` |
| `skills/<name>/SKILL.md` | The persona as a session switch: the profile with its interactive behaviors intact, because a session has a user (§5.6) | `/ck:<name>` |
| `profiles/ROSTER.md` and `skills/roster/SKILL.md` | One line per persona: name, role, tier, one-sentence domain. Read by `/ck:team` and `/ck:opportunity` when choosing a cast; the skill form is what a workflow agent loads when it has no plugin path | `ck:roster` (not for typing) |

`scripts/generate.sh` produces all three; CI fails on drift between `profiles/` and the generated files (§9). The two coordinator profiles are not imported: their routing behavior becomes `/ck:team` (§6.5) and `/ck:next` (§6.12), and their session greeting has no equivalent in a plugin.

### 5.2 Generation rule for agents

For each `profiles/<name>.md`:

```
---
name: <name>
description: <Display>, <Role>. Reviews and drafts from the <role, lowercase> perspective for ck workflows and delegation; returns structured findings.
model: <the tiers.conf value, verbatim>
---

<!-- GENERATED from profiles/<name>.md by scripts/generate.sh; edit the profile, not this file. -->

<profile body with "## Required Interactive Behaviors" transformed per §5.4, "## Greeting" removed>

---

You are running as a delegated subagent. When the prompt names a project root and a run directory, read inputs from the project and write outputs only where the prompt says. If a schema is imposed, fill every required field; anything you would have asked goes in `questions`. Return findings first, detail after.
```

Frontmatter carries `name`, `description`, `model` and nothing else. Not set, with the reason:

| Field | Why not in phase one |
|---|---|
| `effort` | Effort belongs to the stage, set by the script (§4.5) |
| `tools`, `disallowedTools` | Agents must write under `<project-repo>`; per-path scoping is not available; revisit after the drill |
| `maxTurns` | Workflow caps are the budget guard in phase one |
| `color` | Cosmetic; the style guide assigns colors to projects, not personas |
| `permissionMode`, `hooks`, `mcpServers` | Ignored for plugin agents [D] |

### 5.3 Tier table

`ck/tiers.conf`, format `<persona> <model>`, one line each. Three tiers [W, 2026-09-08]; the seven personas the proposal left unassigned are placed by role.

| Persona | Role | Tier | Model | Change from the imported file |
|---|---|---|---|---|
| river | Product Manager | Judgment | `claude-fable-5-1` | Fable 5 to Fable 5.1 |
| akira | Backend Engineering | Judgment | `claude-fable-5-1` | Fable 5 to Fable 5.1 |
| morgan | Security Engineering | Judgment | `claude-fable-5-1` | Fable 5 to Fable 5.1 |
| sage | Business Advisor | Judgment | `claude-fable-5-1` | Fable 5 to Fable 5.1 |
| jordan | Data and ML | Judgment | `claude-fable-5-1` | Fable 5 to Fable 5.1 |
| reiner | Tabletop Game Designer | Judgment | `claude-fable-5-1` | Fable 5 to Fable 5.1 |
| toni | Product Marketing | Craft | `claude-opus-5` | Opus 4.8 to Opus 5 |
| kai | UX Design and Visual Art | Craft | `claude-opus-5` | Opus 4.8 to Opus 5 |
| iris | Brand and Illustration | Craft | `claude-opus-5` | Opus 4.8 to Opus 5 |
| quinn | Project Manager | Craft | `claude-opus-5` | Opus 4.8 to Opus 5 |
| casey | Data Analyst | Craft | `claude-opus-5` | Opus 4.8 to Opus 5 |
| cornelius | Military Historian | Craft | `claude-opus-5` | Opus 4.8 to Opus 5 |
| ernie | WW2 Narrative Author | Craft | `claude-opus-5` | Opus 4.8 to Opus 5 |
| rez | Cyberpunk Genre Advisor | Craft | `claude-opus-5` | Opus 4.8 to Opus 5 |
| tracy | Fantasy Genre Advisor | Craft | `claude-opus-5` | Opus 4.8 to Opus 5 |
| travolta | Fantasy Narrative Author | Craft | `claude-opus-5` | Opus 4.8 to Opus 5 |
| noon | Cyberpunk Narrative Author | Craft | `claude-opus-5` | Opus 4.8 to Opus 5 |
| sasha | Frontend Engineering | Execution | `claude-sonnet-5` | unchanged |
| alex | DevOps and Platform | Execution | `claude-sonnet-5` | unchanged |
| robin | QA and Testing | Execution | `claude-sonnet-5` | unchanged |
| piper | Tabletop Playtester | Execution | `claude-sonnet-5` | unchanged |

Six on Fable 5.1, eleven on Opus 5, four on Sonnet 5. Stage tiers (research, classification, synthesis) are set in scripts, never on a persona (§4.5).

Fable 5.1 rather than Fable 5: same price [D], newer generation. Full model IDs rather than aliases, so a tier changes only when someone edits this file; the resolved model is visible per agent in `/workflows` [D]. [P]

### 5.4 The interactive-behavior rewrite

Every profile has a `## Required Interactive Behaviors` section written as questions to the user (River: Three Whys, V0 Challenge, Premortem). A subagent cannot ask [D]. The transform is mechanical, identical for all 21 personas, and adds no per-persona prose:

1. Rename the heading to `## Required Behaviors (subagent form)`.
2. Insert directly under it:

   > You are running with no user present. Every behavior below still applies, in output form. Where a behavior tells you to ask, halt, interrupt, or require an answer before proceeding: do not stop. State the question verbatim under `questions` (addressed to `author` or to a named teammate), state the assumption you will proceed on, and proceed. Where a behavior produces an artifact (table, diagram, scenario, counter-proposal, pitch), produce it in full. Where it requires a decision from the user, give your recommendation with evidence and mark the decision as open.

3. Keep the profile text verbatim beneath.

What the preamble makes River do, and what the scripts ask for by name:

| Profile behavior | Subagent form |
|---|---|
| Three Whys: ask "Why?" up to three times | Write the root-cause chain yourself from the input (solution → why → why → why), each step more specific, until the user pain is exposed or the request is shown to address a symptom; say which. A why the input cannot answer becomes a `questions` entry with your assumption |
| V0 Challenge: propose a V0 cutting half the scope and require a decision | Always include the V0 counter-proposal, what it cuts, whether it would still move the metric, and your recommendation with evidence. The decision stays with the author and is listed as open |
| Premortem: write the failure scenario and ask "What went wrong?" | Write the 2-3 sentence scenario in which this shipped on time and missed the metric, name the assumption it exposes, add that assumption to the Assumptions section, and leave the question verbatim for the author's review |

The interactive versions of River's three behaviors live in `skills/prd/SKILL.md` for the optional interview, and in `skills/river/SKILL.md` for the switch. A CI check asserts both carry the three behavior headings from `profiles/river.md`, so a renamed behavior fails the build instead of diverging silently (§9).

### 5.5 Hooks

`hooks/hooks.json`:

```json
{
  "description": "ck: persona usage log, and a check that the old tool is gone",
  "hooks": {
    "SubagentStart": [
      {
        "matcher": "^ck:",
        "hooks": [
          { "type": "command", "command": "\"${CLAUDE_PLUGIN_ROOT}/scripts/usage-log.sh\"" }
        ]
      }
    ],
    "SessionStart": [
      {
        "hooks": [
          { "type": "command", "command": "\"${CLAUDE_PLUGIN_ROOT}/scripts/check-prereqs.sh\"" }
        ]
      }
    ]
  }
}
```

`scripts/usage-log.sh` reads the hook's stdin JSON, appends one line `{"ts":"<UTC>","agent_type":"ck:<name>","session_id":"<id>","cwd":"<path>"}` to `${CLAUDE_PLUGIN_DATA}/usage.jsonl`, and always exits 0. Facts it relies on: `SubagentStart` matchers accept plugin-scoped names such as `^my-plugin:reviewer$`; stdin carries `agent_type` and `session_id`; `CLAUDE_PLUGIN_DATA` is exported to hook processes and survives plugin updates [D]. It never blocks: a logging failure must not stop a persona. The 90-day review reads this file and answers proposal §8.4. Observed in Phase 0 (S4): the hook fires for persona agents inside a workflow as well as for direct delegation; stdin carries `agent_type`, `agent_id`, `session_id`, `cwd`, and `transcript_path`; with `--plugin-dir` the data directory resolves to `~/.claude/plugins/data/ck-inline`.

`scripts/check-prereqs.sh` looks for `~/.claude/team/`, `~/.local/bin/claude-team`, and the old tool's block in `~/.claude/CLAUDE.md`. If any is present it prints one plain sentence ("The old team tool is still installed and its persona commands will collide with ck's. Remove it with the steps in the ck README.") and exits 0. It never blocks a session.

### 5.6 Persona switch commands

The session-switch route survives as `/ck:<name>`, one generated skill per persona, `disable-model-invocation: true`, description "Switch this session to <Display>, <Role>." The body is the profile verbatim, including `## Required Interactive Behaviors` and `## Greeting`, because a switched session has a user to ask. One sentence is prepended: "You are now <Display> for the rest of this session. You run on this session's model, not on your tier; to run on your tier, delegate to the `ck:<name>` subagent."

The three hand-off routes, all inside `ck`:

| Route | How | Runs on |
|---|---|---|
| Switch this session | `/ck:river` | The session's model |
| Delegate one task | `Agent({ subagent_type: "ck:river" })` | River's tier |
| Run a pipeline stage or a fan-out | The `ck` workflows | Each persona's tier, per stage |

The fourth route the old tool offered, a separate terminal session per persona, is what the workflows replace. What still needs a separate session (a long parallel build in its own worktree) is `/ck:feature`'s job in phase two.

### 5.7 Acceptance criteria

- [ ] `agents/` and `skills/<name>/` each hold exactly one file per `profiles/*.md` (21 today); `profiles/ROSTER.md` has 21 rows.
- [ ] Every agent's `model:` equals its `tiers.conf` line; `name:` equals the filename and contains no colon; `## Handoff Brief` present; `## Greeting` absent; the §5.4 preamble present; no `effort:` line.
- [ ] Every switch skill carries `## Required Interactive Behaviors` and `## Greeting` verbatim from its profile, and the prepended sentence.
- [ ] Regenerating from `profiles/` produces no diff against the committed generated files.
- [ ] In a session with the plugin enabled, `@ck:river` appears in the subagent typeahead and `Agent({subagent_type: "ck:river", ...})` runs on `claude-fable-5-1` (visible in the transcript); `/ck:river` switches the session.
- [ ] After one `ck:` delegation, `${CLAUDE_PLUGIN_DATA}/usage.jsonl` has one new line with `agent_type` set.
- [ ] With `~/.claude/team/` present, a new session prints the one-sentence warning; without it, nothing.

---

## 6. The pipeline

### 6.1 Order, inputs, and outputs

Each command runs when its required inputs exist in `<project-repo>` and names the missing one in a sentence when they do not. Optional inputs are read when present and skipped when absent. The order below is the order `/ck:next` recommends; any command can run on its own.

| Step | Command | Requires | Reads if present | Writes | Gate |
|---|---|---|---|---|---|
| 1 | `/ck:opportunity` | An idea in a sentence | `docs/market-research.md`, `docs/TEAM.md` | `docs/opportunity.md` | Review page |
| 2 | `/ck:market-research` | `docs/opportunity.md` or `docs/brief.md` or a focus in a sentence | both | `docs/market-research.md` | None |
| 3 | `/ck:brief` | An idea in a sentence, or `docs/opportunity.md` | `docs/market-research.md` | `docs/brief.md` | None |
| 4 | `/ck:team` | `docs/brief.md` or `docs/opportunity.md` | `docs/PRD.md`, `docs/market-research.md` | `docs/TEAM.md` | None |
| 5 | `/ck:prd` | `docs/brief.md` | `docs/opportunity.md`, `docs/market-research.md`, `docs/TEAM.md`, `ROADMAP.md` | `docs/PRD.md`, `docs/decisions/<ts>-prd-review.md` | Review page |
| 6 | `/ck:roadmap` | `docs/PRD.md` | `docs/opportunity.md`, `docs/market-research.md`, `docs/TEAM.md` | `ROADMAP.md` | None |
| 7 | `/ck:architecture` | `docs/PRD.md`, `ROADMAP.md` | `docs/TEAM.md`, `docs/opportunity.md` | `docs/ARCHITECTURE.md`, `docs/decisions/<ts>-architecture-review.md` | Review page |
| 8 | `/ck:brand-guide` | `docs/opportunity.md` or `docs/brief.md` | `docs/PRD.md`, `docs/market-research.md` | `brand/`, `docs/decisions/<ts>-brand-direction.md`, `docs/brand-guide.md` | Two gallery pages |
| 9 | `/ck:design <feature>` | `docs/PRD.md` | `docs/brand-guide.md`, `brand/final/`, `docs/ARCHITECTURE.md` | `docs/design/<feature>/` | Gallery page |
| any | `/ck:panel <question>` | A question | Anything named as context | `docs/decisions/<ts>-<slug>.md` | None |
| any | `/ck:next` | Nothing | The table above | Nothing | None |

Every subsection below has the same parts: purpose, invocation, cast and models, stages, the document, the gate, cost, acceptance. Stages are given as the `meta.phases` of the script. Four scripts are written in full in the appendices (`panel`, `brief`, `draft`, `team`); the other five are specified here to the stage level and follow the same conventions (required args, `startAt`, null-tolerant stages, a validator, the document path returned in the schema).

### 6.2 `/ck:opportunity`

**Purpose.** The first document on a new product: is this worth doing, for whom, in what market, in what technical shape, and what would have to be true. Modelled on the NIGHTGRID opportunity analysis, which is a multi-persona document: each lens writes its own section, and River holds the frame, the stage gates, and the risks. [W, 2026-09-08]

**Invocation.** `/ck:opportunity <the idea in a sentence or two>`. With `docs/opportunity.md` already present, the skill offers to revise it (re-running Sections and Assemble on the comments) or start over.

**Cast and models.** River (Fable 5.1) frames and assembles. Contributors are chosen by River from `profiles/ROSTER.md` and `docs/TEAM.md` when it exists, up to four: Toni (Opus 5) always, for market context, positioning, and a go-to-market sketch; Akira (Fable 5.1) always, for the technical shape; a domain seat for the product's kind (Reiner for a game, Jordan for a data product, Sage for a business-model question, Cornelius for a historical setting); Sage optionally, for stage gates and monetization when the domain seat is not Sage. Contributors whose sections make claims about the world use web search and cite a source per claim (Phase 0 spike S7 confirms web search is available to subagents inside a workflow).

**Stages** (`workflows/opportunity-draft.js`, `meta.personas: ['river', 'toni', 'akira', 'sage', 'reiner', 'jordan']`):

| Phase | Agents | What happens | Writes |
|---|---|---|---|
| Frame | 1, `ck:river` | Reads the idea, the roster, and `docs/TEAM.md` and `docs/market-research.md` if present. Writes the concept statement and the hypothesis, chooses the contributors with a reason each, and writes one brief per contributor: the questions that section must answer | `<runDir>/frame.json` |
| Sections | Up to 4, in parallel, `agentType` per contributor, `effort: 'high'` | Each writes its section to the contract's section spec for its lens, with sources for external claims and its Handoff Brief | `<runDir>/sections/<persona>.md` |
| Assemble | 1, `ck:river` | Writes `docs/opportunity.md` to the contract: summary, concept, market context, one section per lens, stage gates, monetization, risks, open questions, sources. Applies River's behaviors in subagent form: the root-cause chain under the problem; a smaller first version under scope; the premortem left for the review | `docs/opportunity.md` |
| Validate | 1 neutral, Haiku 4.5, `effort: 'low'`; then `ck:river` to revise, at most twice | Checks the document against the contract checklist | `docs/opportunity.md` |

Seven to nine agents. Under the "medium" size guideline [D].

**The document.** `docs/opportunity.md`, contract §7.1.

**The gate.** The skill publishes the document as a review page (§4.9) with one question at the top: "Imagine this was built and nobody wanted it. What did we get wrong?" On "done" it applies every comment, republishes, resolves, and finalizes inline with `ck:river` (fold the answer into Risks and Assumptions; resolve answered open questions; re-check the contract).

**Cost.** About $2.50 per run (Appendix I).

**Acceptance.**
- [ ] On a fixture idea for a game, River chooses Reiner as the domain seat and says why in `frame.json`; on a fixture idea for a data product, Jordan.
- [ ] Every external claim in Market context carries a source; the Sources section lists each once.
- [ ] `docs/opportunity.md` has every contract section in order and passes the validator.
- [ ] The review page shows the premortem question at the top and the five comment steps in the banner; two comments are applied and resolved with one-line replies.
- [ ] Re-running with the document present offers revise or start over, and revise re-runs only Sections and Assemble.

### 6.3 `/ck:market-research`

**Purpose.** A deeper market pass than the brief's, run as a fan-out: several questions researched in parallel on the web, cross-checked, and written up with a source per claim. The shape of a deep-research run: plan, fan out, cross-check, cite. [W, 2026-09-08]

**Invocation.** `/ck:market-research [focus in a sentence]`. With no focus, the questions come from `docs/opportunity.md` or `docs/brief.md`; with neither and no focus, the workflow stops and names the missing input.

**Cast and models.** Toni (Opus 5) plans and writes. Research agents are neutral, on Sonnet 5 at `effort: 'medium'`, one per question, with web search. The cross-checker is neutral on Sonnet 5. The validator is Haiku 4.5.

**Stages** (`workflows/market-research.js`, `meta.personas: ['toni']`):

| Phase | Agents | What happens | Writes |
|---|---|---|---|
| Plan | 1, `ck:toni` | Reads the inputs. Writes four to six research questions across: market size and trends; competitors and substitutes; customers, segments, and channels; pricing and business models; platform, legal, or regulatory constraints. Each question names what a good answer contains | `<runDir>/plan.json` |
| Research | 4 to 6, in parallel, neutral, Sonnet 5, `effort: 'medium'` | Each answers one question from the web: findings, each with a source URL, a date, and a confidence; contradictions it noticed; what it could not find | `<runDir>/research/<n>.json` |
| Cross-check | 1 neutral, Sonnet 5 | Every claim must carry a source or be marked unverified; claims that contradict each other across researchers are listed with both sources; stale sources (older than 18 months for a moving market) are flagged | `<runDir>/crosscheck.json` |
| Write | 1, `ck:toni` | Writes `docs/market-research.md` to the contract: summary; market size and trends; competitors table; customers and channels; pricing and business models; constraints; contradictions and unknowns; implications for positioning; sources | `docs/market-research.md` |
| Validate | 1 neutral, Haiku 4.5, `effort: 'low'`; Toni revises at most once | Contract checklist, including "every claim in the body has a source in Sources" | `docs/market-research.md` |

Eight to ten agents. Runnable headless; the first candidate for a Routine in phase two.

**The document.** `docs/market-research.md`, contract §7.2. No gate: the author reviews by comment or edit when they want to, and `/ck:brief` and `/ck:prd` read it as it stands.

**Cost.** About $1.20 per run (Appendix I).

**Acceptance.**
- [ ] `plan.json` has between four and six questions covering at least four of the five areas.
- [ ] `/workflows` shows the Research phase running its agents in parallel on Sonnet 5.
- [ ] Every body claim carries a footnote or inline source that appears in Sources; a fixture with a planted contradiction (two researchers given conflicting seed facts) appears in Contradictions and unknowns.
- [ ] With no inputs and no focus, the workflow stops with one sentence naming what to run first.

### 6.4 `/ck:brief`

**Purpose.** The short document that governs the expensive PRD run: the problem, the person, the number, the scope, and a basic market pass. One line of idea text in; `docs/brief.md` out; nothing asked. [W, 2026-09-08] for the market pass.

**Invocation.** `/ck:brief <the idea in a sentence>`, or `/ck:brief` alone when `docs/opportunity.md` exists, in which case the idea and the market context come from it.

**Cast and models.** Toni (Opus 5) for the market pass, with web search; River (Fable 5.1) drafts; Haiku 4.5 validates.

**Stages** (`workflows/brief.js`, Appendix C, `meta.personas: ['toni', 'river']`):

| Phase | Agents | What happens | Writes |
|---|---|---|---|
| Market pass | 1, `ck:toni` | Reads `docs/market-research.md` and `docs/opportunity.md` if present and searches only for what they lack. Returns three to five comparable products: what each does, who it is for, its price or model, and the gap this idea would fill; one source each; one paragraph on how crowded the space is | `<runDir>/market.json` |
| Draft | 1, `ck:river` | Writes `docs/brief.md` to the contract: idea; problem and root-cause chain; user; success metric and leading indicator; comparable products (from Toni's pass, attributed); scope with a smaller first version and a recommendation; non-goals; open questions for the author. River's behaviors in subagent form: the whys are written, not asked; the smaller version is proposed, not negotiated | `docs/brief.md` |
| Validate | 1 neutral, Haiku 4.5, `effort: 'low'`; then `ck:river` once if needed | Contract checklist; one revision at most | `docs/brief.md` |

Three to four agents. About two minutes.

**The document.** `docs/brief.md`, contract §7.3 (full text: Appendix G).

**The gate.** None. The closing message names the file and gives one action: "Read it, change anything, then run `/ck:team` or `/ck:prd`."

**Cost.** About $0.55 per run (Appendix I).

**Acceptance.**
- [ ] `docs/brief.md` has the contract's eight sections in order and passes the validator.
- [ ] Comparable products lists three to five entries with a source each; when `docs/market-research.md` exists, the section cites it and the market pass makes fewer searches (visible in the transcript).
- [ ] The open-questions list is present even when empty.
- [ ] The closing message names the file and one next action.

### 6.5 `/ck:team`

**Purpose.** Team selection and roles and responsibilities: which personas are on this product, who owns which document and stage, who reviews, and which seat is missing. "Say you are building a game: do you have the game designer on your team?" [W, 2026-09-08]. This is the old coordinator's routing behavior, written down once per product instead of asked once per session.

**Invocation.** `/ck:team`. Reads `docs/opportunity.md`, `docs/brief.md`, `docs/PRD.md`, `docs/market-research.md`, whichever exist; requires at least one of the first two. With `docs/TEAM.md` present, re-nominates against the current documents and shows the diff in the closing message.

**Cast and models.** River (Fable 5.1) nominates and assembles. Each nominated persona confirms on its own tier at `effort: 'low'`. Haiku 4.5 validates.

**Stages** (`workflows/team.js`, Appendix D, `meta.personas: [all 21]`):

| Phase | Agents | What happens | Writes |
|---|---|---|---|
| Nominate | 1, `ck:river` | Reads the documents and `profiles/ROSTER.md`. Proposes the cast, up to eight: for each pipeline document and stage, an owner and reviewers; for each requirement area in the PRD if present, an owner; and the missing seats: needs no persona covers (legal, audio, localization, a specific domain), with what a person in that seat would own | `<runDir>/nominations.json` |
| Confirm | Up to 8, in parallel, `agentType` per nominee, `effort: 'low'` | Each nominee reads the documents and its nomination and returns: accept or decline each responsibility with a reason; what it needs from whom before it can start; one risk in its domain; and one seat it thinks is missing | `<runDir>/confirmations/<persona>.json` |
| Assemble | 1, `ck:river` | Writes `docs/TEAM.md` to the contract: cast table (persona, role, tier, why on this product); roles and responsibilities matrix (document or stage × owner, contributors, reviewers); hand-off order with what each hand-off carries; needs per persona; missing seats; declined nominations and why | `docs/TEAM.md` |
| Validate | 1 neutral, Haiku 4.5, `effort: 'low'`; River revises at most once | Contract checklist, including "every pipeline document has exactly one owner" | `docs/TEAM.md` |

Up to eleven agents; under the "medium" guideline. The Confirm fan-out is where a persona says "not me, and here is who": a nominee that declines names a replacement from the roster, and River takes it or explains why not.

**The document.** `docs/TEAM.md`, contract §7.5. It is read by `/ck:opportunity` and `/ck:architecture` when choosing contributors and lenses, so a persona added here shows up in the later steps.

**The gate.** None. The author edits or comments when they disagree.

**Cost.** About $1.00 per run (Appendix I).

**Acceptance.**
- [ ] On the game fixture, Reiner and Piper are nominated and the missing-seats list is non-empty (audio, at least); on the data-product fixture, Jordan and Casey are nominated and Reiner is not.
- [ ] `/workflows` shows Confirm running the nominees in parallel, each on its tier model, at low effort.
- [ ] A fixture nominee instructed (via a seeded profile note in the test) to decline produces a replacement in `docs/TEAM.md` with River's reason.
- [ ] Every pipeline document in §6.1 has exactly one owner in the matrix; the validator passes.

### 6.6 `/ck:prd`

**Purpose.** Proposal goal 3: a PRD that has the same shape every time, in every project, produced by River with the product, marketing, and UX lenses challenging it on three different models before the author sees it. The shape comes from the contract (§7.4); the process comes from the `draft` workflow (§4.1, one drafting engine).

**Invocation.** `/ck:prd [--interview]`. Requires `docs/brief.md`; without it: "Run `/ck:brief <your idea>` first. It takes about two minutes and writes `docs/brief.md`. Then run `/ck:prd` again." With `--interview` and no brief, River interviews in the session (Will's path, Appendix E step 2) and writes the brief from the answers.

**Cast and models.** River (Fable 5.1) drafts and rewrites. The panel: River on Fable 5.1 reading the brief, `docs/opportunity.md`, and `ROADMAP.md`; Toni on Opus 5 reading `docs/market-research.md` and `docs/opportunity.md`; Kai on Sonnet 5 (moved down from Opus 5 by the script, §4.5) reading `brand/` and `docs/design/`. Haiku 4.5 validates. Neutral synthesis inherits the session model.

**Stages** (`workflows/draft.js` with `args.artifact: 'prd'`, Appendix B, `meta.personas: ['river', 'akira', 'toni', 'kai', 'morgan', 'alex', 'jordan']`; stages are skipped when `args.startAt` names a later one):

| Phase | Agents | What happens | Writes |
|---|---|---|---|
| Draft | 1, `ck:river` | Reads `docs/brief.md`, the optional inputs, and the PRD contract. Writes `docs/PRD.md` to the contract's section order. Tags every claim not taken from the brief `[C1]`, `[C2]`, ... so the lenses can address it. Root-cause chain and V0 counter-proposal in subagent form. No premortem yet | `docs/PRD.md` |
| Validate | 1 neutral, Haiku 4.5, `effort: 'low'`; then `ck:river` to revise, at most twice | Checks the draft against the contract checklist; returns `{valid, missing[], notes}`. On `missing`, River revises in place, keeping every tag. After two revisions the workflow proceeds and logs what is still missing | `docs/PRD.md` |
| Panel | 4, nested `workflow('ck:panel', ...)` (by name; Phase 0 showed a script path outside the working directory is refused) | Question: "Is this PRD ready for the author's review, and what would you change before it ships?" Material: `docs/PRD.md`. Rationale, read second: `docs/brief.md`. Evidence per lens as above | `panel/*.json`, `docs/decisions/<timestamp>-prd-review.md` |
| Synthesize | 1, `ck:river` | Rewrites `docs/PRD.md`: revised where the panel showed a claim wrong or unsupported; **Appendix A, Challenged claims** (claim, challenged by, severity, status ∈ upheld, revised, withdrawn, open; resolution; the memo's disagreements and kill conditions reproduced verbatim; nothing deleted); **Appendix B, Premortem** (the scenario, the exposed assumption, the question "What went wrong?" left verbatim for the review) | `docs/PRD.md` |

Seven agents without a revision, up to nine with two. If the nested panel throws, the workflow logs it and synthesizes without it, saying so in the PRD header.

**Launch and wait.** The skill calls the Workflow tool with `name: "ck:draft"` and the args in Appendix E (a plugin workflow is addressed by name; Phase 0, open question 3), writes the returned run id into `run.json` as `harnessRunId`, tells the user in plain words that the draft is running in the background, and **stops: it waits for the task notification. It does not poll, does not narrate, and does not start other work on this run.** On a stop or failure it prints the §4.8 message naming `docs/PRD.md` and the one action, and records the failed stage in `run.json` so the next run passes the right `startAt`. `${CLAUDE_PLUGIN_ROOT}` expands anywhere in skill content [D].

**The document.** `docs/PRD.md`, contract §7.4 (full text: Appendix G).

**The gate.** The review page (§4.9) with the premortem question at the top. On "done": every comment applied to `docs/PRD.md` (or answered with a reason), the page republished, each thread resolved with one line. File-edit fallback: "Open `docs/PRD.md`, change anything, save, and run `/ck:prd` again; I'll fold your edits in." Either path may trigger a focused re-run of the panel on named sections before finalizing.

**Finalize.** One agent, inline (§4.2): `ck:river` folds the premortem answer into Assumptions and Risks, resolves each open decision as answered, keeps Appendix A intact, checks the result against the contract, writes `docs/PRD.md`, sets `status: final` in `run.json`. The skill prints the path and one next action: "Run `/ck:next`."

**Cost.** About $2.30 per run without a revision, about $2.90 with one, plus the main session's turns (Appendix I).

**Acceptance.**
- [ ] `/ck:prd` without a brief stops with the one-action message and runs nothing.
- [ ] `/ck:prd --interview` asks one question at a time; after the second why, `<runDir>/interview.md` already holds the first two answers; killing the session and re-running offers to resume.
- [ ] `run.json` contains `harnessRunId` before the skill goes idle; `.git/info/exclude` contains `.ck/`; `git status` shows `docs/` files and nothing under `.ck/`.
- [ ] `/workflows` shows phases Draft, Validate, Panel (with the nested panel's agents on three models), Synthesize; the validator runs on Haiku 4.5; River runs on Fable 5.1.
- [ ] `docs/PRD.md` has every contract section, an Appendix A with at least one row per finding a lens raised, and an Appendix B with a scenario and the verbatim question.
- [ ] Stopping the workflow during Panel, then running `/ck:prd` again, continues from Panel without re-drafting (`startAt`).
- [ ] The review page is published with the five steps in its banner; two comments are applied and resolved with one-line replies; a thread not sent to Claude is applied and reported in chat.
- [ ] Without the publishing tool: the file-edit message is printed; an edit to `docs/PRD.md` followed by `/ck:prd` finalizes from the edited file.
- [ ] The final PRD is at `docs/PRD.md` with `status: final` in `run.json`, and its checklist passes when re-validated by hand.
- [ ] `skills/prd/SKILL.md` contains the three behavior headings from `profiles/river.md` (CI-checked).

### 6.7 `/ck:roadmap`

**Purpose.** The roadmap in the family's own format (the roadmap skill's `ROADMAP.md` structure [R]): a current-state snapshot, opportunities in three tiers with why-now and a success signal, recommended sequencing, open questions, an OKR table, and a revision history. River prioritizes; Quinn sequences.

**Invocation.** `/ck:roadmap`. Requires `docs/PRD.md`. With `ROADMAP.md` present, runs in update mode: Section 1 is rewritten and a revision-history entry is appended, per the roadmap skill's own workflow [R].

**Cast and models.** River (Fable 5.1), Quinn (Opus 5), Haiku 4.5 validates.

**Stages** (`workflows/roadmap.js`, `meta.personas: ['river', 'quinn']`):

| Phase | Agents | What happens | Writes |
|---|---|---|---|
| Prioritize | 1, `ck:river` | Reads the PRD and the optional inputs. Writes the current-state snapshot and the opportunities in three tiers (ship next; high value, next sprint; strategic), each with why now or why not now and a measurable success signal, and the OKR table | `<runDir>/priorities.json` |
| Sequence | 1, `ck:quinn` | Writes `ROADMAP.md` to the contract: recommended sequencing with dependencies and what each step unblocks; open questions; the revision-history entry (what changed, why, open questions resolved or added, triggered by) | `ROADMAP.md` |
| Validate | 1 neutral, Haiku 4.5, `effort: 'low'`; Quinn revises at most once | Contract checklist | `ROADMAP.md` |

Three to four agents.

**The document.** `ROADMAP.md` at the root of `<project-repo>`, contract §7.6, which is the roadmap skill's structure verbatim so that the skill and this workflow produce interchangeable files.

**The gate.** None.

**Cost.** About $0.70 per run (Appendix I).

**Acceptance.**
- [ ] On a project with no `ROADMAP.md`, the file is created with Section 1 and Section 2 in the roadmap skill's format and passes that skill's lint check [R].
- [ ] On a project with one, Section 1 is replaced and exactly one revision-history entry is prepended, dated with the run's timestamp.
- [ ] Every Tier 1 opportunity traces to a numbered PRD requirement.

### 6.8 `/ck:architecture`

**Purpose.** The PRD and the roadmap in; a recommended architecture out, with the alternatives considered, the decision record, and a security, platform, and data challenge on three models before the author sees it. [W, 2026-09-08]

**Invocation.** `/ck:architecture`. Requires `docs/PRD.md` and `ROADMAP.md`; names the missing one otherwise.

**Cast and models.** Akira (Fable 5.1) drafts and rewrites. The panel: Morgan (security) on Fable 5.1 reading `docs/PRD.md` and any `SECURITY.md`; Alex (platform and operations) on Sonnet 5 reading any `infra/`, `Dockerfile`, or CI configuration; Jordan (data) on Opus 5 (moved down from Fable 5.1 by the script) reading `docs/market-research.md` and any `data/` or schema files. Three models. Haiku 4.5 validates.

**Stages.** `workflows/draft.js` with `args.artifact: 'architecture'` (Appendix B): the same Draft, Validate, Panel, Synthesize as §6.6, with the architecture contract, Akira as author, the lenses above, and the panel question "Would you build it this way, and what would you change before the first line of code?"

| Phase | Author's work, specific to this document |
|---|---|
| Draft | `docs/ARCHITECTURE.md` to the contract: context and constraints from the PRD and roadmap; quality attributes ranked; the recommended architecture with a Mermaid diagram; components and their responsibilities; data model sketch; integration points; alternatives considered and why not; decision record; sequencing against the roadmap; risks; open questions. Every claim not from the PRD tagged `[C<n>]` |
| Synthesize | The same appendices as the PRD: Challenged claims, and a Premortem written as "this shipped and fell over in production; what did we get wrong?" |

**The document.** `docs/ARCHITECTURE.md`, contract §7.7.

**The gate.** The review page with the premortem question. Finalize inline with `ck:akira`.

**Cost.** About $2.40 per run (Appendix I).

**Acceptance.**
- [ ] Without `ROADMAP.md`, the skill stops and names `/ck:roadmap`.
- [ ] `/workflows` shows Akira on Fable 5.1, and the three lenses on three different models.
- [ ] `docs/ARCHITECTURE.md` has a rendered Mermaid diagram, an alternatives table with at least two rows, and a decision record with a date.
- [ ] Every Tier 1 roadmap item is placed in the sequencing section.

### 6.9 `/ck:brand-guide`

**Purpose.** A brand identity, produced the way NIGHTGRID's was: proposal rounds, then candidates, then finalists, each as a gallery of labeled variants the author comments on, ending in a brand direction record and a brand identity guide with the d20Mob guide's structure. [W, 2026-09-08]

**Invocation.** `/ck:brand-guide`. Requires `docs/opportunity.md` or `docs/brief.md`. With `docs/brand-guide.md` present, offers a revision round on the finalists.

**Cast and models.** Iris (Opus 5) leads: marks, palette, type, art direction. Kai (Opus 5) skins UI surfaces in each direction. Toni (Opus 5) supplies one positioning line per direction before Iris starts. Haiku 4.5 validates each gallery against the gallery contract. Output is SVG, HTML, and CSS; raster generation is out of scope.

**Stages** (`workflows/brand.js` with `args.stage` ∈ `proposals | finalists | guide`; the skill runs one stage, gates, then the next; `meta.personas: ['iris', 'kai', 'toni']`):

| Stage | Agents | What happens | Writes |
|---|---|---|---|
| Proposals | Toni, then Iris, then Kai, then validator | Toni: a positioning line and an audience note per candidate direction. Iris: four to six brand directions, each with a name treatment, palette, type pairing, mood words, one hero mark, and a rationale and trade-off. Kai: one UI surface per direction in that direction's skin. Assembled as a gallery page, labeled A to F | `brand/proposals/gallery.html`, `brand/proposals/<label>/*.svg` |
| *Gate 1* | | The gallery as a review page. The author comments to pick two or three and ask for changes | `<runDir>/review-1.md` |
| Finalists | Iris, Kai, validator | For each pick: the full palette with tokens (background, ink, accent, functional colors), the logo system (primary, secondary, lockups, clear space, minimum size, misuse), the type scale, three UI surfaces from Kai, an app icon. A gallery labeled by the proposal it came from | `brand/finalists/gallery.html`, `brand/finalists/<label>/` |
| *Gate 2* | | The author picks one and asks for final changes | `<runDir>/review-2.md` |
| Guide | Iris, Kai, validator | Iris writes the brand direction record (decision, locked layout system, house tokens, theme lineup, rationale, open items, asset list) and `docs/brand-guide.md` to the contract. Kai exports the final assets: SVG marks, tokens as JSON and CSS variables, the UI surfaces | `docs/decisions/<timestamp>-brand-direction.md`, `docs/brand-guide.md`, `brand/final/` |

Four agents per stage; three stages; two gates.

**The documents.** The galleries (contract §7.9, shared with `/ck:design`), the brand direction record and the brand guide (contract §7.8).

**The gates.** Two gallery review pages (§4.9 rule 4). The galleries are also committed files, so the review outlives the page.

**Cost.** About $2.50 across the three stages (Appendix I).

**Acceptance.**
- [ ] The proposals gallery shows between four and six labeled directions, each with a mark, a palette, a type pairing, a UI surface, a rationale, and a trade-off; the page is under the 16 MB publishing limit.
- [ ] Gate 1 comments naming two labels produce a finalists gallery with exactly those two.
- [ ] `docs/brand-guide.md` has every contract section; `brand/final/tokens.css` and `tokens.json` agree; every asset named in the guide's asset list exists under `brand/final/`.
- [ ] The brand direction record names the chosen direction, the rejected finalists, and the reason.

### 6.10 `/ck:design`

**Purpose.** Clare's J2: one feature from the PRD to design mockups, the same way every time. Three labeled variants in a gallery, one review by comment, the chosen variant at full fidelity with a written spec. [W, 2026-09-08]

**Invocation.** `/ck:design <feature name>`. Requires `docs/PRD.md`; the feature must be findable in it by name or requirement number. If it is not, the skill asks for the requirement text in one question and writes it to `<runDir>/feature.md`. Reads `docs/brand-guide.md` and `brand/final/` when present; without them Kai uses a neutral skin and the gallery says so.

**Cast and models.** River (Fable 5.1, `effort: 'low'`) extracts the feature's requirements. Kai (Opus 5) designs. Robin (Sonnet 5) writes the acceptance checks. Haiku 4.5 validates.

**Stages** (`workflows/design-round.js` with `args.stage` ∈ `variants | refine`; `meta.personas: ['river', 'kai', 'robin']`):

| Stage | Agents | What happens | Writes |
|---|---|---|---|
| Variants | River, then Kai, then validator | River: the feature's requirements, acceptance criteria, user, and the PRD's constraints on it, in one page. Kai: three labeled variants (A, B, C) of the feature's screens in device frames, in the brand skin: each with a rationale, a trade-off, which requirement each screen satisfies, and the empty, loading, and error states | `docs/design/<feature>/gallery.html`, `<runDir>/feature.md` |
| *Gate* | | The gallery as a review page; the author picks a variant and asks for changes | `<runDir>/review.md` |
| Refine | Kai, then Robin, then validator | Kai: the chosen variant at full fidelity with all states, and `spec.md`: screens, components, interactions, states, copy, accessibility notes, and a requirement-traceability table. Robin: an Acceptance section in `spec.md`, one check per screen against its PRD requirement | `docs/design/<feature>/chosen.html`, `docs/design/<feature>/spec.md` |

Three agents per stage; one gate.

**The documents.** `docs/design/<feature>/gallery.html` (contract §7.9), `chosen.html`, `spec.md` (contract §7.10).

**Cost.** About $1.20 per feature (Appendix I).

**Acceptance.**
- [ ] On a fixture PRD with three numbered requirements, `/ck:design` for one of them produces a gallery with exactly three labeled variants, each showing the three states.
- [ ] A gate comment choosing B produces `chosen.html` derived from B and a `spec.md` whose traceability table covers every acceptance criterion of the requirement.
- [ ] Two features designed in the same project have `spec.md` files with identical section headings (G1, G5).
- [ ] Without a brand guide, the gallery header says the skin is neutral and names `/ck:brand-guide`.

### 6.11 `/ck:panel`

**Purpose.** Proposal goal 4: adversarial and complementary input on one decision, from the product lens, the marketing lens, and the UX lens, each on a different model, each reading its own evidence, each forced to argue against itself. The output is a decision memo that shows where the lenses disagree and leaves the decision to the author (proposal §5.5). The memo format follows Will's own panel brief: agreement is flagged as low-information, kill conditions are quoted and checked, and unique findings and unchecked areas are listed.

**Invocation.**

```
/ck:panel Should the first release include the brand guide step?
/ck:panel Is this PRD ready for review? --context docs/PRD.md
/ck:panel <question> --lenses river:claude-fable-5-1,morgan:claude-opus-5,sasha:claude-sonnet-5
```

Claude passes the invocation as `args` [D]: for a direct `/ck:panel <question>`, the typed text itself, as a string: the harness passes a slash command's text to the script unchanged, with no chance for the session to compose arguments first (Phase 0, 2026-09-09, observed on Will's machine and reproduced). Every pure workflow therefore accepts a string and defaults the rest: the project root is the session's directory, the cache is `.ck/runs/<workflow>-latest`, the timestamp is written by the agent from `date -u`, and the contract and roster are loaded by skill name (`ck:memo-artifact`, `ck:roster`) because `${CLAUDE_PLUGIN_ROOT}` does not expand inside a script. A skill launch passes the full object instead: `runId`, `runDir`, `projectRoot`, `pluginRoot`, `timestamp`, `question`, `contextPath`, `rationalePath`, `memoPath`, `lenses`.

**Lenses, models, and evidence.**

| Lens | Persona | Default model | Reads by default | Why this model |
|---|---|---|---|---|
| product | `ck:river` | `claude-fable-5-1` | `docs/PRD.md`, `docs/opportunity.md`, `ROADMAP.md` | River's own tier; the anchor lens |
| marketing | `ck:toni` | `claude-opus-5` | `docs/market-research.md`, `docs/opportunity.md` | Toni's own tier |
| ux | `ck:kai` | `claude-sonnet-5` | `brand/`, `docs/design/` | Moved down from Opus 5 so that three lenses are three models, at the lowest added cost |

Every lens also reads `contextPath` when given. Files in `reads` that do not exist are skipped and named in the result. Varying the evidence does more than varying the model (Opus PRD P7): three Claude tiers give scale diversity, not independent judgment, because they share one training pipeline. The memo header states this limitation (proposal §8.5).

**Two passes.** Each lens forms and records its view from the material and its own evidence first. Only then, if `rationalePath` is given, does it read the author's rationale, check whether the claims it relied on are supported, and report whether its view changed. A reviewer who reads the rationale first ratifies instead of testing (Will's panel brief).

Any lens can be replaced or re-modelled per run. If two lenses share a model the script logs that their agreement counts as one opinion. `panel.js` is the one script allowed to pass `model` on a persona agent, and it only moves a lens down (§4.5). [P]

**Lens schema.** Every lens returns, and writes to `<runDir>/panel/<persona>.json`: `recommendation` (yes, no, yes-if, not-yet); `position`; `reasoning` (evidence from the material or the lens's own reading, not from the other lenses); `evidenceRead`; `strongestArgumentAgainstOwnRecommendation`; `killCondition`; `killConditionMet` (yes, no, unknown) with `killConditionEvidence`; `viewChangedByRationale` (yes, no, not-read); `questionsForOtherLenses` (`[{to, question}]`); `handoffBrief`. The schema is enforced at the tool-call layer, so a lens that omits a field is retried by the harness [D].

**Stages** (`workflows/panel.js`, Appendix A, `meta.personas: ['river', 'toni', 'kai']`):

| Phase | Agents | What happens |
|---|---|---|
| Lenses | 3, in parallel, `agentType: 'ck:<persona>'`, `model` per lens | Each reads the material and its own evidence, records its view, then reads the rationale if given; applies its behaviors in subagent form; writes `panel/<persona>.json`; returns the object |
| Synthesis | 1, neutral (no `agentType`, session model) | Reads the three results, writes the memo at `memoPath`, returns the memo object |

Four agents. One concurrency round on any machine with four or more CPUs.

**The document.** `docs/decisions/<timestamp>-<slug>.md`, contract §7.11. Sections, in order: 1 Question and context (run id, timestamp, the lens table with models and what each read, the decorrelation limitation, any lens that did not answer); 2 Recommendations (table); 3 Agreement, flagged as low-information, with whether that is because it is obviously true or a shared blind spot; 4 Disagreement, every point where two lenses conflict, both positions at full strength, and the decision the author must make, not adjudicated; 5 Kill conditions, verbatim, each with the lens's own answer to whether the material already shows it met; 6 Each lens against itself, verbatim; 7 Unique findings; 8 What nobody checked; 9 Questions between lenses, verbatim; 10 Handoff briefs, verbatim.

The synthesis agent is neutral and holds no lens. It never averages positions or picks a winner. It computes `agreementRate` and sets `panelFailedToDisagree` when every lens recommends the same thing and no self-argument is substantive; the header then says the panel should be re-run with a different question or lens set. Above roughly two-thirds agreement the panel is theater (Will's brief); the rate is in the memo so `/ck:report` can track it later.

**Failure handling.** A lens stopped or dead on an API error returns `null` [D]; the script logs which lens is missing and synthesizes on the survivors; the memo header says so. Every lens failing throws; nothing is written. Synthesis returning `null` returns the raw lens results with `memoPath: null`; `panel/*.json` is on disk.

**Cost.** About $0.80 per run, dominated by the Fable lens (Appendix I).

**Acceptance.**
- [ ] `/ck:panel <question>` in a session with the plugin enabled shows the consent prompt with the option "don't ask again for `ck:panel`" [D]; after consent it runs in the background and `/workflows` shows phases Lenses and Synthesis.
- [ ] `<runDir>/panel/river.json`, `toni.json`, `kai.json` exist and validate against the lens schema; the memo exists at `docs/decisions/` with the ten sections.
- [ ] `/workflows` shows three different models on the three lens agents: Fable 5.1, Opus 5, Sonnet 5.
- [ ] Each lens's `evidenceRead` lists different files when the default `reads` exist.
- [ ] With `rationalePath` given, each lens reports `viewChangedByRationale` as `yes` or `no`, never `not-read`.
- [ ] Stopping one lens in `/workflows` produces a memo whose header names the missing lens.
- [ ] `--lenses` with a replaced persona and model is honored (visible in `/workflows` and in the memo's table).
- [ ] A deliberately one-sided question ("Should we keep the tests passing?") yields `panelFailedToDisagree: true` and an `agreementRate` of 1.
- [ ] The script passes §9 test 9.

### 6.12 `/ck:next`

A skill (`skills/next/SKILL.md`, Appendix F). It looks at which documents in §6.1 exist and at the latest `run.json`, and says one thing in plain words:

| State | It says |
|---|---|
| Nothing in `docs/` | "Start with `/ck:opportunity` and describe your idea in a sentence. It writes `docs/opportunity.md`: what the product is, who it is for, what the market looks like, and whether it is worth doing." |
| Opportunity, nothing else | "Run `/ck:market-research` to go deeper on the market, or `/ck:brief` if the opportunity is enough to start from." |
| Brief, no team | "Run `/ck:team`. It decides who is on this product and who owns what, and writes `docs/TEAM.md`." |
| Brief and team, no PRD | "Run `/ck:prd`. It turns the brief into full requirements and takes a few minutes." |
| A document waiting for review (`run.json` says `review`) | "Your [document] is waiting for your review. Open the review page or `docs/<file>`, then say done or run the command again." |
| A stopped stage | "Your [document] stopped partway. Everything so far is in `docs/<file>`. Run the command again to continue." |
| PRD, no roadmap | "Run `/ck:roadmap`. It orders the work and writes `ROADMAP.md`." |
| Roadmap, no architecture | "Run `/ck:architecture`. It recommends how to build it and writes `docs/ARCHITECTURE.md`." |
| Architecture, no brand guide | "Run `/ck:brand-guide`. It takes two rounds of your review and writes the brand guide and assets." |
| Everything above | "The definition is complete. Run `/ck:design <feature>` for any feature in the PRD, or `/ck:panel <question>` for a decision. Building features is the next release of ck." |

No token counts, no more than one action. It runs in the main session with no agents.

---

## 7. Document contracts

One skill per document type, `skills/<document>-artifact/SKILL.md`, not user-invocable. Each carries: the section order with headings verbatim; what each section must contain; a numbered checklist the validator can check by reading; the file path; and the writing rule (plain technical English, one instruction per sentence, no em-dashes in prose). Claude also loads a contract on its own when asked to write that document type outside a workflow (the description says so), which is the proposal's consistency mechanism (§3.4) reaching the plain session too. This is the layer that answers Clare's failure mode (§2.2): the same document has the same shape whoever writes it and however it was started.

The two contracts that phase one's first drills exercise most, the brief and the PRD, are written in full in Appendix G. The others are specified here to the section and checklist level.

### 7.1 Opportunity analysis (`docs/opportunity.md`)

Modelled on the NIGHTGRID opportunity analysis. Sections: Executive summary (verdict in one paragraph: worth doing, worth doing smaller, or not now, with the one number that decides it); Concept statement (what it is, for whom, in two sentences); Problem and root-cause chain; Market context (size, trends, comparable products, each claim sourced); one section per contributing lens, in the order the frame chose them, each headed `## <Lens>: <title>` (for example `## Game design: core loops`, `## Marketing: positioning and go-to-market`, `## Architecture: technical shape`); Stage gates (what must be true to proceed at each stage, and the kill condition at each); Monetization and business model; Risks (each with a mitigation or an explicit acceptance); Open questions; Sources.

Checklist: every section present in order; the verdict names a number; every market claim has a source in Sources; every contributing lens has a section and every section was written by the lens the frame chose (checked from `sections/`); at least three stage gates each with a kill condition; risks carry mitigations; open questions present even when empty.

### 7.2 Market research (`docs/market-research.md`)

Sections: Summary (five findings that change a decision); Market size and trends; Competitors and substitutes (table: name, what it does, who it serves, price or model, strength, gap); Customers, segments, and channels; Pricing and business models; Constraints (platform, legal, regulatory); Contradictions and unknowns (claims the researchers disagreed on, with both sources; what could not be found); Implications for positioning; Sources (numbered; URL, title, date accessed).

Checklist: every body claim carries a source number that exists in Sources; the competitors table has at least three rows; Contradictions and unknowns is present even when empty; no source is older than 18 months unless marked as historical; Summary has exactly five findings.

### 7.3 Brief (`docs/brief.md`)

Sections: Idea; Problem and root-cause chain; User; Success metric and leading indicator; Comparable products (three to five, each with what it does, price or model, and the gap, one source each, attributed to the market pass; cites `docs/market-research.md` when it exists); Scope (the smaller first version, what it leaves out, whether it would still move the number, River's recommendation, the decision marked open unless made); Non-goals; Open questions for the author. Checklist A1 to A8 in Appendix G.

### 7.4 PRD (`docs/PRD.md`)

Sections: Summary; Problem; User; Success metric and leading indicator; Scope; Non-goals; Requirements (numbered, each with acceptance criteria); Sequencing and dependencies; Assumptions; Risks; Open questions; Appendix A Challenged claims; Appendix B Premortem. Claim tags `[C<n>]`. Checklist B1 to B10 in Appendix G.

### 7.5 Team, roles and responsibilities (`docs/TEAM.md`)

Sections: Cast (table: persona, role, tier, why on this product); Roles and responsibilities (matrix: one row per pipeline document and stage, and per PRD requirement area when a PRD exists; columns owner, contributors, reviewers); Hand-off order (who hands to whom, and what the hand-off carries, in the pipeline's order); Needs (per persona: what it needs from whom before it can start); Missing seats (needs no persona covers, what a person in that seat would own, and the recommendation: recruit, cover from an existing seat, or accept the gap); Declined nominations (persona, responsibility, reason, replacement).

Checklist: every pipeline document in §6.1 has exactly one owner; every persona in Cast appears in the matrix at least once; every persona in the matrix is in Cast; Missing seats is present even when empty; every declined nomination has a replacement or an explicit gap.

### 7.6 Roadmap (`ROADMAP.md`)

The roadmap skill's structure verbatim [R]: Section 1, Current Roadmap (Current State Snapshot; Opportunities, prioritized in Tier 1 Ship Next, Tier 2 High Value, Tier 3 Strategic, each tier its own table with the skill's columns; Recommended Sequencing; Open Questions; OKR table); Section 2, Revision History, with the skill's entry format (What Changed; Why; Open Questions Resolved / Added; Change Types; Triggered By).

Checklist: the roadmap skill's lint check passes; every Tier 1 row names a success signal and traces to a PRD requirement; the newest revision-history entry is dated with the run's timestamp; the OKR table has at least one key result with a target.

### 7.7 Architecture (`docs/ARCHITECTURE.md`)

Sections: Context and constraints (from the PRD and roadmap: what is fixed); Quality attributes (ranked; the top three named with the reason); Recommended architecture (one paragraph and a Mermaid diagram); Components (table: component, responsibility, owner persona from `docs/TEAM.md` when it exists); Data model sketch; Integration points and external dependencies; Alternatives considered (table: alternative, what it would gain, why not); Decision record (date, decision, deciders, consequences); Sequencing against the roadmap (which components each Tier 1 item needs); Risks; Open questions; Appendix A Challenged claims; Appendix B Premortem. Claim tags `[C<n>]` for every claim not from the PRD.

Checklist: every section present in order; the diagram renders; the alternatives table has at least two rows; every Tier 1 roadmap item appears in Sequencing; every component has a responsibility; the decision record has a date; every tag appears in Appendix A or is marked unchallenged.

### 7.8 Brand direction record and brand guide

**Brand direction record** (`docs/decisions/<timestamp>-brand-direction.md`), modelled on the NIGHTGRID record: Decision (the chosen direction by label and name; the rejected finalists with the reason each); Locked layout system (grid, spacing, radii, elevation); House tokens (background, ink, accents, functional colors, each with its value and its role); Theme lineup (variants of the skin, if any, and when each is used); Rationale (why this direction serves the positioning line); Open items; Asset list (every file under `brand/final/` with its purpose).

**Brand guide** (`docs/brand-guide.md`), modelled on the d20Mob brand identity guide: Brand overview and personality (the positioning line; personality in three to five words with what each rules out); Brand architecture (product, publisher, sub-brands, how they relate); Logo system (primary mark, secondary mark, lockups, color variants, clear space, minimum size, misuse); Color system (the tokens, with contrast ratios for text pairs; functional colors; product-specific color classes when the product has them, such as class or faction colors); Typography (families, scale, weights, usage per role); UI surface system (cards, panels, buttons, states, in the skin); Art direction (illustration style, imagery rules, iconography) and asset list; Product-specific sections when applicable (map overlay, in-game HUD, print); App icon; Publisher credit and legal (credit line, trademark and copyright notices).

Checklist (guide): every section present in order; every color token in Color system exists in `brand/final/tokens.json` with the same value; every text-on-background pair states its contrast ratio and meets 4.5:1 or is marked decorative; every asset named exists under `brand/final/`; the logo section shows at least one misuse example; the personality words match the direction record.

### 7.9 Gallery (`brand/*/gallery.html`, `docs/design/<feature>/gallery.html`)

One page shape for brand galleries and design galleries, so the review is the same every time. The page: a banner with the product name, what is being reviewed, the round, and the five comment steps from §4.9; a variant strip with labels (A, B, C, ...) that scrolls to each variant; per variant, in order: the label and name; the rendering (marks and palette swatches for brand; device frames with the screens and their states for design); the rationale (why this, in three sentences); the trade-off (what it gives up); what it satisfies (the requirement or the positioning line); for design, the states row (empty, loading, error). All assets inline (SVG, data URIs); the page is self-contained and under 16 MB; Code Katz house tokens for the chrome, the variant's own tokens inside its frame; light and dark.

Checklist: labels are consecutive letters from A; every variant has all five parts (rendering, rationale, trade-off, satisfies, states where applicable); no external asset references; file size under 16 MB; the banner carries the five steps.

### 7.10 Design spec (`docs/design/<feature>/spec.md`)

Sections: Feature (name, PRD requirement numbers, the user, the success metric it serves); Chosen variant (label, one paragraph on why, from the review); Screens (one subsection per screen: purpose, layout, components, copy); Components (table: component, brand token or surface it uses, states); Interactions (trigger, response, transition); States (empty, loading, error, success, per screen); Copy (every string, with its screen); Accessibility (focus order, contrast, labels, motion); Requirement traceability (table: acceptance criterion, screen, how it is satisfied); Acceptance (Robin's checks: one per screen, each a statement a tester could verify).

Checklist: every section present in order; every acceptance criterion of the requirement appears in the traceability table; every screen in Screens has a row in States and at least one check in Acceptance; every component names a token or surface from the brand guide, or "neutral" when there is no guide; no em-dashes in prose.

### 7.11 Decision memo (`docs/decisions/<timestamp>-<slug>.md`)

The ten sections in §6.11, in order. Checklist: the header names every lens, its model, what it read, and any lens that did not answer; every kill condition is quoted verbatim with its met/not-met/unknown answer; the Disagreement section takes no side; `agreementRate` and `panelFailedToDisagree` are stated.

---

## 8. Repository, packaging, release

### 8.0 Phase 0: spikes before the build

Each is a one-session experiment with a yes-or-no answer recorded in `tests/drill/`. The first pass ran on 2026-09-09 in the cloud session, with a throwaway plugin loaded through `--plugin-dir` into a nested Claude Code; the record, the plugin, and the two remaining local checks are in [`plans/2026-09-09-ck-phase-0-spikes.md`](2026-09-09-ck-phase-0-spikes.md).

| # | Spike | Why it gates the build | Answer today |
|---|---|---|---|
| S1 | Install from the marketplace on a second machine (Clare's); `/ck:next` runs | Distribution is the whole point | **Yes by `--plugin-dir`** on the cloud machine and on Will's MacBook Air (2026-09-09). The marketplace form waits for the real plugin |
| S2 | Inside a workflow, `agentType: 'ck:river'` runs on the model in its frontmatter, and `model:` on the call overrides it | The tier table and the panel's decorrelation both depend on it | **Yes** (2026-09-09): River ran on Haiku from its frontmatter, Toni on Opus 5 from the override, the neutral agent on the session model; per-agent transcripts in the drill log |
| S3 | A nested workflow: does it run, and is its consent a separate prompt or covered by "don't ask again" | Friction on every `/ck:prd` and `/ck:architecture` run | **Half answered** (2026-09-09): nesting works by name, `workflow('ck:panel', args)`; nesting by script path is refused when the plugin is outside the working directory. In auto mode, the default permission mode, there is no consent prompt at all: three interactive runs on Will's machine each showed "Allowed by auto mode classifier" (2026-09-09). A manual-mode session's prompt count is unrecorded and matters only to users who turn auto mode off |
| S4 | The `SubagentStart` hook's stdin carries `agent_type` and `session_id`, and `CLAUDE_PLUGIN_DATA` is writable | The usage log, so G7 | **Yes** (2026-09-09): both fields present, plus `agent_id` and `cwd`; `usage.jsonl` written under the plugin data directory; fires inside workflows too |
| S5 | The publishing tool for review pages is available in local Claude Code (desktop app and CLI), and a skill can read the page's comments there | Every gate in §4.2 | **Yes with conditions** (2026-09-09, from the docs): CLI 2.1.183 or later or the desktop app, signed in, paid plan; comments need 2.1.221 or later and a Team or Enterprise organization. Observed: Will, on a Claude Max plan, comments on his own private review pages, so the owner of a page can comment on Max; the Team or Enterprise condition is for sharing with others. Clare's version is the remaining check |
| S6 | Can `PreModelSwitch` interrupt a workflow to arbitrate a model change | The Opus PRD's escalation design | **Answered: no.** Workflows accept no mid-run input and the hook fires on a requested session switch only [D] |
| S7 | Web search is available to a subagent running inside a workflow, with `agentType` set and without | `market-research`, the brief's market pass, and the opportunity's sourced sections | **Yes** (2026-09-09): the neutral agent ran one `WebSearch` inside the nested workflow and returned a URL; the persona agents had the tool available. Confirmed on Will's machine too |
| S8 | On Will's and Clare's machines, how many agents run concurrently (min(16, CPUs minus 2) [D]); does an eleven-agent `team` run finish in one sitting | Sizing of every fan-out | **Will's: 10 CPUs, 8 agents at a time**, so `team` runs in two rounds (2026-09-09). Clare's is open. The cloud spike machine has 4 CPUs, 2 at a time; the three-agent spike took 7 seconds there and 19 to 26 seconds on Will's laptop |

### 8.1 Repository and layout

New repository `code-katz/ck`, one plugin per repo like the seven marketplace entries today [R]. Its first commit imports `profiles/` and `tiers.conf` (§5.1); from the second commit on, the repository has no relationship to any other.

```
ck/
├── .claude-plugin/plugin.json
├── README.md  DEVLOG.md  ROADMAP.md  LICENSE
├── profiles/                     the source of truth for personas (§5.1)
│   ├── <21 personas>.md
│   └── ROSTER.md                 generated
├── tiers.conf                    persona → model (§5.3)
├── agents/<21>.md                generated subagents (§5.2)
├── skills/
│   ├── <21 personas>/SKILL.md    generated switch commands (§5.6)
│   ├── opportunity/SKILL.md      /ck:opportunity (gate owner)
│   ├── prd/SKILL.md              /ck:prd (Appendix E)
│   ├── architecture/SKILL.md     /ck:architecture
│   ├── brand-guide/SKILL.md      /ck:brand-guide (two gates)
│   ├── design/SKILL.md           /ck:design (one gate)
│   ├── next/SKILL.md             /ck:next (Appendix F)
│   ├── review-page/SKILL.md      how every gate publishes, waits, applies, republishes, resolves (§4.9)
│   ├── roster/SKILL.md           generated; the roster a workflow agent loads by name
│   └── <10 contracts>-artifact/SKILL.md   (§7; brief and PRD in Appendix G)
├── workflows/
│   ├── panel.js                  Appendix A
│   ├── draft.js                  Appendix B (PRD and architecture)
│   ├── brief.js                  Appendix C
│   ├── team.js                   Appendix D
│   ├── opportunity-draft.js      §6.2
│   ├── market-research.js        §6.3
│   ├── roadmap.js                §6.7
│   ├── brand.js                  §6.9
│   └── design-round.js           §6.10
├── hooks/hooks.json              §5.5
├── scripts/
│   ├── generate.sh               profiles → agents, switch skills, ROSTER.md, the roster skill
│   ├── render-review.py          markdown → the review page, one command (§4.9); standard library only
│   ├── usage-log.sh
│   └── check-prereqs.sh
└── tests/
    ├── run.sh
    ├── drill/                    Phase 0 answers and drill logs, dated
    └── fixtures/                 two tiny projects: a game idea and a data-product idea, each with a one-line idea, a seeded brief, and a three-requirement PRD
```

`skills/review-page/SKILL.md` is the one place the gate mechanics are written: publish with the banner and the five steps, wait for "done", read every thread, apply, republish the same URL, resolve with one line, report unresolvable threads in chat, and the file-edit fallback. Every gate-owning skill says "review per `${CLAUDE_PLUGIN_ROOT}/skills/review-page/SKILL.md`" rather than restating it, so a change to how reviews work is one edit.

A project that uses the plugin gains the documents in §4.3 (committed) and `.ck/runs/` (a cache, locally excluded).

### 8.2 Manifest

```json
{
  "name": "ck",
  "description": "Code Katz personas and workflows for Claude Code: the product-definition pipeline (/ck:opportunity, market-research, brief, prd, team, roadmap, architecture, brand-guide, design), /ck:panel (three lenses on three models), /ck:next, and 21 personas as ck:<name> subagents and /ck:<name> switch commands.",
  "version": "0.1.0",
  "author": { "name": "Code Katz" }
}
```

`version` pins the plugin: users receive a new copy only when the string changes [D]. Every release bumps it.

### 8.3 Marketplace entry

Appended to `claude-plugins/.claude-plugin/marketplace.json` (bumping its `metadata.version` to 1.4.0):

```json
{
  "name": "ck",
  "source": { "source": "github", "repo": "code-katz/ck" },
  "description": "Code Katz personas and workflows: the product-definition pipeline from idea to designed feature, /ck:panel (three lenses on three models), /ck:next, and 21 personas as subagents and switch commands. Phase one of the code-katz plugin.",
  "category": "workflow",
  "keywords": ["workflows", "personas", "prd", "brief", "panel", "brand", "design", "subagents"]
}
```

Install: `/plugin marketplace add code-katz/claude-plugins` then `/plugin install ck@code-katz`. For development: `claude --plugin-dir /path/to/ck`, then `/reload-skills` after editing a workflow [D].

### 8.4 Prerequisites

| Prerequisite | Why | Grade |
|---|---|---|
| The old team tool is uninstalled | Its persona commands, subagents, `CLAUDE.md` block, and `SessionStart` hook collide with `ck`'s. The README carries the steps: remove `~/.local/bin/claude-team`, `~/.claude/team/`, the `~/.claude/commands/<persona>.md` and `~/.claude/agents/<persona>.md` files it installed, its marked block in `~/.claude/CLAUDE.md`, and its `SessionStart` entry in `~/.claude/settings.json`. `scripts/check-prereqs.sh` warns while any remain (§5.5) | [W, 2026-09-08] |
| A paid Claude Code plan with dynamic workflows available; on Pro, enabled in `/config` | Workflows are the orchestrator | [D] |
| Workflows not disabled by the organization (`disableWorkflows`) | Same | [D] |
| Web search available to subagents | `market-research`, the brief's market pass, the opportunity's sourced sections | Spike S7 |
| Review pages: Claude Code CLI 2.1.183 or later or the desktop app, signed in, on a paid plan; comments need 2.1.221 or later and a Team or Enterprise organization | Every gate; the file-edit path always works | [D], S5 |
| Node 20+ on the developer's machine, for the script check in the tests only | The plugin itself needs no Node at run time | [P] |
| `jq` optional, for the usage log; the script falls back to appending the raw line | Family convention: jq is optional | [R] |

### 8.5 Version and update policy

- `0.1.0` is the phase-one release. `0.x` until the 90-day review.
- A change to any file under `profiles/`, `agents/`, `skills/`, `workflows/`, `tiers.conf`, or `hooks/` bumps the patch or minor version in the same commit.
- `scripts/generate.sh` refuses to run if the working tree is dirty outside the generated paths, and prints the diff of the generated files so the reviewer sees what changed in persona text.

---

## 9. Tests

`tests/run.sh`, bash, `set -uo pipefail`, `ok`/`fail` helpers and a `mktemp` scratch tree, in the family's style [R].

| # | Test | Type |
|---|---|---|
| 1 | `plugin.json` parses; `name` is `ck`; `version` matches a semver | static |
| 2 | Regenerate `agents/`, the 21 switch skills, and `ROSTER.md` from `profiles/` into scratch; `diff -q` each against the committed copy; fail listing stale names | drift |
| 3 | Agent count, switch-skill count, and `ROSTER.md` row count each equal the profile count | drift |
| 4 | Per agent: `model:` equals the `tiers.conf` line; `name:` equals the filename, no colon; `## Handoff Brief` present; `## Greeting` absent; the §5.4 preamble sentence present; no `effort:` line. Per switch skill: `## Required Interactive Behaviors` and `## Greeting` present verbatim; the prepended sentence present | drift |
| 5 | `tiers.conf` has exactly 21 lines, each `<name> <model>`, every name has a profile, every model is one of the three tier IDs; six Fable, eleven Opus, four Sonnet | tiers |
| 6 | `skills/prd/SKILL.md` and `skills/river/SKILL.md` contain the three `### N. <name>` headings from `profiles/river.md` | contract |
| 7 | For every contract skill, the section list in the contract equals the section list in the Draft prompt of the workflow that writes it (parsed from the `sections` constant each script declares) | contract |
| 8 | Every gate-owning skill references `skills/review-page/SKILL.md` and none restates the five steps | contract |
| 9 | Every `workflows/*.js`: `node --check` passes on a copy with `export` stripped and the body wrapped in `(async () => { ... })()`, because workflow scripts use top-level `return` and `await`, which a bare module rejects; first statement is `export const meta`; `meta` has `name`, `description`, `phases`, `personas`; every name in `personas` has a profile; grep for `Date.now|Math.random|new Date\(\)|require\(|import\(` is empty | lint |
| 10 | `hooks/hooks.json` parses; the `SubagentStart` matcher is `^ck:`; `usage-log.sh` given a fixture stdin appends one valid JSON line and exits 0, and exits 0 on garbage input; `check-prereqs.sh` with a fake `~/.claude/team/` prints the warning and exits 0, and prints nothing without it | hook |
| 11 | `skills/next/SKILL.md` and every gate-owning skill contain no token counts in user-facing text and no more than one imperative per closing message (grep for `token` outside code fences; a hand-checked list of closing messages) | house style |
| 12 | Phase 0 answers recorded under `tests/drill/` for S1 to S8 before the release is tagged | phase 0 |
| 13 | End-to-end drill, by hand, on both fixture projects and then on one real project: the full J1 order (§6.1), then `/ck:design` on one requirement, then `/ck:panel`; a stop during a Panel phase followed by a resume. Record the consent prompts, the files under `docs/`, `brand/`, and `.ck/runs/<id>/`, the models shown in `/workflows`, and every message the skills printed. The drill log is committed under `tests/drill/<date>.md` | e2e |
| 14 | The J1 and J2 drills: Clare runs them on a fresh project from the README alone; every message she sees is checked against §4.8's three rules; the number of sessions and hand-offs J2 took is recorded against G5 | user |
| 15 | Consistency: two projects' documents of each type have identical heading lists (G1) | contract |

`claude plugin eval` is early access and not enabled today; when it is, the drills become an eval suite and tests 13 to 15 stop being manual.

---

## 10. Phasing and open questions

### 10.1 Phase one: this document

The plugin skeleton; 21 personas as subagents and switch commands on three tiers; the nine pipeline commands; `/ck:panel`; `/ck:next`; ten contracts; two hooks; the test suite; the marketplace entry. Done when J1 and J2 run end to end on a real project (§2.3) and Phase 0 has answers for S1 to S8.

### 10.2 Phase two: building, scheduling, and seeing

| Item | What it is | Why not phase one | Trigger to start |
|---|---|---|---|
| `/ck:feature` | The build workflow. One feature from the PRD to merged code and content: plan the slices (River and Akira), a design gate on `/ck:design`'s output, parallel implementation in git worktrees (Sasha, Akira, Alex on their tiers, one slice each), cross-model verification (a lens that did not write the code reviews it), merge, and content (Toni's release note or store copy). It is the one workflow where the proposal's parallel-build research binds, and the successor to running several terminal sessions by hand | It consumes the definition pipeline's documents (PRD, architecture, design spec, brand) as inputs, so it has nothing to build from until phase one has run on a real product. Two scope options are open (proposal §8.6): full end-to-end including marketing copy, or code-only with content as a separate workflow. Placement confirmed by Will on 2026-09-09: phase two | Phase one has produced a PRD, an architecture, and one design spec on a real product |
| `/ck:bugfix` | Reproduce, fix in a worktree, cross-model verify, merge | Needs `/ck:feature`'s worktree and verification stages | `/ck:feature` ships |
| `/ck:gtm` | Toni's go-to-market plan from the opportunity, market research, and brand | Phase one's Toni contributions (opportunity, market research, brief) are its inputs | Phase one |
| Routines | Scheduled runs of headless workflows; `market-research` first (weekly, on a focus) | No headless workflow the user wants scheduled yet | `market-research` has run by hand three times |
| `/ck:map` | A Mermaid catalog from `meta.phases`, `meta.personas`, and agent frontmatter; `--run <id>` draws the per-run lens graph from `panel/*.json` | The catalog is small enough to read from files in phase one | Phase one; also feeds the Workbench |
| `/ck:report` | Spend, runs, and persona usage from `usage.jsonl` and the session JSONL, using conductor's fixture-fenced cost parser and `pricing.json` [R] | No data yet | Thirty days of usage log |
| `/ck:review` | A six-reviewer document review with adversarial refuters and a verify cap (designed during this PRD's first review; a different product from the three-lens panel) | The panel is the decision primitive the proposal asks for; a review workflow is a second one | The panel proves too narrow for code or plan reviews |
| Hook-enforced document gates (`SubagentStop`, exit 2) | Feedback path undocumented; plugin agents ignore per-agent hooks [D]; the validator agent covers the shape check | More than one draft in five passes the validator and still fails the review on structure |
| Model fallback chain | `PreModelSwitch` does not cover it [D]; null-tolerant scripts cover phase one | More than one run in ten loses a lens to an API error |
| Persona scopes: core, project cast, personal (Opus PRD §7.7) | The shape of the 90-day prune; casts stay generated from `profiles/`, never hand-copied | The 90-day review |
| Advisor tool | API-only and experimental [V] | Available inside Claude Code |
| Folding in `devlog`, `roadmap`, `plans`, `todo`, `publish` as contracts | Their repos work as they are; `roadmap-artifact` already mirrors the roadmap skill's format so the two stay interchangeable | A second `ck` workflow needs one of them as a contract |
| A `bin/` CLI | Nothing needs one | A workflow needs a helper the Bash tool should call |

### 10.3 Phase three: the Workbench

Committed [W, 2026-09-08]. A rewrite that replaces the conductor dashboard, not an extension of it. What is known today:

| Part | Scope |
|---|---|
| Shape | Local server and browser (the shape conductor settled on; Tauri dropped [R]); Python, by Will's preference; reads the `ck` source checkout, `${CLAUDE_PLUGIN_DATA}/usage.jsonl`, and the session JSONL through conductor's fixture-fenced cost parser and `pricing.json` |
| Views | The catalog: workflows, their phases, the personas each phase uses, the tier and model of each (from `meta` and frontmatter, as `/ck:map` draws it); run history with cost per run and per persona; persona usage over time (the 90-day prune's evidence); the per-run interaction graph for panels |
| Editors | Persona: edit a profile, see the regenerated agent and switch skill, run the tests, commit. Workflow: v2, after the persona editor has been used; a workflow is a script, and a form over a script is the trap the proposal's §9 named |
| Never | A hosted service; its own store of personas or workflows; a live-activity view that duplicates `/workflows` |
| Its PRD | Written after phase one has run on a real product, because the catalog and run data it displays do not exist yet. The five Opus workbench concepts (`plans/opus/2026-09-05-workbench-concepts.html`) are its starting inputs, with the verdicts in the panel memo §7 |

### 10.4 Open questions

For Will (answered):

1. **`/ck:feature` in phase one? Answered: no.** Will confirmed on 2026-09-09 that it stays in phase two, because it consumes phase one's documents and would double the build. When its turn comes it is added as a §6 subsection with the worktree stages, and Phase 0 of that release gains a spike on `isolation: 'worktree'` for persona agents.
2. Proposal §8.7, verbatim: "Routines integration. Which workflows, if any, should run scheduled or on GitHub events?" `market-research` is the proposed first.

Added after drill 6 (2026-10-01):

9. **Which tier for River's rewrite and finalize stages? Answered: Fable** (Will, 2026-10-01). They stay on River's tier. In Will's words, a more costly PRD is fine because it is the most important step of a product kickoff; about $8 per PRD is the accepted cost, and the remaining levers are turn counts, not models (`tests/drill/2026-10-01.md` in `ck`).
10. The panel inside `/ck:prd` has returned yes-if from every lens on three runs. Reword its question to force a stance before any other panel change.

Harness unknowns the drill answers:

3. **Answered yes** (2026-09-09): the Workflow tool ran `name: "ck:draft-spike"` on the first attempt. `name` is the specified form; a `scriptPath` outside the working directory is refused.
4. Nested workflows run by name, `workflow('ck:panel', args)` (answered 2026-09-09). Whether the nested call prompts for consent separately on first run, and whether "don't ask again for `ck:panel`" covers it, is Will's local check (S3).
5. **Answered yes** (2026-09-09): both spike workflows carried `personas` in `meta`, loaded, and ran by name.
6. Does `SubagentStop` exit 2 feed stderr back to a workflow agent? Decides the hook-gate item in §10.2.
7. **Answered from the docs** (2026-09-09, S5): yes in the CLI and the desktop app, with the plan and version conditions in §4.9. The file-edit path covers phase one either way.
8. **Answered yes** (2026-09-09, S7) in the cloud environment; re-checked on Clare's machine in the local pass. Without it, `market-research` and the market passes run on what is in the repository and say so.

---

## 11. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Workflows unavailable (plan, `/config`, or org `disableWorkflows`) | Low for Will and Clare; real for other users | The plugin is inert | README states the prerequisite; every skill checks for the Workflow tool before anything else and stops with a plain reason |
| Web search unavailable to subagents inside a workflow (S7) | Low: answered yes in the cloud spike | Market research and market passes run without sources | The document says so in its header; the Sources section lists what was read instead; re-checked on Clare's machine |
| Comments unavailable on Clare's account (S5: comments need Claude Code 2.1.221 or later; a Max owner can comment on her own pages, sharing needs Team or Enterprise) | Low if her Claude Code is current | No comment review; every gate falls back to file edits | Check her version before the build; the file-edit fallback is specified at every gate, and she already reviews by editing files today |
| An API error nulls a lens | Medium | Memo on two lenses | Logged; memo header says so; re-run offered; a lens can be re-modelled per run |
| Fable on the judgment seats dominates cost | Certain | River's stages are the largest line in every pipeline run (Appendix I) | It is the decision Will made (§3.3 item 3); the cost is stated per command; a tier is one line in `tiers.conf` |
| Persona text drifts between `profiles/` and the generated files | Low | A switch command and a subagent disagree | Test 2; the generator refuses a dirty tree |
| 21 personas is 15 too many | Likely (proposal §7) | Maintenance and choice paralysis | Generated, so carrying cost is near zero; `usage.jsonl`; prune at 90 days |
| The 4.7-and-later tokenizer produces about 30% more tokens [D] | Certain | Appendix I underestimates by up to 30% | Stated in Appendix I; `/workflows` shows real token totals |
| Compaction during the optional interview | Medium on long interviews | Lost answers | Append-as-you-go and the resume check (§4.3) |
| Galleries exceed the 16 MB page limit | Low for SVG; real if raster assets creep in | A gallery cannot be published | The gallery contract forbids external and raster assets; the validator checks size |
| Consistency erodes as commands accrete | Medium | Clare's failure mode returns | Every document has a contract and a validator; test 15 compares heading lists across projects; every new command needs a contract before a script |
| Consent prompts on every run annoy | Medium | Friction | "Don't ask again for `ck:<name>`" on the first run of each plugin workflow; allow rules `Workflow(ck:panel)`, `Workflow(ck:draft)`, and so on |
| A nested workflow prompts for consent on every `/ck:prd` run in a session with auto mode off (S3) | Low: auto mode is the default and shows no prompt | Two prompts per run instead of one | "Don't ask again for `ck:panel`" on first use; allow rule `Workflow(ck:panel)` in the README |
| Fan-outs too large for Clare's machine (S8) | Unknown | `team` and `market-research` run in several rounds and take longer | Concurrency is min(16, CPUs minus 2) [D]; both scripts cap their fan-out and the closing message states the elapsed time |

---

## Appendix A. `workflows/panel.js`

```js
export const meta = {
  name: 'panel',
  description: 'Three-lens decision panel: product (river, Fable 5.1), marketing (toni, Opus 5), and UX (kai, Sonnet 5) personas, each on a different model and each reading its own evidence, argue one question; a neutral memo surfaces where they disagree and leaves the decision to the author. Type /ck:panel followed by the question; the text is the only argument needed. A skill may instead pass an object: runId, runDir (absolute cache directory), projectRoot (absolute path of the project repository), pluginRoot, timestamp (UTC, minted by the caller with date -u), question, contextPath (optional), rationalePath (optional; each lens reads it only after forming its view), memoPath (optional; default <projectRoot>/docs/decisions/<timestamp>-panel.md), lenses (optional [{persona, lens, model, reads}]).',
  phases: [
    { title: 'Lenses', detail: 'ck:river, ck:toni, ck:kai in parallel, one model each, each reading its own evidence, each forced to argue against itself' },
    { title: 'Synthesis', detail: 'one neutral agent writes the decision memo: agreement flagged as low-information, disagreement preserved, decision left to the author' },
  ],
  personas: ['river', 'toni', 'kai'],
}

// Direct invocation (/ck:panel <question>) hands the typed text to the script as a string; a skill
// launch passes an object. Both are accepted. Paths default to the project the session is in, and
// without a plugin root the memo contract is loaded by skill name instead of by path.
const a = (args && typeof args === 'object') ? args : { question: typeof args === 'string' ? args.trim() : '' }
if (!a.question) {
  throw new Error('panel: type the question after the command, for example /ck:panel Should the first release include the brand guide step?')
}
const question = a.question
const projectRoot = a.projectRoot || '.'
const runDir = a.runDir || (projectRoot + '/.ck/runs/panel-latest')
const runId = a.runId || 'panel-direct'
const stamp = a.timestamp || 'today (write the date from `date -u`)'
const slugFull = question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const slug = (slugFull.length > 48 ? slugFull.slice(0, 48).replace(/-[^-]*$/, '') : slugFull) || 'panel'
const contextPath = a.contextPath || null
const rationalePath = a.rationalePath || null
const memoPath = a.memoPath || (projectRoot + '/docs/decisions/' + (a.timestamp ? a.timestamp + '-' : '') + slug + '.md')
const memoContract = a.pluginRoot
  ? 'Read ' + a.pluginRoot + '/skills/memo-artifact/SKILL.md (the memo contract).'
  : 'Load the skill ck:memo-artifact with the Skill tool (the memo contract).'
const housekeeping = a.runDir ? '' : 'If ' + projectRoot + '/.git exists, make sure the line ".ck/" is in ' + projectRoot + '/.git/info/exclude (append it if missing). '

// Three lenses, three models, three bodies of evidence. The same model in three
// costumes is one opinion; the same evidence read three times is one reading.
// River and Toni run on their own tiers. Kai is moved down from Opus 5 to
// Sonnet 5 so that three lenses are three models. This is the one script in ck
// allowed to set `model` on a persona agent, and it only ever moves a lens down.
const DEFAULT_LENSES = [
  { persona: 'river', lens: 'product', model: 'claude-fable-5-1', reads: ['docs/PRD.md', 'docs/opportunity.md', 'ROADMAP.md'] },
  { persona: 'toni', lens: 'marketing', model: 'claude-opus-5', reads: ['docs/market-research.md', 'docs/opportunity.md'] },
  { persona: 'kai', lens: 'ux', model: 'claude-sonnet-5', reads: ['brand/', 'docs/design/'] },
]
const lenses = Array.isArray(a.lenses) && a.lenses.length
  ? a.lenses.map((l, i) => {
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
    agreementIsLowInformationBecause: { type: 'string', enum: ['obviously-true', 'shared-blind-spot', 'mixed', 'no-agreement'] },
    disagreementCount: { type: 'number' },
    disagreementTopics: { type: 'array', items: { type: 'string' } },
    killConditionsMet: { type: 'number' },
    panelFailedToDisagree: { type: 'boolean' },
    summary: { type: 'string' },
  },
  required: [
    'memoPath', 'question', 'recommendations', 'agreementRate', 'agreementIsLowInformationBecause',
    'disagreementCount', 'disagreementTopics', 'killConditionsMet', 'panelFailedToDisagree', 'summary',
  ],
}
// The memo is on disk; the return value carries counts and one-line topics, not the memo again.

// ---- Lenses ----
phase('Lenses')
const roster = lenses.map(l => `${l.persona}: ${l.lens}`).join('; ')
const results = (await parallel(lenses.map(l => () => agent(
  `You are ${l.persona}, the ${l.lens} lens on a ${lenses.length}-lens decision panel (${roster}).\n` +
  `The project repository is ${projectRoot}; relative paths below are relative to it. ` + housekeeping + `\n` +
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
  `Length: reasoning at most 200 words; every other text field at most 100 words. Findings, not prose.\n` +
  `Write the same object as JSON to ${runDir}/panel/${l.persona}.json (create the directory if needed), with one ` +
  `Write call, and return it with persona '${l.persona}' and lens '${l.lens}'.`,
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
  `Write the decision memo for a ${lenses.length}-lens panel. Question: ${question}. Run ${runId}, generated ${stamp}.\n` +
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
  `${memoContract} Write ${memoPath} (create the directory if needed) with these sections: ` +
  `1 Question and context (run id, timestamp, lens table with models and evidence read, the limitation, any ` +
  `missing lens); 2 Recommendations (table: lens | persona | model | recommendation | one-line position); ` +
  `3 Agreement, flagged as low-information, with why; 4 Disagreement (every point where two lenses conflict, ` +
  `both positions at full strength, the decision the author must make); 5 Kill conditions, verbatim, each with ` +
  `the lens's own answer to whether the material already shows it met; 6 Each lens against itself, verbatim; ` +
  `7 Unique findings (anything only one lens saw); 8 What nobody checked; 9 Questions between lenses ` +
  `(to -> question, verbatim); 10 Handoff briefs (verbatim, one per lens). Keep the memo under 1,500 words: ` +
  `quote verbatim only what the sections require and summarize the rest; do not restate a lens's reasoning ` +
  `in your own words. Then return only the memo object: memoPath must be '${memoPath}'; disagreementCount ` +
  `and disagreementTopics (one line each) and killConditionsMet are counts of what you wrote; summary is at ` +
  `most 80 words. Do not repeat the memo in the return value. Write the whole file with one Write call; do not build it with piecemeal edits, and do not re-read it after writing. `,
  { label: 'synthesis', phase: 'Synthesis', effort: 'medium', schema: MEMO_SCHEMA },
)

if (!memo) {
  log('panel: synthesis returned nothing; returning raw lens results')
  const recs = results.map(r => r.recommendation)
  const top = recs.sort((a, b) => recs.filter(x => x === b).length - recs.filter(x => x === a).length)[0]
  return {
    runId, question, memoPath: null, lenses: lenses.map(l => l.persona), missing,
    recommendations: results.map(r => ({ persona: r.persona, lens: r.lens, model: modelOf(r.persona), recommendation: r.recommendation })),
    agreementRate: recs.filter(x => x === top).length / recs.length,
    agreementIsLowInformationBecause: 'no-agreement', disagreementCount: 0, disagreementTopics: [],
    killConditionsMet: results.filter(r => r.killConditionMet === 'yes').length, panelFailedToDisagree: false,
    summary: 'synthesis agent returned nothing; see panel/*.json',
  }
}
if (memo.panelFailedToDisagree) log('panel: the panel failed to disagree; re-run with a different question or lens set')
log(`panel: agreement rate ${memo.agreementRate}; ${memo.disagreementCount} disagreement(s); ${memo.killConditionsMet} kill condition(s) already met`)
return { runId, ...memo, lenses: lenses.map(l => l.persona), missing }
```

## Appendix B. `workflows/draft.js`

One drafting engine for the PRD and the architecture document (§4.1). The skill passes `args.artifact`; everything that differs between the two lives in the `ARTIFACTS` table.

```js
export const meta = {
  name: 'draft',
  description: "One author drafts a document to its contract, a checker validates it, the three-lens panel challenges it (forming its view before reading the rationale), and the author rewrites it with a Challenged claims appendix and a premortem. Serves the PRD (river; lenses river, toni, kai) and the architecture document (akira; lenses morgan, alex, jordan). Normally launched by /ck:prd or /ck:architecture with an object: artifact ('prd' | 'architecture'), runId, runDir (absolute cache directory), projectRoot (absolute path of the project repository), pluginRoot, timestamp, inputs (absolute paths of the documents to read; the skill lists the ones that exist), outputPath (optional; default from the artifact table), startAt (optional: draft | validate | panel | synthesize; earlier stages are skipped and the document on disk is used), lenses (optional). A direct /ck:draft prd works too, with everything defaulted to the current project.",
  phases: [
    { title: 'Draft', detail: 'the author writes the document from its inputs to the contract; every claim not from the inputs tagged [C<n>]' },
    { title: 'Validate', detail: 'one neutral Haiku agent checks the contract checklist; the author revises at most twice' },
    { title: 'Panel', detail: 'nested /ck:panel on the draft, three lenses on three models, each reading its own evidence' },
    { title: 'Synthesize', detail: 'the author rewrites the document: revised body, Appendix A Challenged claims, Appendix B Premortem' },
  ],
  personas: ['river', 'toni', 'kai', 'akira', 'morgan', 'alex', 'jordan'],
}

const ARTIFACTS = {
  prd: {
    author: 'river',
    path: 'docs/PRD.md',
    contract: 'skills/prd-artifact/SKILL.md',
    rationale: 'docs/brief.md',
    sections: ['Summary', 'Problem', 'User', 'Success metric and leading indicator', 'Scope', 'Non-goals', 'Requirements', 'Sequencing and dependencies', 'Assumptions', 'Risks', 'Open questions', 'Appendix A. Challenged claims', 'Appendix B. Premortem'],
    question: "Is this PRD ready for the author's review, and what would you change before it ships?",
    premortem: 'this shipped on time and did not move the success metric',
    memoSlug: 'prd-review',
    maxWords: 3000,
    lenses: [
      { persona: 'river', lens: 'product', model: 'claude-fable-5-1', reads: ['docs/brief.md', 'docs/opportunity.md', 'ROADMAP.md'] },
      { persona: 'toni', lens: 'marketing', model: 'claude-opus-5', reads: ['docs/market-research.md', 'docs/opportunity.md'] },
      { persona: 'kai', lens: 'ux', model: 'claude-sonnet-5', reads: ['brand/', 'docs/design/'] },
    ],
  },
  architecture: {
    author: 'akira',
    path: 'docs/ARCHITECTURE.md',
    contract: 'skills/architecture-artifact/SKILL.md',
    rationale: 'docs/PRD.md',
    sections: ['Context and constraints', 'Quality attributes', 'Recommended architecture', 'Components', 'Data model sketch', 'Integration points and external dependencies', 'Alternatives considered', 'Decision record', 'Sequencing against the roadmap', 'Risks', 'Open questions', 'Appendix A. Challenged claims', 'Appendix B. Premortem'],
    question: 'Would you build it this way, and what would you change before the first line of code?',
    premortem: 'this shipped and fell over in production in its first month',
    memoSlug: 'architecture-review',
    maxWords: 3000,
    lenses: [
      { persona: 'morgan', lens: 'security', model: 'claude-fable-5-1', reads: ['docs/PRD.md', 'SECURITY.md'] },
      { persona: 'alex', lens: 'platform', model: 'claude-sonnet-5', reads: ['infra/', 'Dockerfile', '.github/workflows/'] },
      { persona: 'jordan', lens: 'data', model: 'claude-opus-5', reads: ['docs/market-research.md', 'data/', 'schema/'] },
    ],
  },
}

// Launched by /ck:prd and /ck:architecture with an object. A direct /ck:draft prd or
// /ck:draft architecture also works: the text names the artifact and everything else defaults.
const a = (args && typeof args === 'object') ? args : { artifact: (typeof args === 'string' && args.trim()) ? args.trim().split(/\s+/)[0] : 'prd' }
if (!a.artifact || !ARTIFACTS[a.artifact]) {
  throw new Error('draft: the artifact must be one of ' + Object.keys(ARTIFACTS).join(', '))
}
const A = ARTIFACTS[a.artifact]
const projectRoot = a.projectRoot || '.'
const runDir = a.runDir || (projectRoot + '/.ck/runs/draft-' + a.artifact + '-latest')
const runId = a.runId || 'draft-' + a.artifact + '-direct'
const stamp = a.timestamp || 'today (write the date from `date -u`)'
const author = 'ck:' + A.author
const outPath = a.outputPath || (projectRoot + '/' + A.path)
const rationalePath = projectRoot + '/' + A.rationale
const contractStep = a.pluginRoot
  ? 'Read ' + a.pluginRoot + '/' + A.contract + ' (the contract).'
  : 'Load the skill ck:' + A.contract.split('/')[1] + ' with the Skill tool (the contract).'
const inputs = Array.isArray(a.inputs) && a.inputs.length ? a.inputs : [rationalePath]
const SECTIONS = A.sections
const MAX_REVISIONS = 2
const VALIDATOR_MODEL = 'claude-haiku-4-5-20251001'

const ORDER = ['draft', 'validate', 'panel', 'synthesize']
const startAt = ORDER.includes(a.startAt) ? a.startAt : 'draft'
const runs = stage => ORDER.indexOf(stage) >= ORDER.indexOf(startAt)
if (startAt !== 'draft') log(`draft: starting at ${startAt}; ${outPath} on disk is the draft`)

const QUESTION = {
  type: 'object',
  properties: { to: { type: 'string' }, question: { type: 'string' } },
  required: ['to', 'question'],
}

const DRAFT_SCHEMA = {
  type: 'object',
  properties: {
    path: { type: 'string' },
    title: { type: 'string' },
    claims: {
      type: 'array',
      items: {
        type: 'object',
        properties: { id: { type: 'string' }, text: { type: 'string' }, section: { type: 'string' } },
        required: ['id', 'text', 'section'],
      },
    },
    assumptions: { type: 'array', items: { type: 'string' } },
    questions: { type: 'array', items: QUESTION },
  },
  required: ['path', 'title', 'claims', 'assumptions', 'questions'],
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

const FINAL_SCHEMA = {
  type: 'object',
  properties: {
    path: { type: 'string' },
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
  required: ['path', 'title', 'challengedClaims', 'premortem', 'openDecisions', 'summary'],
}

// ---- Draft ----
let draft = null
if (runs('draft')) {
  phase('Draft')
  draft = await agent(
    `The project repository is ${projectRoot}. Read these inputs: ${inputs.join(', ')}. They record what the ` +
    `author already decided; do not re-ask any of it.\n` +
    `${contractStep} It gives the section order, required fields, and the checklist your draft will be ` +
    `validated against.\n` +
    `Write ${outPath} to that contract, all sections in this order (create the directory if needed). Write the whole file with one Write call; do not build it with piecemeal edits, and do not re-read it after writing. ` +
    SECTIONS.map(s => '"' + s + '"').join(', ') + `.\n` +
    `Apply your Required Behaviors in subagent form. Leave Appendix B (the premortem) for the pass after the ` +
    `panel, and say so under its heading.\n` +
    `Tag every claim that is not taken directly from the inputs with an inline marker [C1], [C2], ... so the ` +
    `panel can address it, and list those claims with their section. Put anything you would have asked the ` +
    `author under Open questions, with your assumption. Keep the document under ${A.maxWords} words before the appendices.\n` +
    `Return the draft object; path must be '${outPath}'.`,
    { label: `${A.author}:draft`, phase: 'Draft', agentType: author, effort: 'medium', schema: DRAFT_SCHEMA },
  )
  if (!draft) throw new Error(`draft: ${A.author} returned nothing for the draft`)
  log(`draft: ${draft.claims.length} tagged claim(s), ${draft.assumptions.length} assumption(s), ${draft.questions.length} open question(s)`)
}

// ---- Validate ----
let validation = null
if (runs('validate')) {
  phase('Validate')
  for (let round = 1; round <= MAX_REVISIONS + 1; round++) {
    validation = await agent(
      `${contractStep} Read ${outPath}. Check the document against every numbered item in the contract's ` +
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
    log(`validate: ${validation.missing.length} unmet item(s); ${A.author} revises (revision ${round} of ${MAX_REVISIONS})`)
    const revised = await agent(
      `${contractStep} Read the inputs (${inputs.join(', ')}) and ${outPath}. A checker found these unmet ` +
      `checklist items:\n` + validation.missing.map(m => '- ' + m).join('\n') + '\n' +
      `Revise ${outPath} so each item holds. Write the whole file with one Write call; do not build it with piecemeal edits, and do not re-read it after writing. Keep every existing [C<n>] tag and add tags for any new ` +
      `claim not from the inputs. Return the updated draft object; path must be '${outPath}'.`,
      { label: `${A.author}:revise:${round}`, phase: 'Validate', agentType: author, effort: 'medium', schema: DRAFT_SCHEMA },
    )
    if (!revised) { log('validate: revision returned nothing; keeping the previous draft'); break }
    draft = revised
  }
}

// ---- Panel (nested by name; one level only; each lens reads its own evidence and sees the rationale last) ----
let panel = null
if (runs('panel')) {
  phase('Panel')
  const lenses = Array.isArray(a.lenses) && a.lenses.length ? a.lenses : A.lenses
  try {
    panel = await workflow('ck:panel', {
      runId,
      runDir,
      projectRoot,
      pluginRoot: a.pluginRoot,
      timestamp: stamp,
      question: A.question,
      contextPath: outPath,
      rationalePath,
      memoPath: projectRoot + '/docs/decisions/' + stamp + '-' + A.memoSlug + '.md',
      lenses,
    })
  } catch (e) {
    log('panel: failed (' + (e && e.message ? e.message : String(e)) + '); synthesizing without it')
  }
  if (panel) {
    log(`panel: ${panel.lenses.join(', ')}; agreement ${panel.agreementRate}; ${panel.disagreementCount || 0} disagreement(s)` +
      (panel.panelFailedToDisagree ? '; the panel failed to disagree' : '') +
      (panel.missing && panel.missing.length ? `; missing: ${panel.missing.join(', ')}` : ''))
  }
}

// ---- Synthesize ----
phase('Synthesize')
// A resumed run starts here with the panel's files already on disk from the earlier run.
const earlierMemo = projectRoot + '/docs/decisions/' + stamp + '-' + A.memoSlug + '.md'
const panelInputs = panel && panel.memoPath
  ? `${panel.memoPath} and every file under ${runDir}/panel/`
  : (panel
    ? `every file under ${runDir}/panel/ (the memo was not written)`
    : (startAt === 'synthesize'
      ? `${earlierMemo} and every file under ${runDir}/panel/, written by the earlier run of this workflow (if neither exists, say in the document header that the panel did not run)`
      : 'nothing else: the panel did not run, and the document header must say so'))
const final = await agent(
  `${contractStep} Read the inputs (${inputs.join(', ')}), ${outPath}, and ${panelInputs}.\n` +
  `Rewrite ${outPath}: the same sections, in contract order, revised where the panel showed a claim wrong or ` +
  `unsupported, followed by two appendices. Write the whole file with one Write call; do not build it with piecemeal edits, and do not re-read it after writing. \n` +
  `Appendix A, Challenged claims: one row per point a lens raised against a [C<n>] claim or against something ` +
  `untagged: claim | challenged by (persona and lens) | severity (blocking, major, minor: your call from the ` +
  `memo) | status | resolution. Status is upheld (you kept it; say why), revised (you changed it; quote the ` +
  `change), withdrawn, or open (the author must decide). Never delete a challenge. Reproduce the memo's ` +
  `Disagreement section and its Kill conditions verbatim below the table.\n` +
  `Appendix B, Premortem: write the 2-3 sentence scenario in which ${A.premortem}; name the hidden assumption ` +
  `it exposes; add that assumption to the Assumptions section; leave the question "What went wrong?" ` +
  `verbatim for the author. The review asks it.\n` +
  `Keep the document under ${A.maxWords} words before the appendices. Check your own output against the contract's checklist before ` +
  `returning. List every decision you left open under openDecisions. Generated ${stamp}, run ${runId}. Return the object; path must be '${outPath}'.`,
  { label: `${A.author}:synthesize`, phase: 'Synthesize', agentType: author, effort: 'medium', schema: FINAL_SCHEMA },
)
if (!final) throw new Error(`draft: ${A.author} returned nothing for the synthesis; the draft is at ` + outPath)

return {
  runId,
  artifact: a.artifact,
  startedAt: startAt,
  path: final.path,
  memoPath: panel ? panel.memoPath : (startAt === 'synthesize' ? earlierMemo : null),
  lenses: panel ? panel.lenses : [],
  validation,
  challengedClaims: final.challengedClaims,
  premortem: final.premortem,
  openDecisions: final.openDecisions,
  summary: final.summary,
}
```

## Appendix C. `workflows/brief.js`

```js
export const meta = {
  name: 'brief',
  description: 'Toni runs a basic market pass (three to five comparable products, sourced), River writes docs/brief.md from one line of idea text to the brief contract, and a checker validates the shape. Type /ck:brief followed by the idea in a sentence; the text is the only argument needed. A skill may instead pass an object: runId, runDir (absolute cache directory), projectRoot (absolute path of the project repository), pluginRoot, timestamp, idea, opportunityPath (optional; absolute), marketResearchPath (optional; absolute), briefPath (optional; default <projectRoot>/docs/brief.md).',
  phases: [
    { title: 'Market pass', detail: 'ck:toni finds three to five comparable products with a source each, reading market research and the opportunity first when they exist' },
    { title: 'Draft', detail: 'ck:river writes the brief: problem and root-cause chain, user, success metric, comparable products, scope with a smaller first version, non-goals, open questions' },
    { title: 'Validate', detail: 'one neutral Haiku agent checks the brief contract; ck:river revises at most once' },
  ],
  personas: ['toni', 'river'],
}

// Direct invocation (/ck:brief <idea>) hands the typed text to the script as a string; a skill
// launch passes an object. Both are accepted. Paths default to the project the session is in,
// and without a plugin root the contract is loaded by skill name instead of by path.
const a = (args && typeof args === 'object') ? args : { idea: typeof args === 'string' ? args.trim() : '' }
if (!a.idea && !a.opportunityPath) {
  throw new Error('brief: type the idea after the command, for example /ck:brief An app that reminds you to water each plant on its own schedule. Or run /ck:opportunity first so the brief can start from docs/opportunity.md.')
}
const projectRoot = a.projectRoot || '.'
const runDir = a.runDir || (projectRoot + '/.ck/runs/brief-latest')
const runId = a.runId || 'brief-direct'
const stamp = a.timestamp || 'today (write the date from `date -u`)'
const briefPath = a.briefPath || (projectRoot + '/docs/brief.md')
const contractStep = a.pluginRoot
  ? 'Read ' + a.pluginRoot + '/skills/brief-artifact/SKILL.md (the brief contract).'
  : 'Load the skill ck:brief-artifact with the Skill tool (the brief contract).'
const housekeeping = a.runDir ? '' : 'If ' + projectRoot + '/.git exists, make sure the line ".ck/" is in ' + projectRoot + '/.git/info/exclude (append it if missing). '
const existing = [a.opportunityPath, a.marketResearchPath].filter(Boolean)
const ideaText = a.idea || 'Take the idea from the concept statement in ' + a.opportunityPath
const VALIDATOR_MODEL = 'claude-haiku-4-5-20251001'
const SECTIONS = ['Idea', 'Problem and root-cause chain', 'User', 'Success metric and leading indicator', 'Comparable products', 'Scope', 'Non-goals', 'Open questions for the author']

const MARKET_SCHEMA = {
  type: 'object',
  properties: {
    comparables: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' }, what: { type: 'string' }, who: { type: 'string' },
          price: { type: 'string' }, gap: { type: 'string' }, source: { type: 'string' },
        },
        required: ['name', 'what', 'who', 'price', 'gap', 'source'],
      },
    },
    crowding: { type: 'string' },
    readFirst: { type: 'array', items: { type: 'string' } },
    searchesRun: { type: 'number' },
  },
  required: ['comparables', 'crowding', 'readFirst', 'searchesRun'],
}

// The brief is on disk; the return value carries only what the closing message needs, so the
// author is not paid twice for the same words.
const BRIEF_SCHEMA = {
  type: 'object',
  properties: {
    briefPath: { type: 'string' },
    title: { type: 'string' },
    chainSteps: { type: 'number' },
    comparables: { type: 'number' },
    nonGoals: { type: 'number' },
    openQuestions: { type: 'array', items: { type: 'string' } },
  },
  required: ['briefPath', 'title', 'chainSteps', 'comparables', 'nonGoals', 'openQuestions'],
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

// ---- Market pass ----
phase('Market pass')
const market = await agent(
  `The idea, in the author's words: ${ideaText}\n` +
  housekeeping +
  (existing.length
    ? `Read these first and search only for what they lack: ${existing.join(', ')}. List what you read in readFirst.\n`
    : `There is no market research or opportunity analysis yet; readFirst is empty.\n`) +
  `Find three to five comparable products: for each, in one paragraph of at most sixty words, what it does, ` +
  `who it is for, its price or business model, the gap this idea would fill, and one source URL. Add one ` +
  `paragraph on how crowded the space is. ` +
  `Use web search; record how many searches you ran. Write the object as JSON to ${runDir}/market.json (create the directory if needed) and return it.`,
  { label: 'toni:market', phase: 'Market pass', agentType: 'ck:toni', schema: MARKET_SCHEMA },
)
if (!market) log('market pass: Toni returned nothing; the brief will say the comparable-products section is pending')
else log(`market pass: ${market.comparables.length} comparable(s), ${market.searchesRun} search(es)`)

// ---- Draft ----
phase('Draft')
let brief = await agent(
  `The author's idea, in their own words: ${ideaText}\n` +
  (existing.length ? `Also read: ${existing.join(', ')}.\n` : '') +
  `${contractStep} It gives the section order, required fields, and the checklist your brief ` +
  `will be validated against. The sections, in order: ` + SECTIONS.map(s => '"' + s + '"').join(', ') + `.\n` +
  (market
    ? `Comparable products, from Toni's market pass (attribute the section to it and cite its sources):\n` +
      JSON.stringify(market, null, 1) + '\n'
    : `The market pass returned nothing; write the Comparable products section as "pending" and say why.\n`) +
  `Write ${briefPath} to that contract (create the directory if needed). Write the whole file with one Write call; do not build it with piecemeal edits, and do not re-read it after writing. Apply your Required Behaviors in ` +
  `subagent form. Three Whys: do not accept the idea as the problem; write the chain (idea, why, why, why), ` +
  `each step more specific, until the user pain is exposed or the idea is shown to address a symptom, and say ` +
  `which. V0 Challenge: propose a first version that cuts at least half the scope, say what it cuts, and give ` +
  `your recommendation with the decision marked open for the author. Premortem: not yet; it belongs to the PRD.\n` +
  `One primary user. One success number with a target and a date, plus one leading indicator. At least two ` +
  `non-goals. Anything you would have asked the author goes under Open questions for the author, each with ` +
  `the assumption you proceeded on; the list is present even when empty. Date the document ${stamp}.\n` +
  `Plain words, under 1,200 words in all: this is the short document that governs the long one. ` +
  `Return only the brief object: briefPath must be '${briefPath}'; chainSteps, comparables, and nonGoals are ` +
  `counts of what you wrote; openQuestions is the list of open questions, one line each. Do not repeat the ` +
  `document in the return value.`,
  { label: 'river:draft', phase: 'Draft', agentType: 'ck:river', effort: 'medium', schema: BRIEF_SCHEMA },
)
if (!brief) throw new Error('brief: River returned nothing')
log(`brief: ${brief.chainSteps} step(s) in the root-cause chain, ${brief.comparables} comparable(s), ${brief.openQuestions.length} open question(s)`)

// ---- Validate ----
phase('Validate')
const validation = await agent(
  `${contractStep} Read ${briefPath}. Check the brief against every numbered item in the contract's ` +
  `checklist and against the section order. Return valid=true only if every item holds. For each unmet item, ` +
  `one line in missing that quotes the checklist item and says what is absent or wrong. Judge the shape, not ` +
  `the idea.`,
  { label: 'validate', phase: 'Validate', model: VALIDATOR_MODEL, effort: 'low', schema: VALIDATION_SCHEMA },
)
if (validation && !validation.valid) {
  log(`validate: ${validation.missing.length} unmet item(s); River revises once`)
  const revised = await agent(
    `${contractStep} Read ${briefPath}. A checker found these unmet checklist items:\n` +
    validation.missing.map(m => '- ' + m).join('\n') + '\n' +
    `Revise ${briefPath} so each item holds. Write the whole file with one Write call; do not build it with piecemeal edits, and do not re-read it after writing. Return only the updated brief object (counts and open questions); briefPath must be '${briefPath}'.`,
    { label: 'river:revise', phase: 'Validate', agentType: 'ck:river', effort: 'medium', schema: BRIEF_SCHEMA },
  )
  if (revised) brief = revised
  else log('validate: revision returned nothing; keeping the first draft')
} else if (!validation) {
  log('validate: validator returned nothing; proceeding unvalidated')
} else {
  log('validate: brief passes the contract checklist')
}

return {
  runId,
  briefPath: brief.briefPath,
  title: brief.title,
  comparables: brief.comparables,
  openQuestions: brief.openQuestions,
  validation,
  generated: stamp,
}
```

## Appendix D. `workflows/team.js`

```js
export const meta = {
  name: 'team',
  description: 'Team selection and roles and responsibilities. River reads the product documents and the roster and nominates a cast with an owner per document and stage; each nominee confirms or declines on its own tier and names what it needs and one missing seat; River writes docs/TEAM.md; a checker validates it. Type /ck:team with nothing after it. A skill may instead pass an object: runId, runDir (absolute cache directory), projectRoot (absolute path of the project repository), pluginRoot, timestamp, inputs (absolute paths of the documents that exist: opportunity, brief, PRD, market research; at least one of the first two), teamPath (optional; default <projectRoot>/docs/TEAM.md), maxCast (optional; default 8).',
  phases: [
    { title: 'Nominate', detail: 'ck:river proposes the cast: an owner and reviewers per pipeline document and stage, and the missing seats' },
    { title: 'Confirm', detail: 'every nominee, in parallel on its own tier at low effort, accepts or declines each responsibility, names its needs, one risk, and one missing seat' },
    { title: 'Assemble', detail: 'ck:river writes docs/TEAM.md: cast, roles and responsibilities matrix, hand-off order, needs, missing seats, declined nominations' },
    { title: 'Validate', detail: 'one neutral Haiku agent checks the team contract; ck:river revises at most once' },
  ],
  personas: ['river', 'akira', 'alex', 'casey', 'cornelius', 'ernie', 'iris', 'jordan', 'kai', 'morgan', 'noon', 'piper', 'quinn', 'reiner', 'rez', 'robin', 'sage', 'sasha', 'toni', 'tracy', 'travolta'],
}

// Direct invocation (/ck:team) needs no arguments: the documents that exist in the project are
// read. A skill may pass an object. Without a plugin root the roster and the contract are loaded
// by skill name instead of by path.
const a = (args && typeof args === 'object') ? args : {}
const projectRoot = a.projectRoot || '.'
const runDir = a.runDir || (projectRoot + '/.ck/runs/team-latest')
const runId = a.runId || 'team-direct'
const stamp = a.timestamp || 'today (write the date from `date -u`)'
const inputs = Array.isArray(a.inputs) && a.inputs.length
  ? a.inputs
  : ['whichever of ' + projectRoot + '/docs/opportunity.md, ' + projectRoot + '/docs/brief.md, ' + projectRoot + '/docs/PRD.md, and ' + projectRoot + '/docs/market-research.md exist (stop and say so if neither of the first two does)']
const teamPath = a.teamPath || (projectRoot + '/docs/TEAM.md')
const rosterStep = a.pluginRoot
  ? 'Read the roster: ' + a.pluginRoot + '/profiles/ROSTER.md (one line per persona: name, role, tier, domain).'
  : 'Load the skill ck:roster with the Skill tool (the roster: one line per persona with name, role, tier, domain).'
const contractStep = a.pluginRoot
  ? 'Read ' + a.pluginRoot + '/skills/team-artifact/SKILL.md (the team contract).'
  : 'Load the skill ck:team-artifact with the Skill tool (the team contract).'
const housekeeping = a.runDir ? '' : 'If ' + projectRoot + '/.git exists, make sure the line ".ck/" is in ' + projectRoot + '/.git/info/exclude (append it if missing). '
const MAX_CAST = Number.isInteger(a.maxCast) && a.maxCast > 0 ? Math.min(a.maxCast, 12) : 8
const VALIDATOR_MODEL = 'claude-haiku-4-5-20251001'
const SECTIONS = ['Cast', 'Roles and responsibilities', 'Hand-off order', 'Needs', 'Missing seats', 'Declined nominations']

const RESPONSIBILITY = {
  type: 'object',
  properties: {
    item: { type: 'string' },
    role: { type: 'string', enum: ['owner', 'contributor', 'reviewer'] },
  },
  required: ['item', 'role'],
}

const NOMINATIONS_SCHEMA = {
  type: 'object',
  properties: {
    productKind: { type: 'string' },
    cast: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          persona: { type: 'string' },
          why: { type: 'string' },
          responsibilities: { type: 'array', items: RESPONSIBILITY },
        },
        required: ['persona', 'why', 'responsibilities'],
      },
    },
    missingSeats: {
      type: 'array',
      items: {
        type: 'object',
        properties: { need: { type: 'string' }, wouldOwn: { type: 'string' }, recommendation: { type: 'string' } },
        required: ['need', 'wouldOwn', 'recommendation'],
      },
    },
  },
  required: ['productKind', 'cast', 'missingSeats'],
}

const CONFIRMATION_SCHEMA = {
  type: 'object',
  properties: {
    persona: { type: 'string' },
    decisions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          item: { type: 'string' },
          role: { type: 'string' },
          accept: { type: 'boolean' },
          reason: { type: 'string' },
          replacement: { type: 'string' },
        },
        required: ['item', 'role', 'accept', 'reason', 'replacement'],
      },
    },
    needs: { type: 'array', items: { type: 'object', properties: { from: { type: 'string' }, what: { type: 'string' } }, required: ['from', 'what'] } },
    risk: { type: 'string' },
    missingSeat: { type: 'string' },
  },
  required: ['persona', 'decisions', 'needs', 'risk', 'missingSeat'],
}

const TEAM_SCHEMA = {
  type: 'object',
  properties: {
    teamPath: { type: 'string' },
    cast: { type: 'array', items: { type: 'string' } },
    owners: {
      type: 'array',
      items: { type: 'object', properties: { item: { type: 'string' }, owner: { type: 'string' } }, required: ['item', 'owner'] },
    },
    missingSeats: { type: 'array', items: { type: 'string' } },
    declined: { type: 'number' },
  },
  required: ['teamPath', 'cast', 'owners', 'missingSeats', 'declined'],
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

// ---- Nominate ----
phase('Nominate')
const nominations = await agent(
  `The project repository is ${projectRoot}. ` + housekeeping + `Read the product documents: ${inputs.join(', ')}. ` +
  `${rosterStep}\n` +
  `Say what kind of product this is in one line (productKind). Then propose the cast, at most ${MAX_CAST} ` +
  `personas, choosing by what the product needs, not by seniority: for each pipeline document and stage ` +
  `(opportunity, market research, brief, PRD, roadmap, architecture, brand guide, design, and any build ` +
  `stages the documents imply), one owner and the reviewers; when a PRD exists, one owner per requirement ` +
  `area. Every persona in the cast gets a one-sentence why.\n` +
  `Then the missing seats: needs no persona on the roster covers (a specific domain, legal, audio, ` +
  `localization, and so on), what a person in that seat would own, and your recommendation: recruit, cover ` +
  `from an existing seat (name it), or accept the gap.\n` +
  `Write the object as JSON to ${runDir}/nominations.json and return it.`,
  { label: 'river:nominate', phase: 'Nominate', agentType: 'ck:river', schema: NOMINATIONS_SCHEMA },
)
if (!nominations) throw new Error('team: River returned no nominations')
const cast = nominations.cast.slice(0, MAX_CAST)
log(`nominate: ${nominations.productKind}; ${cast.length} nominated; ${nominations.missingSeats.length} missing seat(s)`)

// ---- Confirm ----
phase('Confirm')
const confirmations = (await parallel(cast.map(n => () => agent(
  `You are ${n.persona}. You have been nominated to this product's team. Read ${inputs.join(', ')}. ` +
  `${rosterStep}\n` +
  `Your nomination: ${n.why}. Responsibilities proposed for you:\n` +
  n.responsibilities.map(r => `- ${r.role} of ${r.item}`).join('\n') + '\n' +
  `For each responsibility: accept or decline, with a reason from your domain; when you decline, name the ` +
  `roster persona who should have it instead (replacement), or "none" with the gap stated. Then: what you need ` +
  `from whom before you can start (needs); one risk in your domain for this product (risk); and one seat you ` +
  `think is missing from the roster for this product, or "none" (missingSeat). Be brief; this is a staffing ` +
  `check, not the work itself. Write the object as JSON to ${runDir}/confirmations/${n.persona}.json (create ` +
  `the directory if needed) and return it with persona '${n.persona}'.`,
  { label: `confirm:${n.persona}`, phase: 'Confirm', agentType: 'ck:' + n.persona, effort: 'low', schema: CONFIRMATION_SCHEMA },
)))).filter(Boolean)
const silent = cast.filter(n => !confirmations.some(c => c.persona === n.persona)).map(n => n.persona)
if (silent.length) log(`confirm: ${silent.join(', ')} returned nothing; treated as accepting their nomination as proposed`)
const declined = confirmations.reduce((sum, c) => sum + c.decisions.filter(d => !d.accept).length, 0)
log(`confirm: ${confirmations.length} confirmation(s), ${declined} declined responsibility(ies)`)

// ---- Assemble ----
phase('Assemble')
let team = await agent(
  `${contractStep} It gives the section order, required fields, and the checklist. The ` +
  `sections, in order: ` + SECTIONS.map(s => '"' + s + '"').join(', ') + `.\n` +
  `Your nominations: ${runDir}/nominations.json. The confirmations: every file under ${runDir}/confirmations/ ` +
  (silent.length ? `(${silent.join(', ')} did not answer; treat their nominations as accepted and say so). ` : '') +
  `The product documents: ${inputs.join(', ')}. ${rosterStep}\n` +
  `Write ${teamPath} (create the directory if needed). Write the whole file with one Write call; do not build it with piecemeal edits, and do not re-read it after writing. The Cast table (persona, role, tier, why on this ` +
  `product); the Roles and responsibilities matrix (one row per pipeline document and stage, and per PRD ` +
  `requirement area when a PRD exists; columns owner, contributors, reviewers; exactly one owner per row); ` +
  `the Hand-off order (who hands to whom, in pipeline order, and what each hand-off carries); Needs (per ` +
  `persona, from the confirmations); Missing seats (yours and the nominees', merged, with a recommendation ` +
  `each); Declined nominations (persona, responsibility, reason, replacement). Where a nominee declined and ` +
  `named a replacement, take it or say why not. Generated ${stamp}, run ${runId}.\n` +
  `Return the object; teamPath must be '${teamPath}'; declined is the number of declined responsibilities.`,
  { label: 'river:assemble', phase: 'Assemble', agentType: 'ck:river', schema: TEAM_SCHEMA },
)
if (!team) throw new Error('team: River returned nothing for the assembly; nominations and confirmations are under ' + runDir)

// ---- Validate ----
phase('Validate')
const validation = await agent(
  `${contractStep} Read ${teamPath}. Check the document against every numbered item in the contract's ` +
  `checklist and against the section order, including "every pipeline document has exactly one owner". ` +
  `Return valid=true only if every item holds; for each unmet item, one line in missing that quotes the ` +
  `checklist item and says what is absent or wrong.`,
  { label: 'validate', phase: 'Validate', model: VALIDATOR_MODEL, effort: 'low', schema: VALIDATION_SCHEMA },
)
if (validation && !validation.valid) {
  log(`validate: ${validation.missing.length} unmet item(s); River revises once`)
  const revised = await agent(
    `${contractStep} Read ${teamPath}. A checker found these unmet checklist items:\n` +
    validation.missing.map(m => '- ' + m).join('\n') + '\n' +
    `Revise ${teamPath} so each item holds. Write the whole file with one Write call; do not build it with piecemeal edits, and do not re-read it after writing. Return the updated object; teamPath must be '${teamPath}'.`,
    { label: 'river:revise', phase: 'Validate', agentType: 'ck:river', effort: 'medium', schema: TEAM_SCHEMA },
  )
  if (revised) team = revised
  else log('validate: revision returned nothing; keeping the first assembly')
} else if (!validation) {
  log('validate: validator returned nothing; proceeding unvalidated')
} else {
  log('validate: TEAM.md passes the contract checklist')
}

return {
  runId,
  teamPath: team.teamPath,
  productKind: nominations.productKind,
  cast: team.cast,
  owners: team.owners,
  missingSeats: team.missingSeats,
  declined: team.declined,
  silent,
  validation,
  generated: stamp,
}
```

## Appendix E. `skills/prd/SKILL.md`

````markdown
---
name: prd
description: Turn docs/brief.md into a full PRD with River. A draft is written and checked, three specialists argue about it on three different models, River revises it, and you review it on a page you can comment on (or by editing the file). Runs only when you type /ck:prd.
disable-model-invocation: true
argument-hint: "[--interview] [idea]"
---

You are River for the whole of this skill. Read `${CLAUDE_PLUGIN_ROOT}/agents/river.md` for your voice and standards. Speak plainly. Never print a stack trace. Always name the file that holds the work so far. Always give exactly one next action.

`<project-repo>` below is the repository Claude Code was opened in. Every path is relative to it unless it starts with `${CLAUDE_PLUGIN_ROOT}` or `<runDir>`.

## 0. Preconditions

Confirm the Workflow tool is available in this session. If it is not, stop and say: "Dynamic workflows are not available here. `/ck:prd` needs them. This is a setting in Claude Code, not something in your project." Do not run the stages by hand.

## 1. Find the brief

- If `docs/brief.md` exists, go to step 3.
- If it does not and `--interview` was given, run step 2.
- Otherwise stop with one action: "Run `/ck:brief <your idea in a sentence>` first. It takes about two minutes and writes `docs/brief.md`. Then run `/ck:prd` again."

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

Finally: "Default reviewers, or name them?" (record as a lens list or nothing) and "Where should the PRD go?" (default `docs/PRD.md`). Then write `docs/brief.md` from the answers, to `${CLAUDE_PLUGIN_ROOT}/skills/brief-artifact/SKILL.md`, with the Comparable products section marked pending, and continue.

## 3. Resume check

Read the latest `.ck/runs/*/run.json` with `command: "prd"` for this project, if any. `run.json` can be stale: a workflow cannot write it, and a session can end before the notification arrives. So decide the stage from what is on disk, in this order:

- `status` is `final`: ask "The PRD is finished. Re-run the reviewers on some sections, or start over?"
- `status` is `review`: go to step 7; the author has reviewed.
- The run directory holds `panel/*.json` and `docs/decisions/<timestamp>-prd-review.md` exists, but `docs/PRD.md` still has placeholder rows in Appendix A: the panel finished and the rewrite did not. `startAt` is `synthesize`.
- `docs/PRD.md` exists and no panel files do: the draft finished. `startAt` is `validate`.
- Otherwise `startAt` is `draft`.

When `startAt` is later than `draft`, say: "Your PRD stopped after the [stage] step. Everything so far is saved in `docs/PRD.md`. Continuing from there." Reuse the existing run directory, run id, and timestamp, and go to step 5. Offer "start over" only when the author asks for it; in a session that cannot ask, continue.

## 4. Mint the run

```bash
projectRoot="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
timestamp=$(date -u +%Y%m%dT%H%M%SZ)
runId="${timestamp}-<slug>"
runDir="${projectRoot}/.ck/runs/${runId}"
mkdir -p "$runDir"
grep -qxF '.ck/' "${projectRoot}/.git/info/exclude" 2>/dev/null || echo '.ck/' >> "${projectRoot}/.git/info/exclude"
```

Write `run.json`: `{ "runId", "command": "prd", "createdAt": timestamp, "status": "starting", "stage": "draft", "outputPath": "docs/PRD.md", "lenses" }`. The `.ck/` folder is a cache; the documents in `docs/` are the work.

## 5. Launch the draft and wait

List which of these exist and pass them as `inputs`, absolute: `docs/brief.md` (required), `docs/opportunity.md`, `docs/market-research.md`, `docs/TEAM.md`, `ROADMAP.md`. Then call the Workflow tool exactly like this:

```
Workflow({
  name: "ck:draft",
  args: {
    artifact: "prd",
    runId: "<runId>", runDir: "<runDir>", projectRoot: "<projectRoot>",
    pluginRoot: "${CLAUDE_PLUGIN_ROOT}", timestamp: "<timestamp>",
    inputs: ["<projectRoot>/docs/brief.md", ...],
    outputPath: "<projectRoot>/docs/PRD.md",
    startAt: "<draft, or the stage to continue from>",
    lenses: <list or null>
  }
})
```

Immediately write the returned run id into `run.json` as `harnessRunId`, with `workflow: "ck:draft"`, and set `status` to `drafting`. Say: "Writing the PRD. This takes a few minutes and runs in the background; I'll tell you when it's ready." Then stop. Wait for the task notification. Do not poll, do not narrate, do not start other work on this run.

If the notification reports a stop or a failure: record the failed stage in `run.json` and say: "I couldn't finish the [stage] step. Everything up to it is saved in `docs/PRD.md`. Run `/ck:prd` again to continue from there." Within the same session you may instead offer to relaunch with `resumeFromRunId`.

If the notification reports success but says the panel did not run, relaunch with `startAt: "panel"` and wait again. Never edit `docs/PRD.md` yourself in this step or the next: the workflow and the finalize agent write it, and the main session only launches, waits, reads, and reports.

## 6. The review

Set `status` to `review`. Read `docs/PRD.md`. Review it per `${CLAUDE_PLUGIN_ROOT}/skills/review-page/SKILL.md`, with the premortem question from Appendix B at the top of the page. That skill publishes, waits for "done", applies every comment to `docs/PRD.md` (recording each in `<runDir>/review.md`), republishes, and resolves; or, when publishing is unavailable, prints the file-edit message and stops until the next run.

### 3. Premortem

The question at the top of the review, and the first thing to ask if the author is reviewing in conversation: "Imagine this shipped on time and did not move the number. What went wrong?" Use the answer to surface the hidden assumption; do not argue with it. Record it in `<runDir>/review.md`.

To re-run the reviewers on named sections, call `Workflow({ name: "ck:panel", args: { runId, runDir, projectRoot, pluginRoot: "${CLAUDE_PLUGIN_ROOT}", timestamp: "<new>", question: "<the focused question>", contextPath: "<projectRoot>/docs/PRD.md", rationalePath: "<projectRoot>/docs/brief.md", lenses } })`, record its run id, wait, and return to this step.

## 7. Finalize

One agent, inline:

```
Agent({
  subagent_type: "ck:river",
  description: "Finalize PRD",
  prompt: "Read <projectRoot>/docs/PRD.md and <runDir>/review.md (the review comments and how each was applied, or the note that the file was edited directly). Fold the premortem answer into Assumptions and Risks, resolve each open decision as answered, keep Appendix A intact, and check the result against ${CLAUDE_PLUGIN_ROOT}/skills/prd-artifact/SKILL.md. If there is no review.md and the author left no answer to the premortem question, do not invent one: leave the question open under Appendix B and say so in the summary. Write docs/PRD.md with one Write call. Set status 'final' in <runDir>/run.json. Return the path and a five-line summary."
})
```

Say: "Your PRD is finished: `docs/PRD.md`. Next: run `/ck:next`." If the devlog skill is installed, add that `/devlog` can record the reviewers' memo from `docs/decisions/`.
````

## Appendix F. `skills/next/SKILL.md`

````markdown
---
name: next
description: Says what to run next, in one sentence, by looking at which documents exist. Use when you do not know where to start or what comes after the step you just finished.
disable-model-invocation: true
---

Look at the project and say exactly one thing. Plain words. No token counts, no more than one action.

Check, in this order, in the repository Claude Code was opened in: the latest `.ck/runs/*/run.json` (its `command` and `status`); then whether each of these exists: `docs/opportunity.md`, `docs/market-research.md`, `docs/brief.md`, `docs/TEAM.md`, `docs/PRD.md`, `ROADMAP.md`, `docs/ARCHITECTURE.md`, `docs/brand-guide.md`.

Then say the first line that applies:

| State | Say |
|---|---|
| `run.json` says `review` | "Your [document] is waiting for your review. Open the review page or `docs/<file>`, then say done or run `/ck:<command>` again." |
| `run.json` names a stopped stage | "Your [document] stopped partway. Everything so far is in `docs/<file>`. Run `/ck:<command>` again to continue." |
| Nothing in `docs/` | "Start with `/ck:opportunity` and describe your idea in a sentence. It writes `docs/opportunity.md`: what the product is, who it is for, what the market looks like, and whether it is worth doing." |
| Opportunity only | "Run `/ck:market-research` to go deeper on the market, or `/ck:brief` if the opportunity is enough to start from." |
| Brief, no team | "Run `/ck:team`. It decides who is on this product and who owns what, and writes `docs/TEAM.md`." |
| Brief and team, no PRD | "Run `/ck:prd`. It turns the brief into full requirements and takes a few minutes." |
| PRD, no roadmap | "Run `/ck:roadmap`. It orders the work and writes `ROADMAP.md`." |
| Roadmap, no architecture | "Run `/ck:architecture`. It recommends how to build it and writes `docs/ARCHITECTURE.md`." |
| Architecture, no brand guide | "Run `/ck:brand-guide`. It takes two rounds of your review and writes the brand guide and assets." |
| Everything above | "The definition is complete. Run `/ck:design <feature>` for any feature in the PRD, or `/ck:panel <question>` for a decision. Building features is the next release of ck." |

Do not run any agent. Do not explain how the tool works unless asked.
````

## Appendix G. The brief and PRD contracts

### G.1 `skills/brief-artifact/SKILL.md`

````markdown
---
name: brief-artifact
description: The Code Katz contract for a product brief: section order, required fields, and the checklist it must pass. Load when writing, revising, or validating docs/brief.md, inside or outside a ck workflow.
user-invocable: false
---

# The brief contract (`<project-repo>/docs/brief.md`)

A document written to this contract has the same shape every time, in every project. Consistency comes from this file, not from who writes it. Plain words throughout.

## Section order

Use these headings verbatim, in this order.

1. `## Idea`: the author's idea, in their words, one paragraph.
2. `## Problem and root-cause chain`: the person's pain, not the solution. The chain written out (idea, why, why, why), each step more specific, ending at a root cause or at "this addresses a symptom", and saying which.
3. `## User`: one main person, specific enough to recognize.
4. `## Success metric and leading indicator`: one number, a target, a date; one early sign to watch.
5. `## Comparable products`: three to five products, each in one paragraph: what it does, who it is for, its price or model, and the gap this idea fills, with one source; then one paragraph on how crowded the space is. Attributed to the market pass. Cites `docs/market-research.md` when it exists. May be marked pending, with the reason, when the market pass did not run.
6. `## Scope`: the smaller first version (what it keeps, what it leaves out, whether it would still move the number) and River's recommendation, with the decision marked open unless the author has made it.
7. `## Non-goals`: at least two things this will not do.
8. `## Open questions for the author`: anything River could not answer, each with the assumption used meanwhile. Present even when empty.

## Checklist A

1. Every section is present, in order, with its heading verbatim.
2. Problem names the person's pain and the chain reaches a root cause or says it stops at a symptom.
3. User is one person, not a category.
4. Success metric has a number, a target, and a date, plus one leading indicator.
5. Comparable products has three to five entries with a source each, or is marked pending with a reason.
6. Scope names what the smaller version leaves out and carries a recommendation.
7. Non-goals has at least two entries.
8. The whole brief is under 1,200 words. It is the short document that governs the long one.

## Writing

Plain technical English: name the actor, one instruction per sentence, no filler, no loss of precision. No em-dashes in prose.
````

### G.2 `skills/prd-artifact/SKILL.md`

````markdown
---
name: prd-artifact
description: The Code Katz contract for a PRD: section order, required fields, claim tags, and the checklist it must pass. Load when writing, revising, or validating docs/PRD.md, inside or outside a ck workflow.
user-invocable: false
---

# The PRD contract (`<project-repo>/docs/PRD.md`)

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

1. Every section is present, in order, with its heading verbatim.
2. Problem names the pain, not the solution, and cites the root-cause chain.
3. Success metric is one number with a target and a date, plus one leading indicator.
4. Scope records the decision and the smaller version with what it leaves out.
5. Non-goals has at least two entries.
6. Every requirement has at least one acceptance criterion a reader could check without asking the author.
7. Every claim not from the brief carries a `[C<n>]` tag, and every tag appears in Appendix A or is marked unchallenged.
8. Assumptions includes the assumption the premortem exposed (or, before the premortem exists, says the premortem is pending).
9. Open questions lists every decision left to the author.
10. No em-dashes in prose. Em-dashes are acceptable only as separators in structured lists.
11. The PRD, before its appendices, is under 3,000 words unless the author asked for more. Requirements are numbered statements with acceptance criteria, not essays. The appendices carry the panel's record verbatim and are not counted.

## File paths

`<project-repo>/docs/brief.md` and `<project-repo>/docs/PRD.md`, committed with the project. Decision memos from reviewers go to `<project-repo>/docs/decisions/`. The author may choose other paths when running the commands.

## Writing

Plain technical English: name the actor, one instruction per sentence, no filler, no loss of precision. Second person is fine for the reader; third person for the system.
````

## Appendix H. `agents/river.md` as generated (excerpt)

```markdown
---
name: river
description: River, Product Manager. Reviews and drafts from the product manager perspective for ck workflows and delegation; returns structured findings.
model: claude-fable-5-1
---

<!-- GENERATED from profiles/river.md by scripts/generate.sh; edit the profile, not this file. -->

# River — Product Manager

[body verbatim from profiles/river.md through "## How You Communicate"]

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

You are running as a delegated subagent. When the prompt names a project root and a run directory, read inputs from the project and write outputs only where the prompt says. If a schema is imposed, fill every required field; anything you would have asked goes in `questions`. Return findings first, detail after.
```

## Appendix I. Cost model

Prices per million tokens from the pricing page read 2026-09-05 [D]: Fable 5.1 $10 in / $50 out; Opus 5 $5 / $25; Sonnet 5 $2 / $10; Haiku 4.5 $1 / $5. Token counts are assumptions [P] for a project with a one-page brief and a ten-page PRD; the newer tokenizer produces about 30% more tokens than these figures assume [D]. No prompt-cache sharing between persona agents (§3.3 item 13). Neutral agents assumed on Opus 5 (the session model). Web-search calls are priced as tokens read; the search itself is not separately priced here.

### Per-agent assumptions

| Agent kind | Model | Input | Output | Cost each |
|---|---|---|---|---|
| Judgment author, draft or rewrite (River, Akira) | Fable 5.1 | 25k | 8k | $0.65 |
| Judgment lens or contributor (River, Akira, Morgan, Jordan) | Fable 5.1 | 18k | 3k | $0.33 |
| Craft author or contributor (Toni, Kai, Iris, Quinn) | Opus 5 | 18k | 5k | $0.22 |
| Craft lens (Toni) | Opus 5 | 18k | 3k | $0.17 |
| Execution lens or contributor (Kai moved down, Alex, Robin) | Sonnet 5 | 18k | 3k | $0.07 |
| Confirm (any persona, low effort) | own tier | 8k | 1k | Fable $0.13, Opus $0.07, Sonnet $0.03 |
| Research agent | Sonnet 5 | 20k | 3k | $0.07 |
| Validator | Haiku 4.5 | 15k | 1k | $0.02 |
| Synthesis or assembly, neutral | Opus 5 | 25k | 5k | $0.25 |

### Per-command totals

| Command | Agents | Arithmetic | About |
|---|---|---|---|
| `/ck:panel` | 4 | River $0.33 + Toni $0.17 + Kai $0.07 + synthesis $0.25. **Measured 2026-09-09, drill 4, before the length rules: $2.68** (a 4,700-word memo returned twice); the memo is now capped at 1,500 words and the return carries counts; re-measure | **$0.80 estimated; $2.68 measured before the length rules** |
| `/ck:brief` | 3 to 4 | Toni market pass $0.22 + River $0.32 (12k/4k) + validator $0.02, plus $0.30 for one revision. **Measured 2026-09-09: $2.50 on the first drill before the length rule, $2.09 after it** (River 8.1k and Toni 9.8k output tokens for a 1,195-word brief; the return schema repeated the document and now carries counts only; re-measure) | **$0.55 to $0.85 estimated; $2.50 measured before the length rule** |
| `/ck:prd` | 7 to 9 | River draft $0.60 (20k/8k) + validator $0.02 + panel $0.80 + River rewrite $0.85 (35k/10k). **Measured: $16.33 on 2026-09-09 (drill 5) before the review-page renderer, the one-write rule, and medium effort; $8.05 on 2026-10-01 (drill 6) after them**, 16 minutes for both passes. Fable 5.1 output on River's four stages is about $6.90 of it; the tier for the rewrite and finalize stages is the next lever (§10.4) | **$2.30 estimated**, plus $0.65 per revision, plus finalize (inline, session model, about $0.35) |
| `/ck:architecture` | 7 to 9 | Akira draft $0.65 + validator $0.02 + panel (Morgan $0.33, Alex $0.07, Jordan $0.17, synthesis $0.25) + Akira rewrite $0.85 | **$2.40** |
| `/ck:opportunity` | 7 to 9 | River frame $0.33 + Toni $0.22 + Akira $0.33 + domain seat $0.22 to $0.33 + Sage $0.33 + River assemble $0.85 + validator $0.02 | **$2.30 to $2.50** |
| `/ck:market-research` | 8 to 10 | Toni plan $0.17 + 5 researchers $0.35 + cross-check $0.10 + Toni write $0.30 (25k/6k) + validator $0.02 | **$1.00 to $1.20** |
| `/ck:team` | up to 11 | River nominate $0.33 + 8 confirms (about $0.55 mixed) + River assemble $0.45 (25k/5k) + validator $0.02 | **$1.00 to $1.40** |
| `/ck:roadmap` | 3 to 4 | River $0.33 + Quinn $0.22 + validator $0.02, plus $0.22 for one revision | **$0.60 to $0.80** |
| `/ck:brand-guide` | 12 across three stages | Proposals: Toni $0.17 + Iris $0.45 (SVG is output-heavy: 18k/12k) + Kai $0.30 + validator $0.02. Finalists: Iris $0.45 + Kai $0.30 + validator $0.02. Guide: Iris $0.35 + Kai $0.30 + validator $0.02 | **$2.40 to $2.60** |
| `/ck:design` | 6 across two stages | River $0.13 (low effort) + Kai variants $0.45 + validator $0.02; Kai refine $0.35 + Robin $0.07 + validator $0.02 | **$1.00 to $1.20** |
| `/ck:next`, `/ck:<persona>` | 0 | One main-session turn | negligible |

A full J1 on a new product, one pass through every step with one brand-guide run and no revisions: about $13. The judgment seats on Fable 5.1 are the largest line (River's four stages across brief, PRD, opportunity, team, and roadmap come to about $4 of it), which is the decision in §3.3 item 3.

Concurrency: min(16, CPUs minus 2) [D]; on a 4-CPU laptop the panel runs in one round, `team`'s eight confirms in four rounds, and `draft` in about four sequential steps, since its stages depend on each other. Spike S8 records Clare's machine.

## Appendix J. Sources

Documentation, verified 2026-09-05:

- Dynamic workflows: https://code.claude.com/docs/en/workflows
- Subagents: https://code.claude.com/docs/en/sub-agents
- Plugins reference: https://code.claude.com/docs/en/plugins-reference
- Plugin marketplaces: https://code.claude.com/docs/en/plugin-marketplaces
- Hooks: https://code.claude.com/docs/en/hooks
- Skills: https://code.claude.com/docs/en/skills
- Pricing: https://platform.claude.com/docs/en/about-claude/pricing

Family record [R]:

- The imported profiles and tiers: `claude-team-cli` at commit `b4b211fbf4ec6f4d365a550b55e9981610ed7dda` (`profiles/`, `profiles/tiers.conf`, `scripts/generate-agents.sh`, `tests/run.sh` as the test style)
- `claude-conductor`: `DEVLOG.md` (2026-07-04), `docs/2026-07-03-fable-harness-modernization-analysis.md`, `docs/2026-07-04-agent-teams-spike.md`, branch `claude/research-desktop-tile-updates-BJqoP`; its JSONL cost parser and `pricing.json`
- `claude-roadmap-skill/skills/roadmap/SKILL.md`: the `ROADMAP.md` structure that §7.6 mirrors
- `claude-plugins`: `.claude-plugin/marketplace.json` v1.3.0

Will's example documents, read 2026-09-08 [W]:

- Project NIGHTGRID, Opportunity Analysis v1.1 (Google Docs): the shape of §7.1
- NIGHTGRID Brand Direction Record, rev 4 (Google Docs): the shape of the brand direction record in §7.8, and the proposals-to-finalists process in §6.9
- d20Mob Brand Identity Guide v1.2 (Google Docs): the shape of the brand guide in §7.8

The reviews of this document:

- The Opus PRD, its panel brief, and its workbench mockups: `plans/opus/`
- The panel memo recording what was adopted and rejected, with reasons: `plans/2026-09-05-ck-prd-panel-memo.md`
- Will's sixteen comments on revision 2, 2026-09-08: §3.4

Research [M], [V]: as listed in the proposal's §10; this PRD adds none.
