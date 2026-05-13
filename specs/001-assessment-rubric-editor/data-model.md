# Data Model: Assessment Rubric Editor

**Feature**: `001-assessment-rubric-editor`
**Date**: 2026-05-12

## Overview

The editor operates entirely on in-memory data derived from the existing
`ASSESSMENT` and `DIMENSIONS` globals. No new persistent entities are introduced.
All mutations are held in a working copy; persistence is achieved by exporting
the working copy as JavaScript and manually replacing the file.

## Existing Globals (read-only sources)

### `ASSESSMENT` (from `assessment-loader.js`)

```
{
  [subDimKey: string]: {          // e.g. "cicd", "testCoverage"
    [level: "1"|"2"|"3"|"4"|"5"]: string[]   // array of criterion strings
  }
}
```

- 28 sub-dimension keys total
- Each key maps to exactly 5 level entries
- Each level entry holds 2–4 criterion strings
- Total criterion count: ~140

### `DIMENSIONS` (from `dimensions-loader.js`)

```
Array<{
  key: string,       // e.g. "buildDelivery"
  label: string,     // e.g. "Build & Delivery"
  subs: Array<{
    key: string,     // e.g. "cicd"
    label: string    // e.g. "CI/CD Maturity"
  }>
}>
```

- 7 dimension objects, each with exactly 4 sub-dimensions

## Editor Working Copy

### `workingCopy` (in-memory, not persisted)

A deep clone of `ASSESSMENT` created at page load:

```js
let workingCopy = JSON.parse(JSON.stringify(ASSESSMENT));
```

All edits (text changes, additions, deletions) are applied to `workingCopy`.
The original `ASSESSMENT` global is never mutated.

### `isDirty` (boolean flag)

Set to `true` on any mutation of `workingCopy`. Reset to `false` when the user
discards changes (workingCopy is replaced with a fresh clone of `ASSESSMENT`).

## Derived UI State

| State variable | Type | Description |
|---|---|---|
| `selectedSubKey` | `string \| null` | Which sub-dimension is shown in the right panel |
| `workingCopy` | `Object` | Deep clone of `ASSESSMENT`; the editor's mutable source of truth |
| `isDirty` | `boolean` | Whether `workingCopy` differs from the original load |

## Validation Rules

| Rule | Scope | Behavior |
|---|---|---|
| Non-empty criterion | Per criterion on blur/confirm | Blank text reverts to prior value; field stays active |
| Minimum one criterion per level | Per level on delete | Delete button disabled when only one criterion remains |

## Export Shape

The export serializes `workingCopy` as a valid JS assignment:

```js
var ASSESSMENT = {
  "cicd": {
    "1": ["criterion a", "criterion b"],
    ...
  },
  ...
};
```

This string replaces the entire `var ASSESSMENT = {...};` block in
`assessment-loader.js`. The output MUST be round-trip safe: `JSON.parse(JSON.stringify(workingCopy))` equals `workingCopy`.
