# Implementation Plan: Assessment Rubric Editor

**Branch**: `001-assessment-rubric-editor` | **Date**: 2026-05-12 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-assessment-rubric-editor/spec.md`

## Summary

Add `rubric-editor.html` — a standalone browser page that lets an engineering
manager browse, inline-edit, and export the maturity rubric defined in
`js/assessment-loader.js`. The editor reads the live `ASSESSMENT` global,
maintains an in-memory working copy, and exports the full updated rubric as
a copy-pasteable `var ASSESSMENT = {...};` JavaScript block.

## Technical Context

**Language/Version**: Vanilla ES6+ JavaScript (no transpilation)

**Primary Dependencies**: None new. Existing globals `DIMENSIONS` and
`ASSESSMENT` (loaded by the standard loader chain) are the only data sources.

**Storage**: In-memory only. Persistence via manual copy-paste of exported JS
into `js/assessment-loader.js`.

**Testing**: Manual browser testing (no automated test suite per constitution).
Golden-path test: edit a criterion → export → paste into `assessment-loader.js`
→ verify in `assess.html`.

**Target Platform**: Desktop browser; `file://` and static HTTP. No mobile
requirement.

**Project Type**: Standalone browser page (same pattern as `assess.html`).

**Performance Goals**: Sub-second UI interactions for all 28 sub-dimensions ×
5 levels. No measurable load time beyond the existing loader chain.

**Constraints**: Offline-capable; works from `file://`; dark theme via CSS
custom properties; no CDN dependencies beyond what the existing pages already
load.

**Scale/Scope**: Single page, single user. ~140 editable criterion strings.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Pre-Design | Post-Design | Notes |
|---|---|---|---|
| I. Client-Side Only | ✅ | ✅ | Browser-only; no server component |
| II. Data as JS Files | ✅ | ✅ | Reads `ASSESSMENT` global; exports valid JS |
| III. Vanilla JS — No Framework, No Build | ✅ | ✅ | No new deps; plain ES6+; all JS inline in HTML |
| IV. Script Load-Order Integrity | ✅ | ✅ | Full loader chain loaded; inline script runs last |
| V. Cumulative, Strict Scoring | ✅ | ✅ | Editor touches criterion text only; scoring untouched |

All gates pass. No complexity violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/001-assessment-rubric-editor/
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
rubric-editor.html       # New standalone editor page (only file added)
js/
  dimensions-loader.js   # Unchanged — provides DIMENSIONS global
  tiers-loader.js        # Unchanged — provides TIERS, ORG_MINIMUMS globals
  inventory-loader.js    # Unchanged — provides REPO_INVENTORY global
  assessment-loader.js   # Unchanged at runtime — user pastes export here
  main.js                # Unchanged — provides shared helpers
```

**Structure Decision**: Single-file addition. All editor logic is inline in
`rubric-editor.html` following the identical pattern of `assess.html`. No
separate JS file is created; no existing files are modified by the feature.

## UI Design

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER: "MaturityMap — Rubric Editor"  [nav links]             │
│  [● Unsaved changes]    [Discard]  [Export JS]  [Copy JS]       │
├──────────────────────┬──────────────────────────────────────────┤
│  SIDEBAR             │  MAIN PANEL                              │
│                      │                                          │
│  ▶ Build & Delivery  │  CI/CD Maturity                          │
│    CI/CD Maturity ◀  │                                          │
│    Build Reliability │  ▼ Level 1 — Ad-hoc                      │
│    Deploy Frequency  │    • [criterion text]           [×]      │
│    Release Process   │    • [criterion text]           [×]      │
│                      │    + Add criterion                       │
│  ▶ Code Quality      │                                          │
│    Test Coverage     │  ▼ Level 2 — Basic                       │
│    ...               │    • [criterion text]           [×]      │
│                      │    + Add criterion                       │
│  ▶ Security          │                                          │
│  ▶ Observability     │  ▼ Level 3 — Defined                     │
│  ▶ Resilience        │    ...                                   │
│  ▶ Documentation     │                                          │
│  ▶ Infrastructure    │  ▼ Level 4 — Managed                     │
│                      │    ...                                   │
│                      │                                          │
│                      │  ▼ Level 5 — Optimized                   │
│                      │    ...                                   │
└──────────────────────┴──────────────────────────────────────────┘
```

### Interaction Model

| Action | Mechanism |
|---|---|
| Select sub-dimension | Click sidebar item; right panel re-renders |
| Edit criterion | Click text → `contenteditable="plaintext-only"` activates; Enter or blur confirms; Escape cancels |
| Add criterion | Click "+ Add criterion" → blank editable criterion appended to level |
| Delete criterion | Click [×] button; disabled when only 1 criterion at that level |
| Discard | Replaces `workingCopy` with fresh `JSON.parse(JSON.stringify(ASSESSMENT))` |
| Export JS | `navigator.clipboard.writeText(jsString)` + fallback textarea |
| Dirty indicator | Header badge shown when `isDirty === true` |

### Script Load Order in `rubric-editor.html`

```html
<script src="js/dimensions-loader.js"></script>   <!-- DIMENSIONS -->
<script src="js/tiers-loader.js"></script>         <!-- TIERS, ORG_MINIMUMS -->
<script src="js/inventory-loader.js"></script>     <!-- REPO_INVENTORY -->
<script src="js/assessment-loader.js"></script>    <!-- ASSESSMENT -->
<script src="js/main.js"></script>                 <!-- shared helpers -->
<script>/* inline editor logic */</script>         <!-- depends on DIMENSIONS, ASSESSMENT -->
```

### Key JS Variables (inline script)

| Variable | Type | Purpose |
|---|---|---|
| `workingCopy` | `Object` | Deep clone of `ASSESSMENT`; all edits applied here |
| `isDirty` | `boolean` | True when `workingCopy` has unsaved edits |
| `selectedSubKey` | `string\|null` | Currently displayed sub-dimension key |

### Export Format

```js
var ASSESSMENT = {
  "cicd": {
    "1": [
      "criterion one",
      "criterion two"
    ],
    "2": [ ... ],
    ...
  },
  ...
};
```

Produced by:
```js
`var ASSESSMENT = ${JSON.stringify(workingCopy, null, 2)};\n`
```
