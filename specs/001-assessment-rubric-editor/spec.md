# Feature Specification: Assessment Rubric Editor

**Feature Branch**: `001-assessment-rubric-editor`

**Created**: 2026-05-12

**Status**: Draft

**Input**: User description: "create a UI to manage values within js/assessment-loader.js"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse Rubric Criteria (Priority: P1)

An engineering manager opens the rubric editor to review the criteria currently
defined for each of the 7 dimensions and 28 sub-dimensions. They need to see,
at a glance, which maturity levels have which criteria so they can understand
the current rubric before making changes.

**Why this priority**: Viewing is the prerequisite for all editing. An admin
who cannot navigate the rubric cannot edit it. This story alone delivers value
as a read-only audit view.

**Independent Test**: Open the editor page; verify all 7 dimensions and 28
sub-dimensions are visible, each showing criteria grouped by maturity level 1–5.

**Acceptance Scenarios**:

1. **Given** the editor is open, **When** the user selects a dimension, **Then**
   all sub-dimensions for that dimension are displayed with criteria grouped by
   level 1 through 5.
2. **Given** the editor is open, **When** the user scans the layout, **Then**
   all 7 dimensions are reachable within 3 clicks from the editor home.
3. **Given** the editor is open, **When** there are no pending edits, **Then**
   no "unsaved changes" indicator is shown.

---

### User Story 2 - Edit Existing Criterion (Priority: P2)

An engineering manager identifies a criterion that needs updated wording — for
example, clarifying what "build success rate" means. They click the criterion,
edit the text in place, and see the change reflected immediately.

**Why this priority**: Editing existing criteria is the most frequent use case.
Most rubric maintenance involves rewording, not wholesale addition or removal.

**Independent Test**: Click any displayed criterion, change its text, and
confirm the edited text appears in the view and in the export output.

**Acceptance Scenarios**:

1. **Given** a criterion is displayed, **When** the user clicks on it, **Then**
   the criterion becomes editable in place.
2. **Given** a criterion is being edited, **When** the user confirms the change,
   **Then** the new text replaces the old text and an "unsaved changes" indicator
   appears.
3. **Given** a criterion has been edited, **When** the user discards changes,
   **Then** the original text is restored.

---

### User Story 3 - Add and Remove Criteria (Priority: P3)

An engineering manager realizes a sub-dimension is missing a criterion at level
3. They add a new criterion to that level. They also spot a redundant criterion
and delete it, confirming that at least one criterion per level is always
preserved.

**Why this priority**: Structural changes (add/remove) are needed less often
than edits, but are essential for long-term rubric evolution.

**Independent Test**: Add a new criterion to any sub-dimension/level; verify it
appears. Delete any criterion; verify it is removed and the minimum-one-criterion
guard prevents removing the last remaining criterion at a level.

**Acceptance Scenarios**:

1. **Given** a sub-dimension/level is shown, **When** the user clicks "Add
   criterion", **Then** a new blank editable criterion is inserted.
2. **Given** a criterion is shown, **When** the user clicks delete and confirms,
   **Then** the criterion is removed.
3. **Given** only one criterion remains at a level, **When** the user attempts
   to delete it, **Then** deletion is prevented with a clear message.

---

### User Story 4 - Export Updated Rubric (Priority: P4)

After finishing edits, the manager exports the updated rubric. The export
produces a complete, valid JavaScript snippet that can replace the `ASSESSMENT`
variable in `assessment-loader.js` without any further modification.

**Why this priority**: Without export, edits are lost on page refresh. Export
is the persistence mechanism for this browser-only tool.

**Independent Test**: Make any edit, click Export, copy the output, paste it
into `assessment-loader.js`, open the app, and verify the assessment tool
reflects the changes.

**Acceptance Scenarios**:

1. **Given** edits have been made, **When** the user clicks "Export JS",
   **Then** a text area or download appears with valid JavaScript defining the
   full `ASSESSMENT` object.
2. **Given** the exported JS is pasted into `assessment-loader.js`, **When**
   `assess.html` is opened, **Then** the assessment tool reflects all edits
   without errors.
3. **Given** no edits have been made, **When** the user exports, **Then** the
   exported JS matches the current rubric exactly (round-trip safe).

---

### Edge Cases

- What happens when a criterion text is left blank on confirm?
  → Blank criteria are rejected; the field stays in edit mode with a warning.
- What happens if the user navigates away with unsaved changes?
  → An "unsaved changes" indicator is visible; no browser dialog needed (changes
  are in-memory and the export step is the explicit save action).
- What if a sub-dimension has no criteria at a level?
  → Not currently possible (all 28 sub-dimensions have full level 1–5 criteria);
  but if it occurs, the editor displays an empty state with an "Add criterion"
  prompt.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The editor MUST display all 7 dimensions and all 28 sub-dimensions
  in a structured, navigable layout.
- **FR-002**: For each sub-dimension, the editor MUST show criteria grouped by
  maturity levels 1 through 5.
- **FR-003**: Users MUST be able to edit the text of any existing criterion
  in place.
- **FR-004**: Users MUST be able to add a new criterion to any sub-dimension
  at any level.
- **FR-005**: Users MUST be able to delete a criterion, provided at least one
  criterion remains at that level after deletion.
- **FR-006**: The editor MUST show an "unsaved changes" indicator whenever
  in-memory data differs from the loaded rubric.
- **FR-007**: Users MUST be able to discard all changes and revert to the
  originally loaded rubric.
- **FR-008**: Users MUST be able to export the current (possibly edited) rubric
  as a valid JavaScript variable definition, copyable to clipboard or
  downloadable as a `.js` snippet.
- **FR-009**: The exported JavaScript MUST be round-trip safe: pasting the
  export into `assessment-loader.js` and opening the app MUST produce identical
  behavior to the pre-export state.
- **FR-010**: Blank criterion text MUST be rejected; the field MUST remain in
  edit mode with a validation message.

### Key Entities

- **Dimension**: One of the 7 top-level groupings (e.g., Build & Delivery,
  Security). Has a display label and contains sub-dimensions.
- **Sub-dimension**: One of 28 scored attributes (e.g., `cicd`, `testCoverage`).
  Belongs to one dimension; holds a set of criteria per level.
- **Level**: Integer 1–5 representing a maturity level. Each level holds one
  or more criterion strings.
- **Criterion**: A single, binary, measurable statement defining what must be
  true for a repo to satisfy a given level in a sub-dimension.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can update a criterion's wording in under 30 seconds from
  opening the editor.
- **SC-002**: All 28 sub-dimensions are reachable within 3 clicks from the
  editor home view.
- **SC-003**: The exported JavaScript, when pasted verbatim into
  `assessment-loader.js`, causes zero console errors when `assess.html` loads.
- **SC-004**: 100% of existing criteria survive a round-trip (load → no edits →
  export → paste) without change.
- **SC-005**: The editor correctly prevents deletion of the last criterion at
  any level in 100% of attempts.

## Assumptions

- The editor runs entirely in the browser with no backend; persistence is
  achieved by exporting JS and manually updating `assessment-loader.js`.
- The editor will be delivered as a new standalone HTML page (`rubric-editor.html`)
  following the same pattern as `index.html` and `assess.html`.
- The dark theme and CSS custom properties (`--level1` through `--level5`, etc.)
  from the existing app will be reused in the editor.
- A single user operates the editor at a time; no concurrent editing or
  conflict resolution is needed.
- The editor loads the live `ASSESSMENT` global (already populated by
  `assessment-loader.js`) as its initial data source.
- Mobile layout is out of scope; the editor targets desktop browsers.
