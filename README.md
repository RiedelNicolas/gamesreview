# 🎮 Video Games Review Log

A personal, lightweight frontend page to track and review video games you've played, their completion times, critic scores (1–100), and short personal analysis.

Rendered entirely in the frontend from a simple `public/games.json` file.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```

Then open the local URL (usually `http://localhost:5173`) in your browser.

### 3. Build for production / GitHub Pages
```bash
npm run build
```
The compiled static assets will be in `dist/`.

---

## 📝 How to Add / Edit Games

Open [`public/games.json`](public/games.json) and add or modify entries:

```json
{
  "id": "game-slug",
  "title": "Game Title",
  "platform": "PC / PS5 / Switch / Xbox",
  "genre": "Action RPG",
  "coverUrl": "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.webp",
  "hoursToFinish": 85,
  "score": 95,
  "status": "completed",
  "dateCompleted": "2024-08-15",
  "review": "Your detailed personal review or analysis goes here..."
}
```

### Finding Game Cover Images
You can use any direct image URL. Good sources include:
- **[IGDB](https://www.igdb.com)**: Search for a game, open image in new tab. URL pattern: `https://images.igdb.com/igdb/image/upload/t_cover_big/<ID>.webp`
- **[SteamGridDB](https://www.steamgriddb.com)**: High-resolution community game artwork and posters.
- **[Steam Store](https://store.steampowered.com)**: Right-click on header images / capsules.
- **IMDb** or Wikipedia image URLs.

---

## 🌟 Features

- **Critic-Style 1–100 Scoring**:
  - `90–100`: 🟢 Masterpiece (Emerald)
  - `75–89`: 🔵 Great (Cyan)
  - `50–74`: 🟡 Decent (Yellow)
  - `25–49`: 🟠 Mediocre (Orange)
  - `0–24`: 🔴 Flawed (Red)
- **Automatic Summary Statistics**:
  - Total games reviewed
  - Total hours invested
  - Average critic score
  - Number of masterpieces (90+)
- **Interactive Review Modal**: Click on any card or "Read Analysis" to view full writeups and metadata.
- **Search & Sort**:
  - Live filtering by title, genre, or platform
  - Sort by date completed, score, or completion time
- **Zero Backend**: All data lives in `public/games.json`.
