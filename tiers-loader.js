// ============================================================
// TIER SYSTEM
// ============================================================
// Tiers define target expectations based on business criticality.
// Each tier sets a target per sub-dimension.
// The final target = max(tier target, org minimum) per sub-dimension.
//
// Tier 1: Revenue-critical, customer-facing, high blast radius
// Tier 2: Important internal systems, supporting services
// Tier 3: Low-risk, internal tools, experimental
// ============================================================

var TIERS = {
  1: {
    name: 'Tier 1',
    description: 'Revenue-critical / customer-facing',
    color: '#ef4444',
    targets: {
      // Build & Delivery — aggressive, need fast + reliable deploys
      cicd: 5, buildReliability: 5, deployFrequency: 5, releaseProcess: 4,
      // Code Quality — high bar
      testCoverage: 4, staticAnalysis: 5, codeReview: 5, depFreshness: 4,
      // Security — non-negotiable
      vulnMgmt: 5, secretMgmt: 5, authPatterns: 5, sastDast: 4,
      // Observability — must have full visibility
      logging: 5, metrics: 5, alerting: 5, tracing: 4,
      // Resilience — can't go down
      healthChecks: 5, circuitBreakers: 5, degradation: 4, disasterRecovery: 4,
      // Documentation — teams must be able to operate independently
      runbooks: 4, apiDocs: 5, onboarding: 4, ownership: 5,
      // Infrastructure — fully automated
      iac: 5, envParity: 5, containerization: 5, scaling: 4,
    },
  },
  2: {
    name: 'Tier 2',
    description: 'Important / supporting services',
    color: '#f97316',
    targets: {
      cicd: 4, buildReliability: 4, deployFrequency: 4, releaseProcess: 3,
      testCoverage: 3, staticAnalysis: 4, codeReview: 4, depFreshness: 3,
      vulnMgmt: 4, secretMgmt: 4, authPatterns: 4, sastDast: 3,
      logging: 4, metrics: 4, alerting: 4, tracing: 3,
      healthChecks: 4, circuitBreakers: 3, degradation: 3, disasterRecovery: 3,
      runbooks: 3, apiDocs: 4, onboarding: 3, ownership: 4,
      iac: 4, envParity: 4, containerization: 4, scaling: 3,
    },
  },
  3: {
    name: 'Tier 3',
    description: 'Internal / low-risk / experimental',
    color: '#eab308',
    targets: {
      cicd: 3, buildReliability: 3, deployFrequency: 3, releaseProcess: 2,
      testCoverage: 3, staticAnalysis: 3, codeReview: 3, depFreshness: 2,
      vulnMgmt: 3, secretMgmt: 3, authPatterns: 2, sastDast: 2,
      logging: 3, metrics: 3, alerting: 3, tracing: 2,
      healthChecks: 3, circuitBreakers: 2, degradation: 2, disasterRecovery: 2,
      runbooks: 2, apiDocs: 3, onboarding: 2, ownership: 3,
      iac: 3, envParity: 3, containerization: 3, scaling: 2,
    },
  },
};

// Org-wide minimums — the absolute floor regardless of tier.
// No repo should be allowed to stay below these.
var ORG_MINIMUMS = {
  cicd: 3, buildReliability: 2, deployFrequency: 2, releaseProcess: 2,
  testCoverage: 2, staticAnalysis: 2, codeReview: 3, depFreshness: 2,
  vulnMgmt: 3, secretMgmt: 3, authPatterns: 2, sastDast: 2,
  logging: 3, metrics: 2, alerting: 2, tracing: 2,
  healthChecks: 2, circuitBreakers: 2, degradation: 2, disasterRecovery: 2,
  runbooks: 2, apiDocs: 2, onboarding: 2, ownership: 2,
  iac: 2, envParity: 2, containerization: 2, scaling: 2,
};