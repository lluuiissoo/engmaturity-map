// Assessment rubric — criteria per maturity level per sub-dimension.
// Score = highest level where ALL criteria are met.
// Each level builds on the previous (cumulative).
var ASSESSMENT = {
  // ============================================================
  // BUILD & DELIVERY
  // ============================================================
  "cicd": {
    "1": ["Builds are triggered manually or on developer machines", "No CI server configured"],
    "2": ["CI server runs builds on commit", "Build scripts exist but are fragile or undocumented"],
    "3": ["CI/CD pipeline defined as code (YAML/Jenkinsfile)", "Automated build + test + deploy to at least one environment", "Pipeline config is version-controlled"],
    "4": ["Deploys to all environments are automated through pipeline", "Pipeline includes quality gates (tests, scans) that block promotion", "Rollback mechanism exists and is documented"],
    "5": ["Canary, blue-green, or progressive delivery in production", "Pipeline changes go through PR review", "Self-service pipeline creation from templates"]
  },
  "buildReliability": {
    "1": ["Builds frequently fail for reasons unrelated to code changes", "No visibility into build health"],
    "2": ["Build success rate is tracked but below 80%", "Flaky tests exist and are known but not addressed"],
    "3": ["Build success rate is above 80%", "Flaky tests are identified and quarantined", "Build times are under 15 minutes"],
    "4": ["Build success rate is above 95%", "Build failures are investigated and resolved within 24h", "Build time is under 10 minutes", "Build cache is utilized effectively"],
    "5": ["Build success rate is above 99%", "Build performance is monitored with alerts on degradation", "Continuous optimization of build times"]
  },
  "deployFrequency": {
    "1": ["Deployments happen less than once per month", "Deployments require significant manual coordination"],
    "2": ["Deployments happen at least monthly", "There is a known (if manual) deployment process"],
    "3": ["Deployments happen weekly or more frequently", "Deployments are routine and low-stress", "Deployment process is documented"],
    "4": ["Deployments happen multiple times per week", "Any team member can trigger a deployment", "Deployments happen during business hours without fear"],
    "5": ["On-demand deployments multiple times per day", "Deployment is a non-event — fully automated", "Lead time from commit to production is under 1 hour"]
  },
  "releaseProcess": {
    "1": ["No defined release process", "Releases are ad-hoc and error-prone"],
    "2": ["Basic release process exists but is mostly manual", "Someone knows how to do a release"],
    "3": ["Release process is documented and repeatable", "Release checklist or runbook exists", "Version tagging is consistent"],
    "4": ["Release approvals are automated through pipeline gates", "Release notes are generated automatically", "Feature flags are used to decouple deploy from release"],
    "5": ["Fully automated release pipeline with automated validation", "Release scheduling and coordination is self-service", "Automated rollback on failure detection"]
  },

  // ============================================================
  // CODE QUALITY
  // ============================================================
  "testCoverage": {
    "1": ["No automated tests or coverage below 10%", "Testing is ad-hoc and manual"],
    "2": ["Some unit tests exist, coverage between 10-30%", "Tests run locally but not enforced in CI"],
    "3": ["Unit test coverage above 50%", "Tests run in CI and block merges on failure", "Integration tests exist for critical paths"],
    "4": ["Unit test coverage above 70%", "Integration and contract tests are part of CI", "Coverage trends are tracked and visible", "Test quality is reviewed (not just coverage numbers)"],
    "5": ["Unit test coverage above 85%", "E2E tests cover key user journeys", "Mutation testing or equivalent quality validation", "Test suite is fast, reliable, and well-maintained"]
  },
  "staticAnalysis": {
    "1": ["No linting or static analysis tools configured", "Code style is inconsistent"],
    "2": ["Linter exists but is not enforced or has many exceptions", "Code formatting is inconsistent across the codebase"],
    "3": ["Linter runs in CI and blocks on violations", "Consistent code style enforced (Prettier, ESLint, etc.)", "No linter exceptions without documented justification"],
    "4": ["Additional static analysis beyond linting (SonarQube, CodeClimate)", "Quality metrics are tracked over time", "Technical debt is measured and visible"],
    "5": ["Static analysis gates are part of merge requirements", "Custom rules enforce architecture decisions", "Zero tolerance for new violations — ratchet mechanism in place"]
  },
  "codeReview": {
    "1": ["No code review process — direct commits to main", "No PR workflow"],
    "2": ["PRs are created but reviews are optional or rubber-stamped", "No review standards or guidelines"],
    "3": ["All changes require at least one approved review", "Review guidelines/checklist exist", "Branch protection prevents direct pushes to main"],
    "4": ["Reviews happen within 24h on average", "Reviewers check for architecture, security, and test coverage", "CODEOWNERS enforced for critical paths"],
    "5": ["Review feedback loop is under 4h average", "Reviews include knowledge-sharing and mentoring", "Automated checks reduce reviewer burden (bots, AI assist)"]
  },
  "depFreshness": {
    "1": ["No visibility into dependency versions or age", "Dependencies are never updated proactively"],
    "2": ["Aware of outdated dependencies but no process to update", "Some dependencies are years out of date"],
    "3": ["Dependency updates happen at least quarterly", "Automated tools flag outdated dependencies (Dependabot, Renovate)", "No dependencies more than 2 major versions behind"],
    "4": ["Dependency updates happen at least monthly", "Automated PRs for dependency updates are reviewed and merged regularly", "Breaking changes in dependencies are handled promptly"],
    "5": ["Dependencies are updated within days of new releases", "Automated testing validates dependency updates", "License compliance is continuously monitored"]
  },

  // ============================================================
  // SECURITY
  // ============================================================
  "vulnMgmt": {
    "1": ["No vulnerability scanning in place", "No awareness of known CVEs in dependencies"],
    "2": ["Occasional manual vulnerability checks", "Some awareness of CVEs but no systematic process"],
    "3": ["Automated dependency scanning runs in CI (Snyk, Trivy, etc.)", "Critical/high vulnerabilities block deployments", "Vulnerability findings are tracked in a backlog"],
    "4": ["SLA defined for vulnerability remediation by severity", "Container image scanning in place", "Regular vulnerability review cadence (weekly/sprint)"],
    "5": ["Vulnerabilities are auto-remediated where possible", "Runtime vulnerability detection in production", "Mean time to remediate critical CVEs is under 48h"]
  },
  "secretMgmt": {
    "1": ["Secrets are hardcoded in source code or config files", "No secret rotation"],
    "2": ["Secrets are in environment variables but not in a vault", "Secret rotation is manual and infrequent"],
    "3": ["Secrets stored in a vault or secret manager (Azure KV, AWS SM, HashiCorp)", "Pre-commit hooks scan for secret leaks", "No secrets in source code (verified by scanning)"],
    "4": ["Secrets are rotated on a defined schedule", "Access to secrets is audited", "Least-privilege access to secret stores"],
    "5": ["Automatic secret rotation", "Dynamic/short-lived credentials where possible", "Secret access anomaly detection in place"]
  },
  "authPatterns": {
    "1": ["No standard auth mechanism or roll-your-own auth", "No authorization model"],
    "2": ["Basic auth implemented but inconsistent across endpoints", "Authorization is ad-hoc (hardcoded role checks)"],
    "3": ["Standardized auth using org-approved library/pattern (OAuth, JWT)", "Role-based or policy-based authorization model", "Auth is tested"],
    "4": ["Centralized identity provider integration", "Auth patterns are consistent across all services", "Least-privilege enforced and reviewed regularly"],
    "5": ["Zero-trust principles applied", "Auth decisions are audited and logged", "Regular access reviews and automated deprovisioning"]
  },
  "sastDast": {
    "1": ["No SAST or DAST scanning", "Security testing is not part of the development process"],
    "2": ["Ad-hoc security reviews on request", "Occasional pen testing but not systematic"],
    "3": ["SAST tool runs in CI pipeline", "High/critical findings block merges", "Security findings are tracked and triaged"],
    "4": ["Both SAST and DAST run as part of pipeline", "Security findings have defined SLAs for resolution", "Third-party pen testing conducted at least annually"],
    "5": ["IAST or runtime security monitoring in production", "Security champions program within the team", "Threat modeling conducted for new features"]
  },

  // ============================================================
  // OBSERVABILITY
  // ============================================================
  "logging": {
    "1": ["Console.log / print statements only", "Logs not centralized — exist only on local disk"],
    "2": ["Some structured logging exists", "Logs are shipped somewhere but hard to search/query"],
    "3": ["Structured logging (JSON) with consistent format", "Logs are centralized and searchable (ELK, Splunk, etc.)", "Log levels are used correctly (info, warn, error)"],
    "4": ["Correlation IDs propagated across services", "Log retention and rotation policies defined", "Sensitive data is masked/excluded from logs"],
    "5": ["Logs are used proactively for anomaly detection", "Log quality is reviewed and maintained", "Log-based alerting complements metric-based alerting"]
  },
  "metrics": {
    "1": ["No application or business metrics collected", "No dashboards"],
    "2": ["Basic infrastructure metrics only (CPU, memory)", "One-off dashboards that are rarely maintained"],
    "3": ["Application metrics collected (request rate, latency, errors)", "Dashboards exist for key services and are kept current", "RED or USE method applied"],
    "4": ["Business metrics tracked alongside technical metrics", "SLIs/SLOs defined and measured", "Dashboard hierarchy (overview → detail drill-down)"],
    "5": ["Metrics drive automated decisions (autoscaling, alerts)", "Custom dashboards for different audiences (eng, ops, business)", "Metric anomaly detection in place"]
  },
  "alerting": {
    "1": ["No alerting configured", "Issues discovered by end users or manual checks"],
    "2": ["Some alerts exist but they are noisy or ignored", "No clear ownership of alert response"],
    "3": ["Alerts defined for critical failure scenarios", "Alert routing to the responsible team/on-call", "Alerts have clear severity levels and runbook links"],
    "4": ["Alert coverage for all SLOs", "Alert fatigue is managed — alerts are actionable and tuned", "Escalation paths are defined and tested"],
    "5": ["Proactive alerting on trends before failures occur", "Alerts auto-create incidents in tracking system", "Regular alert review and pruning cadence"]
  },
  "tracing": {
    "1": ["No distributed tracing", "Debugging cross-service issues relies on log grep"],
    "2": ["Some tracing exists but not across all services", "Tracing is ad-hoc or only in development"],
    "3": ["Distributed tracing implemented (Jaeger, Zipkin, OpenTelemetry)", "Trace IDs propagated across service boundaries", "Tracing is available in production"],
    "4": ["Traces are searchable by business identifiers", "Trace data is used for latency analysis and optimization", "Sampling strategy is defined and appropriate"],
    "5": ["Trace-based alerting on latency anomalies", "Continuous profiling integrated with tracing", "Traces feed into service dependency mapping automatically"]
  },

  // ============================================================
  // RESILIENCE
  // ============================================================
  "healthChecks": {
    "1": ["No health check endpoints", "Liveness determined only by process running"],
    "2": ["Basic health endpoint exists (returns 200)", "Health check does not verify downstream dependencies"],
    "3": ["Health endpoint checks key dependencies (DB, cache, queues)", "Liveness and readiness probes are separate", "Load balancer uses health checks for routing"],
    "4": ["Health checks include shallow and deep modes", "Startup probes prevent premature traffic routing", "Health check results feed into monitoring/dashboards"],
    "5": ["Health checks drive automated remediation (restart, failover)", "Dependency health is aggregated into system-level health view", "Health degradation triggers graceful load-shedding"]
  },
  "circuitBreakers": {
    "1": ["No circuit breakers or retry logic", "Downstream failures cascade through the system"],
    "2": ["Basic retry logic exists for some calls", "No backoff strategy — retries can cause thundering herd"],
    "3": ["Circuit breaker pattern implemented for external dependencies", "Exponential backoff with jitter on retries", "Timeout values are configured (not infinite/default)"],
    "4": ["Circuit breaker state is monitored and alerted on", "Bulkhead pattern isolates critical from non-critical paths", "Retry budgets prevent retry storms"],
    "5": ["Adaptive timeouts based on observed latency", "Circuit breaker configuration is tuned based on production data", "Chaos engineering validates resilience patterns regularly"]
  },
  "degradation": {
    "1": ["System fails completely when any dependency is unavailable", "No fallback behavior defined"],
    "2": ["Some hardcoded fallbacks exist for specific scenarios", "Degradation behavior is untested"],
    "3": ["Graceful degradation is designed for key dependencies", "Fallback responses or cached data served when dependencies fail", "Degradation scenarios are documented"],
    "4": ["Feature flags allow runtime feature degradation", "Load shedding protects core functionality under load", "Degraded modes are tested regularly"],
    "5": ["Automated degradation based on system health signals", "Partial failures result in partial functionality (not total failure)", "Chaos testing validates degradation behavior in production"]
  },
  "disasterRecovery": {
    "1": ["No DR plan exists", "No backups or backup restoration is untested"],
    "2": ["Backups exist but have never been tested", "DR plan is informal or outdated"],
    "3": ["DR plan is documented with RTO/RPO targets", "Backups are tested at least quarterly", "Database restore procedure is verified"],
    "4": ["DR drills are conducted at least annually", "RTO/RPO targets are met in drills", "Multi-region or standby infrastructure exists"],
    "5": ["Automated failover to DR environment", "DR is tested continuously (not just annually)", "Zero/near-zero data loss failover for critical data"]
  },

  // ============================================================
  // DOCUMENTATION
  // ============================================================
  "runbooks": {
    "1": ["No runbooks or operational documentation", "Tribal knowledge only"],
    "2": ["Some docs exist but are outdated or incomplete", "Only the original author can operate the system"],
    "3": ["Runbooks exist for common operational tasks", "Alert-to-runbook mapping for critical alerts", "Runbooks are reviewed and updated at least quarterly"],
    "4": ["Runbooks are linked from alerts and dashboards", "Incident response procedures are documented", "New team members can operate the system using docs alone"],
    "5": ["Runbooks are tested and validated regularly", "Operational procedures are automated where possible", "Post-incident runbook updates are part of the process"]
  },
  "apiDocs": {
    "1": ["No API documentation", "Consumers rely on reading source code or asking the team"],
    "2": ["Some API docs exist but are incomplete or outdated", "Documentation is separate from code and drifts"],
    "3": ["API documentation generated from code (OpenAPI/Swagger)", "Docs cover all public endpoints with request/response examples", "Docs are published and accessible to consumers"],
    "4": ["API docs include error codes, rate limits, and auth requirements", "Docs auto-update on deployment", "Changelog/versioning is documented"],
    "5": ["Interactive API explorer available (try-it-out)", "API contract tests validate docs match implementation", "Consumer feedback loop improves documentation"]
  },
  "onboarding": {
    "1": ["No setup instructions — new developers struggle for days", "Development environment setup is undocumented"],
    "2": ["README exists with basic setup steps", "Setup requires significant tribal knowledge beyond docs"],
    "3": ["README gets a new developer to running code in under 1 hour", "Development dependencies are clearly listed", "Contributing guidelines exist"],
    "4": ["One-command or automated development environment setup", "Architecture decision records (ADRs) explain key choices", "Onboarding checklist for new team members"],
    "5": ["Fully containerized development environment", "Self-service onboarding — no human assistance needed", "Interactive documentation or tutorials for complex areas"]
  },
  "ownership": {
    "1": ["No clear owner — nobody knows who maintains this", "No on-call rotation"],
    "2": ["Informal ownership — one person knows the system", "No CODEOWNERS file or equivalent"],
    "3": ["Team ownership is documented and visible (CODEOWNERS, wiki)", "On-call rotation exists for the service", "Escalation path is defined"],
    "4": ["CODEOWNERS enforced in PRs for critical paths", "SLA/SLO ownership is assigned to the team", "Regular ownership reviews prevent orphaned services"],
    "5": ["Full service ownership model (team owns build, run, on-call)", "Service catalog with ownership metadata is maintained", "Ownership transfers are formal and documented"]
  },

  // ============================================================
  // INFRASTRUCTURE
  // ============================================================
  "iac": {
    "1": ["Infrastructure is manually provisioned (ClickOps)", "No infrastructure code exists"],
    "2": ["Some scripts exist but infrastructure is mostly manual", "Infrastructure changes are ad-hoc and undocumented"],
    "3": ["Infrastructure defined in code (Terraform, Pulumi, ARM, etc.)", "IaC is version-controlled", "Changes go through PR review"],
    "4": ["IaC changes are applied through CI/CD pipeline only", "State is managed centrally (remote state, locking)", "Drift detection is in place"],
    "5": ["All infrastructure is code — no manual changes allowed", "Infrastructure modules are reusable and shared", "Policy-as-code validates infrastructure compliance"]
  },
  "envParity": {
    "1": ["Only production exists — no other environments", "Development happens directly against production"],
    "2": ["Dev and prod exist but differ significantly in config/topology", "Environment setup is manual and inconsistent"],
    "3": ["Dev, staging, and prod environments exist", "Environments share the same deployment process", "Config differences between environments are documented"],
    "4": ["Environments are provisioned from the same IaC templates", "Data masking/anonymization for non-prod environments", "Environments are refreshed regularly"],
    "5": ["On-demand ephemeral environments for testing (PR environments)", "Production-like load testing environment available", "Environment provisioning is fully automated and fast"]
  },
  "containerization": {
    "1": ["Application runs directly on VMs or bare metal", "No containerization"],
    "2": ["Dockerfile exists but is not optimized or standardized", "Containers used in development but not production"],
    "3": ["Application runs in containers in production", "Base images are standardized across the org", "Images are built in CI and pushed to a registry"],
    "4": ["Multi-stage builds produce minimal images", "Container security scanning in pipeline", "Orchestration platform manages containers (K8s, ECS, etc.)"],
    "5": ["Distroless or minimal base images", "Image signing and verification in place", "Container runtime security monitoring"]
  },
  "scaling": {
    "1": ["No scaling strategy — single instance, fixed capacity", "Capacity is guessed and rarely adjusted"],
    "2": ["Manual scaling by adjusting instance count or VM size", "Some awareness of load patterns but no proactive scaling"],
    "3": ["Horizontal scaling is possible and documented", "Load testing has been performed at least once", "Resource limits and requests are configured"],
    "4": ["Auto-scaling configured based on metrics (CPU, request rate)", "Load testing is part of release process for major changes", "Scaling limits are defined to prevent runaway costs"],
    "5": ["Predictive scaling based on historical patterns", "Load testing is automated and runs regularly", "Cost-optimized scaling with spot/preemptible instances"]
  }
};
