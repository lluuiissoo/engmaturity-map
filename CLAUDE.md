# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

MaturityMap — a standalone, client-side web app for tracking engineering maturity across a repository inventory. No backend, no build step, no package manager. All data lives in JS files.

## Running

Open `index.html` (dashboard) or `assess.html` (assessment tool) in a browser. No build or install needed. Can be served by any static HTTP server.

## Architecture

**Script load order matters** (all pages load in this sequence):
```
dimensions-loader.js → tiers-loader.js → inventory-loader.js → assessment-loader.js → main.js
```

Each loader defines globals that subsequent scripts depend on:
- `js/dimensions-loader.js` — `DIMENSIONS` (7 dimensions, 28 sub-dimensions)
- `js/tiers-loader.js` — `TIERS` (3 tier profiles) and `ORG_MINIMUMS`
- `js/inventory-loader.js` — `REPO_INVENTORY` (27 sample repos with current scores)
- `js/assessment-loader.js` — `ASSESSMENT` (rubrics with criteria per maturity level 1-5)
- `js/main.js` — Shared helpers (`dimScore`, `overallScore`, `computeTarget`) and derived constants

**Pages:**
- `index.html` — Dashboard with 5 views: Radar, By Type, By Dimension, Heatmap, Gap Analysis. Has filtering (type/team/tier/search) and dimension/sub-dimension depth toggle.
- `assess.html` — Assessment grading interface with cumulative checklist model, cascading validation, and JSON export.

**External dependency:** Chart.js 4.4.4 via CDN (radar charts).

## Key Concepts

- **Maturity levels:** 1 (Ad-hoc) → 5 (Optimized)
- **Scoring is cumulative:** level N requires ALL criteria in levels 1…N to be met
- **Target = max(tier target, org minimum)** per sub-dimension
- **7 dimensions × 4 sub-dimensions = 28 scored attributes per repo**

## Conventions

- Vanilla JS (ES6+), no framework, no TypeScript
- Dark theme using CSS custom properties (`--level1` through `--level5`, `--current`, `--target`, etc.)
- View switching via `.hidden` CSS class
- Chart lifecycle managed through `chartInstances` Map
- No tests, no linter, no CI configured

## Data Customization

- Add/edit repos: `js/inventory-loader.js`
- Adjust tier targets or org minimums: `js/tiers-loader.js`
- Modify assessment rubrics: `js/assessment-loader.js`
- Add/change dimensions: `js/dimensions-loader.js` (rarely needed)
