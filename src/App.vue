<template>
  <div class="app-shell">
    <div class="main-wrapper">
      <!-- Top header -->
      <HeaderStats :games="allGames" />

      <!-- Filter / Sort Bar -->
      <SortControls 
        v-model:searchQuery="searchQuery" 
        v-model:sortBy="sortBy" 
      />

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading game reviews...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <span class="error-icon">⚠️</span>
        <p>{{ error }}</p>
        <button class="retry-btn" @click="fetchGames">Try Again</button>
      </div>

      <!-- Main Game Grid -->
      <GameGrid 
        v-else
        :games="processedGames" 
        @select-game="openModal" 
      />

      <!-- Clean footer -->
      <footer class="app-footer">
        <p>© Nicolás Riedel • Games Review</p>
      </footer>
    </div>

    <!-- Review Modal -->
    <ReviewModal 
      :game="selectedGame" 
      @close="closeModal" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import HeaderStats from './components/HeaderStats.vue'
import SortControls from './components/SortControls.vue'
import GameGrid from './components/GameGrid.vue'
import ReviewModal from './components/ReviewModal.vue'

const allGames = ref([])
const loading = ref(true)
const error = ref(null)

const searchQuery = ref('')
const sortBy = ref('date-desc')
const selectedGame = ref(null)

async function fetchGames() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch('./games.json')
    if (!res.ok) {
      throw new Error(`Failed to load games.json (HTTP ${res.status})`)
    }
    const data = await res.json()
    allGames.value = data
  } catch (err) {
    console.error('Error fetching games:', err)
    error.value = 'Could not load your game reviews. Please check public/games.json.'
  } finally {
    loading.value = false
  }
}

const processedGames = computed(() => {
  let list = [...allGames.value]

  // Filter
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

function openModal(game) {
  selectedGame.value = game
}

function closeModal() {
  selectedGame.value = null
}

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
