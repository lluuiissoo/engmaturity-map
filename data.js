// Maturity Dimensions Configuration
const DIMENSIONS = [
  { key: 'cicd',          label: 'CI/CD' },
  { key: 'testCoverage',  label: 'Test Coverage' },
  { key: 'security',      label: 'Security' },
  { key: 'observability',  label: 'Observability' },
  { key: 'resilience',    label: 'Resilience' },
  { key: 'codeQuality',   label: 'Code Quality' },
  { key: 'documentation', label: 'Documentation' },
  { key: 'infrastructure', label: 'Infrastructure' },
];

const MATURITY_LEVELS = {
  1: 'Ad-hoc',
  2: 'Basic',
  3: 'Defined',
  4: 'Managed',
  5: 'Optimized',
};

const REPO_TYPES = ['API', 'UI', 'Windows Service', 'Library', 'Shared'];

// Sample data — replace with your real inventory
const repos = [
  // --- APIs ---
  { name: 'orders-api',        type: 'API', team: 'Commerce',    current: { cicd: 4, testCoverage: 3, security: 3, observability: 4, resilience: 3, codeQuality: 4, documentation: 3, infrastructure: 4 }, target: { cicd: 5, testCoverage: 4, security: 4, observability: 5, resilience: 4, codeQuality: 5, documentation: 4, infrastructure: 5 } },
  { name: 'payments-api',      type: 'API', team: 'Commerce',    current: { cicd: 3, testCoverage: 2, security: 4, observability: 3, resilience: 4, codeQuality: 3, documentation: 2, infrastructure: 3 }, target: { cicd: 5, testCoverage: 4, security: 5, observability: 5, resilience: 5, codeQuality: 4, documentation: 4, infrastructure: 4 } },
  { name: 'inventory-api',     type: 'API', team: 'Supply Chain', current: { cicd: 2, testCoverage: 1, security: 2, observability: 2, resilience: 1, codeQuality: 2, documentation: 1, infrastructure: 2 }, target: { cicd: 4, testCoverage: 4, security: 4, observability: 4, resilience: 4, codeQuality: 4, documentation: 3, infrastructure: 4 } },
  { name: 'users-api',         type: 'API', team: 'Platform',    current: { cicd: 5, testCoverage: 4, security: 5, observability: 5, resilience: 4, codeQuality: 5, documentation: 4, infrastructure: 5 }, target: { cicd: 5, testCoverage: 5, security: 5, observability: 5, resilience: 5, codeQuality: 5, documentation: 5, infrastructure: 5 } },
  { name: 'notifications-api', type: 'API', team: 'Platform',    current: { cicd: 3, testCoverage: 2, security: 3, observability: 3, resilience: 2, codeQuality: 3, documentation: 2, infrastructure: 3 }, target: { cicd: 5, testCoverage: 4, security: 4, observability: 5, resilience: 4, codeQuality: 4, documentation: 3, infrastructure: 4 } },
  { name: 'search-api',        type: 'API', team: 'Platform',    current: { cicd: 4, testCoverage: 3, security: 3, observability: 4, resilience: 3, codeQuality: 3, documentation: 2, infrastructure: 4 }, target: { cicd: 5, testCoverage: 4, security: 4, observability: 5, resilience: 4, codeQuality: 4, documentation: 4, infrastructure: 5 } },
  { name: 'pricing-api',       type: 'API', team: 'Commerce',    current: { cicd: 2, testCoverage: 1, security: 2, observability: 1, resilience: 1, codeQuality: 2, documentation: 1, infrastructure: 1 }, target: { cicd: 4, testCoverage: 3, security: 4, observability: 4, resilience: 3, codeQuality: 3, documentation: 3, infrastructure: 3 } },
  { name: 'shipping-api',      type: 'API', team: 'Supply Chain', current: { cicd: 3, testCoverage: 2, security: 3, observability: 2, resilience: 2, codeQuality: 3, documentation: 2, infrastructure: 2 }, target: { cicd: 5, testCoverage: 4, security: 4, observability: 4, resilience: 4, codeQuality: 4, documentation: 3, infrastructure: 4 } },

  // --- Windows Services ---
  { name: 'order-processor',       type: 'Windows Service', team: 'Commerce',      current: { cicd: 2, testCoverage: 1, security: 2, observability: 2, resilience: 2, codeQuality: 2, documentation: 1, infrastructure: 1 }, target: { cicd: 4, testCoverage: 3, security: 4, observability: 4, resilience: 4, codeQuality: 3, documentation: 3, infrastructure: 3 } },
  { name: 'payment-reconciler',    type: 'Windows Service', team: 'Commerce',      current: { cicd: 1, testCoverage: 1, security: 2, observability: 1, resilience: 1, codeQuality: 1, documentation: 1, infrastructure: 1 }, target: { cicd: 4, testCoverage: 3, security: 4, observability: 4, resilience: 4, codeQuality: 3, documentation: 3, infrastructure: 3 } },
  { name: 'report-generator',     type: 'Windows Service', team: 'Analytics',     current: { cicd: 2, testCoverage: 2, security: 2, observability: 2, resilience: 1, codeQuality: 2, documentation: 2, infrastructure: 2 }, target: { cicd: 4, testCoverage: 3, security: 3, observability: 4, resilience: 3, codeQuality: 3, documentation: 3, infrastructure: 3 } },
  { name: 'data-sync-service',    type: 'Windows Service', team: 'Platform',      current: { cicd: 3, testCoverage: 2, security: 3, observability: 3, resilience: 3, codeQuality: 3, documentation: 2, infrastructure: 2 }, target: { cicd: 5, testCoverage: 4, security: 4, observability: 5, resilience: 4, codeQuality: 4, documentation: 3, infrastructure: 4 } },
  { name: 'etl-pipeline',         type: 'Windows Service', team: 'Analytics',     current: { cicd: 1, testCoverage: 1, security: 1, observability: 1, resilience: 1, codeQuality: 1, documentation: 1, infrastructure: 1 }, target: { cicd: 3, testCoverage: 3, security: 3, observability: 3, resilience: 3, codeQuality: 3, documentation: 2, infrastructure: 3 } },
  { name: 'cache-warmer',         type: 'Windows Service', team: 'Platform',      current: { cicd: 3, testCoverage: 2, security: 2, observability: 3, resilience: 2, codeQuality: 2, documentation: 1, infrastructure: 2 }, target: { cicd: 4, testCoverage: 3, security: 3, observability: 4, resilience: 4, codeQuality: 3, documentation: 3, infrastructure: 3 } },

  // --- UI ---
  { name: 'customer-portal',   type: 'UI', team: 'Commerce',    current: { cicd: 4, testCoverage: 3, security: 3, observability: 3, resilience: 2, codeQuality: 4, documentation: 3, infrastructure: 4 }, target: { cicd: 5, testCoverage: 4, security: 4, observability: 4, resilience: 3, codeQuality: 5, documentation: 4, infrastructure: 5 } },
  { name: 'admin-dashboard',   type: 'UI', team: 'Platform',    current: { cicd: 3, testCoverage: 2, security: 3, observability: 2, resilience: 1, codeQuality: 3, documentation: 2, infrastructure: 3 }, target: { cicd: 5, testCoverage: 4, security: 4, observability: 4, resilience: 3, codeQuality: 4, documentation: 4, infrastructure: 4 } },
  { name: 'warehouse-ui',      type: 'UI', team: 'Supply Chain', current: { cicd: 2, testCoverage: 1, security: 2, observability: 1, resilience: 1, codeQuality: 2, documentation: 1, infrastructure: 2 }, target: { cicd: 4, testCoverage: 3, security: 3, observability: 3, resilience: 2, codeQuality: 3, documentation: 3, infrastructure: 3 } },
  { name: 'analytics-ui',      type: 'UI', team: 'Analytics',   current: { cicd: 3, testCoverage: 2, security: 2, observability: 2, resilience: 1, codeQuality: 3, documentation: 2, infrastructure: 3 }, target: { cicd: 4, testCoverage: 3, security: 3, observability: 3, resilience: 2, codeQuality: 4, documentation: 3, infrastructure: 4 } },
  { name: 'mobile-app',        type: 'UI', team: 'Commerce',    current: { cicd: 4, testCoverage: 3, security: 4, observability: 3, resilience: 3, codeQuality: 4, documentation: 3, infrastructure: 3 }, target: { cicd: 5, testCoverage: 4, security: 5, observability: 4, resilience: 4, codeQuality: 5, documentation: 4, infrastructure: 4 } },

  // --- Libraries ---
  { name: 'auth-library',      type: 'Library', team: 'Platform',    current: { cicd: 5, testCoverage: 5, security: 5, observability: 3, resilience: 3, codeQuality: 5, documentation: 4, infrastructure: 4 }, target: { cicd: 5, testCoverage: 5, security: 5, observability: 3, resilience: 3, codeQuality: 5, documentation: 5, infrastructure: 5 } },
  { name: 'logging-lib',       type: 'Library', team: 'Platform',    current: { cicd: 4, testCoverage: 4, security: 3, observability: 5, resilience: 3, codeQuality: 4, documentation: 3, infrastructure: 4 }, target: { cicd: 5, testCoverage: 5, security: 4, observability: 5, resilience: 3, codeQuality: 5, documentation: 4, infrastructure: 5 } },
  { name: 'common-models',     type: 'Library', team: 'Platform',    current: { cicd: 3, testCoverage: 3, security: 2, observability: 1, resilience: 1, codeQuality: 3, documentation: 2, infrastructure: 3 }, target: { cicd: 5, testCoverage: 4, security: 3, observability: 2, resilience: 2, codeQuality: 4, documentation: 4, infrastructure: 4 } },
  { name: 'http-client-lib',   type: 'Library', team: 'Platform',    current: { cicd: 4, testCoverage: 4, security: 4, observability: 3, resilience: 4, codeQuality: 4, documentation: 3, infrastructure: 4 }, target: { cicd: 5, testCoverage: 5, security: 5, observability: 4, resilience: 5, codeQuality: 5, documentation: 4, infrastructure: 5 } },

  // --- Shared ---
  { name: 'infrastructure-repo', type: 'Shared', team: 'DevOps',    current: { cicd: 4, testCoverage: 2, security: 3, observability: 3, resilience: 3, codeQuality: 3, documentation: 3, infrastructure: 5 }, target: { cicd: 5, testCoverage: 3, security: 4, observability: 4, resilience: 4, codeQuality: 4, documentation: 4, infrastructure: 5 } },
  { name: 'ci-templates',       type: 'Shared', team: 'DevOps',    current: { cicd: 5, testCoverage: 3, security: 4, observability: 2, resilience: 2, codeQuality: 4, documentation: 3, infrastructure: 5 }, target: { cicd: 5, testCoverage: 4, security: 5, observability: 3, resilience: 3, codeQuality: 5, documentation: 4, infrastructure: 5 } },
  { name: 'monitoring-config',  type: 'Shared', team: 'DevOps',    current: { cicd: 3, testCoverage: 1, security: 2, observability: 5, resilience: 3, codeQuality: 2, documentation: 2, infrastructure: 4 }, target: { cicd: 4, testCoverage: 3, security: 3, observability: 5, resilience: 4, codeQuality: 3, documentation: 3, infrastructure: 5 } },
];
