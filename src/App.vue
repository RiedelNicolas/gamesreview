<template>
  <div class="app-shell">
    <div class="main-wrapper">
      <!-- Top header with stats -->
      <HeaderStats :games="allGames" />

      <!-- Filter / Sort Bar / Platform Bar / Add Game -->
      <SortControls 
        v-model:searchQuery="searchQuery" 
        v-model:sortBy="sortBy"
        v-model:selectedPlatform="selectedPlatform"
        :platforms="availablePlatforms"
        @open-add="showAddModal = true"
      />

      <!-- Toast Notification -->
      <Transition name="toast">
        <div v-if="toastMessage" class="toast-notification">
          <span>✨ {{ toastMessage }}</span>
        </div>
      </Transition>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando juegos...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <span class="error-icon">⚠️</span>
        <p>{{ error }}</p>
        <button class="retry-btn" @click="fetchGames">Reintentar</button>
      </div>

      <!-- Main Game Grid -->
      <GameGrid 
        v-else
        :games="processedGames" 
      />

      <!-- Clean footer -->
      <footer class="app-footer">
        <p>© Nicolás Riedel • Games Tracker</p>
      </footer>
    </div>

    <!-- Add Game Modal with Platform Field (Switch 2, PC, etc.) -->
    <AddGameModal 
      :show="showAddModal" 
      @close="showAddModal = false"
      @add="handleAddGame"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import HeaderStats from './components/HeaderStats.vue'
import SortControls from './components/SortControls.vue'
import GameGrid from './components/GameGrid.vue'
import AddGameModal from './components/AddGameModal.vue'

const allGames = ref([])
const loading = ref(true)
const error = ref(null)

const searchQuery = ref('')
const sortBy = ref('date-desc')
const selectedPlatform = ref('')
const showAddModal = ref(false)
const toastMessage = ref('')

async function fetchGames() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch('./games.json')
    if (!res.ok) {
      throw new Error(`Error al cargar games.json (HTTP ${res.status})`)
    }
    const baseData = await res.json()
    
    // Check localStorage for any games added in-browser
    const local = localStorage.getItem('local_custom_games')
    let extraGames = []
    if (local) {
      try {
        extraGames = JSON.parse(local)
      } catch (e) {
        console.error('Error parsing local_custom_games', e)
      }
    }

    // Merge: unique by id
    const existingIds = new Set(baseData.map(g => g.id))
    const uniqueExtras = extraGames.filter(g => !existingIds.has(g.id))

    allGames.value = [...uniqueExtras, ...baseData]
  } catch (err) {
    console.error('Error fetching games:', err)
    error.value = 'No se pudieron cargar los juegos. Por favor verifica public/games.json.'
  } finally {
    loading.value = false
  }
}

function handleAddGame(newGame) {
  // Add to top of list
  allGames.value.unshift(newGame)

  // Persist to localStorage
  const local = localStorage.getItem('local_custom_games')
  let extraGames = []
  if (local) {
    try {
      extraGames = JSON.parse(local)
    } catch {}
  }
  extraGames.unshift(newGame)
  localStorage.setItem('local_custom_games', JSON.stringify(extraGames))

  // Show confirmation toast
  toastMessage.value = `¡"${newGame.title}" (${newGame.platform}) agregado con éxito!`
  setTimeout(() => {
    toastMessage.value = ''
  }, 4000)
}

const availablePlatforms = computed(() => {
  const set = new Set()
  allGames.value.forEach(g => {
    if (g.platform) {
      set.add(g.platform.trim())
    }
  })
  return Array.from(set).sort()
})

const processedGames = computed(() => {
  let list = [...allGames.value]

  // Filter by search query
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(g => {
      return (
        (g.title && g.title.toLowerCase().includes(q)) ||
        (g.platform && g.platform.toLowerCase().includes(q)) ||
        (g.genre && g.genre.toLowerCase().includes(q))
      )
    })
  }

  // Filter by platform
  if (selectedPlatform.value) {
    list = list.filter(g => g.platform && g.platform.trim() === selectedPlatform.value)
  }

  // Sort
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

onMounted(() => {
  fetchGames()
})
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-wrapper {
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;
  padding: 0 24px 60px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

/* Toast */
.toast-notification {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #10b981;
  color: #042f2e;
  font-weight: 700;
  font-size: 0.88rem;
  padding: 12px 20px;
  border-radius: var(--radius-md);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  z-index: 2000;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.95);
}

/* States */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--accent-cyan);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  font-size: 2.5rem;
}

.retry-btn {
  background: var(--accent-cyan);
  color: #0b0d13;
  padding: 8px 18px;
  font-weight: 600;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
}

.retry-btn:hover {
  background: #7dd3fc;
}

/* Footer */
.app-footer {
  margin-top: 60px;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.82rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 24px;
}
</style>
