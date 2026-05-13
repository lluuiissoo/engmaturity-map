---

description: "Task list for Inventory Editor"
---

# Tasks: Inventory Editor

**Input**: Design documents from `specs/002-inventory-editor/`

**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | quickstart.md ✅

**Tests**: No automated tests — manual browser verification only (per constitution and spec assumptions).

**Organization**: Tasks are grouped by user story. All code lives in a single new file: `inventory-editor.html`.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (no dependency on incomplete sibling tasks)
- **[Story]**: Which user story this task belongs to (US1–US5)
- Exact file: `inventory-editor.html` throughout

---

## Phase 1: Setup

**Purpose**: Create the page shell — HTML structure, CSS, and script load chain.

- [x] T001 Create `inventory-editor.html` with doctype, `<head>` (charset, viewport, title "MaturityMap — Inventory Editor"), full CSS matching the dark theme of `rubric-editor.html` (`:root` variables, header, two-panel layout, sidebar, main panel, form, score-input, button styles, export modal), `<body>` with `<header>`, `<div id="layout">` containing `<aside id="sidebar">` and `<main id="panel">`, export fallback modal, and the five loader scripts in order: `dimensions-loader.js` → `tiers-loader.js` → `inventory-loader.js` → `assessment-loader.js` → `main.js` → inline `<script>` block in `inventory-editor.html`

---

## Phase 2: Foundational

**Purpose**: Initialize state and render the sidebar list — required before any user story works.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T002 In the inline `<script>` of `inventory-editor.html`, declare state variables (`let workingCopy`, `let isDirty = false`, `let selectedIdx = null`, `let isNewRepo = false`, `let filterType = ""`, `let filterTeam = ""`), initialize `workingCopy = JSON.parse(JSON.stringify(REPO_INVENTORY))` on load, and implement `setDirty(val)` (toggles the `dirty-badge` visibility) in `inventory-editor.html`
- [x] T003 Implement `renderSidebar()` in `inventory-editor.html`: populate the `<aside id="sidebar">` with a Type `<select>` (options from `REPO_TYPES` + "All Types"), a Team `<select>` (unique teams from `workingCopy` + "All Teams"), a `[+ Add Repo]` button, and a filtered list of repo items showing name, tier badge, and overall score (`overallScore(repo.current).toFixed(1)`); wire filter selects to update `filterType`/`filterTeam` and re-render the sidebar; wire repo item clicks to `selectRepo(idx)` in `inventory-editor.html`

**Checkpoint**: Open `inventory-editor.html` — sidebar shows all repos with tier and score; Type and Team dropdowns filter the list.

---

## Phase 3: User Story 1 — Browse the Repo Inventory (Priority: P1) 🎯 MVP

**Goal**: Clicking a repo in the sidebar shows its metadata and all 28 scores, read-only, in the right panel.

**Independent Test**: Open `inventory-editor.html`, click any repo — right panel shows name, display name, link, type, team, tier, and 28 scores grouped under 7 dimension sections. Click every repo and confirm no console errors.

- [x] T004 [US1] Implement `selectRepo(idx)` in `inventory-editor.html`: sets `selectedIdx = idx`, `isNewRepo = false`, calls `renderPanel(idx)`, and updates the active sidebar item (`.active` CSS class on the clicked item) in `inventory-editor.html`
- [x] T005 [US1] Implement `renderPanel(idx)` in `inventory-editor.html`: if `idx` is null show an empty-state prompt; otherwise render a form for `workingCopy[idx]` with: text inputs for `name`, `displayName`, `repoLink`; a `<select>` for `type` (options from `REPO_TYPES`); a text input for `team`; a `<select>` for `tier` (options 1, 2, 3); then 7 collapsible dimension sections each containing `<input type="number" min="1" max="5" step="1">` for each of its sub-dimensions (look up labels from `DIMENSIONS`); and Save, Discard, Delete buttons at the bottom in `inventory-editor.html`

---

## Phase 4: User Story 2 — Edit an Existing Repo (Priority: P2)

**Goal**: Change any field or score, click Save, and see the list update. Discard reverts to last-saved state.

**Independent Test**: Open any repo, change its tier from 2 to 1 and increment one score, click Save — the sidebar shows the updated overall score. Click the repo again — the form reflects the new values. Click Discard before saving on a second edit — form reverts.

- [x] T006 [US2] Implement `saveRepo()` in `inventory-editor.html`: read all form field values from `inventory-editor.html`; validate (name non-empty, team non-empty, name unique among other entries, all 28 scores integers 1–5); on failure show inline error messages below the offending fields; on success write the updated repo object back to `workingCopy[selectedIdx]`, call `setDirty(true)`, re-render the sidebar (to update the score in the list), and clear all validation errors in `inventory-editor.html`
- [x] T007 [US2] Implement `discardRepo()` in `inventory-editor.html`: if `isNewRepo` is true clear the panel to empty state; otherwise call `renderPanel(selectedIdx)` to re-render the form from `workingCopy[selectedIdx]`, restoring all original values in `inventory-editor.html`
- [x] T008 [P] [US2] Wire Save button to `saveRepo()` and Discard button to `discardRepo()` in `inventory-editor.html`; wire the "Discard All" header button to reset `workingCopy = JSON.parse(JSON.stringify(REPO_INVENTORY))`, call `setDirty(false)`, `renderSidebar()`, and clear the panel to empty state in `inventory-editor.html`

---

## Phase 5: User Story 3 — Add a New Repo (Priority: P3)

**Goal**: Click "+ Add Repo", fill the form, save — the new repo appears in the list.

**Independent Test**: Click "+ Add Repo" — empty form appears. Fill name "test-svc", type "API", team "Platform", tier 3, leave scores blank. Click Save — "test-svc" appears in the sidebar with score 1.0. Open it — all 28 scores are 1.

- [x] T009 [US3] Implement `renderNewForm()` in `inventory-editor.html`: sets `isNewRepo = true`, `selectedIdx = null`, clears any sidebar active state, renders a blank form in `<main id="panel">` with empty metadata fields (type defaulting to first REPO_TYPE, tier defaulting to 2) and all 28 score inputs pre-filled with `1`; wire "+ Add Repo" button to `renderNewForm()` in `inventory-editor.html`
- [x] T010 [US3] Implement `saveNewRepo()` in `inventory-editor.html`: read form values; validate (name non-empty, team non-empty, name unique, scores 1–5); on failure show inline errors; on success build a new repo object (any blank score defaults to 1, `displayName` defaults to `name` if blank), push to `workingCopy`, set `selectedIdx = workingCopy.length - 1`, `isNewRepo = false`, call `setDirty(true)`, `renderSidebar()`, `renderPanel(selectedIdx)` in `inventory-editor.html`; wire Save button in the new-repo form to call `saveNewRepo()` instead of `saveRepo()`

---

## Phase 6: User Story 4 — Delete a Repo (Priority: P4)

**Goal**: Click Delete, confirm, repo is removed from the list. Cancel keeps it.

**Independent Test**: Open any repo, click Delete, click Cancel in the confirm dialog — repo remains. Open the same repo, click Delete, click OK — repo is gone from the sidebar and the panel shows the empty state.

- [x] T011 [US4] Wire the Delete button in `renderPanel()` in `inventory-editor.html`: on click, call `confirm('Delete [name]? This cannot be undone.')` — if cancelled do nothing; if confirmed, splice `workingCopy[selectedIdx]`, set `selectedIdx = null`, call `setDirty(true)`, `renderSidebar()`, clear the panel to empty state in `inventory-editor.html`

---

## Phase 7: User Story 5 — Export Updated Inventory (Priority: P5)

**Goal**: Produce a valid `var REPO_INVENTORY = [...];` JS string via clipboard or file download.

**Independent Test**: Add a repo, click Copy JS — clipboard contains the full `var REPO_INVENTORY = [...];` block including the new repo. Paste into `js/inventory-loader.js`, open `index.html`, confirm no console errors and the new repo appears in the dashboard.

- [x] T012 [US5] Implement `buildExportJS()` in `inventory-editor.html` returning `` `var REPO_INVENTORY = ${JSON.stringify(workingCopy, null, 2)};\n` ``; wire the "Copy JS" button to `navigator.clipboard.writeText(buildExportJS())` with a 2-second "Copied!" flash on the button, falling back to `showExportFallback(js)` if clipboard is unavailable in `inventory-editor.html`
- [x] T013 [P] [US5] Wire the "Download JS" button in `inventory-editor.html`: create a `Blob` from `buildExportJS()`, create a temp `<a>` with `download="inventory-YYYY-MM-DD.js"` and trigger `.click()`; implement `showExportFallback(js)` which displays the export modal with the JS pre-filled in a `<textarea>` and auto-selects it in `inventory-editor.html`

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Nav links, dimension collapsing, team dropdown sync, and final verification.

- [x] T014 Add nav links in the header of `inventory-editor.html`: "← Dashboard" to `index.html`, "Assessment Tool" to `assess.html`, "Rubric Editor" to `rubric-editor.html`; confirm page title matches "MaturityMap — Inventory Editor" in `inventory-editor.html`
- [x] T015 [P] Implement collapsible dimension sections in the score area of `renderPanel()` in `inventory-editor.html`: each section header is clickable and toggles `.open` class to show/hide its score inputs; all sections open by default when a repo is first loaded; add "Expand all / Collapse all" toggle buttons above the sections in `inventory-editor.html`
- [x] T016 [P] Keep the Team filter dropdown in sync: after any `saveRepo()`, `saveNewRepo()`, or delete, re-derive the unique team list from `workingCopy` and rebuild the Team `<select>` options so newly added teams appear and deleted teams disappear in `inventory-editor.html`
- [x] T017 [P] Manual browser verification: open `inventory-editor.html`, (a) browse all repos; (b) filter by type and team; (c) edit a repo's tier and one score, save, confirm sidebar updates; (d) discard an edit; (e) add a new repo with blank scores; (f) delete a repo with confirmation; (g) export JS, paste into `js/inventory-loader.js`, open `index.html` and confirm zero console errors and changes are reflected in `inventory-editor.html`

---

## Dependencies

```
T001 (shell)
  └─ T002 (state init + setDirty)
       └─ T003 (sidebar render + filter)
            ├─ T004, T005         [US1 — browse]
            │    └─ T006, T007, T008   [US2 — edit]
            │         └─ T009, T010    [US3 — add]
            │              └─ T011     [US4 — delete]
            │                   └─ T012, T013  [US5 — export]
            │                        └─ T014, T015, T016, T017  [polish]
```

Within each phase, tasks marked `[P]` can run in parallel.

## Parallel Execution Examples

**Phase 2**: T002 (state) and T003 (sidebar) are sequential — T003 depends on T002's state variables.

**Phase 4 (US2)**: T006 (saveRepo logic) and T007 (discardRepo logic) can be developed simultaneously; T008 (wiring) follows.

**Phase 7 (US5)**: T012 (clipboard copy) and T013 (download + fallback) are independent export paths.

**Phase 8 (polish)**: T014, T015, T016, T017 are all fully parallel.

## Implementation Strategy

**MVP** (User Story 1): T001 → T002 → T003 → T004 → T005
Delivers: Navigable read-only repo browser with filtering. Verifiable in ~1 hour.

**Increment 2** (edit): T006 → T007 → T008
Delivers: Full edit + save/discard per repo.

**Increment 3** (add + delete): T009 → T010 → T011
Delivers: Complete CRUD.

**Increment 4** (export): T012 → T013
Delivers: JS export for persistence.

**Increment 5** (polish): T014 → T015 → T016 → T017
Delivers: Production-ready page with nav, collapsing, team sync, and verified round-trip.
