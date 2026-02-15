var DIMENSIONS = [
  {
    "key": "buildDelivery",
    "label": "Build & Delivery",
    "subs": [
      { "key": "cicd",             "label": "CI/CD Maturity" },
      { "key": "buildReliability", "label": "Build Reliability" },
      { "key": "deployFrequency",  "label": "Deploy Frequency" },
      { "key": "releaseProcess",   "label": "Release Process" }
    ]
  },
  {
    "key": "codeQuality",
    "label": "Code Quality",
    "subs": [
      { "key": "testCoverage",   "label": "Test Coverage" },
      { "key": "staticAnalysis", "label": "Static Analysis" },
      { "key": "codeReview",     "label": "Code Review" },
      { "key": "depFreshness",   "label": "Dep Freshness" }
    ]
  },
  {
    "key": "security",
    "label": "Security",
    "subs": [
      { "key": "vulnMgmt",    "label": "Vulnerability Mgmt" },
      { "key": "secretMgmt",  "label": "Secret Management" },
      { "key": "authPatterns", "label": "Auth/Authz" },
      { "key": "sastDast",    "label": "SAST/DAST" }
    ]
  },
  {
    "key": "observability",
    "label": "Observability",
    "subs": [
      { "key": "logging",  "label": "Logging" },
      { "key": "metrics",  "label": "Metrics/Dashboards" },
      { "key": "alerting", "label": "Alerting" },
      { "key": "tracing",  "label": "Distributed Tracing" }
    ]
  },
  {
    "key": "resilience",
    "label": "Resilience",
    "subs": [
      { "key": "healthChecks",     "label": "Health Checks" },
      { "key": "circuitBreakers",  "label": "Circuit Breakers" },
      { "key": "degradation",      "label": "Graceful Degradation" },
      { "key": "disasterRecovery", "label": "Disaster Recovery" }
    ]
  },
  {
    "key": "documentation",
    "label": "Documentation",
    "subs": [
      { "key": "runbooks",   "label": "Runbooks" },
      { "key": "apiDocs",    "label": "API Docs" },
      { "key": "onboarding", "label": "Onboarding Ease" },
      { "key": "ownership",  "label": "Ownership Clarity" }
    ]
  },
  {
    "key": "infrastructure",
    "label": "Infrastructure",
    "subs": [
      { "key": "iac",              "label": "IaC Adoption" },
      { "key": "envParity",        "label": "Env Parity" },
      { "key": "containerization", "label": "Containerization" },
      { "key": "scaling",          "label": "Scaling Strategy" }
    ]
  }
];
