# Deep Investigation Lab V2

When the user asks to investigate, research, analyze, or publish a company, person, product, industry, event, trend, policy, or social topic, use `.codex/skills/deep-investigation/SKILL.md`.

Non-negotiable rules:

- Treat the original `szsyqq/DeepInvestigationLab` repository as read-only reference material.
- Never create a standalone HTML file for a new report. Add a structured research package under `content/reports/<slug>/` and render it through the shared app.
- Treat report production as seven user-facing stages: intake; discussion and iterative research; outline and source dossier; prose draft; visual editing; review and analyst revision; internal preview and publication.
- Preserve the report's human-readable working files (`discussion.md`, `research-notes.md`, `outline.md`, `draft.md`, `review.md`, `revisions.md`) alongside machine-readable evidence, claim, visual, workflow and publication state.
- Never select a chart before extracting its editorial claim and evidence.
- Every published factual claim must map to an evidence ID.
- Preserve approved sections during revisions. Classify a request as evidence update, local rewrite, structural revision, or full rewrite before editing.
- Do not alter another report to fix the current report.
- When a presentation defect can affect more than one report, fix the shared renderer, importer, or design tokens rather than patching a report package.
- Published report packages must not contain copied navigation, legal notices, scripts, inline event handlers, or legacy tooltip attributes.
- Every shared publication-framework fix must add or update an automated regression check and be recorded in `docs/framework-decision-log.md`.
- A report may publish only after `npm run research:validate` and `npm test` pass.
- Internal preview is not formal publication. Set `publication.json.status` to `published` only after explicit analyst approval.
