# Implementation Plan: AssetID and ITOwner Fields

**Branch**: `003-asset-itowner-fields` | **Date**: 2026-05-12 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/003-asset-itowner-fields/spec.md`

## Summary

Add two optional string metadata fields — `assetId` and `itOwner` — to every
entry in `REPO_INVENTORY`. Propagate both fields across all four affected pages:
`js/inventory-loader.js` (data source), `inventory-editor.html` (CRUD form),
`index.html` (dashboard filter + display), and `assess.html` (info bar). No
scoring logic, no new JS files, no new loader scripts.

## Technical Context

**Language/Version**: Vanilla ES6+ JavaScript (no transpilation)

**Primary Dependencies**: None new. Reads `REPO_INVENTORY` global (from
`inventory-loader.js`) and display helpers from `main.js`. No CDN additions.

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

**Scale/Scope**: 4 files modified; 2 new fields; 27 repos updated in
`inventory-loader.js`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Pre-Design | Post-Design | Notes |
|---|---|---|---|
| I. Client-Side Only | ✅ | ✅ | Browser-only; no server component |
| II. Data as JS Files | ✅ | ✅ | Fields added to `inventory-loader.js`; exported as valid JS |
| III. Vanilla JS — No Framework, No Build | ✅ | ✅ | No new deps; plain ES6+ |
| IV. Script Load-Order Integrity | ✅ | ✅ | No new scripts; existing chain unchanged |
| V. Cumulative, Strict Scoring | ✅ | ✅ | Fields are metadata only; scoring logic untouched |

All gates pass. No complexity violations.

## Project Structure

### Documentation (this feature)

```text
specs/003-asset-itowner-fields/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 research findings
├── data-model.md        # Phase 1 data model
├── quickstart.md        # Phase 1 usage guide
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit-tasks — not yet created)
```

### Source Code (repository root)

```text
js/
  inventory-loader.js    # Add assetId + itOwner to all 27 repos
index.html               # Add ITOwner filter; show assetId/itOwner in radar/heatmap/gap
assess.html              # Show assetId + itOwner in repo info bar
inventory-editor.html    # Add form fields; update readFormValues() + renderNewForm()
```

**Structure Decision**: Modification-only. No new files in the source tree.
Four files changed; no new loader scripts; load order unaffected.

## UI Design

### Inventory Editor — Metadata Form (updated)

```
Name *               [orders-api                  ]
Display Name         [orders-api                  ]
Repo Link            [https://github.com/...      ]
Asset ID             [ASSET-001                   ]   ← NEW
IT Owner             [Alice Chen                  ]   ← NEW
[Type ▼]  [Tier ▼]
Team *               [Commerce                    ]
```

Both `assetId` and `itOwner` are optional text inputs placed between `repoLink`
and the Type/Tier row.

### Dashboard (index.html) — Filter Bar (updated)

```
Type ▼   Team ▼   IT Owner ▼   Tier ▼   Search   [Dimensions/Sub-dim]   [Tabs]
```

IT Owner filter placed after Team, before Tier. Populated from unique non-empty
`itOwner` values across all repos.

### Dashboard — Radar Card (updated)

```
orders-api                               Avg 3.4/5
[T1] [API] [Commerce] [Alice Chen]  ← itOwner badge added
ASSET-001                           ← assetId if non-empty
```

### Dashboard — Heatmap (updated)

```
| Repo | Tier | Type | Team | Asset ID  | IT Owner    | Avg | B&D | CQ | ... |
| orders-api | T1 | API | Commerce | ASSET-001 | Alice Chen | 3.4 | ... |
```

Two columns added after Team, before Avg.

### Dashboard — Gap Analysis (updated)

```
[orders-api API] [T1] [Alice Chen] [Build & Delivery] [CI/CD Maturity] [bar] 3 → 4
```

IT Owner added as a column after the tier badge.

### Assessment Tool (assess.html) — Repo Info Bar (updated)

```
orders-api  [API]  [T1]  Commerce  ASSET-001  Alice Chen  Current avg: 3.4 | Target: 3.8
```

`assetId` and `itOwner` appended as labeled spans.

## Interaction Model

| Action | Mechanism |
|---|---|
| Filter by ITOwner | `<select>` in header → `getFiltered()` filters by `repo.itOwner ?? ''` |
| Edit assetId | Text input in inventory editor form → `readFormValues()` → `saveRepo()` |
| Edit itOwner | Text input in inventory editor form → `readFormValues()` → `saveRepo()` |
| Export includes fields | `buildExportJS()` unchanged — `JSON.stringify(workingCopy)` includes all fields |

## Validation

| Field     | Validation    | Behavior |
|-----------|---------------|----------|
| `assetId` | None — optional | Blank is valid; stored as `''` |
| `itOwner` | None — optional | Blank is valid; stored as `''` |

## Graceful Degradation

All field reads use nullish coalescing: `repo.assetId ?? ''` and
`repo.itOwner ?? ''`. This ensures repos loaded from older exports (without
these keys) display cleanly without console errors.

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

(26 entries above — if inventory-loader.js has 27, adjust ASSET-027 for the
27th repo; use same pattern.)

## Key Implementation Notes

1. **`inventory-loader.js`**: Add `assetId` and `itOwner` inline on each repo
   object, between `repoLink` and `type`, to match the field ordering defined
   in the data model. All 27 repos must be updated.

2. **`inventory-editor.html` — `buildRepoForm()`**: Insert two `field()` calls
   for `assetId` and `itOwner` after the `repoLink` field and before the
   `form-row-2` div containing type/tier. Both are optional (no `*` marker).

3. **`inventory-editor.html` — `readFormValues()`**: Add
   `assetId: document.getElementById('f-assetId').value.trim()` and
   `itOwner: document.getElementById('f-itOwner').value.trim()`.

4. **`inventory-editor.html` — `renderNewForm()`**: The `defaults` object must
   include `assetId: ''` and `itOwner: ''`.

5. **`index.html` — filter init**: Add `<select id="filter-itowner">` to the
   HTML filter bar. In `initFilters()`, populate it from unique non-empty
   `itOwner` values. In `getFiltered()`, add the itOwner condition.

6. **`index.html` — `renderRadarView()`**: Append an itOwner badge to
   `radar-card-meta`; if `assetId` is non-empty, add a small label below.

7. **`index.html` — `renderHeatmapView()`**: Add `Asset ID` and `IT Owner`
   `<th>` elements and corresponding `<td>` cells in both depth modes.

8. **`index.html` — `renderGapView()`**: Add `itOwner` cell in `.gap-row` after
   the tier badge `<div>`.

9. **`assess.html` — repo info bar**: In the `repoSelect` change handler, append
   `assetId` and `itOwner` spans to the `info.innerHTML` for individual repos.
   For org/tier baselines, omit (those have no assetId/itOwner).
