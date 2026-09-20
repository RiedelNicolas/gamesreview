<template>
  <article class="game-card" @click="$emit('select', game)">
    <div class="card-cover-container">
      <img 
        :src="game.coverUrl" 
        :alt="game.title + ' Cover'" 
        class="card-cover" 
        loading="lazy"
        @error="onImageError"
      />
      <div v-if="imageFailed" class="fallback-cover">
        <span>🎮</span>
      </div>

      <!-- Quick score pill overlay -->
      <div class="score-pill" :style="{ backgroundColor: scoreColor, boxShadow: `0 4px 15px ${scoreColor}40` }">
        {{ game.score }}
      </div>

      <!-- Platform badge overlay -->
      <span class="platform-chip">{{ game.platform }}</span>
    </div>

    <div class="card-content">
      <div class="card-genre">{{ game.genre }}</div>
      <h3 class="card-title" :title="game.title">{{ game.title }}</h3>

      <div class="card-meta">
        <span class="meta-badge" title="Time to Finish">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          {{ game.hoursToFinish }}h
        </span>

        <span class="meta-badge" v-if="game.dateCompleted" title="Completion Date">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          {{ formatDate(game.dateCompleted) }}
        </span>
      </div>

      <div class="card-score-bar">
        <ScoreBar :score="game.score" :show-label="false" size="sm" />
      </div>

      <p class="card-excerpt">
        {{ excerpt }}
      </p>

      <button class="read-more-btn" @click.stop="$emit('select', game)">
        Read Analysis
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
    </div>
  </article>
</template>

<script setup>
import { ref, computed } from 'vue'
import ScoreBar from './ScoreBar.vue'

const props = defineProps({
  game: {
    type: Object,
    required: true
  }
})

defineEmits(['select'])

const imageFailed = ref(false)

function onImageError(e) {
  imageFailed.value = true
  e.target.style.display = 'none'
}

const scoreColor = computed(() => {
  if (props.game.score >= 90) return '#10b981'
  if (props.game.score >= 75) return '#06b6d4'
  if (props.game.score >= 50) return '#eab308'
  if (props.game.score >= 25) return '#f97316'
  return '#ef4444'
})

const excerpt = computed(() => {
  if (!props.game.review) return ''
  const trimmed = props.game.review.trim()
  if (trimmed.length <= 110) return trimmed
  return trimmed.substring(0, 110) + '...'
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    const [year, month] = dateStr.split('-')
    const d = new Date(year, month - 1)
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' })
  } catch {
    return dateStr
  }
}
</script>

<style scoped>
.game-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  box-shadow: var(--shadow-card);
}

.game-card:hover {
  transform: translateY(-5px);
  border-color: var(--border-hover);
  box-shadow: var(--shadow-hover);
  background: var(--bg-card-hover);
}

.card-cover-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: #11141d;
}

.card-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  transition: transform 0.4s ease;
}

.game-card:hover .card-cover {
  transform: scale(1.05);
}

.fallback-cover {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  background: #161b26;
}

.score-pill {
  position: absolute;
  top: 12px;
  right: 12px;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 700;
  color: #0b0d13;
  padding: 3px 9px;
  border-radius: var(--radius-sm);
  letter-spacing: 0.02em;
  z-index: 2;
}

.platform-chip {
  position: absolute;
  bottom: 10px;
  left: 12px;
  font-size: 0.72rem;
  font-weight: 600;
  background: rgba(10, 12, 16, 0.85);
  backdrop-filter: blur(4px);
  color: #e2e8f0;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.12);
  z-index: 2;
}

.card-content {
  padding: 16px 18px 18px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-genre {
  font-size: 0.73rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 600;
  color: var(--accent-cyan);
  margin-bottom: 4px;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.3;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.meta-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-family: var(--font-mono);
}

.card-score-bar {
  margin-bottom: 12px;
}

.card-excerpt {
  font-size: 0.86rem;
  color: #94a3b8;
  line-height: 1.5;
  margin-bottom: 16px;
  flex-grow: 1;
}

.read-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--accent-cyan);
  font-size: 0.84rem;
  font-weight: 600;
  padding: 6px 0;
  transition: all 0.2s ease;
  align-self: flex-start;
}

.read-more-btn svg {
  transition: transform 0.2s ease;
}

.game-card:hover .read-more-btn {
  color: #7dd3fc;
}

.game-card:hover .read-more-btn svg {
  transform: translateX(4px);
}
</style>
