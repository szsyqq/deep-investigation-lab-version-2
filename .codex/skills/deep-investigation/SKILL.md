---
name: deep-investigation
description: Run evidence-led investigations from an open-ended Chinese or English request through research classification, source collection, claim mapping, editorial revision, visual planning, validation, and publication in Deep Investigation Lab V2. Use when Codex is asked to investigate or deeply research a company, institution, person, product, industry, event, policy, trend, controversy, or social topic, or to revise/publish an existing investigation in this repository.
---

# Deep Investigation

Produce a complete report through a simple seven-stage lifecycle. Keep each report isolated under `content/reports/<slug>/`; use the shared site renderer. The user should see the report-production stages, while evidence mapping and validation remain background controls.

## Quality hierarchy

1. Accuracy and professional evidence discipline are the primary gate. Use only data, quotations, documents, and events that can be traced to accessible sources; never invent, silently extrapolate, or turn an inference into a fact.
2. Readability, ease of understanding, and reader attraction are important editorial goals, but they operate inside the accuracy boundary. Improve them through selection, sequence, explanation, scenes, and verified contrast—not fabricated detail or overstated certainty.
3. A readable but unsupported passage fails. A fully sourced but opaque data dump also requires revision.

## Start

1. Read `AGENTS.md`.
2. Read `references/research-routing.md`.
3. Run `npm run research:new -- "<user request>"` unless the report package already exists.
4. Open the generated `brief.json`.
5. For a revision, also read `references/revision-protocol.md`, `references/editorial-learning-loop.md`, `workflow-state.json`, `editorial-state.json`, `draft.md`, and `revisions.md`.
6. Before outlining, drafting, or structurally revising prose, read `references/editorial-writing-contract.md`.
7. Before converting collected material into core questions or an outline, read `references/question-distillation.md`.

## Execute the seven production stages

### Stage 1: Intake and route

Classify the work as `entity` or `topic`. Complete the core question, time/geographic scope, exclusions, subquestions, and disconfirming evidence. Do not draft conclusions.

### Stage 2: Discussion and iterative research

Convene the editorial roles: lead editor, subject analyst, investigator, skeptical reviewer, data editor, and reader representative. After the first meaningful source collection, run the reader, market/system, and controversy/disconfirmation lenses in `references/question-distillation.md`. Record their evidence-tagged observations and a three-to-five-question integrated list in `discussion.md`.

Research comprehensively using current primary sources first. Record every material source in `evidence-ledger.json` and preserve source working material under `sources/`. Record each research loop in `research-notes.md` and `workflow-state.json.researchLoops`. Preserve conflicting evidence; do not silently choose the convenient version. Continue until the core questions, mechanisms, counterarguments, and important uncertainties are sufficiently covered.

Do not lock the outline until the integrated questions state reader value, tension, evidence IDs, gaps, disconfirmation, and answerability. Treat unsourced panel observations as research leads, never as article facts.

### Stage 3: Outline and source dossier

Create `claim-map.json` and `outline.md`. Separate:

- `fact`: directly supported;
- `analysis`: reasoned interpretation;
- `unverified`: unresolved;
- `forecast`: conditional future statement.

Every publishable claim needs evidence IDs. Add counterevidence and confidence. Give every proposed section one responsibility, one core conclusion, and its evidence IDs.

### Stage 4: Prose-first draft

Write a complete, continuous article in `draft.md` before designing the page. Use a claim-led narrative, not a checklist of business dimensions. If drafting reveals an evidence gap, return to Stage 2. If new material changes the claim or section responsibility, revise `outline.md` before rewriting prose.

Before drafting each section, establish its question, mechanism, evidence, counterevidence or alternative explanation, bounded conclusion, and transition. Do not use eloquence, celebrity opinion, or generic uncertainty language as a substitute for missing analysis.

When a visual would materially reduce comprehension cost, insert a standardized visual-planning blockquote at the intended position in `draft.md`. State the visual ID, insertion point, content, editorial question, visual type, evidence IDs, rejected forms, and production status. This is a document-stage marker, not authorization to render or publish the visual.

### Stage 5: Visual editing

Read `references/visual-planning.md`. For every candidate visual:

1. state the editorial claim;
2. state the reader takeaway;
3. determine whether visualization lowers comprehension cost;
4. select the relationship pattern;
5. select a component last.

Use `prose-only` when evidence or relationship is insufficient. Never impose a chart quota.

Keep every document-stage marker synchronized with `visual-plan.json`. Add a visual ID to `publication.json.sections[].visualIds` only after the visual is approved for rendering; planned placement alone must not create a website chart.

### Stage 6: Review and analyst revision

Review in order: source accessibility and factual support; professional interpretation and evidence boundaries; narrative structure, readability, reader attraction; visual usefulness and mobile readability. Record findings in `review.md`. Do not approve later qualities to compensate for a failure of accuracy.

Classify every analyst request before editing: evidence update, local rewrite, structural revision, or full rewrite. Integrate changes into a coherent whole rather than appending a patch. Record the request, classification, affected scope, final decision, and analyst confirmation in `revisions.md` and `editorial-state.json`.

After recording the decision, run the editorial learning loop. Promote an explicit global instruction immediately. Promote a repeated transferable pattern after the threshold in `references/editorial-learning-loop.md` is met. Keep report-specific choices local. Add or update a regression check whenever the promoted rule is deterministic.

### Stage 7: Internal preview and publication

Complete `publication.json`, retaining evidence mappings. First set the report to `internal-preview` and show its preview label and unresolved questions. Formal publication requires explicit analyst approval and a status change to `approved` or `published`. Add or update a route through shared components. Never create a standalone report framework or copy global CSS/JS into a report.

Run:

```bash
npm run research:validate
npm test
npm run build
```

Fix failures before describing the report as publishable. Use `npm run research:advance -- <slug> --to=<stage-or-status>` to update machine-readable workflow or publication state. Record explicit analyst approval with `npm run research:approve -- <slug> "<approval note>"` before changing status to `published`.

## Revision discipline

Classify the request before editing:

- evidence update;
- local rewrite;
- structural revision;
- full rewrite.

Respect `approvedSections` and `lockedFacts`. Append a concise decision to `editorial-state.json` whenever a human accepts, changes, or rejects an AI recommendation. Learn through explicit decisions, not implicit chat memory.

Do not ask the analyst to trigger learning separately. Treat every substantive correction as a candidate learning event and complete the classification, retention, promotion, and validation steps during the same revision.

## Safety and accuracy

- Never invent interviews, quotes, numbers, sources, or precision.
- Distinguish absence of disclosure from proof of absence.
- Label cutoff dates and data definitions.
- Treat social posts as leads unless independently supported.
- Do not write investment advice.
- Do not modify or publish to the V1 repository.
