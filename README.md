# MaturityMap
Engineering maturity tracking and visualization for your technical asset inventory.

![App Screenshot](/docs/img/engmaturity.png)


# Overview:

4 views:

1. Radar — individual spider chart per repo showing current (blue) vs target (orange dashed). Quick visual on where each repo stands.

2. By Type — aggregated radar charts averaging scores across APIs, UIs Windows Services, Libraries, Shared. Shows systemic gaps by category.

3. Heatmap — table view, repos as rows, dimensions as columns color-coded 1-5 with gap indicators. Sorted worst-first so you see the pain immediately.

4. Gap Analysis — flat list of every dimension gap across all repos, sorted largest gap first. This is your prioritization list — tells you exactly where to invest.

Filtering: by repo type, team, and free-text search. Stats bar updates live with totals, averages, and critical count.

Scoring model:
- 1 (red) Ad-hoc → 5 (cyan) Optimized
- 7 dimensions, 28 sub-dimensions (see dimensions.json)
- Dimensions / Sub-dimensions toggle switches all views between the two levels

5. By Dimension — one radar card per dimension with its 4 sub-dimensions as spokes, plus a score breakdown grid.

# Tier System

Targets are auto-computed from tier profiles rather than manually set per repo.

| Tier | Description | Target Range |
|------|-------------|-------------|
| Tier 1 (red) | Revenue-critical, customer-facing | 4-5 across the board |
| Tier 2 (orange) | Important supporting services | 3-4 |
| Tier 3 (yellow) | Internal, low-risk, experimental | 2-3 |

**Org-wide minimums** act as a floor — no sub-dimension target drops below the minimum regardless of tier (e.g., Security >= 3, CI/CD >= 3).

Each repo only needs a `tier` assignment (1, 2, or 3). The effective target per sub-dimension = `max(tier target, org minimum)`.

Tier profiles and org minimums are defined in `tiers-loader.js`.

# Assessment

The assessment system (`assess.html`) provides a structured, repeatable way to score repos against a rubric.

## Rubric Structure

Each of the 28 sub-dimensions has 2-3 concrete criteria per maturity level (1-5), defined in `assessment-loader.js`. Criteria are:
- **Binary** — yes/no, no ambiguity
- **Cumulative** — all criteria in level N must be met before level N+1 unlocks
- **Measurable** — references specific tooling, thresholds, and practices

Score = highest level where ALL criteria are fully satisfied.

## Assessment Workflow

1. Open `assess.html` and select a repo from the dropdown
2. Current scores are pre-populated — all criteria auto-checked up to the repo's existing level
3. Walk through each dimension/sub-dimension and verify or adjust the checklist
4. Scores auto-compute as you check/uncheck criteria
5. Summary bar at top shows live dimension and overall scores vs current/target
6. Export results as JSON or copy a plain-text summary to clipboard

## Key Behaviors

- **Levels lock** — Level 3 criteria are disabled until Level 2 is fully met
- **Unchecking cascades** — unchecking a lower level automatically clears all higher levels
- **Pre-population** — loads the repo's existing scores so you're validating, not starting from scratch
- **Progress bars** — visual per sub-dimension showing where you stand

## Export Options

- **Export JSON** — downloads a timestamped `assessment-<repo>-<date>.json` file
- **Copy to clipboard** — plain-text summary for pasting into Slack/docs/wikis
- **Reset** — clears the assessment to start fresh

# File Structure

```
maturity-chart/
  index.html                    — main dashboard
  assess.html                   — assessment/grading page
  dimensions.json               — canonical source of truth for dimensions
  js/
    dimensions-loader.js        — dimension & sub-dimension definitions
    tiers-loader.js             — tier profiles & org minimums
    inventory-loader.js         — repo inventory (name, type, team, tier, current scores)
    assessment-loader.js        — assessment rubric (criteria per level per sub-dimension)
    main.js                     — glue: derives computed values (targets, helpers)
  docs/                         — reference documentation
```

