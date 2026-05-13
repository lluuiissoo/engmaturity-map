---

description: "Task list for AssetID and ITOwner Fields"
---

# Tasks: AssetID and ITOwner Fields

**Input**: Design documents from `specs/003-asset-itowner-fields/`

**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | quickstart.md ✅

**Tests**: No automated tests — manual browser verification only (per constitution).

**Organization**: Tasks are grouped by user story. All changes are spread across
5 existing files: `js/inventory-loader.js`, `js/main.js`, `assess.html`,
`inventory-editor.html`, `index.html`.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependency on incomplete sibling tasks)
- **[Story]**: Which user story this task belongs to (US1–US4)

---

## Phase 1: Setup

No new project structure required — this feature modifies existing files only.
Proceed directly to Phase 2.

---

## Phase 2: Foundational

**Purpose**: Add `assetId` and `itOwner` to the live data source. All user stories
depend on this data being present in `REPO_INVENTORY` and the `repos` array.

**⚠️ CRITICAL**: No user story work can begin until T001 and T002 are complete.

- [x] T001 Add `assetId` and `itOwner` string fields to all 27 repo objects in `js/inventory-loader.js`, inserted between `repoLink` and `type` on each entry, using sample values ASSET-001 through ASSET-027 and owner names distributed by team as specified in `specs/003-asset-itowner-fields/plan.md`
- [x] T002 Add `assetId: def.assetId ?? ''` and `itOwner: def.itOwner ?? ''` to the `repos` map in `js/main.js` so all pages receive these fields via the `repos` array

**Checkpoint**: Open browser console → `REPO_INVENTORY[0].assetId` returns `"ASSET-001"` and `repos[0].itOwner` returns a non-empty string.

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

- [x] T003 [P] [US1] In `assess.html`, append Asset ID and IT Owner labeled spans to the repo info bar `innerHTML` in the individual-repo branch of the `repoSelect` change handler (around line 518), using `repo.assetId ?? ''` and `repo.itOwner ?? ''`; omit both fields for org/tier baseline modes
- [x] T004 [P] [US1] In `inventory-editor.html`, add two `field()` calls inside `buildRepoForm()` for `assetId` (label "Asset ID", id "f-assetId") and `itOwner` (label "IT Owner", id "f-itOwner") placed after the `repoLink` field and before the `form-row-2` div; both are optional (no `required` flag); pre-fill values from `repo.assetId ?? ''` and `repo.itOwner ?? ''`
- [x] T005 [US1] In `index.html`, add an `itOwner` badge (class `badge badge-team`) and, if `assetId` is non-empty, a small `<div>` label below the badges, to the radar card HTML in `renderRadarView()`
- [x] T006 [US1] In `index.html`, add `<th>Asset ID</th>` and `<th>IT Owner</th>` header cells after the `<th>Team</th>` cell, and add corresponding `<td>` data cells (`repo.assetId ?? ''` and `repo.itOwner ?? ''`) in both the dimension-level and sub-dimension-level branches of `renderHeatmapView()`
- [x] T007 [US1] In `index.html`, add an `itOwner` column `<div>` after the tier badge `<div>` in the `.gap-row` template inside `renderGapView()`; adjust the `gap-row` CSS grid from `grid-template-columns: 180px 40px 140px 120px 1fr 70px` to include a new `120px` column for IT Owner

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

- [x] T008 [US2] In `inventory-editor.html`, update `readFormValues()` to include `assetId: document.getElementById('f-assetId').value.trim()` and `itOwner: document.getElementById('f-itOwner').value.trim()` in the returned object (no validation required — both are optional)
- [x] T009 [US2] In `inventory-editor.html`, add `assetId: ''` and `itOwner: ''` to the `defaults` object in `renderNewForm()` so new repos start with empty strings rather than undefined fields

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

- [x] T010 [US3] In `index.html`, add `<label>IT Owner</label>` and `<select id="filter-itowner"><option value="all">All Owners</option></select>` to the `.filters` div in `<header>`, positioned after the Team filter group and before the Tier filter group
- [x] T011 [US3] In `index.html`, populate the ITOwner `<select>` in `initFilters()`: derive unique, sorted, non-empty `itOwner` values from `repos`, append one `<option>` per value, and wire a `change` event listener that calls `renderCurrentView()` (same pattern as the existing type/team/tier filters)
- [x] T012 [US3] In `index.html`, add the ITOwner condition to `getFiltered()`: `(itowner === 'all' || (r.itOwner ?? '') === itowner)` where `itowner` is read from `document.getElementById('filter-itowner').value`

**Checkpoint**: ITOwner filter applied to Radar view — count in stats bar updates
to reflect only matching repos. Switch to Heatmap — same repos shown.

---

## Phase 6: User Story 4 — Filter by AssetID (Priority: P4)

**Goal**: A new Asset ID dropdown in the dashboard filter bar lets users narrow
all five views to repos under a specific asset. The filter persists across view
switches and combines with the existing filters.

**Independent Test**: Open `index.html` — an Asset ID dropdown appears in the
filter bar after IT Owner. Select any AssetID value — only the repo with that
AssetID appears in Radar, By Type, By Dimension, Heatmap, and Gap Analysis.
Select "All Assets" — all repos return. Combine with the IT Owner filter — only
repos matching both criteria are shown. No console errors.

- [ ] T013 [US4] In `index.html`, add `<label>Asset ID</label>` and `<select id="filter-assetid"><option value="all">All Assets</option></select>` to the `.filters` div in `<header>`, positioned after the IT Owner filter group and before the Tier filter group
- [ ] T014 [US4] In `index.html`, populate the AssetID `<select>` in `initFilters()`: derive unique, sorted, non-empty `assetId` values from `repos`, append one `<option>` per value, and wire a `change` event listener that calls `renderCurrentView()` (same pattern as the ITOwner filter added in T011)
- [ ] T015 [US4] In `index.html`, add the AssetID condition to `getFiltered()`: `(assetid === 'all' || (r.assetId ?? '') === assetid)` where `assetid` is read from `document.getElementById('filter-assetid').value`

**Checkpoint**: AssetID filter applied to Radar view — only the one matching repo
is shown. Switch to Heatmap — same repo shown. Combine with IT Owner filter —
intersection of both filters is applied.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [ ] T016 Manual browser verification: (a) open `index.html` — IT Owner and Asset ID filters both work and narrow all views; assetId and itOwner visible in radar cards and heatmap columns; (b) open `assess.html`, select a repo — info bar shows Asset ID and IT Owner; (c) open `inventory-editor.html`, edit assetId/itOwner, save, export JS, paste into `js/inventory-loader.js`, reload `index.html` — updated values visible; (d) add a new repo with blank assetId/itOwner — no errors; (e) open browser console on all three pages — zero errors

---

## Dependencies

```
T001 (inventory-loader.js — assetId/itOwner data)
  └─ T002 (main.js — repos map includes new fields)
       ├─ T003 [P]  (assess.html — US1 view)
       ├─ T004 [P]  (inventory-editor.html — US1 display)
       ├─ T005      (index.html radar — US1 view)
       │    └─ T006 (index.html heatmap — US1 view)
       │         └─ T007 (index.html gap — US1 view)
       └─ T004 ──► T008 (inventory-editor.html readFormValues — US2 edit)
                    └─ T009 (inventory-editor.html renderNewForm — US2 edit)
T007 (index.html US1 changes complete)
  └─ T010 (index.html ITOwner filter HTML — US3)
       └─ T011 (index.html initFilters ITOwner — US3)
            └─ T012 (index.html getFiltered ITOwner — US3)
T012 (US3 complete)
  └─ T013 (index.html AssetID filter HTML — US4)
       └─ T014 (index.html initFilters AssetID — US4)
            └─ T015 (index.html getFiltered AssetID — US4)
T015 (all features complete)
  └─ T016 (manual browser verification)
```

Within each phase, tasks marked `[P]` touch different files and can be worked
on simultaneously.

## Parallel Execution Examples

**Phase 2 (Foundational)**: T001 then T002 — sequential (T002 depends on T001
data being in place).

**Phase 3 (US1)**: T003 (assess.html) and T004 (inventory-editor.html) are fully
independent — different files. T005 → T006 → T007 must be sequential (same
file: index.html), but can start in parallel with T003/T004.

**Phase 4 (US2)**: T008 then T009 — sequential but small (same file).

**Phase 5 (US3)**: T010 → T011 → T012 — sequential (same file: index.html).

**Phase 6 (US4)**: T013 → T014 → T015 — sequential (same file: index.html).

## Implementation Strategy

**MVP** (US1–US3 — complete ✅): T001 → T002 → T003+T004 (parallel) → T005 → T006
→ T007 → T008 → T009 → T010 → T011 → T012

**Increment 4** (AssetID filter — US4): T013 → T014 → T015
Delivers: AssetID filter in dashboard — full asset-based reporting.

**Increment 5** (polish): T016
Delivers: Verified end-to-end round-trip with zero console errors.
