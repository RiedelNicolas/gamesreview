<template>
  <div class="score-container" :class="sizeClass">
    <div class="score-header">
      <div class="score-badge" :style="{ backgroundColor: scoreColorBg, color: scoreColorText, borderColor: scoreColorBorder }">
        <span class="score-value">{{ score }}</span>
        <span class="score-max">/100</span>
      </div>
      <span v-if="showLabel" class="score-label" :style="{ color: scoreColorText }">
        {{ label }}
      </span>
    </div>
    <div class="score-track">
      <div 
        class="score-fill" 
        :style="{ width: `${score}%`, backgroundColor: scoreColorText, boxShadow: `0 0 10px color-mix(in srgb, ${scoreColorText} 40%, transparent)` }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { scoreColor, scoreLabel } from '../utils/score.js'

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

const scoreColorText = computed(() => scoreColor(props.score))

const scoreColorBg = computed(() => `color-mix(in srgb, ${scoreColorText.value} 9%, transparent)`)
const scoreColorBorder = computed(() => `color-mix(in srgb, ${scoreColorText.value} 25%, transparent)`)

const label = computed(() => scoreLabel(props.score))
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
