# Strategies for setting targets

1. Uniform targets by repo type
Every API gets the same target profile, every Windows Service gets the same, etc. Makes sense if you want a baseline standard. Example: "All APIs must reach level 4 on Security, level 3 on Documentation."

2. Tiered by criticality
Tag repos as Tier 1 (revenue-critical), Tier 2 (important), Tier  3(internal/low-risk). Tier 1 gets aggressive targets (4-5), Tier 3 gets reasonable ones (3). A pricing API handling money has different expectations than an internal reporting tool.

3. Org-wide minimums + team stretch goals
Set a floor across the board (e.g., nothing below 3 on Security, nothing below 2 on Observability), then let teams set their own stretch targets above that.

4. Gap-driven / pain-driven
Look at where incidents are happening, where deployments are painful, where security is flagging issues — and set targets specifically where it hurts. No need to push Documentation to 5 if nobody's struggling with it.

---
Selected option: go with option 2 (tiered by criticality) combined with option 3 (org minimums). Define 3 tiers, set minimum floors, and you get a target matrix that's maybe 30 cells instead of 2,968 (106 repos x 28 sub-dimensions).

