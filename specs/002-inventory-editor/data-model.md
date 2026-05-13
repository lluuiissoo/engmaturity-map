# Data Model: Inventory Editor

**Feature**: `002-inventory-editor`
**Date**: 2026-05-12

## Overview

The editor operates on an in-memory deep clone of `REPO_INVENTORY`. No new
persistent entities are introduced. Persistence is achieved by exporting the
working copy as JavaScript and manually replacing the file.

## Existing Globals (read-only sources)

### `REPO_INVENTORY` (from `inventory-loader.js`)

```
Array<{
  name:        string,   // unique key, used in score lookups
  displayName: string,
  repoLink:    string,   // URL, may be empty string
  type:        string,   // one of REPO_TYPES
  team:        string,
  tier:        1 | 2 | 3,
  current: {
    [subDimKey: string]: number   // integer 1–5, 28 keys total
  }
}>
```

- 27 entries in the sample inventory
- Each entry has exactly 28 sub-dimension keys in `current`

### `REPO_TYPES` (from `main.js`)

```
['API', 'UI', 'Windows Service', 'Library', 'Shared']
```

Fixed enum used to populate the type dropdown.

### `DIMENSIONS` (from `dimensions-loader.js`)

Used to group the 28 score inputs in the edit form under 7 collapsible sections.

### `overallScore(scores)` (from `main.js`)

Helper used to compute and display the overall score for each repo in the list.

## Editor Working Copy

### `workingCopy` (in-memory array)

```js
let workingCopy = JSON.parse(JSON.stringify(REPO_INVENTORY));
```

All mutations (saves, adds, deletes) are applied to this array. The original
`REPO_INVENTORY` global is never mutated.

## Editor UI State

| Variable | Type | Description |
|---|---|---|
| `workingCopy` | `Array<RepoEntry>` | Deep clone of REPO_INVENTORY; mutable source of truth |
| `isDirty` | `boolean` | True when workingCopy differs from the original loaded data |
| `selectedIdx` | `number \| null` | Index into workingCopy of the currently displayed repo, or `null` for new-repo form |
| `filterType` | `string` | Active type filter (`""` = all) |
| `filterTeam` | `string` | Active team filter (`""` = all) |
| `isNewRepo` | `boolean` | True when the right panel is showing the add-new-repo form |

## Validation Rules

| Field | Rule | Behavior on violation |
|---|---|---|
| `name` | Required, non-empty | Save blocked; inline message shown |
| `name` | Unique (case-insensitive) across workingCopy | Save blocked; inline message shown |
| `type` | Must be one of REPO_TYPES | Enforced by `<select>` dropdown; cannot be violated |
| `tier` | Must be 1, 2, or 3 | Enforced by `<select>` dropdown; cannot be violated |
| `team` | Required, non-empty | Save blocked; inline message shown |
| Score fields | Integer 1–5 | `<input type="number" min="1" max="5" step="1">`; JS validates on save |
| `displayName` | Optional; defaults to `name` if blank | No error; filled silently |
| `repoLink` | Optional; stored as empty string if blank | No error |

## Delete Behaviour

Deletion splices the entry from `workingCopy` at `selectedIdx`. If the deleted
repo was selected, the right panel reverts to the empty-state prompt. `isDirty`
is set to `true`.

## Add Behaviour

New repos are appended to `workingCopy` on Save. Default scores: all 28
sub-dimension keys set to `1`. `displayName` defaults to `name` if left blank.

## Export Shape

```js
var REPO_INVENTORY = [
  {
    "name": "orders-api",
    "displayName": "orders-api",
    "repoLink": "https://github.com/acme-corp/orders-api",
    "type": "API",
    "team": "Commerce",
    "tier": 1,
    "current": {
      "cicd": 4,
      "buildReliability": 3,
      ...
    }
  },
  ...
];
```

Produced by:
```js
`var REPO_INVENTORY = ${JSON.stringify(workingCopy, null, 2)};\n`
```

Round-trip safe: `JSON.parse(JSON.stringify(workingCopy))` equals `workingCopy`.
