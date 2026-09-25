<template>
  <header class="masthead">
    <div class="masthead-top">
      <span class="byline">Nicolás Riedel</span>
      <button class="add-btn" @click="$emit('open-add')">+ Add game</button>
    </div>
    <h1 class="title">Game Tracker</h1>
    <p v-if="games.length" class="stats">
      {{ games.length }} {{ games.length === 1 ? 'game' : 'games' }} · {{ formatNumber(totalHours) }} h<template v-if="avgScore !== null"> · avg {{ avgScore }}</template>
    </p>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { formatNumber } from '../utils/format.js'
import { isRated } from '../utils/score.js'

const props = defineProps({
  games: {
    type: Array,
    default: () => []
  }
})

defineEmits(['open-add'])

const totalHours = computed(() =>
  props.games.reduce((acc, g) => acc + (Number(g.hoursToFinish) || 0), 0)
)

// null when nothing is rated yet
const avgScore = computed(() => {
  const rated = props.games.filter(g => isRated(g.score))
  if (!rated.length) return null
  const total = rated.reduce((acc, g) => acc + Number(g.score), 0)
  return Math.round(total / rated.length)
})
</script>

<style scoped>
.masthead {
  padding: var(--space-6) 0 var(--space-5);
  border-bottom: 3px double var(--ink);
}

.masthead-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-4);
  font-size: var(--text-sm);
  color: var(--ink-soft);
}

.add-btn {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--ink);
  border-bottom: 1px solid var(--ink);
  padding-bottom: 1px;
}

.add-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
}

.title {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: 600;
  font-variation-settings: 'opsz' 144;
  line-height: 1;
  letter-spacing: -0.02em;
  margin-top: var(--space-4);
}

.stats {
  margin-top: var(--space-3);
  font-size: var(--text-sm);
  color: var(--ink-soft);
}
</style>
