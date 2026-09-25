<template>
  <div class="page">
    <HeaderStats :games="allGames" @open-add="showAddModal = true" />

    <p v-if="loading" class="state">Cargando juegos...</p>

    <div v-else-if="error" class="state">
      <p>{{ error }}</p>
      <button class="retry-btn" @click="fetchGames">Reintentar</button>
    </div>

    <template v-else>
      <HeroFeature v-if="latestGame" :game="latestGame" />

      <SortControls
        v-model:searchQuery="searchQuery"
        v-model:sortBy="sortBy"
        v-model:selectedPlatform="selectedPlatform"
        :platforms="availablePlatforms"
      />

      <GameGrid :games="processedGames" />
    </template>

    <footer class="app-footer">
      <p>© Nicolás Riedel · Game Tracker</p>
    </footer>

    <Transition name="toast">
      <div v-if="toastMessage" class="toast" role="status">{{ toastMessage }}</div>
    </Transition>

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
import HeroFeature from './components/HeroFeature.vue'
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
  latestGame,
  processedGames,
  fetchGames,
  addGame
} = useGames()

const showAddModal = ref(false)
const toastMessage = ref('')

function handleAddGame(newGame) {
  addGame(newGame)

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
.page {
  max-width: var(--page-width);
  margin: 0 auto;
  padding: 0 var(--page-gutter) var(--space-7);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.state {
  padding: var(--space-9) 0;
  text-align: center;
  color: var(--ink-soft);
}

.retry-btn {
  margin-top: var(--space-3);
  font-weight: 500;
  color: var(--ink);
  border-bottom: 1px solid var(--ink);
}

.retry-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
}

.app-footer {
  margin-top: auto;
  padding-top: var(--space-8);
}

.app-footer p {
  border-top: 1px solid var(--rule);
  padding-top: var(--space-4);
  font-size: var(--text-xs);
  color: var(--ink-muted);
}

.toast {
  position: fixed;
  bottom: var(--space-5);
  left: 50%;
  transform: translateX(-50%);
  max-width: calc(100vw - 2 * var(--space-4));
  background: var(--ink);
  color: var(--paper);
  font-size: var(--text-sm);
  padding: var(--space-3) var(--space-5);
  z-index: 2000;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 8px);
}
</style>
