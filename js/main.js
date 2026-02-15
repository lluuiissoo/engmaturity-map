// ============================================================
// Engineering Maturity — Dimensions & Sub-Dimensions
// Source: dimensions.json (extracted from docs/engineering-dimensions.md)
// Loaded via dimensions-loader.js before this file runs.
// ============================================================
// DIMENSIONS is set globally by dimensions-loader.js
// TIERS and ORG_MINIMUMS is set globally by tiers-loader.js
// REPO_INVENTORY is set globally by inventory-loader.js


const MATURITY_LEVELS = {
  1: 'Ad-hoc',
  2: 'Basic',
  3: 'Defined',
  4: 'Managed',
  5: 'Optimized',
};

const REPO_TYPES = ['API', 'UI', 'Windows Service', 'Library', 'Shared'];

// Helper: all sub-dimension keys flattened
const ALL_SUB_KEYS = DIMENSIONS.flatMap(d => d.subs.map(s => s.key));

// Helper: compute dimension-level score (avg of its sub-dimensions)
function dimScore(scores, dim) {
  const vals = dim.subs.map(s => scores[s.key] || 0);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

// Helper: compute overall average across all sub-dimensions
function overallScore(scores) {
  const vals = ALL_SUB_KEYS.map(k => scores[k] || 0);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

// Compute effective target for a repo: max(tier target, org minimum) per sub-dimension
function computeTarget(tier) {
  const tierTargets = TIERS[tier].targets;
  const target = {};
  ALL_SUB_KEYS.forEach(key => {
    target[key] = Math.max(tierTargets[key] || 1, ORG_MINIMUMS[key] || 1);
  });
  return target;
}

const repoDefinitions = REPO_INVENTORY;

// ============================================================
// Build final repos array with computed targets
// ============================================================
const repos = repoDefinitions.map(def => ({
  name: def.name,
  type: def.type,
  team: def.team,
  tier: def.tier,
  current: def.current,
  target: computeTarget(def.tier),
}));
