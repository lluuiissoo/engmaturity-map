# Research: Assessment Rubric Editor

**Feature**: `001-assessment-rubric-editor`
**Date**: 2026-05-12

## Inline Editing in Vanilla JS

**Decision**: Use `contenteditable="plaintext-only"` on criterion `<span>` elements for inline editing.

**Rationale**: `contenteditable` requires zero JS to enable text editing; it is natively supported in all modern desktop browsers. `plaintext-only` prevents pasting rich HTML, which would corrupt the criterion strings. Listening to `blur` (or `keydown` for Enter/Escape) captures the edited value.

**Alternatives considered**:
- `<input>` fields replacing spans on click — adds DOM swap complexity and layout jank.
- A modal dialog with a textarea — too much friction for a single-line criterion edit.
- Full re-render on every keystroke — unnecessary; `contenteditable` keeps cursor position naturally.

## Dirty-State Tracking

**Decision**: Deep-clone `ASSESSMENT` into a `workingCopy` object on page load. Track a `isDirty` boolean flag. Set `isDirty = true` on any mutation; reset to `false` after Discard (which replaces `workingCopy` with a fresh clone).

**Rationale**: The working copy provides a simple diff point. A boolean flag is sufficient — no need to track individual change sets because the Export always emits the full rubric.

**Alternatives considered**:
- Structural diff on export — deferred and complex; flag is simpler.
- Undo/redo stack — out of scope per spec; a full Discard is the reset mechanism.

## JS Export Format

**Decision**: Serialize `workingCopy` as:
```js
var ASSESSMENT = <JSON.stringify(workingCopy, null, 2)>;\n
```
This matches the `var ASSESSMENT = {...};` declaration style in `assessment-loader.js`. The export is delivered via `navigator.clipboard.writeText()` with a fallback `<textarea>` select-and-copy.

**Rationale**: The exported string must be pasteable verbatim to replace the declaration in `assessment-loader.js`. Using `JSON.stringify` with 2-space indent produces readable output matching the existing file style closely enough for a manual paste.

**Alternatives considered**:
- Custom serializer to reproduce the exact comment blocks — over-engineered; comments are not load-bearing.
- Blob URL download as `.js` file — added as secondary option alongside clipboard copy, matching `assess.html` pattern.

## Layout Pattern

**Decision**: Two-panel layout — fixed left sidebar (dimension/sub-dimension navigation) + scrollable right panel (criterion editing area for selected sub-dimension).

**Rationale**: All 28 sub-dimensions fit in a sidebar without scrolling issues at standard screen heights. The right panel focuses editing on one sub-dimension at a time, preventing cognitive overload from 140 visible criterion fields.

**Alternatives considered**:
- Single accordion (all dimensions expanded in one column, like `assess.html`) — works for read-only checklists but becomes unwieldy with editable fields mixed in.
- Tabs per dimension — adds click depth; sidebar keeps all dimensions visible simultaneously.

## Minimum-One-Criterion Guard

**Decision**: Disable the delete button on a criterion row when it is the only criterion at its level. Show a tooltip: "At least one criterion required per level."

**Rationale**: Simpler than a confirmation dialog and communicates the constraint without blocking interaction on other criteria.

## Script Positioning

**Decision**: All editor JS is inline in `rubric-editor.html` (inside a `<script>` block at the end of `<body>`), following the exact pattern of `assess.html`. No separate `rubric-editor.js` file is created.

**Rationale**: Consistent with the project convention. A new JS file would add a dependency entry but provide no benefit in a no-build, no-module-system project.

**Load order in `rubric-editor.html`**:
```
dimensions-loader.js → tiers-loader.js → inventory-loader.js
  → assessment-loader.js → main.js → [inline script]
```
The full chain is loaded to satisfy `main.js` dependencies (`DIMENSIONS`, `TIERS`, `ORG_MINIMUMS`, `REPO_INVENTORY`). The inline editor script runs last and depends only on `DIMENSIONS` and `ASSESSMENT`.
