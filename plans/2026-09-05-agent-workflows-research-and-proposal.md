# Code Katz Agent Workflows — Research & Product Proposal

> **Status:** proposal, ready for PRD
> **Date:** 2026-09-05
> **Author:** Will Curran (with Claude)
> **Handoff:** intended input for Fable to turn into a PRD and build
> **Supersedes:** `claude-conductor/plans/2026-09-04-agent-coordination-engine.md` — see §9

---

## 1. How to use this document

This is a research summary and a product proposal, not a PRD. It contains the evidence, the decisions taken and why, the proposed shape of the product, and the questions still open. It deliberately does not contain acceptance criteria, schemas beyond illustrative sketches, or sequencing beyond a rough phase order.

Every empirical claim is graded:

- **[M]** measured, independent, method stated
- **[V]** vendor self-measured
- **[D]** product documentation, verified against primary source on 2026-09-05
- **[P]** practitioner assertion, no measurement

Where the evidence is weak or absent, the document says so. Several recommendations rest on judgment rather than measurement, and those are flagged.

---

## 2. Goals

Stated by Will, in his own framing:

1. **Enjoyment and utility.** claude-team-cli gives a sense of assigning experts to tasks in a larger project. Advance it to be as useful as possible given current models and current harness capability.
2. **Willingness to break.** The next iteration should respond to the research and to current technology. It may break from the current implementation.
3. **Customer zero: Will and his wife.** Used to build and maintain real products. The core requirement is **team members that behave consistently.** A product should start with exploration of the opportunity, then a PRD, then a branding guide — and there is a specific way a branding guide should be done, with specific expected artifacts.
4. **Adversarial and complementary input.** On a decision such as whether to include a feature, get the product lens, the marketing lens, and the UX lens.
5. **Building should be fun.** Personas make building feel exciting and engaging.
6. **Kill it if it does not help.** If this is no better — or worse — than opening Claude and working directly, say so. Challenge the affinity for personas.
7. **Current evidence only.** Ideas should be grounded in the last two months. Models and harnesses have moved.

### 2.1 How Will works today

Open a project. Open a session, "use Akira." Open another session, "use Toni." The repeatable activity is: open Claude to advance a project, where the work is the next stage of a project plan, plus occasional exploratory analysis.

Named recurring jobs: market research; implement a roadmap feature (backend + frontend + UX + marketing content); fix bugs; plan the next roadmap phase; write a PRD; create a GTM plan.

**The unit is the workflow, not the roster.** Most of these should be present in every project, run in the right order, and produce consistent output.

---

## 3. The central finding

> The persona is the interface. The artifact spec is the mechanism. The model tier is a policy decision. Today all three are conflated into a markdown profile, and only the first one is actually working.

Three distinct claims, each with its own evidence, follow.

### 3.1 Role-based decomposition of a single build task is worse, not merely pricier

This was the load-bearing question, and the first answer given was wrong and had to be corrected.

Anthropic's frequently-cited planner/implementer/tester/reviewer experiment reports **token allocation only** — no quality metric, no N, no pass rate. They assert a correctness mechanism ("each handoff degrading fidelity") but publish a cost number. **[V]** On its own it cannot settle the question, and citing it as a quality finding is over-reading.

Independent work does measure quality:

| Source | Method | Finding |
|---|---|---|
| arXiv 2606.00308 **[M]** | Roles ON/OFF ablation, 164 HumanEval, 1,968 paired obs, gpt-4o | Pure Analyst→Coder→Tester pipeline is **worst at 84.15%**; debugger-only configs reach **92.07%**. Persona-heavy configs produced 50–130% more complex code for zero pass@1 gain. |
| E2EDev, ACL 2026 **[M]** | 8 frameworks × 6 backbones incl. Claude Haiku 4.5 | Single-agent GPT-Engineer best on **4/6**; ChatDev falls *below* a plain single prompt on 4/6. |
| *Nature Machine Intelligence* 8(7), Jul 2026 **[M]** | 260 compute-matched configs, SWE-bench Verified + Terminal-Bench | Coordination effect ranges **+80.8% to −70.0%**. A **~45% single-agent-capability threshold** above which multi-agent is zero-to-negative; predicts the sign in **94%** of validation configs. Our tasks sit well above it. |
| CooperBench, Jan 2026 **[M]** | 600+ real OSS collaborative tasks | Agents score **~30% lower collaborating than solo**. Communication reduced merge conflicts but **did not improve success rate at all.** |

**Mechanism.** The damage is handoff loss and Cognition's "conflicting implicit decisions" — every action silently fixes a decision the spec never named, and two agents holding different resolutions produce artifacts that are individually correct and jointly unmergeable. Full context sharing does not fix this **[P]**. This is a property of *topology*, not of the persona string.

### 3.2 Persona strings do very little; profile *content* does the work

Expert personas are measurably inert for correctness on frontier models:

- Wharton *Prompting Science Report 4*, Dec 2025 **[M]** — GPQA-D + MMLU-Pro, 4,950–7,500 runs per cell, four model families: **30 expert-persona comparisons, one significant, and it is negative.**
- Zheng et al., Findings of EMNLP 2024 **[M]** — 162 personas × 2,410 MMLU questions × 9 models: no significant difference vs control; in-domain match worth **+0.4pp**.
- CodePromptEval, IEEE TSE **[M]** — 63,648 functions: persona has **no statistically significant impact on correctness**, but **does** measurably reduce code smells and complexity.

**Read this carefully, because it is easy to misread as "drop the personas."** What it says is that "you are a senior backend engineer" buys nothing. What buys something is the *content* of the profile — Akira's "as much as needed, as little as possible" principle, a specific API-design checklist, a required output shape. The persona is a container. Today some of Code Katz's 22 profiles are full of real constraints and some are closer to character description. That ratio is the actual lever.

And the null results are all on single-turn QA or single-function generation. **Nobody has measured persona effects on multi-turn agentic work or on judgment/creative tasks.** Extending these findings to "personas don't help Will pick a positioning angle" would be reasoning from analogy, not evidence.

### 3.3 Where spending more genuinely buys better work

| Intervention | Evidence | Effect |
|---|---|---|
| Cross-model review | arXiv 2607.21656, Jul 2026, 116 LiveCodeBench tasks **[M]** | Claude Opus 4.7 reviewing Codex GPT-5.5: **+18.1pp** (p=.0010) |
| Same-model self-review | same study **[M]** | Claude Opus 4.7 on own output: 3 fixes, 3 regressions, **±0, at +72% cost** |
| External oracle vs LLM critique | Stechly et al., ICLR 2025 **[M]** | GPT-4 Game of 24: 5% → **3%** with self-critique → **36–38%** with a sound external verifier |
| Cheap verification pre-pass | AgentGUI, ETH Zürich, Jul 2026 **[M]** | Completion **44%→78%** on a 4B worker, manager tokens **0.19–0.56%** of total |
| One-at-a-time human review | AgentGUI, N=8 within-participant **[M]** | **38% faster** (90s vs 145s, p=0.023), accuracy **93% vs 80%** (p=0.031), lower NASA-TLX. Small sample; authors flag limited power |

**Conclusion:** buy quality with a *different model checking against a real oracle*, and with more thinking inside one agent. Do not buy it with more job titles.

### 3.4 What this means for the goals

| Goal | Verdict |
|---|---|
| 3 — consistency | **Not an agent problem.** Consistency comes from an artifact template plus a checklist plus a gate. The five existing Code Katz skills each own a file format, and that is exactly why their output is stable. The personas own no artifacts, which is exactly why theirs varies. |
| 4 — multi-lens panels | **Supported, with one correction.** This is not decomposition; it is coverage of considerations on a judgment call, which the null results do not touch. But lenses must run on **different models** — >350 models agree 60% of the time *when both are wrong*, and error correlation rises with capability **[M]**. Same model in three costumes is one opinion. |
| 5 — fun | **Legitimate and load-bearing.** Retention is the real success metric for a personal tool; an optimal tool that goes unused is worth nothing. But the fun should come from real disagreement between lenses, not a name badge on identical output. |
| 6 — the challenge | **Personas earn their cost at phase transitions and panels, not at task execution.** Inside an established context on a single task, opening Claude directly wins: `claude-team launch` means fresh context, and re-explaining the project costs more than the specialist adds. If the next iteration does not make that distinction structural, it is a tax with a nicer wrapper. |

---

## 4. Platform capabilities, verified 2026-09-05

All **[D]**, verified against primary docs on the date above. This section is the reason the earlier plan is obsolete: most of what it proposed to build now ships natively.

### 4.1 Dynamic workflows — the key primitive

A dynamic workflow is a **JavaScript script that orchestrates many subagents**, written by Claude, executed by a runtime *outside the conversation context*. Only the final answer enters context.

```javascript
export const meta = {
  name: 'audit-routes',
  description: 'Audit every route handler for missing auth checks',
}

const found = await agent('List every .ts file under src/routes/.', {
  schema: { type: 'object', required: ['files'],
            properties: { files: { type: 'array', items: { type: 'string' } } } },
})

const audits = await pipeline(found.files, file =>
  agent(`Audit ${file} for missing authentication checks.`, { label: file }),
)

return audits.filter(Boolean)
```

Primitives available in the script body: `agent()` spawns one subagent, `pipeline()` runs one per list item, `parallel()` runs a set concurrently, `phase()` groups agents in the progress view, `log()` emits a message, and `args` is a global carrying invocation input.

**Repeatability — this is the whole answer to goal 3.** Run `/workflows`, select a run, press `s`, and the script saves to `.claude/workflows/` (repo-shared) or `~/.claude/workflows/` (personal). It then runs as `/<name>` in every future session.

**Distribution.** Place a script in `workflows/` at a plugin root and it is namespaced: a plugin `acme-tools` with `meta.name: release-audit` runs as `/acme-tools:release-audit`.

**Constraints that shape the design:**

| Constraint | Consequence |
|---|---|
| **No mid-run user input.** Docs: *"For sign-off between stages, run each stage as its own workflow."* | **Goal 5 is a decomposition rule, not a feature.** Every stage requiring Will's sign-off must be its own workflow. |
| Up to 16 concurrent agents; 1,000 agents per run; 4,096 items per `parallel()`/`pipeline()` | Generous. Not a binding limit for this use case. |
| `Date.now()`, `Math.random()`, no-arg `new Date()` **throw** inside scripts | Enforced determinism so a relaunched run repeats the same calls. Pass timestamps via `args`. |
| No module loading; no direct filesystem or shell access from the script | The script coordinates; agents do the work. |
| Resumable **within the same session**. A failed agent reruns, and so does every agent that started after it | A mid-fan-out failure reruns completed work. Prefer smaller workflows. |
| Size guideline in `/config`: `small` <5, `medium` <15 (default), `large` <50 agents | Set per workflow expectation. |
| Warning at >25 agents or >1.5M projected tokens | Advisory only, does not pause. |

**Prompt caching.** In a fan-out, agents sharing model + effort + agent type + tools + output schema + cwd build the same prefix; the runtime holds all but the first until the first response begins so the rest read a warm cache. Default stagger cap 5000ms. Workflow agents sit outside the main conversation's cache TTL bucket — 5 minutes by default, settable to `1h` via `subagentPromptCacheTtl`.

**Bundled:** `/deep-research` — fans out web searches across angles, cross-checks sources, votes on claims, returns a cited report with unsurvived claims filtered out. This is a working reference implementation for the market-research workflow.

**Authoring:** `/workflow-authoring` bundled skill (v2.1.248+) loads the script-writing reference before editing a saved script.

### 4.2 Subagents — the persona vehicle

`agents/*.md` frontmatter supports `name`, `description`, `tools`, `disallowedTools`, `model`, `effort`, `maxTurns`, `maxBudgetUsd`, `skills`, `memory`, `background`, and `isolation: worktree`.

`model` accepts family aliases (`sonnet`, `opus`, `haiku`, `fable`), `inherit`, or a full ID. Only the subagent's **final message** returns to the caller; intermediate tool calls stay inside. Limits: `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` (20), `CLAUDE_CODE_MAX_SUBAGENTS_PER_SESSION` (200), `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` (3).

**`isolation: worktree` is available to subagents and not to teammates.** This is the single most important asymmetry for parallel implementation work.

### 4.3 Agent Teams — verified, and not the executor

Experimental, disabled unless `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`.

**What it genuinely provides:** a shared task list with claiming and dependency tracking (a pending task with unresolved dependencies cannot be claimed); direct teammate-to-teammate messaging via mailbox JSON at `~/.claude/teams/{team}/inboxes/{agent}.json`; per-teammate models; roles drawn from subagent definitions; `TaskCreated` / `TaskCompleted` / `TeammateIdle` hooks where exit code 2 blocks and returns feedback.

**Why it is not the executor for shipped pipelines:**

1. **Cannot be packaged or versioned.** Team config holds live runtime state — session IDs, tmux pane IDs — and the docs say do not hand-author or pre-author it. There is no project-level equivalent; `.claude/teams/teams.json` is treated as an ordinary file. A team is convened, never shipped.
2. **Cannot run unattended.** *"In non-interactive mode with the `-p` flag, including Agent SDK sessions, Claude doesn't spawn teammates."* No scheduled or headless runs, ever.
3. **No source-file protection.** File locking exists **only for task claiming**. On source files: *"Two teammates editing the same file leads to overwrites. Break the work so each teammate owns a different set of files."* No worktree option.
4. **Documented breakage on routine operations.** `/resume` and `/rewind` do not restore in-process teammates; task status lags and blocks dependents; shutdown is slow; one team per session; no nested teams; lead is fixed; teammates cannot spawn background subagents.
5. **Enabling it changes unrelated behavior.** Any subagent Claude names launches as a teammate, so teams form when not requested.

**Where Teams is right.** The docs' own headline examples are goal 4 — *"one on UX, one on technical architecture, one playing devil's advocate"*, a three-lens parallel PR review, and adversarial competing-hypothesis debugging. For **ad-hoc exploration where the decomposition is unknown**, Teams is the better tool. For anything repeatable, Workflows win because they can be saved and shipped.

### 4.4 Plugins, skills, hooks

**Plugins** bundle skills, commands, agents, hooks, MCP servers, LSP servers, output styles, background monitors, and **workflows**, via `.claude-plugin/plugin.json`, distributed through a GitHub or GitLab marketplace. This is the distribution unit; it replaces `install.sh`, symlinking, and sync logic entirely.

**Skills** — `SKILL.md` with frontmatter supporting `name`, `description`, `allowed-tools`, `model`, `disable-model-invocation`, `argument-hint`. `context: fork` runs a skill as a subagent with no conversation history; `agent:` selects the subagent type. Since Jul 2026 forked skills run in the background by default.

**Hooks** — the enforcement layer. `TaskCreated`, `TaskCompleted`, `TeammateIdle`, `SubagentStart`, `SubagentStop`, `Stop`, `PreToolUse`/`PostToolUse`, `SessionStart`/`SessionEnd`, `PreCompact`/`PostCompact`, and — new in Aug 2026 — **`PreModelSwitch`/`PostModelSwitch`**, which can block, confirm, or annotate a model switch. `PreToolUse` can rewrite tool arguments and its `deny` holds even under bypass-permissions.

**Output styles do not reach subagents.** They apply to the main conversation only and are fixed at session start. **Artifact consistency must therefore come from skill bodies plus hooks, not from a style.**

**Routines** — GA on Pro/Max/Team/Enterprise. Cloud-run automations triggered by schedule, API call, or GitHub event. The path to unattended pipeline runs.

**Advisor tool** — experimental, Anthropic API only. Lets a cheaper executor consult a stronger model at decision points with full conversation context. **[V]** +2.7pp SWE-bench Multilingual at −11.9% cost. Relevant to the routing goal: it escalates *without* a model switch, so it sidesteps the context-rebuild cost entirely.

### 4.5 Model lineup — the tier map is stale

| Model | ID | In/Out $/MTok | Cache read | Context | Position |
|---|---|---|---|---|---|
| Fable 5.1 | `claude-fable-5-1` | $10 / $50 | **0.025×** | 1M | Hours-long agent sessions, multistep deep research |
| Opus 5 | `claude-opus-5` | $5 / $25 | 0.1× | 1M | Complex agentic coding, systems engineering, vision-heavy |
| Sonnet 5 | `claude-sonnet-5` | $2 / $10 | 0.1× | 1M | Everyday coding, data analysis, content creation |
| Haiku 4.5 | `claude-haiku-4-5-20251001` | $1 / $5 | 0.1× | 200K | Real-time, high-volume, sub-agent tasks |

**Changed in the last eight weeks:** Opus 5 launched Jul 24 as the coding flagship at half Fable's price. Fable 5.1 launched Sep 1 with a **4× cache-read price cut**. Sonnet 5's $2/$10 was made permanent Sep 1 — the scheduled increase to $3/$15 was cancelled. Opus 4.1 retired Aug 5. Sonnet 4.5's retirement window opens **Sep 29, 2026**.

`tiers.conf` currently references `claude-fable-5` and `claude-opus-4-8`. Both are legacy. **Opus 5 should absorb most of what currently routes to Fable.**

---

## 5. Proposal: the `code-katz` plugin

### 5.1 Shape

Retire the bash CLI. Ship one installable plugin containing four component types:

```
code-katz/
├── .claude-plugin/plugin.json
├── workflows/          # the product: named, ordered, repeatable pipelines
│   ├── opportunity.js  ├── prd.js        ├── brand-guide.js
│   ├── roadmap.js      ├── feature.js    ├── bugfix.js
│   ├── gtm.js          ├── market-research.js
│   └── panel.js
├── agents/             # the roster: 22 personas as subagent definitions
│   ├── akira.md  ├── sasha.md  ├── river.md  ├── toni.md  ├── kai.md  …
├── skills/             # the artifact contracts (templates + checklists)
│   ├── prd/SKILL.md    ├── brand-guide/SKILL.md   ├── gtm/SKILL.md  …
└── hooks/              # the gates
    └── hooks.json      # TaskCompleted / Stop → artifact validators
```

The five existing skill repos (`plans`, `todo`, `roadmap`, `devlog`, `publish`) fold in as the artifact contracts they already are.

### 5.2 The four layers, and what each is for

| Layer | Primitive | Owns | Why here |
|---|---|---|---|
| **Workflow** | `workflows/*.js` | The order of stages | Repeatable, versioned, shippable, runs outside context. Goal 3. |
| **Persona** | `agents/*.md` | Voice, domain constraints, model tier | Fun and intent expression (goals 1, 5); model policy (goal 2) |
| **Artifact** | `skills/*/SKILL.md` | Output template + checklist | The actual mechanism of consistency (§3.2) |
| **Gate** | `hooks/hooks.json` | Rejection of malformed output | Enforcement; personas cannot be trusted to self-certify |

The design intent: **a persona without an artifact contract is decoration.** Every workflow stage names an owning persona *and* the artifact skill it must produce into.

### 5.3 Workflow catalog

Each is one workflow. Each stage boundary that needs Will's sign-off is a workflow boundary, because workflows accept no mid-run input (§4.1).

| Command | Purpose | Owner persona | Artifact |
|---|---|---|---|
| `/ck:opportunity` | Explore the opportunity before committing | River | `opportunity-brief.md` |
| `/ck:market-research` | Competitive and market scan | River + Toni | `market-research.md` |
| `/ck:prd` | Product requirements | River | `PRD.md` |
| `/ck:brand-guide` | Brand and visual system | Iris + Kai | `brand/` asset set + `brand-guide.md` |
| `/ck:roadmap` | Plan or re-plan the next phase | River + Quinn | `ROADMAP.md` (existing skill) |
| `/ck:feature` | Implement a roadmap item end to end | per slice | code + tests + docs |
| `/ck:bugfix` | Diagnose and fix | Robin → owner | fix + regression test |
| `/ck:gtm` | Go-to-market plan | Toni | `gtm.md` |
| `/ck:panel` | Multi-lens decision input | 3 lenses | decision memo |

The natural project order is `opportunity → market-research → prd → brand-guide → roadmap → feature*`, with `panel` callable at any point. **Recommendation: do not hard-wire the order in code.** Ship it as documented convention plus a `/ck:next` helper that reads which artifacts exist and suggests the next stage. Hard sequencing would fight exploratory use, which is goal 1.

### 5.4 `/ck:feature` — the one with real parallelism

The only workflow where the build-topology research binds. Structure:

1. **Plan phase** (Opus 5, one agent) — decompose the feature into **vertical slices**, each owning a feature plus its tests plus its docs. Emit an interface contract naming every decision two slices could otherwise resolve differently: exact signatures, the enumerated error set, canonical entity names, single file ownership. Freeze it.
2. **Build phase** — `parallel()` over slices, one persona each, each subagent declared `isolation: worktree`. One writer per slice. No mid-feature handoffs.
3. **Verify phase** — per slice, a gate agent on a **different persona and a different model tier** than the writer, whose job is to *run the oracle*, not to opine. Carries the anti-early-victory instruction verbatim: *"You MUST run the complete test suite before marking as passed."*
4. **Merge** — sequential, one at a time, base suite as the gate.

Parallelize only when the interface contract exists. Absent it, run sequential — §3.1 is unambiguous that unshared implicit decisions are what break parallel builds.

### 5.5 `/ck:panel` — goal 4

The one piece with no native primitive, and the one Will will feel most day to day.

- Three lenses, invoked on one question: **product** (River), **marketing** (Toni), **UX** (Kai).
- **Each lens runs on a different model.** Not negotiable — same model in three costumes is one opinion, and error correlation rises with capability **[M]**.
- Each lens must return, in a fixed schema: its recommendation, its **strongest argument against its own recommendation**, and **the specific condition that would make it say no**. Forcing the disagreement is the point; three approvals is a failed panel.
- A synthesis agent surfaces *where the lenses disagree* and does not resolve it. The decision is Will's.

The workflow runtime explicitly supports this shape: *"it can have independent agents adversarially review each other's findings before they're reported, or draft a plan from several angles and weigh them against each other."*

### 5.6 Proposed tier re-base

Simplify from three tiers across 22 personas to a policy with four positions:

| Tier | Model | Assign to |
|---|---|---|
| Deep research | Fable 5.1 | `/ck:market-research`, `/ck:opportunity` deep passes only |
| Judgment | **Opus 5** | Akira, River, Toni, Kai, Iris, Morgan, Sage, Jordan, Quinn, Casey — most of what is currently Fable **or** Opus 4.8 |
| Execution | Sonnet 5 | Sasha, Alex, Robin, Piper, and all high-volume implementation |
| Classification | Haiku 4.5 | Routing, status rollups, summarization, `/ck:next` |

Opus 5 becomes the default judgment tier. Fable 5.1 is reserved for genuinely long-horizon research, where its 4× cache-read discount also does the most good.

**Keep tiers.conf as declared intent** and treat the resolved model as separate, recorded per run. Two additions:

- **Fallback chain** (`fable-5-1 → opus-5 → sonnet-5`) with quota/429 detection, using the new `PreModelSwitch` hook as the enforcement point. This fixes the observed failure where an Akira delegation pinned to Fable died on quota exhaustion and had to be rerun by hand.
- **Prefer the Advisor tool over a model switch** where available. Escalating within a task avoids the context-rebuild cost entirely, which is the correct answer to the "switching is not free" objection.

### 5.7 Artifact contracts

For each artifact, the skill defines: the section structure, the required fields, the file path convention, and a **machine-checkable validator**. The hook (`TaskCompleted` or `Stop`, exit code 2) rejects malformed output and returns the specific failure.

This is where goal 3 is actually satisfied. "There is a specific way I like a branding guide" becomes a template plus a checklist plus a validator — not a personality trait of Iris.

---

## 6. What we are deliberately not building

| Not building | Because |
|---|---|
| A bash orchestrator | Dynamic workflows are the orchestrator, and they are saveable and shippable |
| A custom task graph, lock protocol, or state file | Workflow scripts hold state in script variables; the runtime handles resumption |
| An Agent Teams executor for shipped pipelines | §4.3 — unpackageable, interactive-only, no source-file protection, documented breakage |
| A model picker | The thesis is that the user expresses intent and policy resolves the model |
| Role pipelines for building a single feature | §3.1 — measured 8–40pp worse at 3–10× the tokens |
| A bandit router | No outcome data yet. A bandit with no data is a random number generator. Revisit after telemetry exists |
| Free-form inter-agent chat | CooperBench: communication reduced conflicts, did not improve success **[M]** |
| A batch review mode | §3.3 — one at a time is 38% faster and 13pp more accurate |

---

## 7. Honest assessment against goal 6

**Where this beats opening Claude directly:**

- Phase transitions. Starting a PRD from a fresh context with a template and a checklist is genuinely better than continuing a conversation that has drifted.
- Repeated multi-stage jobs. `/ck:prd` producing the same shape every time, in every project, is a real gain over remembering how you did it last time.
- Panels. Three lenses on different models surfaces considerations one session will not.
- Fan-out work. Auditing 40 route handlers is what workflows are for.

**Where it does not, and should not be used:**

- Any single task inside a context you are already deep in. Fresh context costs more than the specialist adds.
- Small changes. The coordination overhead exceeds the benefit.
- Work where the decomposition is unknown. Use a team, or just work directly.

**The specific risk to watch:** 22 personas is likely 15 more than are used. Unused personas are maintenance surface and choice paralysis. Recommendation for the PRD: instrument which personas and workflows actually get invoked, and prune on evidence after 90 days.

---

## 8. Open questions for the PRD

1. **Retire or coexist?** Does `claude-team-cli` get archived once the plugin ships, or does the CLI remain for the `/akira`-in-current-session route? The three-route model (current context / fresh context / separate session) is good and should survive in some form.
2. **Workflow granularity vs sign-off.** Because workflows take no mid-run input, every sign-off point is a workflow boundary. Is `/ck:prd` one workflow, or `prd-draft` → review → `prd-finalize`? This is the highest-leverage open design question.
3. **Where do artifacts live?** Repo-relative (`docs/`, `brand/`) or a `.code-katz/` directory? Committed, presumably — confirm.
4. **Which personas survive?** A proposed cut list based on 90-day usage should precede the port, not follow it.
5. **Panel model assignment.** Which three models for the three lenses? Constrained to the Claude family, decorrelation is imperfect — all share one training pipeline. Worth stating that limitation explicitly.
6. **`/ck:feature` scope.** Full end-to-end including marketing copy, or code-only with content as a separate workflow?
7. **Routines integration.** Which workflows, if any, should run scheduled or on GitHub events?
8. **Verification for non-code artifacts.** A test suite is a real oracle. What is the oracle for a brand guide? Probably a structural validator plus Will's review — which means non-code stages lean harder on the human gate, and should be sized accordingly.

---

## 9. Relationship to the previous plan

`claude-conductor/plans/2026-09-04-agent-coordination-engine.md` proposed extending claude-conductor with a task graph, a spawn wrapper, a routing module, and a coordination UI, executing via Agent Teams. **That plan is substantially obsolete.** Dynamic workflows, packageable in a plugin, provide the orchestration, the repeatability, the distribution, and the resumption it proposed to build. Agent Teams is the wrong executor for the reasons in §4.3.

Two things from it survive and should carry forward:

- **The conductor bug findings.** `update_session_field` and `insert_active_row` both write a fixed `.tmp` then `mv`, with no lock — two concurrent writers destroy each other. And `dashboard/watcher.js:134` filters empty cells while the four awk parsers are positional, so a row with an empty Notes field is already parsed differently by the two. Both are real and worth fixing regardless of this proposal.
- **The coordination UI question.** Workflows have a built-in progress view (`/workflows` — phases, agent counts, token totals, elapsed time, drill-down to any agent's prompt and result). **Recommendation: use it and do not build a UI until it proves insufficient.** Goal 6 applies to the UI as much as to the personas.

---

## 10. Sources

**Platform documentation** — all verified 2026-09-05:
[Agent teams](https://code.claude.com/docs/en/agent-teams) · [Dynamic workflows](https://code.claude.com/docs/en/workflows) · [Subagents](https://code.claude.com/docs/en/sub-agents) · [Skills](https://code.claude.com/docs/en/skills) · [Plugins reference](https://code.claude.com/docs/en/plugins-reference) · [Hooks](https://code.claude.com/docs/en/hooks) · [Routines](https://code.claude.com/docs/en/routines) · [Advisor tool](https://code.claude.com/docs/en/advisor) · [Prompt caching](https://code.claude.com/docs/en/prompt-caching) · [Pricing](https://platform.claude.com/docs/en/about-claude/pricing) · [Model deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations)

**Measured research:**
[Capable language models can outgrow the benefits of collaboration](https://www.nature.com/articles/s42256-026-01268-y), *Nature Machine Intelligence* 8(7), Jul 2026 · [How Generation Architecture Shapes Code Complexity](https://arxiv.org/abs/2606.00308) · [E2EDev](https://arxiv.org/abs/2510.14509), ACL 2026 · [CooperBench](https://cooperbench.com/), Jan 2026 · [Why Do Multi-Agent LLM Systems Fail? (MAST)](https://arxiv.org/abs/2503.13657) · [AgentGUI](https://arxiv.org/html/2607.26300v1), ETH Zürich, Jul 2026 · [Cross-Model LLM Code Review](https://arxiv.org/abs/2607.21656), Jul 2026 · [Expert Personas Don't Improve Factual Accuracy](https://arxiv.org/abs/2512.05858), Wharton, Dec 2025 · [Personas in System Prompts Do Not Improve Performance](https://arxiv.org/abs/2311.10054), EMNLP 2024 · [Impact of Prompt Programming on Function-Level Code Generation](https://arxiv.org/abs/2412.20545), IEEE TSE · [Stechly et al.](https://arxiv.org/abs/2402.08115), ICLR 2025 · [Great Models Think Alike](https://arxiv.org/abs/2502.04313), ICML 2025

**Position pieces:**
[Building multi-agent systems: When and how to use them](https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them), Anthropic, Jan 2026 · [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system), Anthropic, Jun 2025 · [Don't Build Multi-Agents](https://cognition.com/blog/dont-build-multi-agents), Cognition, Jun 2025 · [The model picker is a dead end](https://lovable.dev/blog/the-model-picker-is-a-dead-end), Lovable

**Prior art reviewed:** [ruvnet/ruflo](https://github.com/ruvnet/ruflo) — renamed from claude-flow; task DAG and complexity-bucketed Thompson-bandit router are worth studying, but its own commissioned audit found headline performance multipliers unsubstantiated and one fabricated at runtime. Do not copy its template decomposition or its executor-less agent pool.
