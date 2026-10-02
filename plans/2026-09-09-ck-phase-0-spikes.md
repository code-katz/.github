# `ck` Phase 0: spike results

> **Date:** 2026-09-09
> **Where:** the cloud session for pull request #5, Claude Code 2.1.266, a 4-CPU container, session model Sonnet 5 for the nested runs
> **How:** a throwaway `ck` plugin ([`plans/phase-0/ck-spike/`](phase-0/ck-spike/)) loaded with `--plugin-dir` into a nested, non-interactive Claude Code (`claude -p`), driven by three prompts. Raw results, trimmed to the fields that matter, are in [`plans/phase-0/results/`](phase-0/results/)
> **Cost:** under one dollar for all four runs
> **PRD:** [`plans/2026-09-05-ck-plugin-prd-phase-1.md`](2026-09-05-ck-plugin-prd-phase-1.md), §8.0 and §10.4

---

## 1. Answers

| # | Spike | Answer | Evidence |
|---|---|---|---|
| S1 | Install on a second machine; `/ck:next` runs | **Yes**, here by `--plugin-dir`, and on Will's MacBook Air on 2026-09-09 (Claude Code 2.1.266, Claude Max, Opus 5 session): `/ck:next` printed the line with the plugin path. The marketplace install of the real plugin: done on Will's MacBook Air on 2026-10-02 (Claude Code 2.1.267), `/plugin install ck@code-katz` then `/ck:next` in an empty project (ck drill 20) | Run A: `/ck:next` answered `NEXTSPIKE ok; plugin root is <the plugin directory>`, so the skill registered under the `ck` prefix and `${CLAUDE_PLUGIN_ROOT}` expanded in skill text |
| S2 | Inside a workflow, a persona agent runs on its frontmatter model, and `model` on the call overrides it | **Yes, both** | Run C2: the workflow's per-agent transcripts show `river` (frontmatter Haiku, no override) on `claude-haiku-4-5-20251001`; `toni` (frontmatter Haiku, call override Opus 5) on `claude-opus-5`; the neutral agent (no `agentType`, no `model`) on the session model `claude-sonnet-5` |
| S3 | Nested workflow: runs, and how consent behaves | **Runs, by name. In auto mode there is no prompt at all.** Will ran `/ck:spike-launch` three times in an interactive session in auto mode, the default permission mode; each launch showed "Allowed by auto mode classifier" and no consent prompt, for the outer or the nested workflow. What a manual-mode session shows is still unrecorded and only matters to users who turn auto mode off | Run C: `workflow({scriptPath: <plugin dir>/workflows/panel-spike.js})` was refused: "scriptPath must be a script path this tool returned, or a file you can already read (the working directory or a directory you have added)". Run C2: `workflow('ck:panel-spike', args)` ran the nested workflow and returned its result |
| S4 | `SubagentStart` hook stdin carries `agent_type` and `session_id`; `CLAUDE_PLUGIN_DATA` writable | **Yes** | Runs B and C2: stdin had `session_id`, `transcript_path`, `cwd`, `prompt_id`, `agent_id`, `agent_type` (`ck:river`, `ck:toni`), `hook_event_name`; the hook wrote `usage.jsonl` under `~/.claude/plugins/data/ck-inline/`. It fired for direct delegation and for agents inside the nested workflow |
| S5 | Review pages available in local Claude Code; a skill can read comments | **Yes, with conditions**, from the docs (`code.claude.com/docs/en/artifacts`, read 2026-09-09), and one observation that softens them: Will is on a Claude Max plan and has commented on his own private review pages from this project since 2026-09-08, so the owner of a page can comment on it on Max. The Team or Enterprise condition applies to sharing a page with other people | Artifacts: CLI 2.1.183 or later, or the desktop app 1.13576.0 or later; signed in with `/login`; Pro, Max, Team, or Enterprise; Anthropic API only. Comments: 2.1.221 or later to read, 2.1.228 or later to reply on its own, and "only an artifact you share within your organization takes comments", which the docs tie to Team and Enterprise plans. Claude replies to and resolves only threads sent to it. `/artifacts` lists pages; `Ctrl+]` reopens the latest |
| S6 | `PreModelSwitch` can arbitrate inside a workflow | **No** (answered in the PRD from the docs) | Not re-run |
| S7 | Web search inside a workflow, with and without `agentType` | **Yes**, in the cloud and on Will's machine (three local runs, each returned a URL from `WebSearch`) | Run C2: the neutral agent returned `searched: true, toolUsed: "WebSearch"` with a result URL from inside the nested workflow; the persona agents' transcripts list the tool as available. Re-check on Clare's network |
| S8 | Concurrency on Will's and Clare's machines | **Will's: 10 CPUs, so 8 agents at a time.** The eleven-agent `team` fan-out runs in two rounds there. Clare's is open | Here: 4 CPUs, so min(16, 4 minus 2) = 2 agents at a time; the three-agent nested run took 7.4 seconds of wall time here and 19 to 26 seconds on Will's laptop |

Open questions from PRD §10.4 answered on the way:

| # | Question | Answer |
|---|---|---|
| 3 | Does the Workflow tool accept `name: "ck:<workflow>"` for a plugin workflow? | **Yes.** Run C launched `ck:draft-spike` by name on the first attempt |
| 5 | Does the loader accept the extra `personas` key in `meta`? | **Yes.** Both spike workflows carry it and ran |
| 4 | Nested consent | Mechanics answered (by name); the prompt is the local check |
| 7, 8 | Review pages locally; web search | As S5 and S7 above |

## 2. The one design change

Nested workflows and the skills that launch them address the workflow **by name**, never by script path:

- In `draft.js`: `workflow('ck:panel', { ... })`, not `workflow({ scriptPath: pluginRoot + '/workflows/panel.js' }, ...)`.
- In `skills/prd/SKILL.md` and its siblings: `Workflow({ name: "ck:draft", args })`, not `scriptPath`.

Reason: the Workflow tool only accepts a `scriptPath` it returned itself or a file inside the working directory or an added directory. An installed plugin lives under `~/.claude/plugins/`, outside both. The PRD's §6.6, Appendix B, and Appendix E are updated; `pluginRoot` still travels in `args` because scripts read contracts and the roster from it.

## 3. What each run did

| Run | Prompt | What it showed |
|---|---|---|
| A | `/ck:next` | Skill registration; `${CLAUDE_PLUGIN_ROOT}` expansion; the `SessionStart` hook fired with `CLAUDE_PLUGIN_ROOT` and `CLAUDE_PLUGIN_DATA` in its environment |
| B | "Use the Agent tool with `subagent_type` `ck:river`" | The agent registered as `ck:river`; its reply began with the marker its profile demands; model usage listed Haiku, its frontmatter model; the `SubagentStart` hook fired and wrote `usage.jsonl` |
| C | `/ck:spike-launch` (nested by script path) | `name: "ck:draft-spike"` launched; the nested call by script path was refused with the error quoted in S3; no agents ran |
| C2 | `/ck:spike-launch` (nested by name) | The nested workflow ran three agents on three models, one of them making a web search; the hook logged both persona agents |
| Local 1 to 3 | `/ck:next`, then `/ck:spike-launch` three times, on Will's MacBook Air, interactive, auto mode | Same results as C2 on every run, 19 to 26 seconds each, about 114k tokens each (mostly cache reads); no consent prompt on any run |

Two things about the non-interactive runs, for anyone repeating them: `--dangerously-skip-permissions` is refused for the root user, so the runs used `--allowedTools "Workflow,Agent,WebSearch,WebFetch,Read,Glob,Grep,Bash"`; and `claude -p` warns when stdin is a terminal, so redirect it from `/dev/null`.

## 4. The local pass: what Will and Clare run

Everything below uses the same spike plugin. Copy `plans/phase-0/ck-spike/` somewhere local, then run each command from an empty folder that is a git repository.

| Check | Command | What to record |
|---|---|---|
| S1 on Clare's machine | `claude --plugin-dir <path>/ck-spike`, then type `/ck:next` | The line it prints. Then, once the real plugin is in the marketplace: `/plugin marketplace add code-katz/claude-plugins`, `/plugin install ck@code-katz`, `/ck:next`. Done on Will's machine 2026-09-09 |
| S3 consent | In an interactive session with the plugin loaded, type `/ck:spike-launch` | Done in auto mode on Will's machine: no prompt, three runs. Optional: press shift+tab to leave auto mode and run it once more to record what a manual-mode session shows |
| S5 plan | On Clare's account, in any session: `claude --version`, then ask Claude to publish a one-line page as an artifact and open it | Version 2.1.221 or later; whether the page offers comment mode; whether her plan is Team or Enterprise |
| S8 CPUs | `sysctl -n hw.ncpu` on macOS, `nproc` elsewhere | The number; concurrency is the smaller of 16 and that number minus 2. Will's: 10, so 8. Clare's: open |

When Clare's Claude Code version and CPU count are recorded, Phase 0 is complete and the build starts from PRD §8.1.

## 5. What the spike plugin is

Ten files, no persona text from the real profiles:

- `agents/river.md`, `agents/toni.md`: frontmatter `model: claude-haiku-4-5-20251001`, a one-line body that makes the agent start every answer with a marker word.
- `skills/next/SKILL.md`: prints one fixed line containing `${CLAUDE_PLUGIN_ROOT}`.
- `skills/spike-launch/SKILL.md`: tries `Workflow({ name: "ck:draft-spike" })`, falls back to `scriptPath`, and reports as one JSON object.
- `workflows/panel-spike.js`: two persona agents in parallel (one overridden to Opus 5) and one neutral web-search agent; `meta` carries `personas`.
- `workflows/draft-spike.js`: nests `panel-spike` by name and returns its result.
- `hooks/hooks.json`, `scripts/usage-log.sh`, `scripts/check-prereqs.sh`: log what the two hooks receive to `$CK_SPIKE_LOG_DIR` (default `/tmp/ck-spike-logs`), and write `usage.jsonl` under `CLAUDE_PLUGIN_DATA`.
