<template>
  <div v-if="games.length === 0" class="empty-state">
    <h3>No games found</h3>
    <p>Try a different search or platform.</p>
  </div>

  <div v-else class="games-grid">
    <GameCard
      v-for="game in games"
      :key="game.id"
      :game="game"
    />
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
</script>

<style scoped>
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--space-7) var(--space-6);
}

@media (max-width: 640px) {
  .games-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-6) var(--space-4);
  }
}

.empty-state {
  padding: var(--space-9) 0;
  text-align: center;
}

.empty-state h3 {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 500;
}

.empty-state p {
  margin-top: var(--space-2);
  font-size: var(--text-sm);
  color: var(--ink-soft);
}
</style>
