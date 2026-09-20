<template>
  <div class="grid-container">
    <div v-if="games.length === 0" class="empty-state">
      <span class="empty-icon">🎮</span>
      <h3>No games found</h3>
      <p>Try adjusting your search query or add new games to <code>public/games.json</code>.</p>
    </div>

    <div v-else class="games-grid">
      <GameCard 
        v-for="game in games" 
        :key="game.id" 
        :game="game"
        @select="$emit('select-game', game)"
      />
    </div>
  </div>
</template>

<script setup>
import GameCard from './GameCard.vue'

defineProps({
  games: {
    type: Array,
    required: true
  }
})

defineEmits(['select-game'])
</script>

<style scoped>
.grid-container {
  width: 100%;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 24px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: var(--bg-card);
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-lg);
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}

.empty-state h3 {
  font-size: 1.25rem;
  color: #fff;
  margin-bottom: 6px;
}

.empty-state p {
  color: var(--text-secondary);
  font-size: 0.92rem;
  max-width: 440px;
}

.empty-state code {
  font-family: var(--font-mono);
  background: rgba(255, 255, 255, 0.08);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--accent-cyan);
}
</style>
