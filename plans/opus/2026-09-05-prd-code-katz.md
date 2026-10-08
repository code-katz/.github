# PRD — Code Katz

> **Version:** 1.0
> **Date:** 2026-09-05
> **Author:** Will Curran
> **Status:** ready for build planning
> **Inputs:** `2026-09-05-agent-workflows-research-and-proposal.md` (evidence and design rationale), `2026-09-05-prd-draft-workbench.md` (superseded by this document)

---

## 1. Summary

Code Katz turns the repeatable stages of building a product into named, versioned commands that ship with every project.

`/katz:brief`, `/katz:prd`, `/katz:brand-guide`, `/katz:panel` — each owned by a specialist persona, each producing a specified artifact, each gated. Built entirely on native Claude Code primitives, adding no orchestration of its own.

Alongside it, a **Workbench** shows what has been run, what it cost, which models and personas did the work, and lets those personas be tuned. It observes; it never launches.

This replaces `claude-team-cli`, which is retired on completion of Phase 1.

**One sentence:** the user expresses intent, policy resolves the model, a contract guarantees the artifact, and a gate proves it.

---

## 2. Background

Will and his wife build and maintain real products with Claude. The current practice is manual: open a session, "use Akira"; open another, "use Toni." It works, and it is enjoyable, but it has three failures.

**Output is inconsistent.** A product should begin with an opportunity exploration, then a PRD, then a brand guide — and there is a specific way a brand guide should be done, with specific expected assets. Nothing enforces any of this. The 22 personas own no artifact formats, so output varies between runs and between projects.

**Nothing is repeatable across projects.** Every new product re-derives the process from memory. The stages exist in Will's head, not in a file.

**Nothing is visible.** There is no way to see what ran, what it cost, which model did the work, or — over months — which personas earn their keep.

A fourth consideration is not a failure but a requirement: **building should be fun.** The persona metaphor is what makes it fun, and a redesign that optimizes it away has failed regardless of how it benchmarks.

### 2.1 What the research settled

Full evidence in the research document. Four findings govern this design.

**Role pipelines are worse, not merely pricier.** Decomposing one build task across specialist roles measures 8–40pp worse at 3–10× the tokens. The cause is handoff loss and conflicting implicit decisions — a property of topology, not of the persona string. **Consequence:** one writer per slice, no mid-feature handoffs.

**Persona strings are inert for correctness; profile content is not.** "You are a senior backend engineer" buys nothing measurable. A specific checklist, a required output shape, and a domain constraint buy a lot. **Consequence:** the artifact contract does the work, and the persona is the interface.

**Cross-model verification is where extra spend buys better output.** A different model reviewing against a real oracle: +18.1pp. The same model reviewing itself: ±0 at +72% cost. **Consequence:** gates run a different persona on a different tier against an executable oracle.

**One-at-a-time review beats a queue.** 38% faster, 93% vs 80% accuracy. **Consequence:** never a review queue, and because workflows accept no mid-run input, sign-off points are command boundaries.

---

## 3. Users

| | **Will** | **Will's wife** |
|---|---|---|
| Technical? | Yes — reads and writes code, comfortable in files | No — has shipped several iOS apps with Claude and claude-team-cli |
| Wants | Repeatability, adversarial input on decisions, visibility into cost and activity, a place to tune personas | To express intent and receive a good artifact |
| Tolerates | Multiple commands, JS, terminal output, cost decisions | One command at a time, plain language, no model names |
| Fails when | The tool is slower than doing it himself | A command errors and she cannot tell what to do next |

**User 2 is the harder constraint and the more important one.** Every surface must work for someone who will never open `workflows/prd.js`. Where the two users conflict, she wins, and Will gets an escape hatch.

---

## 4. Goals

| | Goal | Success measure |
|---|---|---|
| **G1** | **Consistency** — the same stage produces the same artifact shape every time | Two PRDs from different projects have identical section structure; validators pass on both |
| **G2** | **Repeatability** — stages ship with every project | A fresh project has all commands available after one install |
| **G3** | **Right model for the work** — tier follows the job, availability-aware | Zero manual reruns caused by quota exhaustion |
| **G4** | **Adversarial input** — real disagreement on judgment calls | Panel lenses reach different recommendations more than a third of the time |
| **G5** | **Visibility** — activity, models, tokens, cost, live and historical | Will can answer "what did last month cost, and which personas did I actually use" |
| **G6** | **Tunability** — a place to build and maintain personas | A persona is tuned without opening a text editor |
| **G7** | **Fun** — the persona metaphor survives and gets sharper | Will still uses it after 90 days |

### Non-goals

- **Not a harness.** We do not own the agent loop, model client, permissions, caching, or context management.
- **Not an orchestrator.** Dynamic workflows are the orchestrator.
- **Not multi-user.** Two people, local machines, no server, no auth, no sync.
- **Not a model picker.** No upfront model choice. An explicit override stays, and the system may arbitrate at genuine tradeoff points (P10).
- **Not a launcher.** The Workbench never starts work.

---

## 5. Principles

| # | Principle |
|---|---|
| **P1** | **The artifact spec does the work; the persona is the interface.** Every stage names an owning persona *and* the contract it must satisfy. A persona without a contract is decoration |
| **P2** | **One writer per slice.** Build work is decomposed by context boundary, never by job title |
| **P3** | **Verification is the only legitimate handoff.** Gates use a different persona, a different tier, and a real external oracle |
| **P4** | **Sequential by default.** Parallelize only when a frozen interface contract exists |
| **P5** | **One review at a time.** Never a queue |
| **P6** | **Sign-off points are command boundaries.** Workflows take no mid-run input |
| **P7** | **Panels vary the model, not just the prompt** — and vary the *inputs* more than the model |
| **P8** | **Build nothing the harness already does** |
| **P9** | **Effort before model.** Difficulty belongs to the task. Dial effort first, then the Advisor, then a model switch |
| **P10** | **Arbitrate, don't ask up front.** Pause and ask Will only when a tradeoff becomes legible. Never ask user 2 |
| **P11** | **Extend the native practice; never reimplement it.** Name the feature you would duplicate before building |

---

## 6. User journeys

### J1 — Will's wife starts a new product

*The primary journey. If this is not delightful, nothing else matters.*

1. She has an idea for an app. She creates a folder and opens Claude Code in it.
2. She types `/katz:` and autocomplete shows the available stages. She does not know where to start, so she runs **`/katz:next`**.
3. It sees an empty project and replies: *"Start with `/katz:brief` — it captures the problem, who it's for, and what success looks like. Takes about two minutes."*
4. She runs **`/katz:brief`** and describes her idea in her own words. Three agents run. A minute later `docs/brief.md` exists: problem, user, success metric, one page.
5. She reads it. The problem statement is not quite right, so she **edits the file directly** and saves. No approval UI, no command.
6. `/katz:next` now says: *"`/katz:prd` — turns the brief into full requirements."* She runs it. It reads her edited brief. Twelve agents run over several minutes; the progress line shows phases completing.
7. `docs/PRD.md` appears. A gate has already checked it against the contract — every required section present, every requirement numbered and testable.
8. `/katz:next` suggests `/katz:brand-guide`. She continues.

**What she never does:** choose a model, learn what a subagent is, sequence the stages herself, approve or reject anything in a UI, or see a token count.

### J2 — Will implements a roadmap feature

1. `ROADMAP.md` has a Tier 1 item: offline sync. He runs **`/katz:plan-feature offline sync`**.
2. It enters **plan mode** — the native one — explores the codebase, and proposes an approach. Will iterates with it in conversation until the shape is right, then approves the plan.
3. The workflow adds the two things plan mode does not produce: a decomposition into **vertical slices** (each owning a feature plus its tests plus its docs), and a **frozen interface contract** naming every decision two slices could otherwise resolve differently. It archives to `plans/2026-09-12-offline-sync.md` through the existing plans contract.
4. Will reads the plan. **This is the checkpoint that matters** — it is cheap and it governs everything expensive that follows. He notices the contract leaves an error case ambiguous, edits that line, and saves.
5. He runs **`/katz:feature`**. The plan's manifest says this feature has a UI surface and is user-visible, so all six phases run:
   - **Design** — Kai produces a mockup for the sync-status UI. This gates frontend work.
   - **Build** — three slices in parallel, each in its own git worktree, one persona each.
   - **Verify** — each slice checked by a different persona on a different tier, running the actual test suite.
   - **Merge** — sequential, one at a time, base suite green before the next.
   - **Content** — Toni writes the release note, from behavior that now exists.
6. Partway through, a verify gate fails twice at `high` effort. The system **arbitrates**: *"Slice 2 verification failed twice. Retry at `xhigh` (~$0.40 more), or escalate to Fable 5.1 (~$1.10 more)? [default: xhigh]"* Will presses return.
7. Done. He opens the diff, reads the release note, and ships.

### J3 — Will decides whether to build a feature

1. He is unsure whether to add social sharing. He runs **`/katz:panel should we add social sharing to the app?`**
2. Three lenses run in parallel on different models, each reading different evidence: River reads the PRD and roadmap; Toni reads competitor positioning; Kai reads the actual screens.
3. Each returns a recommendation, its **strongest argument against itself**, and **the specific condition that would make it say no**.
4. A synthesis agent surfaces where they disagree — Toni says yes for acquisition, Kai says the share sheet has nowhere to live without a nav redesign — and **does not resolve it**.
5. `docs/decisions/003-social-sharing.md` is written. Will decides.

*If all three agree, the output says so prominently, because unanimous panels are a signal that the panel is not working.*

### J4 — Will tunes a persona

1. Toni's marketing copy keeps coming out too long. He opens the **Workbench** and finds Toni.
2. He sees Toni's model tier, budget, and profile body, plus how often Toni has run in the last 30 days and what it cost.
3. He adds a constraint to the profile body: a hard word ceiling for release notes. The editor validates the frontmatter and shows a diff.
4. He saves. The Workbench writes `agents/toni.md`. Next run picks it up.

### J5 — Will reviews the month

1. He runs `/katz:report` and a static HTML file opens in his browser.
2. Spend by project, by workflow, by persona, by model. Run counts and outcomes. Gate pass rates.
3. Two things stand out: `/katz:market-research` on Fable 5.1 is a third of his spend, and four personas have not run in 90 days.
4. He moves those four to the relevant project's `.claude/agents/` and drops the market-research default to Opus 5 to see whether quality holds.

---

## 7. The Plugin

### 7.1 Structure

```
code-katz/
├── plugin/
│   ├── .claude-plugin/plugin.json
│   ├── workflows/*.js          # stages — native dynamic workflows
│   ├── agents/*.md             # personas — native subagent definitions
│   ├── commands/*.md           # persona slash-commands (/katz:akira)
│   ├── skills/*/SKILL.md       # artifact contracts
│   └── hooks/hooks.json        # gates + telemetry
└── workbench/
    ├── server/
    └── ui/
```

Distributed through a GitHub marketplace. One install.

### 7.2 Layer responsibilities

| Layer | Owns | Never does |
|---|---|---|
| **Workflow** | Order of stages, fan-out, synthesis | Holds domain knowledge |
| **Persona** | Voice, domain constraints, model tier, tool scope, budget | Defines output format |
| **Artifact contract** | Template, section structure, checklist, validator | Decides who runs it |
| **Gate** | Rejects malformed output, emits telemetry | Modifies content |
| **Workbench** | Observes, aggregates, edits personas | Launches work |

### 7.3 Command catalog

| Command | Stage | Owner | Artifact |
|---|---|---|---|
| `/katz:next` | Suggest the next stage | — | none |
| `/katz:opportunity` | Explore the opportunity | River | `docs/opportunity-brief.md` |
| `/katz:market-research` | Market and competitor scan | River + Toni | `docs/market-research.md` |
| `/katz:brief` | Problem, user, success metric | River | `docs/brief.md` |
| `/katz:prd` | Product requirements | River | `docs/PRD.md` |
| `/katz:brand-guide` | Brand and visual system | Iris + Kai | `brand/` + `brand/brand-guide.md` |
| `/katz:roadmap` | Plan the next phase | River + Quinn | `ROADMAP.md` |
| `/katz:plan-feature` | Slices + frozen interface contract | Akira or River | `plans/YYYY-MM-DD-slug.md` |
| `/katz:feature` | Implement, end to end | per slice | code, tests, docs, copy |
| `/katz:bugfix` | Diagnose and fix | Robin → owner | fix + regression test |
| `/katz:gtm` | Go-to-market plan | Toni | `docs/gtm.md` |
| `/katz:panel` | Multi-lens decision input | 3 lenses | `docs/decisions/NNN.md` |
| `/katz:<persona>` | Adopt a persona in the current session | — | none |
| `/katz:report` | Generate and open the analytics report | — | `~/.code-katz/report.html` |
| `/katz:workbench` | Start the local workbench server *(v1)* | — | none |

**There is no shell CLI.** Every surface, including the Workbench, is a `/katz:` command. Nothing goes on `PATH`, there is no `install.sh`, and there are no symlinks to keep in sync — which is exactly the machinery claude-team-cli existed to manage and the plugin makes unnecessary. Install is one marketplace add.

**Ordering is convention, not enforcement.** `/katz:next` reads which artifacts exist plus roadmap and plan status and suggests. Hard sequencing would fight exploratory use.

### 7.4 Granularity

**Default coarse. Checkpoint universally. Split exactly twice.**

Every workflow writes each stage's artifact as it completes and accepts a starting stage in `args`, so any workflow can resume rather than regenerate. There is no review mechanism to build: the artifact is a file, reviewing means reading it, rejecting means editing it.

Two splits, both where a cheap early artifact governs an expensive downstream run:

- `/katz:brief` → `/katz:prd`
- `/katz:plan-feature` → `/katz:feature`

Everything else is one command. Split later only on felt pain.

### 7.5 `/katz:feature`

Six phases, conditional on a manifest the plan phase emits.

| # | Phase | Who | Gates | Runs when |
|---|---|---|---|---|
| 1 | Plan | Akira or River | Everything | Always — split out as `/katz:plan-feature` |
| 2 | Design | Kai | Any UI slice | Feature has a surface |
| 3 | Build | one persona per slice | — | Always |
| 4 | Verify | different persona, different tier | Merge | Always |
| 5 | Merge | — | Content | Always |
| 6 | Content | Toni | — | Feature is user-visible |

Two orderings that differ from the obvious: **design gates build** — reacting to a mockup is cheaper than rewriting a component — and **content follows merge** — Toni writes about behavior that exists.

**Composition is at the skill layer.** There is no `workflow()` primitive, so a workflow cannot invoke another. The content phase writes through the same contract `/katz:gtm` uses: one contract, one place to change it.

Within build: vertical slices, one persona each, `isolation: worktree`, one writer per slice. The interface contract is **frozen before build starts**. Refuse to parallelize without it.

Within verify: a different persona on a different tier, whose job is to run the oracle rather than opine, carrying verbatim — *"You MUST run the complete test suite before marking as passed."*

### 7.6 `/katz:panel`

| Lens | Persona | Model | Reads |
|---|---|---|---|
| Marketing | Toni | Fable 5.1 | Competitor positioning, market context |
| Product | River | Opus 5 | PRD, roadmap, usage data |
| UX | Kai | Sonnet 5 | Actual screens and flows |
| Synthesis | — | Opus 5 | All three arguments |

Each lens returns a fixed schema: recommendation, **strongest argument against its own recommendation**, and **the condition that would make it say no**. Synthesis surfaces disagreement and does not resolve it.

**Three Claude tiers give scale diversity, not independent judgment** — all share one training pipeline, and the measured cross-review result was Claude reviewing *Codex*. The tier spread is the weakest of the three mechanisms. **Differentiated inputs do most of the work**, and the forced disqualifying condition does the rest.

**Instrument the agreement rate.** Above roughly two-thirds agreement the panel is theater. Cross-vendor via MCP is the documented escalation.

### 7.7 Personas

Ported to `agents/*.md`. Frontmatter carries `name`, `description`, `model`, `effort`, `tools`, `maxTurns`, `maxBudgetUsd`, `isolation`. The body carries domain constraints and checklists — the part that measurably works.

**Three scopes, not one roster:**

| Scope | Contents | Location |
|---|---|---|
| **Plugin core** | Personas that appear in every project — Akira, Sasha, River, Toni, Kai, Robin, Iris, Quinn, Casey | plugin `agents/` |
| **Project cast** | Domain personas for one product — Reiner, Cornelius, Ernie, Piper, Rez | that project's `.claude/agents/` |
| **User** | Experiments not yet earning a place | `~/.claude/agents/` |

Half the 22 go unused, but most of those are a project cast in the wrong place, not dead weight. **The exact split is a Phase 0 deliverable** and it sets the port scope.

### 7.8 Model and effort

**Two axes.** Persona sets the model floor. The workflow stage sets the effort. Difficulty belongs to the task — Sasha builds both the static marketing page and the dynamic app.

| Model | Personas |
|---|---|
| Fable 5.1 | None by default — reached by escalation. Default for `/katz:market-research` |
| Opus 5 | Akira, River, Toni, Kai, Iris, Morgan, Sage, Jordan, Quinn, Casey |
| Sonnet 5 | Sasha, Alex, Robin, Piper |
| Haiku 4.5 | `/katz:next`, routing, rollups |

| Task shape | Effort |
|---|---|
| Mechanical, well-specified | `low`–`medium` |
| Normal implementation | `high` (default) |
| Novel architecture, security-sensitive | `xhigh`–`max` |
| Still short at `max` | escalate to Fable 5.1 |

**Escalation order: effort → Advisor → model switch.** Effort costs no context rebuild. The Advisor escalates one decision without moving the session. A model switch is last because it is the only one that pays the rebuild.

**Fallback chain** `fable-5-1 → opus-5 → sonnet-5` with quota detection at the `PreModelSwitch` hook. Resolved model *and* effort recorded per run so per-tier quality stays auditable.

**Arbitration (P10).** Pause and ask Will when: escalation passes a declared ceiling, a fallback *degrades* capability, or projected cost crosses a threshold. The prompt states what failed, what each option costs in dollars, defaults to safe, and offers "don't ask again for this workflow." **User 2 never sees it.**

### 7.9 Artifact contracts

An artifact has two halves:

- **Contract** — template, section structure, required fields, checklist, validator. Product-agnostic. Lives in the plugin.
- **Instance** — `docs/PRD.md` for one product. Project content, committed to the project repo.

**Conventional paths** — `docs/`, `brand/`, `ROADMAP.md` at root — not a dotted directory. These deliverables outlive the tool.

**The plugin keeps no private state in the project.** The artifact is the state: `/katz:next` and stage-resume both work by checking which files exist.

Enforcement is a `Stop` or `TaskCompleted` hook, exit code 2, returning the specific defect. Output styles cannot do this — they are session-fixed and do not reach subagents.

### 7.10 State altitudes

| Altitude | Question | Artifact | Lifetime |
|---|---|---|---|
| Strategic | What to build, in what order | `ROADMAP.md` | Months, committed |
| Execution | How to build this one thing | `plans/*.md` | One effort, committed |
| In-flight | What this run is doing | Native task list | One session |

`TODOS.md` is **retired** — it sat between the first two and duplicated both.

Two of three altitudes are already native. Per P11, extend rather than rebuild: `/katz:plan-feature` runs **plan mode** and adds only slices and the interface contract.

### 7.11 Failure handling for user 2

*The difference between a tool she trusts and one she abandons.*

Three failure classes, three responses:

| Failure | What she sees | What she can do |
|---|---|---|
| **Validator rejects the artifact** | "The PRD is missing a success metric. Retrying that section." | Nothing — it self-corrects, up to twice |
| **A stage fails after retries** | "I couldn't finish the requirements section. Everything up to it is saved in `docs/PRD.md`. Run `/katz:prd` again to resume from there." | Re-run. Prior stages replay from cache |
| **Quota or availability** | "Claude is at capacity for this model. Waiting, or run `/katz:prd` again in a few minutes." | Wait or retry |

Three rules: **never show a stack trace, a model ID, or a token count**; **always name the file that holds completed work**; **always give exactly one next action.**

---

## 8. The Workbench

Local web app. Observes and edits personas. Never launches work.

### 8.1 Complexity

Sizes relative: **S** ≈ a weekend, **M** ≈ a week, **L** ≈ several weeks, **XL** ≈ a project of its own.

| Component | Size | Risk | Value |
|---|---|---|---|
| Event ingest via hooks | S | Low | High |
| **Token and cost ingest** | M | **High** | High |
| Store (SQLite) | S | Low | — |
| Static analytics report | S–M | Low | **High** |
| Server + live view | **L** | Med–High | **Low** |
| Persona editor | S–M | Low | High |
| Workflow editor | **XL** | **High** | Uncertain |
| Publish | S *or* L | Low *or* Med | Med |

**Roughly 80% of the value is in four S/M components.** Two dominate the cost:

**Live view duplicates `/workflows`**, which already shows phases, agent counts, token totals, elapsed time, and per-agent drill-down. There is no push API, so it means polling and byte-offset tailing plus a server and its lifecycle. P11 applies.

**The workflow editor has a known trap.** A workflow is JavaScript. Editing it visually means either parsing and regenerating — brittle, hand edits silently lost — or owning a declarative format that compiles to JS, which never round-trips back. It also competes with `/workflow-authoring`, which already exists.

### 8.2 Build order

| Step | What | Gets you |
|---|---|---|
| **v0** | Hooks + store + `/katz:report` static HTML | All analytics. No server, no polling. The shape `/insights` already uses |
| **v1** | Minimal server + persona editor | Authoring — the "workbench" part |
| **v2** | Live view | Only if `/workflows` proves insufficient |
| **v3** | Workflow editor | Only if `/workflow-authoring` proves painful |

### 8.3 Telemetry

| Source | Official | Carries | Risk |
|---|---|---|---|
| **Hooks** | Yes | Our identifiers: workflow, stage, persona, artifact, verdict | Only what we instrument |
| **OpenTelemetry** | Yes | Tokens, cost, tool activity | Needs a collector |
| **Transcript JSONL** | No | Everything else | Undocumented; **deleted after 30 days** |

**Hooks are the spine** — the only source that knows what a persona is, and a stable contract because we own both ends. OTel supplies the numbers. Transcripts enrich, fixture-fenced so drift breaks CI rather than the user.

**Retention:** session data is cleaned up after `cleanupPeriodDays` (30 default), so the Workbench persists its own rollups. SQLite at `~/.code-katz/workbench.db`, append-only events plus derived daily rollups.

**The riskiest dependency in the whole project is whether hooks plus OTel carry tokens and cost in a usable shape. Prove it in Phase 0.**

---

## 9. Phasing

| Phase | Content | Done when |
|---|---|---|
| **0** | Repo, plugin skeleton, marketplace install. **Three spikes: (a) can a workflow resume from a prior artifact; (b) can `PreModelSwitch` interrupt a workflow; (c) do hooks + OTel carry cost.** Persona scope split | `/katz:hello` runs from a fresh install on a second machine; all three spikes answered |
| **1** | `/katz:brief`, `/katz:prd`, `/katz:panel`, `/katz:next`. Contracts, validators, gate hooks. Core personas ported | **Will's wife produces a PRD in a new project without touching a file** |
| **2** | Workbench v0 — hooks, store, `/katz:report` | A week of real use is queryable |
| **3** | `/katz:opportunity`, `/katz:market-research`, `/katz:brand-guide`, `/katz:roadmap`, `/katz:gtm`, `/katz:bugfix` | A product goes zero-to-roadmap through the plugin |
| **4** | `/katz:plan-feature` + `/katz:feature` — slices, worktrees, cross-model gates | A roadmap feature ships through it |
| **5** | Workbench v1 — server + persona editor. **Retire claude-team-cli** | A persona is tuned without opening an editor |
| **Later** | Live view; workflow editor; Routines; launching from the Workbench | Only on evidence |

`/katz:panel` is in Phase 1 deliberately — highest delight, lowest risk, and the fastest way to learn whether the premise holds.

**claude-team-cli is archived at the end of Phase 5**, not before: it has a live user, and she moves over during Phase 1.

---

## 10. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Dynamic workflows are new; behavior may change | High | Own no orchestration. Pin a minimum version. Keep workflows small so a rewrite is cheap |
| Cost telemetry does not exist in usable form | **High** | Phase 0 spike. If it fails, the Workbench is report-only over hook events, with no dollar figures |
| Workflow granularity wrong | Med | Start coarse; split on felt pain. Splitting later is cheap |
| Arbitration cannot interrupt a workflow | Med | Phase 0 spike. Fallback is a pre-declared budget ceiling — weaker, but functional |
| Workbench becomes a second product | High | Read-only. No launching. Live view and workflow editor gated behind evidence |
| Non-code artifacts have no real oracle | Med | Structural validators plus Will's review. Size those stages accordingly |
| Fun gets optimized away | Med | G7 is a goal. Panels and persona voice are the fun; protect them in review |
| User 2 abandons it after one bad failure | **High** | §7.11 is a Phase 1 deliverable, not a polish item |

---

## 11. Open questions

1. **Design phase handoff** — does Kai hand `/katz:feature` a mockup file or a written spec?
2. **`/katz:bugfix` phases** — shares `/katz:feature`'s phases, or stays separate?
3. **Workbench v3 authoring format** — JS directly, or a declarative spec that compiles? Only if v3 happens.
4. **History retention** — how far back to keep rollups. Daily granularity is cheap; raw events are not.
5. **Publish scope** — "write the file and commit," or marketplace versioning with changelogs?
6. **Public or private marketplace** — this is a personal toolchain, but the research and the panel design may be worth publishing.
