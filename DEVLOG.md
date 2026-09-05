# Code Katz — Development Log

A living record of architectural decisions, milestones, key insights, and strategic direction.
Auto-maintained via [claude-devlog-skill](https://github.com/code-katz/claude-devlog-skill). Entries are reverse-chronological.

---

## [2026-09-05] `ck` plugin phase-one PRD: gates in skills, spans in workflows, no UI yet

**Category:** `decision`
**Tags:** `ck`, `plugin`, `workflows`, `personas`, `prd`, `marketplace`
**Risk Level:** `medium`
**Breaking Change:** `no`

### Summary
Turned the 2026-09-05 agent-workflows research proposal into a phase-one PRD for a single code-katz plugin named `ck`: 21 persona subagents generated from team-cli profiles, `/ck:panel` (three lenses on three models) and `/ck:prd` (River-led, panel-challenged) end to end, one instrumentation hook, no UI. Both documents are committed under `plans/`.

### Detail

- **Proposal §8 resolved.** Q2 (granularity) decides the shape: a sign-off is a gate in a skill, the only place `AskUserQuestion` exists; each span between gates that needs fan-out is one plugin workflow; single-agent spans run inline. Docs quote: "For sign-off between stages, run each stage as its own workflow."
- **Fifteen corrections to the proposal** are recorded in PRD §3.3. The load-bearing ones: the plugin must be named `ck` because the command prefix is the plugin name; §5.5 (each lens on a different model) contradicts §5.6 (River, Toni, Kai all on Opus 5) and is resolved by a per-invocation override in `panel.js` only; seven personas left unassigned in §5.6 are placed on Opus 5; `TaskCompleted` and `Stop` hook gates are replaced by in-workflow validation; `PreModelSwitch` does not cover subagent fallback; the roster is 21, not 22.
- **Plugin, web app, wrapper, or dashboard:** plugin. `/workflows` is the run view. A phase-two `/ck:map` renders the catalog from workflow `meta`. A workbench, if ever, is local: the viewer may read from files, the editor must run the generator and tests before a commit. Never a hosted app with its own store of definitions.
- **Harness facts** were verified against code.claude.com docs and the pricing page on 2026-09-05. Sonnet 5's scheduled price increase was cancelled, so $2/$10 stands.

### Decisions Made
- **Marketplace publishing superseded for `ck` only.** team-cli's 2026-07-31 retirement stands for team-cli. `ck` accepts the two-character prefix because workflows and subagents need no shell CLI, and `/akira`, `launch`, and `session` stay on team-cli's install path.
- **Coexist, not retire.** `ck` is additive. Revisit at 90 days with the usage log the plugin ships.
- **All 21 personas port now; prune on evidence.** Generated from a vendored, pinned copy of team-cli profiles with a drift test. `## Required Interactive Behaviors` is rewritten mechanically to output form, because a subagent cannot ask.
- **Tiers change upstream first.** `tiers.conf` is the single source of truth. The §5.6 re-base is a prerequisite team-cli PR; `ck` copies the value verbatim.
- **New repo `code-katz/ck`, one plugin per repo,** as the eighth marketplace entry.

### Related
- PRD: `plans/2026-09-05-ck-plugin-prd-phase-1.md`
- Proposal: `plans/2026-09-05-agent-workflows-research-and-proposal.md`
- team-cli `ROADMAP.md` revision history, 2026-07-29 and 2026-07-31 (superseded for `ck`)

---

## [2026-03-22] Code Katz marketing plan fully executed: 20 blog posts, README overhauls, org infrastructure

**Category:** `milestone`
**Tags:** `marketing`, `content`, `medium`, `linkedin`, `readme`, `branding`
**Risk Level:** `low`
**Breaking Change:** `no`

### Summary
Executed the full Code Katz marketing and content plan in a single session — from Phase 0 (link hygiene) through Phase 3 (blog posts). All 6 repos now have consistent READMEs, header SVGs, cross-links, and standardized publish directories. 20 blog posts written, formatted for Medium, and published as GitHub Gists with embedded LinkedIn teasers.

### Detail

**Phase 0 — Link hygiene:** Replaced all `d6veteran` → `code-katz` GitHub URLs across 12 files in 6 repos. Committed and pushed.

**Phase 1 — Org infrastructure:**
- Set GitHub org display name, description, website via `gh api`
- Set repo descriptions and topics via `gh repo edit` × 6
- Created `.github` repo with org profile README and header SVG
- Pinned all 6 repos (required switching to "member" view in GitHub)
- Made `claude-todo-skill` public (was the only private repo)
- codekatz.com domain forward to GitHub (Squarespace Domain Forward — manual step, pending)

**Phase 2 — README & repo consistency:**
- Rewrote READMEs for plans-skill, todo-skill, and publish-agent (problem/audience/see-the-difference structure)
- Added "Works Well With" cross-link tables to all 6 READMEs
- Renamed team-cli "Companion Skills" → "Works Well With", added publish-agent as 5th companion
- Fixed `claude-dev-team` → `claude-team-cli` references in devlog and roadmap READMEs
- Restructured `publish/` directories: `publish/images/` for header SVGs, `publish/posts/` gitignored for draft content
- Consolidated 4 per-repo style guides into one unified style guide in `.github/style-guide.md`
- Assigned Soft Teal (`#7ab5b0`) as plans-skill accent color

**Phase 3 — Blog posts (20 total):**
- Team-CLI ACME Jet Packs series (Posts 0-11): reformatted Posts 2-3 for Medium (blockquotes → backticks, tables → bullets), wrote full conversations for Posts 4-10 from TODO stubs, expanded Post 11 to cover all 5 companion tools
- Companion repo intro posts (5): D-1, R-1, PB-1, P-1, T-1
- Proof-of-value posts (3): D-2, R-2, PB-2
- All 20 posts published as GitHub Gists via `claude-publish-agent`
- All posts have embedded `<!-- PUBLISHING -->` metadata with Medium topics, LinkedIn teasers, and first-comment templates

**Medium formatting conventions (established in prior session, applied here):**
- All dialogue (user + persona) in backticks for inline code rendering
- Speaker labels as bold on their own line
- No blockquotes for dialogue
- Tables converted to bullet lists (Medium doesn't support markdown tables)

### Decisions Made
- **Unified style guide over per-repo guides** — Consolidated 4 identical style guides into one at `.github/style-guide.md`. Eliminates drift and makes updates single-source.
- **`publish/images/` for committed assets, `publish/posts/` gitignored** — Header SVGs need to be in the repo for README rendering; draft posts should stay local. Split solves both.
- **Soft Teal for plans-skill** — Was the only repo without an accent color. Soft Teal (`#7ab5b0`) was unused as a primary accent.
- **LinkedIn teasers embedded in post files** — HTML comments in each post file keep publishing metadata co-located with content. Stripped on Medium import.
- **Org-level content in `.github` repo** — Style guide, marketing plans, and org-wide planning docs moved to `.github` as the canonical home for cross-project assets.

### Related
- Marketing plan: `plans/2026-03-21-marketing-messaging.md`
- Style guide: `style-guide.md`
- GTM docs: `claude-team-cli/gtm.md`, `claude-devlog-skill/gtm.md`, `claude-roadmap-skill/gtm.md`
