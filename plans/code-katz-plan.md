# Code Katz — Marketing, Messaging & Content Plan

## Context

Code Katz is a suite of 6 open-source Claude Code extensions under github.com/code-katz. The flagship (claude-team-cli) has strong positioning, a full GTM doc, and a 12-post blog series in progress (handled separately). The other 5 repos range from "decent" to "reads like a man page." The GitHub org page is completely blank. The goal: unify the messaging, fill the gaps, and build a content engine that projects technical credibility on LinkedIn and Medium — all in one voice. The team-cli blog series (Posts 4-11) is out of scope for this plan.

---

## Phase 0: Link Hygiene (do first)

14 references to `d6veteran` remain across repos. Fix all to `code-katz`.

**Files to update:**
- `claude-devlog-skill/SKILL.md` (line 143)
- `claude-devlog-skill/DEVLOG.md` (lines 19, 40)
- `claude-roadmap-skill/SKILL.md` (line 197)
- `claude-roadmap-skill/DEVLOG.md` (lines 4, 24, 50)
- `claude-plans-skill/README.md` (lines 73-74)
- `claude-plans-skill/DEVLOG.md` (line 4)
- `claude-todo-skill/DEVLOG.md` (line 4)
- `claude-publish-agent/DEVLOG.md` (line 4)
- `claude-publish-agent/tests/test_cli.py` (lines 95, 107 — test fixture URL)

---

## Phase 1: GitHub Organization Page

### Org Settings (via `gh api` or github.com/organizations/code-katz/settings)

| Field | Value |
|---|---|
| Display Name | Code Katz |
| Description | Open-source Claude Code extensions — specialists, memory, and publishing for AI-assisted development. |
| Website | https://codekatz.com |
| Avatar | Current avatar exists. Consider updating to the paw logo mark from the badge artwork. |

### Pinned Repos (2x3 grid, reading order)

1. claude-team-cli (flagship, entry point)
2. claude-devlog-skill (strongest companion)
3. claude-roadmap-skill (pairs with devlog)
4. claude-publish-agent (different category, shows breadth)
5. claude-plans-skill
6. claude-todo-skill (lightest tool, easy on-ramp)

### Repo Descriptions (set via `gh repo edit`)

| Repo | Description |
|---|---|
| claude-team-cli | Ten named AI specialist personas for Claude Code — product, backend, frontend, security, data, DevOps, QA, marketing, and PM. Your AI dev team. |
| claude-devlog-skill | Stop rebuilding context every Claude session. Maintains a DEVLOG.md — decisions, milestones, and reasoning that survive session boundaries. |
| claude-roadmap-skill | Your product roadmap, always current, always explained. Maintains ROADMAP.md with live priorities and revision history. |
| claude-plans-skill | Find that plan you wrote three months ago. Archives Claude Code plans to a named, indexed, searchable archive. |
| claude-todo-skill | Capture ideas without leaving Claude Code. Per-project TODOS.md — say /todo, type the thought, done. |
| claude-publish-agent | Write in Claude Code, publish to Medium. Markdown to Gist to import — formatting intact, content on-brand. |

### Repo Topics (set via `gh repo edit --add-topic`)

All repos: `claude-code`, `claude`, `ai-development`, `developer-tools`, `open-source`

Per-repo additions:
- team-cli: `ai-agents`, `cli`, `bash`, `personas`
- devlog: `devlog`, `session-context`, `architectural-decisions`
- roadmap: `roadmap`, `product-planning`, `prioritization`
- plans: `plan-archival`, `knowledge-management`
- todo: `todo`, `task-management`
- publish: `medium`, `publishing`, `markdown`, `python`

### Org Profile README

Create `code-katz/.github` repo with `profile/README.md`:

**Structure:**
1. Code Katz header SVG (create new, 1280x320, Charcoal bg, "Code Katz" in Poppins Warm White, tagline in Mid Gray)
2. One-liner: "Specialists, memory, and direction for Claude Code."
3. Suite overview — one sentence per tool, benefit-led, linked
4. Quick Start — install all six in one code block
5. "The Story" — 2-3 sentences establishing the author. Imply seniority without naming employer: "Built by an engineer working on large-scale systems who got tired of re-explaining the same decisions every session." LinkedIn profile already shows NVIDIA — no need to repeat it here. Link to Medium series.
6. MIT Licensed | codekatz.com

---

## Phase 2: README & Repo Consistency

### Unified Voice Standard

The Code Katz voice across all repos:
- **Conversational but precise** — senior engineer explaining to a colleague over coffee
- **Pain-first, then solution** — always open with the problem in the reader's language
- **Before/after as proof** — every repo needs a "See the Difference" section
- **Second person, present tense** — "You open Claude Code..." not "Users can leverage..."
- **Specific over abstract** — name the JWT choice, the HIPAA constraint, the known bug
- **No exclamation points in headings** — confidence is in the substance

### README Template (standard section order)

1. Header SVG (centered)
2. Project name (H1)
3. Tagline (blockquote, one sentence, benefit-led)
4. Badges (MIT, Works with Claude Code, type badge)
5. ---
6. The Problem (pain-first, 2-3 paragraphs)
7. Who This Is For (1-2 paragraphs, names audience)
8. See the Difference (before/after dialogue)
9. How It Works / What It Does
10. Installation
11. Usage
12. Works Well With (cross-link table to all 6 repos)
13. Repository Contents
14. License

### Per-Repo Changes

#### claude-plans-skill — FULL REWRITE

**Current:** No tagline, no audience, no before/after, no badges, no header SVG.

- **Tagline:** "Find that plan you wrote three months ago."
- **Problem:** Claude Code plan mode output goes to random slug files in `~/.claude/plans/`. No project association, no index. Charming names. Not searchable.
- **Audience:** Developers who use plan mode regularly across multiple projects. Works alongside devlog (plans = "how before execution"; devlog = "what was decided and why").
- **Before/after:** Generic Claude says "I don't have access to previous plans." With skill: finds it by name, shows status, original slug, offers to load full plan.
- **Create:** Header SVG (Soft Teal `#7ab5b0`), style guide, badges

#### claude-todo-skill — PARTIAL REWRITE

**Current:** Decent hook but no badges, no header SVG, no formal audience section, incomplete cross-links.

- **Tagline:** "Capture ideas without leaving Claude Code."
- **Audience:** Developers who think of things mid-session and lose them by next session. Lightest tool in the suite — no structure, no categories, no overhead.
- **Improvements:** Add badges, header SVG (Warm Tan `#c4a882`), expand "Works Well With" to all 6 repos, add formal before/after section
- **Create:** Header SVG, style guide, badges

#### claude-publish-agent — MESSAGING OVERHAUL

**Current:** Clinical, feature-led. Opens with `pipx install`. No problem statement, no audience, no before/after.

- **Tagline:** "Write in Claude Code. Publish everywhere."
- **Problem:** You wrote a blog post in Claude Code. Now you copy-paste to Medium, fix broken formatting, discover the API is closed. This tool handles the mechanics.
- **Audience:** Developers who write technical content in markdown and want a publish workflow without copy-paste gymnastics.
- **Before/after:** Manual copy-paste-fix-publish cycle vs. one `claude-publish gist` command.
- **Tone fix:** Match team-cli voice. Currently reads like a man page.
- **Dev docs:** Move Development section (clone, install dev, pytest) to a new `CONTRIBUTING.md`. Keep README focused on the user, not the contributor.

#### claude-devlog-skill & claude-roadmap-skill — MINOR UPDATES

- Add "Works Well With" cross-link table (currently only reference each other + team-cli)
- Update "Who This Is For" to reference the full suite
- Fix `d6veteran` links

#### claude-team-cli — MINOR UPDATE

- Update Companion Skills intro text from "two companion skills" to "four companion skills" (already done in table, but the paragraph above the table still says "two")

### Cross-Linking: "Works Well With" Table

Every repo gets this section (omitting its own row):

| Tool | What it adds |
|---|---|
| claude-team-cli | 10 specialist personas |
| claude-devlog-skill | Decision memory across sessions |
| claude-roadmap-skill | Priority tracking with revision history |
| claude-plans-skill | Plan archive and retrieval |
| claude-todo-skill | Lightweight task capture |
| claude-publish-agent | Publish markdown to Medium |

### Accent Color Assignments (finalized)

| Repo | Color | Hex |
|---|---|---|
| claude-team-cli | Rust Orange | `#d97757` |
| claude-devlog-skill | Slate Blue | `#6a9bcc` |
| claude-roadmap-skill | Sage Green | `#788c5d` |
| claude-publish-agent | Muted Purple | `#8b7eb8` |
| claude-plans-skill | Soft Teal | `#7ab5b0` |
| claude-todo-skill | Warm Tan | `#c4a882` |

---

## Phase 3: Blog Post Plan

### Sizing

Team-cli has 12 posts (10 personas + intro + skills recap). Skills are single-purpose tools — they need 1-2 posts each. Publish-agent is slightly more complex — 2-3 posts. **Total: 8-9 new posts across 5 repos.**

### Post Plan

#### claude-devlog-skill (2 posts)

| Post | Title | Words | Status |
|---|---|---|---|
| D-1 | "Stop Rebuilding Context" | 800-1000 | **Published** 2026-03-26 |
| D-2 | "The Devlog Entry That Saved Me a Week" | 600-800 | New — real-world narrative proof-of-value |

#### claude-roadmap-skill (2 posts)

| Post | Title | Words | Status |
|---|---|---|---|
| R-1 | "Your Roadmap Should Remember Why" | 800-1000 | Draft exists in `gtm.md` — edit and publish |
| R-2 | "Six Weeks Later, Someone Asked Why" | 600-800 | New — revision history saves a decision |

#### claude-plans-skill (1 post)

| Post | Title | Words | Status |
|---|---|---|---|
| P-1 | "Find That Plan You Wrote Three Months Ago" | 600-800 | New |

#### claude-todo-skill (1 post)

| Post | Title | Words | Status |
|---|---|---|---|
| T-1 | "The Best Place to Capture a Dev Idea Is Where You Already Are" | 500-700 | New |

#### claude-publish-agent (2-3 posts)

| Post | Title | Words | Status |
|---|---|---|---|
| PB-1 | "Write in Claude Code, Publish Everywhere" | 800-1000 | New — full workflow intro |
| PB-2 | "How I Publish a Blog Post in 90 Seconds" | 600-800 | New — meta post ("the tool that published this series") |
| PB-3 | "The Content Kit: Keeping Your Technical Blog On-Brand" | 600-800 | Stretch — only if PB-1/2 get engagement |

### Writing Priority (what to write first)

1. **PB-1** — Publish-agent intro. Unblocks everything: once published, every future post can say "published using claude-publish-agent." Forces the README messaging to be nailed down.
2. **D-1** — Devlog intro. Already drafted in GTM. Minimal editing. Universal pain point.
3. **R-1** — Roadmap intro. Already drafted in GTM. Publish same week as D-1 (Tue/Thu pair).
4. **P-1 + T-1** — Short, focused, complete the suite story.
5. **D-2, R-2, PB-2** — Proof-of-value narratives. Write as engagement warrants.

### Publishing Cadence

Continue the team-cli 2x/week Tue/Thu cadence after the team-cli series completes:

| Week | Tuesday | Thursday |
|---|---|---|
| Post-series Week 1 | PB-1 (publish-agent) | D-1 (devlog) |
| Week 2 | R-1 (roadmap) | P-1 (plans) |
| Week 3 | T-1 (todo) | — (let it settle) |
| Week 4+ | D-2, R-2, PB-2 | As engagement warrants |

### Connection to Team-CLI Series

- Update team-cli Post 11 ("The tools that make the team remember") to reference all 4 skills + publish-agent
- Each new post opens with a callback: "Part of the Code Katz suite — the same toolkit behind the claude-team-cli series."
- PB-2 explicitly positions as "the tool that published every post in this series"
- LinkedIn teasers follow the same template from `gtm.md` (hook → before/after → so-what → engagement question → first comment with links)

---

## Execution Sequence

| Phase | Action | Scope |
|---|---|---|
| **0** | Fix all `d6veteran` → `code-katz` links | 14 occurrences, 8 files, 6 repos |
| **1a** | Set org name, description, website, avatar | GitHub org settings |
| **1b** | Set repo descriptions and topics | `gh repo edit` × 6 |
| **1c** | Create `.github` repo with org profile README | New repo |
| **1d** | Pin repos in recommended order | GitHub org settings |
| **2a** | Create header SVGs for plans-skill and todo-skill | 2 new SVGs |
| **2b** | Rewrite plans-skill README | Full rewrite |
| **2c** | Update todo-skill README | Add tagline, badges, audience, before/after |
| **2d** | Overhaul publish-agent README | Messaging rewrite |
| **2e** | Add "Works Well With" table to all 6 READMEs | 6 edits |
| **2f** | Fix team-cli "two companion skills" text | 1 edit |
| **2g** | Minor updates to devlog + roadmap READMEs | Cross-links, audience |
| **3a** | Write PB-1 (publish-agent intro post) | New content |
| **3b** | Edit + publish D-1 and R-1 from GTM drafts | Existing drafts |
| **3c** | Write P-1 and T-1 | New content |
| **3d** | Update team-cli Post 11 scope | Existing TODO draft |
| **3e** | Write proof-of-value posts as engagement warrants | D-2, R-2, PB-2 |

---

## Verification

- After Phase 0: `grep -r "d6veteran" code-katz/` returns zero results
- After Phase 1: Visit github.com/code-katz — org name, description, website, pinned repos all visible; profile README renders correctly
- After Phase 1: Each repo card in the org page shows a benefit-led description
- After Phase 2: All 6 READMEs follow the template, have header SVGs, badges, before/after sections, and "Works Well With" cross-links
- After Phase 3: Posts render correctly on Medium via `claude-publish gist`; LinkedIn teasers link back to Medium and repos
