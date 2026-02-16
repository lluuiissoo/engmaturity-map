"""Load JS data files into Python at import time."""

import json
import re
from pathlib import Path

_JS_DIR = Path(__file__).resolve().parent.parent / "js"


def _read(filename: str) -> str:
    return (_JS_DIR / filename).read_text()


def _parse_js_array(text: str, var_name: str) -> list:
    """Extract a JS array assigned to `var VARNAME = [...]`."""
    pattern = rf"(?:var|const|let)\s+{var_name}\s*=\s*(\[.*?\]);"
    match = re.search(pattern, text, re.DOTALL)
    if not match:
        raise ValueError(f"Could not find {var_name} in JS source")
    raw = match.group(1)
    # Remove JS comments
    raw = re.sub(r"//[^\n]*", "", raw)
    # Add quotes around unquoted keys: word followed by :
    raw = re.sub(r"(?<=[{,\n])\s*(\w+)\s*:", r' "\1":', raw)
    # Replace single quotes with double quotes
    raw = raw.replace("'", '"')
    # Remove trailing commas before ] or }
    raw = re.sub(r",\s*([}\]])", r"\1", raw)
    return json.loads(raw)


def _parse_js_object(text: str, var_name: str) -> dict:
    """Extract a JS object assigned to `var VARNAME = {...}`."""
    pattern = rf"(?:var|const|let)\s+{var_name}\s*=\s*(\{{.*?\}});"
    match = re.search(pattern, text, re.DOTALL)
    if not match:
        raise ValueError(f"Could not find {var_name} in JS source")
    raw = match.group(1)
    raw = re.sub(r"//[^\n]*", "", raw)
    raw = re.sub(r"(?<=[{,\n])\s*(\w+)\s*:", r' "\1":', raw)
    raw = raw.replace("'", '"')
    raw = re.sub(r",\s*([}\]])", r"\1", raw)
    return json.loads(raw)


# --- Load dimensions ---
DIMENSIONS: list[dict] = _parse_js_array(_read("dimensions-loader.js"), "DIMENSIONS")
ALL_SUB_KEYS: list[str] = [s["key"] for d in DIMENSIONS for s in d["subs"]]

# --- Load tiers ---
_tiers_src = _read("tiers-loader.js")

# TIERS is a nested object with integer keys — parse the outer braces,
# then extract each numbered tier individually.
_tiers_match = re.search(
    r"(?:var|const|let)\s+TIERS\s*=\s*(\{.*?\n\});", _tiers_src, re.DOTALL
)
if not _tiers_match:
    raise ValueError("Could not find TIERS in JS source")

_tiers_raw = _tiers_match.group(1)
TIERS: dict[int, dict] = {}
for tier_num in (1, 2, 3):
    # Find each tier block: N: { ... }
    tier_pattern = rf"{tier_num}\s*:\s*(\{{.*?\n  \}})"
    tier_match = re.search(tier_pattern, _tiers_raw, re.DOTALL)
    if not tier_match:
        raise ValueError(f"Could not find tier {tier_num}")
    raw = tier_match.group(1)
    raw = re.sub(r"//[^\n]*", "", raw)
    raw = re.sub(r"(?<=[{,\n])\s*(\w+)\s*:", r' "\1":', raw)
    raw = raw.replace("'", '"')
    raw = re.sub(r",\s*([}\]])", r"\1", raw)
    TIERS[tier_num] = json.loads(raw)

ORG_MINIMUMS: dict[str, int] = _parse_js_object(_tiers_src, "ORG_MINIMUMS")

# --- Load inventory ---
REPO_INVENTORY: list[dict] = _parse_js_array(
    _read("inventory-loader.js"), "REPO_INVENTORY"
)
