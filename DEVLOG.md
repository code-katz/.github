# Code Katz — Development Log

A living record of architectural decisions, milestones, key insights, and strategic direction.
Auto-maintained via [claude-devlog-skill](https://github.com/code-katz/claude-devlog-skill). Entries are reverse-chronological.

---

## [2026-09-09] `ck` PRD revision 3 after Will's review: `ck` independent, the full definition pipeline in phase one, Fable tier restored, Workbench committed as phase three

**Category:** `decision`
**Tags:** `ck`, `prd`, `review`, `clare`, `pipeline`, `model-tiers`, `workbench`
**Risk Level:** `medium`
**Breaking Change:** `no`

### Summary
Will reviewed revision 2 of the `ck` phase-one PRD on its review page and left sixteen comments. Revision 3 is a rewrite, not a patch: the old team tool is out of the picture, Clare is the primary user with two named journeys, every path is written against `<project-repo>`, six judgment seats return to Fable 5.1, phase one grows from four commands to the whole product-definition pipeline plus a design step, the Workbench is committed as phase three, and every review goes through Claude's built-in comment system. Each comment and the decision it drove is recorded in PRD §3.4.

### Detail

- **`ck` is independent.** Every coexistence and retirement passage is gone. `ck` owns `profiles/` and `tiers.conf` after a one-time import; there is no vendored copy, lock, or sync script. Uninstalling the old tool is a prerequisite, with a `SessionStart` hook that warns in plain words while it remains.
- **Clare, not "Will's wife".** Proficient with the current tool, runs many sessions at once, and her learnings drive the rebuild. Her failure mode is inconsistency, not error text. J1 (idea to definition) and J2 (feature to design mockups, the same way every time) are the acceptance journeys; efficiency (fewer sessions and hand-offs) is a goal with a measure.
- **Phase one is the pipeline:** `/ck:opportunity`, `/ck:market-research`, `/ck:brief` (with a market pass), `/ck:prd`, `/ck:team` (roles and responsibilities), `/ck:roadmap`, `/ck:architecture`, `/ck:brand-guide` (proposals, finalists, guide; modelled on the NIGHTGRID process and the d20Mob guide), `/ck:design`, plus `/ck:panel`, `/ck:next`, and 21 persona switch commands. Ten document contracts. One drafting engine (`draft.js`) serves the PRD and the architecture document. Four scripts written in full; five to the stage level.
- **Models:** Fable 5.1 for River, Akira, Morgan, Sage, Jordan, Reiner; Opus 5 for the eleven craft seats; Sonnet 5 for the four execution seats; Haiku for validators. The panel default is River on Fable, Toni on Opus, Kai moved down to Sonnet; the one override moves a lens down, never up.
- **Reviews:** Claude's built-in review and comment system, in the desktop app or at claude.ai. Every review page carries the five how-to-comment steps in its banner, because the first one did not and could not be commented on.
- **Phase two:** `/ck:feature` (explained; open for Will to pull forward), `/ck:bugfix`, `/ck:gtm`, Routines, `/ck:map`, `/ck:report`. **Phase three:** the Workbench, a rewrite replacing the conductor dashboard, local, never a hosted store.

### Decisions Made
- **Treat `ck` as a replacement, built independently; require the old tool's removal.** Will, 2026-09-08.
- **Fable where judgment matters, Sonnet where volume matters.** Three persona tiers; stage tiers for research, validation, and synthesis.
- **The document is the state, under `<project-repo>/docs/`.** The cache directory holds nothing a document depends on.
- **The Workbench will be built** as phase three, after phase one has run on a real product.

### Related
- PRD revision 3: `plans/2026-09-05-ck-plugin-prd-phase-1.md` (§3.4 for the comment-by-comment record)
- Panel memo, §8 added for the superseded items: `plans/2026-09-05-ck-prd-panel-memo.md`

---

## [2026-09-05] `ck` PRD revised after a cross-model panel: nine changes adopted, eleven rejected with reasons; review pages become the feedback channel

**Category:** `decision`
**Tags:** `ck`, `prd`, `panel`, `cross-model-review`, `user-2`, `review-pages`
**Risk Level:** `medium`
**Breaking Change:** `no`

### Summary
Will shared a PRD for the same plugin written by Opus, with a hand-run panel brief and five workbench mockups. Fable took the brief's engineering lens and verified the Opus PRD's load-bearing claims against the docs and the repos. Result: the `ck` PRD stays the base; nine changes are ported from the Opus PRD; eleven of its claims are rejected with the reason recorded. Will's new rule for feedback (review pages with comments; mockups as labeled variants) is written into the PRD. Record: `plans/2026-09-05-ck-prd-panel-memo.md`.

### Detail

- **Biggest finding against the `ck` PRD:** it named Will's wife as customer zero and then designed for Will (a ten-question interview, model names in a prompt, a hidden run directory). The Opus PRD made her the harder constraint. The `ck` PRD now has a users table, her journey, three failure rules (no stack trace, model name, or token count; always name the file holding the work; always one next action), and a done criterion: she produces a PRD on a new project without a text editor or `.ck/`.
- **Shape changes:** `/ck:brief` added before `/ck:prd`; the interview is optional; the review is a page with comments or a file edit; documents live at fixed committed paths (`docs/brief.md`, `docs/PRD.md`, `docs/decisions/`); the run directory is a cache; workflows accept a start-at stage; `/ck:next` promoted to phase one; a Phase 0 of six spikes; each panel lens reads its own evidence and sees the author's rationale only after forming a view; effort is set per workflow stage, never per persona.
- **Verified errors in the Opus PRD:** it says workflows cannot call workflows (they can, one level); it pauses a running workflow to ask about escalation (workflows accept no mid-run input, and its own principle P6 says so); its quota fallback hangs on a hook that fires only on a requested session model switch; its gates use the wrong hook for subagents; it retires team-cli at Phase 1 in one place and Phase 5 in another; it counts 22 personas (21); it retires `TODOS.md`, a shipped plugin; its workbench edits the installed plugin copy, which updates overwrite; it ignores conductor's existing cost parser.
- **Panel health:** one lens ran, so no agreement rate. The memo follows the brief's format anyway so the gaps show.

### Decisions Made
- **Base document: the `ck` PRD.** Engineering-complete, verified, family-aware. Product thinking ported from Opus.
- **The artifact is the state.** Fixed, conventional, committed paths; the plugin keeps nothing the deliverable depends on.
- **Review pages are the feedback channel** (Will's rule). A private page with comments per review; Claude holds and resolves every comment after "done"; mockups as labeled variants side by side; a file-edit path always remains.
- **`PreModelSwitch` arbitration: answered no.** Recorded as Phase 0 spike S6 with the docs citation, so it is not re-litigated.

### Related
- Panel memo: `plans/2026-09-05-ck-prd-panel-memo.md`
- Opus inputs, verbatim: `plans/opus/`
- Revised PRD: `plans/2026-09-05-ck-plugin-prd-phase-1.md`

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
