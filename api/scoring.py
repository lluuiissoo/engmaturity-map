"""Scoring helpers — ported from js/main.js."""

from api.data import ALL_SUB_KEYS, TIERS, ORG_MINIMUMS


def dim_score(scores: dict[str, int], dim: dict) -> float:
    """Average of the 4 sub-dimension scores for a dimension."""
    vals = [scores.get(s["key"], 0) for s in dim["subs"]]
    return sum(vals) / len(vals)


def overall_score(scores: dict[str, int]) -> float:
    """Average across all 28 sub-dimension scores."""
    vals = [scores.get(k, 0) for k in ALL_SUB_KEYS]
    return sum(vals) / len(vals)


def compute_target(tier: int) -> dict[str, int]:
    """max(tier target, org minimum) per sub-dimension."""
    tier_targets = TIERS[tier]["targets"]
    return {
        key: max(tier_targets.get(key, 1), ORG_MINIMUMS.get(key, 1))
        for key in ALL_SUB_KEYS
    }
