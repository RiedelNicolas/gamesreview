<template>
  <article class="game-card" :title="hoverInfo">
    <div class="cover">
      <img
        v-if="!imageFailed"
        :src="game.coverUrl"
        :alt="game.title + ' cover'"
        loading="lazy"
        @error="imageFailed = true"
      />
      <span v-else class="cover-fallback">{{ game.title }}</span>
    </div>

    <div class="card-head">
      <h3 class="card-title">{{ game.title }}</h3>
      <span v-if="isRated(game.score)" class="card-score" :style="{ color: scoreColor(game.score) }">
        {{ game.score }}
      </span>
      <span v-else class="card-unrated">{{ UNRATED_LABEL }}</span>
    </div>
    <p class="card-meta">{{ formatNumber(game.hoursToFinish) }} h · {{ game.platform }}</p>
  </article>
</template>

<script setup>
import { ref, computed } from 'vue'
import { isRated, scoreColor, UNRATED_LABEL } from '../utils/score.js'
import { formatDate, formatNumber } from '../utils/format.js'

const props = defineProps({
  game: {
    type: Object,
    required: true
  }
})

const imageFailed = ref(false)

const hoverInfo = computed(() =>
  [props.game.genre, formatDate(props.game.dateCompleted)].filter(Boolean).join(' · ')
)
</script>

<style scoped>
.cover {
  aspect-ratio: 3 / 4;
  background: var(--rule);
  overflow: hidden;
}

.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 0.2s ease;
}

.game-card:hover .cover img {
  opacity: 0.88;
}

.cover-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: var(--space-4);
  text-align: center;
  font-family: var(--font-display);
  font-size: var(--text-lg);
  color: var(--ink-soft);
}

.card-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
  margin-top: var(--space-3);
}

.card-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.005em;
}

.card-score {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  line-height: 1;
  font-variant-numeric: lining-nums;
}

.card-unrated {
  font-family: var(--font-display);
  font-style: italic;
  font-size: var(--text-sm);
  color: var(--ink-muted);
  white-space: nowrap;
}

.card-meta {
  margin-top: var(--space-1);
  font-size: var(--text-sm);
  color: var(--ink-soft);
}

@media (max-width: 640px) {
  .card-title {
    font-size: var(--text-base);
  }

  .card-score {
    font-size: var(--text-lg);
  }

  .card-meta {
    font-size: var(--text-xs);
  }
}
</style>
