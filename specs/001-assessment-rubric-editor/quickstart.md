# Quickstart: Assessment Rubric Editor

**Feature**: `001-assessment-rubric-editor`
**Date**: 2026-05-12

## Using the Editor

1. Open `rubric-editor.html` in a browser (no server required; works from `file://`).
2. The left sidebar lists all 7 dimensions and their 4 sub-dimensions each.
3. Click any sub-dimension to load its criteria in the right panel.
4. **Edit a criterion**: Click the criterion text — it becomes editable in place.
   Press **Enter** or click outside to confirm. Press **Escape** to cancel.
5. **Add a criterion**: Click **+ Add criterion** at the bottom of any level section.
   A blank editable criterion appears; type and confirm.
6. **Delete a criterion**: Click the **×** button on a criterion row. Deletion is
   blocked (button disabled) when only one criterion remains at a level.
7. An **Unsaved changes** badge appears in the header when edits exist.
8. **Discard**: Click **Discard changes** to revert all edits to the original
   loaded rubric.

## Saving Changes

The editor has no backend. To persist edits:

1. Click **Export JS** in the header.
2. The updated `ASSESSMENT` JavaScript is copied to your clipboard.
   A fallback textarea appears if clipboard access is denied.
3. Open `js/assessment-loader.js` in a text editor.
4. Select and replace the entire `var ASSESSMENT = { ... };` block with the
   copied text.
5. Save `assessment-loader.js`.
6. Refresh `assess.html` — the assessment tool now uses the updated rubric.

## Verifying the Export

After pasting and saving:

- Open `assess.html` in a browser.
- Select any repo and walk through the assessment checklist.
- Confirm your edited criteria text appears correctly.
- Open the browser console — there should be zero errors on load.

## File Layout

```
rubric-editor.html          # The editor page (new file)
js/
  dimensions-loader.js      # DIMENSIONS global (unchanged)
  tiers-loader.js           # TIERS, ORG_MINIMUMS globals (unchanged)
  inventory-loader.js       # REPO_INVENTORY global (unchanged)
  assessment-loader.js      # ASSESSMENT global — edit this file with the export
  main.js                   # Shared helpers (unchanged)
```

The editor adds only `rubric-editor.html` to the repository. No other files are
created or modified at runtime.
