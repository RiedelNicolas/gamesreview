#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../../..')
const gamesJsonPath = path.join(rootDir, 'public/games.json')

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

// Today's date as YYYY-MM-DD in the local time zone (toISOString would give UTC)
function todayLocal() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function main() {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.error('Usage: node add-game.js \'{"title": "...", "score": 90, "hoursToFinish": 30, "artwork": "https://... (optional)"}\'')
    process.exit(1)
  }

  let gameData
  try {
    gameData = JSON.parse(args[0])
  } catch (err) {
    console.error('Error parsing input JSON:', err.message)
    process.exit(1)
  }

  if (!gameData.title) {
    console.error('Missing required field: title')
    process.exit(1)
  }

  if (gameData.score === undefined || gameData.score < 0 || gameData.score > 100) {
    console.error('Score must be a number between 0 and 100')
    process.exit(1)
  }

  if (!fs.existsSync(gamesJsonPath)) {
    console.error(`games.json not found at ${gamesJsonPath}`)
    process.exit(1)
  }

  const raw = fs.readFileSync(gamesJsonPath, 'utf8')
  let games = []
  try {
    games = JSON.parse(raw)
  } catch (err) {
    console.error('Error parsing public/games.json:', err.message)
    process.exit(1)
  }

  const newEntry = {
    id: gameData.id || slugify(gameData.title),
    title: gameData.title.trim(),
    platform: gameData.platform || 'PC',
    genre: gameData.genre || 'General',
    coverUrl: gameData.coverUrl || 'https://images.igdb.com/igdb/image/upload/t_cover_big/nocover.webp',
    ...(gameData.artwork ? { artwork: gameData.artwork } : {}),
    hoursToFinish: Number(gameData.hoursToFinish) || 0,
    score: Number(gameData.score),
    status: gameData.status || 'completed',
    dateCompleted: gameData.dateCompleted || todayLocal()
  }

  // Check if game already exists by id
  const existingIdx = games.findIndex(g => g.id === newEntry.id)
  if (existingIdx !== -1) {
    games[existingIdx] = { ...games[existingIdx], ...newEntry }
    console.log(`Updated existing game: "${newEntry.title}" (id: ${newEntry.id})`)
  } else {
    // Prepend so the newest game appears first
    games.unshift(newEntry)
    console.log(`Added new game: "${newEntry.title}" (id: ${newEntry.id})`)
  }

  fs.writeFileSync(gamesJsonPath, JSON.stringify(games, null, 2) + '\n', 'utf8')
  console.log(`Successfully saved to public/games.json! Total games: ${games.length}`)
}

main()
