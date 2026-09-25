import { ref, computed } from 'vue'

const STORAGE_KEY = 'local_custom_games'

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
        throw new Error(`Error al cargar games.json (HTTP ${res.status})`)
      }
      const baseData = await res.json()

      // Merge games added in-browser: unique by id
      const existingIds = new Set(baseData.map(g => g.id))
      const uniqueExtras = readLocalGames().filter(g => !existingIds.has(g.id))

      allGames.value = [...uniqueExtras, ...baseData]
    } catch (err) {
      console.error('Error fetching games:', err)
      error.value = 'No se pudieron cargar los juegos. Por favor verifica public/games.json.'
    } finally {
      loading.value = false
    }
  }

  function addGame(newGame) {
    allGames.value.unshift(newGame)
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
    processedGames,
    fetchGames,
    addGame
  }
}
