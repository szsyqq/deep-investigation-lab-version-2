---
name: deep-investigation
description: Run evidence-led investigations from an open-ended Chinese or English request through research classification, source collection, claim mapping, editorial revision, visual planning, validation, and publication in Deep Investigation Lab V2. Use when Codex is asked to investigate or deeply research a company, institution, person, product, industry, event, policy, trend, controversy, or social topic, or to revise/publish an existing investigation in this repository.
---

# Deep Investigation

Produce a structured research package before producing prose or a webpage. Keep each report isolated under `content/reports/<slug>/`; use the shared site renderer.

## Start

1. Read `AGENTS.md`.
2. Read `references/research-routing.md`.
3. Run `npm run research:new -- "<user request>"` unless the report package already exists.
4. Open the generated `brief.json`.
5. For a revision, also read `references/revision-protocol.md` and the report's `editorial-state.json`.

## Execute the gates in order

### Gate 1: Scope

Classify the work as `entity` or `topic`. Complete the core question, time/geographic scope, exclusions, subquestions, and disconfirming evidence. Do not draft conclusions.

### Gate 2: Evidence

Research comprehensively using current primary sources first. Record every material source in `evidence-ledger.json`. Preserve conflicting evidence; do not silently choose the convenient version. Browse whenever current or precise claims require it.

### Gate 3: Claims

Create `claim-map.json`. Separate:

- `fact`: directly supported;
- `analysis`: reasoned interpretation;
- `unverified`: unresolved;
- `forecast`: conditional future statement.

Every publishable claim needs evidence IDs. Add counterevidence and confidence.

### Gate 4: Editorial structure

Define one `sectionPurpose` per section. Use a claim-led narrative, not a checklist of business dimensions. If new material changes the claim or section responsibility, restructure before rewriting prose.

### Gate 5: Visual plan

Read `references/visual-planning.md`. For every candidate visual:

1. state the editorial claim;
2. state the reader takeaway;
3. determine whether visualization lowers comprehension cost;
4. select the relationship pattern;
5. select a component last.

Use `prose-only` when evidence or relationship is insufficient. Never impose a chart quota.

### Gate 6: Publication

Complete `publication.json`, retaining evidence mappings. Add or update a route through shared components. Never create a standalone report framework or copy global CSS/JS into a report.

Run:

```bash
npm run research:validate
npm test
npm run build
```

Fix failures before describing the report as publishable.

## Revision discipline

Classify the request before editing:

- evidence update;
- local rewrite;
- structural revision;
- full rewrite.

Respect `approvedSections` and `lockedFacts`. Append a concise decision to `editorial-state.json` whenever a human accepts, changes, or rejects an AI recommendation. Learn through explicit decisions, not implicit chat memory.

## Safety and accuracy

- Never invent interviews, quotes, numbers, sources, or precision.
- Distinguish absence of disclosure from proof of absence.
- Label cutoff dates and data definitions.
- Treat social posts as leads unless independently supported.
- Do not write investment advice.
- Do not modify or publish to the V1 repository.
