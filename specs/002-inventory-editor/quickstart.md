# Quickstart: Inventory Editor

**Feature**: `002-inventory-editor`
**Date**: 2026-05-12

## Using the Editor

1. Open `inventory-editor.html` in a browser (no server required; works from `file://`).
2. The left sidebar lists all repos with their type, tier, and overall score.
   Use the **Type** and **Team** dropdowns to filter the list.
3. Click any repo to open its edit form in the right panel.

### Editing a Repo

4. All fields are editable: Display Name, Repo Link, Type (dropdown), Team, Tier (dropdown).
5. The 28 maturity scores are grouped under 7 collapsible dimension sections.
   Click a section header to expand/collapse it.
6. Click **Save** to apply changes to the working inventory. The list updates
   immediately with the new overall score.
7. Click **Discard** to revert the form to the last-saved state for that repo.

### Adding a Repo

8. Click **+ Add Repo** at the top of the sidebar.
9. Fill in the required fields: Name, Type, Team, Tier.
   Display Name defaults to Name if left blank.
   Scores default to 1 for all 28 sub-dimensions unless changed.
10. Click **Save** — the new repo appears in the list.

### Deleting a Repo

11. Open the repo in the edit form and click **Delete**.
12. Confirm the dialog. The repo is removed from the list.

## Saving Changes

The editor has no backend. To persist edits:

1. Click **Copy JS** (or **Download JS**) in the header.
2. The updated `REPO_INVENTORY` JavaScript is copied to your clipboard.
   A fallback textarea appears if clipboard access is denied.
3. Open `js/inventory-loader.js` in a text editor.
4. Select and replace the entire `var REPO_INVENTORY = [...];` block with the
   copied text.
5. Save `inventory-loader.js`.
6. Refresh `index.html` — the dashboard now reflects the updated inventory.

## Verifying the Export

After pasting and saving:

- Open `index.html` in a browser.
- Confirm the dashboard shows all repos with correct types, tiers, and scores.
- Open the browser console — there should be zero errors on load.
- Open `assess.html` and select the edited repo — confirm scores match.

## File Layout

```
inventory-editor.html       # The editor page (new file)
js/
  dimensions-loader.js      # DIMENSIONS global (unchanged)
  tiers-loader.js           # TIERS, ORG_MINIMUMS globals (unchanged)
  inventory-loader.js       # REPO_INVENTORY global — paste the export here
  assessment-loader.js      # ASSESSMENT global (unchanged)
  main.js                   # Shared helpers including REPO_TYPES, overallScore (unchanged)
```

The editor adds only `inventory-editor.html`. No other files are created or
modified at runtime.
