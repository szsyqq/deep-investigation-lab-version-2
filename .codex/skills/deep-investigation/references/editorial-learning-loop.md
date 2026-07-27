# Editorial learning loop

Use this loop after every substantive analyst correction. The analyst does not need to request a skill update separately.

## 1. Capture the event

Record the original problem, requested outcome, final choice, reason, affected pattern, scope, and date in the report's `revisions.md` and `editorial-state.json`.

## 2. Classify retention scope

- `report-local`: depends on the subject, thesis, evidence, or deliberate style choice of one report.
- `candidate-pattern`: plausibly transferable, but supported by only one correction or has unclear boundaries.
- `shared-editorial-rule`: applies to investigation writing across reports.
- `shared-framework-rule`: deterministic presentation, workflow, schema, validation, or publication behavior.

An explicit analyst statement such as “以后每篇”“所有页面”“统一使用” is sufficient for immediate shared scope. Otherwise promote a candidate after two similar corrections in different sections or reports. Do not promote conflicting preferences without resolving their boundary.

## 3. Store at the correct layer

- Keep `report-local` events only in the report package.
- Record `candidate-pattern` in the originating decision with a stable `affectedPattern`; compare it during later revisions.
- Add prose and reasoning rules to `editorial-writing-contract.md`.
- Add revision behavior to `revision-protocol.md`.
- Add deterministic workflow or rendering rules to `docs/research-protocol.md` or `docs/framework-decision-log.md`.
- Add scripts only for repeatable mechanical work; do not pretend a keyword checker can judge narrative quality.

## 4. Preserve provenance and boundaries

Every promoted rule must state:

- the failure it prevents;
- the positive behavior required;
- when it applies;
- when it does not apply;
- the analyst decisions or reports that caused promotion.

Replace an older rule explicitly when a later decision supersedes it. Do not leave both active.

## 5. Validate proportionately

- For deterministic rules, add or update an automated regression test.
- For editorial rules, add a short positive and negative example or a structured review question.
- Re-run skill validation, `npm run research:validate`, and `npm test` after shared changes.
- Forward-test the next real report. If the same failure recurs, revise the shared rule instead of adding a report patch.

## 6. Report the learning

At handoff, briefly state which correction remained local and which rule was promoted. This makes the learning visible without requiring the analyst to manage the mechanism.
