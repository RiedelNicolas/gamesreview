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
import { ref, onMounted } from 'vue'
import HeaderStats from './components/HeaderStats.vue'
import SortControls from './components/SortControls.vue'
import GameGrid from './components/GameGrid.vue'
import AddGameModal from './components/AddGameModal.vue'
import { useGames } from './composables/useGames.js'

const {
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
} = useGames()

const showAddModal = ref(false)
const toastMessage = ref('')

function handleAddGame(newGame) {
  addGame(newGame)

  // Show confirmation toast
  toastMessage.value = `¡"${newGame.title}" (${newGame.platform}) agregado con éxito!`
  setTimeout(() => {
    toastMessage.value = ''
  }, 4000)
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
