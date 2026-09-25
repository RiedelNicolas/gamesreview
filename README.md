# Game Tracker

A single-page log of the video games I've finished: hours played, platform, completion date and a score from 1 to 100. Built with Vue 3 and Vite, no backend.

## Running it

```bash
npm install
npm run dev      # local dev server, usually http://localhost:5173
npm run build    # static build in dist/
npm run preview  # serve the build locally
```

## What it does

- Shows the most recently finished game as a feature at the top, then every game as a cover grid.
- Header line with the total number of games, total hours and the average score (unrated games are left out of the average).
- Filter by platform, search by title, platform or genre, and sort by date, score, hours or title.
- "Add game" opens a form that saves the game in the browser's `localStorage` (key `local_custom_games`). Those games are merged with `public/games.json` by `id` on every load. They are not written back to the JSON file.

## Data

Games live in [`public/games.json`](public/games.json):

```json
{
  "id": "hades",
  "title": "Hades",
  "platform": "Nintendo Switch",
  "genre": "Roguelike / Action",
  "coverUrl": "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/cob9kr.webp",
  "artwork": "https://images.igdb.com/igdb/image/upload/t_1080p/ar3m4s.webp",
  "hoursToFinish": 11,
  "score": 0,
  "status": "completed",
  "dateCompleted": "2026-03-12"
}
```

- `score` of `0` means the game hasn't been rated yet; it shows as "Unrated".
- `coverUrl` is a portrait cover (3:4). IGDB covers work well: `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/<image_id>.webp`.
- `artwork` is optional: a landscape image (key art or screenshot) shown when the game is the featured one at the top. Without it the cover is used. IGDB: `https://images.igdb.com/igdb/image/upload/t_1080p/<image_id>.webp`.
- Keep platform names consistent (for example always "Nintendo Switch 2"), since each distinct name becomes a filter tab.

Score labels, from `src/utils/score.js`: 90–100 Masterpiece, 75–89 Great, 50–74 Decent, 25–49 Mediocre, below 25 Flawed.

To append a game from the command line there is a helper used by the `add-game` agent skill:

```bash
node .agents/skills/add-game/scripts/add-game.js '{"title": "Hades", "platform": "Nintendo Switch", "score": 90, "hoursToFinish": 11}'
```

## Code layout

- `src/composables/useGames.js`: loading, merging with `localStorage`, filtering and sorting.
- `src/utils/score.js`: score thresholds, labels and colors.
- `src/components/`: masthead, hero, toolbar, grid, card and the add-game modal.
- `src/style.css`: design tokens (colors, type, spacing).
