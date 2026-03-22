# Code Katz — Development Log

A living record of architectural decisions, milestones, key insights, and strategic direction.
Auto-maintained via [claude-devlog-skill](https://github.com/code-katz/claude-devlog-skill). Entries are reverse-chronological.

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
