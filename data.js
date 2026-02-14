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

// // ============================================================
// // Sample repo inventory — 27 repos
// // Each repo now has a `tier` (1, 2, or 3) and only `current` scores.
// // `target` is auto-computed from the tier profile + org minimums.
// // ============================================================
// const repoDefinitions = [
//   // --- APIs ---
//   { name: 'orders-api',        type: 'API', team: 'Commerce',      tier: 1, current: { cicd: 4, buildReliability: 3, deployFrequency: 4, releaseProcess: 3, testCoverage: 3, staticAnalysis: 4, codeReview: 4, depFreshness: 3, vulnMgmt: 3, secretMgmt: 4, authPatterns: 4, sastDast: 2, logging: 4, metrics: 4, alerting: 3, tracing: 3, healthChecks: 4, circuitBreakers: 3, degradation: 2, disasterRecovery: 2, runbooks: 3, apiDocs: 4, onboarding: 3, ownership: 3, iac: 4, envParity: 4, containerization: 4, scaling: 3 } },
//   { name: 'payments-api',      type: 'API', team: 'Commerce',      tier: 1, current: { cicd: 3, buildReliability: 3, deployFrequency: 3, releaseProcess: 2, testCoverage: 2, staticAnalysis: 3, codeReview: 3, depFreshness: 2, vulnMgmt: 4, secretMgmt: 4, authPatterns: 5, sastDast: 3, logging: 3, metrics: 3, alerting: 2, tracing: 2, healthChecks: 4, circuitBreakers: 4, degradation: 3, disasterRecovery: 3, runbooks: 2, apiDocs: 3, onboarding: 2, ownership: 2, iac: 3, envParity: 3, containerization: 3, scaling: 2 } },
//   { name: 'inventory-api',     type: 'API', team: 'Supply Chain',  tier: 2, current: { cicd: 2, buildReliability: 2, deployFrequency: 1, releaseProcess: 1, testCoverage: 1, staticAnalysis: 2, codeReview: 2, depFreshness: 1, vulnMgmt: 2, secretMgmt: 2, authPatterns: 3, sastDast: 1, logging: 2, metrics: 2, alerting: 1, tracing: 1, healthChecks: 2, circuitBreakers: 1, degradation: 1, disasterRecovery: 1, runbooks: 1, apiDocs: 2, onboarding: 1, ownership: 1, iac: 2, envParity: 2, containerization: 2, scaling: 1 } },
//   { name: 'users-api',         type: 'API', team: 'Platform',      tier: 1, current: { cicd: 5, buildReliability: 5, deployFrequency: 5, releaseProcess: 4, testCoverage: 4, staticAnalysis: 5, codeReview: 5, depFreshness: 4, vulnMgmt: 5, secretMgmt: 5, authPatterns: 5, sastDast: 4, logging: 5, metrics: 5, alerting: 5, tracing: 4, healthChecks: 5, circuitBreakers: 4, degradation: 4, disasterRecovery: 3, runbooks: 4, apiDocs: 5, onboarding: 4, ownership: 4, iac: 5, envParity: 5, containerization: 5, scaling: 4 } },
//   { name: 'notifications-api', type: 'API', team: 'Platform',      tier: 2, current: { cicd: 3, buildReliability: 3, deployFrequency: 3, releaseProcess: 2, testCoverage: 2, staticAnalysis: 3, codeReview: 3, depFreshness: 2, vulnMgmt: 3, secretMgmt: 3, authPatterns: 3, sastDast: 2, logging: 3, metrics: 3, alerting: 2, tracing: 2, healthChecks: 3, circuitBreakers: 2, degradation: 2, disasterRecovery: 1, runbooks: 2, apiDocs: 3, onboarding: 2, ownership: 2, iac: 3, envParity: 3, containerization: 3, scaling: 2 } },
//   { name: 'search-api',        type: 'API', team: 'Platform',      tier: 2, current: { cicd: 4, buildReliability: 4, deployFrequency: 3, releaseProcess: 3, testCoverage: 3, staticAnalysis: 3, codeReview: 4, depFreshness: 3, vulnMgmt: 3, secretMgmt: 3, authPatterns: 3, sastDast: 2, logging: 4, metrics: 4, alerting: 3, tracing: 3, healthChecks: 4, circuitBreakers: 3, degradation: 2, disasterRecovery: 2, runbooks: 2, apiDocs: 3, onboarding: 2, ownership: 3, iac: 4, envParity: 4, containerization: 4, scaling: 3 } },
//   { name: 'pricing-api',       type: 'API', team: 'Commerce',      tier: 1, current: { cicd: 2, buildReliability: 1, deployFrequency: 1, releaseProcess: 1, testCoverage: 1, staticAnalysis: 1, codeReview: 2, depFreshness: 1, vulnMgmt: 2, secretMgmt: 1, authPatterns: 2, sastDast: 1, logging: 1, metrics: 1, alerting: 1, tracing: 1, healthChecks: 1, circuitBreakers: 1, degradation: 1, disasterRecovery: 1, runbooks: 1, apiDocs: 1, onboarding: 1, ownership: 1, iac: 1, envParity: 1, containerization: 1, scaling: 1 } },
//   { name: 'shipping-api',      type: 'API', team: 'Supply Chain',  tier: 2, current: { cicd: 3, buildReliability: 2, deployFrequency: 2, releaseProcess: 2, testCoverage: 2, staticAnalysis: 2, codeReview: 3, depFreshness: 2, vulnMgmt: 3, secretMgmt: 3, authPatterns: 3, sastDast: 2, logging: 2, metrics: 2, alerting: 2, tracing: 1, healthChecks: 2, circuitBreakers: 2, degradation: 2, disasterRecovery: 1, runbooks: 2, apiDocs: 3, onboarding: 2, ownership: 2, iac: 2, envParity: 2, containerization: 2, scaling: 2 } },

//   // --- Windows Services ---
//   { name: 'order-processor',    type: 'Windows Service', team: 'Commerce',  tier: 1, current: { cicd: 2, buildReliability: 2, deployFrequency: 1, releaseProcess: 1, testCoverage: 1, staticAnalysis: 2, codeReview: 2, depFreshness: 1, vulnMgmt: 2, secretMgmt: 2, authPatterns: 2, sastDast: 1, logging: 2, metrics: 2, alerting: 1, tracing: 1, healthChecks: 2, circuitBreakers: 2, degradation: 1, disasterRecovery: 1, runbooks: 1, apiDocs: 1, onboarding: 1, ownership: 2, iac: 1, envParity: 1, containerization: 1, scaling: 1 } },
//   { name: 'payment-reconciler', type: 'Windows Service', team: 'Commerce',  tier: 1, current: { cicd: 1, buildReliability: 1, deployFrequency: 1, releaseProcess: 1, testCoverage: 1, staticAnalysis: 1, codeReview: 1, depFreshness: 1, vulnMgmt: 2, secretMgmt: 2, authPatterns: 2, sastDast: 1, logging: 1, metrics: 1, alerting: 1, tracing: 1, healthChecks: 1, circuitBreakers: 1, degradation: 1, disasterRecovery: 1, runbooks: 1, apiDocs: 1, onboarding: 1, ownership: 1, iac: 1, envParity: 1, containerization: 1, scaling: 1 } },
//   { name: 'report-generator',  type: 'Windows Service', team: 'Analytics', tier: 3, current: { cicd: 2, buildReliability: 2, deployFrequency: 2, releaseProcess: 2, testCoverage: 2, staticAnalysis: 2, codeReview: 2, depFreshness: 2, vulnMgmt: 2, secretMgmt: 2, authPatterns: 2, sastDast: 1, logging: 2, metrics: 2, alerting: 1, tracing: 1, healthChecks: 2, circuitBreakers: 1, degradation: 1, disasterRecovery: 1, runbooks: 2, apiDocs: 2, onboarding: 2, ownership: 2, iac: 2, envParity: 2, containerization: 2, scaling: 1 } },
//   { name: 'data-sync-service', type: 'Windows Service', team: 'Platform',  tier: 2, current: { cicd: 3, buildReliability: 3, deployFrequency: 3, releaseProcess: 2, testCoverage: 2, staticAnalysis: 3, codeReview: 3, depFreshness: 2, vulnMgmt: 3, secretMgmt: 3, authPatterns: 3, sastDast: 2, logging: 3, metrics: 3, alerting: 3, tracing: 2, healthChecks: 3, circuitBreakers: 3, degradation: 2, disasterRecovery: 2, runbooks: 2, apiDocs: 2, onboarding: 2, ownership: 3, iac: 2, envParity: 2, containerization: 2, scaling: 2 } },
//   { name: 'etl-pipeline',      type: 'Windows Service', team: 'Analytics', tier: 3, current: { cicd: 1, buildReliability: 1, deployFrequency: 1, releaseProcess: 1, testCoverage: 1, staticAnalysis: 1, codeReview: 1, depFreshness: 1, vulnMgmt: 1, secretMgmt: 1, authPatterns: 1, sastDast: 1, logging: 1, metrics: 1, alerting: 1, tracing: 1, healthChecks: 1, circuitBreakers: 1, degradation: 1, disasterRecovery: 1, runbooks: 1, apiDocs: 1, onboarding: 1, ownership: 1, iac: 1, envParity: 1, containerization: 1, scaling: 1 } },
//   { name: 'cache-warmer',      type: 'Windows Service', team: 'Platform',  tier: 3, current: { cicd: 3, buildReliability: 3, deployFrequency: 2, releaseProcess: 2, testCoverage: 2, staticAnalysis: 2, codeReview: 3, depFreshness: 2, vulnMgmt: 2, secretMgmt: 2, authPatterns: 2, sastDast: 1, logging: 3, metrics: 3, alerting: 2, tracing: 2, healthChecks: 3, circuitBreakers: 2, degradation: 2, disasterRecovery: 1, runbooks: 1, apiDocs: 1, onboarding: 1, ownership: 2, iac: 2, envParity: 2, containerization: 2, scaling: 2 } },

//   // --- UI ---
//   { name: 'customer-portal',   type: 'UI', team: 'Commerce',      tier: 1, current: { cicd: 4, buildReliability: 4, deployFrequency: 4, releaseProcess: 3, testCoverage: 3, staticAnalysis: 4, codeReview: 4, depFreshness: 3, vulnMgmt: 3, secretMgmt: 3, authPatterns: 4, sastDast: 2, logging: 3, metrics: 3, alerting: 2, tracing: 2, healthChecks: 3, circuitBreakers: 2, degradation: 2, disasterRecovery: 1, runbooks: 3, apiDocs: 3, onboarding: 3, ownership: 3, iac: 4, envParity: 4, containerization: 4, scaling: 3 } },
//   { name: 'admin-dashboard',   type: 'UI', team: 'Platform',      tier: 2, current: { cicd: 3, buildReliability: 3, deployFrequency: 3, releaseProcess: 2, testCoverage: 2, staticAnalysis: 3, codeReview: 3, depFreshness: 2, vulnMgmt: 3, secretMgmt: 3, authPatterns: 3, sastDast: 2, logging: 2, metrics: 2, alerting: 2, tracing: 1, healthChecks: 2, circuitBreakers: 1, degradation: 1, disasterRecovery: 1, runbooks: 2, apiDocs: 2, onboarding: 2, ownership: 2, iac: 3, envParity: 3, containerization: 3, scaling: 2 } },
//   { name: 'warehouse-ui',      type: 'UI', team: 'Supply Chain',  tier: 3, current: { cicd: 2, buildReliability: 2, deployFrequency: 1, releaseProcess: 1, testCoverage: 1, staticAnalysis: 2, codeReview: 2, depFreshness: 1, vulnMgmt: 2, secretMgmt: 2, authPatterns: 2, sastDast: 1, logging: 1, metrics: 1, alerting: 1, tracing: 1, healthChecks: 1, circuitBreakers: 1, degradation: 1, disasterRecovery: 1, runbooks: 1, apiDocs: 1, onboarding: 1, ownership: 1, iac: 2, envParity: 2, containerization: 2, scaling: 1 } },
//   { name: 'analytics-ui',      type: 'UI', team: 'Analytics',     tier: 3, current: { cicd: 3, buildReliability: 3, deployFrequency: 2, releaseProcess: 2, testCoverage: 2, staticAnalysis: 2, codeReview: 3, depFreshness: 2, vulnMgmt: 2, secretMgmt: 2, authPatterns: 2, sastDast: 1, logging: 2, metrics: 2, alerting: 1, tracing: 1, healthChecks: 2, circuitBreakers: 1, degradation: 1, disasterRecovery: 1, runbooks: 2, apiDocs: 2, onboarding: 2, ownership: 2, iac: 3, envParity: 3, containerization: 3, scaling: 2 } },
//   { name: 'mobile-app',        type: 'UI', team: 'Commerce',      tier: 1, current: { cicd: 4, buildReliability: 3, deployFrequency: 3, releaseProcess: 3, testCoverage: 3, staticAnalysis: 4, codeReview: 4, depFreshness: 3, vulnMgmt: 4, secretMgmt: 4, authPatterns: 4, sastDast: 3, logging: 3, metrics: 3, alerting: 2, tracing: 2, healthChecks: 3, circuitBreakers: 3, degradation: 3, disasterRecovery: 2, runbooks: 3, apiDocs: 3, onboarding: 3, ownership: 3, iac: 3, envParity: 3, containerization: 3, scaling: 3 } },

//   // --- Libraries ---
//   { name: 'auth-library',      type: 'Library', team: 'Platform',  tier: 1, current: { cicd: 5, buildReliability: 5, deployFrequency: 4, releaseProcess: 4, testCoverage: 5, staticAnalysis: 5, codeReview: 5, depFreshness: 4, vulnMgmt: 5, secretMgmt: 5, authPatterns: 5, sastDast: 4, logging: 3, metrics: 3, alerting: 2, tracing: 2, healthChecks: 3, circuitBreakers: 3, degradation: 3, disasterRecovery: 2, runbooks: 4, apiDocs: 5, onboarding: 4, ownership: 4, iac: 4, envParity: 4, containerization: 3, scaling: 3 } },
//   { name: 'logging-lib',       type: 'Library', team: 'Platform',  tier: 1, current: { cicd: 4, buildReliability: 4, deployFrequency: 4, releaseProcess: 3, testCoverage: 4, staticAnalysis: 4, codeReview: 4, depFreshness: 3, vulnMgmt: 3, secretMgmt: 3, authPatterns: 3, sastDast: 2, logging: 5, metrics: 5, alerting: 4, tracing: 4, healthChecks: 3, circuitBreakers: 3, degradation: 2, disasterRecovery: 2, runbooks: 3, apiDocs: 4, onboarding: 3, ownership: 3, iac: 4, envParity: 4, containerization: 3, scaling: 3 } },
//   { name: 'common-models',     type: 'Library', team: 'Platform',  tier: 2, current: { cicd: 3, buildReliability: 3, deployFrequency: 3, releaseProcess: 2, testCoverage: 3, staticAnalysis: 3, codeReview: 3, depFreshness: 2, vulnMgmt: 2, secretMgmt: 2, authPatterns: 2, sastDast: 1, logging: 1, metrics: 1, alerting: 1, tracing: 1, healthChecks: 1, circuitBreakers: 1, degradation: 1, disasterRecovery: 1, runbooks: 2, apiDocs: 3, onboarding: 2, ownership: 2, iac: 3, envParity: 3, containerization: 2, scaling: 2 } },
//   { name: 'http-client-lib',   type: 'Library', team: 'Platform',  tier: 1, current: { cicd: 4, buildReliability: 4, deployFrequency: 4, releaseProcess: 3, testCoverage: 4, staticAnalysis: 4, codeReview: 4, depFreshness: 4, vulnMgmt: 4, secretMgmt: 3, authPatterns: 4, sastDast: 3, logging: 3, metrics: 3, alerting: 2, tracing: 3, healthChecks: 4, circuitBreakers: 4, degradation: 4, disasterRecovery: 3, runbooks: 3, apiDocs: 4, onboarding: 3, ownership: 3, iac: 4, envParity: 4, containerization: 3, scaling: 3 } },

//   // --- Shared ---
//   { name: 'infrastructure-repo', type: 'Shared', team: 'DevOps',   tier: 1, current: { cicd: 4, buildReliability: 4, deployFrequency: 3, releaseProcess: 3, testCoverage: 2, staticAnalysis: 3, codeReview: 3, depFreshness: 2, vulnMgmt: 3, secretMgmt: 3, authPatterns: 3, sastDast: 2, logging: 3, metrics: 3, alerting: 3, tracing: 2, healthChecks: 3, circuitBreakers: 3, degradation: 3, disasterRecovery: 3, runbooks: 3, apiDocs: 3, onboarding: 3, ownership: 4, iac: 5, envParity: 5, containerization: 5, scaling: 4 } },
//   { name: 'ci-templates',       type: 'Shared', team: 'DevOps',   tier: 1, current: { cicd: 5, buildReliability: 5, deployFrequency: 4, releaseProcess: 4, testCoverage: 3, staticAnalysis: 4, codeReview: 4, depFreshness: 3, vulnMgmt: 4, secretMgmt: 4, authPatterns: 3, sastDast: 3, logging: 2, metrics: 2, alerting: 2, tracing: 1, healthChecks: 2, circuitBreakers: 2, degradation: 2, disasterRecovery: 2, runbooks: 3, apiDocs: 3, onboarding: 3, ownership: 4, iac: 5, envParity: 5, containerization: 5, scaling: 4 } },
//   { name: 'monitoring-config',  type: 'Shared', team: 'DevOps',   tier: 2, current: { cicd: 3, buildReliability: 3, deployFrequency: 2, releaseProcess: 2, testCoverage: 1, staticAnalysis: 2, codeReview: 2, depFreshness: 2, vulnMgmt: 2, secretMgmt: 2, authPatterns: 2, sastDast: 1, logging: 5, metrics: 5, alerting: 5, tracing: 4, healthChecks: 3, circuitBreakers: 3, degradation: 3, disasterRecovery: 2, runbooks: 2, apiDocs: 2, onboarding: 2, ownership: 3, iac: 4, envParity: 4, containerization: 3, scaling: 3 } },
// ];

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
