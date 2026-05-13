<!--
=============================================================================
Sync Impact Report
=============================================================================
Version change: (unfilled template) → 1.0.0
Modified principles: none (initial population — all placeholders replaced)
Added sections:
  - Core Principles (I–V)
  - Technology Constraints
  - Development Workflow
  - Governance
Removed sections: none
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ reviewed — Constitution Check section
    reads from this file dynamically; no structural update needed
  - .specify/templates/spec-template.md ✅ reviewed — no principle-driven
    mandatory sections added; no update required
  - .specify/templates/tasks-template.md ✅ reviewed — no new principle-driven
    task types; no update required
  - .specify/templates/commands/ ⚠ directory absent — no command files to update
Follow-up TODOs: none — all placeholders resolved
=============================================================================
-->

# MaturityMap Constitution

## Core Principles

### I. Client-Side Only

MaturityMap MUST run entirely in the browser with no server-side component.
There MUST be no backend service, API server, database, or build pipeline.
Opening `index.html` or `assess.html` directly in a browser MUST be sufficient
to use the application in full.

**Rationale**: Zero-dependency deployment is a first-class requirement. Any
contributor or operator should be able to open the app without installing
anything beyond a browser.

### II. Data as JavaScript Files

All application state and inventory data MUST reside in the loader JS files
(`dimensions-loader.js`, `tiers-loader.js`, `inventory-loader.js`,
`assessment-loader.js`). No external data file fetched at runtime, no
localStorage, no IndexedDB, and no cookies may serve as the primary data store.

**Rationale**: Keeping data in JS files ensures the app works in a `file://`
context without CORS issues and makes every data change auditable via `git diff`.

### III. Vanilla JS — No Framework, No Build

All code MUST be written in vanilla ES6+ JavaScript. No TypeScript,
transpilation, bundler, or package manager is permitted. External dependencies
MUST be limited to Chart.js loaded via CDN. No npm packages, import maps, or
module bundlers may be introduced.

**Rationale**: A build step creates friction for contributors and operators. The
codebase must remain directly readable and executable without tooling.

### IV. Script Load-Order Integrity

The loader chain MUST be preserved in every HTML page:

```
dimensions-loader.js → tiers-loader.js → inventory-loader.js
  → assessment-loader.js → main.js
```

Each script MUST define its globals before the next script references them.
Circular dependencies are forbidden. Any new script inserted into this chain
MUST explicitly document its required position and dependencies.

**Rationale**: Without a module system, script order is the dependency contract.
A silent load-order violation breaks the entire app with no clear error.

### V. Cumulative, Strict Scoring

The scoring model MUST remain cumulative: reaching maturity level N requires ALL
criteria in levels 1 through N to be fully satisfied. No partial credit, no
weighted averages, and no per-dimension exceptions are permitted. The effective
target for any sub-dimension MUST equal `max(tier_target, org_minimum)`.

**Rationale**: Cumulative scoring prevents gaming and provides an honest signal
to engineering leadership. Weakening this invariant degrades the tool's
credibility as a maturity measurement instrument.

## Technology Constraints

- **Theming**: Dark theme MUST use CSS custom properties (`--level1` through
  `--level5`, `--current`, `--target`). Colors MUST NOT be hardcoded as hex
  values in JavaScript or inline styles.
- **View switching**: MUST use the `.hidden` CSS class pattern exclusively. No
  JS-driven `element.style.display` manipulation outside this convention.
- **Chart lifecycle**: Chart.js instances MUST be tracked via the
  `chartInstances` Map to prevent canvas-reuse errors on view transitions.
- **No automated tooling**: No tests, linter, or CI pipeline currently exist.
  Any addition of automated tooling MUST be documented in both `CLAUDE.md` and
  this constitution before it is relied upon.

## Development Workflow

- Open `index.html` (dashboard) or `assess.html` (assessment tool) in a browser
  to test. No build step or local server is required.
- Data changes target the appropriate loader file: `inventory-loader.js` for
  repos, `tiers-loader.js` for tier targets and org minimums,
  `assessment-loader.js` for rubrics, `dimensions-loader.js` for dimensions.
- All pages load the full loader chain; changes to shared helpers in `main.js`
  affect every view and must be regression-checked across all five dashboard
  views plus the assessment tool.
- Feature validation MUST include manual browser testing of the golden path and
  all affected views. The developer is responsible for regression checks in the
  absence of an automated test suite.

## Governance

This constitution supersedes all other practices in this repository where
conflicts arise. `CLAUDE.md` provides operational conventions; this constitution
sets the non-negotiable constraints those conventions must respect.

**Amendment procedure**: Any change to this document MUST increment the version
number following semantic versioning (MAJOR for principle removals or
redefinitions; MINOR for new principles or sections; PATCH for clarifications,
wording fixes, or non-semantic refinements). The amending contributor MUST
update `CLAUDE.md` if the change affects coding conventions, and MUST prepend
an updated Sync Impact Report HTML comment at the top of this file.

**Compliance**: All code contributions MUST be reviewed against the five Core
Principles before merge. Any deviation from Principle III (no framework, no
build) or Principle IV (load-order integrity) MUST be explicitly justified in
the pull request description.

**Version**: 1.0.0 | **Ratified**: 2026-05-12 | **Last Amended**: 2026-05-12
