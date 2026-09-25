---
name: add-game
description: >-
  Use this skill when the user wants to log, add, or register a new video game into public/games.json.
  Covers gathering game metadata (title, platform, genre, score 1-100, hours, date, cover URL, optional artwork URL) without requiring reviews.
---

# Add Game Skill

Use this workflow whenever the user wants to add or update a video game in their personal games tracker.

## Data Schema Reference

Every entry in `public/games.json` has the following structure:

```json
{
  "id": "game-title-slug",
  "title": "Full Game Title",
  "platform": "Nintendo Switch 2 / Nintendo Switch / PC / PS5 / Xbox Series X / etc.",
  "genre": "Action RPG / Roguelike / Platformer / etc.",
  "coverUrl": "https://...",
  "artwork": "https://... (optional)",
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
1. **IGDB**: High quality covers at `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/<IMAGE_ID>.webp`
2. **Steam Library Art**: `https://cdn.cloudflare.steamstatic.com/steam/apps/<APP_ID>/library_600x900_2x.jpg`
3. **Steam Header**: `https://cdn.cloudflare.steamstatic.com/steam/apps/<APP_ID>/header.jpg`
4. **SteamGridDB / IMDb / Direct URL**: Any stable web image link.

Always open the image and check it shows the right game before saving it.

### Sourcing Artwork URLs (optional)
`artwork` is a landscape image (key art or a screenshot, roughly 16:9) used when the game is the featured "latest played" entry. If it is missing, the cover is used instead.
1. **IGDB artwork**: `https://images.igdb.com/igdb/image/upload/t_1080p/<ARTWORK_ID>.webp` (artwork ids start with `ar`)
2. **IGDB screenshot**: `https://images.igdb.com/igdb/image/upload/t_1080p/<SCREENSHOT_ID>.webp` (ids usually start with `sc`)

---

## Workflow Steps

### Step 1: Collect Missing Details
If the user didn't supply all details, ask for the missing ones:
- **Title**: Exact name of the game.
- **Platform**: e.g., Nintendo Switch 2, Nintendo Switch, PC, PS5, Xbox Series X, etc. Reuse the exact name already in `games.json` (each distinct name becomes its own filter tab).
- **Hours to Finish**: Approximate playtime.
- **Score**: Number from 1 to 100.
- **Genre**: e.g., Action RPG, Roguelike, Platformer, etc. (optional/suggest based on game).
- **Completion Date**: Default to today's date (`YYYY-MM-DD`) if not specified.
- **Cover Image**: Direct image URL (offer to find one if needed).
- **Artwork** (optional): Landscape image URL for the featured spot.

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
