# Revision protocol

Before changing a published or approved report:

1. Read `brief.json`, `workflow-state.json`, `outline.md`, `draft.md`, `claim-map.json`, `visual-plan.json`, `editorial-state.json`, `revisions.md`, and `publication.json`.
2. Translate the user's feedback into a specific problem.
3. Classify its depth.

## Depth

- `evidence-update`: same claim and structure; update evidence, numbers and affected sentences.
- `local-rewrite`: same section purpose; rewrite a bounded passage or visual annotation.
- `structural-revision`: claim order, section responsibilities or visual logic changes.
- `full-rewrite`: the core question or thesis changes, or feedback identifies five or more interacting structural faults.

For structural work, update the outline and claim map before prose, then update the visual plan. Never solve a structural request by appending a paragraph.

After any revision, reread the affected section plus its preceding and following sections. The output must remain a complete article, not an old draft with a new block inserted.

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

Append a human-readable entry to `revisions.md` as well. This is the analyst-facing history; `editorial-state.json` remains the machine-readable decision memory.
