---
name: add-game
description: >-
  Use this skill when the user wants to log, add, or register a new video game into public/games.json.
  Covers gathering game metadata (title, platform, genre, score 1-100, hours, date, cover URL) without requiring reviews.
---

# Add Game Skill

Use this workflow whenever the user wants to add or update a video game in their personal games tracker.

## Data Schema Reference

Every entry in `public/games.json` has the following structure:

```json
{
  "id": "game-title-slug",
  "title": "Full Game Title",
  "platform": "Switch 2 / PC / Nintendo Switch / PS5 / Xbox Series X / etc.",
  "genre": "Action RPG / Roguelike / Platformer / etc.",
  "coverUrl": "https://...",
  "hoursToFinish": 45,
  "score": 92,
  "status": "completed",
  "dateCompleted": "YYYY-MM-DD"
}
```

### Score Ranges (1–100 Critic Scale)
- **90–100**: 🟢 Masterpiece
- **75–89**: 🔵 Great
- **50–74**: 🟡 Decent
- **25–49**: 🟠 Mediocre
- **0–24**: 🔴 Flawed

### Sourcing Cover Art URLs
1. **IGDB**: High quality covers at `https://images.igdb.com/igdb/image/upload/t_cover_big/<IMAGE_ID>.webp`
2. **Steam Library Art**: `https://cdn.cloudflare.steamstatic.com/steam/apps/<APP_ID>/library_600x900_2x.jpg`
3. **Steam Header**: `https://cdn.cloudflare.steamstatic.com/steam/apps/<APP_ID>/header.jpg`
4. **SteamGridDB / IMDb / Direct URL**: Any stable web image link.

---

## Workflow Steps

### Step 1: Collect Missing Details
If the user didn't supply all details, ask for the missing ones:
- **Title**: Exact name of the game.
- **Platform**: e.g., Switch 2, PC, Nintendo Switch, PS5, Xbox Series X, etc.
- **Hours to Finish**: Approximate playtime.
- **Score**: Number from 1 to 100.
- **Genre**: e.g., Action RPG, Roguelike, Platformer, etc. (optional/suggest based on game).
- **Completion Date**: Default to today's date (`YYYY-MM-DD`) if not specified.
- **Cover Image**: Direct image URL (offer to find one if needed).

### Step 2: Register Game Entry
You can either:
1. Run the helper script:
   ```bash
   node .agents/skills/add-game/scripts/add-game.js '{"title": "...", "score": 90, "hoursToFinish": 30, ...}'
   ```
2. Or prepend the object directly to [`public/games.json`](file:///home/riedel/orca/gamesreview/public/games.json).

### Step 3: Verify & Test
Run a quick build check:
```bash
npm run build
```

### Step 4: Confirm with User
Show the summary of the added game and ask if they would like you to commit and push the update to GitHub.
