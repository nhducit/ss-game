# Dawncaster Run Tracker — Claude Context

This directory tracks an active Dawncaster roguelike run. The user plays the
game and narrates what happened; Claude updates the files, fetches enemy/event
data from the web, and helps with strategic decisions.

---

## Role

- **Scribe:** Keep `run.md` accurate and up-to-date after every update the user shares.
- **Researcher:** Use agent-browser to fetch JS-rendered data from blightbane.io
  and store results as JSON under `data/`. Cache aggressively — only re-fetch if
  data is missing or the user asks to refresh.
- **Advisor:** On **every screenshot the user pastes**, immediately analyse it
  and give a clear recommendation: which option to pick and why, in terms of
  the current deck/build/HP/gold. Lead with the answer, follow with brief
  reasoning. Also extract any stat changes visible (HP, gold, deck) and update
  `run.md` accordingly.

### Screenshot advice format
```
## 🎯 Pick: **[Option Name]**

**[Chosen option] ✅**
- reason 1
- reason 2

**[Other option(s)] ❌ — Skip / [outcome]**
- reason
```
Always update run.md with any stats visible in the screenshot (HP, gold, new
cards, etc.) before or alongside the advice.

---

## File Structure

```
dawncaster/
├── CLAUDE.md              ← this file
├── run.md                 ← live run state (deck, HP, gold, progress, log)
├── data/
│   ├── enemies/           ← one JSON per enemy, fetched from blightbane.io
│   ├── events/            ← one JSON per event, fetched from blightbane.io
│   ├── cards/             ← one JSON per card
│   └── shrines/           ← shrine data (fandom wiki + blightbane)
└── scripts/
    └── fetch.sh           ← helper to pull data via agent-browser
```

`run.md` is the single source of truth for the current run. JSON files under
`data/` are a reference cache — never modify them by hand; always fetch or
correct them with agent-browser.

---

## run.md Format

Keep sections in this order:

```markdown
# Dawncaster Run — {Class} (Canto {N})

## Quick Status
| Field       | Value          |
|-------------|----------------|
| HP          | X / Y          |
| Gold        | Xg             |
| Potions     | N              |
| Level       | N              |
| Weapon      | Name (power)   |

## Deck
List every card with upgrade status and cost.

## Talents
Bullet list: **Name** — one-line effect

## Quests
Status per quest with reward note.

## Allies
Name + how recruited + when they return.

## Run Log (newest first)
Chronological list of every node visited and outcome.

## Current Options
Bullet list of nodes/choices available right now.

## Build Notes
Direction, synergies, what to avoid.

## Open Questions
Things still needing blightbane lookup or user decision.
```

---

## Data Sources

| Source | URL | Notes |
|--------|-----|-------|
| Blightbane enemies | `https://blightbane.io/monster/{Name}` | JS-rendered, needs agent-browser |
| Blightbane events  | `https://blightbane.io/event/{Name}`   | JS-rendered, needs agent-browser |
| Blightbane cards   | `https://blightbane.io/card/{Name}`    | JS-rendered, needs agent-browser |
| Blightbane talents | `https://blightbane.io/talents`        | JS-rendered, needs agent-browser |
| Fandom wiki        | `https://dawncasterrpg.fandom.com/wiki/{Page}` | Static, curl works |
| Dawn-Dash maps     | `https://www.dawn-dash.com/eventmaps`  | For area encounter pools |

URL names use the in-game name with spaces replaced by `%20` or `-` depending on
the site. Try both if the first 404s.

---

## Using agent-browser

Chrome for Testing cannot be downloaded in this remote environment (network
allowlist blocks `googlechromelabs.github.io`). Use the pre-installed Playwright
Chromium instead:

```bash
export AGENT_BROWSER_EXECUTABLE_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome

# Core fetch loop for a JS-rendered page
agent-browser open "https://blightbane.io/monster/Matriarch%20Daisy"
agent-browser wait --load networkidle
agent-browser snapshot          # full DOM text
agent-browser close
```

Always `close` after each fetch so the next open starts clean.

If a page shows a blank/loading screen after `wait --load networkidle`, try:
```bash
agent-browser wait --selector ".card-title"   # or any content selector
agent-browser snapshot
```

---

## JSON Schema

### Enemy (`data/enemies/{slug}.json`)
```json
{
  "name": "Matriarch Daisy",
  "slug": "matriarch-daisy",
  "hp": 54,
  "type": ["Beast"],
  "expansion": "Synthesis",
  "abilities": [
    { "name": "Ability Name", "effect": "description", "value": null }
  ],
  "drops": ["card or item name"],
  "notes": "free-text strategy notes",
  "source": "blightbane.io",
  "fetched_at": "YYYY-MM-DD"
}
```

### Event (`data/events/{slug}.json`)
```json
{
  "name": "Wounded Animal",
  "slug": "wounded-animal",
  "choices": [
    { "option": "Heal with potion", "outcome": "Gain Compassionate talent" },
    { "option": "Leave it",         "outcome": "Nothing" }
  ],
  "notes": "",
  "source": "blightbane.io",
  "fetched_at": "YYYY-MM-DD"
}
```

### Card (`data/cards/{slug}.json`)
```json
{
  "name": "Stormbolt",
  "slug": "stormbolt",
  "cost": "1 blue",
  "type": "Magic Action",
  "keywords": ["Chain"],
  "effect": "Deal X damage where X = Magic Actions played this turn.",
  "upgraded_effect": "",
  "class": "Arcanist",
  "source": "blightbane.io",
  "fetched_at": "YYYY-MM-DD"
}
```

---

## Workflow for Each Session

1. **User pastes or describes what happened** → update `run.md` immediately.
2. **Look up unknowns** → check `data/` cache first; if missing, fetch with
   agent-browser and save the JSON before answering.
3. **Answer the strategic question** using the fetched data + current run state.
4. **Commit** with a message like `dawncaster: Canto 3 update — defeated Crimson Collector, levelled up`.

Do not wait for the user to ask for a commit — push after every meaningful update.

---

## Current Run Snapshot (as of 2026-05-24)

- **Class:** Arcanist — Intellect build (2 blue energy/turn)
- **Weapon:** Forcewand — heals per Magic Action in deck; chain synergy
- **Canto:** 3 (Brightcandle area / Eastern Blightwoods)
- **HP:** 54/70 | **Gold:** 4g | **Potions:** 0
- **Key talent:** Arcane Mastery — every new non-unique Magic Action adds a free
  0-cost base copy; doubles value of each future Magic Action pickup
- **Quest:** Consul Evelaine's Bandit Quest — 4/5 bandits defeated; Garvin
  Greaves (boss) still pending; 50g reward on return in Canto 4
- **Next decision:** fight second Crimson Collector (52 HP) or skip toward
  Garvin Greaves; also Matriarch Daisy (54 HP, unknown abilities) still on map

See `run.md` for full deck list, full log, and all open questions.
