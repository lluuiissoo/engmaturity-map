# MaturityMap API

REST API exposing repo maturity data from the MaturityMap inventory.

## Local Development

```bash
python3 -m venv .venv
.venv/bin/pip install -r api/requirements.txt
```

## Running the API

From the project root:

```bash
.venv/bin/uvicorn api.main:app --reload
```

The API will be available at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

## Running Tests

```bash
.venv/bin/pytest api/tests/ -v
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/services` | List all repos (name, displayName, repoLink, type, team, tier) |
| GET | `/services/{name}/score` | Full scores and dimension averages for a repo |
| GET | `/services/{name}/score/compliance` | Compliance check: current avg vs target avg, pass/fail result |
