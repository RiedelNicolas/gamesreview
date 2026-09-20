<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="game" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-card" role="dialog" aria-modal="true" :aria-labelledby="'modal-title-' + game.id">
          <!-- Close button -->
          <button class="modal-close" @click="$emit('close')" aria-label="Close review modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div class="modal-body">
            <!-- Left: Cover & Highlights -->
            <div class="modal-sidebar">
              <div class="cover-wrapper">
                <img 
                  :src="game.coverUrl" 
                  :alt="game.title + ' Cover'" 
                  class="modal-cover"
                  loading="lazy"
                  @error="onImageError"
                />
                <div v-if="imageFailed" class="fallback-cover">
                  <span>🎮</span>
                </div>
              </div>

              <div class="modal-score-wrap">
                <ScoreBar :score="game.score" size="lg" />
              </div>

              <div class="meta-list">
                <div class="meta-item">
                  <span class="meta-icon">⏱</span>
                  <div class="meta-text">
                    <span class="meta-label">Time to Finish</span>
                    <span class="meta-val">{{ game.hoursToFinish }} hours</span>
                  </div>
                </div>

                <div class="meta-item" v-if="game.dateCompleted">
                  <span class="meta-icon">📅</span>
                  <div class="meta-text">
                    <span class="meta-label">Completed</span>
                    <span class="meta-val">{{ formatDate(game.dateCompleted) }}</span>
                  </div>
                </div>

                <div class="meta-item">
                  <span class="meta-icon">🕹</span>
                  <div class="meta-text">
                    <span class="meta-label">Platform</span>
                    <span class="meta-val">{{ game.platform }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Content & Analysis -->
            <div class="modal-main">
              <div class="tags-row">
                <span class="tag-badge platform-badge">{{ game.platform }}</span>
                <span class="tag-badge genre-badge">{{ game.genre }}</span>
              </div>

              <h2 :id="'modal-title-' + game.id" class="modal-title">{{ game.title }}</h2>

              <div class="section-divider"></div>

              <div class="analysis-section">
                <h3 class="analysis-heading">
                  <span class="heading-icon">✍️</span> Personal Analysis
                </h3>
                <div class="analysis-body">
                  <p v-for="(paragraph, idx) in formattedParagraphs" :key="idx">
                    {{ paragraph }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ScoreBar from './ScoreBar.vue'

const props = defineProps({
  game: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])
const imageFailed = ref(false)

function onImageError(e) {
  imageFailed.value = true
  e.target.style.display = 'none'
}

const formattedParagraphs = computed(() => {
  if (!props.game || !props.game.review) return []
  return props.game.review.split('\n\n').filter(p => p.trim())
})

function formatDate(dateStr) {
  if (!dateStr) return 'N/A'
  try {
    const parts = dateStr.split('-')
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2])
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    }
    return dateStr
  } catch {
    return dateStr
  }
}

function handleKeydown(e) {
  if (e.key === 'Escape' && props.game) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 6, 10, 0.82);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  max-width: 860px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.85);
  animation: modalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  transform: rotate(90deg);
}

.modal-body {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;
  padding: 32px;
}

@media (max-width: 720px) {
  .modal-body {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 24px;
  }
}

/* Sidebar */
.modal-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cover-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

.modal-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.fallback-cover {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  background: #192030;
}

.modal-score-wrap {
  background: rgba(255, 255, 255, 0.03);
  padding: 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.meta-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.meta-icon {
  font-size: 1.25rem;
}

.meta-text {
  display: flex;
  flex-direction: column;
}

.meta-label {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.meta-val {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* Main content */
.modal-main {
  display: flex;
  flex-direction: column;
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.tag-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  letter-spacing: 0.02em;
}

.platform-badge {
  background: rgba(56, 189, 248, 0.12);
  color: var(--accent-cyan);
  border: 1px solid rgba(56, 189, 248, 0.25);
}

.genre-badge {
  background: rgba(168, 85, 247, 0.12);
  color: var(--accent-purple);
  border: 1px solid rgba(168, 85, 247, 0.25);
}

.modal-title {
  font-size: 1.9rem;
  font-weight: 800;
  line-height: 1.2;
  color: #fff;
  letter-spacing: -0.02em;
}

.section-divider {
  height: 1px;
  background: var(--border-color);
  margin: 20px 0;
}

.analysis-heading {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.analysis-body p {
  color: #cbd5e1;
  font-size: 1rem;
  line-height: 1.75;
  margin-bottom: 16px;
}

/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
