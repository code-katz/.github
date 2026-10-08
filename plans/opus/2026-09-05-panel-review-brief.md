# Panel Review — handoff brief

How to get an adversarial review of `PRD-code-katz.md` and `workbench-concepts.html` from other agents. This is `/katz:panel` executed by hand, on its own PRD.

---

## Mechanics

**Run each lens in its own session.** Not three lenses in one conversation — the second lens would read the first's argument and anchor to it, which is the exact failure the panel design exists to prevent. Three separate sessions, opened in `~/development/code-katz` so each can read the files directly.

**Use a different model per lens**, matching the PRD's own assignment. Set it with `/model` before pasting.

| Lens | Model | Why |
|---|---|---|
| Product | Opus 5 | Must hold the whole picture |
| Engineering | Fable 5.1 | Deepest reasoning; this is the lens most likely to find a structural flaw |
| UX | Sonnet 5 | Narrow, concrete, argues from the mockups |

**What to share, and when.** Give each lens only:

- `PRD-code-katz.md`
- `workbench-concepts.html`

**Do not give them `2026-09-05-agent-workflows-research-and-proposal.md` up front.** It contains the justification for every decision in the PRD, and a reviewer who reads it first will tend to ratify rather than test. Mention it exists and let them consult it *after* forming an initial view, to check whether a claim is supported. That ordering is the whole point.

---

## Lens 1 — Product

```
You are reviewing a PRD as a product lens. Read PRD-code-katz.md and open
workbench-concepts.html in this folder.

Context: a personal developer toolchain for two people — Will (technical) and
his wife (non-technical, has shipped several iOS apps with Claude). It turns
repeatable product stages into named commands.

Review for product soundness only. Stay in your lane: not implementation, not
visual design.

Answer these, in order:

1. Is this solving a real problem, or an interesting one? Name the strongest
   evidence in the doc that it is real, and the weakest.
2. Does it serve BOTH users, or is user 2 an afterthought dressed up as a
   priority? Journey J1 is the claim — assess whether the rest of the document
   actually honours it.
3. What is missing that a product person would insist on before build?
4. Which of the 12 commands would you cut, and why?
5. Phasing: is Phase 1 the right first slice? What would you ship first instead?

Then end with two things, both mandatory:

- THE STRONGEST ARGUMENT AGAINST YOUR OWN RECOMMENDATION.
- THE KILL CONDITION: state the specific, observable thing that would mean this
  should not be built at all, and say whether the document already shows it.

Be direct. A review where you agree with everything is a failed review.
```

---

## Lens 2 — Engineering

```
You are reviewing a PRD as an engineering lens. Read PRD-code-katz.md in this
folder. Skim workbench-concepts.html for what the UI implies about data.

Context: this is built entirely on Claude Code native primitives — dynamic
workflows, subagents, skills, hooks, plugins. It deliberately owns no
orchestration of its own.

Review for buildability and structural soundness. Stay in your lane: not
product strategy, not visual design.

Answer these, in order:

1. The design rests on claims about how Claude Code works. Verify the load-
   bearing ones against current documentation at code.claude.com/docs. Flag
   anything that is wrong, stale, or unverifiable. This is the most valuable
   thing you can do — the author verified against docs, not against runtime.
2. Phase 0 lists three spikes. Are they the right three? What fourth thing
   should be proven before building?
3. Where will this break in ways the doc does not anticipate? Be specific
   about the failure, not the category.
4. §7.5 runs slices in parallel git worktrees with a frozen interface
   contract. Is that sound, and is the contract as specified sufficient?
5. The workbench is read-only by constraint. Is that constraint stable, or
   will it break within a month of real use?

Then end with two things, both mandatory:

- THE STRONGEST ARGUMENT AGAINST YOUR OWN RECOMMENDATION.
- THE KILL CONDITION: the specific technical finding that would mean this
  should not be built as specified.

Cite doc URLs for anything you verify or refute.
```

---

## Lens 3 — UX

```
You are reviewing a PRD and a set of mockups as a UX lens. Open
workbench-concepts.html in this folder first and look at all five tabs, then
read PRD-code-katz.md — especially §6 (user journeys) and §7.11 (failure
handling).

Context: two users. Will is technical. His wife is not, and she is the harder
constraint — the doc states that where they conflict, she wins.

Review for whether these two people will actually succeed. Stay in your lane:
not architecture, not product strategy.

Answer these, in order:

1. Walk journey J1 as Will's wife. Where does she get stuck, confused, or
   quietly give up? Be specific about the moment.
2. §7.11 is the failure UX. Is it sufficient? What failure is not covered?
3. The mockups: five concepts. Which would you build, which would you delete,
   and what is missing from all five?
4. The colour system encodes model as hue and effort as shade. Does that
   actually communicate, or is it decoration? Consider accessibility.
5. "Building should be fun" is goal G7. Does this design deliver that, or
   does it make an enjoyable thing into an administered one?

Then end with two things, both mandatory:

- THE STRONGEST ARGUMENT AGAINST YOUR OWN RECOMMENDATION.
- THE KILL CONDITION: the specific usability finding that would mean this
  should not be built as specified.

Reference specific screens and journey steps, not general principles.
```

---

## Synthesis

Run last, in a fourth session, on **Opus 5**. Paste all three lens outputs.

```
Three independent reviews of the same PRD are below, from a product lens, an
engineering lens, and a UX lens. Each ran in isolation on a different model and
did not see the others.

Your job is to surface where they DISAGREE, not to resolve it.

Produce:

1. AGREEMENT — where all three concur. Flag this section as low-information:
   if they agree, either it is obviously true or all three share a blind spot.
   Say which you think it is.
2. DISAGREEMENT — every point where two lenses conflict. State both positions
   at full strength. Do not adjudicate.
3. THE THREE KILL CONDITIONS, verbatim. Then say whether the PRD already
   contains evidence that any of them is met.
4. UNIQUE FINDINGS — anything only one lens saw. These are often the most
   valuable and the easiest to lose in a summary.
5. WHAT NOBODY CHECKED — gaps none of the three covered.

Do not recommend a course of action. The decision is the author's.
```

---

## Reading the result

**If all three lenses agree, the panel failed.** The PRD's own §7.6 sets the threshold: above roughly two-thirds agreement, the panel is theater. That applies to this review too. Unanimous approval means the lenses were too similar, the prompts were too leading, or the reviewers were being agreeable — not that the document is good.

**The engineering lens is the one most likely to find something fatal**, because the whole design rests on documented behaviour that has not been tested against the runtime. Weight that lens accordingly.

**Bring the disagreements back here.** The research document holds the evidence behind each contested decision, and several of them were argued at length — the cost-versus-quality question on role pipelines, the choice against Agent Teams, the effort-before-model escalation order. A reviewer who reaches a different conclusion may be right, or may be missing a measurement.
