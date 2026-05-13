# Quickstart: AssetID and ITOwner Fields

**Feature**: `003-asset-itowner-fields`
**Date**: 2026-05-12

## What Changes

All 27 repos in `js/inventory-loader.js` gain two new optional fields:

| Field     | Example         | Purpose                                     |
|-----------|-----------------|---------------------------------------------|
| `assetId` | `"ASSET-007"`   | Enterprise asset tracking identifier        |
| `itOwner` | `"Alice Chen"`  | Person or team responsible for the repo     |

These fields appear in the editor, dashboard, and assessment tool.

## Using the Inventory Editor

1. Open `inventory-editor.html` in a browser.
2. Click any repo from the sidebar.
3. The edit form now shows **Asset ID** and **IT Owner** fields below Repo Link.
4. Edit either field and click **Save** — changes take effect in the working copy.
5. Click **Copy JS** or **Download JS** to export. Both new fields appear in the
   exported `var REPO_INVENTORY = [...];` block automatically.
6. Paste into `js/inventory-loader.js` and verify in `index.html`.

**Adding a new repo**: The new-repo form also includes Asset ID and IT Owner,
both pre-filled as blank. Leave them blank or fill them in before saving.

## Using the Dashboard (index.html)

- A new **IT Owner** filter dropdown appears in the header filter bar, after the
  Team filter. Select an owner to narrow all five views to repos owned by that
  person.
- The **Radar view** shows an ITOwner badge on each card. If AssetID is set, it
  appears as a small label below the badges.
- The **Heatmap** has two new columns (Asset ID, IT Owner) between Team and Avg.
- The **Gap Analysis** view shows IT Owner next to the tier badge.

## Using the Assessment Tool (assess.html)

- When a repo is selected, the info bar now shows Asset ID and IT Owner alongside
  the existing type, tier, and team metadata.

## Verifying the Round-Trip

1. In `inventory-editor.html`, edit a repo's Asset ID and IT Owner, click Save.
2. Click **Copy JS**.
3. Paste into `js/inventory-loader.js`, replacing the existing `var REPO_INVENTORY = [...];` block.
4. Open `index.html` — the repo appears with updated Asset ID and IT Owner in
   the heatmap and radar card.
5. Open `assess.html`, select the repo — Asset ID and IT Owner appear in the
   info bar.
6. Open the browser console — zero errors.

## File Changes

```
js/inventory-loader.js       # assetId + itOwner added to all 27 repos
inventory-editor.html        # form fields + readFormValues() updated
index.html                   # ITOwner filter + display in radar/heatmap/gap
assess.html                  # repo info bar shows assetId + itOwner
```

No other files are modified.
