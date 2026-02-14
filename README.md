# Maturity Tracker - Inventory
This repo is intended to track technical asset inventory and its maturity level.


# Overview:

4 views:

1. Radar — individual spider chart per repo showing current (blue) vs target (orange dashed). Quick visual on where each repo stands.

2. By Type — aggregated radar charts averaging scores across APIs, UIs Windows Services, Libraries, Shared. Shows systemic gaps by category.

3. Heatmap — table view, repos as rows, dimensions as columns color-coded 1-5 with gap indicators. Sorted worst-first so you see the pain immediately.

4. Gap Analysis — flat list of every dimension gap across all repos, sorted largest gap first. This is your prioritization list — tells you exactly where to invest.

Filtering: by repo type, team, and free-text search. Stats bar updates live with totals, averages, and critical count.

Scoring model:
- 1 (red) Ad-hoc → 5 (cyan) Optimized
- 8 dimensions: CI/CD, Test Coverage, Security, Observability Resilience, Code Quality, Documentation, Infrastructure



