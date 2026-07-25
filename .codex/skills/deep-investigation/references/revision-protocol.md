# Revision protocol

Before changing a published or approved report:

1. Read `brief.json`, `claim-map.json`, `visual-plan.json`, `editorial-state.json`, and `publication.json`.
2. Translate the user's feedback into a specific problem.
3. Classify its depth.

## Depth

- `evidence-update`: same claim and structure; update evidence, numbers and affected sentences.
- `local-rewrite`: same section purpose; rewrite a bounded passage or visual annotation.
- `structural-revision`: claim order, section responsibilities or visual logic changes.
- `full-rewrite`: the core question or thesis changes, or feedback identifies five or more interacting structural faults.

For structural work, update the claim map and visual plan before prose. Never solve a structural request by appending a paragraph.

## Decision memory

Append to `editorial-state.json.decisions`:

- problem;
- AI suggestion;
- human action: accept, modify or reject;
- final choice;
- reason;
- affected pattern/component;
- date.

Do not automatically rewrite global rules from one decision. Propose a rule change only after repeated, similar decisions.
