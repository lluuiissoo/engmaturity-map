---

description: "Task list for AssetID and ITOwner Fields"
---

# Tasks: AssetID and ITOwner Fields

**Input**: Design documents from `specs/003-asset-itowner-fields/`

**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | quickstart.md ✅

**Tests**: No automated tests — manual browser verification only (per constitution).

**Organization**: Tasks are grouped by user story. All changes are spread across
4 existing files: `js/inventory-loader.js`, `assess.html`, `inventory-editor.html`,
`index.html`.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependency on incomplete sibling tasks)
- **[Story]**: Which user story this task belongs to (US1–US3)

---

## Phase 1: Setup

No new project structure required — this feature modifies 4 existing files only.
Proceed directly to Phase 2.

---

## Phase 2: Foundational

**Purpose**: Add `assetId` and `itOwner` to the live data source. All user stories
depend on this data being present in `REPO_INVENTORY`.

**⚠️ CRITICAL**: No user story work can begin until T001 is complete.

- [ ] T001 Add `assetId` and `itOwner` string fields to all 27 repo objects in `js/inventory-loader.js`, inserted between `repoLink` and `type` on each entry, using the sample values from the plan (ASSET-001 through ASSET-027 for assetId; Alice Chen, Bob Nguyen, Carol Smith, Dana Park, Erik Torres distributed by team as specified in `specs/003-asset-itowner-fields/plan.md`)

**Checkpoint**: Open browser console → `REPO_INVENTORY[0].assetId` returns `"ASSET-001"` and `REPO_INVENTORY[0].itOwner` returns a non-empty string.

---

## Phase 3: User Story 1 — View AssetID and ITOwner (Priority: P1) 🎯 MVP

**Goal**: Both fields are visible in every page that displays repo metadata —
the assessment tool info bar, the inventory editor form, and three dashboard
views (Radar, Heatmap, Gap Analysis).

**Independent Test**: Open `assess.html`, select any repo — the info bar shows
Asset ID and IT Owner. Open `inventory-editor.html`, click any repo — the form
shows Asset ID and IT Owner fields pre-filled with the repo's data. Open
`index.html` Radar view — cards show an IT Owner badge. Switch to Heatmap —
Asset ID and IT Owner columns appear. Switch to Gap Analysis — IT Owner appears
per row. No console errors on any page.

- [ ] T002 [P] [US1] In `assess.html`, append Asset ID and IT Owner labeled spans to the repo info bar `innerHTML` in the individual-repo branch of the `repoSelect` change handler (around line 518), using `repo.assetId ?? ''` and `repo.itOwner ?? ''`; omit both fields for org/tier baseline modes
- [ ] T003 [P] [US1] In `inventory-editor.html`, add two `field()` calls inside `buildRepoForm()` for `assetId` (label "Asset ID", id "f-assetId") and `itOwner` (label "IT Owner", id "f-itOwner") placed after the `repoLink` field and before the `form-row-2` div; both are optional (no `required` flag); pre-fill values from `repo.assetId ?? ''` and `repo.itOwner ?? ''`
- [ ] T004 [US1] In `index.html`, add an `itOwner` badge (class `badge badge-team`) and, if `assetId` is non-empty, a small `<div>` label below the badges, to the radar card HTML in `renderRadarView()` (around line 611–622)
- [ ] T005 [US1] In `index.html`, add `<th>Asset ID</th>` and `<th>IT Owner</th>` header cells after the `<th>Team</th>` cell, and add corresponding `<td>` data cells (`repo.assetId ?? ''` and `repo.itOwner ?? ''`) in both the dimension-level and sub-dimension-level branches of `renderHeatmapView()` (around lines 710–780)
- [ ] T006 [US1] In `index.html`, add an `itOwner` column `<div>` after the tier badge `<div>` in the `.gap-row` template inside `renderGapView()` (around lines 820–832); adjust the `gap-row` CSS grid from `grid-template-columns: 180px 40px 140px 120px 1fr 70px` to include a new `120px` column for IT Owner

**Checkpoint**: All three pages display assetId and itOwner with zero console errors.

---

## Phase 4: User Story 2 — Edit AssetID and ITOwner (Priority: P2)

**Goal**: The inventory editor form fields added in US1 are fully wired — values
are read on Save, default to `''` for new repos, and appear in the exported JS.

**Independent Test**: Open `inventory-editor.html`, click a repo, change Asset ID
and IT Owner, click Save — the sidebar re-renders without error. Click the repo
again — the form shows the new values. Click "+ Add Repo", fill in a name and
team, leave Asset ID and IT Owner blank, click Save — the new repo appears in
the sidebar with `assetId: ''` and `itOwner: ''`. Export JS — both fields appear
in the `var REPO_INVENTORY = [...];` block for every repo.

- [ ] T007 [US2] In `inventory-editor.html`, update `readFormValues()` to include `assetId: document.getElementById('f-assetId').value.trim()` and `itOwner: document.getElementById('f-itOwner').value.trim()` in the returned object (no validation required — both are optional)
- [ ] T008 [US2] In `inventory-editor.html`, add `assetId: ''` and `itOwner: ''` to the `defaults` object in `renderNewForm()` so new repos start with empty strings rather than undefined fields

**Checkpoint**: Save an edited repo, export JS, paste into `js/inventory-loader.js`,
open `index.html` — the updated assetId and itOwner appear in the heatmap columns.

---

## Phase 5: User Story 3 — Filter by ITOwner (Priority: P3)

**Goal**: A new IT Owner dropdown in the dashboard filter bar lets users narrow
all five views to repos owned by a specific person. The filter persists across
view switches.

**Independent Test**: Open `index.html` — an IT Owner dropdown appears in the
filter bar after Team. Select "Alice Chen" — only repos with `itOwner === 'Alice Chen'`
appear in Radar, By Type, By Dimension, Heatmap, and Gap Analysis. Select a
different owner — views update immediately. Select "All Owners" — all repos
return.

- [ ] T009 [US3] In `index.html`, add `<label>IT Owner</label>` and `<select id="filter-itowner"><option value="all">All Owners</option></select>` to the `.filters` div in `<header>`, positioned after the Team filter group and before the Tier filter group
- [ ] T010 [US3] In `index.html`, populate the ITOwner `<select>` in `initFilters()`: derive unique, sorted, non-empty `itOwner` values from `repos`, append one `<option>` per value, and wire a `change` event listener that calls `renderCurrentView()` (same pattern as the existing type/team/tier filters)
- [ ] T011 [US3] In `index.html`, add the ITOwner condition to `getFiltered()`: `(itowner === 'all' || (r.itOwner ?? '') === itowner)` where `itowner` is read from `document.getElementById('filter-itowner').value`

**Checkpoint**: ITOwner filter applied to Radar view — count in stats bar updates
to reflect only matching repos. Switch to Heatmap — same repos shown.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T012 Manual browser verification: (a) open `index.html` — IT Owner filter narrows Radar, Heatmap, and Gap views; assetId and itOwner visible in radar cards and heatmap columns; (b) open `assess.html`, select a repo — info bar shows Asset ID and IT Owner; (c) open `inventory-editor.html`, edit assetId/itOwner, save, export JS, paste into `js/inventory-loader.js`, reload `index.html` — updated values visible; (d) add a new repo with blank assetId/itOwner — no errors; (e) open browser console on all three pages — zero errors

---

## Dependencies

```
T001 (foundational — inventory-loader.js)
  ├─ T002 [P]  (assess.html — US1 view)
  ├─ T003 [P]  (inventory-editor.html — US1 display)
  ├─ T004      (index.html radar — US1 view)
  │    └─ T005 (index.html heatmap — US1 view)
  │         └─ T006 (index.html gap — US1 view)
  └─ T003 ──► T007 (inventory-editor.html readFormValues — US2 edit)
               └─ T008 (inventory-editor.html renderNewForm — US2 edit)
T006 (index.html changes complete)
  └─ T009 (index.html filter HTML — US3)
       └─ T010 (index.html initFilters — US3)
            └─ T011 (index.html getFiltered — US3)
T011 (all features complete)
  └─ T012 (manual browser verification)
```

Within each phase, tasks marked `[P]` touch different files and can be worked
on simultaneously.

## Parallel Execution Examples

**Phase 3 (US1)**: T002 (assess.html) and T003 (inventory-editor.html) are fully
independent — different files, no shared state. Both can proceed immediately
after T001. T004 → T005 → T006 must be sequential (same file: index.html), but
can be started in parallel with T002/T003.

**Phase 4 (US2)**: T007 and T008 both touch inventory-editor.html — they are
sequential but very small (one line each). Complete T007 then T008.

**Phase 5 (US3)**: T009 → T010 → T011 are all index.html — sequential within
the same file. Start after T006 (when index.html US1 changes are complete).

## Implementation Strategy

**MVP** (User Story 1): T001 → T002 + T003 (parallel) → T004 → T005 → T006
Delivers: All new fields visible across every page. Verifiable in ~30 minutes.

**Increment 2** (edit): T007 → T008
Delivers: Editor round-trip works — save/export includes assetId and itOwner.

**Increment 3** (filter): T009 → T010 → T011
Delivers: ITOwner filter in dashboard — full ownership-based reporting.

**Increment 4** (polish): T012
Delivers: Verified end-to-end round-trip with zero console errors.
