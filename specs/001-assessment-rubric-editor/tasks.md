---

description: "Task list for Assessment Rubric Editor"
---

# Tasks: Assessment Rubric Editor

**Input**: Design documents from `specs/001-assessment-rubric-editor/`

**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | quickstart.md ✅

**Tests**: No automated tests — manual browser verification only (per constitution and spec assumptions).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. All code lives in a single new file: `rubric-editor.html`.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (no dependency on incomplete sibling tasks)
- **[Story]**: Which user story this task belongs to (US1–US4)
- Exact file: `rubric-editor.html` throughout (the only file added by this feature)

---

## Phase 1: Setup

**Purpose**: Create the page shell — HTML structure, CSS, and script load chain.

- [ ] T001 Create `rubric-editor.html` with doctype, `<head>` (charset, viewport, title "MaturityMap — Rubric Editor"), full CSS (`:root` dark-theme variables matching `assess.html`, header, sidebar, main-panel, level-section, criterion-row, button styles), `<body>` skeleton with `<header>`, `<aside id="sidebar">`, `<main id="panel">`, and the five loader scripts in order: `dimensions-loader.js` → `tiers-loader.js` → `inventory-loader.js` → `assessment-loader.js` → `main.js` → inline `<script>` block in `rubric-editor.html`

---

## Phase 2: Foundational

**Purpose**: Initialize state and render the sidebar — required before any user story can be demonstrated.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T002 In the inline `<script>` of `rubric-editor.html`, declare state variables (`let workingCopy`, `let isDirty = false`, `let selectedSubKey = null`), initialize `workingCopy = JSON.parse(JSON.stringify(ASSESSMENT))` on load, and implement `renderSidebar()` that builds the sidebar HTML from `DIMENSIONS` (dimension headings as non-clickable labels, sub-dimension items as clickable `<button>` elements with `data-sub` attribute) and calls itself on DOMContentLoaded in `rubric-editor.html`
- [ ] T003 Implement `renderPanel(subKey)` function skeleton in `rubric-editor.html`: if `subKey` is null show an empty-state prompt ("Select a sub-dimension to begin"); otherwise render a `<div>` per level (1–5) with the level label (`Level N — ${MATURITY_LEVELS[n]}`), a `<ul>` placeholder for criteria, and a "+ Add criterion" button placeholder — wire sidebar button clicks to call `renderPanel(subKey)` and set `selectedSubKey = subKey` in `rubric-editor.html`

**Checkpoint**: Open `rubric-editor.html` — sidebar lists all 7 dimensions and 28 sub-dimensions; clicking any sub-dimension shows the 5 level sections in the right panel.

---

## Phase 3: User Story 1 — Browse Rubric Criteria (Priority: P1) 🎯 MVP

**Goal**: Display all criteria for a selected sub-dimension, read-only, in the right panel.

**Independent Test**: Open `rubric-editor.html`, click "CI/CD Maturity" in the sidebar — all 5 levels render with their criterion strings. Click every sub-dimension and confirm no errors. No editing yet.

- [ ] T004 [US1] Complete `renderPanel(subKey)` in `rubric-editor.html`: populate each level `<ul>` by iterating `workingCopy[subKey][String(level)]`, rendering each criterion as `<li><span class="criterion-text">...</span><button class="btn-delete">×</button></li>`; highlight the active sidebar item with an `.active` CSS class; re-render the panel header with the sub-dimension label (looked up from `DIMENSIONS`) in `rubric-editor.html`
- [ ] T005 [P] [US1] Add sidebar active-state: when a sub-dimension button is clicked, remove `.active` from all sidebar buttons and add it to the clicked button so the selection is visually tracked in `rubric-editor.html`

---

## Phase 4: User Story 2 — Edit Existing Criterion (Priority: P2)

**Goal**: Click any criterion text to edit it in place; confirm with Enter/blur or cancel with Escape.

**Independent Test**: Click any criterion span — it becomes editable. Type new text and press Enter — the text updates and the "Unsaved changes" badge appears. Press Escape mid-edit — original text is restored.

- [ ] T006 [US2] In `renderPanel()`, set `contenteditable="plaintext-only"` on each `.criterion-text` span and attach a `blur` event listener that reads `el.textContent.trim()`, validates non-empty (restores prior value if blank), calls `updateCriterion(subKey, level, index, newText)` which mutates `workingCopy[subKey][String(level)][index]` and calls `setDirty(true)`, in `rubric-editor.html`
- [ ] T007 [US2] Attach `keydown` listener on each `.criterion-text` span: Enter triggers `el.blur()` (confirms); Escape restores the span's text to the value captured at focus-in time (`el.dataset.original`) and calls `el.blur()` without saving, in `rubric-editor.html`
- [ ] T008 [P] [US2] Implement `setDirty(bool)` in `rubric-editor.html`: sets `isDirty`, shows/hides a `<span id="dirty-badge">Unsaved changes</span>` in the header; implement `discardChanges()` which resets `workingCopy = JSON.parse(JSON.stringify(ASSESSMENT))`, calls `setDirty(false)`, and re-renders the current panel; wire the "Discard changes" header button to `discardChanges()` in `rubric-editor.html`

---

## Phase 5: User Story 3 — Add and Remove Criteria (Priority: P3)

**Goal**: Add a new blank criterion to any level; delete any criterion while preserving the minimum-one guard.

**Independent Test**: Click "+ Add criterion" on Level 2 of any sub-dimension — a blank editable criterion appears. Type text and confirm — it persists in the panel. Click [×] on the new criterion — it is removed. With only one criterion at a level, [×] is disabled.

- [ ] T009 [US3] Wire the "+ Add criterion" button for each level in `rubric-editor.html`: on click, push `""` to `workingCopy[selectedSubKey][String(level)]`, call `setDirty(true)`, call `renderPanel(selectedSubKey)`, then programmatically focus the last `.criterion-text` span in that level so the user can type immediately, in `rubric-editor.html`
- [ ] T010 [US3] Wire the `.btn-delete` button for each criterion in `rubric-editor.html`: disable the button (and add a `title="At least one criterion required per level"` tooltip) when `workingCopy[subKey][String(level)].length === 1`; on click (when enabled), splice the criterion from the array, call `setDirty(true)`, call `renderPanel(selectedSubKey)`, in `rubric-editor.html`

---

## Phase 6: User Story 4 — Export Updated Rubric (Priority: P4)

**Goal**: Produce a valid `var ASSESSMENT = {...};` JS string and deliver it via clipboard copy and file download.

**Independent Test**: Make any edit, click "Copy JS" — clipboard contains the full ASSESSMENT declaration. Paste into `js/assessment-loader.js`, open `assess.html`, confirm no console errors and the edit is reflected.

- [ ] T011 [US4] Implement `buildExportJS()` in `rubric-editor.html` returning `` `var ASSESSMENT = ${JSON.stringify(workingCopy, null, 2)};\n` ``; wire the "Copy JS" header button to call `navigator.clipboard.writeText(buildExportJS())` with a 2-second "Copied!" label flash (matching the `assess.html` pattern), in `rubric-editor.html`
- [ ] T012 [P] [US4] Wire the "Download JS" header button in `rubric-editor.html`: create a `Blob` from `buildExportJS()` with type `application/javascript`, create a temporary `<a>` with `download="assessment-rubric-YYYY-MM-DD.js"` and trigger `.click()`; also render a fallback `<textarea>` (auto-select) below the header if `navigator.clipboard` is unavailable, in `rubric-editor.html`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Nav links, blank-criterion guard, and final verification.

- [ ] T013 Add header nav links in `rubric-editor.html`: "← Dashboard" linking to `index.html` and "Assessment Tool" linking to `assess.html`; confirm page title and heading match "MaturityMap — Rubric Editor"; ensure sidebar has a fixed width (e.g. 220px) and the main panel scrolls independently in `rubric-editor.html`
- [ ] T014 [P] Enforce blank-criterion validation in `rubric-editor.html`: in the `blur` handler of T006, if `el.textContent.trim() === ""` restore `el.textContent = el.dataset.original`, add a `.invalid` CSS class that outlines the field in `--level1` color for 2 seconds, and do NOT call `updateCriterion()`, in `rubric-editor.html`
- [ ] T015 [P] Manual browser verification in `rubric-editor.html`: open the page, (a) browse all 28 sub-dimensions with no errors; (b) edit a criterion, confirm unsaved badge appears, then discard; (c) add and delete a criterion including the minimum-one guard; (d) export JS, paste into `js/assessment-loader.js`, open `assess.html` and confirm zero console errors and edits are visible

---

## Dependencies

```
T001 (shell)
  └─ T002 (state + sidebar)
       └─ T003 (panel skeleton + sidebar wiring)
            ├─ T004, T005    [US1 — browsing]
            │    └─ T006, T007, T008   [US2 — editing]
            │         └─ T009, T010    [US3 — add/delete]
            │              └─ T011, T012  [US4 — export]
            │                   └─ T013, T014, T015  [polish]
```

User stories are sequentially dependent because each story's UI is built on top of the previous phase's rendered output. Within each phase, tasks marked `[P]` can run in parallel.

## Parallel Execution Examples

**Phase 3 (US1)**:
- T004 (criterion rendering) and T005 (active state) can be implemented simultaneously since T005 is purely CSS/class toggling.

**Phase 4 (US2)**:
- T008 (dirty badge + discard) is independent of T006/T007 (contenteditable logic) until wiring.

**Phase 5–7**:
- T009 (add) and T010 (delete) touch different buttons/handlers.
- T011 (clipboard) and T012 (download) are independent export paths.
- T013, T014, T015 are fully parallel.

## Implementation Strategy

**MVP** (User Story 1 only): T001 → T002 → T003 → T004 → T005
Delivers: A navigable read-only rubric browser. Verifiable in ~1 hour.

**Increment 2** (add editing): T006 → T007 → T008
Delivers: Inline editing with dirty tracking and discard.

**Increment 3** (add/delete + export): T009 → T010 → T011 → T012
Delivers: Full rubric management and JS export.

**Increment 4** (polish): T013 → T014 → T015
Delivers: Production-ready page with nav, validation, and verified export round-trip.
