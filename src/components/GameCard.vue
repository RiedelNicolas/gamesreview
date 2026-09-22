<template>
  <article class="game-card">
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
      <div 
        v-if="game.score > 0" 
        class="score-pill" 
        :style="{ backgroundColor: scoreColor, boxShadow: `0 4px 15px ${scoreColor}40` }"
      >
        {{ game.score }}
      </div>
      <div v-else class="score-pill unrated-pill">
        S/C
      </div>

      <!-- Platform badge overlay with platform-aware style -->
      <span class="platform-chip" :class="platformClass">
        <span class="platform-dot"></span>
        {{ game.platform }}
      </span>
    </div>

    <div class="card-content">
      <div class="card-genre">{{ game.genre }}</div>
      <h3 class="card-title" :title="game.title">{{ game.title }}</h3>

      <div class="card-meta">
        <div class="meta-item-badge" title="Horas jugadas">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span><strong class="highlight-val">{{ game.hoursToFinish }}</strong> hrs</span>
        </div>

        <div class="meta-item-badge" v-if="game.dateCompleted" title="Fecha">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>{{ formatDate(game.dateCompleted) }}</span>
        </div>
      </div>

      <div class="card-score-section">
        <template v-if="game.score > 0">
          <div class="score-header-row">
            <span class="score-row-label">Puntaje</span>
            <span class="score-row-val" :style="{ color: scoreColor }">{{ game.score }}/100</span>
          </div>
          <ScoreBar :score="game.score" :show-label="false" size="sm" />
        </template>
        <template v-else>
          <div class="score-header-row">
            <span class="score-row-label">Puntaje</span>
            <span class="score-row-val unrated-label">Sin calificar</span>
          </div>
          <div class="unrated-bar"></div>
        </template>
      </div>
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

const platformClass = computed(() => {
  const p = (props.game.platform || '').toLowerCase()
  if (p.includes('switch 2')) return 'plat-switch2'
  if (p.includes('switch')) return 'plat-switch'
  if (p.includes('pc')) return 'plat-pc'
  if (p.includes('ps5') || p.includes('playstation')) return 'plat-ps'
  if (p.includes('xbox')) return 'plat-xbox'
  return 'plat-default'
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    const parts = dateStr.split('-')
    if (parts.length >= 2) {
      const d = new Date(parts[0], parts[1] - 1, parts[2] ? parts[2] : 1)
      return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'short' })
    }
    return dateStr
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
  box-shadow: var(--shadow-card);
}

.game-card:hover {
  transform: translateY(-4px);
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
  transform: scale(1.04);
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
  font-size: 0.88rem;
  font-weight: 700;
  color: #0b0d13;
  padding: 3px 10px;
  border-radius: var(--radius-sm);
  letter-spacing: 0.02em;
  z-index: 2;
}

.unrated-pill {
  background: rgba(148, 163, 184, 0.2);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--text-secondary);
  font-size: 0.74rem;
  box-shadow: none;
}

.platform-chip {
  position: absolute;
  bottom: 10px;
  left: 12px;
  font-size: 0.72rem;
  font-weight: 700;
  background: rgba(10, 12, 16, 0.88);
  backdrop-filter: blur(6px);
  color: #e2e8f0;
  padding: 3px 9px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(255, 255, 255, 0.14);
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.platform-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #94a3b8;
}

.plat-switch2 {
  border-color: rgba(244, 63, 94, 0.4);
  color: #fda4af;
}
.plat-switch2 .platform-dot {
  background: #f43f5e;
  box-shadow: 0 0 8px #f43f5e;
}

.plat-switch {
  border-color: rgba(239, 68, 68, 0.35);
  color: #fca5a5;
}
.plat-switch .platform-dot {
  background: #ef4444;
}

.plat-pc {
  border-color: rgba(56, 189, 248, 0.35);
  color: #7dd3fc;
}
.plat-pc .platform-dot {
  background: #38bdf8;
}

.plat-ps {
  border-color: rgba(99, 102, 241, 0.35);
  color: #a5b4fc;
}
.plat-ps .platform-dot {
  background: #6366f1;
}

.plat-xbox {
  border-color: rgba(34, 197, 94, 0.35);
  color: #86efac;
}
.plat-xbox .platform-dot {
  background: #22c55e;
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
  margin-bottom: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.meta-item-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  background: rgba(255, 255, 255, 0.03);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.highlight-val {
  color: #fff;
  font-weight: 700;
}

.card-score-section {
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.score-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.score-row-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.score-row-val {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 700;
}

.unrated-label {
  color: var(--text-muted);
  font-size: 0.78rem;
  font-style: italic;
  font-weight: 500;
}

.unrated-bar {
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
}
</style>
