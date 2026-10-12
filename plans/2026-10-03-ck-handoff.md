# `ck` handoff: from the cloud session to Will's local sessions

> **Date:** 2026-10-03
> **For:** the Claude Code session in the desktop app on Will's Mac that continues this work. Read this first, then the documents it names.
> **Written by:** the cloud session that built and drilled the plugin (its record: the PRD's §3 and §10, the drill logs, and `DEVLOG.md`)

---

## 1. Where things are

| What | Where | State |
|---|---|---|
| The plugin | `code-katz/ck`, branch `main`, version 0.1.2 | Every phase-one command built, drilled, and measured; installed on Will's Mac from the marketplace |
| The marketplace | `code-katz/claude-plugins`, `main`, 1.4.1 | The `ck` entry installs over HTTPS |
| The specification | `code-katz/.github`, branch `claude/code-katz-plugin-prd-34gbso`, PR #5 (draft) | `plans/2026-09-05-ck-plugin-prd-phase-1.md`, revision 3, with every measured cost in Appendix I; merge PR #5 to put it on `main` |
| The drill logs | `code-katz/ck`, `tests/drill/2026-09-09.md`, `2026-10-01.md`, `2026-10-02.md`, `2026-10-03.md` | Drills 1 to 21, each with cost per agent and what changed because of it |
| The real project | `~/development/ck-test` on Will's Mac, a git repository with nothing committed yet | `docs/opportunity.md` finished and reviewed (verdict: worth doing smaller; build the usage hook and `/ck:report` first). Next: `/ck:brief`, then `/ck:prd` |
| Will's Mac | Claude Code 2.1.288, Claude Max, Opus 5.5 session, 10 CPUs | The old team tool's persona skills (`akira`, `alex`, `casey`, `cornelius`, `devlog`, and so on) still show under Skills in `/plugin`; remove them per the README's uninstall steps when convenient |

## 2. Standing rules, from Will

1. **Propose, do not assume.** At "done" on a review, list one proposed change per comment and wait for yes, no, or a correction. Change nothing before that. (2026-10-03, after three comments were applied unasked and one misread.)
2. **One thing at a time.** When Will has to do something, give one instruction, wait for the result, then the next.
3. **Local, not cloud.** Will and Clare run Claude Code on their Macs. Review pages are commented on without "send to Claude"; the local session reads the comments at "done". A comment sent to Claude wakes a cloud session that cannot see the file.
4. **Keep Fable** on River's PRD stages; the PRD is the kickoff's most important step and $8 is accepted. Spend on drills is reported plainly against the estimate.
5. **Plain language**, numbered and organized; reduce jargon.
6. Every document for review is a page with the comment steps in its banner; galleries are labeled variants side by side.

## 3. What is next, in order

1. **Step 3, the real-product run** (PRD §2.3, J1): `/ck:brief`, `/ck:prd`, `/ck:team`, `/ck:roadmap`, `/ck:architecture`, `/ck:brand-guide` on `ck-test`, Will reviewing each page. Then Clare's J2: `/ck:design` on one PRD requirement, twice, the same way. Record each as a drill: cost from `/workflows` or the run journal, what the review changed, what broke.
2. **Clare's machine**: `/plugin marketplace add code-katz/claude-plugins`, `/plugin install ck@code-katz`, `/ck:next`; record `claude --version` and `sysctl -n hw.ncpu` (the last two Phase 0 items).
3. **The panel question**: four runs, four unanimous yes-if verdicts. Will has not decided; a question that forces a stance is the proposal (PRD §10.4, question 10).
4. **Phase two** (PRD §10.2): `/ck:feature` once step 1 has produced a PRD, an architecture, and a design spec.

## 4. How the plugin is developed locally

1. Clone `code-katz/ck`; edit `profiles/`, `workflows/`, `skills/`, `scripts/`; run `bash scripts/generate.sh` after a profile change and `bash tests/run.sh` before every commit (133 checks). Bump `version` in `.claude-plugin/plugin.json` in the same commit as any change under `profiles/`, `agents/`, `skills/`, `workflows/`, `tiers.conf`, or `hooks/`.
2. Branch, pull request, Will merges. Then on the Mac: `/plugin`, Installed, `ck`, Update, then `/reload-plugins`.
3. A drill is one command run end to end on a fixture or the real project, with the cost per agent read from the run journal under `~/.claude/projects/<project>/<session>/subagents/workflows/<wf_id>/` (each `agent-*.jsonl` carries `model` and `usage` per assistant message; `journal.jsonl` maps agent ids to labels). Write it up under `tests/drill/<date>.md`.
4. Keep the PRD in step: its cost table (Appendix I) beside every estimate, its §6 stage tables when a workflow's shape changes, and its Appendices A to D as verbatim copies of `panel.js`, `brief.js`, `draft.js`, and `team.js`.

## 5. What the measurements say, in one paragraph

A document costs roughly what the PRD estimated when it is written once; every overrun was a stage that wrote it again, hand-built a page, or checked its own output. The rules that fixed it, now in every script: an author writes the file with one Write call and returns, a checker runs next; a revision is at most ten edits and never counts or checks; pages are rendered from files by `render-review.py` and `render-gallery.py`; the rewrite after a panel is checked for length. Measured after the fixes: PRD about $4 for the draft pass, market research $7.10, opportunity about $9, design $9.90, team $6.29, roadmap $1.93, brand guide $7.82, architecture $15.87 (before the post-rewrite check).
