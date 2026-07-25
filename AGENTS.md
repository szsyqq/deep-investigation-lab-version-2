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
- A report may publish only after `npm run research:validate` and `npm test` pass.
- Internal preview is not formal publication. Set `publication.json.status` to `published` only after explicit analyst approval.
