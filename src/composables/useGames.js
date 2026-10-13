import { ref, computed } from 'vue'
import { isRated } from '../utils/score.js'

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
    // The new game becomes the featured hero, like add-game.js
    const featuredGame = { ...newGame, featured: true }
    allGames.value = allGames.value.map(({ featured, ...rest }) => rest)
    allGames.value.unshift(normalizePlatform(featuredGame))
    const extraGames = readLocalGames().map(({ featured, ...rest }) => rest)
    extraGames.unshift(featuredGame)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(extraGames))
  }

  const availablePlatforms = computed(() => {
    const set = new Set()
    allGames.value.forEach(g => {
      if (g.platform) set.add(g.platform.trim())
    })
    return Array.from(set).sort()
  })

  // Featured game for the hero: the entry with `featured: true`,
  // falling back to the first entry in the list
  const latestGame = computed(() =>
    allGames.value.find(g => g.featured === true) || allGames.value[0] || null
  )

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

    // Always by score, highest first; unrated games last; ties by title A–Z
    list.sort((a, b) => {
      const byRated = Number(isRated(b.score)) - Number(isRated(a.score))
      if (byRated) return byRated
      const byScore = (Number(b.score) || 0) - (Number(a.score) || 0)
      if (byScore) return byScore
      return (a.title || '').localeCompare(b.title || '')
    })

    return list
  })

  return {
    allGames,
    loading,
    error,
    searchQuery,
    selectedPlatform,
    availablePlatforms,
    latestGame,
    processedGames,
    fetchGames,
    addGame
  }
}
