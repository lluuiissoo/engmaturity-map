# Engineering Quality Dimensions

Here's what we will track, grouped by concern. Don't boil the ocean — start with what hurts most, expand later.

## Build & Delivery
- CI/CD maturity (manual → automated → canary/blue-green)
- Build reliability (flaky builds, build time)
- Deployment frequency
- Release process (manual approvals, automated gates)

## Code Quality
- Test coverage (unit, integration, e2e)
- Static analysis / linting enforcement
- Code review practices
- Dependency freshness (outdated packages)

## Security
- Known vulnerabilities (CVEs in deps)
- Secret management (hardcoded vs vault)
- Auth/authz patterns
- SAST/DAST scanning in pipeline

##  Observability
- Logging (structured, centralized)
- Metrics / dashboards
- Alerting coverage
- Distributed tracing

##  Resilience
- Health checks
- Circuit breakers / retry policies
- Graceful degradation
- Disaster recovery / failover

##  Documentation & Operability
- Runbooks
- API documentation (OpenAPI, etc.)
- Onboarding ease
- Ownership clarity (CODEOWNERS, on-call)

##  Infrastructure
- IaC adoption
- Environment parity (dev/staging/prod)
- Containerization
- Scaling strategy (manual vs auto)

# Scoring Model

Each dimension and sub-dimension scored 1–5:
1. Ad-hoc — nothing in place
2. Basic — partially done, inconsistent
3. Defined — standardized, documented
4. Managed — measured, enforced
5. Optimized — automated, continuously improving