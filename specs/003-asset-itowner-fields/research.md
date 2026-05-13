# Research: Add AssetID and ITOwner Fields

**Feature**: `003-asset-itowner-fields`
**Date**: 2026-05-12

No genuine unknowns required external research. All decisions derive directly
from existing codebase conventions. Findings documented below.

---

## Decision 1: Field Naming

**Decision**: `assetId` and `itOwner` (camelCase)

**Rationale**: All existing `current` sub-dimension keys and metadata fields use
camelCase (`repoLink`, `displayName`, `buildReliability`, `depFreshness`, etc.).
Consistency with the existing convention avoids confusion and matches
`JSON.stringify` output format without transformation.

**Alternatives considered**: `asset_id` / `it_owner` (snake_case) — rejected
because the entire codebase uses camelCase for property keys.

---

## Decision 2: Field Type and Default

**Decision**: Both fields are `string`, defaulting to `''` (empty string).

**Rationale**: `repoLink` uses the same pattern — optional string, empty string
when absent. `''` is falsy in JS so display logic can use `repo.assetId || '—'`
cleanly. No sentinel values needed.

**Alternatives considered**: `null` default — rejected because it requires null
checks everywhere; `''` is already the pattern used by `repoLink`.

---

## Decision 3: Placement in Inventory Editor Form

**Decision**: Add `assetId` and `itOwner` text inputs in the metadata section
of `buildRepoForm()` in `inventory-editor.html`, after the existing `repoLink`
field and before the Type/Tier row.

**Rationale**: Metadata fields are grouped at the top of the form before the
score sections. `assetId` and `itOwner` are metadata, not scores, so they belong
in the same group. Placing them after `repoLink` (the last URL-type field) and
before `type`/`tier` (the dropdowns) creates a logical read order: identity
fields (name, display name, link, asset id), then ownership (team, IT owner),
then classification (type, tier).

**Alternatives considered**: Separate "Ownership" section — rejected as
over-engineering for two fields.

---

## Decision 4: Display in assess.html

**Decision**: Append `assetId` and `itOwner` to the repo info bar that already
shows name, type, tier badge, and team.

**Rationale**: The info bar is the canonical per-repo metadata display in
`assess.html`. Inline display is consistent with the existing pattern for team
and type. AssetID appears as a labeled text span; ITOwner as a labeled text span.

**Alternatives considered**: Tooltip — rejected as harder to discover and
inconsistent with the existing bar layout.

---

## Decision 5: Dashboard (index.html) Display and Filter

**Decision**:
1. Add an **ITOwner `<select>` filter** to the header filters row, positioned
   after the Team filter. Populated from unique non-empty `itOwner` values.
   Works identically to the Type/Team/Tier filters (exact match, persists
   across view switches via `getFiltered()`).
2. **Radar card**: Add `itOwner` as a small badge in the card's meta row
   (alongside tier, type, team). Add `assetId` as a tiny label below the badges
   only if non-empty.
3. **Heatmap**: Add `AssetID` and `ITOwner` as two columns after the existing
   `Team` column (before `Avg` and the dimension cells). Both in sub-dimension
   and dimension modes.
4. **Gap view**: Add `itOwner` as a column after the repo name / tier badge.

**Rationale**: The filter is the primary value-add for the dashboard (US3). The
display additions (US1/FR-007) keep the data visible without requiring navigation
to the editor.

**Alternatives considered**: Showing `assetId` in Gap view — omitted because the
gap view is score-focused and the grid columns are already tight; assetId is
already visible in the heatmap.

---

## Decision 6: Graceful Degradation

**Decision**: Everywhere a repo field is read, use `repo.assetId ?? ''` and
`repo.itOwner ?? ''` (nullish coalescing), and ensure that filtering by itOwner
treats missing/empty as a non-match when a filter value is selected.

**Rationale**: Existing repos in the file will have the fields once
`inventory-loader.js` is updated, but defensive coding prevents breakage if a
user pastes an old export or manually edits the file.

---

## Decision 7: No Changes to main.js, tiers-loader.js, dimensions-loader.js, assessment-loader.js, or rubric-editor.html

**Decision**: Only these files change: `js/inventory-loader.js`,
`inventory-editor.html`, `index.html`, `assess.html`. No other files touched.

**Rationale**: The new fields are pure metadata — they carry no scoring weight,
no tier computation, and no rubric relationship. `main.js` `overallScore()` and
`dimScore()` are score-only helpers and need no awareness of `assetId`/`itOwner`.
`rubric-editor.html` edits `ASSESSMENT`, not `REPO_INVENTORY`.
