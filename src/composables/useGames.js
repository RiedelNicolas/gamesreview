import { ref, computed } from 'vue'
import { isRated } from '../utils/score.js'
import { parseLocalDate } from '../utils/format.js'

const STORAGE_KEY = 'local_custom_games'

// Legacy platform names mapped to the names used in games.json.
// Applied when games are loaded; stored data is left as is.
const PLATFORM_ALIASES = {
  'Switch 2': 'Nintendo Switch 2'
}

function normalizePlatform(game) {
  const platform = typeof game.platform === 'string' ? game.platform.trim() : ''
  return Object.hasOwn(PLATFORM_ALIASES, platform)
    ? { ...game, platform: PLATFORM_ALIASES[platform] }
    : game
}

function readLocalGames() {
  const local = localStorage.getItem(STORAGE_KEY)
  if (!local) return []
  try {
    return JSON.parse(local)
  } catch (e) {
    console.error('Error parsing local_custom_games', e)
    return []
  }
}

export function useGames() {
  const allGames = ref([])
  const loading = ref(true)
  const error = ref(null)

  const searchQuery = ref('')
  const sortBy = ref('date-desc')
  const selectedPlatform = ref('')

  async function fetchGames() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch('./games.json')
      if (!res.ok) {
        throw new Error(`Failed to load games.json (HTTP ${res.status})`)
      }
      const baseData = await res.json()

      // Merge games added in-browser: unique by id
      const existingIds = new Set(baseData.map(g => g.id))
      const uniqueExtras = readLocalGames().filter(g => !existingIds.has(g.id))

      allGames.value = [...uniqueExtras, ...baseData].map(normalizePlatform)
    } catch (err) {
      console.error('Error fetching games:', err)
      error.value = 'Could not load games. Check public/games.json.'
    } finally {
      loading.value = false
    }
  }

  function addGame(newGame) {
    allGames.value.unshift(normalizePlatform(newGame))
    const extraGames = readLocalGames()
    extraGames.unshift(newGame)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(extraGames))
  }

  const availablePlatforms = computed(() => {
    const set = new Set()
    allGames.value.forEach(g => {
      if (g.platform) set.add(g.platform.trim())
    })
    return Array.from(set).sort()
  })

  // Most recently played game, by completion date; invalid dates are ignored
  const latestGame = computed(() => {
    let latest = null
    let latestTime = -Infinity
    for (const g of allGames.value) {
      const date = parseLocalDate(g.dateCompleted)
      if (date && date.getTime() > latestTime) {
        latest = g
        latestTime = date.getTime()
      }
    }
    return latest
  })

  const processedGames = computed(() => {
    let list = [...allGames.value]

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      list = list.filter(g =>
        (g.title && g.title.toLowerCase().includes(q)) ||
        (g.platform && g.platform.toLowerCase().includes(q)) ||
        (g.genre && g.genre.toLowerCase().includes(q))
      )
    }

    if (selectedPlatform.value) {
      list = list.filter(g => g.platform && g.platform.trim() === selectedPlatform.value)
    }

    list.sort((a, b) => {
      // Unrated games go last when sorting by score, in either direction
      if (sortBy.value === 'score-desc' || sortBy.value === 'score-asc') {
        const byRated = Number(isRated(b.score)) - Number(isRated(a.score))
        if (byRated) return byRated
      }
      switch (sortBy.value) {
        case 'date-desc':
          return (b.dateCompleted || '').localeCompare(a.dateCompleted || '')
        case 'date-asc':
          return (a.dateCompleted || '').localeCompare(b.dateCompleted || '')
        case 'score-desc':
          return (Number(b.score) || 0) - (Number(a.score) || 0)
        case 'score-asc':
          return (Number(a.score) || 0) - (Number(b.score) || 0)
        case 'hours-desc':
          return (Number(b.hoursToFinish) || 0) - (Number(a.hoursToFinish) || 0)
        case 'hours-asc':
          return (Number(a.hoursToFinish) || 0) - (Number(b.hoursToFinish) || 0)
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '')
        default:
          return 0
      }
    })

    return list
  })

  return {
    allGames,
    loading,
    error,
    searchQuery,
    sortBy,
    selectedPlatform,
    availablePlatforms,
    latestGame,
    processedGames,
    fetchGames,
    addGame
  }
}
