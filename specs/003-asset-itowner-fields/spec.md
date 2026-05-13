# Feature Specification: Add AssetID and ITOwner Fields to Repo Inventory

**Feature Branch**: `003-asset-itowner-fields`

**Created**: 2026-05-12

**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 — View AssetID and ITOwner for Any Repo (Priority: P1)

As a dashboard user, I want to see the Asset ID and IT Owner for every repo so I can cross-reference repos with enterprise asset management records and quickly find the person responsible.

**Why this priority**: The core value of these fields is visibility — engineers and managers need to see ownership and asset tracking data at a glance without editing anything.

**Independent Test**: Open `index.html` and `assess.html`; select any repo — the repo info panel shows AssetID and ITOwner alongside existing metadata (type, tier, team). Open `inventory-editor.html`, click any repo — the edit form shows AssetID and ITOwner fields.

**Acceptance Scenarios**:

1. **Given** a repo with an AssetID set, **When** viewing it in the assessment tool, **Then** the AssetID is displayed in the repo info bar.
2. **Given** a repo with an ITOwner set, **When** viewing it in the inventory editor sidebar or panel, **Then** the ITOwner name is visible.
3. **Given** a repo with no AssetID or ITOwner (empty strings), **When** viewing it anywhere, **Then** the field is shown as blank without errors.

---

### User Story 2 — Edit AssetID and ITOwner in Inventory Editor (Priority: P2)

As an inventory editor user, I want to set, change, or clear AssetID and ITOwner for any repo so that the dataset stays current as org structure and asset tracking evolve.

**Why this priority**: Display is the MVP; editing is required to actually maintain accurate data over time.

**Independent Test**: Open `inventory-editor.html`, click a repo, edit its AssetID and ITOwner fields, click Save — the sidebar and panel reflect the new values. Export the JS and verify both fields appear in the output.

**Acceptance Scenarios**:

1. **Given** an existing repo, **When** I change its AssetID in the editor and click Save, **Then** the new AssetID is reflected immediately in the form and exported JS.
2. **Given** an existing repo with an ITOwner, **When** I clear the ITOwner field and save, **Then** the ITOwner is stored as an empty string without validation errors.
3. **Given** I add a new repo, **When** I leave AssetID and ITOwner blank, **Then** both default to empty string and the repo saves without errors.

---

### User Story 3 — Filter or Search by ITOwner (Priority: P3)

As a dashboard user, I want to filter the repo list by ITOwner so I can view all repos owned by a specific person or team.

**Why this priority**: Once ITOwner is a first-class field, filtering by it unlocks ownership-based reporting without any additional data changes.

**Independent Test**: Open `index.html`, use a filter to select an ITOwner value — only repos owned by that person appear in all views (Radar, Heatmap, Gap Analysis, etc.).

**Acceptance Scenarios**:

1. **Given** repos with various ITOwner values, **When** I select an ITOwner in the filter bar, **Then** only repos with that ITOwner are shown.
2. **Given** the ITOwner filter is set, **When** I navigate between views (Radar, Heatmap, Gap), **Then** the filter persists across views.
3. **Given** no repos match the selected ITOwner, **Then** the view shows an empty state without errors.

---

### Edge Cases

- What happens when AssetID or ITOwner contains special characters (quotes, ampersands, angle brackets)? → Displayed safely without HTML injection.
- What if an existing repo in the inventory has no `assetId` or `itOwner` key? → Treated as empty string; no crash.
- What if two repos share the same AssetID? → No uniqueness constraint; allowed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The repo data model MUST include an `assetId` field (string, optional, defaults to empty string).
- **FR-002**: The repo data model MUST include an `itOwner` field (string, optional, defaults to empty string).
- **FR-003**: All 27 existing sample repos in the inventory MUST have `assetId` and `itOwner` populated with sample values.
- **FR-004**: The inventory editor form MUST display text inputs for `assetId` and `itOwner` in the metadata section for both edit and new-repo forms.
- **FR-005**: The inventory editor MUST include `assetId` and `itOwner` in the exported JS (`var REPO_INVENTORY = [...];`).
- **FR-006**: The assessment tool (`assess.html`) MUST display `assetId` and `itOwner` in the repo info bar when a repo is selected.
- **FR-007**: The dashboard (`index.html`) MUST display `assetId` and `itOwner` in any per-repo detail context (heatmap row, radar card, gap row).
- **FR-008**: The dashboard MUST add an ITOwner filter dropdown so users can filter all views by ITOwner.
- **FR-009**: Missing `assetId` or `itOwner` keys on a repo object MUST be treated as empty strings throughout all views without errors.
- **FR-010**: The `assetId` and `itOwner` fields MUST be optional — no validation error when either or both are blank.

### Key Entities

- **Repo**: Extended with two new optional string fields: `assetId` (enterprise asset tracking identifier) and `itOwner` (name or identifier of the person or team responsible for the repo).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 27 sample repos display non-empty `assetId` and `itOwner` values in the inventory editor without any console errors.
- **SC-002**: An engineer can update a repo's AssetID and ITOwner in the inventory editor, export the JS, paste it into `inventory-loader.js`, and see the updated values in `index.html` and `assess.html` without page errors.
- **SC-003**: Filtering by ITOwner in `index.html` correctly narrows all five views to only matching repos in under 1 second.
- **SC-004**: Repos with no `assetId` or `itOwner` key (legacy entries) load and display without JavaScript errors across all pages.

## Assumptions

- AssetID is a free-text string (not validated against any external system); format is at the user's discretion.
- ITOwner is a free-text string (person name, email, or team name); no lookup or validation against a directory.
- Both fields are optional and may be left empty; they carry no required-field validation.
- The ITOwner filter in `index.html` uses exact match (not substring search) consistent with the existing Type, Team, and Tier filters.
- Sample AssetID values will follow a simple pattern like `ASSET-001` through `ASSET-027`.
- Sample ITOwner values will use existing team names from the inventory (Commerce, Platform, Supply Chain, Analytics, DevOps) to keep data realistic.
- No changes to scoring logic, tier computation, or any JS loader except `inventory-loader.js`.
- `rubric-editor.html` requires no changes — it operates on `ASSESSMENT`, not `REPO_INVENTORY`.
