# Implementation Plan: AssetID and ITOwner Fields

**Branch**: `003-asset-itowner-fields` | **Date**: 2026-05-13 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/003-asset-itowner-fields/spec.md`

## Summary

Add two optional string metadata fields — `assetId` and `itOwner` — to every
entry in `REPO_INVENTORY`. Propagate both fields across all four affected pages:
`js/inventory-loader.js` (data source), `inventory-editor.html` (CRUD form),
`index.html` (dashboard filters + display), and `assess.html` (info bar). No
scoring logic changes, no new JS files, no new loader scripts.

**Current status (2026-05-13)**:
- US1 (View fields), US2 (Edit fields), US3 (ITOwner filter) — ✅ implemented
- US4 (AssetID filter) — 🔲 planned, not yet implemented

## Technical Context

**Language/Version**: Vanilla ES6+ JavaScript (no transpilation)

**Primary Dependencies**: None new. Reads `REPO_INVENTORY` global (from
`inventory-loader.js`) and the `repos` array built in `main.js`. No CDN
additions.

**Storage**: In-memory. Persistence by exporting JS from the inventory editor
and pasting into `inventory-loader.js`.

**Testing**: Manual browser testing only (per constitution — no automated test
suite).

**Target Platform**: Desktop browser; `file://` and static HTTP.

**Project Type**: Multi-page standalone HTML app (modification of existing pages).

**Performance Goals**: Sub-second filter response; 27 repos; no measurable
impact — two string fields add negligible memory.

**Constraints**: Offline-capable; `file://` compatible; dark theme via CSS
custom properties; no CDN dependencies added.

**Scale/Scope**: 5 files modified total (4 originally planned + `main.js` for
bug fix); 2 new fields; 27 repos updated in `inventory-loader.js`.

## Constitution Check

| Principle | Pre-Design | Post-Design | Notes |
|---|---|---|---|
| I. Client-Side Only | ✅ | ✅ | Browser-only; no server component |
| II. Data as JS Files | ✅ | ✅ | Fields in `inventory-loader.js`; exported as valid JS |
| III. Vanilla JS — No Framework, No Build | ✅ | ✅ | No new deps; plain ES6+ |
| IV. Script Load-Order Integrity | ✅ | ✅ | No new scripts; existing chain unchanged |
| V. Cumulative, Strict Scoring | ✅ | ✅ | Fields are metadata only; scoring untouched |

All gates pass. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/003-asset-itowner-fields/
├── plan.md              # This file
├── spec.md              # Feature specification (US1–US4)
├── research.md          # Research findings (decisions 1–8)
├── data-model.md        # Extended RepoEntry shape
├── quickstart.md        # Usage guide
├── checklists/
│   └── requirements.md  # Spec quality checklist (all ✅)
└── tasks.md             # Task breakdown (US1–US3 ✅, US4 🔲)
```

### Source Code (repository root)

```text
js/
  inventory-loader.js    # assetId + itOwner on all 27 repos ✅
  main.js                # repos map includes assetId + itOwner ✅ (bug fix)
index.html               # ITOwner filter ✅; assetId filter 🔲; radar/heatmap/gap display ✅
assess.html              # assetId + itOwner in repo info bar ✅
inventory-editor.html    # form fields + readFormValues() + renderNewForm() ✅
```

## UI Design

### Inventory Editor — Metadata Form (implemented ✅)

```
Name *               [orders-api                  ]
Display Name         [orders-api                  ]
Repo Link            [https://github.com/...      ]
Asset ID             [ASSET-001                   ]   ← added
IT Owner             [Alice Chen                  ]   ← added
[Type ▼]  [Tier ▼]
Team *               [Commerce                    ]
```

### Dashboard — Filter Bar (US3 ✅, US4 🔲)

```
Type ▼   Team ▼   IT Owner ▼   Asset ID ▼   Tier ▼   Search   [tabs]
```

US4 adds the **Asset ID** dropdown after IT Owner. Populated from unique
non-empty `assetId` values. Works identically to the ITOwner filter.

### Dashboard — Radar Card (implemented ✅)

```
orders-api                               Avg 3.4/5
[T1] [API] [Commerce] [Alice Chen]
ASSET-001
```

### Dashboard — Heatmap (implemented ✅)

```
| Repo | Tier | Type | Team | Asset ID  | IT Owner    | Avg | ... |
```

### Dashboard — Gap Analysis (implemented ✅)

```
[orders-api API] [T1] [Alice Chen] [dimension] [sub-dim] [bar] 3 → 4
```

### Assessment Tool — Info Bar (implemented ✅)

```
orders-api  [API]  [T1]  Commerce  Asset ID: ASSET-001  IT Owner: Alice Chen  Current avg: 3.4 | …
```

## Interaction Model

| Action | Mechanism | Status |
|---|---|---|
| Filter by ITOwner | `<select id="filter-itowner">` → `getFiltered()` | ✅ |
| Filter by AssetID | `<select id="filter-assetid">` → `getFiltered()` | 🔲 US4 |
| Edit assetId | Text input in editor → `readFormValues()` → `saveRepo()` | ✅ |
| Edit itOwner | Text input in editor → `readFormValues()` → `saveRepo()` | ✅ |
| Export includes fields | `JSON.stringify(workingCopy)` includes all fields | ✅ |

## Validation

| Field     | Validation    | Behavior |
|-----------|---------------|----------|
| `assetId` | None — optional | Blank is valid; stored as `''` |
| `itOwner` | None — optional | Blank is valid; stored as `''` |

## Graceful Degradation

All field reads use nullish coalescing: `repo.assetId ?? ''` and
`repo.itOwner ?? ''`. The `repos` array in `main.js` now explicitly includes
both fields via the repos map, making them available to all pages.

## Key Implementation Notes — US4 (AssetID filter)

US1–US3 notes already executed. Only US4 notes remain actionable.

1. **`index.html` — filter bar HTML**: Add `<label>Asset ID</label>` and
   `<select id="filter-assetid"><option value="all">All Assets</option></select>`
   after the IT Owner filter group and before the Tier filter group.

2. **`index.html` — `initFilters()`**: Derive unique sorted non-empty `assetId`
   values from `repos`, append one `<option>` per value, wire a `change`
   listener that calls `renderCurrentView()` — same pattern as the ITOwner
   filter added in US3.

3. **`index.html` — `getFiltered()`**: Add condition:
   ```js
   const assetid = document.getElementById('filter-assetid').value;
   (assetid === 'all' || (r.assetId ?? '') === assetid) &&
   ```

4. **No other files need changes** for US4.

## Sample Data Scheme

| Index | Repo                  | assetId    | itOwner         |
|-------|-----------------------|------------|-----------------|
| 0     | orders-api            | ASSET-001  | Alice Chen      |
| 1     | payments-api          | ASSET-002  | Alice Chen      |
| 2     | inventory-api         | ASSET-003  | Bob Nguyen      |
| 3     | users-api             | ASSET-004  | Carol Smith     |
| 4     | notifications-api     | ASSET-005  | Carol Smith     |
| 5     | search-api            | ASSET-006  | Carol Smith     |
| 6     | pricing-api           | ASSET-007  | Alice Chen      |
| 7     | shipping-api          | ASSET-008  | Bob Nguyen      |
| 8     | order-processor       | ASSET-009  | Alice Chen      |
| 9     | payment-reconciler    | ASSET-010  | Alice Chen      |
| 10    | report-generator      | ASSET-011  | Dana Park       |
| 11    | data-sync-service     | ASSET-012  | Carol Smith     |
| 12    | etl-pipeline          | ASSET-013  | Dana Park       |
| 13    | cache-warmer          | ASSET-014  | Carol Smith     |
| 14    | customer-portal       | ASSET-015  | Alice Chen      |
| 15    | admin-dashboard       | ASSET-016  | Carol Smith     |
| 16    | warehouse-ui          | ASSET-017  | Bob Nguyen      |
| 17    | analytics-ui          | ASSET-018  | Dana Park       |
| 18    | mobile-app            | ASSET-019  | Alice Chen      |
| 19    | auth-library          | ASSET-020  | Carol Smith     |
| 20    | logging-lib           | ASSET-021  | Carol Smith     |
| 21    | common-models         | ASSET-022  | Carol Smith     |
| 22    | http-client-lib       | ASSET-023  | Carol Smith     |
| 23    | infrastructure-repo   | ASSET-024  | Erik Torres     |
| 24    | ci-templates          | ASSET-025  | Erik Torres     |
| 25    | monitoring-config     | ASSET-026  | Erik Torres     |
