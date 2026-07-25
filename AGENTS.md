# Deep Investigation Lab V2

When the user asks to investigate, research, analyze, or publish a company, person, product, industry, event, trend, policy, or social topic, use `.codex/skills/deep-investigation/SKILL.md`.

Non-negotiable rules:

- Treat the original `szsyqq/DeepInvestigationLab` repository as read-only reference material.
- Never create a standalone HTML file for a new report. Add a structured research package under `content/reports/<slug>/` and render it through the shared app.
- Never select a chart before extracting its editorial claim and evidence.
- Every published factual claim must map to an evidence ID.
- Preserve approved sections during revisions. Classify a request as evidence update, local rewrite, structural revision, or full rewrite before editing.
- Do not alter another report to fix the current report.
- A report may publish only after `npm run research:validate` and `npm test` pass.
