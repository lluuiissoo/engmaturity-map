# Feature Specification: Inventory Editor

**Feature Branch**: `002-inventory-editor`

**Created**: 2026-05-12

**Status**: Draft

**Input**: User description: "Create a UI to manage data within js/inventory-loader.js"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse the Repo Inventory (Priority: P1)

An engineering manager opens the inventory editor to see all 27 repos currently
tracked: their names, types, teams, tiers, and overall maturity scores. They
can scan the list, filter by type or team, and open a repo to inspect its
current scores across all 28 sub-dimensions.

**Why this priority**: Read access is the prerequisite for all edit operations.
This story alone delivers value as an audit/review view and is independently
usable without any editing capability.

**Independent Test**: Open the editor — all repos appear in a list with name,
type, team, and tier. Clicking a repo shows its 28 sub-dimension scores. No
editing required.

**Acceptance Scenarios**:

1. **Given** the editor is open, **When** the page loads, **Then** all repos
   from the inventory are listed with their name, display name, type, team,
   tier, and computed overall score.
2. **Given** the list is visible, **When** the user filters by type (e.g.
   "API"), **Then** only repos of that type are shown.
3. **Given** the list is visible, **When** the user filters by team, **Then**
   only repos belonging to that team are shown.
4. **Given** the user clicks a repo, **Then** its 28 sub-dimension current
   scores are displayed, grouped by the 7 dimensions.

---

### User Story 2 - Edit an Existing Repo (Priority: P2)

An engineering manager needs to update a repo's metadata (display name, repo
link, type, team, tier) and its current maturity scores after a re-assessment.
They find the repo in the list, open it, make changes, and save — seeing the
updated data immediately.

**Why this priority**: Score updates are the most frequent real-world operation:
after each assessment cycle, scores need to be refreshed.

**Independent Test**: Open any repo, change its tier from 2 to 1 and update one
score, save, and verify the list reflects the new tier and the repo detail shows
the new score.

**Acceptance Scenarios**:

1. **Given** a repo is open for editing, **When** the user changes metadata
   fields (display name, repo link, type, team, tier) and saves, **Then** the
   updated values appear in the list and detail view.
2. **Given** a repo is open for editing, **When** the user changes a
   sub-dimension score (1–5) and saves, **Then** the new score is reflected in
   the detail view and the overall score recalculates.
3. **Given** a user changes a score to an invalid value (e.g. 0 or 6), **Then**
   the input is rejected with a clear message and the prior value is preserved.
4. **Given** the user makes changes, **When** they discard without saving,
   **Then** the original values are restored.

---

### User Story 3 - Add a New Repo (Priority: P3)

An engineering manager onboards a new service into the inventory. They open the
editor, click "Add repo", fill in the name, display name, repo link, type,
team, and tier, then set initial scores for all 28 sub-dimensions (defaulting to
1 if not specified). The new repo appears in the list immediately.

**Why this priority**: New repos are added less often than scores are updated,
but the feature is essential for keeping the inventory complete.

**Independent Test**: Click "Add repo", fill all required fields, save, and
verify the new repo appears in the list and is included in the exported output.

**Acceptance Scenarios**:

1. **Given** the user clicks "Add repo", **When** they fill all required fields
   (name, type, team, tier) and save, **Then** the new repo appears in the
   inventory list.
2. **Given** a new repo is being added, **When** scores are left blank, **Then**
   they default to 1 for all 28 sub-dimensions.
3. **Given** a new repo is being added, **When** the user omits a required
   field (name, type, team, or tier), **Then** saving is blocked with a
   validation message identifying the missing field.
4. **Given** the user cancels adding a repo, **Then** no new repo is added.

---

### User Story 4 - Delete a Repo (Priority: P4)

An engineering manager removes a decommissioned service from the inventory.
They locate it in the list, click delete, confirm the action, and the repo
disappears from the list and the export.

**Why this priority**: Deletion is the least frequent operation but necessary
for keeping the inventory accurate as services are retired.

**Independent Test**: Select any repo, click delete, confirm, and verify it no
longer appears in the list or in the exported output.

**Acceptance Scenarios**:

1. **Given** the user clicks delete on a repo and confirms, **Then** the repo
   is removed from the list.
2. **Given** the user clicks delete, **When** they cancel the confirmation,
   **Then** the repo remains in the list unchanged.
3. **Given** only one repo remains in the inventory, deletion is still
   permitted (no minimum-count guard).

---

### User Story 5 - Export Updated Inventory (Priority: P5)

After making edits, the manager exports the updated inventory as a valid
JavaScript snippet that replaces the `REPO_INVENTORY` variable in
`inventory-loader.js`, preserving the exact structure of the original file.

**Why this priority**: Without export, all edits are lost on page refresh.
Export is the persistence mechanism for this browser-only tool.

**Independent Test**: Make any edit, export, paste into `inventory-loader.js`,
open `index.html`, and verify the dashboard reflects the changes with zero
console errors.

**Acceptance Scenarios**:

1. **Given** edits have been made, **When** the user clicks "Export JS", **Then**
   a valid JavaScript `var REPO_INVENTORY = [...];` declaration is produced,
   copyable to clipboard or downloadable as a file.
2. **Given** the exported JS is pasted into `inventory-loader.js`, **When**
   `index.html` is opened, **Then** the dashboard renders correctly with no
   console errors.
3. **Given** no edits have been made, **When** the user exports, **Then** the
   exported JS matches the original inventory exactly (round-trip safe).

---

### Edge Cases

- What if a repo name is changed to match an existing repo's name?
  → The name field must be unique; duplicate names are rejected on save with a
  validation message.
- What if a score is entered as a decimal (e.g. 3.5)?
  → Only integers 1–5 are accepted; non-integer input is rejected.
- What if the user navigates away with unsaved changes?
  → An "Unsaved changes" indicator is visible; no browser dialog blocks navigation.
- What if the repo link is left blank?
  → The link field is optional; a blank value is stored as an empty string.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The editor MUST display all repos from the inventory in a list
  showing name, display name, type, team, tier, and computed overall score.
- **FR-002**: The list MUST support filtering by repo type and by team.
- **FR-003**: Clicking a repo MUST open a detail/edit view showing all
  metadata fields and all 28 sub-dimension current scores grouped by dimension.
- **FR-004**: Users MUST be able to edit all metadata fields: name, display
  name, repo link, type, team, and tier.
- **FR-005**: Users MUST be able to edit all 28 sub-dimension scores; each
  score MUST be constrained to integers 1–5.
- **FR-006**: Users MUST be able to save edits; the list MUST update
  immediately to reflect the saved values.
- **FR-007**: Users MUST be able to discard edits and revert to the previously
  saved values.
- **FR-008**: Users MUST be able to add a new repo with all required fields;
  unspecified scores default to 1.
- **FR-009**: Required fields (name, type, team, tier) MUST be validated on
  save; saving MUST be blocked if any required field is missing.
- **FR-010**: Repo names MUST be unique within the inventory; duplicate names
  MUST be rejected on save.
- **FR-011**: Users MUST be able to delete a repo after confirming the action.
- **FR-012**: The editor MUST show an "Unsaved changes" indicator when the
  in-memory inventory differs from the last-saved state.
- **FR-013**: Users MUST be able to export the current inventory as a valid
  `var REPO_INVENTORY = [...];` JavaScript declaration, deliverable via
  clipboard copy and file download.
- **FR-014**: The exported JavaScript MUST be round-trip safe: pasting it into
  `inventory-loader.js` and opening the dashboard MUST produce correct behaviour.

### Key Entities

- **Repo**: A single tracked service or codebase. Fields: `name` (unique key),
  `displayName`, `repoLink` (optional URL), `type` (one of API / UI /
  Windows Service / Library / Shared), `team` (free text), `tier` (1, 2, or
  3), `current` (map of 28 sub-dimension keys to integer scores 1–5).
- **Dimension**: One of the 7 top-level groupings (from `DIMENSIONS`). Used to
  group the 28 sub-dimension score fields in the edit view.
- **Sub-dimension**: One of 28 scored attributes (keys from `ASSESSMENT`/
  `DIMENSIONS`). Each maps to an integer score in `current`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can update a repo's tier and re-assess all 28 scores in
  under 3 minutes from opening the editor.
- **SC-002**: All repos are reachable within 2 clicks from the editor home.
- **SC-003**: The exported JavaScript, when pasted verbatim into
  `inventory-loader.js`, causes zero console errors when `index.html` loads.
- **SC-004**: 100% of existing repos survive a round-trip (load → no edits →
  export → paste) without any field or score changing.
- **SC-005**: All required-field and score-range validation errors are surfaced
  to the user before any data is saved.

## Assumptions

- The editor runs entirely in the browser with no backend; persistence is
  achieved by exporting JS and manually updating `inventory-loader.js`.
- The editor will be a new standalone HTML page (`inventory-editor.html`)
  following the same single-file pattern as `rubric-editor.html`.
- The dark theme and CSS custom properties from the existing app are reused.
- The editor reads the live `REPO_INVENTORY` global (already populated by
  `inventory-loader.js`) as its initial data source.
- Valid repo types are the fixed set already in use: API, UI, Windows Service,
  Library, Shared — no free-text type entry.
- Valid tiers are 1, 2, and 3 — rendered as a dropdown, not a free-text field.
- Mobile layout is out of scope; the editor targets desktop browsers.
- A single user operates the editor at a time; no concurrent editing or
  conflict resolution is needed.
