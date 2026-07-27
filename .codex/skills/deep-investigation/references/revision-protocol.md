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

## Continuous learning

After every substantive correction, read and execute `editorial-learning-loop.md`. Do this in the same task; do not wait for the analyst to request an upgrade.

Classify the decision as `report-local`, `candidate-pattern`, `shared-editorial-rule`, or `shared-framework-rule`. An explicit global instruction promotes immediately. Otherwise, promote after two similar corrections in different sections or reports.

When promoting:

1. preserve the originating decisions and applicability boundary;
2. update the appropriate shared reference or protocol;
3. add a positive/negative example for judgment rules;
4. add a regression test for deterministic rules;
5. report the promoted learning at handoff.
