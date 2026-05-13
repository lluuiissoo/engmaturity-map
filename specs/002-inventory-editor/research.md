# Research: Inventory Editor

**Feature**: `002-inventory-editor`
**Date**: 2026-05-12

## Score Input Mechanism

**Decision**: Use `<input type="number" min="1" max="5" step="1">` for each of
the 28 sub-dimension score fields.

**Rationale**: Number inputs natively constrain value entry, provide up/down
spinners for quick adjustment, and are semantically correct for integer values.
`contenteditable` spans (used in the rubric editor for text) would require
custom validation for numeric range; number inputs give that for free.

**Alternatives considered**:
- Five radio buttons per sub-dimension — too much DOM for 28 × 5 = 140 radios.
- A single text input with JS range validation — more validation code, no native constraints.

## Edit-Then-Save vs Live-Write

**Decision**: Use an explicit **Save** button per repo. Edits to the form are
held in the DOM until the user clicks Save, which writes to `workingCopy`.
Discard re-renders the form from `workingCopy`.

**Rationale**: Repos have 28 numeric score fields plus metadata. Live-writing
on every keystroke (rubric-editor pattern) creates noisy workingCopy mutations
and makes the "Discard" action ambiguous. A Save/Discard pair is the standard
form pattern and is unambiguous.

**Alternatives considered**:
- Live-write on `change` (blur) for each field — creates partial saves; harder
  to discard cleanly.
- A modal dialog form — adds DOM complexity with no UX benefit for a tool this
  simple.

## Working Copy State

**Decision**: Deep-clone `REPO_INVENTORY` into `let workingCopy` on page load.
Each Save writes the edited repo back into `workingCopy` at its array index
(or appends for new repos). Delete splices from `workingCopy`. `isDirty` is
set to `true` on any Save or Delete and reset to `false` only on Discard-all
(full reset from original) — not on per-repo discard.

**Rationale**: The dirty flag signals "export is needed" rather than "there are
unsaved form edits". Per-repo discard (reverting the form) is independent of
the global dirty flag; the flag only tracks whether `workingCopy` differs from
the originally loaded array.

## Uniqueness Validation

**Decision**: On Save, check that no other entry in `workingCopy` shares the
same `name` value (case-insensitive). If a duplicate is found, block save and
show an inline validation message next to the name field.

**Rationale**: `name` is the identifier used as the key in scores lookups across
the app. Duplicates would silently corrupt the dashboard.

## Form Layout for 28 Score Fields

**Decision**: Group the 28 score inputs under collapsible dimension sections
(one section per dimension, matching the 7-dimension structure of `DIMENSIONS`).
Each section is open by default when a repo is first loaded. A "Collapse all /
Expand all" toggle is provided.

**Rationale**: Showing 28 individual number inputs in a flat list is
overwhelming. Grouping under 7 dimension headings matches how the dashboard and
assessment tool present the same data, so users have a consistent mental model.

**Alternatives considered**:
- A flat table (sub-dim name | score) — readable but no visual grouping.
- Separate tabs per dimension — adds click depth; all-visible-with-collapse
  is faster for bulk score entry.

## Repo Type and Tier Dropdowns

**Decision**: Use `<select>` dropdowns for `type` (options from `REPO_TYPES`)
and `tier` (options: 1, 2, 3). Team is a free-text `<input>`.

**Rationale**: `REPO_TYPES = ['API', 'UI', 'Windows Service', 'Library', 'Shared']`
is a fixed enum defined in `main.js`; a dropdown enforces the constraint and
prevents typos. Tier is always 1, 2, or 3. Team has no fixed set in the
existing data, so free-text is appropriate.

## Export Format

**Decision**: Same pattern as `rubric-editor.html`:
```js
var REPO_INVENTORY = ${JSON.stringify(workingCopy, null, 2)};\n
```
Delivered via `navigator.clipboard.writeText()` with a Blob URL download
fallback.

**Rationale**: Exact same mechanism as the rubric editor — consistent UX and
round-trip safe. `JSON.stringify` with 2-space indent produces readable output
matching the original file style closely enough for manual paste.

## Overall Score Display in List

**Decision**: Show the computed `overallScore(repo.current)` (from `main.js`)
next to each repo in the sidebar list, formatted to one decimal place.

**Rationale**: `overallScore()` is already defined in `main.js` and available
as a global. Showing the score in the list lets users immediately see which
repos were affected by their edits without opening each one.

## Script Position

**Decision**: All editor JS inline in `inventory-editor.html`, same pattern as
`rubric-editor.html` and `assess.html`. No separate JS file.
