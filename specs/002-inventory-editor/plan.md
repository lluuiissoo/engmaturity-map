# Implementation Plan: Inventory Editor

**Branch**: `002-inventory-editor` | **Date**: 2026-05-12 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-inventory-editor/spec.md`

## Summary

Add `inventory-editor.html` — a standalone browser page for full CRUD
management of the repo inventory defined in `js/inventory-loader.js`. The
editor reads the live `REPO_INVENTORY` global, maintains an in-memory working
copy, and exports the updated array as a copy-pasteable
`var REPO_INVENTORY = [...];` JavaScript block.

## Technical Context

**Language/Version**: Vanilla ES6+ JavaScript (no transpilation)

**Primary Dependencies**: None new. Existing globals `REPO_INVENTORY`,
`DIMENSIONS`, `REPO_TYPES`, and `overallScore()` (all from the standard loader
chain + `main.js`) are the only data and logic sources.

**Storage**: In-memory only. Persistence via manual copy-paste of exported JS
into `inventory-loader.js`.

**Testing**: Manual browser testing (no automated test suite per constitution).
Golden-path test: add a repo, edit scores, delete another repo → export → paste
into `inventory-loader.js` → verify in `index.html`.

**Target Platform**: Desktop browser; `file://` and static HTTP. No mobile
requirement.

**Project Type**: Standalone browser page (same pattern as `rubric-editor.html`
and `assess.html`).

**Performance Goals**: Sub-second interactions; 27 repos in list; up to 28
number inputs rendered in the edit form at a time. No measurable load time
beyond the existing loader chain.

**Constraints**: Offline-capable; works from `file://`; dark theme via CSS
custom properties; no CDN dependencies beyond what the existing pages already
load.

**Scale/Scope**: Single page, single user. 27 sample repos; each has 34 total
fields (6 metadata + 28 scores).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Pre-Design | Post-Design | Notes |
|---|---|---|---|
| I. Client-Side Only | ✅ | ✅ | Browser-only; no server component |
| II. Data as JS Files | ✅ | ✅ | Reads `REPO_INVENTORY` global; exports valid JS array |
| III. Vanilla JS — No Framework, No Build | ✅ | ✅ | No new deps; plain ES6+; all JS inline in HTML |
| IV. Script Load-Order Integrity | ✅ | ✅ | Full loader chain; inline script last |
| V. Cumulative, Strict Scoring | ✅ | ✅ | Score values edited as data; scoring logic in `main.js` untouched |

All gates pass. No complexity violations.

## Project Structure

### Documentation (this feature)

```text
specs/002-inventory-editor/
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
inventory-editor.html    # New standalone editor page (only file added)
js/
  dimensions-loader.js   # Unchanged — DIMENSIONS
  tiers-loader.js        # Unchanged — TIERS, ORG_MINIMUMS
  inventory-loader.js    # Unchanged at runtime — user pastes export here
  assessment-loader.js   # Unchanged — ASSESSMENT
  main.js                # Unchanged — REPO_TYPES, overallScore(), dimScore()
```

**Structure Decision**: Single-file addition. All editor logic inline in
`inventory-editor.html`. No separate JS file. No existing files modified.

## UI Design

### Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ HEADER: "MaturityMap — Inventory Editor"                             │
│ [← Dashboard] [Rubric Editor]  [● Unsaved]  [Discard All]           │
│                                             [Copy JS] [Download JS] │
├──────────────────────┬──────────────────────────────────────────────┤
│ SIDEBAR              │ EDIT PANEL                                   │
│ [Type ▼] [Team ▼]   │                                              │
│ [+ Add Repo]         │  orders-api                                  │
│                      │  ─────────────────────────────              │
│ ● orders-api   T1 3.4│  Display Name: [orders-api         ]        │
│   payments-api T1 2.8│  Repo Link:    [https://github.com/]        │
│   users-api    T1 4.8│  Type:         [API              ▼]         │
│   ...                │  Team:         [Commerce           ]        │
│                      │  Tier:         [1                ▼]         │
│                      │                                              │
│                      │  ▼ Build & Delivery                          │
│                      │    CI/CD Maturity       [4]                  │
│                      │    Build Reliability    [3]                  │
│                      │    Deploy Frequency     [4]                  │
│                      │    Release Process      [3]                  │
│                      │  ▶ Code Quality                              │
│                      │  ▶ Security   ...                            │
│                      │                                              │
│                      │  [Save]  [Discard]  [Delete]                │
└──────────────────────┴──────────────────────────────────────────────┘
```

### Key JS State Variables

| Variable | Type | Purpose |
|---|---|---|
| `workingCopy` | `Array<RepoEntry>` | Deep clone of REPO_INVENTORY; all mutations applied here |
| `isDirty` | `boolean` | True when workingCopy has been modified (export needed) |
| `selectedIdx` | `number\|null` | Index of open repo in workingCopy; null = no selection |
| `isNewRepo` | `boolean` | True when panel shows add-new form (not yet in workingCopy) |
| `filterType` | `string` | Active type filter (`""` = all) |
| `filterTeam` | `string` | Active team filter (`""` = all) |

### Interaction Model

| Action | Mechanism |
|---|---|
| Filter list | `<select>` dropdowns → re-render sidebar |
| Select repo | Click list item → `renderPanel(idx)` |
| Add repo | Click "+ Add Repo" → `renderNewForm()` |
| Save edits | "Save" button → read form, validate, write to `workingCopy[idx]`, `setDirty(true)` |
| Save new repo | "Save" button → validate, push to `workingCopy`, `setDirty(true)` |
| Discard form | "Discard" button → re-render form from `workingCopy[selectedIdx]` |
| Delete repo | "Delete" → confirm → splice from `workingCopy`, `setDirty(true)` |
| Discard all | Header button → reset `workingCopy` from `REPO_INVENTORY`, `setDirty(false)` |
| Copy JS | `navigator.clipboard.writeText(buildExportJS())` + "Copied!" flash |
| Download JS | Blob URL download of `inventory-YYYY-MM-DD.js` |

### Validation on Save

| Check | Error shown |
|---|---|
| Name is empty | "Name is required" (inline below name field) |
| Name duplicates another entry | "A repo named '[X]' already exists" |
| Team is empty | "Team is required" |
| Any score < 1 or > 5 | "Score for [sub-dim label] must be between 1 and 5" |

### Script Load Order in `inventory-editor.html`

```html
<script src="js/dimensions-loader.js"></script>   <!-- DIMENSIONS -->
<script src="js/tiers-loader.js"></script>         <!-- TIERS, ORG_MINIMUMS -->
<script src="js/inventory-loader.js"></script>     <!-- REPO_INVENTORY -->
<script src="js/assessment-loader.js"></script>    <!-- ASSESSMENT -->
<script src="js/main.js"></script>                 <!-- REPO_TYPES, overallScore, dimScore -->
<script>/* inline editor logic */</script>
```

### Export Format

```js
var REPO_INVENTORY = [
  {
    "name": "orders-api",
    "displayName": "orders-api",
    "repoLink": "https://github.com/acme-corp/orders-api",
    "type": "API",
    "team": "Commerce",
    "tier": 1,
    "current": { "cicd": 4, "buildReliability": 3, ... }
  },
  ...
];
```

Produced by:
```js
`var REPO_INVENTORY = ${JSON.stringify(workingCopy, null, 2)};\n`
```
