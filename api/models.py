"""Pydantic response models."""

from pydantic import BaseModel


class ScoreResponse(BaseModel):
    assessmentType: str
    name: str
    assessedAt: str
    scores: dict[str, int]
    dimensionScores: dict[str, float]
    overall: float
    repo: str
    type: str
    team: str
    tier: int


class ServiceSummary(BaseModel):
    name: str
    type: str
    team: str
    tier: int


class ComplianceResponse(BaseModel):
    name: str
    type: str
    team: str
    tier: int
    currentAvg: float
    targetAvg: float
    result: str
