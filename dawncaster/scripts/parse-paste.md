# How to Feed Blightbane Data to Claude

The remote execution environment blocks blightbane.io, dawn-dash.com, and
fandom.  To get enemy/event data into the JSON cache, paste the page text here
and ask Claude to extract and save it.

## Steps

1. Open the blightbane page in your own browser (phone or PC).
2. Select all text on the page (Ctrl+A → Ctrl+C, or long-press → Select All).
3. Paste it into your message to Claude like this:

```
Here is the blightbane page for Matriarch Daisy:

[paste]
```

Claude will parse it and write the JSON to `data/enemies/matriarch-daisy.json`
(or the appropriate subfolder).

## Pages needed right now

| Priority | URL | Purpose |
|----------|-----|---------|
| 🔴 High | https://blightbane.io/monster/Matriarch%20Daisy | Next fight decision |
| 🔴 High | https://blightbane.io/monster/Garvin%20Greaves  | Quest boss |
| 🟡 Med  | https://blightbane.io/monster/Crimson%20Collector | 2nd spawn decision |
| 🟡 Med  | https://blightbane.io/card/Forcewand            | Weapon mechanics |
| 🟢 Low  | https://dawncasterrpg.fandom.com/wiki/Shrines   | Canto 4 shrine prep |
| 🟢 Low  | https://www.dawn-dash.com/eventmaps             | Remaining encounters |
