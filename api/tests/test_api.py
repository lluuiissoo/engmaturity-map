"""Integration tests for the API endpoints."""

from fastapi.testclient import TestClient

from api.data import ALL_SUB_KEYS, DIMENSIONS, REPO_INVENTORY
from api.main import app

client = TestClient(app)


# --- /services list endpoint tests ---


def test_list_services_returns_all_repos():
    resp = client.get("/services")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == len(REPO_INVENTORY)


def test_list_services_item_shape():
    resp = client.get("/services")
    item = resp.json()[0]
    assert "name" in item
    assert "displayName" in item
    assert "repoLink" in item
    assert "type" in item
    assert "team" in item
    assert "tier" in item
    assert "current" not in item


def test_list_services_names_match_inventory():
    resp = client.get("/services")
    names = {s["name"] for s in resp.json()}
    expected = {r["name"] for r in REPO_INVENTORY}
    assert names == expected


# --- /services/{name}/score endpoint tests ---


def test_valid_service_returns_200():
    resp = client.get("/services/orders-api/score")
    assert resp.status_code == 200
    data = resp.json()
    assert data["name"] == "orders-api"
    assert data["assessmentType"] == "repo"
    assert data["repo"] == "orders-api"
    assert data["type"] == "API"
    assert data["team"] == "Commerce"
    assert data["tier"] == 1


def test_response_has_all_score_keys():
    resp = client.get("/services/orders-api/score")
    data = resp.json()
    assert set(data["scores"].keys()) == set(ALL_SUB_KEYS)


def test_response_has_all_dimension_scores():
    resp = client.get("/services/orders-api/score")
    data = resp.json()
    dim_keys = {d["key"] for d in DIMENSIONS}
    assert set(data["dimensionScores"].keys()) == dim_keys


def test_overall_is_float():
    resp = client.get("/services/orders-api/score")
    data = resp.json()
    assert isinstance(data["overall"], float)


def test_assessed_at_is_iso_timestamp():
    resp = client.get("/services/orders-api/score")
    data = resp.json()
    assert "T" in data["assessedAt"]


def test_nonexistent_service_returns_404():
    resp = client.get("/services/nonexistent/score")
    assert resp.status_code == 404
    assert "nonexistent" in resp.json()["detail"]


def test_users_api_scores_match_inventory():
    """Verify that returned scores exactly match the inventory data."""
    repo = next(r for r in REPO_INVENTORY if r["name"] == "users-api")
    resp = client.get("/services/users-api/score")
    data = resp.json()
    assert data["scores"] == repo["current"]


# --- Compliance endpoint tests ---


def test_compliance_returns_200():
    resp = client.get("/services/orders-api/score/compliance")
    assert resp.status_code == 200
    data = resp.json()
    assert data["name"] == "orders-api"
    assert data["type"] == "API"
    assert data["team"] == "Commerce"
    assert data["tier"] == 1
    assert data["result"] in ("Passed", "Failed")


def test_compliance_has_averages():
    resp = client.get("/services/orders-api/score/compliance")
    data = resp.json()
    assert isinstance(data["currentAvg"], float)
    assert isinstance(data["targetAvg"], float)


def test_compliance_nonexistent_returns_404():
    resp = client.get("/services/nonexistent/score/compliance")
    assert resp.status_code == 404


def test_compliance_users_api_current_below_target():
    """users-api has near-perfect scores but tier 1 target is very high."""
    resp = client.get("/services/users-api/score/compliance")
    data = resp.json()
    # current 4.54 vs target 4.64 — close but still fails
    assert data["result"] == "Failed"
    assert data["currentAvg"] == 4.54
    assert data["targetAvg"] == 4.64


def test_compliance_pricing_api_fails():
    """pricing-api has all 1s on a tier 1 repo — should fail."""
    resp = client.get("/services/pricing-api/score/compliance")
    data = resp.json()
    assert data["result"] == "Failed"
    assert data["currentAvg"] < data["targetAvg"]
