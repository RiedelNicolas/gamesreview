<template>
  <div class="score-container" :class="sizeClass">
    <div class="score-header">
      <div class="score-badge" :style="{ backgroundColor: scoreColorBg, color: scoreColorText, borderColor: scoreColorBorder }">
        <span class="score-value">{{ score }}</span>
        <span class="score-max">/100</span>
      </div>
      <span v-if="showLabel" class="score-label" :style="{ color: scoreColorText }">
        {{ scoreLabel }}
      </span>
    </div>
    <div class="score-track">
      <div 
        class="score-fill" 
        :style="{ width: `${score}%`, backgroundColor: scoreColorText, boxShadow: `0 0 10px ${scoreColorText}66` }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  score: {
    type: Number,
    required: true,
    validator: (v) => v >= 0 && v <= 100
  },
  showLabel: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'md', // 'sm', 'md', 'lg'
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  }
})

const sizeClass = computed(() => `size-${props.size}`)

const scoreColorText = computed(() => {
  if (props.score >= 90) return '#10b981' // Green/Emerald
  if (props.score >= 75) return '#06b6d4' // Cyan/Blue
  if (props.score >= 50) return '#eab308' // Yellow
  if (props.score >= 25) return '#f97316' // Orange
  return '#ef4444'                        // Red
})

const scoreColorBg = computed(() => `${scoreColorText.value}18`)
const scoreColorBorder = computed(() => `${scoreColorText.value}40`)

const scoreLabel = computed(() => {
  if (props.score >= 90) return 'Masterpiece'
  if (props.score >= 75) return 'Great'
  if (props.score >= 50) return 'Decent'
  if (props.score >= 25) return 'Mediocre'
  return 'Flawed'
})
</script>

<style scoped>
.score-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.score-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.score-badge {
  display: inline-flex;
  align-items: baseline;
  gap: 2px;
  padding: 3px 10px;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-weight: 700;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.score-value {
  font-size: 1.15rem;
  line-height: 1;
}

.score-max {
  font-size: 0.72rem;
  opacity: 0.75;
}

.score-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.score-track {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
}

.score-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Sizes */
.size-sm .score-value { font-size: 0.95rem; }
.size-sm .score-track { height: 4px; }
.size-lg .score-value { font-size: 1.5rem; }
.size-lg .score-track { height: 8px; }
</style>
