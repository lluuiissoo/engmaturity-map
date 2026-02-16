"""FastAPI application — MaturityMap REST API."""

from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from api.data import DIMENSIONS, REPO_INVENTORY
from api.models import ComplianceResponse, ScoreResponse, ServiceSummary
from api.scoring import compute_target, dim_score, overall_score

app = FastAPI(title="MaturityMap API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Index repos by name for O(1) lookup
_REPO_INDEX: dict[str, dict] = {r["name"]: r for r in REPO_INVENTORY}


@app.get("/services", response_model=list[ServiceSummary])
def list_services():
    return [
        ServiceSummary(
            name=r["name"],
            displayName=r["displayName"],
            repoLink=r["repoLink"],
            type=r["type"],
            team=r["team"],
            tier=r["tier"],
        )
        for r in REPO_INVENTORY
    ]


@app.get("/services/{name}/score", response_model=ScoreResponse)
def get_service_score(name: str):
    repo = _REPO_INDEX.get(name)
    if repo is None:
        raise HTTPException(status_code=404, detail=f"Service '{name}' not found")

    scores = repo["current"]
    dimension_scores = {d["key"]: round(dim_score(scores, d), 2) for d in DIMENSIONS}

    return ScoreResponse(
        assessmentType="repo",
        name=repo["name"],
        assessedAt=datetime.now(timezone.utc).isoformat(),
        scores=scores,
        dimensionScores=dimension_scores,
        overall=round(overall_score(scores), 2),
        repo=repo["name"],
        type=repo["type"],
        team=repo["team"],
        tier=repo["tier"],
    )


@app.get("/services/{name}/score/compliance", response_model=ComplianceResponse)
def get_service_compliance(name: str):
    repo = _REPO_INDEX.get(name)
    if repo is None:
        raise HTTPException(status_code=404, detail=f"Service '{name}' not found")

    current_avg = round(overall_score(repo["current"]), 2)
    target = compute_target(repo["tier"])
    target_avg = round(overall_score(target), 2)
    result = "Passed" if current_avg >= target_avg else "Failed"

    return ComplianceResponse(
        name=repo["name"],
        type=repo["type"],
        team=repo["team"],
        tier=repo["tier"],
        currentAvg=current_avg,
        targetAvg=target_avg,
        result=result,
    )
