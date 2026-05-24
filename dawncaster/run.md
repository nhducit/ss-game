# Dawncaster Run — Arcanist (Canto 3)

## Quick Status

| Field    | Value                                        |
|----------|----------------------------------------------|
| HP       | 54 / 70 (~77%)                               |
| Gold     | 4g                                           |
| Potions  | 0                                            |
| Level    | 2+ (just levelled up, Arcane Mastery picked) |
| Weapon   | Forcewand — heals per Magic Action in deck   |
| Energy   | 2 blue / turn (2 Intellect)                  |

---

## Deck

| Card | Copies | Cost | Notes |
|------|--------|------|-------|
| Fireball | 2 | 1 gray (upgraded) / base | One upgraded to 9 dmg, gray cost |
| Cryolance | 1 | — | Channeled ice, scales with Intellect |
| Electroflare | 1 | — | Lightning + Shock debuff, generates chain |
| Stormbolt | 2 | 1 blue / **0** (free) | 2nd copy is free via Arcane Mastery. Dmg = Magic Actions played this turn. Chain. |
| Call the Storm | 2 | — | AoE lightning, scales with Intellect |
| Mindblast | 2 | — | Gain 1 Focus; deal 2× Focus dmg |
| ~~Basic Attack~~ | 0 | — | Both removed (Blacksmith + Campsite) |

> **Arcane Mastery note:** every future non-unique Magic Action pickup also adds
> a free 0-cost base copy. Doubles the value of each card reward choice.

---

## Talents

- **Conjurer** — +2 damage to conjured cards (stackable)
- **Compassionate** — healing effects heal +1 HP (gained: Wounded Animal event)
- **Arcane Mastery** — whenever you add a non-unique Magic Action to your deck,
  also add a base copy that costs 0 energy (level-up talent pick)

---

## Quests

| Quest | Status | Reward |
|-------|--------|--------|
| Consul Evelaine's Bandit Quest (Brightcandle C2) | 4/5 done — Garvin Greaves pending | 50g on return in Canto 4; +50g if bandits surrender |

**Bandits defeated:** Bandit Looter (42), Crimson Tracker (26), Crimson
Bloodhound (32), Crimson Collector (52).

---

## Allies

| Ally | How recruited | When returns |
|------|---------------|--------------|
| Julian Bellthorp (merchant) | Freed at Talking Tree (Canto 3) | This run + Brightcandle Canto 4 |

---

## Run Log (newest first)

| # | Node | Outcome |
|---|------|---------|
| 20 | **Level-up** | Picked Arcane Mastery talent |
| 19 | **Crimson Collector (52)** | Defeated. Picked Mindblast (+ free copy). Level-up triggered. |
| 18 | **Crimson Bloodhound (32)** | Defeated. Picked Mindblast. |
| 17 | **Crimson Tracker (26)** | Defeated. Picked Stormbolt (+ free copy via Arcane Mastery? — pre-talent, check). |
| 16 | **Bandit Looter (42)** | Defeated. Picked Call the Storm. |
| 15 | **Wounded Animal** | Used Healing Potion → gained **Compassionate** talent. |
| 14 | **Alchemist (in-area)** | Bought Healing Potion (20g). |
| 13 | **Julian Bellthorp's shop** | Browsed, no purchase. |
| 12 | **Talking Tree** | Freed Julian Bellthorp. |
| 11 | **Alchemic Table** | Red potion → Healing Potion. |
| 10 | **Campsite #2** | Heal (Compassionate gave +1 — wait, talent not yet? verify order). |
| 9  | **Campsite #1** | Removed a card. |
| 8  | **Shrine of Radiance** | "Infuse the energy of a card" → Fireball upgraded to 9 dmg, gray cost. |
| 7  | **Shrine (purple — sacrifice)** | Sacrificed basic attack → got another basic attack (bad outcome). |
| 6  | **Strange Carvings** | Followed once → unlocked Bandit Camp path. |
| 5  | **Fortress Gates** | Passed through to Canto 3. |
| 4  | **Inn (Brightcandle C2)** | Healed 20% for 20g. |
| 3  | **Blacksmith (Brightcandle C2)** | Removed 1 basic attack for 30g. |
| 2  | **Consul Evelaine (Brightcandle C2)** | Accepted Bandit Quest (free). |
| 1  | **Start** | Arcanist, Forcewand, 2 Intellect. |

---

## Current Options

- **Blacksmith** — 4g on hand; can't afford anything useful. Skip.
- **Crimson Collector (52)** — second spawn. Gold + quest? But quest already
  complete for bandits; this one doesn't count toward Garvin. Decide: fight or skip.
- **Matriarch Daisy (54)** — unknown abilities, not a bandit, skipped multiple
  times. Needs blightbane lookup before committing. ⚠️

---

## Build Notes

**Direction:** Intellect-based burst/AoE with chain + Magic Action synergies.

**Core loops:**
1. Stormbolt scales with Magic Actions played → play free copies first to pump its damage.
2. Arcane Mastery doubles deck density on every future Magic Action pickup.
3. Forcewand heals per Magic Action in deck → more Magic Actions = more sustain.
4. Compassionate gives +1 to all healing → stacks with Forcewand.
5. Mindblast × 2 = reliable Focus stacking for burst.

**Avoid:** Holy, Frozen, Burn synergy cards — nothing in the current deck supports them.

**Wants next:** more Magic Actions (especially ones with useful effects), possibly
a defensive card or two if sustain is lacking vs the Garvin Greaves boss fight.

---

## Open Questions

- [ ] **Matriarch Daisy (54 HP)** — abilities, attack pattern, expansion (likely Synthesis). Fetch from blightbane.
- [ ] **Crimson Collector** — full ability deck and drops for the second spawn.
- [ ] **Garvin Greaves** — HP, "Outlaw Alchemy" mechanic, attack pattern, recommended strategy.
- [ ] **Forcewand** — exact chain mechanics and healing formula.
- [ ] **Shrines** — full name→effect map for colour-only previews in Canto 4.
- [ ] **Julian Bellthorp stock refresh cost** — pricing details.
- [ ] **Eastern Blightwoods encounter pool** — remaining nodes available.

---

## Reference Sites

| Resource | URL |
|----------|-----|
| Blightbane (JS) | `https://blightbane.io/monster/{Name}` |
| Blightbane events | `https://blightbane.io/event/{Name}` |
| Blightbane cards | `https://blightbane.io/card/{Name}` |
| Blightbane talents | `https://blightbane.io/talents` |
| Fandom wiki | `https://dawncasterrpg.fandom.com/wiki/{Page}` |
| Shrines list | `https://dawncasterrpg.fandom.com/wiki/Shrines` |
| Dawn-Dash maps | `https://www.dawn-dash.com/eventmaps` |
