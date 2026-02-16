"""Unit tests for scoring logic."""

from api.data import DIMENSIONS, TIERS, ORG_MINIMUMS, ALL_SUB_KEYS
from api.scoring import dim_score, overall_score, compute_target


def test_dim_score_basic():
    dim = DIMENSIONS[0]  # buildDelivery: cicd, buildReliability, deployFrequency, releaseProcess
    scores = {"cicd": 4, "buildReliability": 2, "deployFrequency": 4, "releaseProcess": 2}
    assert dim_score(scores, dim) == 3.0


def test_dim_score_missing_keys_default_to_zero():
    dim = DIMENSIONS[0]
    scores = {"cicd": 4}  # other 3 keys missing → 0
    assert dim_score(scores, dim) == 1.0


def test_overall_score_all_ones():
    scores = {k: 1 for k in ALL_SUB_KEYS}
    assert overall_score(scores) == 1.0


def test_overall_score_all_fives():
    scores = {k: 5 for k in ALL_SUB_KEYS}
    assert overall_score(scores) == 5.0


def test_overall_score_mixed():
    scores = {k: 3 for k in ALL_SUB_KEYS}
    scores["cicd"] = 5
    expected = (3 * 27 + 5) / 28
    assert abs(overall_score(scores) - expected) < 1e-9


def test_compute_target_tier1_respects_org_minimums():
    target = compute_target(1)
    for key in ALL_SUB_KEYS:
        tier_val = TIERS[1]["targets"].get(key, 1)
        org_val = ORG_MINIMUMS.get(key, 1)
        assert target[key] == max(tier_val, org_val)


def test_compute_target_tier3_org_minimum_lifts():
    target = compute_target(3)
    # cicd: tier3 target is 3, org minimum is 4 → should be 4
    assert target["cicd"] == 4


def test_compute_target_returns_all_sub_keys():
    target = compute_target(2)
    assert set(target.keys()) == set(ALL_SUB_KEYS)
