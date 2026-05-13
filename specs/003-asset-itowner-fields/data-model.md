# Data Model: AssetID and ITOwner Fields

**Feature**: `003-asset-itowner-fields`
**Date**: 2026-05-12

## Overview

Two optional string fields — `assetId` and `itOwner` — are added to every entry
in `REPO_INVENTORY`. No new entities are introduced. No scoring logic changes.

## Extended Repo Entry Shape

```js
{
  name:        string,   // unique key (unchanged)
  displayName: string,   // (unchanged)
  repoLink:    string,   // (unchanged)
  assetId:     string,   // NEW — enterprise asset tracking ID, e.g. "ASSET-001"; defaults to ""
  itOwner:     string,   // NEW — person or team name responsible for the repo; defaults to ""
  type:        string,   // one of REPO_TYPES (unchanged)
  team:        string,   // (unchanged)
  tier:        1 | 2 | 3, // (unchanged)
  current: {             // (unchanged)
    [subDimKey: string]: number
  }
}
```

## Field Definitions

| Field     | Type   | Required | Default | Validation                    |
|-----------|--------|----------|---------|-------------------------------|
| `assetId` | string | No       | `''`    | None — any string accepted    |
| `itOwner` | string | No       | `''`    | None — any string accepted    |

## Validation Rules

| Field     | Rule               | Behavior on violation |
|-----------|--------------------|-----------------------|
| `assetId` | Optional free text | No error if blank     |
| `itOwner` | Optional free text | No error if blank     |

No uniqueness constraint on `assetId` (two repos may share the same asset ID).

## Defaults in New-Repo Form

When a new repo is created in `inventory-editor.html`, both fields default to
`''` (empty string). Blank fields are preserved as `''` in `workingCopy` and in
the exported JS.

## Graceful Degradation

Code that reads these fields MUST use `repo.assetId ?? ''` and
`repo.itOwner ?? ''` to tolerate repos loaded from older exports that lack the
keys entirely. This applies in `index.html`, `assess.html`, and
`inventory-editor.html`.

## Sample Values (27 repos)

Sample values follow `ASSET-NNN` for `assetId` (three-digit, zero-padded) and
use existing team names or specific person names for `itOwner`, sourced from
the five teams already in the inventory: Commerce, Platform, Supply Chain,
Analytics, DevOps.

## Export Shape

```js
var REPO_INVENTORY = [
  {
    "name": "orders-api",
    "displayName": "orders-api",
    "repoLink": "https://github.com/acme-corp/orders-api",
    "assetId": "ASSET-001",
    "itOwner": "Alice Chen",
    "type": "API",
    "team": "Commerce",
    "tier": 1,
    "current": { ... }
  },
  ...
];
```

Produced by the existing `buildExportJS()` in `inventory-editor.html`:
```js
`var REPO_INVENTORY = ${JSON.stringify(workingCopy, null, 2)};\n`
```

No change to the export function is needed — `JSON.stringify` will include the
new fields automatically once they exist in `workingCopy`.
